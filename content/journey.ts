import type { JourneyStep } from "./types";

// Journey, oldest first. Wording from the CV (Brain/CV/CV.md, audit of 2026-09-29).

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
    title: "Sneaker Resale Venture, team of 4",
    text: "Partner. Secured a license to Flare AIO, a sell-out EU sneaker bot, by automating its restock purchase; ran it on Foot Locker and Snipes drops. Resold the license for about twice its cost; generated roughly €10k over the period.",
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
    text: "AI & automation (project-based) for a Technion spin-off, reporting to the CEO. Deployed two offline LLMs (Ollama; Mistral 7B, Llama 3 8B) behind a router with a shared Obsidian memory, so confidential R&D and investor documents never left the machine (GDPR); Python scripts triaging the CEO's Gmail and Outlook inboxes with an LLM classifier; the test reader's experiment exports harmonised and cleaned (Python, pandas), then matched against a partner veterinary lab's reference results to measure agreement rates for a validation study.",
  },
  {
    number: "05",
    when: "2025",
    title: "BABOO, three club nights",
    text: "Founder & event producer. Produced 3 club nights end to end; one night at Noche Club (May 2025) brought in CHF\u00a05,000 with an internationally touring DJ.",
  },
  {
    number: "06",
    when: "Jul 2025",
    title: "Co-camp director",
    text: "Co-directed a one-month scout summer camp for 100 children; led a team of 20 counsellors, promoted team leads and wrote the camp's full educational project. Co-managed the €80k camp budget, running the €18k food line myself.",
  },
  {
    number: "07",
    when: "Nov 2025",
    title: "Linear Algebra Bootcamp (MATH-111)",
    text: "Co-instructor: gave the lectures and wrote the exercise sets of a paid one-week bootcamp for 30 first-year students (mid-semester break).",
  },
  {
    number: "08",
    when: "Sep 2026",
    title: "Teaching at EPFL",
    text: "Teaching assistant for Mechanics (PHYS-101) and Linear Algebra (MATH-111). Selected on academic merit for a Mechanics course of 1,000+ students (CS, Chemistry, EE); I lead a weekly 2-hour exercise session and answer questions on the course's Ed forum.",
    now: true,
  },
  {
    number: "09",
    when: "Oct 2026",
    title: "Biosynex, incoming",
    text: "Incoming AI engineer (part-time contractor), remote, for a Euronext-listed rapid diagnostics company. Engaged to introduce the executive team to applied AI, then build AI tools into internal workflows.",
  },
];
