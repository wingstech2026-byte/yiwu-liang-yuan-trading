"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface Props {
  src: string;
  poster: string;
  label: string;
  playLabel: string;
}

/**
 * Hero video with a large play button over the poster. Native controls stay available (and work without JS).
 * It never autoplays: sound/data are the visitor's choice, and the file only loads once they press play.
 */
export function HeroVideo({ src, poster, label, playLabel }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="hero-video">
      <div className="hero-video-frame">
        <video
          ref={ref}
          controls
          playsInline
          preload="none"
          poster={poster}
          aria-label={label}
          onPlay={() => setPlaying(true)}
          onEnded={() => setPlaying(false)}
        >
          <source src={src} type="video/mp4" />
        </video>
        {!playing && (
          <button type="button" className="hero-video-play" aria-label={`${playLabel}: ${label}`} onClick={() => ref.current?.play()}>
            <Icon name="play" size={34} />
          </button>
        )}
      </div>
      <figcaption>{label}</figcaption>
    </figure>
  );
}
