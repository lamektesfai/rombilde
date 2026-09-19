"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, getStoredConsent } from "@/lib/consent";

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(getStoredConsent() === "granted");

    function onConsentChange(event: Event) {
      const detail = (event as CustomEvent<"granted" | "denied">).detail;
      setGranted(detail === "granted");
    }

    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  if (!granted || !measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
