import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WorkflowTrigger {
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  DEAL_STAGE_CHANGED = 'deal_stage_changed',
  MANUAL = 'manual',
}

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: WorkflowTrigger, default: WorkflowTrigger.MANUAL })
  trigger: WorkflowTrigger;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', default: '{}' })
  definition: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
