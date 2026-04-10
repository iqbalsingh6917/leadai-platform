import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AdCampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  DRAFT = 'draft',
}

export enum AdPlatform {
  GOOGLE_ADS = 'google_ads',
  FACEBOOK_ADS = 'facebook_ads',
}

@Entity('ad_campaigns')
export class AdCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'enum', enum: AdPlatform })
  platform: AdPlatform;

  @Column()
  externalId: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: AdCampaignStatus, default: AdCampaignStatus.DRAFT })
  status: AdCampaignStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  dailyBudget: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  totalSpend: number;

  @Column({ type: 'int', default: 0 })
  impressions: number;

  @Column({ type: 'int', default: 0 })
  clicks: number;

  @Column({ type: 'int', default: 0 })
  conversions: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ctr: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPerLead: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
