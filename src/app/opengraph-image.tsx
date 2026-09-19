import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          backgroundColor: "#2E4034",
          color: "#F6F4EF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "10px 28px",
            borderRadius: 999,
            border: "1px solid rgba(246,244,239,0.4)",
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: 4,
            color: "#E8DCC3",
          }}
        >
          Laget for boligselgere uten megler
        </div>
        <div style={{ display: "flex", fontSize: 108, fontWeight: 700 }}>
          Rombilde
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#EFEBE1" }}>
          Møbler rommet ditt med AI – klart for Finn.no
        </div>
      </div>
    ),
    { ...size }
  );
}
