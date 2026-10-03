"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface QuoteItem {
  slug: string;
  name: string;
  category: string; // category display name, used to preselect the inquiry form
}

interface QuoteLabels {
  add: string;
  added: string;
  remove: string;
  linkLabel: string;
  summaryTitle: string;
  summaryHint: string;
  clear: string;
  removeItem: string;
}

interface QuoteContextValue {
  items: QuoteItem[];
  ready: boolean;
  labels: QuoteLabels;
  has: (slug: string) => boolean;
  toggle: (item: QuoteItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "yly-quote-v1";
const MAX_ITEMS = 20;

const QuoteContext = createContext<QuoteContextValue | null>(null);

function sanitize(value: unknown): QuoteItem[] {
  if (!Array.isArray(value)) return [];
  const out: QuoteItem[] = [];
  for (const v of value) {
    if (!v || typeof v !== "object") continue;
    const { slug, name, category } = v as Record<string, unknown>;
    if (typeof slug === "string" && typeof name === "string" && typeof category === "string" && slug.length <= 120 && name.length <= 160) {
      out.push({ slug, name, category: category.slice(0, 120) });
    }
  }
  return out.slice(0, MAX_ITEMS);
}

/**
 * The visitor's quote list (like a cart, but for inquiries: no prices). Kept in localStorage so it survives
 * navigation and reloads, and stays in sync across tabs. All storage access is wrapped: the site works without it.
 */
export function QuoteProvider({ labels, children }: { labels: QuoteLabels; children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(sanitize(JSON.parse(raw)));
    } catch {
      /* storage unavailable or corrupted: start with an empty list */
    }
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setItems(e.newValue ? sanitize(JSON.parse(e.newValue)) : []);
      } catch {
        setItems([]);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);
  const toggle = useCallback((item: QuoteItem) => {
    setItems((prev) => (prev.some((i) => i.slug === item.slug) ? prev.filter((i) => i.slug !== item.slug) : [...prev, item].slice(0, MAX_ITEMS)));
  }, []);
  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({ items, ready, labels, has, toggle, remove, clear }), [items, ready, labels, has, toggle, remove, clear]);
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote(): QuoteContextValue {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
