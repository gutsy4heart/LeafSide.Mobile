import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CartItemRow } from '@/components/CartItemRow';
import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const CartScreen = React.memo(() => {
  const theme = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cart, updateQuantity, removeItem, clear, isSyncing } = useCart();

  const total = useMemo(() => {
    return cart.items.reduce((acc, item) => {
      const price = item.book?.price ?? item.priceSnapshot ?? null;
      return acc + (price ?? 0) * item.quantity;
    }, 0);
  }, [cart.items]);

  const handleCheckout = useCallback(() => {
    if (!token) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Checkout');
  }, [token, navigation]);

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
          <View style={[styles.totalCard, { borderColor: theme.colors.borderLight }]}>
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
});

CartScreen.displayName = 'CartScreen';

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
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    zIndex: 0,
  },
});

