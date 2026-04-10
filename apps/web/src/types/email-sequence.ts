export interface SequenceStep {
  id?: string;
  stepOrder: number;
  delayDays: number;
  subject: string;
  body: string;
  templateId?: string;
}

export interface EmailSequence {
  id: string;
  name: string;
  description?: string;
  trigger: string;
  status: string;
  steps: SequenceStep[];
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailSequence {
  name: string;
  description?: string;
  trigger: string;
  status?: string;
  steps: SequenceStep[];
}

export interface UpdateEmailSequence extends Partial<CreateEmailSequence> {}
