import type { Book } from '@/types/book';

import { apiFetch } from './apiClient';

// Backend uses /api/Books (capital B) based on [Route("api/[controller]")]
export const fetchBooks = () => apiFetch<Book[]>('/api/Books');

export const fetchBookById = (bookId: string) => apiFetch<Book>(`/api/Books/${bookId}`);

