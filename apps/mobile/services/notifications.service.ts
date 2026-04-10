import { api, USE_MOCK, mockFallback, MOCK_NOTIFICATIONS } from './api';
import type { Notification } from '@/types';

const notifications = [...MOCK_NOTIFICATIONS];

export const notificationsService = {
  async getNotifications(token: string): Promise<Notification[]> {
    if (USE_MOCK) {
      return mockFallback([...notifications]);
    }
    return api.get<Notification[]>('/notifications', token);
  },

  async markAsRead(token: string, id: string): Promise<void> {
    if (USE_MOCK) {
      const n = notifications.find(x => x.id === id);
      if (n) n.isRead = true;
      return mockFallback(undefined as unknown as void);
    }
    return api.patch<void>(`/notifications/${id}/read`, {}, token);
  },

  async markAllRead(token: string): Promise<void> {
    if (USE_MOCK) {
      notifications.forEach(n => (n.isRead = true));
      return mockFallback(undefined as unknown as void);
    }
    return api.post<void>('/notifications/read-all', {}, token);
  },
};
