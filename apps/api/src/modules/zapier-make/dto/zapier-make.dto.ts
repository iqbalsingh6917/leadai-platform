import { IsString, IsUrl, IsEnum, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ZapTriggerEvent {
  LEAD_CREATED = 'lead.created',
  LEAD_UPDATED = 'lead.updated',
  LEAD_CONVERTED = 'lead.converted',
  DEAL_WON = 'deal.won',
  DEAL_LOST = 'deal.lost',
  CAMPAIGN_SENT = 'campaign.sent',
  CONTACT_CREATED = 'contact.created',
  WORKFLOW_TRIGGERED = 'workflow.triggered',
  FORM_SUBMITTED = 'form.submitted',
}

export enum ZapPlatform {
  ZAPIER = 'zapier',
  MAKE = 'make',
  N8N = 'n8n',
  CUSTOM = 'custom',
}

export class CreateSubscriptionDto {
  @ApiProperty({ enum: ZapTriggerEvent })
  @IsEnum(ZapTriggerEvent)
  event: ZapTriggerEvent;

  @ApiProperty({ description: 'Webhook URL to deliver payloads to' })
  @IsUrl()
  targetUrl: string;

  @ApiProperty({ enum: ZapPlatform })
  @IsEnum(ZapPlatform)
  platform: ZapPlatform;

  @ApiPropertyOptional({ description: 'Human-readable label for this hook' })
  @IsOptional()
  @IsString()
  label?: string;
}

export class TriggerEventDto {
  @ApiProperty({ enum: ZapTriggerEvent })
  @IsEnum(ZapTriggerEvent)
  event: ZapTriggerEvent;

  @ApiProperty()
  payload: Record<string, any>;
}

export class ZapierRestHookDto {
  @ApiProperty({ description: 'Zapier REST Hook subscription URL' })
  @IsUrl()
  hookUrl: string;

  @ApiProperty({ enum: ZapTriggerEvent })
  @IsEnum(ZapTriggerEvent)
  event: ZapTriggerEvent;
}
