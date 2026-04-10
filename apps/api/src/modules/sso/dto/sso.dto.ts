import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { SsoProvider } from '../entities/sso-config.entity';

export class ConfigureSsoDto {
  @IsEnum(SsoProvider) provider: SsoProvider;
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() clientSecret?: string;
  @IsOptional() @IsString() tenantDomain?: string;
  @IsOptional() @IsString() metadataUrl?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
