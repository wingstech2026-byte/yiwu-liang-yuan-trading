"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ProductCard, type ProductCardLabels } from "@/components/products/ProductCard";
import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";
import type { Locale } from "@/lib/site";

interface Props {
  locale: Locale;
  products: Product[];
  categories: Category[];
  labels: ProductCardLabels & {
    searchLabel: string;
    searchPlaceholder: string;
    all: string;
    empty: string;
    resultsOne: string;
    resultsMany: string;
  };
}

const normalise = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

export function ProductExplorer({ locale, products, categories, labels }: Props) {
  // Category cards deep-link here with ?category=<slug>.
  const initialCategory = useSearchParams().get("category");
  const valid = categories.some((c) => c.slug === initialCategory);
  const [category, setCategory] = useState<string>(valid ? initialCategory! : "all");
  const [query, setQuery] = useState("");

  const categoryByslug = useMemo(() => new Map(categories.map((c) => [c.slug, c])), [categories]);

  const results = useMemo(() => {
    const q = normalise(query.trim());
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      const hay = normalise(
        [p.name, p.description, categoryByslug.get(p.category)?.name ?? "", ...p.specifications.map((s) => s.value)].join(" "),
      );
      return q.split(/\s+/).every((word) => hay.includes(word));
    });
  }, [products, category, query, categoryByslug]);

  return (
    <div>
      <div className="toolbar">
        <div className="search-box">
          <Icon name="search" size={20} />
          <label className="sr-only" htmlFor="product-search">
            {labels.searchLabel}
          </label>
          <input
            id="product-search"
            type="search"
            className="input"
            placeholder={labels.searchPlaceholder}
            value={query}
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="chips" role="group" aria-label="Filter by category">
          <button type="button" className="chip" aria-pressed={category === "all"} onClick={() => setCategory("all")}>
            {labels.all}
          </button>
          {categories.map((c) => (
            <button key={c.slug} type="button" className="chip" aria-pressed={category === c.slug} onClick={() => setCategory(c.slug)}>
              {c.shortName}
            </button>
          ))}
        </div>
        <p className="result-count" role="status" aria-live="polite">
          {results.length} {results.length === 1 ? labels.resultsOne : labels.resultsMany}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid--3">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} labels={labels} />
          ))}
        </div>
      ) : (
        <div className="empty-state">{labels.empty}</div>
      )}
    </div>
  );
}
