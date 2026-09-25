// Site-level metadata and links. Frozen from CV V5 (2026-09-25) on 2026-09-26.

export const site = {
  name: "Benjamin Abensur",
  shortName: "Ben Abensur",
  title: "Benjamin Abensur — software, teaching, afro house",
  description:
    "Communication Systems student at EPFL, Lausanne. I build software end to end and ship it, I teach two first-year courses, and I produce afro house. Looking for a Summer 2027 internship in software engineering or applied machine learning.",
  locale: "en",
  timeZone: "Europe/Zurich",
  city: "Lausanne",
  /** Production URL. Vercel injects VERCEL_PROJECT_PRODUCTION_URL at build time; the fallback is only used locally. */
  url: process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000",
  email: "abensur.benjamin@gmail.com",
  github: "https://github.com/Benabens",
  linkedin: "https://linkedin.com/in/benjamin-abensur",
  cvPdf: "/CV_Benjamin_Abensur.pdf",
  fonts: "Set in Archivo and Source Serif 4",
  year: 2026,
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Journey", href: "#journey" },
  { label: "Photo", href: "#photo" },
  { label: "Music", href: "#music" },
  { label: "Contact", href: "#contact" },
] as const;
