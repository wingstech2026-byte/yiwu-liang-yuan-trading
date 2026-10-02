import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { categories, categoryBySlug } from "@/data/categories";
import { company, fullAddress, getChannels } from "@/data/company";
import { visibleProducts } from "@/data/products";
import { getDictionary } from "@/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "/contact", title: t.contact.title, description: t.contact.description });
}

export default async function ContactPage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  const c = t.contact;
  const channels = getChannels();

  return (
    <>
      <PageHero locale={locale} crumbs={[{ label: t.common.home, path: "/" }, { label: c.heading }]} title={c.heading} text={c.intro} />

      <section className="section">
        <div className="container contact-grid">
          <div>
            <div className="card">
              <h2 style={{ fontSize: "var(--fs-h4)" }}>{c.companyTitle}</h2>
              <dl className="channel-list" style={{ margin: 0 }}>
                <div className="channel">
                  <dt>{t.about.profile.rows.name}</dt>
                  <dd>{company.name}</dd>
                </div>
                <div className="channel">
                  <dt>{t.common.legalRep}</dt>
                  <dd>{company.legalRepresentative}</dd>
                </div>
                <div className="channel">
                  <dt>{c.addressTitle}</dt>
                  <dd>
                    <address style={{ fontStyle: "normal" }}>{fullAddress}</address>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="card" style={{ marginTop: "1.5rem" }}>
              <h2 style={{ fontSize: "var(--fs-h4)" }}>{c.channelsTitle}</h2>
              <dl style={{ margin: 0 }}>
                {channels.map((ch) => (
                  <div className="channel" key={ch.key}>
                    <dt>{ch.label}</dt>
                    <dd>
                      {ch.value ? (
                        ch.href ? <a href={ch.href}>{ch.value}</a> : ch.value
                      ) : (
                        <span className="is-placeholder">{ch.placeholder}</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              {channels.some((ch) => !ch.value) && <p className="hint" style={{ marginTop: "1rem" }}>{c.channelsNote}</p>}
            </div>
          </div>

          <div id="inquiry" className="form-card">
            <h2 style={{ fontSize: "var(--fs-h3)" }}>{c.formTitle}</h2>
            <Suspense fallback={<p className="hint">Loading form…</p>}>
              <InquiryForm
                locale={locale}
                labels={t.form}
                categories={categories.map((cat) => cat.name)}
                otherLabel="Other / not listed"
                products={visibleProducts.map((p) => ({ slug: p.slug, name: p.name, categoryName: categoryBySlug(p.category)?.name ?? "" }))}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
