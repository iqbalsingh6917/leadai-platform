import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { DeveloperService } from './developer.service';
import { CreateApiKeyDto, CreateWebhookSubscriptionDto } from './dto/developer.dto';

@ApiTags('developer')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('developer')
export class DeveloperController {
  constructor(private readonly service: DeveloperService) {}

  @Get('api-keys')
  listApiKeys(@GetTenant() tenantId: string) {
    return this.service.listApiKeys(tenantId);
  }

  @Post('api-keys')
  createApiKey(@Body() dto: CreateApiKeyDto, @GetTenant() tenantId: string) {
    return this.service.createApiKey(tenantId, dto);
  }

  @Delete('api-keys/:id')
  revokeApiKey(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.revokeApiKey(tenantId, id);
  }

  @Get('webhooks')
  listWebhooks(@GetTenant() tenantId: string) {
    return this.service.listWebhookSubs(tenantId);
  }

  @Post('webhooks')
  createWebhook(@Body() dto: CreateWebhookSubscriptionDto, @GetTenant() tenantId: string) {
    return this.service.createWebhookSub(tenantId, dto);
  }

  @Delete('webhooks/:id')
  deleteWebhook(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.deleteWebhookSub(tenantId, id);
  }

  @Get('usage-stats')
  getUsageStats(@GetTenant() tenantId: string) {
    return this.service.getApiUsageStats(tenantId);
  }

  @Get('docs')
  getDocs() {
    return this.service.getDocs();
  }
}
