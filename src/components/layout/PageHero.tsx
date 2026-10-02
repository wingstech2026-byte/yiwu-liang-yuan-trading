import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import type { Locale } from "@/lib/site";

export function PageHero({ locale, crumbs, title, text }: { locale: Locale; crumbs: Crumb[]; title: string; text?: string }) {
  return (
    <section className="page-hero">
      <div className="container">
        <Breadcrumbs locale={locale} items={crumbs} />
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}
