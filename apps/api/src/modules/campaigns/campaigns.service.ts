import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { AutopilotRule } from './entities/autopilot-rule.entity';
import { CreateAutopilotRuleDto, UpdateAutopilotRuleDto } from './dto/autopilot.dto';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);
  private readonly aiServiceUrl: string;

  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(AutopilotRule)
    private readonly autopilotRuleRepository: Repository<AutopilotRule>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL', 'http://localhost:8000');
  }

  async findAll(tenantId: string, filters: { type?: string; status?: string; page?: number; limit?: number }) {
    const { type, status, page = 1, limit = 20 } = filters;
    const where: any = { tenantId };
    if (type) where.type = type;
    if (status) where.status = status;

    const [data, total] = await this.campaignRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: string, tenantId: string) {
    const campaign = await this.campaignRepository.findOne({ where: { id, tenantId } });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: CreateCampaignDto, tenantId: string) {
    const campaign = this.campaignRepository.create({ ...dto, tenantId });
    return this.campaignRepository.save(campaign);
  }

  async update(id: string, dto: UpdateCampaignDto, tenantId: string) {
    const campaign = await this.findOne(id, tenantId);
    Object.assign(campaign, dto);
    return this.campaignRepository.save(campaign);
  }

  async remove(id: string, tenantId: string) {
    const campaign = await this.findOne(id, tenantId);
    await this.campaignRepository.remove(campaign);
  }

  async aiOptimize(
    campaigns: { id: string; name: string; spend: number; leads: number; conversions: number }[],
    tenantId: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post<{ result: any }>(
          `${this.aiServiceUrl}/agents/run`,
          {
            task_type: 'optimize_budget',
            lead_id: '',
            tenant_id: tenantId,
            input_data: { campaigns },
          },
          { timeout: 30000 },
        ),
      );
      const result = response.data?.result ?? {};
      return {
        recommendations: result.recommendations ?? [],
        totalBudget: result.totalBudget ?? 0,
        projectedImprovement: result.projectedImprovement ?? 0,
      };
    } catch (err) {
      this.logger.warn('AI budget optimizer unavailable, using fallback: %s', (err as Error).message);
      const totalBudget = campaigns.reduce((s, c) => s + (c.spend || 0), 0);
      return {
        recommendations: campaigns.map((c) => ({
          campaignId: c.id,
          campaignName: c.name,
          currentSpend: c.spend,
          suggestedSpend: c.spend,
          rationale: 'AI optimization unavailable. Maintaining current budget.',
        })),
        totalBudget,
        projectedImprovement: 0,
      };
    }
  }

  async createRule(tenantId: string, dto: CreateAutopilotRuleDto): Promise<AutopilotRule> {
    const rule = this.autopilotRuleRepository.create({ ...dto, tenantId });
    return this.autopilotRuleRepository.save(rule);
  }

  async listRules(tenantId: string): Promise<AutopilotRule[]> {
    return this.autopilotRuleRepository.find({ where: { tenantId } });
  }

  async updateRule(tenantId: string, id: string, dto: UpdateAutopilotRuleDto): Promise<AutopilotRule> {
    const rule = await this.autopilotRuleRepository.findOne({ where: { id, tenantId } });
    if (!rule) throw new NotFoundException('Autopilot rule not found');
    Object.assign(rule, dto);
    return this.autopilotRuleRepository.save(rule);
  }

  async deleteRule(tenantId: string, id: string): Promise<void> {
    const rule = await this.autopilotRuleRepository.findOne({ where: { id, tenantId } });
    if (!rule) throw new NotFoundException('Autopilot rule not found');
    await this.autopilotRuleRepository.remove(rule);
  }

  async toggleRule(tenantId: string, id: string): Promise<AutopilotRule> {
    const rule = await this.autopilotRuleRepository.findOne({ where: { id, tenantId } });
    if (!rule) throw new NotFoundException('Autopilot rule not found');
    rule.isActive = !rule.isActive;
    return this.autopilotRuleRepository.save(rule);
  }
}
