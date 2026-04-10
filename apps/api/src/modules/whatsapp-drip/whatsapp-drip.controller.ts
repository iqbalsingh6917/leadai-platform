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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { WhatsAppDripService } from './whatsapp-drip.service';
import {
  CreateDripCampaignDto,
  UpdateDripCampaignDto,
  EnrollLeadsDripDto,
} from './dto/drip.dto';

@ApiTags('whatsapp-drip')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('whatsapp-drip')
export class WhatsAppDripController {
  constructor(private readonly whatsAppDripService: WhatsAppDripService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @GetTenant() tenantId: string,
  ) {
    return this.whatsAppDripService.findAll(tenantId, { page: +page || 1, limit: +limit || 20 });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.whatsAppDripService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() dto: CreateDripCampaignDto, @GetTenant() tenantId: string) {
    return this.whatsAppDripService.create(dto, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDripCampaignDto,
    @GetTenant() tenantId: string,
  ) {
    return this.whatsAppDripService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.whatsAppDripService.remove(id, tenantId);
  }

  @Post(':id/enroll')
  enroll(
    @Param('id') id: string,
    @Body() dto: EnrollLeadsDripDto,
    @GetTenant() tenantId: string,
  ) {
    return this.whatsAppDripService.enroll(id, dto, tenantId);
  }

  @Get(':id/enrollments')
  getEnrollments(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.whatsAppDripService.getEnrollments(id, tenantId);
  }

  @Delete('enrollments/:enrollmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelEnrollment(
    @Param('enrollmentId') enrollmentId: string,
    @GetTenant() tenantId: string,
  ) {
    return this.whatsAppDripService.cancelEnrollment(enrollmentId, tenantId);
  }
}
