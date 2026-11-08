import { ImageResponse } from "next/og";

export const alt = "Moonlabs, an automation agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card: night sky, crescent moon, headline.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "radial-gradient(circle at 78% 45%, #2a2350 0%, #07080f 55%)",
          color: "#eef0f7",
          padding: 80,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 110,
            top: 150,
            width: 330,
            height: 330,
            borderRadius: 9999,
            background: "radial-gradient(circle at 30% 35%, #f1f2f8 0%, #a9abb5 45%, #3a3c49 80%, #14151e 100%)",
            boxShadow: "0 0 120px 30px rgba(157,140,255,0.45)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>moonlabs</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 26, color: "#cfd8ff", letterSpacing: 4, marginBottom: 20 }}>AUTOMATION AGENCY</div>
            <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
              We automate the work your team keeps putting off.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
