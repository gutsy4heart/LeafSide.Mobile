import React, { useCallback, useMemo } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/theme';
import type { Book } from '@/types/book';
import { formatCurrency, truncate } from '@/utils/format';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void | (() => void);
  onAddToCart?: (book: Book) => void;
}

export const BookCard = React.memo<BookCardProps>(({ book, onPress, onAddToCart }) => {
  const theme = useTheme();
  
  const handlePress = useCallback(() => {
    if (typeof onPress === 'function') {
      if (onPress.length === 0) {
        (onPress as () => void)();
      } else {
        (onPress as (book: Book) => void)(book);
      }
    }
  }, [onPress, book]);

  const handleAdd = useCallback(() => {
    onAddToCart?.(book);
  }, [onAddToCart, book]);

  const hasImage = useMemo(() => book.imageUrl && book.imageUrl.trim() !== '', [book.imageUrl]);
  const isAvailable = useMemo(
    () => book.isAvailable && book.price !== null && book.price !== undefined,
    [book.isAvailable, book.price]
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          borderColor: theme.colors.borderLight,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={handlePress}
    >
      {/* Glassmorphism overlay */}
      <LinearGradient
        colors={[theme.colors.glassLight, theme.colors.glass]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassOverlay}
      />
      <View style={styles.imageContainer}>
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
        
        {book.genre && (
          <View style={[styles.genreBadge, { backgroundColor: theme.colors.accent + '20', borderColor: theme.colors.accent + '40' }]}>
            <Text style={[styles.genreText, { color: theme.colors.accent }]}>{book.genre}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
            {book.title}
          </Text>
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
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor: theme.colors.accent,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
              onPress={handleAdd}
            >
              <Feather name="shopping-cart" size={18} color="#062016" />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimization
  return (
    prevProps.book.id === nextProps.book.id &&
    prevProps.book.title === nextProps.book.title &&
    prevProps.book.price === nextProps.book.price &&
    prevProps.book.isAvailable === nextProps.book.isAvailable
  );
});

BookCard.displayName = 'BookCard';

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    zIndex: 0,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 220,
    backgroundColor: '#1a2332',
  },
  coverPlaceholder: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  unavailableText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  genreBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  genreText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    padding: 18,
    gap: 10,
    position: 'relative',
    zIndex: 1,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
    opacity: 0.7,
  },
  footer: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceContainer: {
    flex: 1,
    gap: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  publishing: {
    fontSize: 11,
    opacity: 0.6,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
