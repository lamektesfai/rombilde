"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const LINJER = [
  "Dette er rommet ditt i dag.",
  "Tomt, eller kanskje fullt av møbler som ikke gjør seg på bilde.",
  "Om 20–60 sekunder er det klart for Finn.no.",
];

export default function JourneyReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const lineEls = containerRef.current?.querySelectorAll<HTMLElement>("[data-line]");
    if (!lineEls || lineEls.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lineEls.forEach((el) => el.classList.add("is-visible"));
      setVisibleLines(LINJER.length);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("is-visible");
          const index = Number(el.dataset.line);
          setVisibleLines((current) => Math.max(current, index + 1));
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    lineEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const visMøblert = visibleLines >= LINJER.length;

  return (
    <section ref={containerRef} className="relative bg-paper-2 h-[250vh]">
      <div className="sticky top-0 mx-auto flex h-screen max-w-6xl flex-col items-center justify-center gap-10 px-6 sm:flex-row sm:gap-16">
        <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-line shadow-lg">
          <Image
            src="/eksempel/for.jpg"
            alt="Rommet før AI-møblering"
            fill
            className="object-cover transition-opacity duration-700"
            style={{ opacity: visMøblert ? 0 : 1 }}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
          <Image
            src="/eksempel/etter.webp"
            alt="Rommet etter AI-møblering"
            fill
            className="object-cover transition-opacity duration-700"
            style={{ opacity: visMøblert ? 1 : 0 }}
            sizes="(min-width: 640px) 50vw, 100vw"
          />
          <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 font-mono text-xs uppercase tracking-wide text-paper transition-opacity duration-700" style={{ opacity: visMøblert ? 0 : 1 }}>
            Før
          </span>
          <span className="absolute left-4 top-4 rounded-full bg-pine px-3 py-1 font-mono text-xs uppercase tracking-wide text-paper transition-opacity duration-700" style={{ opacity: visMøblert ? 1 : 0 }}>
            Etter
          </span>
        </div>

        <div className="flex max-w-sm flex-col gap-6">
          {LINJER.map((linje, index) => (
            <p
              key={linje}
              data-line={index}
              data-animate-item
              className="font-heading text-2xl font-semibold leading-snug sm:text-3xl"
            >
              {linje}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
