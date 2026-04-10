import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DripEnrollmentStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

@Entity('whatsapp_drip_enrollments')
export class WhatsAppDripEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  campaignId: string;

  @Column({ type: 'uuid' })
  leadId: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'integer', default: 0 })
  currentStep: number;

  @Column({ type: 'enum', enum: DripEnrollmentStatus, default: DripEnrollmentStatus.ACTIVE })
  status: DripEnrollmentStatus;

  @Column({ type: 'timestamp', nullable: true })
  nextRunAt: Date;

  @Column({ type: 'uuid' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
