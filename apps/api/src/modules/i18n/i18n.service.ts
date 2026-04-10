import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation, SupportedLanguage } from './entities/translation.entity';
import { UpsertTranslationDto, BulkUpsertDto } from './dto/i18n.dto';

@Injectable()
export class I18nService {
  constructor(
    @InjectRepository(Translation)
    private readonly repo: Repository<Translation>,
  ) {}

  async getTranslations(tenantId: string, language: SupportedLanguage): Promise<Record<string, string>> {
    const translations = await this.repo.find({ where: { tenantId, language } });
    return translations.reduce((map, t) => {
      map[t.key] = t.value;
      return map;
    }, {} as Record<string, string>);
  }

  async upsertTranslation(tenantId: string, dto: UpsertTranslationDto): Promise<Translation> {
    let translation = await this.repo.findOne({
      where: { tenantId, language: dto.language, key: dto.key },
    });
    if (translation) {
      translation.value = dto.value;
    } else {
      translation = this.repo.create({ ...dto, tenantId });
    }
    return this.repo.save(translation);
  }

  async bulkUpsert(tenantId: string, dto: BulkUpsertDto): Promise<void> {
    for (const item of dto.items) {
      await this.upsertTranslation(tenantId, { language: dto.language, key: item.key, value: item.value });
    }
  }
}
