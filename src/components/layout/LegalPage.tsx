import type { ReactNode } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { getDictionary } from "@/content";
import type { Locale } from "@/lib/site";

export function LegalPage({ locale, title, children }: { locale: Locale; title: string; children: ReactNode }) {
  const t = getDictionary(locale);
  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t.common.home, path: "/" }, { label: title }]} title={title} text="Last updated: October 2026" />
      <section className="section">
        <div className="container container--narrow prose">{children}</div>
      </section>
    </>
  );
}
