import type { CaseStudy, SideProject } from "./types";

// Projects. Every figure comes from CV V5 (2026-09-25) or was measured in the
// public repositories on 2026-09-26 (see the comments); nothing is invented.
// To add a case study: append to `caseStudies` (keep the numbering).
// To add a small project: append to `sideProjects`.

export const workIntro = {
  label: "Selected work",
  title: "Five projects, ",
  titleEmphasis: "one number",
  titleEnd: " each.",
  note: "Every figure on this page is on my CV or measured in the public repo, and holds up in an interview.",
};

export const caseStudies: CaseStudy[] = [
  {
    id: "kairo",
    number: "01",
    title: "Kairo & Trame",
    titleParts: ["Kairo", "Trame"],
    stack:
      "Next.js · TypeScript · Python · PostgreSQL (Supabase, row-level security) · Claude API · GitHub Actions · Vercel",
    summary:
      "Kairo is an AI career CRM. A daily pipeline aggregates listings, scores each one 0–100 with rules plus an LLM, and extracts deadlines and eligibility with every answer backed by a verbatim quote. About 37k lines, 160+ tests, CI. Trame, its networking module, is a PWA that turns freeform notes into structured contacts via Claude and shows who I know at each employer.",
    metric: {
      value: "16,000+",
      count: { target: 16000, suffix: "+" },
      caption:
        "internships, jobs and programmes aggregated daily from 35 career boards, Indeed and LinkedIn across 30 markets, and hackathon feeds.",
    },
    tags: ["AI career CRM", "live, behind login"],
    note: "Private code · screens on request",
  },
  {
    id: "cortex",
    number: "02",
    title: "Cortex",
    stack: "Next.js · TypeScript · PostgreSQL · Drizzle · Claude API · LaTeX · Railway",
    summary:
      "An AI exam-preparation platform. It learns each course's exam format from past papers, weights every topic by how heavily it was examined, schedules spaced revision on the student's weak points, and generates faithful practice exams through a multi-pass LLM pipeline. Per-user Postgres schemas, cost caps, deployed on Railway.",
    metric: {
      value: "~28k",
      count: { target: 28, prefix: "~", suffix: "k" },
      caption: "lines. An answer is accepted only if verified by sandboxed code execution or symbolic checks.",
    },
    tags: ["exam generation", "open source"],
    link: { label: "github.com/Benabens/cortex", href: "https://github.com/Benabens/cortex" },
  },
  {
    // Measured in github.com/Benabens/ReCHor on 2026-09-26: timetable/2025-05-28/connections.bin
    // is 33,001,128 bytes at 12 bytes per connection (4 × U16 + S32 in BufferedConnections),
    // i.e. 2,750,094 connections; 44 source files, 24 test classes, 160 @Test methods,
    // 258 MB of timetables for 7 days (26 May → 1 June 2025). Pair confirmed by the @author tags.
    id: "rechor",
    number: "03",
    title: "ReCHor",
    stack: "Java 22 · JavaFX 21 · EPFL CS-108, in a pair",
    summary:
      "A desktop journey planner for the whole Swiss public-transport network. For a date, a time and two stops it returns every Pareto-optimal journey, trading arrival time against changes, by scanning the day's connections once in reverse chronological order (Connection Scan Algorithm) over memory-mapped, bit-packed timetable files that are never deserialised. JavaFX front end with accent-insensitive stop autocomplete, journey details, iCalendar and GeoJSON export, and the heavy work kept off the UI thread; 44 classes, 160 JUnit tests.",
    metric: {
      value: "2.75 M",
      count: { target: 2.75, suffix: " M", decimals: 2 },
      caption:
        "connections in one weekday of the real CFF timetable, scanned in a single pass per query. 258 MB of binary data for seven days, read from memory-mapped files.",
    },
    tags: ["journey planner", "open source"],
    link: { label: "github.com/Benabens/ReCHor", href: "https://github.com/Benabens/ReCHor" },
    note: "Desktop app · screens coming",
  },
  {
    // Measured in github.com/Benabens/ICoop on 2026-09-26: iccoop/src/main/java holds 40 files and
    // 3,695 lines (CV: ~3,700), 24 actor classes, 4 areas (Spawn, Maze, Arena, OrbWay), boss HellSkull;
    // the course engine (game-engine/, 110 files) was kept unmodified (CONCEPTION.md).
    id: "icoop",
    number: "04",
    title: "ICoop",
    stack: "Java · PlayEngine (course engine) · EPFL CS-107, in a pair",
    summary:
      "A two-player cooperative 2D game in the spirit of Fireboy and Watergirl, on the course's engine. A fire player and a water player cross the map together: each one passes what the other cannot, every interaction between players, projectiles, enemies and elemental walls goes through double dispatch, and each cell decides what can walk or fly over it. Four areas, keys, orbs, bombs, a chest added beyond the brief, and a final boss with ranged attacks and a conditional weak spot.",
    metric: {
      value: "~3,700",
      count: { target: 3700, prefix: "~" },
      caption: "lines of game code, in 24 actor classes and 4 areas, written on top of an unmodified course engine.",
    },
    tags: ["co-op game", "open source"],
    link: { label: "github.com/Benabens/ICoop", href: "https://github.com/Benabens/ICoop" },
    note: "Two-player game · screens coming",
  },
  {
    // Figures from the README and the milestone-2 report of
    // github.com/Benabens/addiction-classifier-numpy (test set, checked on 2026-09-26):
    // MLP with sigmoid + MSE: 85.25 % accuracy, macro-F1 0.546, recall on "High" 0.00.
    // MLP with softmax + inverse-frequency weighted cross-entropy (w = [0.48, 1.21, 10.4]):
    // 84.50 %, 0.757, 0.69. Rare class = 44 of 1,280 training samples (~3 %). Team of 3 per
    // the README and CV V5, which rounds the F1 jump to 0.55 → 0.76.
    id: "addiction",
    number: "05",
    title: "Gaming Addiction Prediction",
    stack: "Python · NumPy, no ML libraries · EPFL CS-233, team of 3",
    summary:
      "Predicts gaming-addiction level (three classes) and score (0–10) from gaming and mental-health data with five models written entirely in NumPy: k-nearest neighbours, linear and softmax logistic regression, K-Means and a multi-layer perceptron with hand-written backpropagation, every gradient checked against finite differences. The point is what accuracy hides: the first MLP scored 85% while never once predicting the rare class. Weighting the loss by inverse class frequency fixed that. Two written reports, 5-fold cross-validation.",
    metric: {
      value: "0 → 0.69",
      count: { target: 0.69, prefix: "0 → ", decimals: 2 },
      caption:
        "recall on the rarest class (3% of the data) once the cross-entropy is weighted by inverse class frequency. Macro-\u2060F1 0.55 → 0.76, for 0.75 points of accuracy.",
    },
    tags: ["ML from scratch", "open source"],
    link: {
      label: "github.com/Benabens/addiction-classifier-numpy",
      href: "https://github.com/Benabens/addiction-classifier-numpy",
    },
  },
];

