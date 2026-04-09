export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  pipelineId: string;
  deals: Deal[];
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  contactId?: string;
  contactName?: string;
  stageId: string;
  expectedCloseDate?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeal {
  title: string;
  value: number;
  contactId?: string;
  stageId: string;
  expectedCloseDate?: string;
}

export interface UpdateDeal extends Partial<CreateDeal> {}

export interface MoveDeal {
  dealId: string;
  stageId: string;
}
