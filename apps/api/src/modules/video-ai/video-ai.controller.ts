import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { VideoAiService } from './video-ai.service';
import { CreateVideoTemplateDto, CreateVideoJobDto } from './dto/video-ai.dto';

@ApiTags('video-ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('video-ai')
export class VideoAiController {
  constructor(private readonly service: VideoAiService) {}

  @Get('templates')
  listTemplates(@GetTenant() tenantId: string) {
    return this.service.listTemplates(tenantId);
  }

  @Post('templates')
  createTemplate(@Body() dto: CreateVideoTemplateDto, @GetTenant() tenantId: string) {
    return this.service.createTemplate(tenantId, dto);
  }

  @Get('templates/:id')
  getTemplate(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.getTemplate(tenantId, id);
  }

  @Patch('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() dto: Partial<CreateVideoTemplateDto>, @GetTenant() tenantId: string) {
    return this.service.updateTemplate(tenantId, id, dto);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.deleteTemplate(tenantId, id);
  }

  @Get('jobs')
  listJobs(@GetTenant() tenantId: string) {
    return this.service.listJobs(tenantId);
  }

  @Post('jobs')
  createJob(@Body() dto: CreateVideoJobDto, @GetTenant() tenantId: string) {
    return this.service.createJob(tenantId, dto);
  }

  @Get('jobs/:id')
  getJob(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.getJob(tenantId, id);
  }

  @Post('jobs/:id/send-whatsapp')
  sendViaWhatsApp(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.service.sendViaWhatsApp(tenantId, id);
  }
}
