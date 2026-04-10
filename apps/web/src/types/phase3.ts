export interface WhiteLabelConfig {
  id?: string;
  tenantId?: string;
  customDomain?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  companyName?: string;
  favicon?: string;
  emailFromName?: string;
  emailFromAddress?: string;
  isActive?: boolean;
}

export interface Integration {
  id?: string;
  provider: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt?: string;
}

export interface AutopilotRule {
  id?: string;
  name: string;
  trigger: 'lead_score_above' | 'stage_changed' | 'no_activity' | 'tag_added';
  triggerValue?: string;
  actions: any[];
  isActive: boolean;
  executionCount: number;
  lastRunAt?: string;
}

export interface Role {
  id?: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
}

export interface Workspace {
  id?: string;
  name: string;
  slug: string;
  plan: string;
  status: 'active' | 'suspended' | 'trial';
  memberCount: number;
  leadCount: number;
}

export interface Report {
  id?: string;
  name: string;
  description?: string;
  type: 'leads' | 'campaigns' | 'pipeline' | 'revenue' | 'activity';
  config: any;
  schedule?: string;
  lastRunAt?: string;
}

export interface Partner {
  id?: string;
  companyName: string;
  contactEmail: string;
  tier: 'silver' | 'gold' | 'platinum';
  commissionRate: number;
  referralCode: string;
  status: 'pending' | 'active' | 'suspended';
  totalReferrals: number;
  totalEarnings: number;
  payoutMethod?: string;
}
