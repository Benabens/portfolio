import type { Fact } from "./types";

// Hero and statement. Facts from the CV frozen on 22 November 2026 (Brain/CV/CV.md, section 9);
// the statement comes from the "Portfolio web — contenu" note.

export const profile = {
  firstName: "Benjamin",
  lastName: "Abensur",
  /** Top rule of the hero, left and right. */
  heroTopLeft: "Statement of account · Benjamin Abensur",
  heroTopRight: "EPFL · Lausanne · 2024 → 2028",
  /** The CV accroche. The `emphasis` part is set in red italic serif. */
  statement:
    "I build software end to end and ship it, I teach two first-year courses, and I take on things outside engineering ",
  statementEmphasis: "when they are worth doing.",
  stamp: "Open · Summer 2027 internship",
  photo: {
    src: "/photo.jpg",
    alt: "Portrait of Benjamin Abensur",
    width: 1254,
    height: 1254,
    caption: "Fig. 0 — Benjamin Abensur, Lausanne",
  },
  facts: [
    { label: "Field", value: "BSc in Communication Systems (IC)" },
    { label: "School", value: "EPFL, Lausanne" },
    { label: "Expected graduation", value: "Jan 2028" },
    { label: "Now", value: "AI Engineer (part-time) at Biosynex · Teaching Assistant at EPFL" },
    { label: "Looking for", value: "Software engineering or applied ML, Summer 2027" },
    { label: "Languages", value: "French (native), English (fluent), Hebrew (basic), Spanish (basic)" },
  ] satisfies Fact[],
};
