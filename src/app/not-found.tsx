import Link from "next/link";

export const metadata = {
  title: "Siden finnes ikke – Rombilde",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-20 text-center text-ink">
      <div className="flex max-w-md flex-col items-center gap-6">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
          Rombilde
        </Link>
        <span className="font-mono text-sm uppercase tracking-widest text-ink-soft">
          404
        </span>
        <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
          Denne siden finnes ikke
        </h1>
        <p className="text-ink-soft">
          Lenken kan være feil eller siden kan ha blitt flyttet. Prøv å gå
          tilbake til forsiden.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-pine px-8 py-3 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-pine-light active:translate-y-0"
        >
          Til forsiden
        </Link>
      </div>
    </main>
  );
}
