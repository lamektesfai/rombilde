"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const singles = gsap.utils.toArray<HTMLElement>("[data-animate]");
      singles.forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 16,
          duration: 0.4,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const groups = gsap.utils.toArray<HTMLElement>("[data-animate-group]");
      groups.forEach((group) => {
        const items = group.querySelectorAll("[data-animate-item]");
        if (!items.length) return;

        gsap.from(items, {
          opacity: 0,
          y: 12,
          duration: 0.35,
          stagger: 0.06,
          ease: "power1.out",
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return null;
}
