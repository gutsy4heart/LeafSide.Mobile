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
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';

const GENRES = ['Все', 'Fiction', 'Fantasy', 'History', 'Business', 'Science Fiction', 'Other'];

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data: books = [], isLoading } = useBooks();
  const { addItem } = useCart();
  const filters = useBookFilters(books);

  const onBookPress = (bookId: string) => navigation.navigate('BookDetails', { bookId });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.gap}>
        <HeroBanner
          headline="LeafSide Library"
          subheading="Современный магазин с неоновой эстетикой и любимыми авторами."
          ctaLabel="Каталог"
          onCtaPress={() => navigation.navigate('Catalog')}
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
          <SectionHeader title="Подборка дня" actionLabel="Смотреть все" onActionPress={() => navigation.navigate('Catalog')} />
          {isLoading ? (
            <ActivityIndicator color={theme.colors.accent} />
          ) : (
            <View style={styles.grid}>
              {filters.featured.map((book) => (
                <View key={book.id} style={styles.gridItem}>
                  <BookCard book={book} onPress={() => onBookPress(book.id)} onAddToCart={() => addItem(book)} />
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
                  {formatCurrency(book.price)}
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
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
});

