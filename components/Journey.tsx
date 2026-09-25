"use client";

import { useRef } from "react";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { setupReveals } from "@/lib/reveals";
import { journey, journeyIntro } from "@/content";

export default function Journey() {
  const scope = useRef<HTMLElement>(null);
  useSectionMotion(scope, setupReveals);

  return (
    <section className="section" id="journey" ref={scope} aria-labelledby="journey-h">
      <div className="section-head">
        <p className="lbl">{journeyIntro.label}</p>
        <h2 id="journey-h" data-reveal="fade">
          {journeyIntro.title}
          <em>{journeyIntro.titleEmphasis}</em>
        </h2>
      </div>
      <ol className="steps" data-reveal="rows">
        {journey.map((step) => (
          <li className={step.now ? "step is-now" : "step"} key={step.number}>
            <span className="step-n">{step.number}</span>
            <span className="step-when">{step.when}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
