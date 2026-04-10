import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  FAILED = 'failed',
}

@Entity('zap_subscriptions')
export class ZapSubscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column()
  event: string;

  @Column()
  targetUrl: string;

  @Column()
  platform: string;

  @Column({ nullable: true })
  label: string;

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @Column({ type: 'int', default: 0 })
  deliveryCount: number;

  @Column({ type: 'int', default: 0 })
  failureCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastDeliveredAt: Date;

  @Column({ type: 'text', nullable: true })
  lastError: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
