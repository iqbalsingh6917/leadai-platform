import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LifecycleStage {
  SUBSCRIBER = 'subscriber',
  LEAD = 'lead',
  MARKETING_QUALIFIED_LEAD = 'marketing_qualified_lead',
  SALES_QUALIFIED_LEAD = 'sales_qualified_lead',
  OPPORTUNITY = 'opportunity',
  CUSTOMER = 'customer',
  EVANGELIST = 'evangelist',
  OTHER = 'other',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({
    type: 'enum',
    enum: LifecycleStage,
    default: LifecycleStage.LEAD,
  })
  lifecycleStage: LifecycleStage;

  @Column({ type: 'uuid' })
  tenantId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
