import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() name: string;
  @Column() keyHash: string;
  @Column() keyPrefix: string;
  @Column({ type: 'jsonb', default: [] }) scopes: string[];
  @Column({ default: 1000 }) rateLimit: number;
  @Column({ default: 0 }) usageCount: number;
  @Column({ type: 'timestamp', nullable: true }) lastUsedAt: Date;
  @Column({ type: 'timestamp', nullable: true }) expiresAt: Date;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
