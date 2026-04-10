import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { WhatsAppConfig, WhatsAppConfigStatus } from './entities/whatsapp-config.entity';
import {
  WhatsAppMessage,
  MessageDirection,
  MessageStatus,
  MessageType,
} from './entities/whatsapp-message.entity';
import { SaveConfigDto, SendMessageDto, SendTemplateDto } from './dto/whatsapp.dto';

@Injectable()
export class WhatsAppService {
  constructor(
    @InjectRepository(WhatsAppConfig)
    private readonly configRepository: Repository<WhatsAppConfig>,
    @InjectRepository(WhatsAppMessage)
    private readonly messageRepository: Repository<WhatsAppMessage>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getConfig(tenantId: string): Promise<WhatsAppConfig | null> {
    return this.configRepository.findOne({ where: { tenantId } });
  }

  async saveConfig(dto: SaveConfigDto, tenantId: string): Promise<WhatsAppConfig> {
    let config = await this.configRepository.findOne({ where: { tenantId } });
    if (!config) {
      config = this.configRepository.create({ tenantId });
    }
    config.phoneNumberId = dto.phoneNumberId;
    config.wabaId = dto.wabaId;
    config.accessToken = dto.accessToken;
    config.verifyToken = dto.verifyToken || crypto.randomBytes(16).toString('hex');
    if (dto.webhookUrl) config.webhookUrl = dto.webhookUrl;
    config.status = WhatsAppConfigStatus.PENDING;
    return this.configRepository.save(config);
  }

  async testConnection(tenantId: string): Promise<{ connected: boolean; message: string }> {
    const config = await this.getConfig(tenantId);
    if (!config || !config.accessToken || !config.phoneNumberId) {
      return { connected: false, message: 'Configuration incomplete' };
    }

    try {
      await firstValueFrom(
        this.httpService.get(
          `https://graph.facebook.com/v18.0/${config.phoneNumberId}`,
          { headers: { Authorization: `Bearer ${config.accessToken}` } },
        ),
      );
      config.status = WhatsAppConfigStatus.CONNECTED;
      await this.configRepository.save(config);
      return { connected: true, message: 'Connection successful' };
    } catch (err) {
      config.status = WhatsAppConfigStatus.FAILED;
      await this.configRepository.save(config);
      return { connected: false, message: (err as Error).message };
    }
  }

  async sendMessage(dto: SendMessageDto, tenantId: string): Promise<WhatsAppMessage> {
    const config = await this.getConfig(tenantId);

    const message = this.messageRepository.create({
      tenantId,
      phoneNumber: dto.phoneNumber,
      leadId: dto.leadId || null,
      direction: MessageDirection.OUTBOUND,
      status: MessageStatus.QUEUED,
      type: dto.type || MessageType.TEXT,
      body: dto.body,
    });

    if (
      config?.status === WhatsAppConfigStatus.CONNECTED &&
      config.accessToken &&
      config.phoneNumberId
    ) {
      try {
        const { data } = await firstValueFrom(
          this.httpService.post(
            `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`,
            {
              messaging_product: 'whatsapp',
              to: dto.phoneNumber,
              type: 'text',
              text: { body: dto.body },
            },
            { headers: { Authorization: `Bearer ${config.accessToken}` } },
          ),
        );
        message.status = MessageStatus.SENT;
        message.externalId = data?.messages?.[0]?.id;
        message.sentAt = new Date();
      } catch (err) {
        message.status = MessageStatus.FAILED;
        message.error = (err as Error).message;
      }
    } else {
      message.status = MessageStatus.SENT;
      message.externalId = `mock_${Date.now()}`;
      message.sentAt = new Date();
    }

    return this.messageRepository.save(message);
  }

  async sendTemplate(dto: SendTemplateDto, tenantId: string): Promise<WhatsAppMessage> {
    const config = await this.getConfig(tenantId);

    const message = this.messageRepository.create({
      tenantId,
      phoneNumber: dto.phoneNumber,
      leadId: dto.leadId || null,
      direction: MessageDirection.OUTBOUND,
      status: MessageStatus.QUEUED,
      type: MessageType.TEMPLATE,
      body: dto.templateName,
      templateParams: JSON.stringify(dto.params || []),
    });

    if (
      config?.status === WhatsAppConfigStatus.CONNECTED &&
      config.accessToken &&
      config.phoneNumberId
    ) {
      try {
        const components =
          dto.params?.length
            ? [{ type: 'body', parameters: dto.params.map((v) => ({ type: 'text', text: v })) }]
            : [];

        const { data } = await firstValueFrom(
          this.httpService.post(
            `https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`,
            {
              messaging_product: 'whatsapp',
              to: dto.phoneNumber,
              type: 'template',
              template: {
                name: dto.templateName,
                language: { code: dto.languageCode || 'en' },
                components,
              },
            },
            { headers: { Authorization: `Bearer ${config.accessToken}` } },
          ),
        );
        message.status = MessageStatus.SENT;
        message.externalId = data?.messages?.[0]?.id;
        message.sentAt = new Date();
      } catch (err) {
        message.status = MessageStatus.FAILED;
        message.error = (err as Error).message;
      }
    } else {
      message.status = MessageStatus.SENT;
      message.externalId = `mock_${Date.now()}`;
      message.sentAt = new Date();
    }

    return this.messageRepository.save(message);
  }

  async getMessages(
    tenantId: string,
    filters: { leadId?: string; direction?: MessageDirection; page?: number; limit?: number },
  ) {
    const { leadId, direction, page = 1, limit = 20 } = filters;
    const where: Record<string, unknown> = { tenantId };
    if (leadId) where.leadId = leadId;
    if (direction) where.direction = direction;

    const [data, total] = await this.messageRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async handleWebhook(
    tenantId: string,
    payload: Record<string, unknown>,
  ): Promise<{ received: number }> {
    let received = 0;
    const entries = (payload?.entry as Record<string, unknown>[]) || [];

    for (const entry of entries) {
      const changes = (entry?.changes as Record<string, unknown>[]) || [];
      for (const change of changes) {
        const value = change?.value as Record<string, unknown>;
        const messages = (value?.messages as Record<string, unknown>[]) || [];
        for (const msg of messages) {
          const existing = await this.messageRepository.findOne({
            where: { externalId: msg.id as string, tenantId },
          });
          if (existing) continue;

          const waMessage = this.messageRepository.create({
            tenantId,
            direction: MessageDirection.INBOUND,
            status: MessageStatus.DELIVERED,
            type: MessageType.TEXT,
            body: ((msg.text as Record<string, unknown>)?.body as string) || '',
            phoneNumber: msg.from as string,
            externalId: msg.id as string,
            leadId: null,
          });
          await this.messageRepository.save(waMessage);
          received++;
        }
      }
    }

    return { received };
  }

  async verifyWebhook(
    tenantId: string,
    mode: string,
    token: string,
    challenge: string,
  ): Promise<string> {
    const config = await this.getConfig(tenantId);
    if (mode === 'subscribe' && config && token === config.verifyToken) {
      return challenge;
    }
    throw new ForbiddenException('Webhook verification failed');
  }
}
