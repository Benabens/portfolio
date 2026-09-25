import type { PhotoFrame } from "./types";

// Photo contact sheet. No photo has been selected yet, so every frame is a
// placeholder. To publish a photo: drop it in public/photos/ and set `src`.

export const photoIntro = {
  label: "Photo",
  title: "Contact sheet, ",
  titleEmphasis: "selection in progress.",
  placeholderCaption: "to come",
};

const ratios: PhotoFrame["ratio"][] = ["r43", "r34", "r11", "r169", "r43", "r34", "r169", "r11"];

/** Two marquee rows of eight frames each. */
export const photoRows: PhotoFrame[][] = [0, 1].map((row) =>
  ratios.map((ratio, i) => {
    const n = String(row * 8 + i + 1).padStart(2, "0");
    return { number: n, ratio, src: null, alt: `Photo ${n}` };
  }),
);
