import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { BookCard } from '@/components/BookCard';
import { FilterChip } from '@/components/FilterChip';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { useBooks } from '@/hooks/useBooks';
import { useBookFilters } from '@/hooks/useBookFilters';
import { useCart } from '@/providers/CartProvider';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const POPULAR_GENRES = ['Все', 'Romance', 'Thriller', 'Fantasy', 'Self-Help', 'History'];

export const CatalogScreen = () => {
  const theme = useTheme();
  const { data: books = [], isLoading } = useBooks();
  const { addItem } = useCart();
  const filters = useBookFilters(books);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SearchBar value={filters.query} onChange={filters.setQuery} />
      <SectionHeader title="Жанры" />
      <View style={styles.chips}>
        {POPULAR_GENRES.map((genre) => {
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
      {isLoading ? (
        <ActivityIndicator color={theme.colors.accent} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={filters.filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => navigation.navigate('BookDetails', { bookId: item.id })}
              onAddToCart={() => addItem(item)}
            />
          )}
          contentContainerStyle={{ gap: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

