// Content types. Every text and number on the site comes from content/*.ts,
// which are frozen copies of CV V5 (2026-09-25) and the "Portfolio web — contenu" note.

export type ExternalLink = {
  label: string;
  href: string;
};

export type Fact = {
  label: string;
  value: string;
};

/** One of the five numbered case studies ("one number each"). */
export type CaseStudy = {
  id: string;
  number: string;
  /** Title. Use `titleParts` when an ampersand should be typeset in red italic serif. */
  title: string;
  titleParts?: [string, string];
  stack: string;
  summary: string;
  metric: {
    /** Text shown when the count-up is not running (also the final value). */
    value: string;
    /** Optional count-up. `target` counts from 0; prefix/suffix wrap the number; `decimals` keeps e.g. 2.75. */
    count?: { target: number; prefix?: string; suffix?: string; after?: string; decimals?: number };
    caption: string;
  };
  tags: string[];
  link?: ExternalLink;
  note?: string;
  /** Figures attached to the entry: a looping clip or a still, each with its caption. */
  media?: CaseMedia[];
};

/** A piece of the file attached to a case study: a short muted loop, a still, or a redrawn chart. */
type MediaBase = {
  /** Figure number printed in the caption ("1", "2"…). */
  figure: string;
  alt: string;
  caption: string;
};
export type CaseMedia =
  | (MediaBase & {
      kind: "video";
      /** MP4 (H.264) under /public/work/<id>/. */
      src: string;
      /** WebM alternative of the clip. */
      webm?: string;
      /** Shown before play, and as the still when motion is reduced. */
      poster: string;
      /** Intrinsic size: reserves the box before the media loads (no layout shift). */
      width: number;
      height: number;
    })
  | (MediaBase & { kind: "image"; src: string; width: number; height: number })
  | (MediaBase & {
      kind: "matrix";
      /** Class names, in row and column order. */
      classes: string[];
      /** One confusion matrix per panel: rows are true classes, columns predictions. */
      panels: { title: string; rows: number[][] }[];
      /** [row, column] of the cell to ring in red in every panel. */
      mark: [number, number];
      note: string;
    });

/** A row in the compact "also on the books" list, with its hover preview. */
export type SideProject = {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Right-hand label: a course code or a one-word context. */
  context: string;
  href: string;
  external: boolean;
  peek: { big: string; text: string };
};

export type JourneyStep = {
  number: string;
  when: string;
  title: string;
  text: string;
  now?: boolean;
};

export type Track = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  /** Duration in seconds (read from the WAV files). */
  duration: number;
  /** Path under /public, e.g. "/audio/the-handoff-v2.mp3". Leave null until the master exists. */
  src: string | null;
};

/** One band of the photo section: a city, its cover and up to six more photos. */
export type City = {
  /** Folder under public/photos/ and DOM id. */
  id: string;
  /** Set in Archivo on the width axis over the cover. */
  name: string;
  country: string;
  /** "2025" or "2024 – 2025". */
  year: string;
  /** Source stem "<CODE>-NN" of the cover (no identifiable face in the foreground). */
  cover: string;
  /** Source stems of the other photos, in display order (six at most). */
  photos: string[];
  /** Where the cover is cropped from (wide desktop band) and anchored (mobile band), e.g. "50% 30%". */
  coverFocus?: string;
  /** "light" when the cover is bright where the name sits: the name is then set in ink. */
  coverTone?: "light" | "dark";
  /** What each photo shows, by stem. Falls back to "<city>, photo n of m". */
  alts?: Record<string, string>;
  /** Something Ben still has to confirm (shown nowhere, listed in the hand-over). */
  todo?: string;
};

/** Width, height and blur placeholder of a generated web photo (content/photos.generated.ts). */
export type PhotoMeta = { w: number; h: number; blur: string };
