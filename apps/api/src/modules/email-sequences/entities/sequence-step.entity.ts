import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmailSequence } from './sequence.entity';

@Entity('sequence_steps')
export class EmailSequenceStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EmailSequence, (sequence) => sequence.steps, { onDelete: 'CASCADE' })
  @JoinColumn()
  sequence: EmailSequence;

  @Column({ type: 'integer' })
  stepOrder: number;

  @Column({ type: 'integer', default: 0 })
  delayDays: number;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'uuid', nullable: true })
  templateId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
