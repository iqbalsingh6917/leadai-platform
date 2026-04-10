import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean, IsObject } from 'class-validator';
import { AgentCategory } from '../entities/marketplace-agent.entity';

export class PublishAgentDto {
  @IsString() name: string;
  @IsString() slug: string;
  @IsString() description: string;
  @IsEnum(AgentCategory) category: AgentCategory;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsObject() config?: object;
}

export class InstallAgentDto {
  @IsOptional() @IsObject() customConfig?: object;
}
