import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/services", title: t.services.title, description: t.services.description });
}

export default async function ServicesPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  const s = t.services;

  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t.common.home, path: "/" }, { label: s.heading }]} title={s.heading} text={s.intro} />
      <section className="section" aria-label={s.heading}>
        <div className="container">
          <Reveal stagger className="grid grid--3">
            {s.items.map((item, i) => (
              <article className="card" key={item.title}>
                <span className="icon-tile">
                  <Icon name={item.icon as IconName} />
                </span>
                <h2 style={{ fontSize: "var(--fs-h3)" }}>
                  <span style={{ color: "var(--accent-text)", marginRight: "0.5rem" }}>{String(i + 1).padStart(2, "0")}</span>
                  {item.title}
                </h2>
                <p style={{ color: "var(--muted)" }}>{item.text}</p>
                {"bullets" in item && item.bullets && (
                  <ul className="check-list" style={{ marginTop: "1rem" }}>
                    {item.bullets.map((b) => (
                      <li key={b}>
                        <Icon name="check" size={18} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Reveal>
          <p className="notice mt-7">{s.note}</p>
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
