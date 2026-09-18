"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const STILER = [
  {
    navn: "Skandinavisk",
    beskrivelse: "Lyst, luftig og rolig — møbler i tre og lin.",
    bilde: "/stiler/skandinavisk.jpg",
    accent: "#E8DCC3",
  },
  {
    navn: "Minimalistisk",
    beskrivelse: "Få, gjennomtenkte elementer. Ingenting overflødig.",
    bilde: "/stiler/minimalistisk.jpg",
    accent: "#F6F4EF",
  },
  {
    navn: "Moderne",
    beskrivelse: "Rene linjer og et friskt, nøytralt fargespill.",
    bilde: "/stiler/moderne.jpg",
    accent: "#A9C2C9",
  },
  {
    navn: "Industriell",
    beskrivelse: "Rått og varmt på samme tid — metall møter tre.",
    bilde: "/stiler/industriell.jpg",
    accent: "#C9A876",
  },
  {
    navn: "Boho",
    beskrivelse: "Tekstur, mønster og varme jordfarger.",
    bilde: "/stiler/boho.jpg",
    accent: "#E8DCC3",
  },
] as const;

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

      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center text-paper">
        {STILER.map((item, index) => (
          <Image
            key={item.navn}
            src={item.bilde}
            alt={`Kjøkken møblert i ${item.navn.toLowerCase()} stil`}
            fill
            className="object-cover transition-opacity duration-700"
            style={{ opacity: index === active ? 1 : 0 }}
            sizes="100vw"
          />
        ))}
        <div className="absolute inset-0 bg-ink/55" />

        <span className="relative font-mono text-xs uppercase tracking-widest opacity-80">
          Innredningsstil {active + 1} / {STILER.length}
        </span>
        <h2 className="relative font-heading text-4xl font-semibold sm:text-6xl">{stil.navn}</h2>
        <p className="relative max-w-sm text-base text-paper-2">{stil.beskrivelse}</p>

        <div className="relative mt-8 h-1 w-48 overflow-hidden rounded-full bg-paper/20">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((active + 1) / STILER.length) * 100}%`,
              backgroundColor: stil.accent,
            }}
          />
        </div>

        <p className="relative mt-2 font-mono text-xs text-paper-2 opacity-80">
          + 3 flere stiler å velge mellom i bestillingsskjemaet
        </p>
      </div>
    </section>
  );
}
