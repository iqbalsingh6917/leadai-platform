import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DataSubjectType {
  LEAD = 'lead',
  CONTACT = 'contact',
}

export enum ConsentType {
  MARKETING = 'marketing',
  DATA_PROCESSING = 'data_processing',
  THIRD_PARTY_SHARING = 'third_party_sharing',
  ANALYTICS = 'analytics',
}

export enum ConsentStatus {
  GRANTED = 'granted',
  WITHDRAWN = 'withdrawn',
}

@Entity('consent_records')
export class ConsentRecord {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() dataSubjectId: string;
  @Column({ type: 'enum', enum: DataSubjectType }) dataSubjectType: DataSubjectType;
  @Column({ type: 'enum', enum: ConsentType }) consentType: ConsentType;
  @Column({ type: 'enum', enum: ConsentStatus, default: ConsentStatus.GRANTED }) status: ConsentStatus;
  @Column({ nullable: true }) ipAddress: string;
  @Column({ nullable: true }) userAgent: string;
  @Column({ type: 'timestamp', nullable: true }) grantedAt: Date;
  @Column({ type: 'timestamp', nullable: true }) withdrawnAt: Date;
  @Column({ type: 'timestamp', nullable: true }) expiresAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
