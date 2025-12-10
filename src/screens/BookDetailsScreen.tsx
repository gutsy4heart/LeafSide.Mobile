import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { PrimaryButton } from '@/components/PrimaryButton';
import { BookImage } from '@/components/BookImage';
import { ShimmerLoader } from '@/components/ShimmerLoader';
import { useCart } from '@/providers/CartProvider';
import { fetchBookById } from '@/services/books';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { RootStackParamList } from '@/navigation/types';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

type Route = NativeStackScreenProps<RootStackParamList, 'BookDetails'>['route'];

export const BookDetailsScreen = () => {
  const theme = useTheme();
  const { params } = useRoute<Route>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addItem } = useCart();

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', params.bookId],
    queryFn: () => fetchBookById(params.bookId),
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LinearGradient
          colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loaderContainer}>
          <ShimmerLoader width="100%" height={320} borderRadius={0} />
          <View style={styles.content}>
            <ShimmerLoader width="80%" height={32} />
            <ShimmerLoader width="60%" height={20} style={{ marginTop: 8 }} />
            <View style={{ marginTop: 20 }}>
              <ShimmerLoader width="100%" height={200} borderRadius={24} />
            </View>
            <View style={{ marginTop: 20 }}>
              <ShimmerLoader width="40%" height={24} />
              <ShimmerLoader width="100%" height={120} style={{ marginTop: 12 }} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !book) {
    return (
      <SafeAreaView style={[styles.loader, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <LinearGradient
          colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.errorCard, { borderColor: theme.colors.borderLight }]}>
          <LinearGradient
            colors={[theme.colors.glassMedium, theme.colors.glassLight]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glassOverlay}
          />
          <View style={[styles.errorIcon, { backgroundColor: theme.colors.dangerGlass }]}>
            <Feather name="alert-circle" size={48} color={theme.colors.danger} />
          </View>
          <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
            Failed to load book
          </Text>
          <PrimaryButton label="Go Back" onPress={() => navigation.goBack()} variant="glass" />
        </View>
      </SafeAreaView>
    );
  }

  const isAvailable = book.isAvailable && book.price !== null && book.price !== undefined;
  const metaItems = [
    { icon: 'tag', label: 'Genre', value: book.genre },
    { icon: 'user', label: 'Author', value: book.author },
    { icon: 'book', label: 'Publisher', value: book.publishing },
    { icon: 'calendar', label: 'Publication Year', value: book.created },
    { icon: 'globe', label: 'Language', value: book.language || 'Not specified' },
    { icon: 'file-text', label: 'Pages', value: book.pageCount ? `${book.pageCount}` : '—' },
    { icon: 'hash', label: 'ISBN', value: book.isbn || '—' },
  ].filter((item) => item.value) as Array<{ icon: string; label: string; value: string }>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <BookImage imageUrl={book.imageUrl} height={380} borderRadius={0} />

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    {book.title}
                  </Text>
                  <LinearGradient
                    colors={[theme.colors.accent, 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.titleUnderline}
                  />
                </View>
                {!isAvailable && (
                  <View style={[styles.unavailableBadge, { backgroundColor: theme.colors.danger }]}>
                    <Feather name="x-circle" size={14} color="#fff" style={{ marginRight: 4 }} />
                    <Text style={styles.unavailableText}>Unavailable</Text>
                  </View>
                )}
              </View>
              <View style={styles.authorContainer}>
                <Feather name="user" size={18} color={theme.colors.textMuted} />
                <Text style={[styles.author, { color: theme.colors.textSecondary }]}>
                  {book.author}
                </Text>
              </View>
            </View>

            <View style={[styles.metaSection, { borderColor: theme.colors.borderLight }]}>
              <LinearGradient
                colors={[theme.colors.glassMedium, theme.colors.glassLight, theme.colors.glass]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.glassOverlay}
              />
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconContainer, { backgroundColor: theme.colors.accentGlow }]}>
                  <Feather name="info" size={20} color={theme.colors.accent} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                  Information
                </Text>
              </View>
              <View style={styles.metaGrid}>
                {metaItems.map((item, index) => (
                  <View key={index} style={styles.metaItem}>
                    <View style={styles.metaLabelContainer}>
                      <Feather name={item.icon as any} size={14} color={theme.colors.textMuted} />
                      <Text style={[styles.metaLabel, { color: theme.colors.textMuted }]}>
                        {item.label}
                      </Text>
                    </View>
                    <Text style={[styles.metaValue, { color: theme.colors.textPrimary }]}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {book.description && (
              <View style={[styles.descriptionSection, { borderColor: theme.colors.borderLight }]}>
                <LinearGradient
                  colors={[theme.colors.glassLight, theme.colors.glass]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.glassOverlay}
                />
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIconContainer, { backgroundColor: theme.colors.accentGlow }]}>
                    <Feather name="file-text" size={20} color={theme.colors.accent} />
                  </View>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                    Description
                  </Text>
                </View>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  {book.description}
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.footer, { borderTopColor: theme.colors.borderLight }]}>
            <LinearGradient
              colors={[theme.colors.glassMedium, theme.colors.glassLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.priceSection}>
              <Text style={[styles.priceLabel, { color: theme.colors.textMuted }]}>
                Price
              </Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: theme.colors.accentLight }]}>
                  {formatCurrency(book.price)}
                </Text>
                <View style={[styles.priceBadge, { backgroundColor: theme.colors.accentGlow }]}>
                  <Feather name="tag" size={16} color={theme.colors.accent} />
                </View>
              </View>
            </View>
            
            {isAvailable ? (
              <View style={styles.actions}>
                <PrimaryButton
                  label="Add to Cart"
                  onPress={() => {
                    addItem(book);
                    const tabNavigation = navigation.getParent();
                    if (tabNavigation) {
                      (tabNavigation as any).navigate('Tabs', { screen: 'Cart' });
                    }
                  }}
                  variant="primary"
                  icon={<Feather name="shopping-cart" size={18} color="#0d1b2a" />}
                />
                <PrimaryButton
                  variant="glass"
                  label="Checkout"
                  onPress={() => navigation.navigate('Checkout')}
                  icon={<Feather name="credit-card" size={18} color={theme.colors.textPrimary} />}
                />
              </View>
            ) : (
              <View style={[styles.unavailableMessage, { backgroundColor: theme.colors.dangerGlass, borderColor: theme.colors.danger }]}>
                <Feather name="info" size={20} color={theme.colors.danger} />
                <Text style={[styles.unavailableMessageText, { color: theme.colors.textPrimary }]}>
                  Book is temporarily unavailable for order
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    padding: 32,
    borderRadius: 32,
    borderWidth: 2,
    gap: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  errorIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  titleUnderline: {
    height: 3,
    width: 80,
    borderRadius: 2,
    marginTop: 6,
  },
  unavailableBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
  },
  metaSection: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    zIndex: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 1,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  metaGrid: {
    gap: 10,
    zIndex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  metaLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 140,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  descriptionSection: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.1,
    zIndex: 1,
  },
  footer: {
    padding: 16,
    gap: 16,
    borderTopWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  priceSection: {
    gap: 6,
    zIndex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  priceBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    gap: 10,
    zIndex: 1,
  },
  unavailableMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    zIndex: 1,
  },
  unavailableMessageText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
});
