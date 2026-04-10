import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Subscription, SubscriptionStatus, PlanId } from './entities/subscription.entity';
import { CreateOrderDto, VerifyPaymentDto } from './dto/billing.dto';
import { PLANS } from './billing.plans';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  getPlans() {
    return Object.values(PLANS);
  }

  async getSubscription(tenantId: string) {
    let subscription = await this.subscriptionRepository.findOne({ where: { tenantId } });
    if (!subscription) {
      subscription = this.subscriptionRepository.create({
        tenantId,
        planId: PlanId.STARTER,
        status: SubscriptionStatus.TRIAL,
      });
      subscription = await this.subscriptionRepository.save(subscription);
    }
    return subscription;
  }

  async createOrder(dto: CreateOrderDto, tenantId: string) {
    const plan = PLANS[dto.planId];
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://api.razorpay.com/v1/orders',
          { amount: plan.price * 100, currency: plan.currency, receipt: `order_${tenantId}_${Date.now()}` },
          { headers: { Authorization: `Basic ${credentials}` } },
        ),
      );
      return { ...data, planId: dto.planId };
    }

    return {
      id: `order_mock_${Date.now()}`,
      amount: plan.price * 100,
      currency: 'INR',
      planId: dto.planId,
    };
  }

  async verifyAndActivate(dto: VerifyPaymentDto, tenantId: string) {
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');

    if (keyId && keySecret) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature !== dto.razorpaySignature) {
        throw new BadRequestException('Invalid payment signature');
      }
    }

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + 30);

    let subscription = await this.subscriptionRepository.findOne({ where: { tenantId } });
    if (!subscription) {
      subscription = this.subscriptionRepository.create({ tenantId });
    }

    Object.assign(subscription, {
      planId: dto.planId,
      status: SubscriptionStatus.ACTIVE,
      razorpaySubscriptionId: dto.razorpayOrderId,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });

    return this.subscriptionRepository.save(subscription);
  }

  async cancelSubscription(tenantId: string) {
    const subscription = await this.getSubscription(tenantId);
    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.cancelledAt = new Date();
    return this.subscriptionRepository.save(subscription);
  }
}
