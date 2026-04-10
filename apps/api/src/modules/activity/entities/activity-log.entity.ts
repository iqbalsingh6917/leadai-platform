import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum ActivityAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  STATUS_CHANGED = 'status_changed',
  ASSIGNED = 'assigned',
  NOTE_ADDED = 'note_added',
  SCORED = 'scored',
  STAGE_CHANGED = 'stage_changed',
  MESSAGE_SENT = 'message_sent',
  CALLED = 'called',
  MEETING_SCHEDULED = 'meeting_scheduled',
}

export enum ActivityEntityType {
  LEAD = 'lead',
  CONTACT = 'contact',
  DEAL = 'deal',
  CAMPAIGN = 'campaign',
}

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ActivityEntityType })
  entityType: ActivityEntityType;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'enum', enum: ActivityAction })
  action: ActivityAction;

  @Column({ type: 'uuid', nullable: true })
  performedBy: string;

  @Column({ nullable: true })
  performedByName: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;
}
