import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RoomState } from "@/generated/prisma/enums";
import { priceForRoomState } from "@/lib/pricing";
import { DECOR8_DESIGN_STYLES, DECOR8_ROOM_TYPES } from "@/lib/decor8-options";

interface CreateJobBody {
  userEmail: string;
  originalImageUrl: string;
  roomType: string;
  roomState: RoomState;
  style: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateJobBody;

  if (
    !body.userEmail ||
    !body.originalImageUrl ||
    !body.roomType ||
    !body.style ||
    !Object.values(RoomState).includes(body.roomState) ||
    !DECOR8_ROOM_TYPES.includes(body.roomType as (typeof DECOR8_ROOM_TYPES)[number]) ||
    !DECOR8_DESIGN_STYLES.includes(body.style as (typeof DECOR8_DESIGN_STYLES)[number])
  ) {
    return NextResponse.json({ error: "Ugyldig forespørsel" }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      userEmail: body.userEmail,
      originalImageUrl: body.originalImageUrl,
      roomType: body.roomType,
      roomState: body.roomState,
      style: body.style,
    },
  });

  return NextResponse.json({
    jobId: job.id,
    priceOre: priceForRoomState(job.roomState),
  });
}
