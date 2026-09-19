import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoomState } from "@/generated/prisma/enums";
import { PACKAGES, type PackageType } from "@/lib/pricing";
import { DECOR8_DESIGN_STYLES, DECOR8_ROOM_TYPES } from "@/lib/decor8-options";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

interface OrderImageInput {
  originalImageUrl: string;
  roomType: string;
  roomState: RoomState;
  style: string;
}

interface CreateOrderBody {
  userEmail: string;
  packageType: PackageType;
  images: OrderImageInput[];
}

function isValidImage(image: OrderImageInput): boolean {
  return Boolean(
    image &&
      image.originalImageUrl &&
      image.roomType &&
      image.style &&
      Object.values(RoomState).includes(image.roomState) &&
      DECOR8_ROOM_TYPES.includes(image.roomType as (typeof DECOR8_ROOM_TYPES)[number]) &&
      DECOR8_DESIGN_STYLES.includes(image.style as (typeof DECOR8_DESIGN_STYLES)[number])
  );
}

export async function POST(request: NextRequest) {
  const { allowed, retryAfterSeconds } = rateLimit(
    `orders:${getClientIp(request)}`,
    5,
    10 * 60 * 1000
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Prøv igjen om litt." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = (await request.json()) as CreateOrderBody;

  const pakke = body.packageType ? PACKAGES[body.packageType] : undefined;

  if (
    !body.userEmail ||
    !pakke ||
    !Array.isArray(body.images) ||
    body.images.length !== pakke.imageCount ||
    !body.images.every(isValidImage)
  ) {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userEmail: body.userEmail,
        packageType: body.packageType,
        imageCount: pakke.imageCount,
        amount: pakke.amountOre,
      },
    });

    await tx.job.createMany({
      data: body.images.map((image) => ({
        userEmail: body.userEmail,
        originalImageUrl: image.originalImageUrl,
        roomType: image.roomType,
        roomState: image.roomState,
        style: image.style,
        orderId: created.id,
      })),
    });

    return created;
  });

  return NextResponse.json({ orderId: order.id, priceOre: order.amount });
}
