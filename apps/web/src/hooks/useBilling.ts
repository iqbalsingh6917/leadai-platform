'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Plan, Subscription, RazorpayOrder } from '@/types/billing';

const BILLING_KEY = 'billing';

export function usePlans() {
  return useQuery({
    queryKey: [BILLING_KEY, 'plans'],
    queryFn: async () => {
      const response = await api.get<Plan[]>('/billing/plans');
      return response.data;
    },
  });
}

export function useSubscription() {
  return useQuery({
    queryKey: [BILLING_KEY, 'subscription'],
    queryFn: async () => {
      const response = await api.get<Subscription>('/billing/subscription');
      return response.data;
    },
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (data: { planId: string }) => {
      const response = await api.post<RazorpayOrder>('/billing/order', data);
      return response.data;
    },
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      razorpayPaymentId: string;
      razorpayOrderId: string;
      razorpaySignature: string;
      planId: string;
    }) => {
      const response = await api.post<Subscription>('/billing/verify', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BILLING_KEY] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<Subscription>('/billing/cancel');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BILLING_KEY] });
    },
  });
}
