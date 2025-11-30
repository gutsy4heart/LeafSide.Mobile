import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import type { Book } from '@/types/book';
import { formatCurrency, truncate } from '@/utils/format';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
}

export const BookCard = ({ book, onPress, onAddToCart }: BookCardProps) => {
  const theme = useTheme();
  const handlePress = () => onPress(book);
  const handleAdd = () => onAddToCart?.(book);

  return (
    <Pressable style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]} onPress={handlePress}>
      {book.imageUrl ? (
        <Image source={{ uri: book.imageUrl }} style={styles.cover} />
      ) : (
        <View style={styles.coverPlaceholder}>
          <Feather name="book" size={28} color={theme.colors.textMuted} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={[styles.author, { color: theme.colors.textMuted }]} numberOfLines={1}>
          {book.author}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {truncate(book.description ?? '', 90)}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.price, { color: theme.colors.accent }]}>{formatCurrency(book.price)}</Text>
          {onAddToCart ? (
            <Pressable style={[styles.addButton, { backgroundColor: theme.colors.accent }]} onPress={handleAdd}>
              <Feather name="plus" size={16} color="#062016" />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 180,
  },
  coverPlaceholder: {
    width: '100%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  author: {
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

