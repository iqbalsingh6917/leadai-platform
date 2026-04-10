import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateWhiteLabelDto {
  @IsOptional() @IsString() customDomain?: string;
  @IsOptional() @IsString() logoUrl?: string;
  @IsOptional() @IsString() primaryColor?: string;
  @IsOptional() @IsString() secondaryColor?: string;
  @IsOptional() @IsString() companyName?: string;
  @IsOptional() @IsString() favicon?: string;
  @IsOptional() @IsString() emailFromName?: string;
  @IsOptional() @IsString() emailFromAddress?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateWhiteLabelDto extends CreateWhiteLabelDto {}
