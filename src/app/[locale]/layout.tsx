import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/seo/Analytics";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScrollEffects } from "@/components/ui/ScrollEffects";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { company, getChannels } from "@/data/company";
import { FloatingActions } from "@/components/ui/FloatingActions";
import { hasChat } from "@/lib/optional-scripts";
import { getDictionary } from "@/content";
import { isLocale, locales, siteUrl } from "@/lib/site";
import { organizationSchema } from "@/lib/seo";

import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#0b1f3a", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.defaultTitle, template: "%s" },
    description: t.meta.defaultDescription,
    keywords: t.meta.keywords,
    applicationName: company.name,
    authors: [{ name: company.name }],
    formatDetection: { telephone: false },
    verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <html lang={locale} dir="ltr" className={inter.variable}>
      <body>
        <QuoteProvider labels={t.quote}>
        <ScrollEffects />
        <a className="skip-link" href="#main">
          {t.common.skipToContent}
        </a>
        <div className="topbar">
          <div className="container">
            <span>
              <strong>{company.address.city}</strong>, {company.address.region}, {company.address.country}
            </span>
          </div>
        </div>
        <Header
          locale={locale}
          nav={t.nav}
          labels={{
            getQuote: t.common.getQuote,
            openMenu: t.common.openMenu,
            closeMenu: t.common.closeMenu,
            language: t.common.language,
            comingSoon: t.common.comingSoon,
            quote: t.quote.linkLabel,
          }}
          companyName={company.name}
          tagline="Sourcing & Wholesale · Yiwu, China"
        />
        <main id="main">{children}</main>
        <Footer locale={locale} />
        <FloatingActions
          whatsappHref={getChannels().find((c) => c.key === "whatsapp")?.href ?? null}
          labels={t.floating}
          chatEnabled={hasChat}
        />
        <JsonLd data={organizationSchema(locale)} />
        <Analytics locale={locale} labels={t.consent} />
        </QuoteProvider>
      </body>
    </html>
  );
}
