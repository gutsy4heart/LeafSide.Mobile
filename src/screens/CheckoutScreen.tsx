import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { EmptyState } from '@/components/EmptyState';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import { createOrder } from '@/services/orders';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const CheckoutScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { token, profile } = useAuth();
  const { cart, clear } = useCart();

  const [form, setForm] = useState({
    customerName: `${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`.trim(),
    customerEmail: profile?.email ?? '',
    customerPhone: profile?.phoneNumber ?? '',
    shippingAddress: '',
    notes: '',
  });

  const total = cart.items.reduce(
    (acc, item) => acc + (item.book?.price ?? item.priceSnapshot ?? 0) * item.quantity,
    0,
  );

  const mutation = useMutation({
    mutationFn: () => {
      if (!token) throw new Error('You need to sign in');
      return createOrder(token, {
        items: cart.items.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingAddress: form.shippingAddress,
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone,
        notes: form.notes,
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Order created!');
      clear();
      navigation.navigate('Tabs');
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });

  if (!token) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 16 }}>
          Sign in to complete your order.
        </Text>
        <PrimaryButton label="Sign In" onPress={() => navigation.navigate('Login')} />
      </View>
    );
  }

  if (cart.items.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <EmptyState icon="shopping-bag" title="Cart is empty" subtitle="Add books before checkout" />
        <PrimaryButton label="Back to Catalog" onPress={() => navigation.navigate('Tabs')} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Checkout</Text>
      <Text style={{ color: theme.colors.textSecondary }}>
        Total Amount: {formatCurrency(total)}
      </Text>

      {(['customerName', 'customerEmail', 'customerPhone', 'shippingAddress'] as const).map((field) => {
        const keyboardType =
          field === 'customerPhone' ? 'phone-pad' : field === 'customerEmail' ? 'email-address' : 'default';
        const autoCapitalize =
          field === 'customerEmail' || field === 'customerPhone' ? 'none' : 'sentences';

        return (
          <View key={field}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>{field}</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              value={form[field]}
              onChangeText={(value) => setForm((prev) => ({ ...prev, [field]: value }))}
              placeholderTextColor={theme.colors.textMuted}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
            />
          </View>
        );
      })}

      <View>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>Comment</Text>
        <TextInput
          style={[
            styles.input,
            styles.notes,
            { borderColor: theme.colors.border, color: theme.colors.textPrimary },
          ]}
          multiline
          numberOfLines={4}
          value={form.notes}
          onChangeText={(value) => setForm((prev) => ({ ...prev, notes: value }))}
        />
      </View>

      <PrimaryButton
        label="Confirm Order"
        onPress={() => mutation.mutate()}
        loading={mutation.isPending}
        disabled={cart.items.length === 0 || mutation.isPending}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 16 },
  heading: { fontSize: 24, fontWeight: '700' },
  label: { marginBottom: 6, textTransform: 'capitalize' },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
  },
  notes: { minHeight: 120, textAlignVertical: 'top' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
});

