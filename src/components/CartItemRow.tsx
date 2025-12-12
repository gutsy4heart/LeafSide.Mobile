import React, { useCallback, useRef, useEffect } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import type { CartItem } from '@/types/cart';
import { formatCurrency } from '@/utils/format';
import { useTheme } from '@/theme';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export const CartItemRow = React.memo<CartItemRowProps>(({ item, onIncrement, onDecrement, onRemove }) => {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const book = item.book;
  const price = formatCurrency(book?.price ?? item.priceSnapshot ?? 0);
  const isMinQuantity = item.quantity === 1;

  // Анимация появления при добавлении
  useEffect(() => {
    slideAnim.setValue(-20);
    opacityAnim.setValue(0);
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleIncrement = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onIncrement();
  }, [onIncrement, scaleAnim]);

  const handleDecrement = useCallback(() => {
    if (isMinQuantity) return; // Не позволяем уменьшить если quantity = 1
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onDecrement();
  }, [onDecrement, scaleAnim, isMinQuantity]);

  const handleRemove = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onRemove();
    });
  }, [onRemove, opacityAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={[styles.row, { borderColor: theme.colors.borderLight }]}>
        <Image
          source={{ uri: book?.imageUrl || 'https://via.placeholder.com/80' }}
          style={styles.cover}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
            {book?.title ?? 'Book'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {book?.author ?? 'Unknown author'}
          </Text>
          <Text style={[styles.price, { color: theme.colors.accent }]}>{price}</Text>
          <View style={styles.actions}>
            <Animated.View style={[styles.quantity, { transform: [{ scale: scaleAnim }] }]}>
              <Pressable
                onPress={handleDecrement}
                disabled={isMinQuantity}
                style={({ pressed }) => [
                  styles.quantityButton,
                  { 
                    borderColor: theme.colors.borderLight,
                    opacity: isMinQuantity ? 0.3 : (pressed ? 0.6 : 1),
                    backgroundColor: isMinQuantity ? theme.colors.glass : 'transparent',
                  },
                ]}
              >
                <Feather 
                  name="minus" 
                  size={16} 
                  color={isMinQuantity ? theme.colors.textMuted : theme.colors.textPrimary} 
                />
              </Pressable>
              <Text style={[styles.quantityValue, { color: theme.colors.textPrimary }]}>{item.quantity}</Text>
              <Pressable
                onPress={handleIncrement}
                style={({ pressed }) => [
                  styles.quantityButton,
                  { borderColor: theme.colors.borderLight, opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Feather name="plus" size={16} color={theme.colors.textPrimary} />
              </Pressable>
            </Animated.View>
            <Pressable
              onPress={handleRemove}
              style={({ pressed }) => [
                styles.removeButton,
                { backgroundColor: theme.colors.danger + '20', opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="trash-2" size={18} color={theme.colors.danger} />
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.bookId === nextProps.item.bookId &&
    prevProps.item.quantity === nextProps.item.quantity
  );
});

CartItemRow.displayName = 'CartItemRow';

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderWidth: 1.5,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cover: {
    width: 70,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  price: {
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
});
