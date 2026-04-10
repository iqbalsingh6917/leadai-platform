export interface WhatsAppConfig {
  id?: string;
  tenantId: string;
  phoneNumberId?: string;
  wabaId?: string;
  accessToken?: string;
  verifyToken?: string;
  webhookUrl?: string;
  status: 'pending' | 'connected' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

export interface WhatsAppMessage {
  id: string;
  tenantId: string;
  leadId?: string;
  phoneNumber: string;
  direction: 'inbound' | 'outbound';
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  type: 'text' | 'template' | 'image' | 'document';
  body: string;
  externalId?: string;
  error?: string;
  sentAt?: string;
  createdAt: string;
}

export interface SendMessage {
  phoneNumber: string;
  body: string;
  leadId?: string;
}

export interface SaveConfig {
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
  verifyToken?: string;
  webhookUrl?: string;
}
