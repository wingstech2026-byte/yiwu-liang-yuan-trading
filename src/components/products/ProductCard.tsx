import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { categoryBySlug } from "@/data/categories";
import type { Product } from "@/data/products";
import { localePath, type Locale } from "@/lib/site";

export interface ProductCardLabels {
  requestQuote: string;
  moq: string;
  moqUnknown: string;
  placeholderNotice: string;
}

export function PlaceholderTile({ category }: { category: string }) {
  const cat = categoryBySlug(category);
  return (
    <div className="ph-tile">
      <Icon name={cat?.icon ?? "image"} size={36} strokeWidth={1.3} />
      <span>[ADD PRODUCT IMAGE]</span>
    </div>
  );
}

export function ProductCard({ product, locale, labels }: { product: Product; locale: Locale; labels: ProductCardLabels }) {
  const detailHref = localePath(locale, `/products/${product.slug}`);
  const quoteHref = `${localePath(locale, "/contact")}?product=${encodeURIComponent(product.slug)}#inquiry`;
  const cat = categoryBySlug(product.category);

  return (
    <article className="product-card">
      <Link href={detailHref} className="product-media" aria-label={product.name} tabIndex={-1}>
        {product.image ? (
          <Image src={product.image} alt={product.alt} fill sizes="(min-width: 1200px) 280px, (min-width: 640px) 33vw, 100vw" />
        ) : (
          <PlaceholderTile category={product.category} />
        )}
        {product.status === "placeholder" && <span className="badge badge--warn">{labels.placeholderNotice}</span>}
      </Link>
      <div className="product-body">
        <span className="product-cat">{cat?.name}</span>
        <h3>
          <Link href={detailHref}>{product.name}</Link>
        </h3>
        <p>{product.description}</p>
        <div className="product-meta">
          <strong>{labels.moq}:</strong> {product.moq ?? labels.moqUnknown}
        </div>
        <div className="product-actions">
          <ButtonLink href={quoteHref} small>
            {labels.requestQuote}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
