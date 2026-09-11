"use client";

import * as React from "react";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
  weightGrams: number;
  variationId?: string;
  variationLabel?: string;
  variationValue?: string;
  maxStock: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variationId?: string) => void;
  setQuantity: (productId: string, quantity: number, variationId?: string) => void;
  clear: () => void;
  subtotal: number;
  totalWeightGrams: number;
  itemCount: number;
  isHydrated: boolean;
}

const CartContext = React.createContext<CartContextValue | null>(null);

const STORAGE_KEY = "lc-imports:cart";

// A chave usa o id da variação (não o texto da cor/tamanho), já que uma
// combinação de tamanho+cor pode repetir a mesma cor em linhas diferentes.
function cartKey(productId: string, variationId?: string) {
  return `${productId}::${variationId ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    // Hidratação única a partir do localStorage no mount do client — não é
    // um efeito colateral reativo, por isso o setState direto aqui é seguro.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage indisponível (modo privado) — carrinho começa vazio.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignora falha de escrita em localStorage
    }
  }, [items, isHydrated]);

  const addItem = React.useCallback<CartContextValue["addItem"]>((item, quantity = 1) => {
    setItems((current) => {
      const key = cartKey(item.productId, item.variationId);
      const existing = current.find(
        (i) => cartKey(i.productId, i.variationId) === key
      );

      if (existing) {
        const nextQuantity = Math.min(existing.quantity + quantity, existing.maxStock);
        return current.map((i) =>
          cartKey(i.productId, i.variationId) === key
            ? { ...i, quantity: nextQuantity }
            : i
        );
      }

      return [...current, { ...item, quantity: Math.min(quantity, item.maxStock) }];
    });
  }, []);

  const removeItem = React.useCallback<CartContextValue["removeItem"]>(
    (productId, variationId) => {
      setItems((current) =>
        current.filter(
          (i) => cartKey(i.productId, i.variationId) !== cartKey(productId, variationId)
        )
      );
    },
    []
  );

  const setQuantity = React.useCallback<CartContextValue["setQuantity"]>(
    (productId, quantity, variationId) => {
      setItems((current) =>
        current
          .map((i) =>
            cartKey(i.productId, i.variationId) === cartKey(productId, variationId)
              ? { ...i, quantity: Math.max(0, Math.min(quantity, i.maxStock)) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    []
  );

  const clear = React.useCallback(() => setItems([]), []);

  const { subtotal, totalWeightGrams, itemCount } = React.useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.unitPrice * item.quantity,
        totalWeightGrams: acc.totalWeightGrams + item.weightGrams * item.quantity,
        itemCount: acc.itemCount + item.quantity,
      }),
      { subtotal: 0, totalWeightGrams: 0, itemCount: 0 }
    );
  }, [items]);

  const value = React.useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      setQuantity,
      clear,
      subtotal,
      totalWeightGrams,
      itemCount,
      isHydrated,
    }),
    [items, addItem, removeItem, setQuantity, clear, subtotal, totalWeightGrams, itemCount, isHydrated]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return context;
}
