import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lead, LeadStatus } from '../leads/entities/lead.entity';
import { Deal } from '../pipelines/entities/deal.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async getDashboardStats(tenantId: string) {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const [totalLeads, lastMonthLeads] = await Promise.all([
      this.leadRepository.count({ where: { tenantId } }),
      this.leadRepository.count({
        where: { tenantId, createdAt: Between(lastMonthStart, lastMonthEnd) as any },
      }),
    ]);

    const [qualifiedLeads, lastMonthQualified] = await Promise.all([
      this.leadRepository.count({ where: { tenantId, status: LeadStatus.QUALIFIED } }),
      this.leadRepository.count({
        where: { tenantId, status: LeadStatus.QUALIFIED, createdAt: Between(lastMonthStart, lastMonthEnd) as any },
      }),
    ]);

    const [convertedLeads, totalLeadsThisMonth] = await Promise.all([
      this.leadRepository.count({ where: { tenantId, status: LeadStatus.CONVERTED } }),
      this.leadRepository.count({
        where: { tenantId, createdAt: Between(thisMonthStart, now) as any },
      }),
    ]);

    const deals = await this.dealRepository.find({ where: { tenantId } });
    const pipelineValue = deals.reduce((sum, d) => sum + Number(d.value), 0);

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    return {
      totalLeads,
      totalLeadsChange: lastMonthLeads > 0 ? ((totalLeadsThisMonth - lastMonthLeads) / lastMonthLeads) * 100 : 0,
      qualifiedLeads,
      qualifiedLeadsChange: lastMonthQualified > 0 ? ((qualifiedLeads - lastMonthQualified) / lastMonthQualified) * 100 : 0,
      conversionRate: Math.round(conversionRate * 10) / 10,
      conversionRateChange: 0,
      pipelineValue,
      pipelineValueChange: 0,
    };
  }

  async getLeadAnalytics(tenantId: string, from?: string, to?: string) {
    const where: any = { tenantId };
    if (from && to) {
      where.createdAt = Between(new Date(from), new Date(to)) as any;
    }

    const leads = await this.leadRepository.find({ where, order: { createdAt: 'ASC' } });

    const dateMap = new Map<string, number>();
    const sourceMap = new Map<string, number>();

    for (const lead of leads) {
      const date = lead.createdAt.toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
      sourceMap.set(lead.source, (sourceMap.get(lead.source) || 0) + 1);
    }

    return {
      leadsOverTime: Array.from(dateMap.entries()).map(([date, count]) => ({ date, count })),
      leadsBySource: Array.from(sourceMap.entries()).map(([source, count]) => ({ source, count })),
    };
  }

  async getCampaignAnalytics(tenantId: string) {
    const campaigns = await this.campaignRepository.find({ where: { tenantId } });
    return campaigns.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      status: c.status,
      budget: Number(c.budget) || 0,
      spent: Number(c.spent) || 0,
      roi: c.budget && c.spent && Number(c.spent) > 0
        ? ((Number(c.budget) - Number(c.spent)) / Number(c.spent)) * 100
        : 0,
    }));
  }
}
