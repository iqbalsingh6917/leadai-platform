import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { I18nService } from './i18n.service';
import { BulkUpsertDto } from './dto/i18n.dto';
import { SupportedLanguage } from './entities/translation.entity';

@ApiTags('i18n')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('i18n')
export class I18nController {
  constructor(private readonly service: I18nService) {}

  @Get(':language')
  getTranslations(@Param('language') language: SupportedLanguage, @GetTenant() tenantId: string) {
    return this.service.getTranslations(tenantId, language);
  }

  @Put(':language')
  bulkUpsert(
    @Param('language') language: SupportedLanguage,
    @Body() dto: BulkUpsertDto,
    @GetTenant() tenantId: string,
  ) {
    return this.service.bulkUpsert(tenantId, { ...dto, language });
  }
}
