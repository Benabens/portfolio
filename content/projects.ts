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
      "Kairo is an AI career CRM. Its daily pipeline aggregates internships, jobs and programmes, each scored 0–100 by rules + an LLM, with LLM extraction of deadlines and eligibility, each answer backed by a verbatim quote; ~37k lines, 160+ tests, CI, on Vercel. Trame, its networking module: a PWA turning freeform notes into structured contacts via Claude, linked to Kairo to show who I know at each employer.",
    metric: {
      value: "16,000+",
      count: { target: 16000, suffix: "+" },
      caption:
        "internships, jobs and programmes aggregated daily from 35 career boards, Indeed and LinkedIn across 30 markets, and hackathon feeds.",
    },
    tags: ["AI career CRM", "live, behind login"],
    note: "Private code · screens on request",
    media: [
      {
        kind: "video",
        figure: "1",
        src: "/work/kairo/landing.mp4",
        webm: "/work/kairo/landing.webm",
        poster: "/work/kairo/landing.jpg",
        width: 1280,
        height: 720,
        alt: "Kairo landing page hero: a headline in French over a dark green scene where a ball rolls along a rail.",
        caption:
          "Kairo landing, hero mockup in progress (September 2026). The on-screen figures are demo copy; the app itself sits behind a login.",
      },
      {
        kind: "image",
        figure: "2",
        src: "/work/kairo/trame-capture.png",
        width: 1440,
        height: 900,
        alt: "Trame capture screen: a freeform note about a meeting, and the contact card proposed from it with its fields highlighted.",
        caption:
          "Trame, capture screen (design mockup, fictional contacts): a freeform note becomes a structured contact card.",
      },
    ],
  },
  {
    id: "cortex",
    number: "02",
    title: "Cortex",
    stack: "Next.js · TypeScript · PostgreSQL · Drizzle · Claude API · LaTeX · Railway",
    summary:
      "An AI exam-preparation platform. It learns each course's exam format from past papers, weights every topic by how heavily it was examined, schedules spaced revision on the student's weak points, and generates faithful practice exams via a multi-pass LLM pipeline. Per-user Postgres schemas, cost caps; deployed on Railway.",
    metric: {
      value: "~28k",
      count: { target: 28, prefix: "~", suffix: "k" },
      caption: "lines. Answers accepted only if verified by sandboxed code execution or symbolic checks.",
    },
    tags: ["exam generation", "open source"],
    link: { label: "github.com/Benabens/cortex", href: "https://github.com/Benabens/cortex" },
    media: [
      {
        kind: "video",
        figure: "3",
        src: "/work/cortex/landing.mp4",
        webm: "/work/cortex/landing.webm",
        poster: "/work/cortex/landing.jpg",
        width: 1280,
        height: 720,
        alt: "Cortex landing page hero: the headline over a slowly moving network of light points on black.",
        caption: "Cortex landing, hero draft of July 2026. The background loop is a generated video; the copy is a working draft.",
      },
    ],
  },
  {
    // Measured in github.com/Benabens/ReCHor on 2026-09-26: timetable/2025-05-28/connections.bin
    // is 33,001,128 bytes at 12 bytes per connection (4 × U16 + S32 in BufferedConnections),
    // i.e. 2,750,094 connections; 44 source files, 24 test classes, 160 @Test methods
    // (the test-line count shown is CV V5's ~3,600: the CV is the source of truth),
    // 258 MB of timetables for 7 days (26 May → 1 June 2025). Pair confirmed by the @author tags.
    id: "rechor",
    number: "03",
    title: "ReCHor",
    stack: "Java 22 · JavaFX 21 · EPFL CS-108, in a pair",
    summary:
      "A desktop journey planner for the Swiss public-transport network. It finds every Pareto-optimal journey between two Swiss stops (Connection Scan Algorithm) over real CFF timetables (~258\u00a0MB), trading arrival time against changes, by scanning the day's connections once in reverse chronological order over memory-mapped, bit-packed timetable storage that is never deserialised. JavaFX UI with accent-insensitive autocomplete, journey details, iCalendar and GeoJSON export, the search kept off the UI thread; 44 classes, ~3,600 lines of tests, 160 JUnit tests.",
    metric: {
      value: "2.75 M",
      count: { target: 2.75, suffix: " M", decimals: 2 },
      caption:
        "connections in one weekday of the real CFF timetables, scanned in a single pass per query. ~258\u00a0MB of timetables for seven days, read from memory-mapped files.",
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
      "A two-player cooperative 2D game on the course's engine: a fire-and-water co-op game with a boss fight, in the spirit of Fireboy and Watergirl. Each player passes what the other cannot; every interaction between players, projectiles, enemies and elemental walls goes through double dispatch (visitor pattern), and each cell decides what can walk or fly over it. Four areas, keys, orbs, bombs, a chest added beyond the brief, and a final boss with ranged attacks and a conditional weak spot. ~3,700 lines.",
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
      "Predicted gaming-addiction level (3 classes) and score (0–10) from gaming and mental-health data with KNN, logistic/linear regression, K-Means and an MLP with hand-written backpropagation, every gradient checked against finite differences; two written reports. The point is what accuracy hides: the first MLP scored 85% while never once predicting the rare class, 3% of the data. Inverse-frequency weighted cross-entropy lifted rarest-class recall from 0 to 0.69 and macro-F1 from 0.55 to 0.76 (5-fold CV), for 0.75 points of accuracy.",
    metric: {
      value: "0 → 0.69",
      count: { target: 0.69, prefix: "0 → ", decimals: 2 },
      caption:
        "rarest-class recall, lifted by an inverse-frequency weighted cross-entropy. Macro-\u2060F1 from 0.55 to 0.76 (5-fold CV).",
    },
    tags: ["ML from scratch", "open source"],
    link: {
      label: "github.com/Benabens/addiction-classifier-numpy",
      href: "https://github.com/Benabens/addiction-classifier-numpy",
    },
    media: [
      {
        // Counts read off Figure 2 (a) and (b) of reports/milestone2_report.pdf.
        kind: "matrix",
        figure: "4",
        classes: ["Low", "Medium", "High"],
        panels: [
          { title: "Before: sigmoid + MSE", rows: [[266, 14, 0], [32, 75, 0], [0, 13, 0]] },
          { title: "After: softmax + weighted cross-entropy", rows: [[258, 22, 0], [31, 71, 5], [0, 4, 9]] },
        ],
        mark: [2, 2],
        note: "Rows: true class. Columns: predicted class. Shade: share of the true class.",
        alt: "Two confusion matrices on the 400 test samples. Before, none of the 13 High samples is predicted High. After, 9 of 13 are.",
        caption:
          "Test-set confusion matrices, redrawn from the milestone-2 report (400 samples). The baseline never predicts High; the weighted loss recovers 9 of 13.",
      },
    ],
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
