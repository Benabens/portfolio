"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, useMotion } from "@/lib/motion";
import { setupReveals } from "@/lib/reveals";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { photoIntro, photoRows } from "@/content";
import type { PhotoFrame } from "@/content";

function Frame({ frame }: { frame: PhotoFrame }) {
  return (
    <figure className={`frame ${frame.ratio}`}>
      <span className="frame-n">No. {frame.number}</span>
      {frame.src ? (
        <Image className="frame-img" src={frame.src} alt={frame.alt} fill sizes="400px" />
      ) : (
        <span className="frame-x" aria-hidden="true" />
      )}
      <figcaption>{frame.src ? frame.alt : photoIntro.placeholderCaption}</figcaption>
    </figure>
  );
}

/** Two contact-sheet rows drifting in opposite directions; speed follows the scroll velocity. */
export default function Photo() {
  const scope = useRef<HTMLElement>(null);
  const { lenis } = useMotion();

  useSectionMotion(scope, (root) => {
      setupReveals(root);
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.selector(root)<HTMLElement>(".marquee");
      const tickers = rows.map((m, i) => {
        const track = m.querySelector<HTMLElement>(".marquee-track")!;
        const dir = i % 2 === 0 ? -1 : 1;
        let x = 0;
        let half = track.scrollWidth / 2;
        let paused = false;
        const measure = () => {
          half = track.scrollWidth / 2;
        };
        const onEnter = () => (paused = true);
        const onLeave = () => (paused = false);
        m.addEventListener("pointerenter", onEnter);
        m.addEventListener("pointerleave", onLeave);
        window.addEventListener("resize", measure);
        const tick = () => {
          if (!half) return;
          const v = lenis.current ? Math.min(Math.abs(lenis.current.velocity), 60) : 0;
          x += dir * ((paused ? 0.12 : 0.5) + v * 0.04);
          if (x <= -half) x += half;
          if (x > 0) x -= half;
          track.style.transform = `translate3d(${x}px,0,0)`;
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          m.removeEventListener("pointerenter", onEnter);
          m.removeEventListener("pointerleave", onLeave);
          window.removeEventListener("resize", measure);
        };
      });
      return () => tickers.forEach((fn) => fn());
  });

  return (
    <section className="section photo" id="photo" ref={scope} aria-labelledby="photo-h">
      <div className="section-head">
        <p className="lbl">{photoIntro.label}</p>
        <h2 id="photo-h" data-reveal="fade">
          {photoIntro.title}
          <em>{photoIntro.titleEmphasis}</em>
        </h2>
      </div>
      {photoRows.map((row, i) => (
        <div className="marquee" key={i}>
          <div className="marquee-track">
            {row.map((frame) => (
              <Frame frame={frame} key={frame.number} />
            ))}
            {/* duplicate for the seamless loop; hidden from assistive tech */}
            <span className="marquee-dup" aria-hidden="true">
              {row.map((frame) => (
                <Frame frame={frame} key={`dup-${frame.number}`} />
              ))}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
