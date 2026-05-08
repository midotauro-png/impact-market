"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

interface CartState {
  items: CartItem[];
  vendorId: string | null;
  zoneId: string | null;
  add: (item: CartItem, zoneId: string) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      vendorId: null,
      zoneId: null,

      add(item, zoneId) {
        set((s) => {
          // If adding from a different vendor, clear cart first
          if (s.vendorId && s.vendorId !== item.vendor_id) {
            return {
              items: [{ ...item, quantity: 1 }],
              vendorId: item.vendor_id,
              zoneId,
            };
          }
          const existing = s.items.find((i) => i.product_id === item.product_id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product_id === item.product_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
              vendorId: item.vendor_id,
              zoneId,
            };
          }
          return {
            items: [...s.items, { ...item, quantity: 1 }],
            vendorId: item.vendor_id,
            zoneId,
          };
        });
      },

      setQty(productId, qty) {
        set((s) => {
          if (qty <= 0) {
            const items = s.items.filter((i) => i.product_id !== productId);
            return { items, vendorId: items.length ? s.vendorId : null };
          }
          return {
            items: s.items.map((i) =>
              i.product_id === productId ? { ...i, quantity: qty } : i
            ),
          };
        });
      },

      remove(productId) {
        set((s) => {
          const items = s.items.filter((i) => i.product_id !== productId);
          return { items, vendorId: items.length ? s.vendorId : null };
        });
      },

      clear() {
        set({ items: [], vendorId: null, zoneId: null });
      },
    }),
    { name: "bhm-cart" }
  )
);
