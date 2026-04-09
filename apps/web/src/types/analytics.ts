export interface DashboardStats {
  totalLeads: number;
  totalLeadsChange: number;
  qualifiedLeads: number;
  qualifiedLeadsChange: number;
  conversionRate: number;
  conversionRateChange: number;
  pipelineValue: number;
  pipelineValueChange: number;
}

export interface LeadAnalytics {
  leadsOverTime: { date: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
}

export interface CampaignAnalytics {
  id: string;
  name: string;
  budget: number;
  spent: number;
  leadsGenerated: number;
  costPerLead: number;
  roi: number;
}
