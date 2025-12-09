import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

export const CartItemRow = ({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) => {
  const theme = useTheme();
  const { book } = item;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.cardAlt, borderColor: theme.colors.border }]}>
      <BookImage imageUrl={book?.imageUrl} width={70} height={90} borderRadius={12} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={1}>
          {book?.title ?? 'Книга'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
          {book?.author ?? 'Автор неизвестен'}
        </Text>
        <Text style={[styles.price, { color: theme.colors.accent }]}>
          {formatCurrency(book?.price ?? item.priceSnapshot ?? null)}
        </Text>
        <View style={styles.actions}>
          <View style={styles.quantity}>
            <Pressable onPress={onDecrement} style={styles.quantityButton}>
              <Feather name="minus" size={16} color={theme.colors.textPrimary} />
            </Pressable>
            <Text style={[styles.quantityValue, { color: theme.colors.textPrimary }]}>{item.quantity}</Text>
            <Pressable onPress={onIncrement} style={styles.quantityButton}>
              <Feather name="plus" size={16} color={theme.colors.textPrimary} />
            </Pressable>
          </View>
          <Pressable onPress={onRemove} style={styles.removeButton}>
            <Feather name="trash-2" size={16} color={theme.colors.danger} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 18,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  removeButton: {
    padding: 8,
  },
});

