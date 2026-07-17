import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { captureVippsPayment, verifyVippsWebhookSignature } from "@/lib/vipps";
import { inngest } from "@/inngest/client";

interface VippsWebhookPayload {
  reference: string;
  pspReference: string;
  amount: { value: number; currency: string };
  name: string;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const isValid = verifyVippsWebhookSignature(
    "POST",
    request.nextUrl.pathname,
    {
      authorization: request.headers.get("authorization"),
      xMsDate: request.headers.get("x-ms-date"),
      xMsContentSha256: request.headers.get("x-ms-content-sha256"),
      host: request.headers.get("host"),
    },
    rawBody
  );

  if (!isValid) {
    return NextResponse.json({ error: "Ugyldig signatur" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as VippsWebhookPayload;

  if (payload.name !== "epayments.payment.authorized.v1") {
    return NextResponse.json({ received: true });
  }

  const payment = await prisma.payment.findUnique({
    where: { id: payload.reference },
    include: { job: true },
  });

  if (!payment) {
    return NextResponse.json({ error: "Fant ikke betalingen" }, { status: 404 });
  }

  await captureVippsPayment(payload.reference, payment.amount);

  await prisma.payment.update({
    where: { id: payment.id },
    data: { paymentStatus: "captured", pspReference: payload.pspReference },
  });

  await prisma.job.update({
    where: { id: payment.jobId },
    data: { status: "paid" },
  });

  await inngest.send({ name: "job/paid", data: { jobId: payment.jobId } });

  return NextResponse.json({ received: true });
}
