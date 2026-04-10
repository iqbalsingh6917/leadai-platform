import { IsEnum, IsOptional, IsString, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { AiProvider } from '../entities/ai-model-config.entity';

export class CreateAiModelConfigDto {
  @IsEnum(AiProvider) provider: AiProvider;
  @IsOptional() @IsString() apiKey?: string;
  @IsOptional() @IsString() baseUrl?: string;
  @IsOptional() @IsString() modelName?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsNumber() @Min(0) @Max(2) temperature?: number;
  @IsOptional() @IsNumber() @Min(1) maxTokens?: number;
}

export class UpdateAiModelConfigDto extends CreateAiModelConfigDto {}
