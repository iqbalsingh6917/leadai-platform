import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum VideoStyle {
  PROFESSIONAL = 'professional',
  CASUAL = 'casual',
  ANIMATED = 'animated',
}

export enum VideoTemplateStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
}

@Entity('video_templates')
export class VideoTemplate {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() name: string;
  @Column({ type: 'text' }) scriptTemplate: string;
  @Column({ type: 'jsonb', default: [] }) variables: string[];
  @Column({ default: 60 }) duration: number;
  @Column({ type: 'enum', enum: VideoStyle, default: VideoStyle.PROFESSIONAL }) style: VideoStyle;
  @Column({ type: 'enum', enum: VideoTemplateStatus, default: VideoTemplateStatus.DRAFT }) status: VideoTemplateStatus;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
