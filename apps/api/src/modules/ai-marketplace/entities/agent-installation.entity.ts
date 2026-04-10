import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('agent_installations')
export class AgentInstallation {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column({ type: 'uuid' }) agentId: string;
  @Column({ default: true }) isActive: boolean;
  @Column({ type: 'jsonb', nullable: true }) customConfig: object;
  @CreateDateColumn() installedAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
