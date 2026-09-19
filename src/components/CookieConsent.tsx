"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStoredConsent, setStoredConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (!visible) return null;

  function svar(value: "granted" | "denied") {
    setStoredConsent(value);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper px-6 py-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-sm text-ink-soft">
          Vi bruker analyse-cookies for å forstå hvordan Rombilde brukes. Du
          kan lese mer i{" "}
          <Link href="/personvern#cookies" className="underline underline-offset-2 hover:text-pine">
            personvernerklæringen
          </Link>
          .
        </p>
        <div className="flex flex-shrink-0 gap-3">
          <button
            type="button"
            onClick={() => svar("denied")}
            className="rounded-full border border-line px-5 py-2 text-sm text-ink-soft transition hover:-translate-y-0.5 hover:border-pine hover:text-pine active:translate-y-0"
          >
            Avslå
          </button>
          <button
            type="button"
            onClick={() => svar("granted")}
            className="rounded-full bg-pine px-5 py-2 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-pine-light active:translate-y-0"
          >
            Godta
          </button>
        </div>
      </div>
    </div>
  );
}
