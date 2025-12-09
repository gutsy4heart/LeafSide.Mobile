import { useMemo, useState } from 'react';

import type { Book } from '@/types/book';

const normalize = (value: string) => value.toLowerCase().trim();

export const useBookFilters = (books: Book[] = []) => {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = books;

    if (genre) {
      result = result.filter((book) => normalize(book.genre) === normalize(genre));
    }

    if (query.trim()) {
      const safeQuery = normalize(query);
      result = result.filter(
        (book) =>
          normalize(book.title).includes(safeQuery) ||
          normalize(book.author).includes(safeQuery) ||
          normalize(book.description ?? '').includes(safeQuery),
      );
    }

    return result;
  }, [books, genre, query]);

  const featured = useMemo(() => filtered.slice(0, 4), [filtered]);

  const trending = useMemo(
    () =>
      [...books]
        .filter((book) => book.price !== null && book.price !== undefined)
        .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        .slice(0, 6),
    [books],
  );

  return {
    query,
    setQuery,
    genre,
    setGenre,
    filtered,
    featured,
    trending,
  };
};

