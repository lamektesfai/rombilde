import Link from "next/link";

export const metadata = {
  title: "Personvernerklæring – Rombilde",
};

const SEKSJONER = [
  {
    id: "behandlingsansvarlig",
    tittel: "1. Behandlingsansvarlig",
    innhold: (
      <p>
        Studio Tesfai, org.nr. 938 110 212, er behandlingsansvarlig for
        personopplysningene som samles inn gjennom rombilde.no. Spørsmål om
        personvern kan rettes til rombilde@outlook.com.
      </p>
    ),
  },
  {
    id: "hvilke-opplysninger",
    tittel: "2. Hvilke personopplysninger vi behandler",
    innhold: (
      <>
        <p>Vi behandler følgende personopplysninger når du bruker Rombilde:</p>
        <ul className="list-disc pl-5">
          <li>E-postadressen du oppgir ved bestilling</li>
          <li>
            Bildet du laster opp av rommet ditt, samt mellomresultat og
            ferdig resultatbilde
          </li>
          <li>
            Bekreftelse på gjennomført betaling fra Vipps (vi lagrer ikke
            kortopplysninger eller tilsvarende selv — dette håndteres av Vipps)
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "formal",
    tittel: "3. Formål og behandlingsgrunnlag",
    innhold: (
      <p>
        Opplysningene brukes til å levere tjenesten du har bestilt (møblere
        bildet ditt med AI), gjennomføre betalingen, sende deg resultatet, og
        besvare eventuelle henvendelser om bestillingen. Behandlingsgrunnlaget
        er at det er nødvendig for å oppfylle avtalen med deg, jf. personvern­-
        forordningen (GDPR) artikkel 6 nr. 1 bokstav b.
      </p>
    ),
  },
  {
    id: "databehandlere",
    tittel: "4. Databehandlere og tredjeparter",
    innhold: (
      <>
        <p>
          Vi bruker følgende tjenesteleverandører for å levere Rombilde.
          Disse behandler data på våre vegne og har ikke selvstendig rett til
          å bruke opplysningene til andre formål:
        </p>
        <ul className="list-disc pl-5">
          <li>Decor8 AI — prosesserer bildet ditt med kunstig intelligens</li>
          <li>Vipps — betalingsformidling</li>
          <li>Cloudflare — lagring av bilder</li>
          <li>Supabase — database for bestillinger</li>
          <li>Resend — utsending av e-post</li>
          <li>Vercel — drift av selve nettsiden</li>
          <li>Inngest — bakgrunnsprosessering av bestillinger</li>
        </ul>
      </>
    ),
  },
  {
    id: "overforing",
    tittel: "5. Overføring til land utenfor EØS",
    innhold: (
      <p>
        Enkelte av leverandørene ovenfor kan behandle eller lagre data i land
        utenfor EU/EØS, blant annet USA. I slike tilfeller sørger vi for at
        overføringen skjer på et gyldig overføringsgrunnlag, som EUs
        standard­kontraktsvilkår (SCC) eller tilsvarende godkjente mekanismer.
      </p>
    ),
  },
  {
    id: "lagringstid",
    tittel: "6. Lagringstid",
    innhold: (
      <p>
        Originalbildet du laster opp slettes automatisk fra våre servere
        senest 6 måneder etter kjøpet. Øvrige bestillingsopplysninger
        (e-post, tidspunkt, status) beholdes noe lenger av hensyn til
        regnskaps- og bokføringsplikten. Du kan når som helst be om at
        opplysningene dine slettes tidligere, se punkt 7.
      </p>
    ),
  },
  {
    id: "rettigheter",
    tittel: "7. Dine rettigheter",
    innhold: (
      <>
        <p>Du har etter personvernforordningen (GDPR) rett til å:</p>
        <ul className="list-disc pl-5">
          <li>få innsyn i hvilke opplysninger vi har lagret om deg</li>
          <li>få rettet uriktige opplysninger</li>
          <li>be om at opplysningene dine slettes</li>
          <li>be om begrensning av behandlingen</li>
          <li>be om at opplysningene dine utleveres i et strukturert format (dataportabilitet)</li>
        </ul>
        <p>
          Ta kontakt på rombilde@outlook.com for å benytte deg av disse
          rettighetene.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    tittel: "8. Informasjonskapsler (cookies)",
    innhold: (
      <p>
        Rombilde bruker per i dag ingen sporings- eller analysecookies. Kun
        strengt nødvendig, teknisk funksjonalitet som kreves for at nettsiden
        skal fungere er i bruk.
      </p>
    ),
  },
  {
    id: "klage",
    tittel: "9. Kontakt og klageadgang",
    innhold: (
      <p>
        Spørsmål om vår behandling av personopplysninger kan rettes til
        rombilde@outlook.com. Du har også rett til å klage til Datatilsynet
        (datatilsynet.no) dersom du mener vi behandler personopplysningene
        dine i strid med regelverket.
      </p>
    ),
  },
];

export default function PersonvernPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
          Rombilde
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-24">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Personvernerklæring
        </h1>

        <div className="mt-10 flex flex-col gap-8">
          {SEKSJONER.map((seksjon) => (
            <section key={seksjon.id} id={seksjon.id} className="flex flex-col gap-2">
              <h2 className="font-heading text-lg font-semibold">{seksjon.tittel}</h2>
              <div className="flex flex-col gap-2 text-sm leading-relaxed text-ink-soft">
                {seksjon.innhold}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
