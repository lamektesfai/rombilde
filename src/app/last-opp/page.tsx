"use client";

import { useState } from "react";
import Link from "next/link";
import { DESIGN_STYLE_OPTIONS, ROOM_TYPE_OPTIONS } from "@/lib/decor8-options";

type RoomState = "empty" | "furnished";

const PRISER: Record<RoomState, number> = {
  empty: 129,
  furnished: 179,
};

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export default function LastOppPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [roomState, setRoomState] = useState<RoomState>("empty");
  const [roomType, setRoomType] = useState(ROOM_TYPE_OPTIONS[0].value);
  const [style, setStyle] = useState(DESIGN_STYLE_OPTIONS[0].value);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    if (selected) {
      if (!ALLOWED_TYPES.includes(selected.type)) {
        setError("Ugyldig filtype. Kun JPG og PNG er støttet.");
        event.target.value = "";
        return;
      }
      if (selected.size > MAX_FILE_SIZE_BYTES) {
        setError("Bildet er for stort. Maks filstørrelse er 15 MB.");
        event.target.value = "";
        return;
      }
    }

    setError(null);
    setFile(selected);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Du må laste opp et bilde av rommet.");
      return;
    }
    if (!email) {
      setError("Du må fylle inn e-postadressen din.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => null);
        throw new Error(data?.error ?? "Kunne ikke laste opp bildet. Prøv igjen.");
      }
      const { url: originalImageUrl } = await uploadRes.json();

      const jobRes = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          originalImageUrl,
          roomType,
          roomState,
          style,
        }),
      });
      if (!jobRes.ok) throw new Error("Kunne ikke opprette jobben. Prøv igjen.");
      const { jobId } = await jobRes.json();

      const paymentRes = await fetch("/api/payments/vipps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!paymentRes.ok) throw new Error("Kunne ikke starte Vipps-betaling. Prøv igjen.");
      const { redirectUrl } = await paymentRes.json();

      window.location.href = redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt. Prøv igjen.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
          Rombilde
        </Link>
        <Link
          href="/#fototips"
          className="text-sm text-ink-soft underline-offset-4 hover:text-pine hover:underline"
        >
          Se fototips
        </Link>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-4xl flex-col gap-10 px-6 pb-24 pt-4"
      >
        <div>
          <h1 className="font-heading text-3xl font-semibold sm:text-4xl">
            Last opp bilde av rommet
          </h1>
          <p className="mt-2 text-ink-soft">
            Fyll ut skjemaet under, så sender vi deg videre til betaling med Vipps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label className="font-heading text-sm font-semibold">Bilde av rommet</label>
            <label
              htmlFor="bilde"
              className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-paper-2 p-6 text-center transition-colors hover:border-pine"
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Forhåndsvisning av opplastet rom"
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <>
                  <span className="font-heading text-lg font-semibold">
                    Trykk for å velge bilde
                  </span>
                  <span className="text-sm text-ink-soft">
                    JPG eller PNG, maks 15 MB. Se{" "}
                    <Link href="/#fototips" className="underline">
                      fototips
                    </Link>{" "}
                    for best resultat.
                  </span>
                </>
              )}
            </label>
            <input
              id="bilde"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-heading text-sm font-semibold">Er rommet tomt eller møblert?</span>
              <div className="grid grid-cols-2 gap-3">
                {(["empty", "furnished"] as RoomState[]).map((verdi) => (
                  <button
                    key={verdi}
                    type="button"
                    onClick={() => setRoomState(verdi)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      roomState === verdi
                        ? "border-pine bg-pine text-paper"
                        : "border-line text-ink-soft hover:border-pine hover:text-pine"
                    }`}
                  >
                    {verdi === "empty" ? "Tomt rom" : "Møblert rom"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="romtype" className="font-heading text-sm font-semibold">
                Romtype
              </label>
              <select
                id="romtype"
                value={roomType}
                onChange={(event) => setRoomType(event.target.value as typeof roomType)}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm"
              >
                {ROOM_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="stil" className="font-heading text-sm font-semibold">
                Innredningsstil
              </label>
              <select
                id="stil"
                value={style}
                onChange={(event) => setStyle(event.target.value as typeof style)}
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm"
              >
                {DESIGN_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="epost" className="font-heading text-sm font-semibold">
                E-post
              </label>
              <input
                id="epost"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="din@epost.no"
                className="rounded-full border border-line bg-paper px-4 py-2 text-sm"
              />
              <span className="text-xs text-ink-soft">
                Vi sender deg det ferdige bildet på denne adressen.
              </span>
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-sand bg-sand-light px-4 py-3 text-sm text-ink">
            {error}
          </p>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-line pt-8 text-center">
          <span className="font-mono text-2xl">{PRISER[roomState]} kr</span>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-pine px-8 py-3 text-sm font-medium text-paper transition-colors hover:bg-pine-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sender deg til Vipps …" : "Gå til betaling med Vipps"}
          </button>
        </div>
      </form>
    </main>
  );
}
