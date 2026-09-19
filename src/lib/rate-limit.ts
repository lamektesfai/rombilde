// Enkel in-memory rate-limiting per IP. Holder unna naiv bot-spam mot de
// offentlige endepunktene som oppretter jobber/ordre og starter Vipps-
// betalinger. Ikke distribuert på tvers av serverless-instanser, men
// tilstrekkelig for dagens trafikkvolum — kan byttes til en Redis-basert
// løsning (f.eks. Upstash) senere hvis trafikken vokser.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
let opsSinceSweep = 0;

function sweepExpired() {
  const now = Date.now();
  buckets.forEach((bucket, key) => {
    if (bucket.resetAt <= now) buckets.delete(key);
  });
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  opsSinceSweep += 1;
  if (opsSinceSweep > 500) {
    sweepExpired();
    opsSinceSweep = 0;
  }

  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
