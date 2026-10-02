import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/site";

export function CtaBand({ locale, title, text }: { locale: Locale; title?: string; text?: string }) {
  const t = getDictionary(locale);
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container">
        <Reveal>
          <div className="cta-inner">
            <div>
              <h2 id="cta-title">{title ?? t.home.contactStrip.title}</h2>
              <p>{text ?? t.home.contactStrip.text}</p>
            </div>
            <div className="btn-row">
              <ButtonLink href={localePath(locale, "/contact")}>{t.common.sendInquiry}</ButtonLink>
              <ButtonLink href={localePath(locale, "/products")} variant="outline-light">
                {t.common.exploreProducts}
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
