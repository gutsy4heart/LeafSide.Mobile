import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { fetchOrders } from '@/services/orders';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { token, profile, status, signOut } = useAuth();

  const { data: orders = [], isFetching } = useQuery({
    queryKey: ['orders', token],
    queryFn: () => fetchOrders(token!),
    enabled: Boolean(token),
  });

  if (status !== 'authenticated' || !profile) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.textPrimary, fontSize: 18, textAlign: 'center' }}>
          Войдите, чтобы увидеть профиль и заказы.
        </Text>
        <PrimaryButton label="Войти" onPress={() => navigation.navigate('Login')} />
        <PrimaryButton variant="secondary" label="Регистрация" onPress={() => navigation.navigate('Register')} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
        {profile.firstName || profile.lastName ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}` : profile.email}
      </Text>
      <View style={[styles.card, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.textSecondary }]}>Контакты</Text>
        <Text style={{ color: theme.colors.textPrimary }}>{profile.email}</Text>
        {profile.phoneNumber ? <Text style={{ color: theme.colors.textSecondary }}>{profile.phoneNumber}</Text> : null}
        <PrimaryButton variant="ghost" label="Выйти" onPress={signOut} />
      </View>

      <View style={{ gap: 12 }}>
        <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>Мои заказы</Text>
        {isFetching ? (
          <Text style={{ color: theme.colors.textSecondary }}>Загрузка...</Text>
        ) : orders.length === 0 ? (
          <EmptyState icon="package" title="Заказов пока нет" subtitle="Сделайте первый заказ" />
        ) : (
          orders.map((order) => (
            <View key={order.id} style={[styles.orderCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
              <View style={styles.orderRow}>
                <Text style={{ color: theme.colors.textPrimary }}>#{order.id.slice(0, 6)}</Text>
                <Text style={{ color: theme.colors.accent }}>{formatCurrency(order.totalAmount)}</Text>
              </View>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
                {new Date(order.createdAt).toLocaleDateString('ru-RU')} · {order.status}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
                {order.items.length} товаров
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 20 },
  heading: { fontSize: 26, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 6 },
  cardTitle: { fontWeight: '600', fontSize: 16 },
  orderCard: { borderWidth: 1, borderRadius: 16, padding: 14, gap: 6 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 20 },
});

