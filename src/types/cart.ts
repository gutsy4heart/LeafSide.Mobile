import type { Book } from './book';

export interface CartItemResponse {
  bookId: string;
  quantity: number;
  priceSnapshot?: number;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
}

export interface CartItem extends CartItemResponse {
  book?: Book;
}

export interface CartState {
  id?: string;
  items: CartItem[];
  updatedAt?: string;
  source: 'remote' | 'local';
}

