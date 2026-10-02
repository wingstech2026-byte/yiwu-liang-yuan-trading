import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { businessScope, company, fullAddress } from "@/data/company";
import { getDictionary } from "@/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/about", title: t.about.title, description: t.about.description });
}

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  const a = t.about;
  const rows = a.profile.rows;
  const { businessLicenseImage, certifications } = company.documents;

  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t.common.home, path: "/" }, { label: a.heading }]} title={a.heading} text={a.intro} />

      <section className="section" aria-labelledby="profile-title">
        <div className="container split">
          <Reveal variant="left">
            <SectionHeading id="profile-title" title={a.profile.title} text={a.profile.text} />
          </Reveal>
          <Reveal variant="right" delay={100}>
            <dl className="facts">
              <div><dt>{rows.name}</dt><dd>{company.name}</dd></div>
              <div><dt>{rows.nameZh}</dt><dd lang="zh">{company.nameZh}</dd></div>
              <div><dt>{rows.entity}</dt><dd>{company.entityType}</dd></div>
              <div><dt>{rows.rep}</dt><dd>{company.legalRepresentative}</dd></div>
              <div><dt>{rows.capital}</dt><dd>{company.registeredCapital}</dd></div>
              <div><dt>{rows.established}</dt><dd>{company.establishedLabel}</dd></div>
              <div><dt>{rows.address}</dt><dd>{fullAddress}</dd></div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="business-title">
        <div className="container">
          <SectionHeading id="business-title" title={a.business.title} text={a.business.text} />
          <Reveal stagger className="grid grid--3">
            {a.business.items.map((item) => (
              <div className="card" key={item.title}>
                <h3>{item.title}</h3>
                <p style={{ color: "var(--muted)" }}>{item.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="scope-title">
        <div className="container">
          <SectionHeading id="scope-title" title={a.scope.title} text={a.scope.text} />
          <Reveal as="ul" stagger className="check-list check-list--cols">
            {businessScope.map((item) => (
              <li key={item}>
                <Icon name="check" size={20} />
                <span>{item}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="docs-title">
        <div className="container">
          <SectionHeading id="docs-title" title={a.documents.title} text={a.documents.text} />
          <div className="doc-grid">
            <div className="card doc-card">
              <h3>{a.documents.licenseLabel}</h3>
              <div className="doc-slot">
                {businessLicenseImage ? (
                  <Image src={businessLicenseImage} alt={`${company.name} business license`} width={600} height={800} />
                ) : (
                  <div className="ph-tile">
                    <Icon name="file" size={40} strokeWidth={1.3} />
                    <span>{a.documents.licensePlaceholder}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="card doc-card">
              <h3>{a.documents.certsLabel}</h3>
              <div className="doc-slot">
                {certifications.length > 0 ? (
                  <ul className="check-list">
                    {certifications.map((c) => (
                      <li key={c.name}>
                        <Icon name="check" size={20} />
                        <span>{c.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="ph-tile">
                    <Icon name="shield" size={40} strokeWidth={1.3} />
                    <span>{a.documents.certsPlaceholder}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <div className="container">
          <SectionHeading id="approach-title" title={a.approach.title} />
          <Reveal stagger className="grid grid--3">
            {a.approach.items.map((item) => (
              <div className="feature" key={item.title}>
                <span className="icon-tile">
                  <Icon name="check-circle" />
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

      <CtaBand locale={locale} />
    </>
  );
}
