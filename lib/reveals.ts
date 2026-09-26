"use client";

import { gsap, ScrollTrigger } from "./gsap";
import { prefersReducedMotion } from "./motion";

/**
 * Scroll reveals, ported from the mockup. Call inside a useGSAP() so the
 * tweens and ScrollTriggers belong to the component's context and get reverted.
 * Elements are visible by default; the reveals only add motion.
 */
export function setupReveals(scope: HTMLElement) {
  if (prefersReducedMotion()) return;
  const q = gsap.utils.selector(scope);

  q<HTMLElement>('[data-reveal="fade"]').forEach((el) =>
    gsap.from(el, {
      y: 26,
      opacity: 0,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    }),
  );

  q<HTMLElement>('[data-reveal="rows"]').forEach((list) =>
    gsap.from(list.children, {
      opacity: 0,
      y: 14,
      duration: 0.7,
      stagger: 0.06,
      ease: "power3.out",
      scrollTrigger: { trigger: list, start: "top 86%", once: true },
    }),
  );

  q<HTMLElement>('[data-reveal="case"]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
    });
    const amount = el.querySelector(".amount");
    if (amount)
      gsap.from(amount, {
        y: 18,
        opacity: 0,
        duration: 1.1,
        delay: 0.15,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
  });

  q<HTMLElement>(".section-head").forEach((h) =>
    gsap.from(h, {
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 90%", once: true },
    }),
  );
}

/** Count-up metrics: `<span data-count="16000" data-prefix="~" data-suffix="+">` */
export function setupCounters(scope: HTMLElement) {
  const q = gsap.utils.selector(scope);
  q<HTMLElement>("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    const prefix = el.dataset.prefix ?? "";
    const suffix = el.dataset.suffix ?? "";
    const decimals = Number(el.dataset.decimals ?? 0);
    const render = (v: number) => {
      el.textContent =
        prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    };
    render(target);
    if (prefersReducedMotion()) return;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => gsap.to(o, { v: target, duration: 1.6, ease: "expo.out", onUpdate: () => render(o.v) }),
    });
  });
}
