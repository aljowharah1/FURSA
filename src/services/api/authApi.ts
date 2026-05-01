import { api } from './client';

interface AuthResponse {
  user: any;
  token: string;
}

interface MeResponse {
  user: any;
}

export const authApi = {
  // Register a new user account
  register(data: { email: string; password: string; name: string; university?: string; major?: string }) {
    return api.post<AuthResponse>('/auth/register', data);
  },

  // Login with email and password
  login(data: { email: string; password: string }) {
    return api.post<AuthResponse>('/auth/login', data);
  },

  // Get the currently authenticated user
  getMe() {
    return api.get<MeResponse>('/auth/me');
  },
};
