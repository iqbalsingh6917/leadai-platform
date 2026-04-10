import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../auth/entities/user.entity';
import { GetTenant } from '../../common/decorators/tenant.decorator';
import { BillingService } from './billing.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/billing.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  /** Intentionally public — pricing plans are shown on the marketing/upgrade page without login */
  @Get('plans')
  getPlans() {
    return this.billingService.getPlans();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('subscription')
  getSubscription(@GetTenant() tenantId: string) {
    return this.billingService.getSubscription(tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('order')
  createOrder(@Body() dto: CreateOrderDto, @GetTenant() tenantId: string) {
    return this.billingService.createOrder(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  verifyPayment(@Body() dto: VerifyPaymentDto, @GetTenant() tenantId: string) {
    return this.billingService.verifyAndActivate(dto, tenantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('cancel')
  @HttpCode(HttpStatus.OK)
  cancelSubscription(@GetTenant() tenantId: string) {
    return this.billingService.cancelSubscription(tenantId);
  }
}
