import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { TelephonyService } from './telephony.service';
import { ProvisionNumberDto, InitiateCallDto, UpdateCallStatusDto } from './dto/telephony.dto';

@ApiTags('telephony')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('telephony')
export class TelephonyController {
  constructor(private readonly service: TelephonyService) {}

  @Get('numbers')
  listNumbers(@GetTenant() tenantId: string) {
    return this.service.listPhoneNumbers(tenantId);
  }

  @Post('numbers/provision')
  provisionNumber(@Body() dto: ProvisionNumberDto, @GetTenant() tenantId: string) {
    return this.service.provisionNumber(tenantId, dto);
  }

  @Delete('numbers/:id')
  deleteNumber(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.deleteNumber(tenantId, id);
  }

  @Get('calls')
  listCalls(@GetTenant() tenantId: string) {
    return this.service.listCallLogs(tenantId);
  }

  @Get('calls/:id')
  getCall(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.getCallLog(tenantId, id);
  }

  @Post('calls')
  initiateCall(@Body() dto: InitiateCallDto, @GetTenant() tenantId: string) {
    return this.service.initiateCall(tenantId, dto);
  }

  @Patch('calls/:id/status')
  updateCallStatus(@Param('id') id: string, @Body() dto: UpdateCallStatusDto, @GetTenant() tenantId: string) {
    return this.service.updateCallStatus(tenantId, id, dto.status, dto.duration);
  }

  @Get('stats')
  getStats(@GetTenant() tenantId: string) {
    return this.service.getStats(tenantId);
  }
}
