import { ImageResponse } from "next/og";
import { profile, site } from "@/content";

export const alt = `${site.name} — portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Archivo 800 as TTF, fetched from Google Fonts at build time (an old UA gets truetype). */
async function loadArchivo(): Promise<ArrayBuffer | null> {
  try {
    const css = await (
      await fetch("https://fonts.googleapis.com/css2?family=Archivo:wght@800&display=swap", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
      })
    ).text();
    const m = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/);
    if (!m) return null;
    return await (await fetch(m[1])).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const archivo = await loadArchivo();
  const display = archivo ? "Archivo" : "sans-serif";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: "#121110",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          fontFamily: display,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#645d5a",
            borderBottom: "2px solid #121110",
            paddingBottom: 18,
          }}
        >
          <span>{profile.heroTopLeft}</span>
          <span>{profile.heroTopRight}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.88, fontSize: 168, fontWeight: 800, letterSpacing: -4, textTransform: "uppercase" }}>
          <span>{profile.firstName}</span>
          <span style={{ paddingLeft: 140 }}>{profile.lastName}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26, color: "#645d5a" }}>
          <span>Communication Systems at EPFL · software, teaching, afro house</span>
          <span
            style={{
              color: "#c43012",
              border: "4px solid #c43012",
              borderRadius: 6,
              padding: "12px 18px",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: "uppercase",
              transform: "rotate(-5deg)",
            }}
          >
            {profile.stamp}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: archivo ? [{ name: "Archivo", data: archivo, weight: 800, style: "normal" }] : [],
    },
  );
}
