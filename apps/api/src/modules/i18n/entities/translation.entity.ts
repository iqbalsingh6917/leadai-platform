import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SupportedLanguage {
  EN = 'en',
  HI = 'hi',
  TA = 'ta',
  TE = 'te',
  BN = 'bn',
}

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column({ type: 'enum', enum: SupportedLanguage }) language: SupportedLanguage;
  @Column() key: string;
  @Column({ type: 'text' }) value: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
