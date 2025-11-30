import { useQuery } from '@tanstack/react-query';

import { fetchBooks } from '@/services/books';

export const useBooks = () =>
  useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

