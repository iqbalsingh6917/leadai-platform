import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WhatsAppConfigStatus {
  PENDING = 'pending',
  CONNECTED = 'connected',
  FAILED = 'failed',
}

@Entity('whatsapp_configs')
export class WhatsAppConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  tenantId: string;

  @Column({ nullable: true })
  phoneNumberId: string;

  @Column({ nullable: true })
  wabaId: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  verifyToken: string;

  @Column({ nullable: true })
  webhookUrl: string;

  @Column({
    type: 'enum',
    enum: WhatsAppConfigStatus,
    default: WhatsAppConfigStatus.PENDING,
  })
  status: WhatsAppConfigStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
