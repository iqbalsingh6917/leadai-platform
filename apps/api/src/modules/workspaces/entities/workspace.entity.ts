import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum WorkspaceStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
}

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() name: string;
  @Column({ unique: true }) slug: string;
  @Column({ default: 'starter' }) plan: string;
  @Column({ type: 'enum', enum: WorkspaceStatus, default: WorkspaceStatus.TRIAL }) status: WorkspaceStatus;
  @Column({ default: 0 }) memberCount: number;
  @Column({ default: 0 }) leadCount: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
