"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveals";
import { contactIntro, site } from "@/content";
import Clock from "./Clock";

export default function Contact() {
  const scope = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (scope.current) setupReveals(scope.current);
    },
    { scope },
  );

  return (
    <section className="section contact" id="contact" ref={scope} aria-labelledby="contact-h">
      <div>
        <p className="lbl">{contactIntro.label}</p>
        <h2 className="contact-h" id="contact-h" data-reveal="fade">
          {contactIntro.title}
          <em>{contactIntro.titleEmphasis}</em>
        </h2>
        <a className="contact-mail" href={`mailto:${site.email}`} data-magnetic>
          {site.email}
        </a>
        <div className="contact-actions">
          <a className="btn btn-fill" href={site.cvPdf} download data-magnetic>
            CV · PDF{" "}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M8 2v9M4 7l4 4 4-4M3 13h10" />
            </svg>
          </a>
          <a className="btn" href={site.github} target="_blank" rel="noopener" data-magnetic>
            GitHub
          </a>
          <a className="btn" href={site.linkedin} target="_blank" rel="noopener" data-magnetic>
            LinkedIn
          </a>
        </div>
      </div>
      <footer className="foot">
        <span>
          {site.name} · {site.city}, Switzerland
        </span>
        <Clock prefix="Local time " suffix=" (CET)" />
        <span>
          {site.fonts} · © {site.year}
        </span>
      </footer>
    </section>
  );
}
