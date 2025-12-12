import { apiFetch } from './apiClient';
import type { Book } from '@/types/book';

// ==================== TYPES ====================

export interface UserWithRole {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  roles: string[];
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentUsers: number;
}

export interface OrderItem {
  id: string;
  bookId: string;
  bookTitle?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userEmail?: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
  priceSnapshot?: number;
}

export interface AdminCart {
  id: string;
  userId: string;
  userEmail?: string;
  items: CartItem[];
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  language: string;
  publishedYear: number;
  price: number;
  description: string;
  imageUrl?: string;
  publishing: string;
  pageCount: number;
  isAvailable: boolean;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: string;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  gender: string;
}

// ==================== USER MANAGEMENT ====================

export const fetchUsers = (token: string) =>
  apiFetch<UserWithRole[]>('/api/admin/users', { token });

export const deleteUser = (token: string, userId: string) =>
  apiFetch<void>(`/api/admin/users/${userId}`, {
    method: 'DELETE',
    token,
  });

export const updateUserRole = (token: string, payload: UpdateUserRoleRequest) =>
  apiFetch<UserWithRole>('/api/admin/users/role', {
    method: 'PUT',
    token,
    body: payload,
  });

export const createUser = (token: string, payload: CreateUserRequest) =>
  apiFetch<UserWithRole>('/api/admin/users', {
    method: 'POST',
    token,
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

// ==================== BOOK MANAGEMENT ====================

export const fetchAllBooks = (token: string) =>
  apiFetch<Book[]>('/api/admin/books', { token });

export const createBook = (token: string, payload: CreateBookRequest) =>
  apiFetch<Book>('/api/admin/books', {
    method: 'POST',
    token,
    body: {
      Title: payload.title,
      Author: payload.author,
      ISBN: payload.isbn,
      Genre: payload.genre,
      Language: payload.language,
      PublishedYear: payload.publishedYear,
      Price: payload.price,
      Description: payload.description,
      ImageUrl: payload.imageUrl || '',
      Publishing: payload.publishing,
      PageCount: payload.pageCount,
      IsAvailable: payload.isAvailable,
    },
  });

export const updateBook = (token: string, bookId: string, payload: Partial<CreateBookRequest>) =>
  apiFetch<Book>(`/api/admin/books/${bookId}`, {
    method: 'PUT',
    token,
    body: {
      Title: payload.title,
      Author: payload.author,
      ISBN: payload.isbn,
      Genre: payload.genre,
      Language: payload.language,
      PublishedYear: payload.publishedYear,
      Price: payload.price,
      Description: payload.description,
      ImageUrl: payload.imageUrl,
      Publishing: payload.publishing,
      PageCount: payload.pageCount,
      IsAvailable: payload.isAvailable,
    },
  });

export const deleteBook = (token: string, bookId: string) =>
  apiFetch<void>(`/api/admin/books/${bookId}`, {
    method: 'DELETE',
    token,
  });

// ==================== ORDER MANAGEMENT ====================

export const fetchAllOrders = (token: string) =>
  apiFetch<Order[]>('/api/admin/orders', { token });

export const updateOrderStatus = (token: string, orderId: string, status: string) =>
  apiFetch<Order>(`/api/admin/orders/${orderId}/status`, {
    method: 'PUT',
    token,
    body: { status },
  });

// ==================== CART MANAGEMENT ====================

export const fetchAllCarts = (token: string) =>
  apiFetch<AdminCart[]>('/api/admin/carts', { token });

// ==================== STATS ====================

export const fetchAdminStats = (token: string) =>
  apiFetch<AdminStats>('/api/admin/users/stats', { token });

// ==================== HEALTH CHECK ====================

export const checkBackendHealth = (token: string) =>
  apiFetch<{ status: string; timestamp: string }>('/api/health', { token });

