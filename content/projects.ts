import type { CaseStudy, SideProject } from "./types";

// Projects, in the CV's order. Every figure comes from the CV (Brain/CV/CV.md, section 9,
// frozen on 22 November 2026, sha256 2040001f…), is visible in the live app, or was
// measured in the public repositories (see the comments); nothing is invented. The CV
// is the source of truth: no count of code lines for Kairo and Cortex, no volume of
// listings, no "Claude API" (Ben's decisions of 29–30 September 2026).
// To add a case study: append to `caseStudies` (keep the numbering, figures included).
// To add a small project: append to `sideProjects`.

export const workIntro = {
  label: "Selected work",
  title: "Five projects, ",
  titleEmphasis: "one number",
  titleEnd: " each.",
  note: "Every figure on this page is on my CV, visible in the live app or measured in the public repo, and holds up in an interview.",
};

export const caseStudies: CaseStudy[] = [
  {
    // Measured in github.com/Benabens/ReCHor on 2026-09-26: timetable/2025-05-28/connections.bin
    // is 33,001,128 bytes at 12 bytes per connection (4 × U16 + S32 in BufferedConnections),
    // i.e. 2,750,094 connections; 44 source files, 24 test classes, 160 @Test methods
    // (the test-line count shown is the CV's ~3,600: the CV is the source of truth; the
    // 24 test files counted 3,101 lines on 22 November 2026, reported to Ben),
    // 258 MB of timetables for 7 days (26 May → 1 June 2025). Pair confirmed by the @author tags.
    id: "rechor",
    number: "01",
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
        // A real query run on the app's own code (Router + JourneyExtractor, content/rechor-trip.ts).
        kind: "journey",
        figure: "1",
        wide: true,
        alt: "Animated map of Switzerland: the fastest morning journey from Genève to St. Moritz found by ReCHor, IC 1 to Zürich HB, IC 3 to Chur, IR 38 to St. Moritz, drawn stop by stop with its times.",
        caption: "Genève → St. Moritz, 28 May 2025: the first journey after 07:00, found by ReCHor's own router on the real CFF timetable, replayed stop by stop.",
      },
      {
        // Rendered off screen from the repo's own JavaFX UI (scene 1200×848 at 2×, intermediate
        // stops opened): Genève → St. Moritz on 28 May 2025 at 07:30, the same query as the map.
        kind: "image",
        figure: "2",
        wide: true,
        src: "/work/rechor/stmoritz.webp",
        width: 2000,
        height: 1413,
        alt: "ReCHor: Genève to St. Moritz on 28.05.2025 at 07:30; on the left the journeys of the day, on the right the 7h35 journey with its three trains, IC 1, IC 3 and IR 38, every intermediate stop and both changes.",
        caption: "The app itself on the same query: the day's journeys on the left; on the right the 7h35, IC 1, IC 3 and IR 38 over the Albula line, every stop and both changes.",
      },
    ],
  },
  {
    // Wording from the CV (section 9). Kairo and Trame were merged into one app on
    // 29 September 2026. No number of listings anywhere (Ben's decision): the point is the
    // scoring, not the volume. Repo private; its suites counted ~5,300 test cases on
    // 22 November 2026, the CV says 160+ (kept: the CV is the source of truth).
    id: "kairo",
    number: "02",
    title: "Kairo",
    stack: "Next.js · TypeScript · Python · PostgreSQL (Supabase, row-level security) · GitHub Actions · Railway · Vercel",
    summary:
      "An internship search and application platform, live with public users since October 2026. A scheduled Python pipeline on Railway pulls openings from employers' public job feeds and ATS APIs, deduplicates them, then an LLM worker scores each one against every user's profile. Multi-tenant Postgres isolated by row-level security; an application copilot drafts each form answer with its source and flags uncertain ones for the user to check before submitting; 160+ tests, CI. The referral finder turns freeform notes into structured contacts with LLM extraction, then links every opening to the user's direct and indirect connections at that company, so no warm intro is missed.",
    metric: {
      value: "0–100",
      count: { target: 100, prefix: "0–" },
      caption: "the score every opening gets against each user's profile, with the reason for it in one line.",
    },
    tags: ["internship platform", "live since Oct 2026"],
    links: [{ label: "kairocareer.app", href: "https://kairocareer.app" }],
    note: "Private code",
    media: [
      {
        // Landing captured headless at 1440×900 @2x from kairocareer.app (22 November 2026).
        kind: "image",
        figure: "3",
        wide: true,
        src: "/work/kairo/landing.webp",
        width: 2000,
        height: 1250,
        alt: "Kairo landing page: a metal ball on a rail across a dark green scene, an opening card above it, Optiver Quant Intern, Amsterdam, Summer 2027, scored 93, and the line Kairo finds internships that match your profile and helps you prepare your applications.",
        caption: "The landing, kairocareer.app: Kairo finds the internships that match your profile and helps you prepare your applications.",
      },
      {
        // Inside the app, run locally from main on its own demo fixtures (no account, no
        // real person; the application form of Fig. 6 is filled for a made-up applicant):
        // captured headless at 1440×900 @2x on 22 November 2026. The app is in French.
        kind: "image",
        figure: "4",
        wide: true,
        src: "/work/kairo/inbox.webp",
        width: 2000,
        height: 1250,
        alt: "Kairo inbox, in French: internships grouped by score band, Excellent 90+ then Very good 80–89, each row with its score, the company, a one-line reason, the deadline and the actions Ignore, Wishlist, Apply.",
        caption: "Inside the app (in French, on its demo data): the inbox, every opening scored 0–100 against the profile, with the reason in one line and the deadline.",
      },
      {
        kind: "image",
        figure: "5",
        src: "/work/kairo/detail.webp",
        width: 2000,
        height: 1250,
        alt: "Kairo offer page: LLM Research Intern at Mistral AI, Paris, scored 96 out of 100, Excellent, with why this score, the requirements that match the profile, the deadline and the next steps: log the outcome, tailor my CV to this offer, prepare the interview, find a contact.",
        caption: "One offer opened: the score and why, each requirement checked against the profile with the posting's sentence behind it, and the next steps.",
      },
      {
        kind: "image",
        figure: "6",
        src: "/work/kairo/copilot.webp",
        width: 2000,
        height: 1250,
        alt: "Kairo application section, for a made-up applicant: two fields left for the user, a start date and a certification box to tick themselves; the other answers drafted, one marked pre-filled from your local profile, an availability answer marked To check and a motivation answer marked Draft to review.",
        caption: "The application copilot: each answer drafted with its source, the uncertain ones flagged, and what only the user can fill left to them. Nothing is sent by the app.",
      },
      {
        kind: "image",
        figure: "7",
        wide: true,
        src: "/work/kairo/network.webp",
        width: 2000,
        height: 1250,
        alt: "Kairo, Paths: who can open a door at Mistral AI. A first-degree contact met at a hackathon, with the evidence for the link, then a Research Scientist from the same school with no proven link yet, each with a button to draft a message.",
        caption: "The referral finder: who can open a door at a company, a direct contact with the proof of the link, then the indirect ones, here someone from the same school.",
      },
    ],
  },
  {
    // Wording from the CV (section 9). Public repo; its suite counted ~1,900 test cases on
    // 22 November 2026, the CV says 330+ (kept: the CV is the source of truth).
    // Open to sign-ups at app.cortexexam.com since 6 October 2026.
    id: "cortex",
    number: "03",
    title: "Cortex",
    stack: "Next.js · TypeScript · PostgreSQL · Drizzle · LaTeX · Railway",
    summary:
      "An exam-preparation platform. It learns each course's exam format from past papers, weights every topic by how heavily it was examined, schedules spaced revision on weak points, and generates faithful practice exams via a multi-pass LLM pipeline; I used it to prepare my own exams in 3 EPFL courses. Per-user Postgres schemas and cost caps; open to sign-ups since October 2026.",
    metric: {
      value: "330+",
      count: { target: 330, suffix: "+" },
      caption: "tests. Answers accepted only if verified by sandboxed code execution or symbolic checks.",
    },
    tags: ["exam preparation", "live", "open source"],
    links: [
      { label: "cortexexam.com", href: "https://cortexexam.com" },
      { label: "github.com/Benabens/cortex", href: "https://github.com/Benabens/cortex" },
    ],
    media: [
      {
        // Landing captured headless at 1440×900 @2x from cortexexam.com (22 November 2026).
        kind: "image",
        figure: "8",
        wide: true,
        src: "/work/cortex/landing.webp",
        width: 2000,
        height: 1250,
        alt: "Cortex landing page: the headline Your shortcut to exam day over folders of blue-lit glass on black, with a Get started with Cortex button.",
        caption: "The landing, cortexexam.com. Below, the app itself.",
      },
      {
        // The app itself, run locally from main (single-user development mode, no account)
        // on its development data for CS-233 Introduction to Machine Learning: captured
        // headless at 1440×900 @2x on 22 November 2026. The app is in French.
        kind: "image",
        figure: "9",
        wide: true,
        src: "/work/cortex/home.webp",
        width: 2000,
        height: 1250,
        alt: "Cortex home, in French, for Introduction to Machine Learning: work on now, Gradient Descent & Optimization, fell once at the finals, 16% of the questions, never practised, with a Train button; then three more topics with how often each fell and their weight.",
        caption: "Inside the app (in French): the home screen, the topic that pays off most today, weighted by how often it fell at past finals.",
      },
      {
        kind: "image",
        figure: "10",
        src: "/work/cortex/exams.webp",
        width: 2000,
        height: 1250,
        alt: "Cortex, Exams page: the exam composer with 16 multiple-choice and 3 open questions, the format detected from the real final, 180 minutes and 116 points, and two ready mock exams marked 16 multiple-choice questions verified.",
        caption: "The exam composer: the real final's format, detected from past papers, becomes the default, and each ready exam says how many of its answers were verified.",
      },
      {
        kind: "image",
        figure: "11",
        src: "/work/cortex/revision.webp",
        width: 2000,
        height: 1250,
        alt: "Cortex, Revision page: coverage of the past finals by topic in course order, 56 multiple-choice and 74 open questions, each topic with its lecture, its question count and its share.",
        caption: "Revision: every past-final question filed by topic, in course order, with each topic's share of the exams.",
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
    number: "04",
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
        figure: "12",
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
  {
    // Measured in github.com/Benabens/ICoop on 2026-09-26: iccoop/src/main/java holds 40 files and
    // 3,695 lines (CV: ~3,700), 24 actor classes, 4 areas (Spawn, Maze, Arena, OrbWay), boss HellSkull;
    // the course engine (game-engine/, 110 files) was kept unmodified (CONCEPTION.md).
    id: "icoop",
    number: "05",
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
        figure: "13",
        src: "/work/icoop/spawn.webp",
        width: 1920,
        height: 1080,
        alt: "ICoop, the Spawn area: the fire player and the water player below a manor, with a heart, a bomb and a pressure plate.",
        caption: "ICoop, the Spawn area: the fire and water players, a bomb to push and a pressure plate.",
      },
      {
        kind: "image",
        figure: "14",
        src: "/work/icoop/orbway.webp",
        width: 1920,
        height: 1080,
        alt: "ICoop, the OrbWay area: two corridors with hearts and pressure plates, a fire wall and a water wall, one player in each corridor.",
        caption: "OrbWay: each player clears the wall the other cannot cross.",
      },
      {
        kind: "image",
        figure: "15",
        src: "/work/icoop/maze.webp",
        width: 1920,
        height: 1080,
        alt: "ICoop, the Maze: two columns of flaming skulls with health bars, streams of lava and water, both players attacking between them.",
        caption: "The Maze: the HellSkull gauntlet, lava and water streams, both players mid-swing.",
      },
    ],
  },
];

export const moreIntro = {
  label: "Also on the books",
  title: "Smaller lines, still real.",
};

// "Other Projects" of the CV, in its order. Mechanics simulators left the CV on
// 29 September 2026 (Ben's weakest project, never pushed to GitHub), so they left the site.
export const sideProjects: SideProject[] = [
  {
    // 42 synthesizable modules, 42/42 self-checking testbenches (run_all.sh, 22 November 2026).
    id: "digital-logic",
    number: "06",
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
    // The repo is a private EPFL classroom repository: no link. 6,294 lines of C and headers
    // in the four labs, measured on 22 November 2026.
    id: "systems",
    number: "07",
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
    number: "08",
    title: "VeriReason",
    description: "A PyTorch Transformer from first principles",
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
    number: "09",
    title: "QR-code generator",
    description: "Reed–Solomon error correction and masking, by hand · Java",
    context: "CS-107",
    href: "https://github.com/Benabens/QRCodeGenerator",
    external: true,
    peek: { big: "Reed–Solomon", text: "error correction and masking, implemented by hand." },
  },
];
