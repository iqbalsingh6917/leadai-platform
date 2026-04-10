import { IsString, IsEnum, IsOptional, IsEmail, IsDateString } from 'class-validator';
import { DataSubjectType, ConsentType } from '../entities/consent-record.entity';
import { RequestType, RequestStatus } from '../entities/data-request.entity';

export class RecordConsentDto {
  @IsString() dataSubjectId: string;
  @IsEnum(DataSubjectType) dataSubjectType: DataSubjectType;
  @IsEnum(ConsentType) consentType: ConsentType;
  @IsOptional() @IsString() ipAddress?: string;
  @IsOptional() @IsString() userAgent?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
}

export class CreateDataRequestDto {
  @IsEmail() requestorEmail: string;
  @IsEnum(RequestType) requestType: RequestType;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateDataRequestStatusDto {
  @IsEnum(RequestStatus) status: RequestStatus;
  @IsOptional() @IsString() notes?: string;
}
