import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum VideoJobStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('video_jobs')
export class VideoJob {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column({ type: 'uuid', nullable: true }) templateId: string;
  @Column({ type: 'uuid', nullable: true }) leadId: string;
  @Column({ type: 'uuid', nullable: true }) contactId: string;
  @Column({ nullable: true }) recipientName: string;
  @Column({ type: 'jsonb', default: {} }) variables: object;
  @Column({ type: 'enum', enum: VideoJobStatus, default: VideoJobStatus.QUEUED }) status: VideoJobStatus;
  @Column({ nullable: true }) videoUrl: string;
  @Column({ nullable: true }) thumbnailUrl: string;
  @Column({ nullable: true }) processingMs: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
