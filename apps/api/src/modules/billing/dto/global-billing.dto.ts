import { IsEnum, IsNumber, IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { BillingCurrency } from '../entities/global-billing-plan.entity';

export class CreateGlobalPlanDto {
  @IsString() name: string;
  @IsEnum(BillingCurrency) currency: BillingCurrency;
  @IsNumber() priceMonthly: number;
  @IsNumber() priceAnnual: number;
  @IsOptional() @IsString() stripePriceIdMonthly?: string;
  @IsOptional() @IsString() stripePriceIdAnnual?: string;
  @IsOptional() @IsArray() features?: string[];
  @IsOptional() @IsBoolean() isActive?: boolean;
}
