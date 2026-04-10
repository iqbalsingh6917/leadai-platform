import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BillingCurrency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

@Entity('global_billing_plans')
export class GlobalBillingPlan {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ type: 'enum', enum: BillingCurrency, default: BillingCurrency.USD }) currency: BillingCurrency;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) priceMonthly: number;
  @Column({ type: 'decimal', precision: 15, scale: 2 }) priceAnnual: number;
  @Column({ nullable: true }) stripePriceIdMonthly: string;
  @Column({ nullable: true }) stripePriceIdAnnual: string;
  @Column({ type: 'jsonb', default: [] }) features: string[];
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
