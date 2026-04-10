import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DripStatus, DripTrigger } from '../entities/drip-campaign.entity';
import { StepMessageType } from '../entities/drip-step.entity';

export class DripStepDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  stepOrder: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  delayDays: number;

  @ApiPropertyOptional({ enum: StepMessageType })
  @IsOptional()
  @IsEnum(StepMessageType)
  messageType?: StepMessageType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  templateParams?: string[];
}

export class CreateDripCampaignDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DripTrigger })
  @IsEnum(DripTrigger)
  trigger: DripTrigger;

  @ApiPropertyOptional({ enum: DripStatus })
  @IsOptional()
  @IsEnum(DripStatus)
  status?: DripStatus;

  @ApiProperty({ type: [DripStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DripStepDto)
  steps: DripStepDto[];
}

export class UpdateDripCampaignDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DripTrigger })
  @IsOptional()
  @IsEnum(DripTrigger)
  trigger?: DripTrigger;

  @ApiPropertyOptional({ enum: DripStatus })
  @IsOptional()
  @IsEnum(DripStatus)
  status?: DripStatus;

  @ApiPropertyOptional({ type: [DripStepDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DripStepDto)
  steps?: DripStepDto[];
}

export class EnrollLeadsDripDto {
  // leadIds and phoneNumbers must be the same length
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(4, { each: true })
  @ArrayMinSize(1)
  leadIds: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  phoneNumbers: string[];
}
