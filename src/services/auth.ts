import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  UserProfile,
} from '@/types/user';

import { apiFetch } from './apiClient';

export interface LoginResponse {
  token: string;
}

export const login = (payload: LoginPayload) =>
  apiFetch<LoginResponse>('/api/account/login', {
    method: 'POST',
    body: payload,
  });

export const register = (payload: RegisterPayload) =>
  apiFetch<void>('/api/account/register', {
    method: 'POST',
    body: payload,
  });

export const getProfile = (token: string) =>
  apiFetch<UserProfile>('/api/account/profile', {
    token,
  });

export const updateProfile = (token: string, payload: UpdateProfilePayload) =>
  apiFetch<UserProfile>('/api/account/profile', {
    method: 'PUT',
    token,
    body: payload,
  });

export const refreshToken = (token: string) =>
  apiFetch<LoginResponse>('/api/account/refresh', {
    method: 'POST',
    body: { token },
  });

