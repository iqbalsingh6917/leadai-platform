import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WhatsAppDripCampaign } from './drip-campaign.entity';

export enum StepMessageType {
  TEXT = 'text',
  TEMPLATE = 'template',
}

@Entity('whatsapp_drip_steps')
export class WhatsAppDripStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WhatsAppDripCampaign, (campaign) => campaign.steps, { onDelete: 'CASCADE' })
  @JoinColumn()
  campaign: WhatsAppDripCampaign;

  @Column({ type: 'integer', default: 0 })
  stepOrder: number;

  @Column({ type: 'integer', default: 0 })
  delayDays: number;

  @Column({ type: 'enum', enum: StepMessageType, default: StepMessageType.TEXT })
  messageType: StepMessageType;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'text', nullable: true })
  templateParams: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
