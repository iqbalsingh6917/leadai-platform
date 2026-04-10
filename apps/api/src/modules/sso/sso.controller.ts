import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { SsoService } from './sso.service';
import { ConfigureSsoDto } from './dto/sso.dto';

@ApiTags('sso')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sso')
export class SsoController {
  constructor(private readonly service: SsoService) {}

  @Get('config')
  getConfig(@GetTenant() tenantId: string) {
    return this.service.getSsoConfig(tenantId);
  }

  @Put('config')
  configureSSO(@Body() dto: ConfigureSsoDto, @GetTenant() tenantId: string) {
    return this.service.configureSso(tenantId, dto);
  }

  @Post('test')
  testConnection(@GetTenant() tenantId: string) {
    return this.service.testConnection(tenantId);
  }

  @Get('sessions')
  listSessions(@GetTenant() tenantId: string) {
    return this.service.listSsoSessions(tenantId);
  }

  @Get('callback-url')
  getCallbackUrl(@GetTenant() tenantId: string) {
    return this.service.getCallbackUrl(tenantId);
  }
}
