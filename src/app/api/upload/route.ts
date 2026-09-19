import { NextRequest, NextResponse } from "next/server";
import { uploadImageToR2 } from "@/lib/r2";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `upload:${getClientIp(request)}`,
    30,
    10 * 60 * 1000
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "For mange opplastinger. Prøv igjen om litt." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Mangler fil" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Ugyldig filtype. Kun JPG og PNG er støttet." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Bildet er for stort. Maks filstørrelse er 15 MB." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImageToR2(buffer, file.type, "originals");

  return NextResponse.json({ url });
}
