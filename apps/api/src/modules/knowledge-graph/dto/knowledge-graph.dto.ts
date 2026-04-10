import { IsString, IsOptional, IsEnum, IsNumber, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NodeType {
  LEAD = 'Lead',
  COMPANY = 'Company',
  INDUSTRY = 'Industry',
  PRODUCT = 'Product',
  CAMPAIGN = 'Campaign',
}

export enum RelationshipType {
  WORKS_AT = 'WORKS_AT',
  BELONGS_TO = 'BELONGS_TO',
  INTERESTED_IN = 'INTERESTED_IN',
  CONVERTED_VIA = 'CONVERTED_VIA',
  SIMILAR_TO = 'SIMILAR_TO',
}

export class CreateNodeDto {
  @ApiProperty({ enum: NodeType })
  @IsEnum(NodeType)
  type: NodeType;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiPropertyOptional()
  @IsOptional()
  properties?: Record<string, any>;
}

export class CreateRelationshipDto {
  @ApiProperty()
  @IsString()
  fromNodeId: string;

  @ApiProperty()
  @IsString()
  toNodeId: string;

  @ApiProperty({ enum: RelationshipType })
  @IsEnum(RelationshipType)
  type: RelationshipType;

  @ApiPropertyOptional()
  @IsOptional()
  properties?: Record<string, any>;
}

export class IndustryInsightQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class SimilarLeadsQueryDto {
  @ApiProperty()
  @IsString()
  leadId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  depth?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class AnonymizedInsightDto {
  @ApiProperty()
  @IsString()
  industry: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  tags?: string[];
}
