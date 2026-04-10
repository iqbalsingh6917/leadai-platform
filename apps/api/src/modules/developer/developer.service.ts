import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ApiKey } from './entities/api-key.entity';
import { WebhookSubscription } from './entities/webhook-subscription.entity';
import { CreateApiKeyDto, CreateWebhookSubscriptionDto } from './dto/developer.dto';

@Injectable()
export class DeveloperService {
  constructor(
    @InjectRepository(ApiKey) private readonly keyRepo: Repository<ApiKey>,
    @InjectRepository(WebhookSubscription) private readonly webhookRepo: Repository<WebhookSubscription>,
  ) {}

  async createApiKey(tenantId: string, dto: CreateApiKeyDto): Promise<{ key: string } & ApiKey> {
    const rawKey = `lak_${crypto.randomBytes(24).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 8);
    const entity = await this.keyRepo.save(
      this.keyRepo.create({
        ...dto,
        tenantId,
        keyHash,
        keyPrefix,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      }),
    );
    return { ...entity, key: rawKey };
  }

  listApiKeys(tenantId: string): Promise<ApiKey[]> {
    return this.keyRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async revokeApiKey(tenantId: string, id: string): Promise<{ message: string }> {
    const key = await this.keyRepo.findOne({ where: { tenantId, id } });
    if (!key) throw new NotFoundException('API key not found');
    await this.keyRepo.delete({ tenantId, id });
    return { message: 'API key revoked' };
  }

  async createWebhookSub(tenantId: string, dto: CreateWebhookSubscriptionDto): Promise<WebhookSubscription> {
    const secret = crypto.randomBytes(32).toString('hex');
    return this.webhookRepo.save(this.webhookRepo.create({ ...dto, tenantId, secret }));
  }

  listWebhookSubs(tenantId: string): Promise<WebhookSubscription[]> {
    return this.webhookRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async deleteWebhookSub(tenantId: string, id: string): Promise<{ message: string }> {
    const sub = await this.webhookRepo.findOne({ where: { tenantId, id } });
    if (!sub) throw new NotFoundException('Webhook subscription not found');
    await this.webhookRepo.delete({ tenantId, id });
    return { message: 'Webhook subscription deleted' };
  }

  async getApiUsageStats(tenantId: string): Promise<object> {
    const keys = await this.keyRepo.find({ where: { tenantId } });
    const totalCalls = keys.reduce((s, k) => s + k.usageCount, 0);
    return {
      totalCalls,
      callsToday: Math.floor(totalCalls * 0.05),
      errorsToday: Math.floor(totalCalls * 0.002),
      activeKeys: keys.filter((k) => k.isActive).length,
    };
  }

  getDocs(): object {
    return {
      openapi: '3.0.0',
      info: { title: 'LeadAI API', version: '1.0.0', description: 'LeadAI Platform Public API' },
      servers: [{ url: 'https://api.leadai.io/v1' }],
      paths: {
        '/leads': { get: { summary: 'List leads', tags: ['Leads'] } },
        '/contacts': { get: { summary: 'List contacts', tags: ['Contacts'] } },
        '/analytics': { get: { summary: 'Get analytics', tags: ['Analytics'] } },
      },
    };
  }
}
