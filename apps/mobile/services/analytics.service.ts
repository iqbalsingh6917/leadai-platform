import { api, USE_MOCK, mockFallback, MOCK_ANALYTICS } from './api';
import type { Analytics } from '@/types';

export const analyticsService = {
  async getDashboardAnalytics(token: string): Promise<Analytics> {
    if (USE_MOCK) {
      return mockFallback(MOCK_ANALYTICS);
    }
    return api.get<Analytics>('/analytics/dashboard', token);
  },

  async getLeadTrends(
    token: string,
    days: number,
  ): Promise<{ date: string; count: number }[]> {
    if (USE_MOCK) {
      const trends = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 12) + 2,
        };
      });
      return mockFallback(trends);
    }
    return api.get<{ date: string; count: number }[]>(`/analytics/trends?days=${days}`, token);
  },
};
