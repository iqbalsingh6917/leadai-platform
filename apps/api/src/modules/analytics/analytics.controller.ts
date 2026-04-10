import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@GetTenant() tenantId: string) {
    return this.analyticsService.getDashboardStats(tenantId);
  }

  @Get('leads')
  getLeadAnalytics(
    @GetTenant() tenantId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.analyticsService.getLeadAnalytics(tenantId, from, to);
  }

  @Get('campaigns')
  getCampaignAnalytics(@GetTenant() tenantId: string) {
    return this.analyticsService.getCampaignAnalytics(tenantId);
  }
}
