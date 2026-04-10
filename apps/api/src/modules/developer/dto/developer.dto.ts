import { IsString, IsOptional, IsArray, IsNumber, IsDateString } from 'class-validator';

export class CreateApiKeyDto {
  @IsString() name: string;
  @IsOptional() @IsArray() scopes?: string[];
  @IsOptional() @IsNumber() rateLimit?: number;
  @IsOptional() @IsDateString() expiresAt?: string;
}

export class CreateWebhookSubscriptionDto {
  @IsString() url: string;
  @IsArray() events: string[];
}
