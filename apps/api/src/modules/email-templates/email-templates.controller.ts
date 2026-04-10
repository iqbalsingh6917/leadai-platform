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
import { EmailTemplatesService } from './email-templates.service';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto/email-template.dto';

@ApiTags('email-templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('email-templates')
export class EmailTemplatesController {
  constructor(private readonly emailTemplatesService: EmailTemplatesService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @GetTenant() tenantId: string,
  ) {
    return this.emailTemplatesService.findAll(tenantId, { page: +page || 1, limit: +limit || 20, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.emailTemplatesService.findOne(id, tenantId);
  }

  @Post()
  create(@Body() dto: CreateEmailTemplateDto, @GetTenant() tenantId: string) {
    return this.emailTemplatesService.create(dto, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEmailTemplateDto,
    @GetTenant() tenantId: string,
  ) {
    return this.emailTemplatesService.update(id, dto, tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetTenant() tenantId: string) {
    return this.emailTemplatesService.remove(id, tenantId);
  }

  @Post(':id/preview')
  preview(
    @Param('id') id: string,
    @Body('variables') variables: Record<string, string>,
    @GetTenant() tenantId: string,
  ) {
    return this.emailTemplatesService.preview(id, tenantId, variables || {});
  }
}
