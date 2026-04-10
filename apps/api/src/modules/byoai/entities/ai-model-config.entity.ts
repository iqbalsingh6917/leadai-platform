import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AiProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  LLAMA3 = 'llama3',
  MISTRAL = 'mistral',
  GEMINI = 'gemini',
  CUSTOM = 'custom',
}

@Entity('ai_model_configs')
export class AiModelConfig {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', unique: true }) tenantId: string;
  @Column({ type: 'enum', enum: AiProvider, default: AiProvider.OPENAI }) provider: AiProvider;
  @Column({ nullable: true }) apiKey: string;
  @Column({ nullable: true }) baseUrl: string;
  @Column({ nullable: true }) modelName: string;
  @Column({ default: false }) isActive: boolean;
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.7 }) temperature: number;
  @Column({ default: 2048 }) maxTokens: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
