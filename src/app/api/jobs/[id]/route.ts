import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) {
    return NextResponse.json({ error: "Fant ikke jobben" }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    resultImageUrl: job.resultImageUrl,
    failureReason: job.failureReason,
  });
}
