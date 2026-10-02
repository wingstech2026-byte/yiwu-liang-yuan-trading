import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { ProductExplorer } from "@/components/products/ProductExplorer";
import { CtaBand } from "@/components/ui/CtaBand";
import { categories } from "@/data/categories";
import { visibleProducts } from "@/data/products";
import { getDictionary } from "@/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/products", title: t.products.title, description: t.products.description });
}

export default async function ProductsPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  const p = t.products;

  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t.common.home, path: "/" }, { label: p.heading }]} title={p.heading} text={p.intro} />
      <section className="section" aria-label={p.heading}>
        <div className="container">
          {/* Suspense: the explorer reads ?category= on the client so this page stays statically generated. */}
          <Suspense fallback={<p className="result-count">Loading…</p>}>
            <ProductExplorer
              locale={locale}
              products={visibleProducts}
              categories={categories}
              labels={{
                requestQuote: t.common.requestQuote,
                moq: t.common.moq,
                moqUnknown: t.common.moqUnknown,
                placeholderNotice: t.common.placeholderNotice,
                searchLabel: p.searchLabel,
                searchPlaceholder: p.searchPlaceholder,
                all: p.all,
                empty: p.empty,
                resultsOne: p.resultsOne,
                resultsMany: p.resultsMany,
              }}
            />
          </Suspense>
          <p className="notice mt-7">{p.catalogNote}</p>
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
