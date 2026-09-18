"use client";

import { useEffect, useRef, useState } from "react";

const STILER = [
  {
    navn: "Skandinavisk",
    beskrivelse: "Lyst, luftig og rolig — møbler i tre og lin.",
    bg: "#EFEBE1",
    accent: "#2E4034",
    text: "#1F2420",
  },
  {
    navn: "Minimalistisk",
    beskrivelse: "Få, gjennomtenkte elementer. Ingenting overflødig.",
    bg: "#F6F4EF",
    accent: "#1F2420",
    text: "#1F2420",
  },
  {
    navn: "Moderne",
    beskrivelse: "Rene linjer og et friskt, nøytralt fargespill.",
    bg: "#A9C2C9",
    accent: "#1F2420",
    text: "#1F2420",
  },
  {
    navn: "Industriell",
    beskrivelse: "Rått og varmt på samme tid — metall møter tre.",
    bg: "#1F2420",
    accent: "#C9A876",
    text: "#F6F4EF",
  },
  {
    navn: "Boho",
    beskrivelse: "Tekstur, mønster og varme jordfarger.",
    bg: "#E8DCC3",
    accent: "#2E4034",
    text: "#1F2420",
  },
] as const;

function StolIkon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 sm:h-32 sm:w-32" aria-hidden="true">
      <rect x="30" y="20" width="60" height="45" rx="6" fill="none" stroke={color} strokeWidth="3" />
      <rect x="24" y="60" width="72" height="30" rx="8" fill={color} />
      <line x1="30" y1="90" x2="30" y2="104" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="90" x2="90" y2="104" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function StyleCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const markers = containerRef.current?.querySelectorAll<HTMLElement>("[data-slide]");
    if (!markers || markers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number(entry.target.getAttribute("data-slide"));
          setActive(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    markers.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stil = STILER[active];

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: `${STILER.length * 100}vh` }}
    >
      {STILER.map((_, index) => (
        <div key={index} data-slide={index} className="absolute w-full" style={{ top: `${index * 100}vh`, height: "100vh" }} />
      ))}

      <div
        className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center transition-colors duration-700"
        style={{ backgroundColor: stil.bg, color: stil.text }}
      >
        <span className="font-mono text-xs uppercase tracking-widest opacity-70">
          Innredningsstil {active + 1} / {STILER.length}
        </span>
        <StolIkon color={stil.accent} />
        <h2 className="font-heading text-4xl font-semibold sm:text-6xl">{stil.navn}</h2>
        <p className="max-w-sm text-base opacity-80">{stil.beskrivelse}</p>

        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((active + 1) / STILER.length) * 100}%`,
              backgroundColor: stil.accent,
            }}
          />
        </div>

        <p className="mt-2 font-mono text-xs opacity-60">
          + 3 flere stiler å velge mellom i bestillingsskjemaet
        </p>
      </div>
    </section>
  );
}
