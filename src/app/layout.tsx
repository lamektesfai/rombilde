import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Inter } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const TITLE = "Rombilde – AI-møblering for boligsalg";
const DESCRIPTION =
  "Last opp et bilde av rommet ditt og få det AI-møblert på under ett minutt. Laget for privatpersoner som selger bolig uten megler.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rombilde.no"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.rombilde.no",
    siteName: "Rombilde",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no">
      <body
        className={`${bricolage.variable} ${inter.variable} ${plexMono.variable} font-sans antialiased`}
      >
        {children}
        <CookieConsent />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
