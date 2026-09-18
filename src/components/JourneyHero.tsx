import Image from "next/image";

export default function JourneyHero() {
  return (
    <div className="relative h-[150vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <Image
          src="/eksempel/etter.webp"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-ink/60" />

        <div
          data-animate
          className="relative flex flex-col items-center gap-6 px-6 text-center text-paper"
        >
          <span className="rounded-full border border-paper/40 bg-ink/30 px-4 py-1 font-mono text-xs uppercase tracking-wide backdrop-blur">
            Laget for boligselgere uten megler
          </span>
          <h1 className="font-heading text-5xl font-semibold leading-tight sm:text-7xl">
            Rombilde
          </h1>
          <p className="max-w-xl text-lg text-paper-2">
            Møbler rommet ditt med AI – klart for Finn.no på under ett minutt.
          </p>
          <span className="mt-6 font-mono text-xs uppercase tracking-widest text-paper-2">
            Skroll ned for å se rommets reise ↓
          </span>
        </div>
      </div>
    </div>
  );
}
