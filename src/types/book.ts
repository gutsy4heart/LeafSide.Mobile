export interface Book {
  id: string;
  title: string;
  description: string;
  author: string;
  genre: string;
  publishing?: string;
  created?: number;
  imageUrl?: string;
  price: number;
  isbn?: string;
  language?: string;
  pageCount?: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BookCollection = Book[];

