import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AdPlatform {
  GOOGLE_ADS = 'google_ads',
  FACEBOOK_ADS = 'facebook_ads',
}

export enum AdCampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  DRAFT = 'draft',
}

export class ConnectAdPlatformDto {
  @ApiProperty()
  @IsString()
  accessToken: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @ApiPropertyOptional({ description: 'Google Ads customer ID or Facebook Ad Account ID' })
  @IsOptional()
  @IsString()
  accountId?: string;
}

export class SyncCampaignsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  since?: string;
}

export class LeadSyncConfigDto {
  @ApiProperty({ description: 'Facebook Lead Form ID or Google Ads Conversion Action ID' })
  @IsString()
  formId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoAssign?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  defaultPipelineId?: string;
}

export class UpdateBudgetDto {
  @ApiProperty()
  @IsString()
  campaignId: string;

  @ApiProperty()
  @IsNumber()
  dailyBudget: number;

  @ApiProperty({ enum: AdPlatform })
  @IsEnum(AdPlatform)
  platform: AdPlatform;
}
