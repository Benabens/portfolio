"use client";

import { useRef, type MouseEvent, type PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion, useMotion } from "@/lib/motion";
import { setupReveals } from "@/lib/reveals";
import { moreIntro, sideProjects } from "@/content";
import type { SideProject } from "@/content";

/** Compact list; on desktop a small card with the project's one figure follows the pointer. */
export default function MoreWork() {
  const scope = useRef<HTMLElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const px = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const py = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const { scrollTo } = useMotion();

  const { contextSafe } = useGSAP(
    () => {
      if (!scope.current) return;
      setupReveals(scope.current);
      if (peek.current && hasFinePointer() && !prefersReducedMotion()) {
        px.current = gsap.quickTo(peek.current, "x", { duration: 0.5, ease: "power3" });
        py.current = gsap.quickTo(peek.current, "y", { duration: 0.5, ease: "power3" });
      }
    },
    { scope },
  );

  const show = contextSafe((project: SideProject) => {
    const el = peek.current;
    if (!el || !px.current) return;
    el.querySelector("b")!.textContent = project.peek.big;
    el.querySelector("span")!.textContent = project.peek.text;
    gsap.to(el, { opacity: 1, scale: 1, duration: 0.4, ease: "expo.out" });
  });
  const move = (e: PointerEvent) => {
    px.current?.(e.clientX + 60);
    py.current?.(e.clientY + 60);
  };
  const hide = contextSafe(() => {
    if (!peek.current || !px.current) return;
    gsap.to(peek.current, { opacity: 0, scale: 0.92, duration: 0.3 });
  });

  const onClick = (e: MouseEvent<HTMLAnchorElement>, project: SideProject) => {
    if (project.external) return;
    e.preventDefault();
    scrollTo(project.href);
  };

  return (
    <section className="section" id="more" ref={scope} aria-labelledby="more-h">
      <div className="section-head">
        <p className="lbl">{moreIntro.label}</p>
        <h2 id="more-h" data-reveal="fade">
          {moreIntro.title}
        </h2>
      </div>
      <ul className="list" data-reveal="rows">
        {sideProjects.map((p) => (
          <li className="row" key={p.id} onPointerEnter={() => show(p)} onPointerMove={move} onPointerLeave={hide}>
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
