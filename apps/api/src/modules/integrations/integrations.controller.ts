import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { IntegrationsService } from './integrations.service';
import { ConnectIntegrationDto } from './dto/integration.dto';

@ApiTags('integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly service: IntegrationsService) {}

  @Get()
  findAll(@GetTenant() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Post(':provider/connect')
  connect(
    @Param('provider') provider: string,
    @Body() dto: ConnectIntegrationDto,
    @GetTenant() tenantId: string,
  ) {
    return this.service.connect(tenantId, provider, dto);
  }

  @Delete(':provider/disconnect')
  disconnect(@Param('provider') provider: string, @GetTenant() tenantId: string) {
    return this.service.disconnect(tenantId, provider);
  }

  @Post(':provider/sync')
  sync(@Param('provider') provider: string, @GetTenant() tenantId: string) {
    return this.service.sync(tenantId, provider);
  }
}
