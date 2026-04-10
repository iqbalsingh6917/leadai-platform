export interface DripStep {
  id?: string;
  stepOrder: number;
  delayDays: number;
  messageType: 'text' | 'template';
  body: string;
  templateParams?: string[];
}

export interface WhatsAppDripCampaign {
  id: string;
  name: string;
  description?: string;
  trigger: 'lead_created' | 'lead_status_changed' | 'manual';
  status: 'draft' | 'active' | 'paused' | 'archived';
  steps: DripStep[];
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDripCampaign {
  name: string;
  description?: string;
  trigger: string;
  status?: string;
  steps: DripStep[];
}

export interface UpdateDripCampaign extends Partial<CreateDripCampaign> {}
