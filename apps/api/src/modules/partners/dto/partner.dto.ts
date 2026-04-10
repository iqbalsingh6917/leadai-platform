import { IsString, IsOptional, IsEmail } from 'class-validator';

export class ApplyPartnerDto {
  @IsString() companyName: string;
  @IsEmail() contactEmail: string;
  @IsOptional() @IsString() payoutMethod?: string;
}

export class UpdatePartnerDto {
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsEmail() contactEmail?: string;
  @IsOptional() @IsString() payoutMethod?: string;
}
