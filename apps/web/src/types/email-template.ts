export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailTemplate {
  name: string;
  subject: string;
  body: string;
  description?: string;
}

export interface UpdateEmailTemplate extends Partial<CreateEmailTemplate> {}

export interface PreviewTemplate {
  subject: string;
  body: string;
}
