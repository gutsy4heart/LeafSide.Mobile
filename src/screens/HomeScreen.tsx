import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { BookCard } from '@/components/BookCard';
import { HeroBanner } from '@/components/HeroBanner';
import { SectionHeader } from '@/components/SectionHeader';
import { ShimmerBookCard } from '@/components/ShimmerLoader';
import { useBooks } from '@/hooks/useBooks';
import { useBookFilters } from '@/hooks/useBookFilters';
import { useCart } from '@/providers/CartProvider';
import type { RootStackParamList, TabParamList } from '@/navigation/types';
import type { Book } from '@/types/book';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { data: books = [], isLoading, error } = useBooks();
  const { addItem } = useCart();
  const filters = useBookFilters(books as Book[]);

  // Debug logging
  if (error) {
    console.error('[HomeScreen] Error loading books:', error);
  }
  if ((books as Book[]).length > 0) {
    console.log('[HomeScreen] Books loaded:', (books as Book[]).length);
  }

  const onBookPress = (book: { id: string }) => navigation.navigate('BookDetails', { bookId: book.id });

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
        <View style={styles.gap}>
        <HeroBanner
          headline="LeafSide Library"
          subheading="Премиальный магазин книг с неоновой эстетикой"
          ctaLabel="Смотреть каталог"
          onCtaPress={() => {
            const tabNavigation = navigation.getParent();
            if (tabNavigation) {
              (tabNavigation as any).navigate('Catalog');
            }
          }}
        />

        <View>
          <SectionHeader
            title="Подборка дня"
            actionLabel="Смотреть все"
            onActionPress={() => {
              const tabNavigation = navigation.getParent();
              if (tabNavigation) {
                (tabNavigation as any).navigate('Catalog');
              }
            }}
          />
          {isLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <View style={styles.horizontalCard}>
                <ShimmerBookCard />
              </View>
              <View style={styles.horizontalCard}>
                <ShimmerBookCard />
              </View>
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {filters.featured.map((book) => (
                <View key={book.id} style={styles.horizontalCard}>
                  <BookCard book={book} onPress={() => onBookPress({ id: book.id })} onAddToCart={() => addItem(book)} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View>
          <SectionHeader 
            title="Новинки" 
            actionLabel="Все новинки"
            onActionPress={() => {
              const tabNavigation = navigation.getParent();
              if (tabNavigation) {
                (tabNavigation as any).navigate('Catalog');
              }
            }}
          />
          {isLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              <View style={styles.horizontalCard}>
                <ShimmerBookCard />
              </View>
              <View style={styles.horizontalCard}>
                <ShimmerBookCard />
              </View>
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {filters.trending.slice(0, 5).map((book) => (
                <View key={book.id} style={styles.horizontalCard}>
                  <BookCard book={book} onPress={() => onBookPress({ id: book.id })} onAddToCart={() => addItem(book)} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View>
          <SectionHeader title="Популярное" />
          {isLoading ? (
            <>
              <ShimmerBookCard />
              <ShimmerBookCard />
            </>
          ) : (
            filters.trending.slice(0, 3).map((book) => (
              <Pressable 
                key={book.id}
                onPress={() => onBookPress({ id: book.id })}
                style={({ pressed }) => [
                  styles.trendingCard, 
                  { 
                    borderColor: theme.colors.borderLight,
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  }
                ]}
              >
                <LinearGradient
                  colors={[theme.colors.glassMedium, theme.colors.glassLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={[styles.trendingIcon, { backgroundColor: theme.colors.accentGlow }]}>
                  <Feather name="trending-up" size={20} color={theme.colors.accent} />
                </View>
                <View style={{ flex: 1, zIndex: 1 }}>
                  <Text style={[styles.trendingTitle, { color: theme.colors.textPrimary }]}>
                    {book.title}
                  </Text>
                  <Text style={[styles.trendingAuthor, { color: theme.colors.textMuted }]}>
                    {book.author}
                  </Text>
                </View>
                <Text style={[styles.trendingPrice, { color: theme.colors.accentLight }]}>
                  {formatCurrency(book.price ?? null)}
                </Text>
              </Pressable>
            ))
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
  content: {
    padding: 16,
  },
  gap: {
    gap: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  gridItem: {
    width: '47.5%',
  },
  horizontalScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  horizontalCard: {
    width: 280,
    marginRight: 16,
  },
  trendingCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  trendingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  trendingTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  trendingAuthor: {
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.8,
  },
  trendingPrice: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
    zIndex: 1,
  },
});

