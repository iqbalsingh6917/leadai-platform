import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ZapSubscription, SubscriptionStatus } from './entities/zap-subscription.entity';
import { CreateSubscriptionDto, TriggerEventDto, ZapTriggerEvent } from './dto/zapier-make.dto';

@Injectable()
export class ZapierMakeService {
  private readonly logger = new Logger(ZapierMakeService.name);

  constructor(
    @InjectRepository(ZapSubscription)
    private readonly subRepo: Repository<ZapSubscription>,
    private readonly httpService: HttpService,
  ) {}

  // ─── Subscription management ─────────────────────────────────────────────────

  async subscribe(tenantId: string, dto: CreateSubscriptionDto): Promise<ZapSubscription> {
    const sub = this.subRepo.create({
      tenantId,
      event: dto.event,
      targetUrl: dto.targetUrl,
      platform: dto.platform,
      label: dto.label,
    });
    const saved = await this.subRepo.save(sub);
    this.logger.log(`New ${dto.platform} subscription for ${dto.event} → ${dto.targetUrl}`);
    return saved;
  }

  async unsubscribe(tenantId: string, subscriptionId: string): Promise<void> {
    const sub = await this.subRepo.findOne({ where: { id: subscriptionId, tenantId } });
    if (!sub) throw new NotFoundException('Subscription not found');
    await this.subRepo.remove(sub);
  }

  async listSubscriptions(tenantId: string, event?: string): Promise<ZapSubscription[]> {
    const where: any = { tenantId };
    if (event) where.event = event;
    return this.subRepo.find({ where, order: { createdAt: 'DESC' } });
  }

  async pauseSubscription(tenantId: string, subscriptionId: string): Promise<ZapSubscription> {
    const sub = await this.subRepo.findOne({ where: { id: subscriptionId, tenantId } });
    if (!sub) throw new NotFoundException('Subscription not found');
    sub.status = SubscriptionStatus.PAUSED;
    return this.subRepo.save(sub);
  }

  async resumeSubscription(tenantId: string, subscriptionId: string): Promise<ZapSubscription> {
    const sub = await this.subRepo.findOne({ where: { id: subscriptionId, tenantId } });
    if (!sub) throw new NotFoundException('Subscription not found');
    sub.status = SubscriptionStatus.ACTIVE;
    return this.subRepo.save(sub);
  }

  // ─── Event delivery ───────────────────────────────────────────────────────────

  async triggerEvent(tenantId: string, dto: TriggerEventDto): Promise<{ delivered: number; failed: number }> {
    const subscriptions = await this.subRepo.find({
      where: { tenantId, event: dto.event, status: SubscriptionStatus.ACTIVE },
    });

    let delivered = 0;
    let failed = 0;

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await this.deliver(sub, dto.event, dto.payload);
          sub.deliveryCount += 1;
          sub.lastDeliveredAt = new Date();
          sub.lastError = null;
          delivered++;
        } catch (err) {
          sub.failureCount += 1;
          sub.lastError = err.message;
          if (sub.failureCount >= 10) {
            sub.status = SubscriptionStatus.FAILED;
            this.logger.warn(`Subscription ${sub.id} auto-paused after 10 failures`);
          }
          failed++;
        }
        await this.subRepo.save(sub);
      }),
    );

    return { delivered, failed };
  }

  // Internal helper used by other modules to fire events without knowing about subscriptions
  async fireEvent(tenantId: string, event: ZapTriggerEvent, payload: Record<string, any>): Promise<void> {
    await this.triggerEvent(tenantId, { event, payload }).catch((err) => {
      this.logger.error(`fireEvent(${event}) failed: ${err.message}`);
    });
  }

  // ─── Zapier REST Hook helpers ─────────────────────────────────────────────────

  async handleZapierSubscribe(tenantId: string, event: ZapTriggerEvent, hookUrl: string): Promise<ZapSubscription> {
    return this.subscribe(tenantId, { event, targetUrl: hookUrl, platform: 'zapier' as any });
  }

  async handleZapierUnsubscribe(tenantId: string, hookUrl: string): Promise<void> {
    const sub = await this.subRepo.findOne({ where: { tenantId, targetUrl: hookUrl, platform: 'zapier' } });
    if (sub) await this.subRepo.remove(sub);
  }

  // ─── Delivery ─────────────────────────────────────────────────────────────────

  private async deliver(sub: ZapSubscription, event: string, payload: Record<string, any>): Promise<void> {
    const body = {
      event,
      timestamp: new Date().toISOString(),
      subscriptionId: sub.id,
      data: payload,
    };

    await firstValueFrom(
      this.httpService.post(sub.targetUrl, body, {
        timeout: 10_000,
        headers: { 'Content-Type': 'application/json', 'X-LeadAI-Event': event },
      }),
    );
  }

  // ─── Sample payload (used by Zapier "perform_list" polling trigger) ───────────

  getSamplePayload(event: ZapTriggerEvent): Record<string, any> {
    const samples: Record<ZapTriggerEvent, Record<string, any>> = {
      [ZapTriggerEvent.LEAD_CREATED]: {
        id: 'lead-sample-id', firstName: 'John', lastName: 'Doe',
        email: 'john@example.com', phone: '+911234567890', source: 'website', score: 72,
      },
      [ZapTriggerEvent.LEAD_UPDATED]: {
        id: 'lead-sample-id', status: 'qualified', updatedAt: new Date().toISOString(),
      },
      [ZapTriggerEvent.LEAD_CONVERTED]: {
        id: 'lead-sample-id', dealId: 'deal-sample-id', value: 50000, currency: 'INR',
      },
      [ZapTriggerEvent.DEAL_WON]: {
        id: 'deal-sample-id', title: 'Enterprise Deal', value: 120000, closedAt: new Date().toISOString(),
      },
      [ZapTriggerEvent.DEAL_LOST]: {
        id: 'deal-sample-id', reason: 'Budget', lostAt: new Date().toISOString(),
      },
      [ZapTriggerEvent.CAMPAIGN_SENT]: {
        id: 'campaign-sample-id', name: 'Q1 Outreach', recipientCount: 150,
      },
      [ZapTriggerEvent.CONTACT_CREATED]: {
        id: 'contact-sample-id', firstName: 'Jane', lastName: 'Smith', email: 'jane@biz.com',
      },
      [ZapTriggerEvent.WORKFLOW_TRIGGERED]: {
        workflowId: 'wf-sample-id', workflowName: 'Follow-up Sequence', triggeredAt: new Date().toISOString(),
      },
      [ZapTriggerEvent.FORM_SUBMITTED]: {
        formId: 'form-sample-id', submittedAt: new Date().toISOString(), data: {},
      },
    };
    return samples[event] ?? {};
  }
}
