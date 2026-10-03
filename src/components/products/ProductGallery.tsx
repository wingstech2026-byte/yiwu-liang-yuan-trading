"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { PlaceholderTile } from "@/components/products/ProductCard";
import { Icon } from "@/components/ui/Icon";
import type { ProductVideo } from "@/data/products";

interface Props {
  images: string[];
  videos?: ProductVideo[];
  alt: string;
  name: string;
  category: string;
  illustrativeLabel?: string; // shown over the media when the photos are illustrative
  labels: { zoom: string; closeZoom: string; prevImage: string; nextImage: string };
}

type Item = { kind: "image"; src: string } | { kind: "video"; video: ProductVideo };

export function ProductGallery({ images, videos = [], alt, name, category, illustrativeLabel, labels }: Props) {
  const [active, setActive] = useState(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items: Item[] = [...images.map((src): Item => ({ kind: "image", src })), ...videos.map((video): Item => ({ kind: "video", video }))];

  if (items.length === 0) {
    return (
      <div className="gallery-main">
        <PlaceholderTile category={category} />
      </div>
    );
  }

  const current = items[active];

  const openZoom = (index: number) => {
    setZoomIndex(index);
    dialogRef.current?.showModal();
  };
  const closeZoom = () => dialogRef.current?.close();
  const stepZoom = (delta: number) => setZoomIndex((i) => (i === null ? i : (i + delta + images.length) % images.length));
  const onDialogKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (images.length < 2) return;
    if (e.key === "ArrowRight") stepZoom(1);
    if (e.key === "ArrowLeft") stepZoom(-1);
  };

  return (
    <div>
      <div className="gallery-main">
        {current.kind === "image" ? (
          <button type="button" className="gallery-zoom" onClick={() => openZoom(images.indexOf(current.src))} aria-label={labels.zoom}>
            <Image
              key={current.src}
              src={current.src}
              alt={`${alt || name}${items.length > 1 ? ` — view ${active + 1} of ${items.length}` : ""}`}
              fill
              priority={active === 0}
              sizes="(min-width: 900px) 600px, 100vw"
            />
            <span className="gallery-zoom-icon" aria-hidden="true">
              <Icon name="zoom" size={20} />
            </span>
          </button>
        ) : (
          // Remounted per video (key) so switching clips resets playback. The visitor starts it.
          <video
            key={current.video.src}
            className="gallery-video"
            controls
            playsInline
            preload="metadata"
            poster={current.video.poster}
            aria-label={`${name} video: ${current.video.label}`}
          >
            <source src={current.video.src} type="video/mp4" />
          </video>
        )}
        {illustrativeLabel && current.kind === "image" && <span className="badge badge--warn gallery-badge">{illustrativeLabel}</span>}
      </div>
      {items.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label={`${name} images and videos`}>
          {items.map((item, i) => (
            <button
              key={item.kind === "image" ? item.src : item.video.src}
              type="button"
              className="thumb"
              aria-current={i === active}
              aria-label={item.kind === "image" ? `Show image ${i + 1}` : `Play video: ${item.video.label}`}
              onClick={() => setActive(i)}
            >
              {item.kind === "image" ? (
                <Image src={item.src} alt="" width={84} height={64} />
              ) : (
                <span className="thumb-video">
                  <Image src={item.video.poster} alt="" width={84} height={64} />
                  <span className="thumb-play">
                    <Icon name="play" size={18} />
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Full-screen viewer. Native <dialog>: focus trap, Esc to close, and a click on the dark backdrop closes it. */}
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={`${name} — ${labels.zoom}`}
        onClose={() => setZoomIndex(null)}
        onClick={(e) => e.target === e.currentTarget && closeZoom()}
        onKeyDown={onDialogKey}
      >
        {zoomIndex !== null && (
          <div className="lightbox-stage">
            <Image src={images[zoomIndex]} alt={`${alt || name} — ${zoomIndex + 1} / ${images.length}`} fill sizes="100vw" quality={85} />
          </div>
        )}
        <button type="button" className="lightbox-btn lightbox-close" onClick={closeZoom} aria-label={labels.closeZoom}>
          <Icon name="close" size={22} />
        </button>
        {images.length > 1 && (
          <>
            <button type="button" className="lightbox-btn lightbox-prev" onClick={() => stepZoom(-1)} aria-label={labels.prevImage}>
              <Icon name="arrow-left" size={22} />
            </button>
            <button type="button" className="lightbox-btn lightbox-next" onClick={() => stepZoom(1)} aria-label={labels.nextImage}>
              <Icon name="arrow-right" size={22} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}
