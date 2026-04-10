export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  usersLimit: number;
  leadsLimit: number;
  campaignsLimit: number;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: string;
  razorpaySubscriptionId?: string;
  currentPeriodEnd?: string;
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrder {
  planId: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  planId: string;
}
