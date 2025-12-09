export interface Book {
  id: string; // Guid from backend
  title: string;
  description: string;
  author: string;
  genre: string;
  publishing: string; // Required in backend
  created: string; // Year as string in backend, not number
  imageUrl: string; // Can be empty string
  price: number | null; // Can be null in backend (decimal?)
  isbn: string; // Can be empty string
  language: string; // Defaults to "Russian" in backend
  pageCount: number;
  isAvailable: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type BookCollection = Book[];

