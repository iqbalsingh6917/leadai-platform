import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum RequestType {
  ACCESS = 'access',
  DELETION = 'deletion',
  PORTABILITY = 'portability',
  RECTIFICATION = 'rectification',
}

export enum RequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity('data_requests')
export class DataRequest {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) tenantId: string;
  @Column() requestorEmail: string;
  @Column({ type: 'enum', enum: RequestType }) requestType: RequestType;
  @Column({ type: 'enum', enum: RequestStatus, default: RequestStatus.PENDING }) status: RequestStatus;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'timestamp', nullable: true }) completedAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
