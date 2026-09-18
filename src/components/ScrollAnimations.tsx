"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;

          if (target.hasAttribute("data-animate-group")) {
            const items = Array.from(
              target.querySelectorAll<HTMLElement>("[data-animate-item]")
            );
            items.forEach((item, index) => {
              item.style.transitionDelay = `${index * 60}ms`;
              item.classList.add("is-visible");
            });
          } else {
            target.classList.add("is-visible");
          }

          obs.unobserve(target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    const targets = document.querySelectorAll<HTMLElement>(
      "[data-animate], [data-animate-group]"
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
