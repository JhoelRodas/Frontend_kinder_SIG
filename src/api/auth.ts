import apiClient from './api-client';

export type UserResponse = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
};

export const authService = {
  async login(username: string, password: string): Promise<TokenResponse> {
    const response = await apiClient.post('/login/', {
      username,
      password,
    });
    return response;
  },

  async register(data: RegisterRequest): Promise<UserResponse> {
    const response = await apiClient.post('/auth/register', data);
    return response;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get('/auth/me');
    return response;
  },

  logout(): void {
    localStorage.removeItem('accessToken');
  },
};
