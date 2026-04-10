import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum WebhookSource {
  FACEBOOK_ADS = 'facebook_ads',
  GOOGLE_ADS = 'google_ads',
  CUSTOM = 'custom',
}

export enum WebhookStatus {
  RECEIVED = 'received',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: WebhookSource })
  source: WebhookSource;

  @Column({ type: 'enum', enum: WebhookStatus, default: WebhookStatus.RECEIVED })
  status: WebhookStatus;

  @Column({ type: 'jsonb' })
  rawPayload: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  createdLeadId: string;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;
}
