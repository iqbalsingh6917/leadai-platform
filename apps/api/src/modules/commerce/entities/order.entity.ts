import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column({ type: 'uuid', nullable: true }) contactId: string;
  @Column({ type: 'uuid', nullable: true }) leadId: string;
  @Column() whatsappNumber: string;
  @Column({ type: 'jsonb', default: [] }) items: Array<{ productId: string; name: string; qty: number; price: number }>;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) subtotal: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) tax: number;
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 }) total: number;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING }) status: OrderStatus;
  @Column({ nullable: true }) paymentMethod: string;
  @Column({ nullable: true }) paymentRef: string;
  @Column({ nullable: true }) notes: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
