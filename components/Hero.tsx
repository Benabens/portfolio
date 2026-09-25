"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useMotion } from "@/lib/motion";
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
      </div>
      <h1 className="hero-name" ref={name} aria-label={`${profile.firstName} ${profile.lastName}`}>
        {letters(profile.firstName)}
        {letters(profile.lastName)}
      </h1>
      <div className="hero-grid">
        <p className="hero-statement">
          {profile.statement}
          <em>{profile.statementEmphasis}</em>
        </p>
        <div className="meta-wrap">
          <Image
            className="id-photo"
            src={profile.photo.src}
            alt={profile.photo.alt}
            width={profile.photo.width}
            height={profile.photo.height}
            sizes="104px"
            priority
          />
          <span className="stamp">{profile.stamp}</span>
          <ul className="meta" data-reveal="rows">
            {profile.facts.map((f) => (
              <li key={f.label}>
                <span>{f.label}</span>
                <b>{f.value}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
