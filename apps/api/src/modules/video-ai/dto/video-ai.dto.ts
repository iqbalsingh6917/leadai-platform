import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsObject } from 'class-validator';
import { VideoStyle, VideoTemplateStatus } from '../entities/video-template.entity';

export class CreateVideoTemplateDto {
  @IsString() name: string;
  @IsString() scriptTemplate: string;
  @IsOptional() @IsArray() variables?: string[];
  @IsOptional() @IsNumber() duration?: number;
  @IsOptional() @IsEnum(VideoStyle) style?: VideoStyle;
  @IsOptional() @IsEnum(VideoTemplateStatus) status?: VideoTemplateStatus;
}

export class CreateVideoJobDto {
  @IsString() templateId: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @IsString() recipientName?: string;
  @IsOptional() @IsObject() variables?: object;
}
