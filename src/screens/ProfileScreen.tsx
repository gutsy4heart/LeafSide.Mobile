import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

import { EmptyState } from '@/components/EmptyState';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ShimmerLoader } from '@/components/ShimmerLoader';
import type { RootStackParamList, TabParamList } from '@/navigation/types';
import { useAuth } from '@/providers/AuthProvider';
import { fetchOrders } from '@/services/orders';
import { getUserStats } from '@/services/auth';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type Tab = 'profile' | 'orders' | 'settings';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const ProfileScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { token, profile, status, signOut, refreshProfile, updateProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    phoneNumber: profile?.phoneNumber || '',
    countryCode: profile?.countryCode || '+7',
    gender: profile?.gender || 'Male',
  });

  const { data: orders = [], isFetching: ordersFetching } = useQuery({
    queryKey: ['orders', token],
    queryFn: () => fetchOrders(token!),
    enabled: Boolean(token),
  });

  const { data: stats, isFetching: statsFetching, refetch: refetchStats } = useQuery({
    queryKey: ['user-stats', token],
    queryFn: () => getUserStats(token!),
    enabled: Boolean(token),
  });

  const isAdmin = profile?.roles?.includes('Admin') || false;

  // Log admin status for debugging
  useEffect(() => {
    if (profile) {
      console.log('[ProfileScreen] User roles check:', {
        userEmail: profile.email,
        roles: profile.roles,
        isAdmin,
        adminButtonVisible: isAdmin,
      });
    }
  }, [profile, isAdmin]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phoneNumber: profile?.phoneNumber || '',
      countryCode: profile?.countryCode || '+7',
      gender: profile?.gender || 'Male',
    });
    setIsEditing(false);
  };

  if (status !== 'authenticated' || !profile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
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
              Welcome!
            </Text>
            <Text style={[styles.loginSubtitle, { color: theme.colors.textSecondary }]}>
              Sign in to view your profile and orders
            </Text>
            <View style={styles.loginActions}>
              <PrimaryButton 
                label="Sign In" 
                onPress={() => navigation.navigate('Login')}
                icon={<Feather name="log-in" size={18} color="#0d1b2a" />}
              />
              <PrimaryButton 
                variant="glass" 
                label="Sign Up" 
                onPress={() => navigation.navigate('Register')}
                icon={<Feather name="user-plus" size={18} color={theme.colors.textPrimary} />}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Avatar */}
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
            {isAdmin && (
              <View style={styles.adminBadgeContainer}>
                <Text style={styles.adminBadge}>👑</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1, zIndex: 1 }}>
            <Text style={[styles.profileName, { color: theme.colors.textPrimary }]}>
              {profile.firstName || profile.lastName 
                ? `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim() 
                : 'User'}
            </Text>
            <View style={styles.emailContainer}>
              <Feather name="mail" size={14} color={theme.colors.textMuted} />
              <Text style={[styles.profileEmail, { color: theme.colors.textMuted }]}>
                {profile.email}
              </Text>
            </View>
            {isAdmin && (
              <View style={styles.roleContainer}>
                <Text style={[styles.roleBadge, { backgroundColor: '#FFA50033', color: '#FFA500' }]}>
                  Administrator
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
            <View style={[styles.statIcon, { backgroundColor: '#3B82F633' }]}>
              <Feather name="package" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
              {statsFetching ? '...' : (stats?.totalOrders ?? 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Orders
            </Text>
          </View>

          <View style={[styles.statCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassLight, theme.colors.glass]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={[styles.statIcon, { backgroundColor: '#10B98133' }]}>
              <Feather name="book" size={24} color="#10B981" />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
              {statsFetching ? '...' : (stats?.totalBooksPurchased ?? 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              Books
            </Text>
          </View>

          <View style={[styles.statCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassLight, theme.colors.glass]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={[styles.statIcon, { backgroundColor: '#8B5CF633' }]}>
              <Feather name="shopping-cart" size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
              {statsFetching ? '...' : (stats?.itemsInCart ?? 0)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              In Cart
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              { borderColor: theme.colors.borderLight },
              activeTab === 'profile' && { borderColor: theme.colors.accent, backgroundColor: theme.colors.accentGlow }
            ]}
            onPress={() => setActiveTab('profile')}
          >
            <Feather 
              name="user" 
              size={20} 
              color={activeTab === 'profile' ? theme.colors.accent : theme.colors.textMuted} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'profile' ? theme.colors.accent : theme.colors.textMuted }
            ]}>
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              { borderColor: theme.colors.borderLight },
              activeTab === 'orders' && { borderColor: theme.colors.accent, backgroundColor: theme.colors.accentGlow }
            ]}
            onPress={() => setActiveTab('orders')}
          >
            <Feather 
              name="package" 
              size={20} 
              color={activeTab === 'orders' ? theme.colors.accent : theme.colors.textMuted} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'orders' ? theme.colors.accent : theme.colors.textMuted }
            ]}>
              Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              { borderColor: theme.colors.borderLight },
              activeTab === 'settings' && { borderColor: theme.colors.accent, backgroundColor: theme.colors.accentGlow }
            ]}
            onPress={() => setActiveTab('settings')}
          >
            <Feather 
              name="settings" 
              size={20} 
              color={activeTab === 'settings' ? theme.colors.accent : theme.colors.textMuted} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'settings' ? theme.colors.accent : theme.colors.textMuted }
            ]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <View style={[styles.contentCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassMedium, theme.colors.glassLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                Personal Information
              </Text>
              <TouchableOpacity
                onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                style={[styles.editButton, { backgroundColor: theme.colors.accentGlow }]}
              >
                <Feather 
                  name={isEditing ? "check" : "edit-2"} 
                  size={16} 
                  color={theme.colors.accent} 
                />
                <Text style={[styles.editButtonText, { color: theme.colors.accent }]}>
                  {isEditing ? 'Save' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              {/* First Name */}
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>First Name</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.card, 
                      borderColor: theme.colors.borderLight,
                      color: theme.colors.textPrimary 
                    }]}
                    value={editedProfile.firstName}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, firstName: text })}
                    placeholder="Enter first name"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {profile.firstName || 'Not specified'}
                  </Text>
                )}
              </View>

              {/* Last Name */}
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Last Name</Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: theme.colors.card, 
                      borderColor: theme.colors.borderLight,
                      color: theme.colors.textPrimary 
                    }]}
                    value={editedProfile.lastName}
                    onChangeText={(text) => setEditedProfile({ ...editedProfile, lastName: text })}
                    placeholder="Enter last name"
                    placeholderTextColor={theme.colors.textMuted}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {profile.lastName || 'Not specified'}
                  </Text>
                )}
              </View>

              {/* Email (Read-only) */}
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Email</Text>
                <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                  {profile.email}
                </Text>
              </View>

              {/* Phone Number */}
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Phone Number</Text>
                {isEditing ? (
                  <View style={styles.phoneInputContainer}>
                    <TextInput
                      style={[styles.countryCodeInput, { 
                        backgroundColor: theme.colors.card, 
                        borderColor: theme.colors.borderLight,
                        color: theme.colors.textPrimary 
                      }]}
                      value={editedProfile.countryCode}
                      onChangeText={(text) => setEditedProfile({ ...editedProfile, countryCode: text })}
                      placeholder="+7"
                      placeholderTextColor={theme.colors.textMuted}
                    />
                    <TextInput
                      style={[styles.phoneInput, { 
                        backgroundColor: theme.colors.card, 
                        borderColor: theme.colors.borderLight,
                        color: theme.colors.textPrimary 
                      }]}
                      value={editedProfile.phoneNumber}
                      onChangeText={(text) => setEditedProfile({ ...editedProfile, phoneNumber: text })}
                      placeholder="Enter phone number"
                      placeholderTextColor={theme.colors.textMuted}
                      keyboardType="phone-pad"
                    />
                  </View>
                ) : (
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {profile.phoneNumber ? `${profile.countryCode || ''} ${profile.phoneNumber}` : 'Not specified'}
                  </Text>
                )}
              </View>

              {/* Gender */}
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Gender</Text>
                {isEditing ? (
                  <View style={styles.genderContainer}>
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderButton,
                          { borderColor: theme.colors.borderLight },
                          editedProfile.gender === gender && { 
                            borderColor: theme.colors.accent, 
                            backgroundColor: theme.colors.accentGlow 
                          }
                        ]}
                        onPress={() => setEditedProfile({ ...editedProfile, gender })}
                      >
                        <Text style={[
                          styles.genderButtonText,
                          { color: theme.colors.textPrimary },
                          editedProfile.gender === gender && { color: theme.colors.accent }
                        ]}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                    {profile.gender || 'Not specified'}
                  </Text>
                )}
              </View>

              {/* Registration Date */}
              <View style={styles.formField}>
                <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>Member Since</Text>
                <Text style={[styles.fieldValue, { color: theme.colors.textPrimary }]}>
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Not available'}
                </Text>
              </View>
            </View>

            {isEditing && (
              <View style={styles.editActions}>
                <TouchableOpacity
                  onPress={handleCancelEdit}
                  style={[styles.cancelButton, { borderColor: theme.colors.borderLight }]}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  style={[styles.saveButton, { backgroundColor: theme.colors.accent }]}
                >
                  <Text style={styles.saveButtonText}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Statistics Section */}
        {activeTab === 'profile' && (
          <View style={[styles.contentCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassMedium, theme.colors.glassLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <View style={styles.statsHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="bar-chart-2" size={20} color={theme.colors.accent} />
                <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                  Statistics
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => refetchStats()}
                disabled={statsFetching}
                style={[styles.refreshButton, { backgroundColor: theme.colors.accentGlow }]}
              >
                <Feather 
                  name="refresh-cw" 
                  size={16} 
                  color={theme.colors.accent}
                  style={{ transform: [{ rotate: statsFetching ? '180deg' : '0deg' }] }}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { borderColor: '#3B82F633', backgroundColor: '#3B82F611' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#3B82F633' }]}>
                  <Feather name="package" size={18} color="#3B82F6" />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                  {statsFetching ? '...' : stats?.totalOrders || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                  Total Orders
                </Text>
              </View>

              <View style={[styles.statBox, { borderColor: '#10B98133', backgroundColor: '#10B98111' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#10B98133' }]}>
                  <Feather name="book" size={18} color="#10B981" />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                  {statsFetching ? '...' : stats?.totalBooksPurchased || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                  Books Purchased
                </Text>
              </View>

              <View style={[styles.statBox, { borderColor: '#8B5CF633', backgroundColor: '#8B5CF611' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#8B5CF633' }]}>
                  <Feather name="shopping-cart" size={18} color="#8B5CF6" />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                  {statsFetching ? '...' : stats?.itemsInCart || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                  Items in Cart
                </Text>
              </View>

              <View style={[styles.statBox, { borderColor: '#F59E0B33', backgroundColor: '#F59E0B11' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: '#F59E0B33' }]}>
                  <Feather name="heart" size={18} color="#F59E0B" />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                  {statsFetching ? '...' : stats?.favoritesCount || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                  Favorites
                </Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'orders' && (
          <View style={[styles.contentCard, { borderColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassMedium, theme.colors.glassLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glassOverlay}
            />
            <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
              My Orders
            </Text>

            {ordersFetching ? (
              <View style={{ gap: 12, marginTop: 16 }}>
                <ShimmerLoader width="100%" height={120} />
                <ShimmerLoader width="100%" height={120} />
              </View>
            ) : orders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <EmptyState 
                  icon="package" 
                  title="No orders yet" 
                  subtitle="Make your first order" 
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
                      colors={[theme.colors.glass, theme.colors.glassLight]}
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
                          {new Date(order.createdAt).toLocaleDateString('en-US')}
                        </Text>
                      </View>
                      <View style={styles.orderMetaItem}>
                        <Feather name="package" size={12} color={theme.colors.textMuted} />
                        <Text style={[styles.orderMetaText, { color: theme.colors.textSecondary }]}>
                          {order.items.length} items
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
        )}

        {activeTab === 'settings' && (
          <View>
            {/* Notifications Section */}
            <View style={[styles.contentCard, { borderColor: theme.colors.borderLight, marginBottom: 16 }]}>
              <LinearGradient
                colors={[theme.colors.glassMedium, theme.colors.glassLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <View style={styles.cardHeader}>
                <Feather name="bell" size={20} color={theme.colors.accent} />
                <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                  Notifications
                </Text>
              </View>

              <View style={styles.notificationsList}>
                <View style={[styles.notificationItem, { borderColor: theme.colors.borderLight }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.notificationTitle, { color: theme.colors.textPrimary }]}>
                      Email Notifications
                    </Text>
                    <Text style={[styles.notificationSubtitle, { color: theme.colors.textMuted }]}>
                      Receive updates via email
                    </Text>
                  </View>
                  <View style={[styles.switchPlaceholder, { backgroundColor: theme.colors.borderLight }]}>
                    <Text style={[styles.switchText, { color: theme.colors.textMuted }]}>Coming Soon</Text>
                  </View>
                </View>

                <View style={[styles.notificationItem, { borderColor: theme.colors.borderLight }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.notificationTitle, { color: theme.colors.textPrimary }]}>
                      SMS Notifications
                    </Text>
                    <Text style={[styles.notificationSubtitle, { color: theme.colors.textMuted }]}>
                      Receive updates via SMS
                    </Text>
                  </View>
                  <View style={[styles.switchPlaceholder, { backgroundColor: theme.colors.borderLight }]}>
                    <Text style={[styles.switchText, { color: theme.colors.textMuted }]}>Coming Soon</Text>
                  </View>
                </View>

                <View style={[styles.notificationItem, { borderColor: theme.colors.borderLight }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.notificationTitle, { color: theme.colors.textPrimary }]}>
                      Push Notifications
                    </Text>
                    <Text style={[styles.notificationSubtitle, { color: theme.colors.textMuted }]}>
                      Get instant updates on your device
                    </Text>
                  </View>
                  <View style={[styles.switchPlaceholder, { backgroundColor: theme.colors.borderLight }]}>
                    <Text style={[styles.switchText, { color: theme.colors.textMuted }]}>Coming Soon</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Security Section */}
            <View style={[styles.contentCard, { borderColor: theme.colors.borderLight, marginBottom: 16 }]}>
              <LinearGradient
                colors={[theme.colors.glassMedium, theme.colors.glassLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <View style={styles.cardHeader}>
                <Feather name="lock" size={20} color={theme.colors.accent} />
                <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                  Security
                </Text>
              </View>

              <View style={styles.settingsContainer}>
                <TouchableOpacity
                  style={[styles.settingItem, { borderColor: theme.colors.borderLight }]}
                  onPress={() => Alert.alert('Coming Soon', 'Password change functionality will be available soon.')}
                >
                  <View style={[styles.settingIcon, { backgroundColor: '#3B82F633' }]}>
                    <Feather name="key" size={20} color="#3B82F6" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                      Change Password
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                      Update your account password
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.settingItem, { borderColor: theme.colors.borderLight }]}
                  onPress={() => Alert.alert('Coming Soon', 'Two-factor authentication will be available soon.')}
                >
                  <View style={[styles.settingIcon, { backgroundColor: '#10B98133' }]}>
                    <Feather name="shield" size={20} color="#10B981" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                      Two-Factor Authentication
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                      Add an extra layer of security
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Actions Section */}
            <View style={[styles.contentCard, { borderColor: theme.colors.borderLight }]}>
              <LinearGradient
                colors={[theme.colors.glassMedium, theme.colors.glassLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <View style={styles.cardHeader}>
                <Feather name="zap" size={20} color={theme.colors.accent} />
                <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
                  Quick Actions
                </Text>
              </View>

              <View style={styles.settingsContainer}>
              <TouchableOpacity
                style={[styles.settingItem, { borderColor: theme.colors.borderLight }]}
                onPress={() => navigation.navigate('Cart')}
              >
                <View style={[styles.settingIcon, { backgroundColor: '#8B5CF633' }]}>
                  <Feather name="shopping-cart" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                    My Cart
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    View items in your cart
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingItem, { borderColor: theme.colors.borderLight }]}
                onPress={() => navigation.navigate('Home')}
              >
                <View style={[styles.settingIcon, { backgroundColor: '#3B82F633' }]}>
                  <Feather name="book-open" size={20} color="#3B82F6" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>
                    Browse Books
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    Discover new books
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>

              {isAdmin && (
                <TouchableOpacity
                  style={[styles.settingItem, { borderColor: '#FFA50033' }]}
                  onPress={() => navigation.navigate('Admin')}
                >
                  <View style={[styles.settingIcon, { backgroundColor: '#FFA50033' }]}>
                    <Feather name="shield" size={20} color="#FFA500" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, { color: '#FFA500' }]}>
                      Admin Panel
                    </Text>
                    <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                      Manage the platform
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#FFA500" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.settingItem, { borderColor: '#EF444433' }]}
                onPress={() => {
                  Alert.alert(
                    'Sign Out',
                    'Are you sure you want to sign out?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Sign Out', style: 'destructive', onPress: signOut }
                    ]
                  );
                }}
              >
                <View style={[styles.settingIcon, { backgroundColor: '#EF444433' }]}>
                  <Feather name="log-out" size={20} color="#EF4444" />
                </View>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
                    Sign Out
                  </Text>
                  <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                    Log out of your account
                  </Text>
                </View>
                <Feather name="chevron-right" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    overflow: 'visible',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    position: 'relative',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0d1b2a',
  },
  adminBadgeContainer: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  adminBadge: {
    fontSize: 16,
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
  roleContainer: {
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '700',
    alignSelf: 'flex-start',
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
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  contentCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
    zIndex: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  formContainer: {
    gap: 16,
    zIndex: 1,
  },
  formField: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCodeInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 3,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 16,
    fontWeight: '500',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    zIndex: 1,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0d1b2a',
  },
  emptyContainer: {
    paddingVertical: 40,
    zIndex: 1,
  },
  ordersList: {
    gap: 0,
    marginTop: 16,
    zIndex: 1,
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
  settingsContainer: {
    gap: 12,
    marginTop: 16,
    zIndex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
    gap: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  notificationsList: {
    gap: 12,
    marginTop: 16,
    zIndex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  switchPlaceholder: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  switchText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 1,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    zIndex: 1,
  },
  statBox: {
    flex: 1,
    minWidth: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