export const moreIntro = {
  label: "Also on the books",
  title: "Smaller lines, still real.",
};

export const sideProjects: SideProject[] = [
  {
    id: "systems",
    number: "06",
    title: "Systems project",
    description: "Networking and UNIX filesystem in C · POSIX sockets, pthreads · in a pair",
    context: "CS-202",
    href: "#more",
    external: false,
    peek: {
      big: "~6,300",
      text: "lines of C: reliable file transfer over TCP then UDP with one-way delay measurement, a UNIX v6 filesystem behind a CLI, a multithreaded file server with per-file locking.",
    },
  },
  {
    id: "verireason",
    number: "07",
    title: "VeriReason",
    description: "Decoder-only Transformer from first principles · PyTorch",
    context: "in progress",
    href: "https://github.com/Benabens/verireason",
    external: true,
    peek: {
      big: "In progress",
      text: "task generation, tokenizer, batched pipeline and embeddings written; attention, training loop and verifier-driven RL still to come. No number until it trains.",
    },
  },
  {
    id: "qrcode",
    number: "08",
    title: "QR-code generator",
    description: "Reed–Solomon error correction and masking, by hand · Java",
    context: "CS-107",
    href: "https://github.com/Benabens",
    external: true,
    peek: { big: "Reed–Solomon", text: "error correction and masking, implemented by hand." },
  },
  {
    // CV V5: 42 synthesizable Verilog modules, 42/42 self-checking testbenches, zero warnings.
    id: "digital-logic",
    number: "09",
    title: "Digital-logic library",
    description: "42 synthesizable modules with self-checking testbenches, logic gates to a register file · Verilog",
    context: "self-initiated",
    href: "https://github.com/Benabens/fds-digital-logic",
    external: true,
    peek: {
      big: "42/42",
      text: "self-checking testbenches passing, zero warnings. Built on my own time, outside any course, and ungraded.",
    },
  },
  {
    id: "simulators",
    number: "10",
    title: "Mechanics simulators",
    description: "Interactive explainers for the PHYS-101 students I teach",
    context: "teaching",
    href: "#journey",
    external: false,
    peek: { big: "for my students", text: "interactive mechanics simulators and explainers, built for the exercise sessions I run." },
  },
];
