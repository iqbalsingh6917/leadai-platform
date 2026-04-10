import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AgentCategory {
  SCORING = 'scoring',
  COMMUNICATION = 'communication',
  ANALYTICS = 'analytics',
  AUTOMATION = 'automation',
  CUSTOM = 'custom',
}

@Entity('marketplace_agents')
export class MarketplaceAgent {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', nullable: true }) authorTenantId: string;
  @Column() name: string;
  @Column({ unique: true }) slug: string;
  @Column({ type: 'text' }) description: string;
  @Column({ type: 'enum', enum: AgentCategory }) category: AgentCategory;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) price: number;
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 }) rating: number;
  @Column({ default: 0 }) installCount: number;
  @Column({ default: '1.0.0' }) version: string;
  @Column({ type: 'jsonb', default: [] }) tags: string[];
  @Column({ default: true }) isPublished: boolean;
  @Column({ default: false }) isOfficial: boolean;
  @Column({ type: 'jsonb', default: {} }) config: object;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
