import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('workspace_members')
export class WorkspaceMember {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) workspaceId: string;
  @Column({ type: 'uuid' }) userId: string;
  @Column({ default: 'member' }) role: string;
  @CreateDateColumn() joinedAt: Date;
}
