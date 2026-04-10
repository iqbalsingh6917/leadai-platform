import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookEvent, WebhookSource, WebhookStatus } from './entities/webhook-event.entity';
import { FacebookLeadDto, GoogleLeadDto } from './dto/webhook.dto';
import { LeadsService } from '../leads/leads.service';
import { LeadSource } from '../leads/entities/lead.entity';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @InjectRepository(WebhookEvent)
    private readonly webhookEventRepository: Repository<WebhookEvent>,
    private readonly leadsService: LeadsService,
  ) {}

  async processFacebookLead(
    payload: FacebookLeadDto,
    tenantId: string,
  ): Promise<WebhookEvent> {
    const event = await this.webhookEventRepository.save(
      this.webhookEventRepository.create({
        source: WebhookSource.FACEBOOK_ADS,
        status: WebhookStatus.RECEIVED,
        rawPayload: payload as unknown as Record<string, any>,
        tenantId,
      }),
    );

    try {
      const fields = this.extractFacebookFields(payload);
      const lead = await this.leadsService.create(
        {
          firstName: fields.first_name || 'Unknown',
          lastName: fields.last_name || '',
          email: fields.email,
          phone: fields.phone_number,
          source: LeadSource.ADVERTISEMENT,
        },
        tenantId,
      );

      event.status = WebhookStatus.PROCESSED;
      event.createdLeadId = lead.id;
    } catch (error) {
      this.logger.error(
        `Failed to process Facebook lead ${payload.leadgen_id}: ${(error as Error).message}`,
      );
      event.status = WebhookStatus.FAILED;
      event.errorMessage = (error as Error).message;
    }

    return this.webhookEventRepository.save(event);
  }

  async processGoogleLead(
    payload: GoogleLeadDto,
    tenantId: string,
  ): Promise<WebhookEvent> {
    const event = await this.webhookEventRepository.save(
      this.webhookEventRepository.create({
        source: WebhookSource.GOOGLE_ADS,
        status: WebhookStatus.RECEIVED,
        rawPayload: payload as unknown as Record<string, any>,
        tenantId,
      }),
    );

    try {
      const fields = this.extractGoogleFields(payload);
      const lead = await this.leadsService.create(
        {
          firstName: fields.FIRST_NAME || 'Unknown',
          lastName: fields.LAST_NAME || '',
          email: fields.EMAIL,
          phone: fields.PHONE_NUMBER,
          source: LeadSource.ADVERTISEMENT,
        },
        tenantId,
      );

      event.status = WebhookStatus.PROCESSED;
      event.createdLeadId = lead.id;
    } catch (error) {
      this.logger.error(
        `Failed to process Google lead ${payload.lead_id}: ${(error as Error).message}`,
      );
      event.status = WebhookStatus.FAILED;
      event.errorMessage = (error as Error).message;
    }

    return this.webhookEventRepository.save(event);
  }

  async findAll(
    tenantId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: WebhookEvent[]; total: number }> {
    const [data, total] = await this.webhookEventRepository.findAndCount({
      where: { tenantId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  private extractFacebookFields(
    payload: FacebookLeadDto,
  ): Record<string, string | undefined> {
    const result: Record<string, string | undefined> = {};
    for (const field of payload.field_data ?? []) {
      result[field.name] = field.values?.[0];
    }
    return result;
  }

  private extractGoogleFields(
    payload: GoogleLeadDto,
  ): Record<string, string | undefined> {
    const result: Record<string, string | undefined> = {};
    for (const col of payload.column_data ?? []) {
      result[col.column_id] = col.string_value;
    }
    return result;
  }
}
