import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme';
import type { Book } from '@/types/book';
import { formatCurrency, truncate } from '@/utils/format';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void | (() => void);
  onAddToCart?: (book: Book) => void;
}

export const BookCard = ({ book, onPress, onAddToCart }: BookCardProps) => {
  const theme = useTheme();
  const handlePress = () => {
    if (typeof onPress === 'function') {
      if (onPress.length === 0) {
        (onPress as () => void)();
      } else {
        (onPress as (book: Book) => void)(book);
      }
    }
  };
  const handleAdd = () => onAddToCart?.(book);

  const hasImage = book.imageUrl && book.imageUrl.trim() !== '';
  const isAvailable = book.isAvailable && book.price !== null && book.price !== undefined;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={handlePress}
    >
      {hasImage ? (
        <Image
          source={{ uri: book.imageUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.cardAlt }]}>
          <Feather name="book-open" size={32} color={theme.colors.textMuted} />
        </View>
      )}
      
      {!isAvailable && (
        <View style={[styles.unavailableBadge, { backgroundColor: theme.colors.danger }]}>
          <Text style={styles.unavailableText}>Недоступна</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
            {book.title}
          </Text>
          {book.genre && (
            <View style={[styles.genreBadge, { backgroundColor: theme.colors.cardAlt }]}>
              <Text style={[styles.genreText, { color: theme.colors.accent }]}>{book.genre}</Text>
            </View>
          )}
        </View>

        <Text style={[styles.author, { color: theme.colors.textMuted }]} numberOfLines={1}>
          {book.author}
        </Text>

        {book.description && (
          <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {truncate(book.description, 80)}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.colors.accent }]}>
              {formatCurrency(book.price)}
            </Text>
            {book.publishing && (
              <Text style={[styles.publishing, { color: theme.colors.textMuted }]} numberOfLines={1}>
                {book.publishing}
              </Text>
            )}
          </View>
          {onAddToCart && isAvailable && (
            <Pressable
              style={[styles.addButton, { backgroundColor: theme.colors.accent }]}
              onPress={handleAdd}
            >
              <Feather name="shopping-cart" size={18} color="#062016" />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: '#1a2332',
  },
  coverPlaceholder: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  unavailableText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  genreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genreText: {
    fontSize: 11,
    fontWeight: '600',
  },
  author: {
    fontSize: 14,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
  },
  publishing: {
    fontSize: 11,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
