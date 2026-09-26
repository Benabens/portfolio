"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { hasFinePointer, prefersReducedMotion } from "@/lib/motion";

/**
 * Custom cursor and magnetic buttons, for mouse/trackpad visitors only.
 * Touch devices keep the native behaviour; reduced motion disables both.
 */
export default function Interactions() {
  const cursor = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cur = cursor.current;
    if (!cur || !hasFinePointer() || prefersReducedMotion()) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const label = cur.querySelector("span");
    const cx = gsap.quickTo(cur, "x", { duration: 0.3, ease: "power3" });
    const cy = gsap.quickTo(cur, "y", { duration: 0.3, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      root.classList.add("is-live");
      cx(e.clientX);
      cy(e.clientY);
    };
    const target = (e: Event) => (e.target as Element | null)?.closest?.("a, button") as HTMLElement | null;
    const onOver = (e: PointerEvent) => {
      const el = target(e);
      if (!el) return;
      cur.dataset.state = el.dataset.cursor || "link";
      if (label) label.textContent = el.dataset.cursor === "play" ? "Play" : "View";
    };
    const onOut = (e: PointerEvent) => {
      const el = target(e);
      if (!el) return;
      const to = e.relatedTarget as Node | null;
      if (to && el.contains(to)) return;
      cur.dataset.state = "";
    };
    // A scroll can move a link away from a still pointer without any
    // pointerout: reset hover states so nothing stays stuck.
    const rest: Array<() => void> = [];
    const reset = () => {
      cur.dataset.state = "";
      rest.forEach((fn) => fn());
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("scroll", reset, { passive: true });
    window.addEventListener("blur", reset);

    // Magnetic buttons: pulled toward the pointer, released with an expo ease.
    const cleanups = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]")).map((el) => {
      const x = gsap.quickTo(el, "x", { duration: 0.7, ease: "expo.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.7, ease: "expo.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - r.left - r.width / 2) * 0.3);
        y((e.clientY - r.top - r.height / 2) * 0.3);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      rest.push(leave);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("scroll", reset);
      window.removeEventListener("blur", reset);
      cleanups.forEach((fn) => fn());
      root.classList.remove("has-cursor", "is-live");
    };
  });

  return (
    <div id="cursor" ref={cursor} aria-hidden="true">
      <span>View</span>
    </div>
  );
}
