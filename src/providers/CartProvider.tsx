import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { fetchBookById } from '@/services/books';
import {
  addOrUpdateCartItem,
  clearCart as clearRemoteCart,
  fetchCart,
  removeCartItem,
} from '@/services/cart';
import type { Book } from '@/types/book';
import type { CartItem, CartResponse, CartState } from '@/types/cart';

import { useAuth } from './AuthProvider';

const LOCAL_CART_KEY = '@leafside/cart';

interface CartContextValue {
  cart: CartState;
  isSyncing: boolean;
  addItem: (book: Book, quantity?: number) => Promise<void>;
  updateQuantity: (bookId: string, quantity: number) => Promise<void>;
  removeItem: (bookId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialCart: CartState = {
  items: [],
  source: 'local',
};

const enrichItems = async (payload: CartResponse): Promise<CartItem[]> => {
  const items = await Promise.all(
    payload.items.map(async (item) => {
      try {
        const book = await fetchBookById(item.bookId);
        return { ...item, book };
      } catch {
        return { ...item };
      }
    }),
  );

  return items;
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();
  const [cart, setCart] = useState<CartState>(initialCart);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadLocalCart = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(LOCAL_CART_KEY);
      if (stored) {
        const parsed: CartState = JSON.parse(stored);
        setCart({ ...parsed, source: 'local' });
      } else {
        setCart(initialCart);
      }
    } catch {
      setCart(initialCart);
    }
  }, []);

  const persistLocalCart = useCallback(async (nextCart: CartState) => {
    try {
      await AsyncStorage.setItem(LOCAL_CART_KEY, JSON.stringify(nextCart));
    } catch {
      // ignore persistence errors
    }
  }, []);

  const loadRemoteCart = useCallback(async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const response = await fetchCart(token);
      const populated = await enrichItems(response);
      setCart({
        id: response.id,
        items: populated,
        updatedAt: new Date().toISOString(),
        source: 'remote',
      });
    } catch {
      // ignore network errors and keep previous cart snapshot
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadRemoteCart();
    } else {
      loadLocalCart();
    }
  }, [loadLocalCart, loadRemoteCart, token]);

  const refresh = useCallback(async () => {
    if (token) {
      await loadRemoteCart();
    } else {
      await loadLocalCart();
    }
  }, [loadLocalCart, loadRemoteCart, token]);

  const addItem = useCallback(
    async (book: Book, quantity = 1) => {
      if (!token) {
        setCart((current) => {
          const existing = current.items.find((item) => item.bookId === book.id);
          const nextItems = existing
            ? current.items.map((item) =>
                item.bookId === book.id ? { ...item, quantity: item.quantity + quantity } : item,
              )
            : [...current.items, { bookId: book.id, quantity, book }];
          const nextCart = { ...current, items: nextItems, source: 'local' };
          persistLocalCart(nextCart);
          return nextCart;
        });
        return;
      }

      setIsSyncing(true);
      try {
        const existing = cart.items.find((item) => item.bookId === book.id);
        const desiredQuantity = existing ? existing.quantity + quantity : quantity;
        const response = await addOrUpdateCartItem(token, book.id, desiredQuantity);
        const populated = await enrichItems(response);
        setCart({
          id: response.id,
          items: populated,
          updatedAt: new Date().toISOString(),
          source: 'remote',
        });
      } finally {
        setIsSyncing(false);
      }
    },
    [cart.items, persistLocalCart, token],
  );

  const removeItem = useCallback(
    async (bookId: string) => {
      if (!token) {
        setCart((current) => {
          const nextCart = { ...current, items: current.items.filter((item) => item.bookId !== bookId) };
          persistLocalCart(nextCart);
          return nextCart;
        });
        return;
      }

      setIsSyncing(true);
      try {
        await removeCartItem(token, bookId);
        await loadRemoteCart();
      } finally {
        setIsSyncing(false);
      }
    },
    [loadRemoteCart, persistLocalCart, token],
  );

  const updateQuantity = useCallback(
    async (bookId: string, quantity: number) => {
      if (quantity <= 0) return removeItem(bookId);

      if (!token) {
        setCart((current) => {
          const nextItems = current.items.map((item) =>
            item.bookId === bookId ? { ...item, quantity } : item,
          );
          const nextCart = { ...current, items: nextItems };
          persistLocalCart(nextCart);
          return nextCart;
        });
        return;
      }

      setIsSyncing(true);
      try {
        const response = await addOrUpdateCartItem(token, bookId, quantity);
        const populated = await enrichItems(response);
        setCart({
          id: response.id,
          items: populated,
          updatedAt: new Date().toISOString(),
          source: 'remote',
        });
      } finally {
        setIsSyncing(false);
      }
    },
    [persistLocalCart, removeItem, token],
  );

  const clear = useCallback(async () => {
    if (!token) {
      setCart(initialCart);
      await persistLocalCart(initialCart);
      return;
    }

    setIsSyncing(true);
    try {
      await clearRemoteCart(token);
      await loadRemoteCart();
    } finally {
      setIsSyncing(false);
    }
  }, [loadRemoteCart, persistLocalCart, token]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isSyncing,
      addItem,
      updateQuantity,
      removeItem,
      clear,
      refresh,
    }),
    [addItem, cart, clear, isSyncing, refresh, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }

  return ctx;
};

