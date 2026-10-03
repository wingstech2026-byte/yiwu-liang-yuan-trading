import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { HeroVideo } from "@/components/ui/HeroVideo";
import { visibleProducts } from "@/data/products";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/site";

// The hero shows the Lalla Bella brand video. It is read from product data so the clip is defined in one place.
const heroVideo = visibleProducts.find((p) => p.slug === "lalla-bella-glass-bottle-sample")?.videos?.[0] ?? null;

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const h = t.home.hero;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-panel">
        <div className="hero-bg">
          <Image src="/images/copper-cathode-2.jpg" alt={h.imageAlt} fill priority sizes="(min-width: 960px) 50vw, 100vw" />
        </div>
        <span className="hero-shape hero-shape--a" aria-hidden="true" />
        <span className="hero-shape hero-shape--b" aria-hidden="true" />
        <div className="hero-copy">
          <span className="eyebrow">{h.eyebrow}</span>
          <h1 id="hero-title">{h.title}</h1>
          <span className="hero-rule" aria-hidden="true" />
          <p className="lead">{h.text}</p>
          <div className="btn-row">
            <ButtonLink href={localePath(locale, "/products")}>{t.common.exploreProducts}</ButtonLink>
            <ButtonLink href={localePath(locale, "/contact")} variant="outline-light">
              {t.common.sendInquiry}
            </ButtonLink>
          </div>
        </div>
      </div>
      {heroVideo && (
        <HeroVideo
          src={heroVideo.src}
          poster={heroVideo.poster}
          label={heroVideo.label}
          labels={{ pause: t.common.pauseVideo, play: t.common.playVideo, mute: t.common.muteVideo, unmute: t.common.unmuteVideo }}
        />
      )}
    </section>
  );
}
