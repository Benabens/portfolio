import type { JourneyStep } from "./types";

// Journey, oldest first. Frozen from CV V5 (2026-09-25).

export const journeyIntro = {
  label: "Journey",
  title: "Nine entries, ",
  titleEmphasis: "so far.",
};

export const journey: JourneyStep[] = [
  {
    number: "01",
    when: "Around 13",
    title: "Where it began",
    text: "Self-taught Blender, Photoshop and Premiere Pro. 3D artwork and branding for YouTube creators.",
  },
  {
    number: "02",
    when: "2019 – 2021",
    title: "Sneaker resale, four partners",
    text: "Secured a licence to Flare AIO, a sell-out EU sneaker bot, by automating its restock purchase; ran it on Foot Locker and Snipes drops. Resold the licence for about twice its cost, roughly €10k over the period.",
  },
  {
    number: "03",
    when: "2024",
    title: "EPFL",
    text: "BSc in Communication Systems, Lausanne. Introduction to Machine Learning 5.75/6, Algorithms I 5.5/6, Linear Algebra 5.5/6.",
  },
  {
    number: "04",
    when: "2024 · 3 months",
    title: "NanoSynex",
    text: "AI and automation for a Technion medtech spin-off, reporting to the CEO. Two offline LLMs behind a router with a shared Obsidian memory, so confidential R&D and investor documents never left the machine. LLM triage of two inboxes; one analysis-ready dataset from the test reader's exports.",
  },
  {
    number: "05",
    when: "2025",
    title: "BABOO, three club nights",
    text: "Produced end to end. One night at Noche Club, Lausanne (May 2025) brought in CHF 5,000 with an internationally touring DJ.",
  },
  {
    number: "06",
    when: "Jul 2025",
    title: "Co-camp director",
    text: "A one-month scout summer camp for 100 children with a team of 20 counsellors. Co-managed the €80k budget and ran the €18k food line myself.",
  },
  {
    number: "07",
    when: "Nov 2025",
    title: "Linear algebra bootcamp",
    text: "Co-instructor of a paid one-week bootcamp for 30 first-year students: lectures and exercise sets.",
  },
  {
    number: "08",
    when: "Sep 2026",
    title: "Teaching at EPFL",
    text: "Teaching assistant for Mechanics (PHYS-101), a course of 1,000+ students: a weekly 2-hour exercise session and the course's Ed forum. Linear Algebra (MATH-111) as well.",
    now: true,
  },
  {
    number: "09",
    when: "Oct 2026",
    title: "Biosynex, incoming",
    text: "Part-time AI engineer for a Euronext-listed rapid diagnostics company: introduce the executive team to applied AI, then build AI tools into internal workflows.",
  },
];
