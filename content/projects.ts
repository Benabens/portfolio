import type { CaseStudy, SideProject } from "./types";

// Projects. Every figure comes from the CV (Brain/CV/CV.md, audit of 2026-09-29) or was
// measured in the public repositories (see the comments); nothing is invented. The CV
// is the source of truth: no count of code lines for Kairo and Cortex, no volume of listings.
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
    // Kairo and Trame were merged into one app (CV, 29 September 2026). No number of
    // listings anywhere (Ben's decision): the point is the scoring, not the volume.
    id: "kairo",
    number: "01",
    title: "Kairo",
    stack:
      "Next.js · TypeScript · Python · PostgreSQL (Supabase, row-level security) · Claude API · GitHub Actions · Vercel",
    summary:
      "Kairo is an AI career CRM. I designed and shipped a daily pipeline aggregating internships, jobs and programmes from 35 career boards, Indeed/LinkedIn (30 markets) and hackathon feeds, each scored 0–100 by rules + an LLM. LLM extraction of deadlines and eligibility, each answer backed by a verbatim quote; 160+ tests, CI, deployed on Vercel. A contact CRM turns freeform notes into structured contacts via Claude, then links each job to the people I know there and prompts who to follow up with.",
    metric: {
      value: "0–100",
      count: { target: 100, prefix: "0–" },
      caption:
        "the score every internship, job and programme gets, by rules + an LLM. Deadlines and eligibility come with a verbatim quote behind each answer.",
    },
    tags: ["AI career CRM", "live, behind login"],
    links: [{ label: "kairo-internships.vercel.app", href: "https://kairo-internships.vercel.app" }],
    note: "Private code",
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
        caption: "Kairo landing, hero mockup (September 2026). The app itself sits behind a login.",
      },
    ],
  },
  {
    id: "cortex",
    number: "02",
    title: "Cortex",
    stack: "Next.js · TypeScript · PostgreSQL · Drizzle · Claude API · LaTeX · Railway",
    summary:
      "An AI exam-preparation platform. It learns each course's exam format from past papers, weights every topic by how heavily it was examined, schedules spaced revision on weak points, and generates faithful practice exams via a multi-pass LLM pipeline; I used it to prepare my own exams in 3 EPFL courses. Per-user Postgres schemas, cost caps; deployed on Railway.",
    metric: {
      value: "330+",
      count: { target: 330, suffix: "+" },
      caption: "tests. Answers accepted only if verified by sandboxed code execution or symbolic checks.",
    },
    tags: ["exam generation", "open source"],
    links: [
      { label: "cortex-exam.vercel.app", href: "https://cortex-exam.vercel.app" },
      { label: "github.com/Benabens/cortex", href: "https://github.com/Benabens/cortex" },
    ],
    media: [
      {
        // Captures of the app itself, run locally (Next.js, SQLite) on a copy of its
        // development data, course CS-250 Algorithms: what fell at past finals and how often.
        kind: "image",
        figure: "2",
        wide: true,
        src: "/work/cortex/programme.webp",
        width: 2000,
        height: 1125,
        alt: "Cortex, Programme page of the Algorithms course: notions grouped by chapter, each with how many times it fell at a final.",
        caption: "Cortex, the programme of CS-250 Algorithms: every notion with how many times it fell at a final, sorted by priority.",
      },
      {
        kind: "image",
        figure: "3",
        src: "/work/cortex/home.webp",
        width: 2000,
        height: 1250,
        alt: "Cortex home: the notion to work on today, Max-flow / min-cut, worth 14.5% of the exam and never practised, with a Train button.",
        caption: "The home screen: the notion that pays off most today, weighted by the exam, and the reviews that are due.",
      },
      {
        kind: "image",
        figure: "4",
        src: "/work/cortex/exams.webp",
        width: 2000,
        height: 1250,
        alt: "Cortex, Exams page: the exam composer with a proposed composition of 3 multiple-choice and 4 open problems, and the detected format of the real final: 180 minutes, 100 points.",
        caption: "The exam composer: the real final's format, detected from the past papers, becomes the default composition.",
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
    links: [{ label: "github.com/Benabens/ReCHor", href: "https://github.com/Benabens/ReCHor" }],
    media: [
      {
        // Rendered off screen from the repo (JavaFX 21 under Monocle, scene 1440×900 at 2×):
        // Lausanne → Zürich HB on 28 May 2025 at 08:00, every Pareto-optimal journey.
        kind: "image",
        figure: "5",
        src: "/work/rechor/journeys.webp",
        width: 2000,
        height: 1250,
        alt: "ReCHor: the query fields filled with Lausanne, Zürich HB, 28.05.2025 and 08:00, and the list of journeys with their times, changes and durations.",
        caption: "ReCHor, Lausanne → Zürich HB on 28 May 2025: every Pareto-optimal journey of the morning, rendered from the app.",
      },
      {
        kind: "image",
        figure: "6",
        src: "/work/rechor/detail.webp",
        width: 2000,
        height: 1250,
        alt: "ReCHor: the 8h17 IC 1 journey selected, with its intermediate stops Fribourg and Bern and the arrival at Zürich HB platform 33.",
        caption: "The 8h17 IC 1 selected: platforms, intermediate stops and the iCalendar and map actions.",
      },
    ],
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
    links: [{ label: "github.com/Benabens/ICoop", href: "https://github.com/Benabens/ICoop" }],
    media: [
      {
        // Frames rendered off screen from the repo: the engine drawn into a BufferedImage
        // at 2×, the players walked by a scripted keyboard.
        kind: "image",
        figure: "7",
        src: "/work/icoop/spawn.webp",
        width: 1920,
        height: 1080,
        alt: "ICoop, the Spawn area: the fire player and the water player below a manor, with a heart, a bomb and a pressure plate.",
        caption: "ICoop, the Spawn area: the fire and water players, a bomb to push and a pressure plate.",
      },
      {
        kind: "image",
        figure: "8",
        src: "/work/icoop/orbway.webp",
        width: 1920,
        height: 1080,
        alt: "ICoop, the OrbWay area: two corridors with hearts and pressure plates, a fire wall and a water wall, one player in each corridor.",
        caption: "OrbWay: each player clears the wall the other cannot cross.",
      },
      {
        kind: "image",
        figure: "9",
        src: "/work/icoop/maze.webp",
        width: 1920,
        height: 1080,
        alt: "ICoop, the Maze: two columns of flaming skulls with health bars, streams of lava and water, both players attacking between them.",
        caption: "The Maze: the HellSkull gauntlet, lava and water streams, both players mid-swing.",
      },
    ],
  },
  {
    // Figures from the README and the milestone-2 report of
    // github.com/Benabens/addiction-classifier-numpy (test set, checked on 2026-09-26):
    // MLP with sigmoid + MSE: 85.25 % accuracy, macro-F1 0.546, recall on "High" 0.00.
    // MLP with softmax + inverse-frequency weighted cross-entropy (w = [0.48, 1.21, 10.4]):
    // 84.50 %, 0.757, 0.69. Rare class = 44 of 1,280 training samples (~3 %). Team of 3 per
    // the README and the CV, which rounds the F1 jump to 0.55 → 0.76. Both figures are
    // measured on the test set (Ben's correction of 28 September 2026).
    id: "addiction",
    number: "05",
    title: "Gaming Addiction Prediction",
    stack: "Python · NumPy, no ML libraries · EPFL CS-233, team of 3",
    summary:
      "Predicted gaming-addiction level (3 classes) and score (0–10) from gaming and mental-health data with KNN, logistic/linear regression, K-Means and an MLP with hand-written backpropagation, every gradient checked against finite differences; two written reports. The point is what accuracy hides: the first MLP scored 85% while never once predicting the rare class, 3% of the data. Inverse-frequency weighted cross-entropy lifted rarest-class recall from 0 to 0.69 and macro-F1 from 0.55 to 0.76 (test set), for 0.75 points of accuracy.",
    metric: {
      value: "0 → 0.69",
      count: { target: 0.69, prefix: "0 → ", decimals: 2 },
      caption:
        "rarest-class recall, lifted by an inverse-frequency weighted cross-entropy. Macro-\u2060F1 from 0.55 to 0.76 (test set).",
    },
    tags: ["ML from scratch", "open source"],
    links: [{ label: "github.com/Benabens/addiction-classifier-numpy", href: "https://github.com/Benabens/addiction-classifier-numpy" }],
    media: [
      {
        // Counts read off Figure 2 (a) and (b) of reports/milestone2_report.pdf.
        kind: "matrix",
        figure: "10",
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
