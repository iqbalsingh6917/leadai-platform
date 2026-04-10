import { IsString, IsEnum, IsArray, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { SupportedLanguage } from '../entities/translation.entity';

export class UpsertTranslationDto {
  @IsEnum(SupportedLanguage) language: SupportedLanguage;
  @IsString() key: string;
  @IsString() value: string;
}

export class TranslationItemDto {
  @IsString() key: string;
  @IsString() value: string;
}

export class BulkUpsertDto {
  @IsEnum(SupportedLanguage) language: SupportedLanguage;
  @IsArray() @ArrayNotEmpty() @ValidateNested({ each: true }) @Type(() => TranslationItemDto) items: TranslationItemDto[];
}
