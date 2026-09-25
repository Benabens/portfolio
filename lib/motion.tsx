"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type Lenis from "lenis";

/** True when the visitor asked for reduced motion. Safe to call in effects only. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True on mouse/trackpad devices, false on touch. Safe to call in effects only. */
export const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

type MotionContextValue = {
  /** Becomes true when the hero should play its entrance (preloader done, or reduced motion). */
  intro: boolean;
  startIntro: () => void;
  /** The Lenis instance, when smooth scroll is active. */
  lenis: RefObject<Lenis | null>;
  /** Scroll to an element or a `#hash`, smooth when possible. */
  scrollTo: (target: string | HTMLElement, offset?: number) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [intro, setIntro] = useState(false);
  const lenis = useRef<Lenis | null>(null);

  const startIntro = useCallback(() => setIntro(true), []);

  const scrollTo = useCallback((target: string | HTMLElement, offset = -60) => {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    if (lenis.current) lenis.current.scrollTo(el, { duration: 1.4, offset });
    else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    // Reduced motion: no preloader, so the hero is "in" right away.
    if (prefersReducedMotion()) setIntro(true);
  }, []);

  const value = useMemo(() => ({ intro, startIntro, lenis, scrollTo }), [intro, startIntro, scrollTo]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) throw new Error("useMotion must be used inside <MotionProvider>");
  return ctx;
}
