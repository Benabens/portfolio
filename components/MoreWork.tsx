"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion, useMotion } from "@/lib/motion";
import { setupReveals } from "@/lib/reveals";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { moreIntro, sideProjects } from "@/content";
import type { SideProject } from "@/content";

/**
 * Compact list. On mouse devices a small card with the project's one figure
 * follows the pointer. The card lives inside the section (absolute, clipped),
 * and hides on any event that can move the list away from a still pointer:
 * scroll, leaving the list, the section leaving the viewport, blur, tab switch.
 */
export default function MoreWork() {
  const scope = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const px = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const py = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const shown = useRef(false);
  const { scrollTo } = useMotion();

  useSectionMotion(scope, setupReveals);

  const { contextSafe } = useGSAP(
    () => {
      const section = scope.current;
      const el = peek.current;
      if (!section || !el || !hasFinePointer() || prefersReducedMotion()) return;
      // One persistent tween per axis. The show/hide tweens below must use
      // overwrite:"auto" (conflicting properties only): overwrite:true would
      // kill these two and the card would stop following the pointer.
      px.current = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      py.current = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

      const hide = () => {
        if (!shown.current) return;
        shown.current = false;
        gsap.to(el, { opacity: 0, scale: 0.92, duration: 0.25, overwrite: "auto" });
      };
      window.addEventListener("scroll", hide, { passive: true });
      window.addEventListener("blur", hide);
      document.addEventListener("visibilitychange", hide);
      // Belt and braces: if the section itself leaves the viewport, the card goes.
      ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onLeave: hide, onLeaveBack: hide });
      return () => {
        window.removeEventListener("scroll", hide);
        window.removeEventListener("blur", hide);
        document.removeEventListener("visibilitychange", hide);
      };
    },
    { scope },
  );

  // The card's top-left corner sits 60px right of and below the pointer, in
  // section coordinates (the section clips it). Near the right or bottom edge
  // it flips to the other side so it is never cut off.
  const place = (e: PointerEvent) => {
    const section = scope.current;
    const el = peek.current;
    if (!section || !el) return;
    const r = section.getBoundingClientRect();
    const cx = e.clientX - r.left;
    const cy = e.clientY - r.top;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    px.current?.(cx + 60 + w > r.width ? Math.max(0, cx - 60 - w) : cx + 60);
    py.current?.(cy + 60 + h > r.height ? Math.max(0, cy - 60 - h) : cy + 60);
  };
  const show = contextSafe((e: PointerEvent, project: SideProject) => {
    const el = peek.current;
    if (!el || !px.current || e.pointerType !== "mouse") return;
    el.querySelector("b")!.textContent = project.peek.big;
    el.querySelector("span")!.textContent = project.peek.text;
    place(e);
    shown.current = true;
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: "expo.out", overwrite: "auto" });
  });
  const hide = contextSafe(() => {
    const el = peek.current;
    if (!el || !shown.current) return;
    shown.current = false;
    gsap.to(el, { opacity: 0, scale: 0.92, duration: 0.3, overwrite: "auto" });
  });

  const onClick = (e: MouseEvent<HTMLAnchorElement>, project: SideProject) => {
    if (project.external) return;
    e.preventDefault();
    hide();
    scrollTo(project.href);
  };

  return (
    <section className="section has-peek" id="more" ref={scope} aria-labelledby="more-h">
      <div className="section-head">
        <p className="lbl">{moreIntro.label}</p>
        <h2 id="more-h" data-reveal="fade">
          {moreIntro.title}
        </h2>
      </div>
      <ul className="list" data-reveal="rows" onPointerLeave={hide}>
        {sideProjects.map((p) => (
          <li
            className="row"
            key={p.id}
            onPointerEnter={(e) => show(e, p)}
            onPointerMove={(e) => e.pointerType === "mouse" && place(e)}
            onPointerLeave={hide}
            onPointerDown={hide}
          >
            <a
              href={p.href}
              target={p.external ? "_blank" : undefined}
              rel={p.external ? "noopener" : undefined}
              data-cursor="view"
              onClick={(e) => onClick(e, p)}
            >
              <span className="row-n">{p.number}</span>
              <span>
                <span className="row-t">{p.title}</span>
                <span className="row-d">{p.description}</span>
              </span>
              <span className="row-y">{p.context}</span>
            </a>
          </li>
        ))}
      </ul>
      <div id="peek" ref={peek} aria-hidden="true">
        <b />
        <span />
      </div>
    </section>
  );
}
