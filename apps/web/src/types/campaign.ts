export type CampaignType = 'email' | 'sms' | 'whatsapp' | 'ads';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget?: number;
  spent?: number;
  startDate?: string;
  endDate?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaign {
  name: string;
  type: CampaignType;
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCampaign extends Partial<CreateCampaign> {
  status?: CampaignStatus;
}
