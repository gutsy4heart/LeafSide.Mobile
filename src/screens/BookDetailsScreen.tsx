import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
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

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', params.bookId],
    queryFn: () => fetchBookById(params.bookId),
  });

  if (isLoading || !book) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {book.imageUrl ? (
        <Image source={{ uri: book.imageUrl }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Text style={{ color: theme.colors.textMuted }}>Нет изображения</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{book.title}</Text>
        <Text style={[styles.author, { color: theme.colors.textMuted }]}>{book.author}</Text>
        <View style={styles.meta}>
          <Text style={{ color: theme.colors.textSecondary }}>Жанр: {book.genre}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>Язык: {book.language}</Text>
          <Text style={{ color: theme.colors.textSecondary }}>Страниц: {book.pageCount ?? '—'}</Text>
        </View>
        <Text style={[styles.description, { color: theme.colors.textPrimary }]}>{book.description}</Text>
      </View>
      <View style={[styles.footer, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.price, { color: theme.colors.accent }]}>
          {formatCurrency(book.price)}
        </Text>
        <PrimaryButton label="Добавить в корзину" onPress={() => addItem(book)} />
        <PrimaryButton
          variant="secondary"
          label="Оформить заказ"
          onPress={() => navigation.navigate('Checkout')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cover: {
    width: '100%',
    height: 280,
  },
  coverFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  author: {
    fontSize: 18,
  },
  meta: {
    gap: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    gap: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

