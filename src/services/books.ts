import type { Book } from '@/types/book';

import { apiFetch } from './apiClient';

export const fetchBooks = () => apiFetch<Book[]>('/api/books');

export const fetchBookById = (bookId: string) => apiFetch<Book>(`/api/books/${bookId}`);

