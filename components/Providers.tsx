"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
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

/**
 * Page changes, with Lenis in charge of the scroll: a new page starts at its top, or
 * at its #section when the link carried one (Work, Journey, Contact from another page).
 * The old #photo and #music anchors of the home page now live on the off-hours page.
 */
function RouteSync() {
  const pathname = usePathname();
  const { lenis } = useMotion();
  const first = useRef(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (pathname === "/" && (hash === "#photo" || hash === "#music")) {
      window.location.replace(`/off-hours${hash}`);
      return;
    }
    if (first.current) {
      // Hard load: the browser has already handled the hash.
      first.current = false;
      return;
    }
    lenis.current?.resize();
    ScrollTrigger.refresh();
    if (hash.length > 1) {
      // Land where the same link lands on the home page itself (Nav: 60 px under the
      // top), once the new page's sections have measured themselves.
      requestAnimationFrame(() => {
        const el = document.querySelector<HTMLElement>(hash);
        if (el) lenis.current?.scrollTo(el, { offset: -60, immediate: true, force: true });
      });
    } else {
      lenis.current?.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <SmoothScroll />
      <RouteSync />
      {children}
    </MotionProvider>
  );
}
