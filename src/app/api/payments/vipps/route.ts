import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVippsPayment } from "@/lib/vipps";
import { priceForRoomState } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  const { jobId } = (await request.json()) as { jobId: string };

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "Fant ikke jobben" }, { status: 404 });
  }

  const amountOre = priceForRoomState(job.roomState);

  const payment = await prisma.payment.create({
    data: {
      jobId: job.id,
      amount: amountOre,
      paymentMethod: "vipps",
    },
  });

  const vippsPayment = await createVippsPayment({
    reference: payment.id,
    amountOre,
    returnUrl: `${process.env.APP_BASE_URL}/betaling/kvittering?jobId=${job.id}`,
    description: `Rombilde – ${job.roomType}`,
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { pspReference: vippsPayment.reference },
  });

  return NextResponse.json({ redirectUrl: vippsPayment.redirectUrl });
}
