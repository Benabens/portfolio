// Site-level metadata and links, aligned on the CV frozen on 22 November 2026.

export const site = {
  name: "Benjamin Abensur",
  shortName: "Ben Abensur",
  title: "Benjamin Abensur — software, machine learning, teaching",
  description:
    "Communication Systems student at EPFL, Lausanne. I build software end to end and ship it (Kairo, Cortex), I work part-time as an AI engineer at Biosynex, and I teach two first-year courses. Looking for a Summer 2027 internship in software engineering or applied machine learning.",
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

/** Sections of the home page. From another page the links lead back to them. */
export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Journey", href: "/#journey" },
  { label: "Contact", href: "/#contact" },
] as const;

/** The page away from the CV: photo by city and the music. Linked discreetly from the nav and the footer. */
export const offHours = {
  href: "/off-hours",
  label: "Off hours",
  /** Footer link on the home page. */
  footLabel: "Off hours: photo and music",
  title: "Off hours — Benjamin Abensur, photo and afro house",
  description:
    "Away from the desk: photographs by city, and afro house that Benjamin Abensur, an EPFL student in Lausanne, produces in Ableton and plays as a DJ.",
  topLeft: "Statement of account · Off hours",
  topRight: "Photo · Music",
  name: ["Off", "hours"],
  statement: "What is not on the CV: photographs by city, and afro house I produce in Ableton ",
  statementEmphasis: "and play as a DJ.",
  index: [
    { n: "01", label: "Photo", text: "By city, open a band for the roll", href: "#photo" },
    { n: "02", label: "Music", text: "One original production, an excerpt", href: "#music" },
  ],
  back: "Back to the statement",
} as const;
