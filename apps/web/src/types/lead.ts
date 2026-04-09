export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'referral' | 'social_media' | 'email' | 'phone' | 'advertisement' | 'other';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status: LeadStatus;
  score: number;
  notes?: string;
  tags: string[];
  assignedTo?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLead {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  source: LeadSource;
  status?: LeadStatus;
  notes?: string;
  tags?: string[];
  assignedTo?: string;
}

export interface UpdateLead extends Partial<CreateLead> {
  score?: number;
}

export interface LeadFilter {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  page?: number;
  limit?: number;
}
