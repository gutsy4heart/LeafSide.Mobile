import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import { BookCard } from '@/components/BookCard';
import { FilterChip } from '@/components/FilterChip';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { useBooks } from '@/hooks/useBooks';
import { useBookFilters } from '@/hooks/useBookFilters';
import { useCart } from '@/providers/CartProvider';
import type { RootStackParamList } from '@/navigation/types';
import type { Book } from '@/types/book';
import { useTheme } from '@/theme';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const POPULAR_GENRES = ['All', 'Romance', 'Thriller', 'Fantasy', 'Self-Help', 'History'];

export const CatalogScreen = () => {
  const theme = useTheme();
  const { data: books = [], isLoading, error } = useBooks();
  const { addItem } = useCart();
  const filters = useBookFilters(books as Book[]);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Debug logging
  if (error) {
    console.error('[CatalogScreen] Error loading books:', error);
  }
  if ((books as Book[]).length > 0) {
    console.log('[CatalogScreen] Books loaded:', (books as Book[]).length);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <LinearGradient
        colors={[theme.colors.backgroundGradientStart, theme.colors.backgroundGradientEnd]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: theme.colors.accentGlow }]}>
          <Feather name="book-open" size={24} color={theme.colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
            Book Catalog
          </Text>
          <Text style={[styles.subheading, { color: theme.colors.textMuted }]}>
            {(books as Book[]).length} books available
          </Text>
        </View>
      </View>

      <SearchBar value={filters.query} onChange={filters.setQuery} placeholder="Search by title or author" />
      <SectionHeader title="Filter by Genre" />
      <View style={styles.chips}>
        {POPULAR_GENRES.map((genre) => {
          const selected = genre === 'All' ? filters.genre === null : filters.genre === genre;
          return (
            <FilterChip
              key={genre}
              label={genre}
              selected={selected}
              onPress={() => filters.setGenre(genre === 'All' ? null : genre)}
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
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <BookCard
                book={item}
                onPress={() => navigation.navigate('BookDetails', { bookId: item.id })}
                onAddToCart={() => addItem(item)}
              />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    zIndex: 1,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34d399',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  subheading: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    zIndex: 1,
  },
  row: {
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  gridItem: {
    width: '47.5%',
  },
});

