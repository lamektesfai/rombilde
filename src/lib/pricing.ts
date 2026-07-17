import type { RoomState } from "@/generated/prisma/enums";

export const PRICES_ORE = {
  empty: 12900,
  furnished: 17900,
  boligpakke: 44900,
  fullPakke: 69900,
} as const;

export function priceForRoomState(roomState: RoomState): number {
  return roomState === "furnished" ? PRICES_ORE.furnished : PRICES_ORE.empty;
}
