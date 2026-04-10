import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PartnerTier {
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum PartnerStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', unique: true }) tenantId: string;
  @Column() companyName: string;
  @Column() contactEmail: string;
  @Column({ type: 'enum', enum: PartnerTier, default: PartnerTier.SILVER }) tier: PartnerTier;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 }) commissionRate: number;
  @Column({ unique: true }) referralCode: string;
  @Column({ type: 'enum', enum: PartnerStatus, default: PartnerStatus.PENDING }) status: PartnerStatus;
  @Column({ default: 0 }) totalReferrals: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) totalEarnings: number;
  @Column({ nullable: true }) payoutMethod: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
