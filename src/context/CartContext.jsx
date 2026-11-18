import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { KEYS, readJSON, writeJSON } from '../services/storage';
import { computeTotals } from '../utils/helpers';

/**
 * The cart stores ONLY { id, quantity } lines. Name / price / photo are read
 * from the product list every render, so a price change in products.js shows
 * up in existing carts and nothing stale is kept in localStorage.
 */
const MAX_QTY = 20;
const CartContext = createContext(null);

const clamp = (n) => Math.max(1, Math.min(MAX_QTY, n));

const reducer = (lines, action) => {
  switch (action.type) {
    case 'ADD': {
      const exists = lines.some((l) => l.id === action.id);
      return exists
        ? lines.map((l) => (l.id === action.id ? { ...l, quantity: clamp(l.quantity + action.quantity) } : l))
        : [...lines, { id: action.id, quantity: clamp(action.quantity) }];
    }
    case 'INC':
      return lines.map((l) => (l.id === action.id ? { ...l, quantity: clamp(l.quantity + 1) } : l));
    case 'DEC':
      return lines
        .map((l) => (l.id === action.id ? { ...l, quantity: l.quantity - 1 } : l))
        .filter((l) => l.quantity > 0);
    case 'SET':
      return action.quantity <= 0
        ? lines.filter((l) => l.id !== action.id)
        : lines.map((l) => (l.id === action.id ? { ...l, quantity: clamp(action.quantity) } : l));
    case 'REMOVE':
      return lines.filter((l) => l.id !== action.id);
    case 'CLEAR':
      return [];
    default:
      return lines;
  }
};

const init = () => {
  const saved = readJSON(KEYS.cart, []);
  if (!Array.isArray(saved)) return [];
  return saved.filter((l) => l && Number.isFinite(l.id) && l.quantity > 0);
};

export const CartProvider = ({ children }) => {
  const [lines, dispatch] = useReducer(reducer, undefined, init);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { products } = useProducts(); // live catalogue (prices can change in the admin panel)

  useEffect(() => {
    writeJSON(KEYS.cart, lines);
  }, [lines]);

  const items = useMemo(() => {
    const byId = new Map(products.map((p) => [String(p.id), p]));
    return lines
      .map((l) => {
        const product = byId.get(String(l.id));
        return product && product.available ? { ...product, quantity: l.quantity } : null;
      })
      .filter(Boolean);
  }, [lines, products]);

  const totals = useMemo(() => computeTotals(items), [items]);

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({ type: 'ADD', id: product.id, quantity });
  }, []);
  const increaseQuantity = useCallback((id) => dispatch({ type: 'INC', id }), []);
  const decreaseQuantity = useCallback((id) => dispatch({ type: 'DEC', id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'SET', id, quantity }), []);
  const removeFromCart = useCallback((id) => dispatch({ type: 'REMOVE', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      subtotal: totals.subtotal,
      itemCount: totals.itemCount,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      updateQuantity,
      removeFromCart,
      clearCart,
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, totals, addToCart, increaseQuantity, decreaseQuantity, updateQuantity, removeFromCart, clearCart, drawerOpen, openDrawer, closeDrawer]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
