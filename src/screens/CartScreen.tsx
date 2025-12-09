import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CartItemRow } from '@/components/CartItemRow';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const CartScreen = () => {
  const theme = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cart, updateQuantity, removeItem, clear, isSyncing } = useCart();

  const total = cart.items.reduce((acc, item) => {
    const price = item.book?.price ?? item.priceSnapshot ?? null;
    return acc + (price ?? 0) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (!token) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Checkout');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Корзина</Text>
      {isSyncing && <ActivityIndicator color={theme.colors.accent} />}
      {cart.items.length === 0 ? (
        <EmptyState icon="shopping-bag" title="Корзина пуста" subtitle="Добавьте книги из каталога" />
      ) : (
        <View style={styles.gap}>
          {cart.items.map((item) => (
            <CartItemRow
              key={item.bookId}
              item={item}
              onIncrement={() => updateQuantity(item.bookId, item.quantity + 1)}
              onDecrement={() => updateQuantity(item.bookId, item.quantity - 1)}
              onRemove={() => removeItem(item.bookId)}
            />
          ))}
          <View style={[styles.totalCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
            <View style={styles.totalRow}>
              <Text style={{ color: theme.colors.textSecondary }}>Товаров</Text>
              <Text style={{ color: theme.colors.textPrimary }}>{cart.items.length}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={{ color: theme.colors.textPrimary, fontSize: 18, fontWeight: '700' }}>Итого</Text>
              <Text style={{ color: theme.colors.accent, fontSize: 18, fontWeight: '700' }}>
                {formatCurrency(total)}
              </Text>
            </View>
            <PrimaryButton label="Перейти к оформлению" onPress={handleCheckout} />
            <PrimaryButton variant="ghost" label="Очистить корзину" onPress={clear} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
  },
  gap: {
    gap: 16,
  },
  totalCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

