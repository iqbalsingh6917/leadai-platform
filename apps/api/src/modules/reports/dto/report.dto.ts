import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';
import { ReportType } from '../entities/report.entity';

export class CreateReportDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(ReportType) type: ReportType;
  @IsOptional() @IsObject() config?: Record<string, any>;
  @IsOptional() @IsString() schedule?: string;
}

export class UpdateReportDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(ReportType) type?: ReportType;
  @IsOptional() @IsObject() config?: Record<string, any>;
  @IsOptional() @IsString() schedule?: string;
}
