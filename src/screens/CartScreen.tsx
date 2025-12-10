import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.accentGlow }]}>
            <Feather name="shopping-cart" size={28} color={theme.colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
              Корзина
            </Text>
            {cart.items.length > 0 && (
              <Text style={[styles.itemCount, { color: theme.colors.textMuted }]}>
                {cart.items.length} {cart.items.length === 1 ? 'товар' : 'товара'}
              </Text>
            )}
          </View>
          {isSyncing && (
            <View style={[styles.syncingBadge, { backgroundColor: theme.colors.accentGlow }]}>
              <ActivityIndicator size="small" color={theme.colors.accent} />
            </View>
          )}
        </View>

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
            
            <View style={[styles.totalCard, { borderColor: theme.colors.borderAccent }]}>
              <LinearGradient
                colors={[theme.colors.glassMedium, theme.colors.glassLight, theme.colors.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              
              <View style={[styles.summaryRow, { borderBottomColor: theme.colors.borderLight }]}>
                <View style={styles.summaryLabelContainer}>
                  <Feather name="package" size={16} color={theme.colors.textMuted} />
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Товаров
                  </Text>
                </View>
                <Text style={[styles.summaryValue, { color: theme.colors.textPrimary }]}>
                  {cart.items.length}
                </Text>
              </View>
              
              <View style={styles.totalRow}>
                <View style={styles.totalLabelContainer}>
                  <View style={[styles.totalIcon, { backgroundColor: theme.colors.accentGlow }]}>
                    <Feather name="dollar-sign" size={20} color={theme.colors.accent} />
                  </View>
                  <Text style={[styles.totalLabel, { color: theme.colors.textPrimary }]}>
                    Итого
                  </Text>
                </View>
                <Text style={[styles.totalAmount, { color: theme.colors.accentLight }]}>
                  {formatCurrency(total)}
                </Text>
              </View>
              
              <View style={styles.actions}>
                <PrimaryButton 
                  label="Оформить заказ" 
                  onPress={handleCheckout}
                  icon={<Feather name="credit-card" size={18} color="#0d1b2a" />}
                />
                <PrimaryButton 
                  variant="glass" 
                  label="Очистить корзину" 
                  onPress={clear}
                  icon={<Feather name="trash-2" size={18} color={theme.colors.textPrimary} />}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

CartScreen.displayName = 'CartScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  itemCount: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  syncingBadge: {
    padding: 8,
    borderRadius: 16,
  },
  gap: {
    gap: 12,
  },
  totalCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 18,
    gap: 14,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
    marginTop: 6,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    zIndex: 1,
  },
  summaryLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  totalLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  actions: {
    gap: 10,
    marginTop: 6,
    zIndex: 1,
  },
});

