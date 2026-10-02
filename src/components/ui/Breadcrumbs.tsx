import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, localePath, type Locale } from "@/lib/site";

export interface Crumb {
  label: string;
  path?: string; // omitted for the current page
}

export function Breadcrumbs({ locale, items, light }: { locale: Locale; items: Crumb[]; light?: boolean }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.path !== undefined ? { item: absoluteUrl(locale, c.path) } : {}),
    })),
  };
  return (
    <nav className={`breadcrumbs${light ? " breadcrumbs--light" : ""}`} aria-label="Breadcrumb">
      <ol>
        {items.map((c, i) => (
          <li key={c.label}>
            {c.path !== undefined && i < items.length - 1 ? (
              <Link href={localePath(locale, c.path)}>{c.label}</Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
      <JsonLd data={schema} />
    </nav>
  );
}
