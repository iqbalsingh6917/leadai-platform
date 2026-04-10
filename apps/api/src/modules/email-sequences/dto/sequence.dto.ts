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
import { SequenceStatus, SequenceTrigger } from '../entities/sequence.entity';

export class SequenceStepDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  stepOrder: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  delayDays: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  templateId?: string;
}

export class CreateSequenceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: SequenceTrigger })
  @IsEnum(SequenceTrigger)
  trigger: SequenceTrigger;

  @ApiPropertyOptional({ enum: SequenceStatus })
  @IsOptional()
  @IsEnum(SequenceStatus)
  status?: SequenceStatus;

  @ApiProperty({ type: [SequenceStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SequenceStepDto)
  steps: SequenceStepDto[];
}

export class UpdateSequenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: SequenceTrigger })
  @IsOptional()
  @IsEnum(SequenceTrigger)
  trigger?: SequenceTrigger;

  @ApiPropertyOptional({ enum: SequenceStatus })
  @IsOptional()
  @IsEnum(SequenceStatus)
  status?: SequenceStatus;

  @ApiPropertyOptional({ type: [SequenceStepDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SequenceStepDto)
  steps?: SequenceStepDto[];
}

export class EnrollLeadsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(4, { each: true })
  @ArrayMinSize(1)
  leadIds: string[];
}
