import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReportType {
  LEADS = 'leads',
  CAMPAIGNS = 'campaigns',
  PIPELINE = 'pipeline',
  REVENUE = 'revenue',
  ACTIVITY = 'activity',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() name: string;
  @Column({ nullable: true }) description: string;
  @Column({ type: 'enum', enum: ReportType }) type: ReportType;
  @Column({ type: 'jsonb', default: {} }) config: Record<string, any>;
  @Column({ nullable: true }) schedule: string;
  @Column({ type: 'timestamp', nullable: true }) lastRunAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
