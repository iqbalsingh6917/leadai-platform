import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Subscription, SubscriptionStatus, PlanId } from './entities/subscription.entity';
import { GlobalBillingPlan, BillingCurrency } from './entities/global-billing-plan.entity';
import { CreateOrderDto, VerifyPaymentDto } from './dto/billing.dto';
import { PLANS } from './billing.plans';

const CURRENCY_COUNTRY_MAP: Record<string, BillingCurrency> = {
  IN: BillingCurrency.INR,
  US: BillingCurrency.USD,
  GB: BillingCurrency.GBP,
  DE: BillingCurrency.EUR,
  FR: BillingCurrency.EUR,
  IT: BillingCurrency.EUR,
  ES: BillingCurrency.EUR,
};

const MOCK_GLOBAL_PLANS = [
  { name: 'Starter', currency: BillingCurrency.USD, priceMonthly: 29, priceAnnual: 278, features: ['5 Users', '1,000 Leads', 'Email Campaigns', 'Basic Analytics'] },
  { name: 'Professional', currency: BillingCurrency.USD, priceMonthly: 79, priceAnnual: 758, features: ['20 Users', '10,000 Leads', 'WhatsApp Integration', 'Advanced Analytics', 'AI Copilot'] },
  { name: 'Enterprise', currency: BillingCurrency.USD, priceMonthly: 199, priceAnnual: 1910, features: ['Unlimited Users', 'Unlimited Leads', 'White Label', 'SSO', 'Priority Support', 'Custom AI'] },
];

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(GlobalBillingPlan)
    private readonly globalPlanRepo: Repository<GlobalBillingPlan>,
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
    periodEnd.setMonth(periodEnd.getMonth() + 1);

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

  async getGlobalPlans(): Promise<object[]> {
    const stored = await this.globalPlanRepo.find({ where: { isActive: true } });
    if (stored.length > 0) return stored;
    return MOCK_GLOBAL_PLANS;
  }

  detectCurrency(countryCode: string): { currency: BillingCurrency; symbol: string } {
    const currency = CURRENCY_COUNTRY_MAP[countryCode?.toUpperCase()] ?? BillingCurrency.INR;
    const symbols: Record<BillingCurrency, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    return { currency, symbol: symbols[currency] };
  }
}
