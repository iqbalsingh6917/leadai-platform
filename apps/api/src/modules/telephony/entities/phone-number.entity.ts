import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TelephonyProvider {
  TWILIO = 'twilio',
  EXOTEL = 'exotel',
  PLIVO = 'plivo',
  VONAGE = 'vonage',
}

@Entity('phone_numbers')
export class PhoneNumber {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() number: string;
  @Column({ type: 'enum', enum: TelephonyProvider }) provider: TelephonyProvider;
  @Column() countryCode: string;
  @Column({ type: 'jsonb', default: { voice: true, sms: true, whatsapp: false } }) capabilities: object;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) monthlyRent: number;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
