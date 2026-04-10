import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFilterDto } from './dto/lead-filter.dto';
import { ActivityService } from '../activity/activity.service';
import { ActivityAction, ActivityEntityType } from '../activity/entities/activity-log.entity';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    private readonly httpService: HttpService,
    private readonly activityService: ActivityService,
  ) {}

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
          { timeout: 5000 },
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
