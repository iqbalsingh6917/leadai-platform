import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum NotificationType {
  LEAD_ASSIGNED = 'lead_assigned',
  LEAD_SCORED = 'lead_scored',
  DEAL_STAGE_CHANGED = 'deal_stage_changed',
  CAMPAIGN_COMPLETED = 'campaign_completed',
  WEBHOOK_RECEIVED = 'webhook_received',
  AI_INSIGHT = 'ai_insight',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'uuid', nullable: true })
  entityId: string;

  @Column({ nullable: true })
  entityType: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;
}
