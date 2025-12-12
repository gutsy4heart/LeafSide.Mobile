import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View, Animated } from 'react-native';
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
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePress = useCallback(() => {
    if (typeof onPress === 'function') {
      if (onPress.length === 0) {
        (onPress as () => void)();
      } else {
        (onPress as (book: Book) => void)(book);
      }
    }
  }, [onPress, book]);

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handleAdd = useCallback(async () => {
    if (isAdding) {
      console.log('[BookCard] Ignoring double click for:', book.title);
      return;
    }
    
    setIsAdding(true);
    console.log('[BookCard] Adding to cart:', book.title);
    
    try {
      onAddToCart?.(book);
      
      // Bounce animation on add
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          useNativeDriver: true,
          speed: 50,
          bounciness: 12,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 50,
          bounciness: 12,
        }),
      ]).start();
    } finally {
      // Reset after 1 second
      setTimeout(() => setIsAdding(false), 1000);
    }
  }, [isAdding, onAddToCart, book, scaleAnim]);

  const hasImage = useMemo(() => 
    !imageError && book.imageUrl && book.imageUrl.trim() !== '', 
    [book.imageUrl, imageError]
  );
  
  const isAvailable = useMemo(
    () => book.isAvailable && book.price !== null && book.price !== undefined,
    [book.isAvailable, book.price]
  );

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: theme.colors.borderLight,
          transform: [{ scale: scaleAnim }],
          shadowColor: theme.colors.accent,
          shadowOpacity: 0.2,
        },
      ]}
    >
      <Pressable
        style={styles.pressable}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Enhanced Glassmorphism overlay */}
        <LinearGradient
          colors={[theme.colors.glassMedium, theme.colors.glassLight, theme.colors.glass]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.glassOverlay}
        />

        {/* Image Section */}
        <View style={styles.imageContainer}>
          {hasImage ? (
            <Image
              source={{ uri: book.imageUrl }}
              style={styles.cover}
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <LinearGradient
              colors={['#0f172a', '#1e293b', '#334155']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.coverPlaceholder}
            >
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(52, 211, 153, 0.15)' }]}>
                <Feather name="book-open" size={32} color={theme.colors.accentLight} />
              </View>
            </LinearGradient>
          )}
          
          {/* Gradient overlay on image */}
          <LinearGradient
            colors={['transparent', 'rgba(10, 14, 26, 0.7)']}
            style={styles.imageGradient}
          />
          
          {!isAvailable && (
            <View style={[styles.unavailableBadge, { backgroundColor: theme.colors.danger }]}>
              <Feather name="x-circle" size={10} color="#fff" style={{ marginRight: 3 }} />
              <Text style={styles.unavailableText}>Unavailable</Text>
            </View>
          )}
          
          {book.genre && (
            <View style={[
              styles.genreBadge, 
              { 
                backgroundColor: theme.colors.accentGlowStrong,
                borderColor: theme.colors.borderAccent,
              }
            ]}>
              <Text style={[styles.genreText, { color: theme.colors.accentLight }]}>
                {book.genre}
              </Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
              {book.title}
            </Text>
          </View>

          <Text style={[styles.author, { color: theme.colors.textMuted }]} numberOfLines={1}>
            <Feather name="user" size={10} color={theme.colors.textMuted} /> {book.author}
          </Text>

          {book.description && (
            <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
              {truncate(book.description, 80)}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: theme.colors.accentLight }]}>
                {formatCurrency(book.price)}
              </Text>
              {book.publishing && (
                <View style={styles.publishingContainer}>
                  <Feather name="book" size={9} color={theme.colors.textMuted} />
                  <Text style={[styles.publishing, { color: theme.colors.textMuted }]} numberOfLines={1}>
                    {book.publishing}
                  </Text>
                </View>
              )}
            </View>
            
            {onAddToCart && isAvailable && (
              <Pressable
                style={({ pressed }) => [
                  styles.addButton,
                  {
                    opacity: isAdding ? 0.5 : (pressed ? 0.8 : 1),
                    transform: [{ scale: pressed ? 0.9 : 1 }],
                  },
                ]}
                onPress={handleAdd}
                disabled={isAdding}
              >
                <LinearGradient
                  colors={[theme.colors.accentLight, theme.colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Feather name={isAdding ? "check" : "plus"} size={18} color="#0d1b2a" />
                </LinearGradient>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
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
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 8,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  pressable: {
    width: '100%',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: 0,
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    height: 200,
    backgroundColor: '#0f172a',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a2332',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  unavailableBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  unavailableText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  genreBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
    zIndex: 2,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  genreText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  content: {
    padding: 12,
    gap: 6,
    position: 'relative',
    zIndex: 1,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.85,
    marginTop: 1,
  },
  description: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
    opacity: 0.75,
  },
  footer: {
    marginTop: 8,
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
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  publishingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  publishing: {
    fontSize: 10,
    opacity: 0.7,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 8,
    overflow: 'hidden',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
