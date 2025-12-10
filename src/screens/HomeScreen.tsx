import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { FilterChip } from '@/components/FilterChip';
import { HeroBanner } from '@/components/HeroBanner';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { useBooks } from '@/hooks/useBooks';
import { useBookFilters } from '@/hooks/useBookFilters';
import { useCart } from '@/providers/CartProvider';
import type { RootStackParamList, TabParamList } from '@/navigation/types';
import type { Book } from '@/types/book';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

const GENRES = ['Все', 'Fiction', 'Fantasy', 'History', 'Business', 'Science Fiction', 'Other'];

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
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.gap}>
        <HeroBanner
          headline="LeafSide Library"
          subheading="Современный магазин с неоновой эстетикой и любимыми авторами."
          ctaLabel="Каталог"
          onCtaPress={() => {
            // Navigate to Catalog tab
            const tabNavigation = navigation.getParent();
            if (tabNavigation) {
              (tabNavigation as any).navigate('Catalog');
            }
          }}
        />

        <SearchBar value={filters.query} onChange={filters.setQuery} placeholder="Найти книгу или автора" />

        <View>
          <SectionHeader title="Жанры" />
          <View style={styles.chips}>
            {GENRES.map((genre) => {
              const selected = genre === 'Все' ? filters.genre === null : filters.genre === genre;
              return (
                <FilterChip
                  key={genre}
                  label={genre}
                  selected={selected}
                  onPress={() => filters.setGenre(genre === 'Все' ? null : genre)}
                />
              );
            })}
          </View>
        </View>

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
            <ActivityIndicator color={theme.colors.accent} />
          ) : (
            <View style={styles.grid}>
              {filters.featured.map((book) => (
                <View key={book.id} style={styles.gridItem}>
                  <BookCard book={book} onPress={() => onBookPress({ id: book.id })} onAddToCart={() => addItem(book)} />
                </View>
              ))}
            </View>
          )}
        </View>

        <View>
          <SectionHeader title="В тренде" />
          {isLoading ? (
            <ActivityIndicator color={theme.colors.accent} />
          ) : (
            filters.trending.map((book) => (
              <View key={book.id} style={[styles.trendingCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.trendingTitle, { color: theme.colors.textPrimary }]}>{book.title}</Text>
                  <Text style={{ color: theme.colors.textMuted }}>{book.author}</Text>
                </View>
                <Text style={{ color: theme.colors.accent, fontWeight: '700' }}>
                  {formatCurrency(book.price ?? null)}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  gap: {
    gap: 24,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  gridItem: {
    width: '48%',
  },
  trendingCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  trendingTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

