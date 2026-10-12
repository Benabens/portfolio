"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useMotion } from "@/lib/motion";
import { Mascot } from "page-mascot";
import { profile } from "@/content";

/**
 * The name is set in Archivo and printed on its width axis: it enters
 * condensed (wdth 62), widens to 125 as the curtain lifts, then compresses
 * again as it scrolls out.
 */
export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const { intro } = useMotion();
  // The ink head is mounted only for mouse/trackpad visitors on a wide enough
  // viewport: Chrome fetches its two sprite sheets (≈230 KB) even inside a
  // display:none subtree, and a phone has neither a pointer to follow nor the
  // room beside the name. Client-only by construction, so no hydration mismatch.
  const [mascot, setMascot] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 821px)");
    const sync = () => setMascot(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useGSAP(
    () => {
      const h1 = name.current;
      if (!intro || !h1) return;
      if (prefersReducedMotion()) {
        h1.style.setProperty("--wd", "125");
        return;
      }
      const q = gsap.utils.selector(scope);
      const secondLine = q<HTMLElement>(".line:nth-child(2) .line-in");
      const scrollKinetics = () => {
        const st = { trigger: scope.current, start: "top top", end: "bottom top", scrub: true } as const;
        gsap.fromTo(h1, { "--wd": 125, "--wt": 800 }, { "--wd": 62, "--wt": 300, ease: "none", immediateRender: false, scrollTrigger: st });
        gsap.fromTo(secondLine, { x: 0 }, { x: -40, ease: "none", immediateRender: false, scrollTrigger: st });
      };
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: scrollKinetics });
      // Transforms only: the statement (mobile LCP element) is never faded out,
      // and the stamp is never caught half-transparent by contrast audits.
      tl.from(q(".line-in"), { yPercent: 105, duration: 1.1, stagger: 0.12 })
        .to(h1, { "--wd": 125, duration: 1.4, ease: "power3.inOut" }, "-=0.7")
        .from(q(".hero-top"), { y: -10, duration: 0.8 }, "-=1.2")
        .from(q(".hero-grid"), { y: 24, duration: 0.9 }, "-=1")
        .from(q(".stamp"), { scale: 1.6, rotate: -14, duration: 0.5, ease: "power4.out" }, "-=0.4");
      // The ink head pops up from its feet as the name reaches full width (1.25 s in,
      // inside the 1.92 s the name takes, so the scroll kinetics start no later).
      // Not from nothing: it fades while it grows, with a small overshoot. Opacity is
      // fine here, it is an image, never the LCP element nor a contrast target.
      const slot = q(".mascot-slot");
      if (slot.length) tl.from(slot, { scale: 0.7, opacity: 0, duration: 0.5, ease: "back.out(1.4)" }, 1.25);
    },
    { scope, dependencies: [intro] },
  );

  const letters = (word: string) => (
    <span className="line">
      <span className="line-in">{word}</span>
    </span>
  );

  return (
    <section className="hero" id="hero" ref={scope} aria-label="Intro">
      <div className="hero-top">
        <span>{profile.heroTopLeft}</span>
        <span>{profile.heroTopRight}</span>
        {/* The author, in ink: a 3×3 sprite head (page-mascot, drawn in characters/ben)
            that follows the pointer and reacts to a click. Hung from the top rule at the
            right, level with the first line of the name; the wrapper carries the
            position and the size because the component sets its own inline styles. */}
        {mascot && (
          <span className="mascot-slot">
            <Mascot
              directions="/mascots/ben-directions.webp"
              reactions="/mascots/ben-reactions.webp"
              size={112}
              label="Benjamin mascot"
            />
          </span>
        )}
      </div>
      <h1 className="hero-name" ref={name} aria-label={`${profile.firstName} ${profile.lastName}`}>
        {letters(profile.firstName)}
        {letters(profile.lastName)}
      </h1>
      {/* Three areas. On a phone: statement, facts, then the portrait, which starts below
          the fold so that the statement is the largest paint again (the image is
          lazy: it never competes with the fonts). From 821px up: portrait on the
          left, statement and facts beside it. */}
      <div className="hero-grid">
        <p className="hero-statement">
          {profile.statement}
          <em>{profile.statementEmphasis}</em>
        </p>
        <figure className="portrait">
          <span className="portrait-frame">
            <Image
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={profile.photo.width}
              height={profile.photo.height}
              sizes="(max-width: 820px) 92vw, 24rem"
            />
          </span>
          <span className="stamp">{profile.stamp}</span>
          <figcaption>{profile.photo.caption}</figcaption>
        </figure>
        <ul className="meta" data-reveal="rows">
          {profile.facts.map((f) => (
            <li key={f.label}>
              <span>{f.label}</span>
              <b>{f.value}</b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
