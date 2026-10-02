import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/trade-information", title: t.trade.title, description: t.trade.description });
}

function Bullets({ items }: { items: readonly string[] }) {
  return (
    <ul className="check-list">
      {items.map((i) => (
        <li key={i}>
          <Icon name="check" size={20} />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function TradeInformationPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  const tr = t.trade;

  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t.common.home, path: "/" }, { label: tr.heading }]} title={tr.heading} text={tr.intro} />

      <section className="section" aria-labelledby="order-title">
        <div className="container">
          <SectionHeading id="order-title" title={tr.order.title} />
          <Reveal as="ol" stagger className="steps">
            {tr.order.steps.map((s) => (
              <li className="step" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="ship-title">
        <div className="container grid grid--2" style={{ gap: "3rem" }}>
          <Reveal variant="left">
            <SectionHeading id="ship-title" title={tr.shipping.title} text={tr.shipping.text} />
            <Bullets items={tr.shipping.factors} />
          </Reveal>
          <Reveal variant="right" delay={100}>
            <div className="card">
              <h3>{tr.shipping.methodsTitle}</h3>
              <Bullets items={tr.shipping.methods} />
              <p className="notice" style={{ marginTop: "1.5rem" }}>{t.services.note}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="pay-title">
        <div className="container container--narrow">
          <SectionHeading id="pay-title" title={tr.payment.title} text={tr.payment.text} />
          <Bullets items={tr.payment.factors} />
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="faq-title">
        <div className="container container--narrow">
          <SectionHeading id="faq-title" title={tr.faq.title} />
          <FaqAccordion items={tr.faq.items} />
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
