import type { CreateOrderPayload, Order } from '@/types/order';

import { apiFetch } from './apiClient';

export const createOrder = (token: string, payload: CreateOrderPayload) =>
  apiFetch<Order>('/api/orders', {
    method: 'POST',
    token,
    body: payload,
  });

export const fetchOrders = (token: string) =>
  apiFetch<Order[]>('/api/orders', {
    token,
  });

