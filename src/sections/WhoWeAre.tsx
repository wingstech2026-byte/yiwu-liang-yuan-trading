import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/site";

export function WhoWeAre({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const w = t.home.who;
  return (
    <section className="section" aria-labelledby="who-title">
      <div className="container split">
        <Reveal variant="left">
          <span className="eyebrow">{w.eyebrow}</span>
          <h2 id="who-title">{w.title}</h2>
          {w.paragraphs.map((p) => (
            <p key={p} className="lead">
              {p}
            </p>
          ))}
          <ul className="check-list check-list--cols mt-6">
            {w.points.map((p) => (
              <li key={p}>
                <Icon name="check" size={20} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <ButtonLink href={localePath(locale, "/about")} variant="navy">
              {t.common.learnMore}
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal variant="right" delay={120}>
          <div className="photo-frame">
            <Image src="/images/perfume-1.jpg" alt="Lalla Bella fragrance bottle among flowers" fill sizes="(min-width: 900px) 560px, 100vw" style={{ objectPosition: "center 55%" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
