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

export const login = (payload: LoginPayload) => {
  const requestBody = {
    Email: payload.email,
    Password: payload.password,
  };
  console.log('[AUTH] Login request body:', requestBody);
  return apiFetch<LoginResponse>('/api/account/login', {
    method: 'POST',
    body: requestBody,
  });
};

export const register = (payload: RegisterPayload) =>
  apiFetch<void>('/api/account/register', {
    method: 'POST',
    body: {
      Email: payload.email,
      Password: payload.password,
      FirstName: payload.firstName,
      LastName: payload.lastName,
      PhoneNumber: payload.phoneNumber,
      CountryCode: payload.countryCode,
      Gender: payload.gender,
    },
  });

export const getProfile = (token: string) =>
  apiFetch<UserProfile>('/api/account/profile', {
    token,
  });

export const updateProfile = (token: string, payload: UpdateProfilePayload) =>
  apiFetch<UserProfile>('/api/account/profile', {
    method: 'PUT',
    token,
    body: {
      FirstName: payload.firstName,
      LastName: payload.lastName,
      PhoneNumber: payload.phoneNumber,
      CountryCode: payload.countryCode,
      Gender: payload.gender,
    },
  });

export const refreshToken = (token: string) =>
  apiFetch<LoginResponse>('/api/account/refresh', {
    method: 'POST',
    body: { token },
  });

