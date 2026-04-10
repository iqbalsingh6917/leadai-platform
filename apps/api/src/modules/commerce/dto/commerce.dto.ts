import { IsString, IsOptional, IsNumber, IsEnum, IsArray, IsBoolean, Min } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateProductDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() price: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() sku?: string;
  @IsOptional() @IsNumber() @Min(0) stock?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class CreateOrderDto {
  @IsString() whatsappNumber: string;
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsArray() items: Array<{ productId: string; name: string; qty: number; price: number }>;
  @IsOptional() @IsNumber() tax?: number;
  @IsOptional() @IsString() paymentMethod?: string;
  @IsOptional() @IsString() notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus) status: OrderStatus;
}
