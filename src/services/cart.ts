import type { CartResponse } from '@/types/cart';

import { apiFetch } from './apiClient';

export const fetchCart = (token: string) =>
  apiFetch<CartResponse>('/api/cart', {
    token,
  });

export const addOrUpdateCartItem = (token: string, bookId: string, quantity: number) =>
  apiFetch<CartResponse>('/api/cart/items', {
    method: 'POST',
    token,
    body: { bookId, quantity },
  });

export const removeCartItem = (token: string, bookId: string) =>
  apiFetch<void>(`/api/cart/items/${bookId}`, {
    method: 'DELETE',
    token,
  });

export const clearCart = (token: string) =>
  apiFetch<void>('/api/cart', {
    method: 'DELETE',
    token,
  });

