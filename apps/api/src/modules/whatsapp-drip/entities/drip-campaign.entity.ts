import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WhatsAppDripStep } from './drip-step.entity';

export enum DripStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  ARCHIVED = 'archived',
}

export enum DripTrigger {
  LEAD_CREATED = 'lead_created',
  LEAD_STATUS_CHANGED = 'lead_status_changed',
  MANUAL = 'manual',
}

@Entity('whatsapp_drip_campaigns')
export class WhatsAppDripCampaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: DripTrigger })
  trigger: DripTrigger;

  @Column({ type: 'enum', enum: DripStatus, default: DripStatus.DRAFT })
  status: DripStatus;

  @OneToMany(() => WhatsAppDripStep, (step) => step.campaign, {
    cascade: ['insert', 'update'],
    eager: true,
  })
  steps: WhatsAppDripStep[];

  @Column({ type: 'uuid' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
