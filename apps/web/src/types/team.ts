export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'agent';
  isActive: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteTeamMember {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'manager' | 'agent';
  phone?: string;
}

export interface UpdateTeamMember {
  role?: 'admin' | 'manager' | 'agent';
  isActive?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
}
