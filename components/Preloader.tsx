"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useMotion } from "@/lib/motion";

const FLAT = "M0,0 L100,0 L100,0 Q50,0 0,0 Z";
const CURVED = "M0,0 L100,0 L100,0 Q50,20 0,0 Z";

/**
 * Counter 0 → 100 in Archivo, widening on the font's width axis, then the
 * curtain lifts with a curved edge and hands over to the hero.
 */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const { startIntro, lenis } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const finish = () => {
        document.documentElement.classList.remove("is-loading");
        lenis.current?.start();
        ScrollTrigger.refresh();
        startIntro();
        setDone(true);
      };

      if (prefersReducedMotion()) {
        finish();
        return;
      }

      document.documentElement.classList.add("is-loading");
      lenis.current?.stop();

      const num = el.querySelector<HTMLElement>(".pre-num");
      const fill = el.querySelector<HTMLElement>(".pre-bar i");
      const curtain = el.querySelector<SVGPathElement>("path");
      const counter = { v: 0 };

      const tl = gsap.timeline({ onComplete: finish });
      tl.to(counter, {
        v: 100,
        duration: 1.7,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num) num.textContent = String(Math.round(counter.v));
          if (fill) fill.style.width = counter.v + "%";
        },
      })
        .to(el, { "--wd": 125, duration: 1.7, ease: "power2.inOut" }, 0)
        .to(curtain, { attr: { d: CURVED }, duration: 0.45, ease: "power2.in" }, "+=0.15")
        .to(el, { yPercent: -114, duration: 1, ease: "power4.inOut" }, "<0.05")
        .to(curtain, { attr: { d: FLAT }, duration: 0.5, ease: "power2.out" }, "-=0.45")
        .add(() => startIntro(), "-=0.75");
    },
    { scope: ref },
  );

  if (done) return null;

  return (
    <div id="preloader" ref={ref} aria-hidden="true">
      <div className="pre-bar">
        <i />
      </div>
      <p className="lbl pre-lbl">Statement · loading</p>
      <div className="pre-num">0</div>
      <svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true">
        <path d={FLAT} />
      </svg>
    </div>
  );
}
