import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadFilterDto } from './dto/lead-filter.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  findAll(@Query() filters: LeadFilterDto, @GetTenant() tenantId: string) {
    return this.leadsService.findAll(tenantId, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.leadsService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() dto: CreateLeadDto, @GetTenant() tenantId: string) {
    return this.leadsService.create(dto, tenantId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLeadDto, @GetTenant() tenantId: string) {
    return this.leadsService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.leadsService.remove(id, tenantId);
  }

  @Post('bulk-import')
  @UseInterceptors(FileInterceptor('file'))
  bulkImport(
    @UploadedFile() file: Express.Multer.File,
    @GetTenant() tenantId: string,
  ) {
    return this.leadsService.bulkImport(file.buffer, tenantId);
  }

  @Post(':id/assign')
  assignLead(
    @Param('id') id: string,
    @Body() dto: AssignLeadDto,
    @GetTenant() tenantId: string,
  ) {
    return this.leadsService.assign(id, dto.assignedTo, tenantId);
  }

  @Post(':id/auto-assign')
  autoAssignLead(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.leadsService.autoAssign(id, tenantId);
  }

  @Post(':id/ai-score')
  aiScore(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.leadsService.aiScore(id, tenantId);
  }
}
