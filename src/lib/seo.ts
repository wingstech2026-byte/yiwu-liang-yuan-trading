import type { Metadata } from "next";
import { company } from "@/data/company";
import { absoluteUrl, locales, siteUrl, type Locale } from "@/lib/site";

interface PageMeta {
  locale: Locale;
  path: string; // "" for home, otherwise "/about" etc.
  title: string;
  description: string;
  image?: string; // path under /public
  noindex?: boolean;
  type?: "website" | "article";
}

/** Metadata for a page: canonical, language alternates, Open Graph and Twitter cards. */
export function pageMetadata({ locale, path, title, description, image, noindex, type = "website" }: PageMeta): Metadata {
  const url = absoluteUrl(locale, path);
  const ogImage = image ?? "/images/logo-emblem.png";
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(l, path)])),
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: company.name,
      locale: locale === "en" ? "en_US" : locale,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

/** Organization schema — contains only verified facts. Unset contact channels are omitted. */
export function organizationSchema(locale: Locale) {
  const c = company.contact;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    alternateName: company.nameZh,
    url: absoluteUrl(locale),
    logo: `${siteUrl}/images/logo-emblem.png`,
    foundingDate: company.established,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.countryCode,
    },
    ...(c.email || c.phone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            ...(c.email ? { email: c.email } : {}),
            ...(c.phone ? { telephone: c.phone } : {}),
            availableLanguage: ["English"],
          },
        }
      : {}),
  };
}
