import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EmailSequenceStep } from './sequence-step.entity';

export enum SequenceStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export enum SequenceTrigger {
  LEAD_CREATED = 'lead_created',
  LEAD_STATUS_CHANGED = 'lead_status_changed',
  MANUAL = 'manual',
}

@Entity('email_sequences')
export class EmailSequence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SequenceTrigger })
  trigger: SequenceTrigger;

  @Column({ type: 'enum', enum: SequenceStatus, default: SequenceStatus.DRAFT })
  status: SequenceStatus;

  @OneToMany(() => EmailSequenceStep, (step) => step.sequence, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  steps: EmailSequenceStep[];

  @Column({ type: 'uuid' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
