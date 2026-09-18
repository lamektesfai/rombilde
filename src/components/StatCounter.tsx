"use client";

import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  target,
  suffix = "",
  prefix = "",
  label,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasRun.current) return;
          hasRun.current = true;

          const duration = 1200;
          const start = performance.now();

          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);

          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center">
      <span className="font-mono text-4xl font-semibold text-paper sm:text-5xl">
        {prefix}
        {value}
        {suffix}
      </span>
      <span className="text-sm text-paper-2">{label}</span>
    </div>
  );
}
