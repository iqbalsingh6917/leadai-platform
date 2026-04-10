import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { TelephonyProvider } from '../entities/phone-number.entity';
import { CallStatus } from '../entities/call-log.entity';

export class ProvisionNumberDto {
  @IsEnum(TelephonyProvider) provider: TelephonyProvider;
  @IsString() countryCode: string;
  @IsOptional() @IsNumber() monthlyRent?: number;
}

export class InitiateCallDto {
  @IsString() from: string;
  @IsString() to: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsString() agentId?: string;
}

export class UpdateCallStatusDto {
  @IsEnum(CallStatus) status: CallStatus;
  @IsOptional() @IsNumber() duration?: number;
}
