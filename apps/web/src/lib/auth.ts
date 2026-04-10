import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
