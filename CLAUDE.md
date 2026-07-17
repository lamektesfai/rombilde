# Rombilde — prosjektbrief for Claude Code

## Hva dette er
SaaS-nettside der brukere laster opp bilde av et rom (tomt eller møblert), og får et AI-møblert bilde tilbake på 20–60 sekunder. Målgruppe: private boligselgere i Norge som selger uten megler (FSBO), typisk via Finn.no.

## Kjernefunksjon
Rommet kan være møblert når bildet tas. Da må pipelinen først fjerne eksisterende møbler digitalt, og deretter møblere på nytt (to sekvensielle AI-API-kall). Tomme rom trenger kun siste steg.

## Tech-stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Postgres via Prisma
- Cloudflare R2 for bildelagring (S3-kompatibelt SDK)
- Vipps ePayment API for betaling
- AI virtual staging API (Decor8 AI eller tilsvarende)
- Hosting: Vercel

## Designtokens
paper #F6F4EF, paper-2 #EFEBE1, ink #1F2420, ink-soft #4B5148, pine #2E4034 (primær/CTA), pine-light #3F5A4B, sand #C9A876, sand-light #E8DCC3, sky #A9C2C9, dusty #7C93A3, line #D8D2C4
Fonter: Bricolage Grotesque (overskrifter), Inter (brødtekst), IBM Plex Mono (tall/labels)
Merkenavn: Rombilde. Alt UI på norsk.

## Datamodell (Prisma)
Job: id, userEmail, originalImageUrl, roomType, roomState (empty|furnished), style, status (pending|paid|processing|completed|failed), intermediateImageUrl, resultImageUrl, retryCount, failureReason, createdAt, completedAt

Payment: id, jobId, amount (øre), currency, paymentMethod (vipps|card), paymentStatus, pspReference, createdAt

## AI-pipeline
- Tomt rom: ett kall - bilde + romtype + stil -> møblert bilde
- Møblert rom: to kall i sekvens - (1) fjern møbler -> mellombilde, (2) møbler mellombildet -> sluttresultat. Lagre mellombildet slik at retry ikke må kjøre steg 1 på nytt.

## Prising (øre)
- Tomt rom: 12900 (129 kr) per bilde
- Møblert rom: 17900 (179 kr) per bilde
- Boligpakke: 44900 (449 kr) for 5 bilder
- Full pakke: 69900 (699 kr) for 10 bilder
- Ingen abonnement - engangskjøp/kredittpakker

## Betalingsflyt (Vipps ePayment API)
1. Opprett jobb i DB med status pending
2. Opprett Vipps-betaling, redirect bruker dit
3. Vipps sender webhook epayments.payment.authorized.v1
4. Webhooken MÅ verifisere HMAC-SHA256-signaturen (x-ms-date, host, x-ms-content-sha256, Authorization-header)
5. Etter verifisert signatur: capture beløpet, sett jobb til paid, start AI-pipeline
6. Prosessering bør kjøres i en kø (Trigger.dev/Inngest), ikke direkte i webhook-handleren

## Bevisst IKKE i MVP
- Brukerkontoer/innlogging (kun e-post)
- Abonnement
- Batch-opplasting

## Eksterne kontoer brukeren må opprette selv
- Vipps utviklerkonto + Merchant Serial Number (developer.vippsmobilepay.com)
- Decor8 AI-konto (eller alternativ) for API-nøkkel
- Cloudflare-konto for R2-bucket
- Supabase eller Neon for Postgres
- Vercel-konto for hosting
- Resend eller Postmark for e-post

## Miljøvariabler
DATABASE_URL
R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL
AI_STAGING_API_KEY
VIPPS_CLIENT_ID, VIPPS_CLIENT_SECRET, VIPPS_SUBSCRIPTION_KEY, VIPPS_MERCHANT_SERIAL_NUMBER, VIPPS_WEBHOOK_SECRET, VIPPS_BASE_URL
RESEND_API_KEY
APP_BASE_URL

## Kommandoer
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

## Åpningsprompt til Claude Code
Sett opp et nytt Next.js-prosjekt for dette basert på beskrivelsen over.
Start med grunnstrukturen: Prisma-skjema, mappestruktur for API-ruter,
Tailwind-config med designtokens, og en enkel landingsside. Kjør
"npm install" og få dev-serveren til å starte før du går videre.
