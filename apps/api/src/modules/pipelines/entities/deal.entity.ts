import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PipelineStage } from './pipeline-stage.entity';

@Entity('deals')
export class Deal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  value: number;

  @Column({ type: 'uuid', nullable: true })
  contactId: string;

  @Column({ nullable: true })
  contactName: string;

  @ManyToOne(() => PipelineStage, (stage) => stage.deals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stageId' })
  stage: PipelineStage;

  @Column({ type: 'uuid' })
  stageId: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ nullable: true, type: 'date' })
  expectedCloseDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
