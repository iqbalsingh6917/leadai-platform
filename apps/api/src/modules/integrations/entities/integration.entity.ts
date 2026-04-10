import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum IntegrationStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

@Entity('integrations')
export class Integration {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() provider: string;
  @Column() category: string;
  @Column({ type: 'enum', enum: IntegrationStatus, default: IntegrationStatus.DISCONNECTED }) status: IntegrationStatus;
  @Column({ type: 'jsonb', nullable: true }) config: Record<string, any>;
  @Column({ type: 'timestamp', nullable: true }) lastSyncAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
