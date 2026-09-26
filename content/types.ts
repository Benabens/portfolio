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
};

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

export type PhotoFrame = {
  number: string;
  /** Aspect ratio class of the placeholder frame. */
  ratio: "r43" | "r34" | "r11" | "r169";
  /** Path under /public/photos once the photo exists; null shows the placeholder. */
  src: string | null;
  alt: string;
};
