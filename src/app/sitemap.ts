import type { MetadataRoute } from "next";
import { visibleProducts } from "@/data/products";
import { absoluteUrl, locales } from "@/lib/site";

const staticPaths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services", priority: 0.8, changeFrequency: "monthly" },
  { path: "/trade-information", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = (path: string) => ({ languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)])) });
  return locales.flatMap((locale) => [
    ...staticPaths.map((p) => ({
      url: absoluteUrl(locale, p.path),
      changeFrequency: p.changeFrequency,
      priority: p.priority,
      alternates: alternates(p.path),
    })),
    // Placeholder listings are noindex, so they are left out of the sitemap.
    ...visibleProducts
      .filter((p) => p.status === "active")
      .map((p) => ({
        url: absoluteUrl(locale, `/products/${p.slug}`),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: alternates(`/products/${p.slug}`),
      })),
  ]);
}
