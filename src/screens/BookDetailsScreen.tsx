import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { PrimaryButton } from '@/components/PrimaryButton';
import { BookImage } from '@/components/BookImage';
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
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
        <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Загрузка...</Text>
      </View>
    );
  }

  if (error || !book) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <Feather name="alert-circle" size={48} color={theme.colors.danger} />
        <Text style={[styles.errorText, { color: theme.colors.textPrimary }]}>
          Не удалось загрузить книгу
        </Text>
        <PrimaryButton label="Назад" onPress={() => navigation.goBack()} variant="secondary" />
      </View>
    );
  }

  const isAvailable = book.isAvailable && book.price !== null && book.price !== undefined;
  const metaItems = [
    { label: 'Жанр', value: book.genre },
    { label: 'Автор', value: book.author },
    { label: 'Издательство', value: book.publishing },
    { label: 'Год издания', value: book.created },
    { label: 'Язык', value: book.language || 'Не указан' },
    { label: 'Страниц', value: book.pageCount ? `${book.pageCount}` : '—' },
    { label: 'ISBN', value: book.isbn || '—' },
  ].filter((item) => item.value);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BookImage imageUrl={book.imageUrl} height={320} borderRadius={0} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>{book.title}</Text>
            {!isAvailable && (
              <View style={[styles.unavailableBadge, { backgroundColor: theme.colors.danger }]}>
                <Text style={styles.unavailableText}>Недоступна</Text>
              </View>
            )}
          </View>
          <Text style={[styles.author, { color: theme.colors.textMuted }]}>{book.author}</Text>
        </View>

        <View style={[styles.metaSection, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Информация</Text>
          <View style={styles.metaGrid}>
            {metaItems.map((item, index) => (
              <View key={index} style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.colors.textMuted }]}>{item.label}:</Text>
                <Text style={[styles.metaValue, { color: theme.colors.textPrimary }]}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {book.description && (
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Описание</Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{book.description}</Text>
          </View>
        )}
      </View>

      <View style={[styles.footer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
        <View style={styles.priceSection}>
          <Text style={[styles.priceLabel, { color: theme.colors.textMuted }]}>Цена</Text>
          <Text style={[styles.price, { color: theme.colors.accent }]}>{formatCurrency(book.price)}</Text>
        </View>
        {isAvailable ? (
          <View style={styles.actions}>
            <PrimaryButton
              label="Добавить в корзину"
              onPress={() => {
                addItem(book);
                navigation.navigate('Cart');
              }}
              variant="primary"
            />
            <PrimaryButton
              variant="secondary"
              label="Оформить заказ"
              onPress={() => navigation.navigate('Checkout')}
            />
          </View>
        ) : (
          <View style={[styles.unavailableMessage, { backgroundColor: theme.colors.cardAlt }]}>
            <Feather name="info" size={20} color={theme.colors.textMuted} />
            <Text style={[styles.unavailableMessageText, { color: theme.colors.textMuted }]}>
              Книга временно недоступна для заказа
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  header: {
    gap: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    flex: 1,
    lineHeight: 34,
  },
  unavailableBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  unavailableText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  author: {
    fontSize: 20,
    fontWeight: '500',
  },
  metaSection: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  metaGrid: {
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 120,
  },
  metaValue: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  descriptionSection: {
    gap: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    gap: 16,
    borderTopWidth: 1,
  },
  priceSection: {
    gap: 4,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
  },
  unavailableMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  unavailableMessageText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
