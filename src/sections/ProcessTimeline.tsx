import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/site";

/** Visual version of the ordering steps from the Trade Information page (same source text, no new claims). */
export function ProcessTimeline({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const p = t.home.process;
  const steps = t.trade.order.steps;
  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading id="process-title" eyebrow={p.eyebrow} title={p.title} text={p.text} />
        <Reveal as="ol" stagger className="timeline">
          {steps.map((step, i) => (
            <li className="timeline-step" key={step.title}>
              <span className="timeline-node" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </Reveal>
        <div className="text-center mt-7">
          <Link className="link-arrow" href={localePath(locale, "/trade-information")}>
            {p.cta} <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
