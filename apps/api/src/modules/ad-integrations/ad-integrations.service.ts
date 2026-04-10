import { Injectable, NotFoundException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AdCampaign, AdPlatform, AdCampaignStatus } from './entities/ad-campaign.entity';
import {
  ConnectAdPlatformDto,
  SyncCampaignsDto,
  LeadSyncConfigDto,
  UpdateBudgetDto,
} from './dto/ad-integrations.dto';

@Injectable()
export class AdIntegrationsService {
  private readonly logger = new Logger(AdIntegrationsService.name);

  // In-memory token store per tenant+platform (persisted via integrations table in prod)
  private readonly tokenStore = new Map<string, { accessToken: string; refreshToken?: string; accountId?: string }>();

  constructor(
    @InjectRepository(AdCampaign)
    private readonly campaignRepo: Repository<AdCampaign>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Connection ──────────────────────────────────────────────────────────────

  async connect(tenantId: string, platform: AdPlatform, dto: ConnectAdPlatformDto) {
    this.tokenStore.set(`${tenantId}:${platform}`, {
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      accountId: dto.accountId,
    });
    this.logger.log(`Connected ${platform} for tenant ${tenantId}`);
    return { platform, connected: true, accountId: dto.accountId };
  }

  async disconnect(tenantId: string, platform: AdPlatform) {
    this.tokenStore.delete(`${tenantId}:${platform}`);
    await this.campaignRepo.delete({ tenantId, platform });
    return { platform, connected: false };
  }

  async getConnectionStatus(tenantId: string) {
    return {
      google_ads: this.tokenStore.has(`${tenantId}:${AdPlatform.GOOGLE_ADS}`),
      facebook_ads: this.tokenStore.has(`${tenantId}:${AdPlatform.FACEBOOK_ADS}`),
    };
  }

  // ─── Campaign Sync ────────────────────────────────────────────────────────────

  async syncCampaigns(tenantId: string, platform: AdPlatform, dto: SyncCampaignsDto) {
    const creds = this.getCredentials(tenantId, platform);

    let campaigns: any[];
    if (platform === AdPlatform.GOOGLE_ADS) {
      campaigns = await this.fetchGoogleCampaigns(creds.accessToken, creds.accountId, dto.since);
    } else {
      campaigns = await this.fetchFacebookCampaigns(creds.accessToken, creds.accountId, dto.since);
    }

    const saved: AdCampaign[] = [];
    for (const raw of campaigns) {
      const existing = await this.campaignRepo.findOne({
        where: { tenantId, platform, externalId: raw.id },
      });

      const entity = existing ?? this.campaignRepo.create({ tenantId, platform, externalId: raw.id });
      entity.name = raw.name;
      entity.status = this.mapStatus(raw.status);
      entity.dailyBudget = raw.dailyBudget;
      entity.totalSpend = raw.totalSpend ?? 0;
      entity.impressions = raw.impressions ?? 0;
      entity.clicks = raw.clicks ?? 0;
      entity.conversions = raw.conversions ?? 0;
      entity.ctr = raw.clicks && raw.impressions ? (raw.clicks / raw.impressions) * 100 : 0;
      entity.costPerLead = raw.conversions && raw.totalSpend ? raw.totalSpend / raw.conversions : null;
      entity.metadata = raw.metadata ?? {};
      entity.lastSyncAt = new Date();

      saved.push(await this.campaignRepo.save(entity));
    }

    this.logger.log(`Synced ${saved.length} ${platform} campaigns for tenant ${tenantId}`);
    return { synced: saved.length, campaigns: saved };
  }

  async listCampaigns(tenantId: string, platform?: AdPlatform): Promise<AdCampaign[]> {
    const where: any = { tenantId };
    if (platform) where.platform = platform;
    return this.campaignRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async getCampaignPerformance(tenantId: string) {
    const campaigns = await this.campaignRepo.find({ where: { tenantId } });

    const byPlatform = campaigns.reduce((acc, c) => {
      if (!acc[c.platform]) acc[c.platform] = { totalSpend: 0, totalLeads: 0, totalClicks: 0, totalImpressions: 0 };
      acc[c.platform].totalSpend += Number(c.totalSpend ?? 0);
      acc[c.platform].totalLeads += c.conversions;
      acc[c.platform].totalClicks += c.clicks;
      acc[c.platform].totalImpressions += c.impressions;
      return acc;
    }, {} as Record<string, any>);

    for (const platform of Object.keys(byPlatform)) {
      const p = byPlatform[platform];
      p.avgCostPerLead = p.totalLeads ? p.totalSpend / p.totalLeads : null;
      p.overallCTR = p.totalImpressions ? (p.totalClicks / p.totalImpressions) * 100 : 0;
    }

    return { campaigns, byPlatform };
  }

  // ─── Lead Sync (Facebook Lead Ads / Google Ads Lead Form) ─────────────────

  async syncLeads(tenantId: string, platform: AdPlatform, config: LeadSyncConfigDto): Promise<any> {
    const creds = this.getCredentials(tenantId, platform);

    let rawLeads: any[];
    if (platform === AdPlatform.FACEBOOK_ADS) {
      rawLeads = await this.fetchFacebookLeads(creds.accessToken, config.formId);
    } else {
      rawLeads = await this.fetchGoogleLeads(creds.accessToken, creds.accountId, config.formId);
    }

    // Map to LeadAI lead format
    const leads = rawLeads.map((rl) => ({
      firstName: rl.full_name?.split(' ')[0] ?? rl.name ?? 'Unknown',
      lastName: rl.full_name?.split(' ').slice(1).join(' ') ?? '',
      email: rl.email,
      phone: rl.phone_number ?? rl.phone,
      company: rl.company_name,
      source: platform === AdPlatform.FACEBOOK_ADS ? 'social_media' : 'advertisement',
      tags: [`${platform}_lead`, config.formId],
      pipelineId: config.defaultPipelineId,
    }));

    this.logger.log(`Fetched ${leads.length} leads from ${platform} form ${config.formId}`);
    return { platform, formId: config.formId, leads, count: leads.length };
  }

  // ─── Budget Optimization ─────────────────────────────────────────────────────

  async updateBudget(tenantId: string, dto: UpdateBudgetDto): Promise<any> {
    const creds = this.getCredentials(tenantId, dto.platform);

    if (dto.platform === AdPlatform.GOOGLE_ADS) {
      await this.updateGoogleBudget(creds.accessToken, creds.accountId, dto.campaignId, dto.dailyBudget);
    } else {
      await this.updateFacebookBudget(creds.accessToken, dto.campaignId, dto.dailyBudget);
    }

    await this.campaignRepo.update(
      { tenantId, platform: dto.platform, externalId: dto.campaignId },
      { dailyBudget: dto.dailyBudget },
    );

    return { campaignId: dto.campaignId, platform: dto.platform, dailyBudget: dto.dailyBudget };
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private getCredentials(tenantId: string, platform: AdPlatform) {
    const creds = this.tokenStore.get(`${tenantId}:${platform}`);
    if (!creds) throw new UnauthorizedException(`${platform} not connected for this tenant`);
    return creds;
  }

  private mapStatus(raw: string): AdCampaignStatus {
    const map: Record<string, AdCampaignStatus> = {
      ENABLED: AdCampaignStatus.ACTIVE,
      ACTIVE: AdCampaignStatus.ACTIVE,
      PAUSED: AdCampaignStatus.PAUSED,
      REMOVED: AdCampaignStatus.ENDED,
      ENDED: AdCampaignStatus.ENDED,
      DRAFT: AdCampaignStatus.DRAFT,
    };
    return map[raw?.toUpperCase()] ?? AdCampaignStatus.DRAFT;
  }

  // ─── Google Ads API calls ─────────────────────────────────────────────────────

  private async fetchGoogleCampaigns(accessToken: string, customerId: string, since?: string): Promise<any[]> {
    const url = `https://googleads.googleapis.com/v16/customers/${customerId}/googleAds:search`;
    const sinceClause = since ? `AND campaign.start_date >= '${since}'` : '';
    const query = `
      SELECT campaign.id, campaign.name, campaign.status,
             campaign_budget.amount_micros,
             metrics.cost_micros, metrics.impressions, metrics.clicks, metrics.conversions
      FROM campaign
      WHERE campaign.status != 'REMOVED' ${sinceClause}
    `;
    try {
      const res = await firstValueFrom(
        this.httpService.post(url, { query }, {
          headers: { Authorization: `Bearer ${accessToken}`, 'developer-token': this.configService.get('GOOGLE_ADS_DEVELOPER_TOKEN', '') },
        }),
      );
      return (res.data.results ?? []).map((r: any) => ({
        id: r.campaign.id,
        name: r.campaign.name,
        status: r.campaign.status,
        dailyBudget: (r.campaignBudget?.amountMicros ?? 0) / 1_000_000,
        totalSpend: (r.metrics?.costMicros ?? 0) / 1_000_000,
        impressions: r.metrics?.impressions ?? 0,
        clicks: r.metrics?.clicks ?? 0,
        conversions: r.metrics?.conversions ?? 0,
      }));
    } catch (err) {
      this.logger.error(`Google Ads campaign fetch failed: ${err.message}`);
      return [];
    }
  }

  private async fetchGoogleLeads(accessToken: string, customerId: string, formId: string): Promise<any[]> {
    const url = `https://googleads.googleapis.com/v16/customers/${customerId}/leadFormSubmissions`;
    try {
      const res = await firstValueFrom(
        this.httpService.get(url, {
          params: { lead_form_asset: formId },
          headers: { Authorization: `Bearer ${accessToken}`, 'developer-token': this.configService.get('GOOGLE_ADS_DEVELOPER_TOKEN', '') },
        }),
      );
      return res.data.leadFormSubmissions ?? [];
    } catch (err) {
      this.logger.error(`Google lead form fetch failed: ${err.message}`);
      return [];
    }
  }

  private async updateGoogleBudget(accessToken: string, customerId: string, campaignId: string, dailyBudget: number): Promise<void> {
    const url = `https://googleads.googleapis.com/v16/customers/${customerId}/campaignBudgets:mutate`;
    await firstValueFrom(
      this.httpService.post(url,
        { operations: [{ update: { amountMicros: dailyBudget * 1_000_000 }, updateMask: 'amountMicros' }] },
        { headers: { Authorization: `Bearer ${accessToken}`, 'developer-token': this.configService.get('GOOGLE_ADS_DEVELOPER_TOKEN', '') } },
      ),
    ).catch((err) => this.logger.error(`Google budget update failed: ${err.message}`));
  }

  // ─── Facebook Ads API calls ───────────────────────────────────────────────────

  private async fetchFacebookCampaigns(accessToken: string, adAccountId: string, since?: string): Promise<any[]> {
    const url = `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns`;
    const params: any = {
      access_token: accessToken,
      fields: 'id,name,status,daily_budget,insights{spend,impressions,clicks,actions}',
      limit: 100,
    };
    if (since) params.time_range = JSON.stringify({ since, until: new Date().toISOString().split('T')[0] });

    try {
      const res = await firstValueFrom(this.httpService.get(url, { params }));
      return (res.data.data ?? []).map((c: any) => {
        const insight = c.insights?.data?.[0] ?? {};
        const conversions = (insight.actions ?? []).find((a: any) => a.action_type === 'lead')?.value ?? 0;
        return {
          id: c.id,
          name: c.name,
          status: c.status,
          dailyBudget: (c.daily_budget ?? 0) / 100,
          totalSpend: parseFloat(insight.spend ?? '0'),
          impressions: parseInt(insight.impressions ?? '0', 10),
          clicks: parseInt(insight.clicks ?? '0', 10),
          conversions: parseInt(conversions, 10),
        };
      });
    } catch (err) {
      this.logger.error(`Facebook campaign fetch failed: ${err.message}`);
      return [];
    }
  }

  private async fetchFacebookLeads(accessToken: string, formId: string): Promise<any[]> {
    const url = `https://graph.facebook.com/v19.0/${formId}/leads`;
    try {
      const res = await firstValueFrom(
        this.httpService.get(url, { params: { access_token: accessToken, fields: 'field_data,created_time' } }),
      );
      return (res.data.data ?? []).map((lead: any) => {
        const fields = Object.fromEntries((lead.field_data ?? []).map((f: any) => [f.name, f.values?.[0]]));
        return { ...fields, createdAt: lead.created_time };
      });
    } catch (err) {
      this.logger.error(`Facebook lead fetch failed: ${err.message}`);
      return [];
    }
  }

  private async updateFacebookBudget(accessToken: string, campaignId: string, dailyBudget: number): Promise<void> {
    const url = `https://graph.facebook.com/v19.0/${campaignId}`;
    await firstValueFrom(
      this.httpService.post(url, { daily_budget: dailyBudget * 100, access_token: accessToken }),
    ).catch((err) => this.logger.error(`Facebook budget update failed: ${err.message}`));
  }
}
