import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReferralStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  PAID = 'paid',
}

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) partnerId: string;
  @Column({ type: 'uuid' }) referredTenantId: string;
  @Column({ type: 'enum', enum: ReferralStatus, default: ReferralStatus.PENDING }) status: ReferralStatus;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) dealValue: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) commission: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
