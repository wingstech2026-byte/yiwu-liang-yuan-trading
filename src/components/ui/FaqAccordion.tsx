import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";

// Native <details>: keyboard accessible and works without JavaScript.
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            {item.q}
            <Icon name="chevron-down" size={20} />
          </summary>
          <div className="faq-a">{item.a}</div>
        </details>
      ))}
      <JsonLd data={schema} />
    </div>
  );
}
