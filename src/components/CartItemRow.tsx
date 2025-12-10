import React, { useCallback, useMemo } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { BookImage } from '@/components/BookImage';
import { useTheme } from '@/theme';
import type { CartItem } from '@/types/cart';
import { formatCurrency } from '@/utils/format';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItemRow = React.memo<CartItemRowProps>(({ item, onIncrement, onDecrement, onRemove }) => {
  const theme = useTheme();
  const { book } = item;

  const handleIncrement = useCallback(() => {
    onIncrement();
  }, [onIncrement]);

  const handleDecrement = useCallback(() => {
    onDecrement();
  }, [onDecrement]);

  const handleRemove = useCallback(() => {
    onRemove();
  }, [onRemove]);

  const price = useMemo(
    () => formatCurrency(book?.price ?? item.priceSnapshot ?? null),
    [book?.price, item.priceSnapshot]
  );

  return (
    <View style={[styles.container, { borderColor: theme.colors.borderLight }]}>
      <LinearGradient
        colors={[theme.colors.glassLight, theme.colors.glass]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.glassOverlay}
      />
      <BookImage imageUrl={book?.imageUrl} width={80} height={100} borderRadius={14} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {book?.title ?? 'Book'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
          {book?.author ?? 'Unknown author'}
        </Text>
        <Text style={[styles.price, { color: theme.colors.accent }]}>{price}</Text>
        <View style={styles.actions}>
          <View style={styles.quantity}>
            <Pressable
              onPress={handleDecrement}
              style={({ pressed }) => [
                styles.quantityButton,
                { borderColor: theme.colors.borderLight, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Feather name="minus" size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <Text style={[styles.quantityValue, { color: theme.colors.textPrimary }]}>{item.quantity}</Text>
            <Pressable
              onPress={handleIncrement}
              style={({ pressed }) => [
                styles.quantityButton,
                { borderColor: theme.colors.borderLight, opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Feather name="plus" size={16} color={theme.colors.textPrimary} />
            </Pressable>
          </View>
          <Pressable
            onPress={handleRemove}
            style={({ pressed }) => [
              styles.removeButton,
              { backgroundColor: theme.colors.danger + '20', opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="trash-2" size={18} color={theme.colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.bookId === nextProps.item.bookId &&
    prevProps.item.quantity === nextProps.item.quantity &&
    prevProps.item.book?.price === nextProps.item.book?.price
  );
});

CartItemRow.displayName = 'CartItemRow';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    zIndex: 0,
  },
  content: {
    flex: 1,
    gap: 6,
    zIndex: 1,
    position: 'relative',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  quantityValue: {
    minWidth: 28,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

