import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AutopilotTrigger {
  LEAD_SCORE_ABOVE = 'lead_score_above',
  STAGE_CHANGED = 'stage_changed',
  NO_ACTIVITY = 'no_activity',
  TAG_ADDED = 'tag_added',
}

@Entity('autopilot_rules')
export class AutopilotRule {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column({ type: 'uuid', nullable: true }) campaignId: string;
  @Column() name: string;
  @Column({ type: 'enum', enum: AutopilotTrigger }) trigger: AutopilotTrigger;
  @Column({ nullable: true }) triggerValue: string;
  @Column({ type: 'jsonb', default: [] }) actions: any[];
  @Column({ default: true }) isActive: boolean;
  @Column({ default: 0 }) executionCount: number;
  @Column({ type: 'timestamp', nullable: true }) lastRunAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
