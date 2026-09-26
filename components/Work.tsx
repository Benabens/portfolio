"use client";

import { useRef } from "react";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { setupCounters, setupReveals } from "@/lib/reveals";
import { caseStudies, workIntro } from "@/content";
import type { CaseStudy } from "@/content";

const Arrow = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 13 13 3M5 3h8v8" />
  </svg>
);

function Metric({ metric }: { metric: CaseStudy["metric"] }) {
  const c = metric.count;
  if (!c) return <span className="metric">{metric.value}</span>;
  return (
    <span className="metric">
      <span data-count={c.target} data-prefix={c.prefix} data-suffix={c.suffix} data-decimals={c.decimals}>
        {metric.value.replace(c.after ?? "", "")}
      </span>
      {c.after}
    </span>
  );
}

function Title({ study }: { study: CaseStudy }) {
  if (!study.titleParts) return <h3>{study.title}</h3>;
  const [a, b] = study.titleParts;
  return (
    <h3>
      {a} <span className="amp">&amp;</span> {b}
    </h3>
  );
}

/** The statement: one line item per project, the amount on the right. */
export default function Work() {
  const scope = useRef<HTMLElement>(null);

  useSectionMotion(scope, (el) => {
    setupReveals(el);
    setupCounters(el);
  });

  return (
    <section className="section" id="work" ref={scope} aria-labelledby="work-h">
      <div className="section-head">
        <p className="lbl">{workIntro.label}</p>
        <h2 id="work-h" data-reveal="fade">
          {workIntro.title}
          <em>{workIntro.titleEmphasis}</em>
          {workIntro.titleEnd}
        </h2>
        <p className="head-note">{workIntro.note}</p>
      </div>
      <ol className="ledger">
        {caseStudies.map((study) => (
          <li className="case" key={study.id} id={`case-${study.id}`} data-reveal="case">
            <span className="case-num">{study.number}</span>
            <div>
              <Title study={study} />
              <p className="stack">{study.stack}</p>
              <p>{study.summary}</p>
              <div className="case-foot">
                <ul className="tags">
                  {study.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {study.link && (
                  <a className="case-link" href={study.link.href} target="_blank" rel="noopener">
                    {study.link.label} <Arrow />
                  </a>
                )}
                {study.note && <span className="case-note">{study.note}</span>}
              </div>
            </div>
            <div className="amount">
              <Metric metric={study.metric} />
              <span className="metric-cap">{study.metric.caption}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
