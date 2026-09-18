import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      jobs: {
        select: {
          id: true,
          status: true,
          resultImageUrl: true,
          failureReason: true,
          roomType: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Fant ikke ordren" }, { status: 404 });
  }

  return NextResponse.json({
    id: order.id,
    packageType: order.packageType,
    paymentStatus: order.paymentStatus,
    jobs: order.jobs,
  });
}
