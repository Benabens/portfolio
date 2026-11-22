import type { JourneyStep } from "./types";

// Journey, oldest first. Wording from the CV (Brain/CV/CV.md, section 9, frozen on
// 22 November 2026, sha256 2040001f…). The sneaker venture left the CV on 21 October
// 2026 (told in interviews only), so it left the site too. Entry 01 is not on the CV:
// it comes from the CV's material bank (section 7), true and unquantified.

export const journeyIntro = {
  label: "Journey",
  title: "Eight entries, ",
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
    when: "2024",
    title: "EPFL",
    text: "Bachelor of Science in Communication Systems, School of Computer and Communication Sciences (IC), Lausanne; expected graduation Jan 2028. Introduction to Machine Learning 5.75/6, Algorithms I 5.5/6, Linear Algebra 5.5/6.",
  },
  {
    number: "03",
    when: "Jun – Sep 2024",
    title: "NanoSynex",
    text: "Software Engineer, ML & Statistical Modeling, remote, for a Technion medtech spin-off. Modeled bacterial growth in Python and NumPy to compare Wald's sequential probability ratio test (SPRT) with a fixed-threshold rule for antibiotic susceptibility testing: in simulation, the SPRT reached a decision 20% sooner, with a major-error rate below 3%. Benchmarked the rapid antibiotic test against a veterinary reference laboratory for a validation study, merging both result sets by sample ID in pandas and quantifying agreement rates. Deployed two offline LLMs behind a model router with shared memory, so confidential R&D and investor documents never left the machine, and automated inbox triage with an LLM classifier routing email into custom priority categories (investors, grants, R&D).",
  },
  {
    number: "04",
    when: "2025",
    title: "BABOO, three club nights",
    text: "Founder & event producer, Lausanne. Produced 3 club nights end to end that brought in CHF 10,000, one at Noche Club with an internationally touring DJ.",
  },
  {
    number: "05",
    when: "Jul 2025",
    title: "Scout summer camp, co-camp director",
    text: "Mévouillon, France. Co-directed a one-month camp for 80 children from two local groups (Nice, Strasbourg); led a team of 15 counsellors, promoted team leads and wrote the camp's full educational project. Co-managed the €80k camp budget, running the €18k food line myself (local farmers, Intermarché), and built the site at pre-camp: tents, dry toilets, wooden tables.",
  },
  {
    number: "06",
    when: "Nov 2025",
    title: "Linear Algebra Bootcamp (MATH-111)",
    text: "Co-instructor: gave the lectures and wrote the exercise sets of a paid one-week bootcamp for 30 first-year students (mid-semester break).",
  },
  {
    number: "07",
    when: "Sep 2026",
    title: "Teaching at EPFL",
    text: "Teaching assistant for Mechanics (PHYS-101) and Linear Algebra (MATH-111). Selected on academic merit for a Mechanics course of 1,000+ students (CS, Chemistry, EE); I lead a weekly 2-hour exercise session and answer questions on the course's Ed forum.",
    now: true,
  },
  {
    number: "08",
    when: "Oct 2026",
    title: "Biosynex, AI Engineer",
    text: "AI Engineer (part-time), remote, for a Euronext-listed rapid diagnostics company. Building a RAG-based copilot over regulatory and quality documentation to speed up compliance and document search; deploying AI agents and automation pipelines (tender responses, reporting, recurring tasks) and leading AI adoption through training on LLMs, agentic workflows and automation.",
    now: true,
  },
];
