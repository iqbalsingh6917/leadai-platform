import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('white_label_configs')
export class WhiteLabelConfig {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid', unique: true }) tenantId: string;
  @Column({ nullable: true }) customDomain: string;
  @Column({ nullable: true }) logoUrl: string;
  @Column({ default: '#6366f1' }) primaryColor: string;
  @Column({ default: '#8b5cf6' }) secondaryColor: string;
  @Column({ nullable: true }) companyName: string;
  @Column({ nullable: true }) favicon: string;
  @Column({ nullable: true }) emailFromName: string;
  @Column({ nullable: true }) emailFromAddress: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
