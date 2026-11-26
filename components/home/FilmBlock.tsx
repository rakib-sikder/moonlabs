"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Reveal } from "@/components/ui/Section";

/**
 * Our short film in a large card. Nothing is downloaded until the visitor presses play
 * (preload="none" and the video element only exists after the click).
 */
export function FilmBlock() {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  // Start playback right after the click that swapped the poster for the player.
  useEffect(() => {
    if (playing) ref.current?.play().catch(() => {});
  }, [playing]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <Reveal>
        <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-border bg-[#0b0c0f] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.45)]">
          {playing ? (
            <video
              ref={ref}
              className="h-full w-full"
              src="/video/nine-paper-cranes-720p.mp4"
              poster="/video/nine-paper-cranes-poster.webp"
              controls
              autoPlay
              playsInline
              preload="none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 h-full w-full text-left"
              aria-label="Play our short film Nine Paper Cranes, 2 minutes 41 seconds"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/video/nine-paper-cranes-poster.webp"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
              <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-ink shadow-[0_0_0_12px_rgba(245,178,78,0.18)] transition-transform duration-300 group-hover:scale-110 sm:h-24 sm:w-24">
                <Play className="ml-1 h-8 w-8 fill-current sm:h-10 sm:w-10" />
              </span>
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 text-white sm:p-10">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">A Moonlab short film · 2:41</span>
                <span className="font-display text-3xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">Nine Paper Cranes</span>
                <span className="max-w-xl text-sm text-white/80 sm:text-lg">The night shift a small business never had.</span>
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
