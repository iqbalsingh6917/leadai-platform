import { Controller, Get, Post, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { ComplianceService } from './compliance.service';
import { RecordConsentDto, CreateDataRequestDto, UpdateDataRequestStatusDto } from './dto/compliance.dto';

@ApiTags('compliance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly service: ComplianceService) {}

  @Get('consents')
  listConsents(@GetTenant() tenantId: string) {
    return this.service.listConsents(tenantId);
  }

  @Post('consents')
  recordConsent(@Body() dto: RecordConsentDto, @GetTenant() tenantId: string) {
    return this.service.recordConsent(tenantId, dto);
  }

  @Delete('consents/:id')
  withdrawConsent(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.withdrawConsent(tenantId, id);
  }

  @Get('data-requests')
  listDataRequests(@GetTenant() tenantId: string) {
    return this.service.listDataRequests(tenantId);
  }

  @Post('data-requests')
  submitDataRequest(@Body() dto: CreateDataRequestDto, @GetTenant() tenantId: string) {
    return this.service.submitDataRequest(tenantId, dto);
  }

  @Patch('data-requests/:id/status')
  processDataRequest(
    @Param('id') id: string,
    @Body() dto: UpdateDataRequestStatusDto,
    @GetTenant() tenantId: string,
  ) {
    return this.service.processDataRequest(tenantId, id, dto.status, dto.notes);
  }

  @Get('summary')
  getSummary(@GetTenant() tenantId: string) {
    return this.service.getSummary(tenantId);
  }
}
