import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content";
import type { Locale } from "@/lib/site";

export function WhyUs({ locale }: { locale: Locale }) {
  const w = getDictionary(locale).home.why;
  return (
    <section className="section section--navy" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading id="why-title" eyebrow={w.eyebrow} title={w.title} />
        <Reveal stagger className="grid grid--2 why-grid">
          {w.items.map((item) => (
            <div className="feature" key={item.title}>
              <span className="icon-tile icon-tile--dark">
                <Icon name={item.icon as IconName} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
