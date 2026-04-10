import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlanId } from '../entities/subscription.entity';

export class CreateOrderDto {
  @ApiProperty({ enum: PlanId })
  @IsEnum(PlanId)
  planId: PlanId;
}

export class VerifyPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;

  @ApiProperty({ enum: PlanId })
  @IsEnum(PlanId)
  planId: PlanId;
}
