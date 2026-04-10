import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository, Like } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parse } from 'csv-parse/sync';
import { Lead, LeadSource, LeadStatus } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFilterDto } from './dto/lead-filter.dto';
import { ActivityService } from '../activity/activity.service';
import { ActivityAction, ActivityEntityType } from '../activity/entities/activity-log.entity';
import { User, UserRole } from '../auth/entities/user.entity';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  private readonly aiServiceUrl: string;
  /** Timeout (ms) for calls to the AI scoring service — configurable via AI_SCORING_TIMEOUT_MS */
  private readonly aiScoringTimeoutMs: number;

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly httpService: HttpService,
    private readonly activityService: ActivityService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
    this.aiScoringTimeoutMs = this.configService.get<number>('AI_SCORING_TIMEOUT_MS', 5000);
  }

  async findAll(tenantId: string, filters: LeadFilterDto) {
    const { status, source, search, page = 1, limit = 20 } = filters;
    const where: any = { tenantId };

    if (status) where.status = status;
    if (source) where.source = source;

    const [data, total] = await this.leadRepository.findAndCount({
      where: search
        ? [
            { ...where, firstName: Like(`%${search}%`) },
            { ...where, lastName: Like(`%${search}%`) },
            { ...where, email: Like(`%${search}%`) },
            { ...where, company: Like(`%${search}%`) },
          ]
        : where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const lead = await this.leadRepository.findOne({ where: { id, tenantId } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async create(dto: CreateLeadDto, tenantId: string) {
    const lead = this.leadRepository.create({ ...dto, tenantId });
    const saved = await this.leadRepository.save(lead);
    await this.triggerScoring(saved.id, saved, tenantId);
    await this.activityService.log({
      entityType: ActivityEntityType.LEAD,
      entityId: saved.id,
      action: ActivityAction.CREATED,
      tenantId,
      description: 'Lead created',
    });
    return saved;
  }

  async update(id: string, dto: UpdateLeadDto, tenantId: string) {
    const lead = await this.findOne(id, tenantId);
    Object.assign(lead, dto);
    const saved = await this.leadRepository.save(lead);
    await this.triggerScoring(saved.id, saved, tenantId);
    await this.activityService.log({
      entityType: ActivityEntityType.LEAD,
      entityId: saved.id,
      action: ActivityAction.UPDATED,
      tenantId,
      description: 'Lead updated',
    });
    return saved;
  }

  async remove(id: string, tenantId: string) {
    const lead = await this.findOne(id, tenantId);
    await this.leadRepository.remove(lead);
    await this.activityService.log({
      entityType: ActivityEntityType.LEAD,
      entityId: id,
      action: ActivityAction.DELETED,
      tenantId,
      description: 'Lead deleted',
    });
  }

  async assign(id: string, assignedTo: string, tenantId: string): Promise<Lead> {
    const lead = await this.findOne(id, tenantId);
    lead.assignedTo = assignedTo;
    const saved = await this.leadRepository.save(lead);
    await this.activityService.log({
      entityType: ActivityEntityType.LEAD,
      entityId: saved.id,
      action: ActivityAction.ASSIGNED,
      tenantId,
      metadata: { assignedTo },
      description: 'Lead assigned',
    });
    return saved;
  }

  async autoAssign(id: string, tenantId: string): Promise<Lead> {
    const agents = await this.userRepository.find({
      where: { tenantId, role: UserRole.AGENT, isActive: true },
    });

    if (agents.length === 0) {
      throw new BadRequestException('No active agents available');
    }

    // Fetch active lead counts per agent in a single query
    const countRows: { assignedTo: string; count: string }[] = await this.leadRepository
      .createQueryBuilder('lead')
      .select('lead.assignedTo', 'assignedTo')
      .addSelect('COUNT(lead.id)', 'count')
      .where('lead.tenantId = :tenantId', { tenantId })
      .andWhere('lead.status NOT IN (:...statuses)', {
        statuses: [LeadStatus.CONVERTED, LeadStatus.LOST],
      })
      .andWhere('lead.assignedTo IN (:...agentIds)', {
        agentIds: agents.map((a) => a.id),
      })
      .groupBy('lead.assignedTo')
      .getRawMany();

    const countMap = new Map<string, number>(
      countRows.map((r) => [r.assignedTo, parseInt(r.count, 10)]),
    );

    const pickedAgent = agents.reduce((min, agent) => {
      const minCount = countMap.get(min.id) ?? 0;
      const agentCount = countMap.get(agent.id) ?? 0;
      return agentCount < minCount ? agent : min;
    });

    return this.assign(id, pickedAgent.id, tenantId);
  }

  async bulkImport(
    fileBuffer: Buffer,
    tenantId: string,
  ): Promise<{ imported: number; failed: number; errors: string[] }> {
    const rows: Record<string, string>[] = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
    });

    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    const validSources = Object.values(LeadSource) as string[];
    const validStatuses = Object.values(LeadStatus) as string[];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      /** CSV row 1 is the header, so data rows start at row 2 */
      const CSV_HEADER_OFFSET = 2;
      const rowNum = i + CSV_HEADER_OFFSET;

      if (!row.firstName || !row.firstName.trim()) {
        errors.push(`Row ${rowNum}: firstName is required`);
        failed++;
        continue;
      }
      if (!row.lastName || !row.lastName.trim()) {
        errors.push(`Row ${rowNum}: lastName is required`);
        failed++;
        continue;
      }

      const source = validSources.includes(row.source)
        ? (row.source as LeadSource)
        : LeadSource.OTHER;

      const status = validStatuses.includes(row.status)
        ? (row.status as LeadStatus)
        : LeadStatus.NEW;

      const tags = row.tags
        ? row.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      try {
        const lead = this.leadRepository.create({
          firstName: row.firstName.trim(),
          lastName: row.lastName.trim(),
          email: row.email?.trim() || undefined,
          phone: row.phone?.trim() || undefined,
          company: row.company?.trim() || undefined,
          notes: row.notes?.trim() || undefined,
          source,
          status,
          tags,
          tenantId,
        });

        const saved = await this.leadRepository.save(lead);
        await this.triggerScoring(saved.id, saved, tenantId);
        imported++;
      } catch (err) {
        errors.push(`Row ${rowNum}: ${(err as Error).message}`);
        failed++;
      }
    }

    return { imported, failed, errors };
  }

  async triggerScoring(leadId: string, lead: Lead, tenantId: string): Promise<void> {
    /**
     * Fire-and-forget call to the AI scoring service.
     * Scoring failures are logged as warnings but do NOT propagate to the caller —
     * the lead create/update operation must succeed regardless of AI availability.
     */
    try {
      const payload = {
        lead: {
          id: lead.id,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email ?? null,
          phone: lead.phone ?? null,
          company: lead.company ?? null,
          source: lead.source,
          status: lead.status,
          notes: lead.notes ?? null,
          tags: lead.tags ?? [],
        },
        tenant_id: tenantId,
      };

      const response = await firstValueFrom(
        this.httpService.post<{ score: number }>(
          `${this.aiServiceUrl}/api/v1/scoring/score`,
          payload,
          { timeout: this.aiScoringTimeoutMs },
        ),
      );

      const score = response.data?.score;
      if (typeof score === 'number') {
        await this.leadRepository.update(leadId, { score });
      }
    } catch (error) {
      this.logger.warn(
        `AI scoring failed for lead ${leadId}: ${(error as Error).message}`,
      );
    }
  }
}
