import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum CallDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
}

export enum CallStatus {
  INITIATED = 'initiated',
  RINGING = 'ringing',
  ANSWERED = 'answered',
  COMPLETED = 'completed',
  FAILED = 'failed',
  MISSED = 'missed',
}

export enum CallSentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
}

@Entity('call_logs')
export class CallLog {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() from: string;
  @Column() to: string;
  @Column({ type: 'enum', enum: CallDirection }) direction: CallDirection;
  @Column({ default: 0 }) duration: number;
  @Column({ type: 'enum', enum: CallStatus, default: CallStatus.INITIATED }) status: CallStatus;
  @Column({ nullable: true }) recordingUrl: string;
  @Column({ type: 'text', nullable: true }) transcript: string;
  @Column({ type: 'enum', enum: CallSentiment, nullable: true }) sentiment: CallSentiment;
  @Column({ type: 'text', nullable: true }) aiSummary: string;
  @Column({ nullable: true }) leadId: string;
  @Column({ nullable: true }) agentId: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
