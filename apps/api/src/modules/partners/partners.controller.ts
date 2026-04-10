import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { PartnersService } from './partners.service';
import { ApplyPartnerDto } from './dto/partner.dto';

@ApiTags('partners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  @Get('profile')
  getProfile(@GetTenant() tenantId: string) {
    return this.service.getProfile(tenantId);
  }

  @Post('apply')
  apply(@Body() dto: ApplyPartnerDto, @GetTenant() tenantId: string) {
    return this.service.apply(tenantId, dto);
  }

  @Get('referrals')
  getReferrals(@GetTenant() tenantId: string) {
    return this.service.getReferrals(tenantId);
  }

  @Get('earnings')
  getEarnings(@GetTenant() tenantId: string) {
    return this.service.getEarnings(tenantId);
  }

  @Post('payout-request')
  requestPayout(@GetTenant() tenantId: string) {
    return this.service.requestPayout(tenantId);
  }
}
