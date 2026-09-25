"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveals";
import { journey, journeyIntro } from "@/content";

export default function Journey() {
  const scope = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (scope.current) setupReveals(scope.current);
    },
    { scope },
  );

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
