"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import FloorIllustration from "./FloorIllustration";

export interface Floor {
  id: string;
  content: React.ReactNode;
}

export default function BuildingFrame({ floors }: { floors: Floor[] }) {
  const [activeFloor, setActiveFloor] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll<HTMLElement>("[data-floor]");
    if (!els || els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const floor = Number(entry.target.getAttribute("data-floor"));
          if (floor) setActiveFloor(floor);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-[6rem_minmax(0,1fr)_6rem] xl:grid-cols-[8rem_minmax(0,1fr)_8rem]"
    >
      {floors.map((floor, index) => {
        const nummer = index + 1;
        const aktiv = nummer === activeFloor;

        return (
          <Fragment key={floor.id}>
            <div
              className={`hidden border-t lg:flex lg:items-center lg:justify-center lg:transition-colors lg:duration-500 ${
                aktiv ? "border-line bg-paper-2" : "border-line/50 bg-paper-2/40"
              }`}
              style={{ gridRow: nummer, gridColumn: 1 }}
            >
              <FloorIllustration variant="empty" />
            </div>

            <div data-floor={nummer} style={{ gridRow: nummer, gridColumn: 2 }}>
              {floor.content}
            </div>

            <div
              className={`hidden border-t lg:flex lg:items-center lg:justify-center lg:transition-colors lg:duration-500 ${
                aktiv ? "border-pine bg-sand-light/60" : "border-line/50 bg-sand-light/20"
              }`}
              style={{ gridRow: nummer, gridColumn: 3 }}
            >
              <FloorIllustration variant="styled" />
            </div>
          </Fragment>
        );
      })}

      <div className="pointer-events-none fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-line bg-paper/90 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-ink-soft shadow-sm backdrop-blur lg:block">
        Etasje {String(activeFloor).padStart(2, "0")} / {String(floors.length).padStart(2, "0")}
      </div>
    </div>
  );
}
