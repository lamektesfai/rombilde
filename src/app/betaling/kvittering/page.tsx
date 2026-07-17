"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type JobStatus = "pending" | "paid" | "processing" | "completed" | "failed";

interface JobStatusResponse {
  id: string;
  status: JobStatus;
  resultImageUrl: string | null;
  failureReason: string | null;
}

const STATUS_TEKST: Record<JobStatus, string> = {
  pending: "Bekrefter betalingen din …",
  paid: "Betalingen er bekreftet. Starter møbleringen …",
  processing: "Vi møblerer rommet ditt nå. Dette tar vanligvis 20–60 sekunder.",
  completed: "Rommet er ferdig møblert!",
  failed: "Noe gikk galt under møbleringen.",
};

export default function KvitteringPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [job, setJob] = useState<JobStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      setError("Mangler jobb-ID i lenken.");
      return;
    }

    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error("Fant ikke jobben din.");
        const data: JobStatusResponse = await res.json();
        if (!cancelled) setJob(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Noe gikk galt.");
        }
      }
    }

    poll();
    const interval = setInterval(() => {
      if (job?.status === "completed" || job?.status === "failed") {
        clearInterval(interval);
        return;
      }
      poll();
    }, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, job?.status]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-20 text-ink">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight">
          Rombilde
        </Link>

        {error && (
          <div className="flex flex-col gap-4">
            <p className="rounded-xl border border-sand bg-sand-light px-4 py-3 text-sm">
              {error}
            </p>
            <Link
              href="/last-opp"
              className="rounded-full border border-line px-6 py-2 text-sm text-ink-soft transition-colors hover:border-pine hover:text-pine"
            >
              Prøv på nytt
            </Link>
          </div>
        )}

        {!error && !job && (
          <p className="text-ink-soft">Henter status på jobben din …</p>
        )}

        {!error && job && job.status !== "completed" && job.status !== "failed" && (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-pine" />
            <p className="font-heading text-2xl font-semibold">{STATUS_TEKST[job.status]}</p>
            <p className="text-sm text-ink-soft">
              Du kan trygt la denne siden være åpen — den oppdaterer seg selv.
            </p>
          </>
        )}

        {!error && job?.status === "completed" && (
          <>
            <p className="font-heading text-3xl font-semibold">{STATUS_TEKST.completed}</p>
            {job.resultImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={job.resultImageUrl}
                alt="Ferdig møblert rom"
                className="w-full rounded-2xl border border-line"
              />
            )}
            <div className="flex flex-col items-center gap-2">
              <a
                href={job.resultImageUrl ?? "#"}
                download
                className="rounded-full bg-pine px-8 py-3 text-sm font-medium text-paper transition-colors hover:bg-pine-light"
              >
                Last ned bildet
              </a>
              <p className="text-xs text-ink-soft">
                Vi har også sendt bildet til e-posten du oppga.
              </p>
            </div>
            <Link
              href="/last-opp"
              className="text-sm text-ink-soft underline-offset-4 hover:text-pine hover:underline"
            >
              Møbler et rom til
            </Link>
          </>
        )}

        {!error && job?.status === "failed" && (
          <>
            <p className="font-heading text-2xl font-semibold">{STATUS_TEKST.failed}</p>
            <p className="text-sm text-ink-soft">
              Vi klarte dessverre ikke å møblere rommet ditt, selv etter flere forsøk.
              Betalingen din blir automatisk refundert — du finner mer informasjon i e-posten vi har sendt deg.
            </p>
            <Link
              href="/last-opp"
              className="rounded-full border border-line px-6 py-2 text-sm text-ink-soft transition-colors hover:border-pine hover:text-pine"
            >
              Prøv på nytt
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
