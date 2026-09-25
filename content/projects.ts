import type { CaseStudy, SideProject } from "./types";

// Projects. Every figure comes from CV V5 (2026-09-25); nothing here is invented.
// To add a case study: append to `caseStudies` (keep the numbering).
// To add a small project: append to `sideProjects`.

export const workIntro = {
  label: "Selected work",
  title: "Five projects, ",
  titleEmphasis: "one number",
  titleEnd: " each.",
  note: "Every figure on this page is on my CV and holds up in an interview.",
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
    id: "verireason",
    number: "03",
    title: "VeriReason",
    stack: "PyTorch",
    summary:
      "A decoder-only Transformer written from first principles, to test whether a small model learns reusable algorithms rather than memorising answers. Trained on procedurally generated tasks with automatically verifiable answers. Written so far: task generation, tokenizer, batched pipeline with padding and loss masking, embeddings. Attention, the training loop and verifier-driven RL post-training are in progress.",
    metric: {
      value: "In progress",
      caption: "no number yet, and none invented until the model trains.",
    },
    tags: ["transformer from scratch"],
    link: { label: "github.com/Benabens/verireason", href: "https://github.com/Benabens/verireason" },
  },
  {
    id: "digital-logic",
    number: "04",
    title: "Digital-logic library",
    stack: "Verilog",
    summary:
      "42 synthesizable modules, from logic gates to a processor register file, each with its own self-checking testbench. Self-initiated and ungraded.",
    metric: {
      value: "42/42",
      count: { target: 42, after: "/42" },
      caption: "self-checking testbenches passing, zero warnings.",
    },
    tags: ["hardware", "open source"],
    link: { label: "github.com/Benabens/fds-digital-logic", href: "https://github.com/Benabens/fds-digital-logic" },
  },
  {
    id: "systems",
    number: "05",
    title: "Systems project",
    stack: "C · POSIX sockets · pthreads · EPFL CS-202, in a pair",
    summary:
      "Reliable file transfer over TCP then UDP with one-way delay measurement. A UNIX v6 filesystem (inodes, directories, mount) behind a command-line tool, with unit tests. A multithreaded file server with per-file locking.",
    metric: {
      value: "~6,300",
      count: { target: 6300, prefix: "~" },
      caption: "lines of C.",
    },
    tags: ["networking", "filesystems"],
    note: "Course project · no public repository",
  },
];

export const moreIntro = {
  label: "Also on the books",
  title: "Smaller lines, still real.",
};

export const sideProjects: SideProject[] = [
  {
    id: "rechor",
    number: "06",
    title: "ReCHor",
    description: "Public-transport journey planner · Java, JavaFX",
    context: "CS-108",
    href: "https://github.com/Benabens/ReCHor",
    external: true,
    peek: {
      big: "~258 MB",
      text: "of CFF timetable, every Pareto-optimal journey between two Swiss stops. 44 classes, ~3,600 lines of tests.",
    },
  },
  {
    id: "addiction",
    number: "07",
    title: "Gaming addiction prediction",
    description: "ML from scratch in NumPy, no ML libraries · team of 3",
    context: "CS-233",
    href: "https://github.com/Benabens/addiction-classifier-numpy",
    external: true,
    peek: {
      big: "0.55 → 0.76",
      text: "macro-F1 with inverse-frequency weighted cross-entropy, 5-fold CV. KNN, regressions, K-Means and an MLP with hand-written backprop.",
    },
  },
  {
    id: "icoop",
    number: "08",
    title: "ICoop",
    description: "Two-player cooperative 2D game · Java",
    context: "CS-107",
    href: "https://github.com/Benabens/ICoop",
    external: true,
    peek: { big: "~3,700", text: "lines of Java. Fire-and-water co-op with a boss fight; interactions via double dispatch." },
  },
  {
    id: "qrcode",
    number: "09",
    title: "QR-code generator",
    description: "Java",
    context: "CS-107",
    href: "https://github.com/Benabens",
    external: true,
    peek: { big: "Reed–Solomon", text: "error correction and masking, implemented by hand." },
  },
  {
    id: "course-monitor",
    number: "10",
    title: "EPFL course monitor",
    description: "Python scraper, scheduled pipeline, email alerts",
    context: "side",
    href: "#more",
    external: false,
    peek: { big: "every 6 h", text: "a scheduled scraper that detects course and professor changes and sends email alerts." },
  },
  {
    id: "simulators",
    number: "11",
    title: "Mechanics simulators",
    description: "Interactive explainers for PHYS-101",
    context: "teaching",
    href: "#journey",
    external: false,
    peek: { big: "for my students", text: "interactive mechanics simulators and explainers, built for the exercise sessions I run." },
  },
];
