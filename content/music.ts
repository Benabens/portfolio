import type { FeaturedTrack } from "./types";

// Music corner: one original production, featured as an excerpt (Ben, 8 October 2026).
// The excerpt is cut from the v3 master (~/Desktop/THE HANDOFF - master v3.wav):
// 16 bars of build-up, then 16 bars after the drop (120 BPM, drop at 5:24.8).
//   ffmpeg -ss 292.8 -t 64 -i "THE HANDOFF - master v3.wav" \
//     -af "afade=t=in:st=0:d=1.5,afade=t=out:st=60:d=4" -b:a 192k public/audio/the-handoff-excerpt.mp3
// `peaks` is the RMS of the excerpt in 120 slices (normalised), drawn as the waveform.

export const musicIntro = {
  label: "Music",
  title: "Afro house, produced in Ableton. ",
  titleEmphasis: "I also DJ.",
  context: "Played out at the BABOO nights in Lausanne, including Noche Club in May 2025.",
  errorNote: "[ the audio could not load — try again ]",
};

export const featuredTrack: FeaturedTrack = {
  title: "THE HANDOFF",
  tag: "Original production · unreleased",
  facts: ["Ableton Live 12", "Afro house", "120 BPM", "9:38"],
  excerptNote: "Excerpt: the build-up into the drop, 4:53 – 5:57.",
  src: "/audio/the-handoff-excerpt.mp3",
  duration: 64,
  dropAt: 32,
  peaks: [
    0.09, 0.2, 0.3, 0.43, 0.32, 0.35, 0.33, 0.4, 0.44, 0.33, 0.44, 0.31, 0.36, 0.32, 0.36, 0.4, 0.36, 0.31, 0.4, 0.3,
    0.32, 0.3, 0.35, 0.37, 0.3, 0.4, 0.29, 0.32, 0.28, 0.31, 0.42, 0.32, 0.28, 0.39, 0.29, 0.31, 0.3, 0.42, 0.37, 0.28,
    0.4, 0.26, 0.32, 0.31, 0.36, 0.38, 0.32, 0.27, 0.37, 0.25, 0.3, 0.28, 0.31, 0.3, 0.25, 0.35, 0.24, 0.22, 0.2, 0.14,
    0.84, 0.88, 0.85, 0.9, 0.82, 0.84, 0.85, 0.95, 0.87, 0.75, 0.83, 0.76, 0.84, 0.8, 0.8, 0.89, 0.93, 0.81, 0.9, 0.79,
    0.82, 0.81, 1.0, 0.86, 0.75, 0.83, 0.78, 0.82, 0.8, 0.81, 0.95, 0.9, 0.86, 0.84, 0.78, 0.85, 0.86, 0.9, 0.94, 0.74,
    0.86, 0.75, 0.85, 0.78, 0.85, 0.93, 0.87, 0.86, 0.85, 0.82, 0.82, 0.9, 0.84, 0.79, 0.56, 0.51, 0.36, 0.3, 0.17, 0.04,
  ],
};
