import Link from "next/link";

export const metadata = {
  title: "Vilkår for kjøp – Rombilde",
};

const SEKSJONER = [
  {
    id: "parter",
    tittel: "1. Parter",
    innhold: (
      <>
        <p>
          Selger er Studio Tesfai, org.nr. 938 110 212 («selger», «vi»), som driver
          nettstedet rombilde.no.
        </p>
        <p>
          Kjøper er den personen som gjennomfører en bestilling på rombilde.no
          («kunde», «du»).
        </p>
        <p>Kontakt: post@rombilde.no</p>
      </>
    ),
  },
  {
    id: "betaling",
    tittel: "2. Betaling",
    innhold: (
      <p>
        Betaling skjer via Vipps på bestillingstidspunktet. Alle priser er oppgitt i
        norske kroner (NOK) og inkluderer eventuelle avgifter. Prisen som gjelder er
        den som er oppgitt på rombilde.no på tidspunktet bestillingen gjennomføres.
      </p>
    ),
  },
  {
    id: "levering",
    tittel: "3. Levering",
    innhold: (
      <p>
        Rombilde leverer en digital tjeneste, ikke en fysisk vare. Etter godkjent
        betaling behandles bildet ditt med kunstig intelligens, og resultatet
        leveres digitalt — normalt innen 20–60 sekunder — som nedlastbart bilde på
        kvitteringssiden og på e-post til adressen du oppga ved bestilling. Ved høy
        pågang eller tekniske forhold kan leveringen ta noe lengre tid.
      </p>
    ),
  },
  {
    id: "angrerett",
    tittel: "4. Angrerett",
    innhold: (
      <>
        <p>
          Ved forbrukerkjøp gjelder angrerettloven, som normalt gir 14 dagers
          angrerett ved fjernsalg.
        </p>
        <p>
          Rombilde leverer imidlertid en tjeneste som igangsettes og fullføres
          umiddelbart etter betaling. Angreretten bortfaller derfor når tjenesten er
          levert i sin helhet, jf. angrerettloven § 22. Ved å gjennomføre kjøpet
          samtykker du uttrykkelig til at leveringen starter før 14-dagersfristen
          utløper, og at du dermed mister angreretten når det ferdige bildet er
          levert til deg.
        </p>
      </>
    ),
  },
  {
    id: "retur",
    tittel: "5. Retur",
    innhold: (
      <p>
        Siden Rombilde leverer et digitalt produkt, er retur i tradisjonell forstand
        ikke aktuelt. Dersom leveransen feiler eller ikke fullføres, refunderes
        betalingen automatisk — se punkt 6.
      </p>
    ),
  },
  {
    id: "reklamasjon",
    tittel: "6. Reklamasjonshåndtering",
    innhold: (
      <>
        <p>
          Hvis resultatet ikke svarer til det du bestilte (f.eks. teknisk feil, feil
          romtype/stil, eller mangelfull kvalitet), kan du ta kontakt på
          post@rombilde.no innen rimelig tid. Vi vurderer saken og kjører bildet på
          nytt eller refunderer kjøpet.
        </p>
        <p>
          Dersom en bestilling feiler permanent på vår side, refunderes betalingen
          automatisk via Vipps, og du varsles på e-post.
        </p>
      </>
    ),
  },
  {
    id: "konfliktlosning",
    tittel: "7. Konfliktløsning",
    innhold: (
      <p>
        Klager rettes først til selger på e-postadressen ovenfor. Fører ikke dette
        frem, kan du ta kontakt med Forbrukerrådet (forbrukerradet.no) for mekling.
        Forbrukere bosatt i EU/EØS kan også bruke EU-kommisjonens klageportal for
        nettkjøp: ec.europa.eu/consumers/odr.
      </p>
    ),
  },
];

export default function VilkarPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
          Rombilde
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-24">
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Vilkår for kjøp
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
