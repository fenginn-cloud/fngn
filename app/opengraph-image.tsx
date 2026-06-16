import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(900px 600px at 80% -10%, rgba(226,98,5,0.35), transparent 60%), #080808",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#E26205",
              color: "#080808",
              fontSize: 32,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            F
          </div>
          <div style={{ color: "#F5F5F5", fontSize: 34, fontWeight: 700 }}>
            FNGN
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#F5F5F5",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Digital Designer &amp; Creative Technologist
          </div>
          <div
            style={{
              marginTop: 28,
              color: "#A0A0A0",
              fontSize: 30,
              maxWidth: 820,
            }}
          >
            {site.fullName} — design, brand, software &amp; digital experiences.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#A0A0A0",
            fontSize: 26,
          }}
        >
          <span>{site.domain}</span>
          <span>UI/UX · Branding · Frontend · Real Estate</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
