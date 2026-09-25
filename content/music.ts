import type { Track } from "./types";

// Music corner. Titles and durations are real (read from the WAV files in DJING/);
// the audio itself is not published yet. To make a track playable:
//   1. export an MP3/AAC master to public/audio/<file>
//   2. set `src: "/audio/<file>"` below.
// While `src` is null the player shows "[ preview coming ]".

export const musicIntro = {
  label: "Music",
  title: "Afro house, produced in Ableton. ",
  titleEmphasis: "I also DJ.",
  nowLabel: "Now on the deck",
  context: "Produced in Ableton Live. Played out at the BABOO nights in Lausanne, including Noche Club in May 2025.",
  missingNote: "[ preview coming — the master is not uploaded yet ]",
  errorNote: "[ file not found — check the src in content/music.ts ]",
};

export const tracks: Track[] = [
  {
    id: "the-handoff-v2",
    number: "01",
    title: "THE HANDOFF — v2",
    subtitle: "Unreleased. Master pending.",
    duration: 502,
    src: null,
  },
  {
    id: "afro-house-sketch",
    number: "02",
    title: "Afro house sketch — untitled",
    subtitle: "Work in progress.",
    duration: 80,
    src: null,
  },
];
