import type { Fact } from "./types";

// Hero and statement. Frozen from CV V5 (2026-09-25) and the "Portfolio web — contenu" note.

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
  photo: { src: "/photo.jpg", alt: "Benjamin Abensur", width: 720, height: 720 },
  facts: [
    { label: "Field", value: "Communication Systems, BSc" },
    { label: "School", value: "EPFL, Lausanne" },
    { label: "Expected graduation", value: "2028" },
    { label: "Looking for", value: "Software engineering or applied ML, Summer 2027" },
    { label: "Languages", value: "French, English, Hebrew, Spanish" },
  ] satisfies Fact[],
};
