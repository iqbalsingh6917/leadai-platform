import { api, USE_MOCK, mockFallback, MOCK_USER } from './api';
import type { User } from '@/types';

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RegisterResponse {
  accessToken: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    if (USE_MOCK) {
      if (email === 'demo@leadai.io' && password === 'demo1234') {
        return mockFallback({ accessToken: 'mock_token_abc123', user: MOCK_USER });
      }
      // Accept any credentials in mock mode for dev convenience
      return mockFallback({
        accessToken: 'mock_token_abc123',
        user: { ...MOCK_USER, email, name: email.split('@')[0] },
      });
    }
    return api.post<LoginResponse>('/auth/login', { email, password });
  },

  async register(
    name: string,
    email: string,
    password: string,
    tenantName: string,
  ): Promise<RegisterResponse> {
    if (USE_MOCK) {
      return mockFallback({
        accessToken: 'mock_token_abc123',
        user: { ...MOCK_USER, name, email },
      });
    }
    return api.post<RegisterResponse>('/auth/register', { name, email, password, tenantName });
  },

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    if (USE_MOCK) {
      return mockFallback({ accessToken: 'mock_token_refreshed' });
    }
    return api.post<{ accessToken: string }>('/auth/refresh', { token });
  },
};
