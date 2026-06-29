import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  uid: string; // 唯一标识 = productId + 规格组合
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  specs: Record<string, string>;
  merchantId: number;
}

interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (uid: string) => void;
  updateQuantity: (uid: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartCtx>({
  items: [], count: 0, total: 0,
  addItem: () => { }, removeItem: () => { }, updateQuantity: () => { }, clearCart: () => { },
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('wudong_cart') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('wudong_cart', JSON.stringify(items));
  }, [items]);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.uid === item.uid);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((uid: string) => {
    setItems(prev => prev.filter(i => i.uid !== uid));
  }, []);

  const updateQuantity = useCallback((uid: string, qty: number) => {
    if (qty <= 0) { removeItem(uid); return; }
    setItems(prev => prev.map(i => i.uid === uid ? { ...i, quantity: qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
