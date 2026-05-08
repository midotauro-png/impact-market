"use client";
import { useState, useEffect, useCallback } from "react";

const KEY = "bhm-favorites";

function load(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function save(ids: Set<string>) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...ids]));
  } catch { /* noop */ }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavorites(load());
  }, []);

  const toggle = useCallback((vendorId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(vendorId)) {
        next.delete(vendorId);
      } else {
        next.add(vendorId);
      }
      save(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (vendorId: string) => favorites.has(vendorId),
    [favorites]
  );

  return { favorites, toggle, isFavorite };
}
