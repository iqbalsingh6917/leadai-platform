import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('webhook_subscriptions')
export class WebhookSubscription {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() url: string;
  @Column({ type: 'jsonb', default: [] }) events: string[];
  @Column() secret: string;
  @Column({ default: true }) isActive: boolean;
  @Column({ default: 0 }) deliveryCount: number;
  @Column({ default: 0 }) failureCount: number;
  @Column({ type: 'timestamp', nullable: true }) lastDeliveredAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
