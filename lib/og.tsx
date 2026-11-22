import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

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

type Card = {
  topLeft: string;
  topRight: string;
  /** The two lines of the title, the second indented as in the hero. */
  lines: [string, string];
  bottom: string;
  stamp?: string;
};

/** The share card of a page, set like its hero: top rule, the title in Archivo 800, a line and the stamp. */
export async function ogCard({ topLeft, topRight, lines, bottom, stamp }: Card) {
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
          <span>{topLeft}</span>
          <span>{topRight}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 0.88, fontSize: 168, fontWeight: 800, letterSpacing: -4, textTransform: "uppercase" }}>
          <span>{lines[0]}</span>
          <span style={{ paddingLeft: 140 }}>{lines[1]}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 26, color: "#645d5a" }}>
          <span>{bottom}</span>
          {stamp && (
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
              {stamp}
            </span>
          )}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: archivo ? [{ name: "Archivo", data: archivo, weight: 800, style: "normal" }] : [],
    },
  );
}
