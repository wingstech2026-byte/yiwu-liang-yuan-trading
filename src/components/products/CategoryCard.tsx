import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Category } from "@/data/categories";
import { localePath, type Locale } from "@/lib/site";

export function CategoryCard({ category, locale, cta }: { category: Category; locale: Locale; cta: string }) {
  // Deep-links into the filtered product list.
  const href = `${localePath(locale, "/products")}?category=${category.slug}`;
  return (
    <Link href={href} className="cat-card">
      <div className={`cat-media${category.image ? "" : " cat-media--icon"}`}>
        {category.image ? (
          <Image
            src={category.image}
            alt={category.imageAlt ?? ""}
            fill
            sizes="(min-width: 1200px) 280px, (min-width: 640px) 33vw, 100vw"
          />
        ) : (
          <Icon name={category.icon} size={54} strokeWidth={1.3} />
        )}
      </div>
      <div className="cat-body">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
        <span className="link-arrow">
          {cta} <Icon name="arrow-right" size={18} />
        </span>
      </div>
    </Link>
  );
}
