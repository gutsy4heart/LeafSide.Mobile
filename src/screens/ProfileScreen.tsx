import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ShimmerLoader } from '@/components/ShimmerLoader';
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <LinearGradient
          colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centerContent}>
          <View style={[styles.loginCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassMedium, theme.colors.glassLight, theme.colors.glass]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={[styles.loginIcon, { backgroundColor: theme.colors.accentGlow }]}>
              <Feather name="user" size={48} color={theme.colors.accent} />
            </View>
            <Text style={[styles.loginTitle, { color: theme.colors.textPrimary }]}>
              Добро пожаловать!
            </Text>
            <Text style={[styles.loginSubtitle, { color: theme.colors.textSecondary }]}>
              Войдите, чтобы увидеть профиль и заказы
            </Text>
            <View style={styles.loginActions}>
              <PrimaryButton 
                label="Войти" 
                onPress={() => navigation.navigate('Login')}
                icon={<Feather name="log-in" size={18} color="#0d1b2a" />}
              />
              <PrimaryButton 
                variant="glass" 
                label="Регистрация" 
                onPress={() => navigation.navigate('Register')}
                icon={<Feather name="user-plus" size={18} color={theme.colors.textPrimary} />}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { borderColor: theme.colors.borderAccent }]}>
          <LinearGradient
            colors={[theme.colors.glassMedium, theme.colors.glassLight, theme.colors.glass]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glassOverlay}
          />
          <View style={[styles.avatarContainer, { borderColor: theme.colors.accent }]}>
            <LinearGradient
              colors={[theme.colors.accentLight, theme.colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarText}>
                {(profile.firstName?.[0] || profile.email?.[0] || 'U').toUpperCase()}
              </Text>
            </LinearGradient>
          </View>
          <View style={{ flex: 1, zIndex: 1 }}>
            <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>
              {profile.firstName || profile.lastName 
                ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() 
                : 'Пользователь'}
            </Text>
            <View style={styles.emailContainer}>
              <Feather name="mail" size={14} color={theme.colors.textMuted} />
              <Text style={[styles.profileEmail, { color: theme.colors.textMuted }]}>
                {profile.email}
              </Text>
            </View>
            {profile.phoneNumber && (
              <View style={styles.phoneContainer}>
                <Feather name="phone" size={14} color={theme.colors.textMuted} />
                <Text style={[styles.profilePhone, { color: theme.colors.textMuted }]}>
                  {profile.phoneNumber}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassLight, theme.colors.glass]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={[styles.statIcon, { backgroundColor: theme.colors.accentGlow }]}>
              <Feather name="package" size={24} color={theme.colors.accent} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
              {orders.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Заказов
            </Text>
          </View>

          <View style={[styles.statCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassLight, theme.colors.glass]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={[styles.statIcon, { backgroundColor: theme.colors.accentGlow }]}>
              <Feather name="shopping-bag" size={24} color={theme.colors.accent} />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
              {orders.reduce((sum, order) => sum + order.items.length, 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Товаров
            </Text>
          </View>
        </View>

        {/* Orders Section */}
        <View style={styles.ordersSection}>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionIcon, { backgroundColor: theme.colors.accentGlow }]}>
              <Feather name="list" size={20} color={theme.colors.accent} />
            </View>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Мои заказы
            </Text>
          </View>

          {isFetching ? (
            <View style={{ gap: 12 }}>
              <ShimmerLoader width="100%" height={120} />
              <ShimmerLoader width="100%" height={120} />
            </View>
          ) : orders.length === 0 ? (
            <View style={[styles.emptyCard, { borderColor: theme.colors.borderLight }]}>
              <LinearGradient
                colors={[theme.colors.glassLight, theme.colors.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <EmptyState 
                icon="package" 
                title="Заказов пока нет" 
                subtitle="Сделайте первый заказ" 
              />
            </View>
          ) : (
            <View style={styles.ordersList}>
              {orders.map((order, index) => (
                <View 
                  key={order.id} 
                  style={[
                    styles.orderCard, 
                    { 
                      borderColor: theme.colors.borderLight,
                      marginBottom: index === orders.length - 1 ? 0 : 12,
                    }
                  ]}
                >
                  <LinearGradient
                    colors={[theme.colors.glassMedium, theme.colors.glassLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.glassOverlay}
                  />
                  <View style={styles.orderHeader}>
                    <View style={styles.orderIdContainer}>
                      <View style={[styles.orderIconSmall, { backgroundColor: theme.colors.accentGlow }]}>
                        <Feather name="file-text" size={16} color={theme.colors.accent} />
                      </View>
                      <Text style={[styles.orderId, { color: theme.colors.textPrimary }]}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={[styles.orderAmount, { color: theme.colors.accentLight }]}>
                      {formatCurrency(order.totalAmount)}
                    </Text>
                  </View>
                  
                  <View style={styles.orderMeta}>
                    <View style={styles.orderMetaItem}>
                      <Feather name="calendar" size={12} color={theme.colors.textMuted} />
                      <Text style={[styles.orderMetaText, { color: theme.colors.textSecondary }]}>
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </Text>
                    </View>
                    <View style={styles.orderMetaItem}>
                      <Feather name="package" size={12} color={theme.colors.textMuted} />
                      <Text style={[styles.orderMetaText, { color: theme.colors.textSecondary }]}>
                        {order.items.length} товаров
                      </Text>
                    </View>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: theme.colors.successGlass }]}>
                    <View style={[styles.statusDot, { backgroundColor: theme.colors.success }]} />
                    <Text style={[styles.statusText, { color: theme.colors.textPrimary }]}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <PrimaryButton 
            variant="glass" 
            label="Выйти из аккаунта" 
            onPress={signOut}
            icon={<Feather name="log-out" size={18} color={theme.colors.textPrimary} />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  content: { 
    padding: 16, 
    gap: 16,
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 32,
    borderWidth: 2,
    gap: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  loginIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.6,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  loginActions: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: 0,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    overflow: 'hidden',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0d1b2a',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginBottom: 5,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profilePhone: {
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.6,
    zIndex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    zIndex: 1,
  },
  ordersSection: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  emptyCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  ordersList: {
    gap: 0,
  },
  orderCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  orderMeta: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 1,
  },
  orderMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderMetaText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
    zIndex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  logoutSection: {
    marginTop: 6,
  },
});
