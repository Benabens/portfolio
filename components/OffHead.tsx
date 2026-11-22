"use client";

import { useRef, type MouseEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useMotion } from "@/lib/motion";
import { offHours } from "@/content";

const Down = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" />
  </svg>
);

/**
 * Head of the off-hours page, set like the hero: the top rule, the title on
 * Archivo's width axis, a statement and the page's two entries. The entrance is
 * CSS (it plays at first paint, with no preloader to hide a flash before
 * hydration); once in, the title compresses as it scrolls out, as the name does.
 */
export default function OffHead() {
  const scope = useRef<HTMLElement>(null);
  const { scrollTo } = useMotion();

  useGSAP(
    () => {
      const el = scope.current;
      if (!el || prefersReducedMotion()) return;
      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true } as const;
      gsap.fromTo(".off-name", { "--wd": 125, "--wt": 800 }, { "--wd": 62, "--wt": 300, ease: "none", immediateRender: false, scrollTrigger: st });
      gsap.fromTo(".off-name .line:nth-child(2) .line-in", { x: 0 }, { x: -40, ease: "none", immediateRender: false, scrollTrigger: st });
    },
    { scope },
  );

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <section className="hero off-hero" ref={scope} aria-labelledby="off-h">
      <div className="hero-top">
        <span>{offHours.topLeft}</span>
        <span>{offHours.topRight}</span>
      </div>
      <h1 className="hero-name off-name" id="off-h" aria-label={offHours.label}>
        {offHours.name.map((word) => (
          <span className="line" key={word}>
            <span className="line-in">{word}</span>
          </span>
        ))}
      </h1>
      <div className="off-grid">
        <p className="hero-statement">
          {offHours.statement}
          <em>{offHours.statementEmphasis}</em>
        </p>
        <ol className="off-index">
          {offHours.index.map((entry) => (
            <li key={entry.href}>
              <a href={entry.href} onClick={(e) => go(e, entry.href)} aria-label={`${entry.label}: ${entry.text}`}>
                <span className="off-n">{entry.n}</span>
                <span className="off-ix">
                  <b>{entry.label}</b>
                  <span>{entry.text}</span>
                </span>
                <Down />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
