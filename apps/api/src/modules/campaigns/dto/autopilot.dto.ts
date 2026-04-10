import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, IsUUID } from 'class-validator';
import { AutopilotTrigger } from '../entities/autopilot-rule.entity';

export class CreateAutopilotRuleDto {
  @IsString() name: string;
  @IsOptional() @IsUUID() campaignId?: string;
  @IsEnum(AutopilotTrigger) trigger: AutopilotTrigger;
  @IsOptional() @IsString() triggerValue?: string;
  @IsOptional() @IsArray() actions?: any[];
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateAutopilotRuleDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsUUID() campaignId?: string;
  @IsOptional() @IsEnum(AutopilotTrigger) trigger?: AutopilotTrigger;
  @IsOptional() @IsString() triggerValue?: string;
  @IsOptional() @IsArray() actions?: any[];
  @IsOptional() @IsBoolean() isActive?: boolean;
}
