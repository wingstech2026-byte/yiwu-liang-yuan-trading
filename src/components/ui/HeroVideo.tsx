"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface Props {
  src: string;
  poster: string;
  label: string;
  labels: { pause: string; play: string; mute: string; unmute: string };
}

/**
 * Full-bleed hero video: starts muted and loops (the only way browsers allow autoplay), with a visible
 * pause/play button and a mute toggle. It does not autoplay for visitors who prefer reduced motion, and it
 * pauses while scrolled out of view to save battery and data.
 */
export function HeroVideo({ src, poster, label, labels }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const userPaused = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) userPaused.current = true; // treat as "user chose not to autoplay"
    else video.play().catch(() => setPlaying(false)); // blocked autoplay: poster + play button remain

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) video.pause();
        else if (!userPaused.current) video.play().catch(() => undefined);
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      void video.play();
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div className="hero-media">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <span className="hero-media-label">{label}</span>
      <div className="hero-media-controls">
        <button type="button" className="hero-ctrl" onClick={toggleMute} aria-label={muted ? labels.unmute : labels.mute}>
          <Icon name={muted ? "volume-off" : "volume"} size={22} />
        </button>
        <button type="button" className="hero-ctrl" onClick={toggle} aria-label={playing ? labels.pause : labels.play}>
          <Icon name={playing ? "pause" : "play"} size={22} />
        </button>
      </div>
    </div>
  );
}
