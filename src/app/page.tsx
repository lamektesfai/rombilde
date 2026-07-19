import Link from "next/link";

const trinn = [
  {
    tall: "01",
    tittel: "Last opp et bilde",
    tekst: "Ta et bilde av rommet med mobilen – tomt eller møblert, det spiller ingen rolle.",
  },
  {
    tall: "02",
    tittel: "Velg stil",
    tekst: "Velg romtype og innredningsstil som passer boligen din.",
  },
  {
    tall: "03",
    tittel: "Betal med Vipps",
    tekst: "Rask og trygg betaling. Ingen abonnement, du betaler kun for bildene du bruker.",
  },
  {
    tall: "04",
    tittel: "Få resultatet",
    tekst: "I løpet av 20–60 sekunder får du et AI-møblert bilde klart for Finn.no.",
  },
];

const fototips = [
  {
    tittel: "Ikke bruk vidvinkel",
    tekst:
      "Unngå ultra-wide-funksjonen på mobilen. Den forvrenger rommet og gjør at bildet ikke stemmer med virkeligheten.",
  },
  {
    tittel: "Hold kameraet vannrett",
    tekst:
      "Unngå å vippe kameraet opp eller ned. Vipper du oppover, vil veggene se ut som de faller bakover.",
  },
  {
    tittel: "Ta bildet fra hoftehøyde",
    tekst:
      "Ta bildene stående, fra omtrent hoftehøyde. Det gir et naturlig perspektiv for den som ser på bildene.",
  },
  {
    tittel: "Bruk hjørnene i rommet",
    tekst:
      "Plasser deg i et hjørne av rommet. Da får du med deg mest mulig av rommet og skaper en god romfølelse.",
  },
];

const priser = [
  {
    navn: "Tomt rom",
    pris: "129 kr",
    beskrivelse: "Per bilde av et tomt rom.",
  },
  {
    navn: "Møblert rom",
    pris: "179 kr",
    beskrivelse: "Per bilde – vi fjerner møblene digitalt før vi møblerer på nytt.",
  },
  {
    navn: "Boligpakke",
    pris: "449 kr",
    beskrivelse: "5 bilder samlet – vår mest populære pakke.",
    fremhevet: true,
  },
  {
    navn: "Full pakke",
    pris: "699 kr",
    beskrivelse: "10 bilder samlet for hele boligen.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-heading text-xl font-semibold tracking-tight">
          Rombilde
        </span>
        <a
          href="#priser"
          className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-pine hover:text-pine"
        >
          Se priser
        </a>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pb-20 pt-12 text-center sm:pt-20">
        <span className="rounded-full bg-sand-light px-4 py-1 font-mono text-xs uppercase tracking-wide text-ink-soft">
          Laget for boligselgere uten megler
        </span>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight sm:text-6xl">
          Møbler rommet ditt med AI – klart for Finn.no på under ett minutt
        </h1>
        <p className="max-w-xl text-lg text-ink-soft">
          Last opp et bilde av et tomt eller møblert rom, og få tilbake et
          profesjonelt møblert bilde som gir boligen din et bedre førsteinntrykk.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <a
            href="#last-opp"
            className="rounded-full bg-pine px-8 py-3 text-sm font-medium text-paper transition-colors hover:bg-pine-light"
          >
            Møbler mitt rom
          </a>
          <a
            href="#hvordan"
            className="rounded-full border border-line px-8 py-3 text-sm font-medium text-ink transition-colors hover:border-pine hover:text-pine"
          >
            Se hvordan det funker
          </a>
        </div>
      </section>

      <section id="hvordan" className="bg-paper-2 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-heading text-3xl font-semibold sm:text-4xl">
            Hvordan det funker
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trinn.map((steg) => (
              <div key={steg.tall} className="flex flex-col gap-2">
                <span className="font-mono text-sm text-sand">{steg.tall}</span>
                <h3 className="font-heading text-lg font-semibold">
                  {steg.tittel}
                </h3>
                <p className="text-sm text-ink-soft">{steg.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fototips" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-2 text-center font-heading text-3xl font-semibold sm:text-4xl">
            Tips for et godt bilde
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-sm text-ink-soft">
            Resultatet blir bare så bra som bildet du starter med. Følg disse
            fire tipsene før du laster opp.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fototips.map((tips, index) => (
              <div
                key={tips.tittel}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-2 p-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sand-light font-mono text-xs text-ink-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-lg font-semibold">
                  {tips.tittel}
                </h3>
                <p className="text-sm text-ink-soft">{tips.tekst}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="priser" className="bg-paper-2 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-12 text-center font-heading text-3xl font-semibold sm:text-4xl">
            Priser
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {priser.map((pakke) => (
              <div
                key={pakke.navn}
                className={`flex flex-col gap-3 rounded-2xl border p-6 ${
                  pakke.fremhevet
                    ? "border-pine bg-pine text-paper"
                    : "border-line bg-paper"
                }`}
              >
                <h3 className="font-heading text-lg font-semibold">
                  {pakke.navn}
                </h3>
                <span className="font-mono text-2xl">{pakke.pris}</span>
                <p
                  className={`text-sm ${
                    pakke.fremhevet ? "text-paper-2" : "text-ink-soft"
                  }`}
                >
                  {pakke.beskrivelse}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Ingen abonnement. Du betaler kun for bildene du bruker, med Vipps.
          </p>
        </div>
      </section>

      <section id="last-opp" className="bg-pine py-20 text-paper">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 text-center">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
            Klar til å møblere rommet ditt?
          </h2>
          <p className="text-paper-2">
            Last opp et bilde og se forskjellen selv.
          </p>
          <a
            href="/last-opp"
            className="mt-4 rounded-full bg-paper px-8 py-3 text-sm font-medium text-pine transition-colors hover:bg-sand-light"
          >
            Kom i gang
          </a>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} Rombilde
        {" · "}
        <Link href="/vilkar" className="underline-offset-2 hover:underline">
          Vilkår for kjøp
        </Link>
      </footer>
    </main>
  );
}
