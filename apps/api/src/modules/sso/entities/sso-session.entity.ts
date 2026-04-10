import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sso_sessions')
export class SsoSession {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() userId: string;
  @Column() provider: string;
  @Column() externalId: string;
  @Column() email: string;
  @Column() name: string;
  @Column({ type: 'timestamp' }) lastLoginAt: Date;
  @CreateDateColumn() createdAt: Date;
}
