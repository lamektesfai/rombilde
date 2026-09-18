import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVippsPayment } from "@/lib/vipps";
import { PACKAGES } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  const { orderId } = (await request.json()) as { orderId: string };

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Fant ikke ordren" }, { status: 404 });
  }

  const vippsPayment = await createVippsPayment({
    reference: `order-${order.id}`,
    amountOre: order.amount,
    returnUrl: `${process.env.APP_BASE_URL}/betaling/kvittering?orderId=${order.id}`,
    description: `Rombilde – ${PACKAGES[order.packageType].label}`,
  });

  return NextResponse.json({ redirectUrl: vippsPayment.redirectUrl });
}
