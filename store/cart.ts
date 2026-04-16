import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/lib/products/types';

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  category: string;
  weightLabel: string;
  priceInr: number;
  qty: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  addItem: (product: Product, variant: ProductVariant, qty?: number) => void;
  removeItem: (itemId: string) => void;
  updateQty: (itemId: string, qty: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      addItem: (product, variant, qty = 1) => {
        const items = get().items;
        const itemId = `${product.id}::${variant.id}`;
        const existing = items.find((item) => item.id === itemId);
        if (existing) {
          const updated = items.map((item) =>
            item.id === itemId
              ? { ...item, qty: Math.min(item.qty + qty, variant.stockQty || 99) }
              : item
          );
          set({ items: updated });
          return;
        }
        const nextItem: CartItem = {
          id: itemId,
          productId: product.id,
          variantId: variant.id,
          name: product.name,
          slug: product.slug,
          category: product.category,
          weightLabel: variant.weightLabel,
          priceInr: variant.priceInr,
          qty: Math.min(qty, variant.stockQty || 99),
          image: product.images[0]?.url ?? ''
        };
        set({ items: [...items, nextItem] });
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((item) => item.id !== itemId) });
      },
      updateQty: (itemId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((item) => item.id !== itemId) });
          return;
        }
        set({
          items: get().items.map((item) => (item.id === itemId ? { ...item, qty } : item))
        });
      },
      clear: () => set({ items: [] })
    }),
    {
      name: 'seven-sisters-cart',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      merge: (persistedState, currentState) => {
        const persisted = persistedState as CartState | undefined;
        if (currentState.items.length > 0 && (!persisted?.items || persisted.items.length === 0)) {
          return { ...currentState, ...persisted, items: currentState.items };
        }
        return { ...currentState, ...(persisted ?? {}) };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);

export const selectCartSubtotal = (items: CartItem[]) =>
  items.reduce((total, item) => total + item.priceInr * item.qty, 0);

export const selectCartCount = (items: CartItem[]) => items.reduce((total, item) => total + item.qty, 0);
