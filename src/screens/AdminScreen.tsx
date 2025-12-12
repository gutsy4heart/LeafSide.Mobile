import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import type { RootStackParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminRoute } from '@/components/AdminRoute';
import {
  fetchUsers,
  fetchAllBooks,
  fetchAllOrders,
  fetchAllCarts,
  fetchAdminStats,
} from '@/services/admin';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isTablet = SCREEN_WIDTH >= 768;

type TabType = 'users' | 'books' | 'orders' | 'carts';

export const AdminScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { token, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [refreshing, setRefreshing] = useState(false);

  // Search and filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [bookSearch, setBookSearch] = useState('');
  const [bookAvailabilityFilter, setBookAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | string>('all');

  const isAdmin = profile?.roles?.includes('Admin');

  // Log access attempt for security
  useEffect(() => {
    console.log('[AdminScreen] Access attempt:', {
      isAuthenticated: Boolean(token),
      hasProfile: Boolean(profile),
      userRoles: profile?.roles,
      isAdmin,
      userEmail: profile?.email,
      hasToken: Boolean(token),
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'null',
    });

    // Автоматический редирект для не-админов после проверки профиля
    if (profile && !isAdmin) {
      console.warn('[AdminScreen] Access denied: User is not an admin');
      Alert.alert(
        'Access Denied',
        'You do not have administrator privileges.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [profile, isAdmin, token, navigation]);

  // Queries
  const { data: users = [], isFetching: usersLoading, refetch: refetchUsers, error: usersError } = useQuery({
    queryKey: ['admin-users', token],
    queryFn: async () => {
      console.log('[AdminScreen] Fetching users...');
      const result = await fetchUsers(token!);
      console.log('[AdminScreen] Users fetched:', result.length);
      return result;
    },
    enabled: Boolean(token) && isAdmin,
  });

  const { data: books = [], isFetching: booksLoading, refetch: refetchBooks, error: booksError } = useQuery({
    queryKey: ['admin-books', token],
    queryFn: async () => {
      console.log('[AdminScreen] Fetching books...');
      const result = await fetchAllBooks(token!);
      console.log('[AdminScreen] Books fetched:', result.length);
      return result;
    },
    enabled: Boolean(token) && isAdmin,
  });

  const { data: orders = [], isFetching: ordersLoading, refetch: refetchOrders, error: ordersError } = useQuery({
    queryKey: ['admin-orders', token],
    queryFn: async () => {
      console.log('[AdminScreen] Fetching orders...');
      const result = await fetchAllOrders(token!);
      console.log('[AdminScreen] Orders fetched:', result.length);
      return result;
    },
    enabled: Boolean(token) && isAdmin,
  });

  const { data: carts = [], isFetching: cartsLoading, refetch: refetchCarts, error: cartsError } = useQuery({
    queryKey: ['admin-carts', token],
    queryFn: async () => {
      console.log('[AdminScreen] Fetching carts...');
      const result = await fetchAllCarts(token!);
      console.log('[AdminScreen] Carts fetched:', result.length);
      return result;
    },
    enabled: Boolean(token) && isAdmin,
  });

  const { data: stats, refetch: refetchStats, error: statsError } = useQuery({
    queryKey: ['admin-stats', token],
    queryFn: async () => {
      console.log('[AdminScreen] Fetching stats...');
      const result = await fetchAdminStats(token!);
      console.log('[AdminScreen] Stats fetched:', result);
      return result;
    },
    enabled: Boolean(token) && isAdmin,
  });

  // Log errors
  useEffect(() => {
    if (usersError) console.error('[AdminScreen] Users error:', usersError);
    if (booksError) console.error('[AdminScreen] Books error:', booksError);
    if (ordersError) console.error('[AdminScreen] Orders error:', ordersError);
    if (cartsError) console.error('[AdminScreen] Carts error:', cartsError);
    if (statsError) console.error('[AdminScreen] Stats error:', statsError);
  }, [usersError, booksError, ordersError, cartsError, statsError]);

  // Log data status
  useEffect(() => {
    console.log('[AdminScreen] Data status:', {
      users: users.length,
      books: books.length,
      orders: orders.length,
      carts: carts.length,
      stats: stats ? 'loaded' : 'null',
      loading: { usersLoading, booksLoading, ordersLoading, cartsLoading },
    });
  }, [users, books, orders, carts, stats, usersLoading, booksLoading, ordersLoading, cartsLoading]);

  // Check if user is admin
  if (!isAdmin) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LinearGradient
          colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.centerContent}>
          <View style={[styles.accessDeniedCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassMedium, theme.colors.glassLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={[styles.iconContainer, { backgroundColor: '#EF444433' }]}>
              <Feather name="shield-off" size={48} color="#EF4444" />
            </View>
            <Text style={[styles.accessDeniedTitle, { color: theme.colors.textPrimary }]}>
              Access Denied
            </Text>
            <Text style={[styles.accessDeniedText, { color: theme.colors.textSecondary }]}>
              You don't have administrator privileges to access this section.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, { backgroundColor: theme.colors.accent }]}
            >
              <Feather name="arrow-left" size={18} color="#0d1b2a" />
              <Text style={[styles.backButtonText]}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        activeTab === 'users' && refetchUsers(),
        activeTab === 'books' && refetchBooks(),
        activeTab === 'orders' && refetchOrders(),
        activeTab === 'carts' && refetchCarts(),
      ].filter(Boolean));
    } finally {
      setRefreshing(false);
    }
  };

  // Filtered data
  const filteredUsers = users.filter(user => {
    const matchesSearch = !userSearch || 
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' ||
      (userRoleFilter === 'admin' && user.roles.includes('Admin')) ||
      (userRoleFilter === 'user' && !user.roles.includes('Admin'));
    return matchesSearch && matchesRole;
  });

  const filteredBooks = books.filter(book => {
    const matchesSearch = !bookSearch ||
      book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      book.author.toLowerCase().includes(bookSearch.toLowerCase());
    const matchesAvailability = bookAvailabilityFilter === 'all' ||
      (bookAvailabilityFilter === 'available' && book.isAvailable) ||
      (bookAvailabilityFilter === 'unavailable' && !book.isAvailable);
    return matchesSearch && matchesAvailability;
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !orderSearch ||
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'users' as const, label: 'Users', icon: 'users', count: filteredUsers.length, totalCount: users.length, color: '#3B82F6' },
    { id: 'books' as const, label: 'Books', icon: 'book', count: filteredBooks.length, totalCount: books.length, color: '#10B981' },
    { id: 'orders' as const, label: 'Orders', icon: 'package', count: filteredOrders.length, totalCount: orders.length, color: '#8B5CF6' },
    { id: 'carts' as const, label: 'Carts', icon: 'shopping-cart', count: carts.length, totalCount: carts.length, color: '#F59E0B' },
  ];

  return (
    <AdminRoute>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LinearGradient
          colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
          style={StyleSheet.absoluteFill}
        />
        <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.accent}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: '#FFA50033' }]}>
            <Feather name="shield" size={isSmallDevice ? 24 : 28} color="#FFA500" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
              Admin Panel
            </Text>
            <Text style={[styles.subheading, { color: theme.colors.textSecondary }]}>
              Welcome, {profile?.firstName || 'Admin'}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        {activeTab === 'users' && stats && (
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { borderColor: theme.colors.borderLight }]}>
              <LinearGradient
                colors={[theme.colors.glassLight, theme.colors.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <View style={[styles.statIcon, { backgroundColor: '#3B82F633' }]}>
                <Feather name="users" size={20} color="#3B82F6" />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                {stats.totalUsers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Total</Text>
            </View>

            <View style={[styles.statCard, { borderColor: theme.colors.borderLight }]}>
              <LinearGradient
                colors={[theme.colors.glassLight, theme.colors.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <View style={[styles.statIcon, { backgroundColor: '#FFA50033' }]}>
                <Feather name="shield" size={20} color="#FFA500" />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                {stats.adminUsers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Admins</Text>
            </View>

            <View style={[styles.statCard, { borderColor: theme.colors.borderLight }]}>
              <LinearGradient
                colors={[theme.colors.glassLight, theme.colors.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <View style={[styles.statIcon, { backgroundColor: '#10B98133' }]}>
                <Feather name="user" size={20} color="#10B981" />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                {stats.regularUsers}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>Regular</Text>
            </View>
          </View>
        )}

        {/* Tab Navigation */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.tab,
                  { borderColor: theme.colors.borderLight },
                  activeTab === tab.id && { 
                    borderColor: tab.color, 
                    backgroundColor: `${tab.color}22` 
                  }
                ]}
              >
                <View style={[styles.tabIcon, { backgroundColor: `${tab.color}33` }]}>
                  <Feather 
                    name={tab.icon as any} 
                    size={20} 
                    color={tab.color} 
                  />
                </View>
                <View style={styles.tabContent}>
                  <Text style={[
                    styles.tabLabel,
                    { color: theme.colors.textPrimary },
                    activeTab === tab.id && { color: tab.color }
                  ]}>
                    {tab.label}
                  </Text>
                  <Text style={[styles.tabCount, { color: theme.colors.textMuted }]}>
                    {tab.count}{tab.totalCount !== tab.count ? ` / ${tab.totalCount}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Tab Content */}
        <View style={[styles.contentCard, { borderColor: theme.colors.borderLight }]}>
          <LinearGradient
            colors={[theme.colors.glassMedium, theme.colors.glassLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glassOverlay}
          />

          {activeTab === 'users' && (
            <View style={styles.sectionContent}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                User Management
              </Text>

              {/* Search and Filter */}
              <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { borderColor: theme.colors.borderLight, backgroundColor: theme.colors.glass }]}>
                  <Feather name="search" size={18} color={theme.colors.textMuted} />
                  <TextInput
                    style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                    placeholder="Search by name or email..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={userSearch}
                    onChangeText={setUserSearch}
                  />
                  {userSearch !== '' && (
                    <TouchableOpacity onPress={() => setUserSearch('')}>
                      <Feather name="x" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.filterRow}>
                  {['all', 'admin', 'user'].map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => setUserRoleFilter(filter as any)}
                      style={[
                        styles.filterChip,
                        { borderColor: theme.colors.borderLight },
                        userRoleFilter === filter && { 
                          backgroundColor: theme.colors.accentGlow,
                          borderColor: theme.colors.accent 
                        }
                      ]}
                    >
                      <Text style={[
                        styles.filterChipText,
                        { color: theme.colors.textSecondary },
                        userRoleFilter === filter && { color: theme.colors.accent, fontWeight: '700' }
                      ]}>
                        {filter === 'all' ? 'All' : filter === 'admin' ? 'Admins' : 'Users'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.filterResultText, { color: theme.colors.textMuted }]}>
                  Showing {filteredUsers.length} of {users.length} users
                </Text>
              </View>
              
              {usersError ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={48} color="#EF4444" />
                  <Text style={[styles.errorText, { color: '#EF4444' }]}>
                    Failed to load users
                  </Text>
                  <Text style={[styles.errorSubtext, { color: theme.colors.textMuted }]}>
                    {usersError instanceof Error ? usersError.message : 'Unknown error'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => refetchUsers()}
                    style={[styles.retryButton, { backgroundColor: theme.colors.accent }]}
                  >
                    <Feather name="refresh-cw" size={16} color="#0d1b2a" />
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : usersLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.accent} />
                  <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
                    Loading users...
                  </Text>
                </View>
              ) : filteredUsers.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Feather name="users" size={48} color={theme.colors.textMuted} />
                  <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                    {userSearch ? 'No users found' : 'No users available'}
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                  <View style={styles.itemsList}>
                    {filteredUsers.map((user) => (
                      <View key={user.id} style={[styles.listItem, { borderColor: theme.colors.borderLight }]}>
                        <View style={[styles.listItemIcon, { backgroundColor: user.roles.includes('Admin') ? '#FFA50033' : theme.colors.accentGlow }]}>
                          <Feather 
                            name={user.roles.includes('Admin') ? 'shield' : 'user'} 
                            size={18} 
                            color={user.roles.includes('Admin') ? '#FFA500' : theme.colors.accent} 
                          />
                        </View>
                        <View style={styles.listItemContent}>
                          <Text style={[styles.listItemTitle, { color: theme.colors.textPrimary }]}>
                            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                          </Text>
                          <Text style={[styles.listItemSubtitle, { color: theme.colors.textMuted }]}>
                            {user.email}
                          </Text>
                          {user.createdAt && (
                            <Text style={[styles.listItemMeta, { color: theme.colors.textMuted }]}>
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </Text>
                          )}
                        </View>
                        {user.roles.includes('Admin') && (
                          <View style={[styles.badge, { backgroundColor: '#FFA50033' }]}>
                            <Text style={[styles.badgeText, { color: '#FFA500' }]}>Admin</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          )}

          {activeTab === 'books' && (
            <View style={styles.sectionContent}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Book Management
              </Text>

              {/* Search and Filter */}
              <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { borderColor: theme.colors.borderLight, backgroundColor: theme.colors.glass }]}>
                  <Feather name="search" size={18} color={theme.colors.textMuted} />
                  <TextInput
                    style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                    placeholder="Search by title or author..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={bookSearch}
                    onChangeText={setBookSearch}
                  />
                  {bookSearch !== '' && (
                    <TouchableOpacity onPress={() => setBookSearch('')}>
                      <Feather name="x" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.filterRow}>
                  {['all', 'available', 'unavailable'].map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => setBookAvailabilityFilter(filter as any)}
                      style={[
                        styles.filterChip,
                        { borderColor: theme.colors.borderLight },
                        bookAvailabilityFilter === filter && { 
                          backgroundColor: theme.colors.accentGlow,
                          borderColor: theme.colors.accent 
                        }
                      ]}
                    >
                      <Text style={[
                        styles.filterChipText,
                        { color: theme.colors.textSecondary },
                        bookAvailabilityFilter === filter && { color: theme.colors.accent, fontWeight: '700' }
                      ]}>
                        {filter === 'all' ? 'All' : filter === 'available' ? 'Available' : 'Unavailable'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.filterResultText, { color: theme.colors.textMuted }]}>
                  Showing {filteredBooks.length} of {books.length} books
                </Text>
              </View>
              
              {booksError ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={48} color="#EF4444" />
                  <Text style={[styles.errorText, { color: '#EF4444' }]}>
                    Failed to load books
                  </Text>
                  <TouchableOpacity
                    onPress={() => refetchBooks()}
                    style={[styles.retryButton, { backgroundColor: theme.colors.accent }]}
                  >
                    <Feather name="refresh-cw" size={16} color="#0d1b2a" />
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : booksLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.accent} />
                  <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
                    Loading books...
                  </Text>
                </View>
              ) : filteredBooks.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Feather name="book" size={48} color={theme.colors.textMuted} />
                  <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                    {bookSearch ? 'No books found' : 'No books available'}
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                  <View style={styles.itemsList}>
                    {filteredBooks.map((book) => (
                      <View key={book.id} style={[styles.listItem, { borderColor: theme.colors.borderLight }]}>
                        <View style={[styles.listItemIcon, { backgroundColor: '#10B98133' }]}>
                          <Feather name="book" size={18} color="#10B981" />
                        </View>
                        <View style={styles.listItemContent}>
                          <Text style={[styles.listItemTitle, { color: theme.colors.textPrimary }]} numberOfLines={1}>
                            {book.title}
                          </Text>
                          <Text style={[styles.listItemSubtitle, { color: theme.colors.textMuted }]}>
                            {book.author} • {book.genre}
                          </Text>
                          <Text style={[styles.listItemMeta, { color: theme.colors.textMuted }]}>
                            ${book.price ? book.price.toFixed(2) : 'N/A'} • {book.created || 'N/A'}
                          </Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: book.isAvailable ? '#10B98133' : '#EF444433' }]}>
                          <Text style={[styles.badgeText, { color: book.isAvailable ? '#10B981' : '#EF4444' }]}>
                            {book.isAvailable ? 'Available' : 'N/A'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          )}

          {activeTab === 'orders' && (
            <View style={styles.sectionContent}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Order Management
              </Text>

              {/* Search and Filter */}
              <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { borderColor: theme.colors.borderLight, backgroundColor: theme.colors.glass }]}>
                  <Feather name="search" size={18} color={theme.colors.textMuted} />
                  <TextInput
                    style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                    placeholder="Search by order ID or email..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={orderSearch}
                    onChangeText={setOrderSearch}
                  />
                  {orderSearch !== '' && (
                    <TouchableOpacity onPress={() => setOrderSearch('')}>
                      <Feather name="x" size={18} color={theme.colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.filterRow}>
                  {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((filter) => (
                    <TouchableOpacity
                      key={filter}
                      onPress={() => setOrderStatusFilter(filter as any)}
                      style={[
                        styles.filterChip,
                        { borderColor: theme.colors.borderLight },
                        orderStatusFilter === filter && { 
                          backgroundColor: theme.colors.accentGlow,
                          borderColor: theme.colors.accent 
                        }
                      ]}
                    >
                      <Text style={[
                        styles.filterChipText,
                        { color: theme.colors.textSecondary },
                        orderStatusFilter === filter && { color: theme.colors.accent, fontWeight: '700' }
                      ]}>
                        {filter === 'all' ? 'All' : filter}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.filterResultText, { color: theme.colors.textMuted }]}>
                  Showing {filteredOrders.length} of {orders.length} orders
                </Text>
              </View>
              
              {ordersError ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={48} color="#EF4444" />
                  <Text style={[styles.errorText, { color: '#EF4444' }]}>
                    Failed to load orders
                  </Text>
                  <TouchableOpacity
                    onPress={() => refetchOrders()}
                    style={[styles.retryButton, { backgroundColor: theme.colors.accent }]}
                  >
                    <Feather name="refresh-cw" size={16} color="#0d1b2a" />
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : ordersLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.accent} />
                  <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
                    Loading orders...
                  </Text>
                </View>
              ) : filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Feather name="package" size={48} color={theme.colors.textMuted} />
                  <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                    {orderSearch ? 'No orders found' : 'No orders available'}
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                  <View style={styles.itemsList}>
                    {filteredOrders.map((order) => (
                      <View key={order.id} style={[styles.listItem, { borderColor: theme.colors.borderLight }]}>
                        <View style={[styles.listItemIcon, { backgroundColor: '#8B5CF633' }]}>
                          <Feather name="package" size={18} color="#8B5CF6" />
                        </View>
                        <View style={styles.listItemContent}>
                          <Text style={[styles.listItemTitle, { color: theme.colors.textPrimary }]}>
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </Text>
                          <Text style={[styles.listItemSubtitle, { color: theme.colors.textMuted }]}>
                            {order.userEmail || 'Unknown user'}
                          </Text>
                          <Text style={[styles.listItemMeta, { color: theme.colors.textMuted }]}>
                            ${order.totalAmount.toFixed(2)} • {order.items.length} items
                          </Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: '#8B5CF633' }]}>
                          <Text style={[styles.badgeText, { color: '#8B5CF6' }]}>
                            {order.status}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          )}

          {activeTab === 'carts' && (
            <View style={styles.sectionContent}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                Cart Management
              </Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>
                {carts.length} active carts
              </Text>
              
              {cartsError ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={48} color="#EF4444" />
                  <Text style={[styles.errorText, { color: '#EF4444' }]}>
                    Failed to load carts
                  </Text>
                  <TouchableOpacity
                    onPress={() => refetchCarts()}
                    style={[styles.retryButton, { backgroundColor: theme.colors.accent }]}
                  >
                    <Feather name="refresh-cw" size={16} color="#0d1b2a" />
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : cartsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.colors.accent} />
                  <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>
                    Loading carts...
                  </Text>
                </View>
              ) : carts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Feather name="shopping-cart" size={48} color={theme.colors.textMuted} />
                  <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                    No active carts
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                  <View style={styles.itemsList}>
                    {carts.map((cart) => (
                      <View key={cart.id} style={[styles.listItem, { borderColor: theme.colors.borderLight }]}>
                        <View style={[styles.listItemIcon, { backgroundColor: '#F59E0B33' }]}>
                          <Feather name="shopping-cart" size={18} color="#F59E0B" />
                        </View>
                        <View style={styles.listItemContent}>
                          <Text style={[styles.listItemTitle, { color: theme.colors.textPrimary }]}>
                            Cart #{cart.id.slice(0, 8).toUpperCase()}
                          </Text>
                          <Text style={[styles.listItemSubtitle, { color: theme.colors.textMuted }]}>
                            {cart.userEmail || 'Unknown user'}
                          </Text>
                          <Text style={[styles.listItemMeta, { color: theme.colors.textMuted }]}>
                            {cart.items.length} items • Total qty: {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>
          )}
        </View>

        {/* Info Messages */}
        <View style={[styles.infoCard, { backgroundColor: '#3B82F622', borderColor: '#3B82F644' }]}>
          <Feather name="info" size={20} color="#3B82F6" />
          <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
            Mobile app provides read-only access. For full CRUD operations (create, edit, delete), please use the web version.
          </Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: '#10B98122', borderColor: '#10B98144' }]}>
          <Feather name="check-circle" size={20} color="#10B981" />
          <View style={{ flex: 1 }}>
            <Text style={[styles.infoTitle, { color: '#10B981' }]}>
              Features Available:
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.textSecondary, marginTop: 4 }]}>
              • View all users, books, orders, and carts{'\n'}
              • Search and filter data{'\n'}
              • Monitor system statistics{'\n'}
              • Pull to refresh data
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </AdminRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: isTablet ? 24 : isSmallDevice ? 14 : 16,
    gap: 16,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  accessDeniedCard: {
    width: '100%',
    maxWidth: 400,
    padding: 32,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    zIndex: 0,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  accessDeniedText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  backButtonText: {
    color: '#0d1b2a',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  headerIcon: {
    width: isSmallDevice ? 52 : isTablet ? 64 : 56,
    height: isSmallDevice ? 52 : isTablet ? 64 : 56,
    borderRadius: isSmallDevice ? 26 : isTablet ? 32 : 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  heading: {
    fontSize: isSmallDevice ? 24 : isTablet ? 32 : 28,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subheading: {
    fontSize: isSmallDevice ? 13 : isTablet ? 16 : 14,
    fontWeight: '500',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    padding: isSmallDevice ? 12 : 14,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: isSmallDevice ? 20 : isTablet ? 26 : 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    zIndex: 1,
  },
  statLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '600',
    zIndex: 1,
  },
  tabsScroll: {
    marginHorizontal: isTablet ? 0 : -16,
    paddingHorizontal: isTablet ? 0 : 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    minWidth: 120,
  },
  tabIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    gap: 2,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  tabCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  contentCard: {
    padding: isSmallDevice ? 14 : 16,
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 400,
  },
  sectionContent: {
    gap: 16,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : isTablet ? 24 : 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: isSmallDevice ? 13 : 14,
    fontWeight: '500',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  itemsList: {
    gap: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  listItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemContent: {
    flex: 1,
    gap: 4,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  listItemSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  moreText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  searchContainer: {
    gap: 12,
    marginTop: 16,
    zIndex: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterResultText: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  scrollList: {
    maxHeight: 400,
    marginTop: 12,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  listItemMeta: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  errorContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#0d1b2a',
    fontSize: 14,
    fontWeight: '700',
  },
});

