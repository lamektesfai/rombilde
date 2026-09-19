import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVippsPayment } from "@/lib/vipps";
import { PACKAGES } from "@/lib/pricing";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `vipps-order:${getClientIp(request)}`,
    5,
    10 * 60 * 1000
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Prøv igjen om litt." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

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
