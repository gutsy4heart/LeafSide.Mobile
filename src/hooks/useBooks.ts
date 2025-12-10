import { useQuery } from '@tanstack/react-query';

import { fetchBooks } from '@/services/books';

export const useBooks = () =>
  useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    retry: 2,
    onError: (error) => {
      console.error('[useBooks] Error fetching books:', error);
    },
    onSuccess: (data) => {
      console.log('[useBooks] Books loaded:', data?.length ?? 0);
    },
  });

