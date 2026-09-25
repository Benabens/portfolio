"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MotionProvider, prefersReducedMotion, useMotion } from "@/lib/motion";

/** Lenis smooth scroll driven by GSAP's ticker, wired to ScrollTrigger. */
function SmoothScroll() {
  const { lenis } = useMotion();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenis.current = instance;
    // The preloader locks scrolling until its curtain has lifted.
    if (document.documentElement.classList.contains("is-loading")) instance.stop();
    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      lenis.current = null;
    };
  }, [lenis]);

  useEffect(() => {
    // Trigger positions depend on fonts and images: refresh once they are in.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll />
      {children}
    </MotionProvider>
  );
}
