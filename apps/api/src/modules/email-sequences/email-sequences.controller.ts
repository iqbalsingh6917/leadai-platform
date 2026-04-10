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
import { EmailSequencesService } from './email-sequences.service';
import { CreateSequenceDto, UpdateSequenceDto, EnrollLeadsDto } from './dto/sequence.dto';

@ApiTags('email-sequences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('email-sequences')
export class EmailSequencesController {
  constructor(private readonly emailSequencesService: EmailSequencesService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @GetTenant() tenantId: string,
  ) {
    return this.emailSequencesService.findAll(tenantId, { page: +page || 1, limit: +limit || 20 });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.emailSequencesService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() dto: CreateSequenceDto, @GetTenant() tenantId: string) {
    return this.emailSequencesService.create(dto, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSequenceDto,
    @GetTenant() tenantId: string,
  ) {
    return this.emailSequencesService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.emailSequencesService.remove(id, tenantId);
  }

  @Post(':id/enroll')
  enroll(
    @Param('id') id: string,
    @Body() dto: EnrollLeadsDto,
    @GetTenant() tenantId: string,
  ) {
    return this.emailSequencesService.enroll(id, dto, tenantId);
  }

  @Get(':id/enrollments')
  getEnrollments(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.emailSequencesService.getEnrollments(id, tenantId);
  }

  @Delete('enrollments/:enrollmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelEnrollment(
    @Param('enrollmentId') enrollmentId: string,
    @GetTenant() tenantId: string,
  ) {
    return this.emailSequencesService.cancelEnrollment(enrollmentId, tenantId);
  }
}
