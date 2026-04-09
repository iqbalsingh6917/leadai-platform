export type LifecycleStage = 'subscriber' | 'lead' | 'marketing_qualified_lead' | 'sales_qualified_lead' | 'opportunity' | 'customer' | 'evangelist' | 'other';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  lifecycleStage: LifecycleStage;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContact {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  lifecycleStage?: LifecycleStage;
}

export interface UpdateContact extends Partial<CreateContact> {}
