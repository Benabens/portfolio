"use client";

import type { RefObject } from "react";
import { useGSAP } from "./gsap";

type Setup = (el: HTMLElement) => void | (() => void);

/**
 * Runs a section's GSAP setup (reveals, counters, tickers) once the main
 * thread is idle, so hydration paints the page before ScrollTriggers measure
 * it. Everything created inside is recorded in the component's GSAP context
 * (contextSafe) and reverted on unmount.
 */
export function useSectionMotion<T extends HTMLElement>(scope: RefObject<T | null>, setup: Setup) {
  useGSAP(
    (_ctx, contextSafe) => {
      const el = scope.current;
      if (!el || !contextSafe) return;
      let cleanup: void | (() => void);
      const run = contextSafe(() => {
        cleanup = setup(el);
      });
      const idle = typeof window.requestIdleCallback === "function";
      const id = idle ? window.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 150);
      return () => {
        if (idle) window.cancelIdleCallback(id);
        else window.clearTimeout(id);
        cleanup?.();
      };
    },
    { scope },
  );
}
