import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() name: string;
  @Column({ nullable: true }) description: string;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) price: number;
  @Column({ default: 'INR' }) currency: string;
  @Column({ nullable: true }) imageUrl: string;
  @Column({ nullable: true }) sku: string;
  @Column({ default: 0 }) stock: number;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
