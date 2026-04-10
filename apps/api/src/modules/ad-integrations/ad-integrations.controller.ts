import {
  Controller, Get, Post, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { AdIntegrationsService } from './ad-integrations.service';
import { AdPlatform } from './entities/ad-campaign.entity';
import {
  ConnectAdPlatformDto,
  SyncCampaignsDto,
  LeadSyncConfigDto,
  UpdateBudgetDto,
} from './dto/ad-integrations.dto';

@ApiTags('ad-integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ad-integrations')
export class AdIntegrationsController {
  constructor(private readonly service: AdIntegrationsService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get connection status for all ad platforms' })
  getStatus(@GetTenant() tenantId: string) {
    return this.service.getConnectionStatus(tenantId);
  }

  @Post(':platform/connect')
  @ApiOperation({ summary: 'Connect Google Ads or Facebook Ads' })
  connect(
    @GetTenant() tenantId: string,
    @Param('platform') platform: AdPlatform,
    @Body() dto: ConnectAdPlatformDto,
  ) {
    return this.service.connect(tenantId, platform, dto);
  }

  @Delete(':platform/disconnect')
  @ApiOperation({ summary: 'Disconnect an ad platform' })
  disconnect(@GetTenant() tenantId: string, @Param('platform') platform: AdPlatform) {
    return this.service.disconnect(tenantId, platform);
  }

  @Post(':platform/sync-campaigns')
  @ApiOperation({ summary: 'Sync campaigns from Google Ads or Facebook Ads' })
  syncCampaigns(
    @GetTenant() tenantId: string,
    @Param('platform') platform: AdPlatform,
    @Body() dto: SyncCampaignsDto,
  ) {
    return this.service.syncCampaigns(tenantId, platform, dto);
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'List all synced ad campaigns' })
  listCampaigns(@GetTenant() tenantId: string, @Query('platform') platform?: AdPlatform) {
    return this.service.listCampaigns(tenantId, platform);
  }

  @Get('performance')
  @ApiOperation({ summary: 'Aggregate performance across all platforms' })
  getPerformance(@GetTenant() tenantId: string) {
    return this.service.getCampaignPerformance(tenantId);
  }

  @Post(':platform/sync-leads')
  @ApiOperation({ summary: 'Pull leads from Facebook Lead Ads or Google Lead Form' })
  syncLeads(
    @GetTenant() tenantId: string,
    @Param('platform') platform: AdPlatform,
    @Body() dto: LeadSyncConfigDto,
  ) {
    return this.service.syncLeads(tenantId, platform, dto);
  }

  @Post('budget')
  @ApiOperation({ summary: 'Update daily budget for a campaign via the ad platform API' })
  updateBudget(@GetTenant() tenantId: string, @Body() dto: UpdateBudgetDto) {
    return this.service.updateBudget(tenantId, dto);
  }
}
