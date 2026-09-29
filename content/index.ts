export * from "./types";
export * from "./site";
export * from "./profile";
export * from "./projects";
export * from "./journey";
export * from "./music";
// The photo section is imported by path (content/photos, content/photos.generated), not
// from this barrel: the list of bands must stay on the server, so that a band switched
// off there is not shipped to the browser with the other texts.

export const contactIntro = {
  label: "Contact",
  title: "Let's talk about ",
  titleEmphasis: "summer 2027.",
};
