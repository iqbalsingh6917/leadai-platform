import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get()
  findAll(@GetTenant() tenantId: string) {
    return this.service.findAll(tenantId);
  }

  @Post()
  create(@Body() dto: CreateReportDto, @GetTenant() tenantId: string) {
    return this.service.create(tenantId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.findOne(tenantId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateReportDto, @GetTenant() tenantId: string) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.delete(tenantId, id);
  }

  @Post(':id/run')
  runReport(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.runReport(tenantId, id);
  }

  @Post(':id/export')
  exportReport(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.exportReport(tenantId, id);
  }
}
