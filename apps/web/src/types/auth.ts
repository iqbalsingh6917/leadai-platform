export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  role: 'admin' | 'manager' | 'agent';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
