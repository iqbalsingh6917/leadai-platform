import {
  Controller, Get, Post, Delete, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { ZapierMakeService } from './zapier-make.service';
import { CreateSubscriptionDto, TriggerEventDto, ZapierRestHookDto, ZapTriggerEvent } from './dto/zapier-make.dto';

@ApiTags('zapier-make')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('zapier-make')
export class ZapierMakeController {
  constructor(private readonly service: ZapierMakeService) {}

  @Get('subscriptions')
  @ApiOperation({ summary: 'List all active Zapier/Make subscriptions' })
  list(@GetTenant() tenantId: string, @Query('event') event?: string) {
    return this.service.listSubscriptions(tenantId, event);
  }

  @Post('subscriptions')
  @ApiOperation({ summary: 'Create a webhook subscription for a trigger event' })
  subscribe(@GetTenant() tenantId: string, @Body() dto: CreateSubscriptionDto) {
    return this.service.subscribe(tenantId, dto);
  }

  @Delete('subscriptions/:id')
  @ApiOperation({ summary: 'Delete a webhook subscription' })
  unsubscribe(@GetTenant() tenantId: string, @Param('id') id: string) {
    return this.service.unsubscribe(tenantId, id);
  }

  @Patch('subscriptions/:id/pause')
  @ApiOperation({ summary: 'Pause a webhook subscription' })
  pause(@GetTenant() tenantId: string, @Param('id') id: string) {
    return this.service.pauseSubscription(tenantId, id);
  }

  @Patch('subscriptions/:id/resume')
  @ApiOperation({ summary: 'Resume a paused webhook subscription' })
  resume(@GetTenant() tenantId: string, @Param('id') id: string) {
    return this.service.resumeSubscription(tenantId, id);
  }

  @Post('trigger')
  @ApiOperation({ summary: 'Manually trigger an event to all subscribers (for testing)' })
  trigger(@GetTenant() tenantId: string, @Body() dto: TriggerEventDto) {
    return this.service.triggerEvent(tenantId, dto);
  }

  @Get('sample/:event')
  @ApiOperation({ summary: 'Get sample payload for a trigger event (used by Zapier editor)' })
  getSample(@Param('event') event: ZapTriggerEvent) {
    return this.service.getSamplePayload(event);
  }

  // ── Zapier REST Hook endpoints (called by Zapier internals) ──────────────────

  @Post('zapier/subscribe')
  @ApiOperation({ summary: 'Zapier REST Hook: subscribe' })
  zapierSubscribe(
    @GetTenant() tenantId: string,
    @Body() dto: ZapierRestHookDto,
  ) {
    return this.service.handleZapierSubscribe(tenantId, dto.event, dto.hookUrl);
  }

  @Post('zapier/unsubscribe')
  @ApiOperation({ summary: 'Zapier REST Hook: unsubscribe' })
  zapierUnsubscribe(@GetTenant() tenantId: string, @Body() dto: { hookUrl: string }) {
    return this.service.handleZapierUnsubscribe(tenantId, dto.hookUrl);
  }
}
