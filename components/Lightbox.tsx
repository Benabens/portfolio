"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, useMotion } from "@/lib/motion";
import { photoMeta } from "@/content/photos.generated";
import Pic from "./Pic";

export type Slide = {
  /** Folder under /photos/. */
  city: string;
  cityName: string;
  stem: string;
  alt: string;
};

type Props = {
  slides: Slide[];
  /** Open slide, null when the viewer is closed. */
  index: number | null;
  /** The thumbnail the viewer should grow from (and shrink back to). */
  origin: (i: number) => HTMLImageElement | null;
  onIndex: (i: number) => void;
  onClose: () => void;
};

/** Where a w×h image sits when contained in a box, as inline size and offsets. */
function contain(box: { width: number; height: number }, w: number, h: number) {
  const r = Math.min(box.width / w, box.height / h);
  const width = Math.round(w * r);
  const height = Math.round(h * r);
  return { width, height, left: (box.width - width) / 2, top: (box.height - height) / 2 };
}

/**
 * Full-screen viewer on ink, one per band. Native <dialog>: focus stays inside,
 * the page behind is inert, Escape closes. The thumbnail grows into place
 * (FLIP on transform only), then the 2400 version fades in over it.
 */
export default function Lightbox({ slides, index, origin, onIndex, onClose }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLImageElement>(null);
  const full = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const chrome = useRef<HTMLDivElement[]>([]);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opened = useRef<number | null>(null);
  const closing = useRef(false);
  const press = useRef<{ x: number; y: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { lenis } = useMotion();

  const open = index !== null;
  const slide = open ? slides[index] : null;
  const meta = slide ? photoMeta[slide.stem] : null;
  const total = slides.length;

  const box = () => {
    const s = stage.current;
    if (!s || !meta) return null;
    const r = s.getBoundingClientRect();
    return { rect: r, fit: contain(r, meta.w, meta.h) };
  };

  /** Shrinks back onto the thumbnail (or just fades), then really closes. */
  const close = useCallback(() => {
    const d = dialog.current;
    if (!d || !d.open || closing.current) return;
    closing.current = true;
    const i = opened.current ?? 0;
    const thumb = origin(i);
    const b = box();
    const done = () => {
      d.close();
      closing.current = false;
      onClose();
      // Focus goes back where the viewer came from.
      (thumb?.closest("a, button") as HTMLElement | null)?.focus({ preventScroll: true });
    };
    if (prefersReducedMotion() || !thumb || !b) {
      gsap.to([veil.current, full.current, ghost.current, ...chrome.current], { opacity: 0, duration: 0.2, onComplete: done });
      return;
    }
    const t = thumb.getBoundingClientRect();
    const g = ghost.current!;
    g.src = (full.current?.querySelector("img")?.currentSrc || thumb.currentSrc) ?? "";
    gsap.set(g, { opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 });
    gsap.to(full.current, { opacity: 0, duration: 0.15 });
    gsap.to([veil.current, ...chrome.current], { opacity: 0, duration: 0.35, ease: "power2.in" });
    gsap.to(g, {
      x: t.left - (b.rect.left + b.fit.left),
      y: t.top - (b.rect.top + b.fit.top),
      scaleX: t.width / b.fit.width,
      scaleY: t.height / b.fit.height,
      duration: 0.45,
      ease: "expo.inOut",
      onComplete: done,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, origin, meta]);

  // Opening: show the dialog, pause the page, grow the thumbnail into place.
  useEffect(() => {
    const d = dialog.current;
    if (!d || !open || d.open) return;
    opened.current = index;
    setLoaded(false);
    d.showModal();
    closeBtn.current?.focus({ preventScroll: true });
    lenis.current?.stop();
    document.documentElement.classList.add("lb-open");
    const thumb = origin(index);
    const b = box();
    const g = ghost.current!;
    if (prefersReducedMotion() || !thumb || !b) {
      gsap.set(g, { opacity: 0 });
      gsap.fromTo([veil.current, ...chrome.current], { opacity: 0 }, { opacity: 1, duration: 0.25 });
      return;
    }
    const t = thumb.getBoundingClientRect();
    g.src = thumb.currentSrc || thumb.src;
    gsap.set(g, { opacity: 1 });
    gsap.fromTo(
      g,
      {
        x: t.left - (b.rect.left + b.fit.left),
        y: t.top - (b.rect.top + b.fit.top),
        scaleX: t.width / b.fit.width,
        scaleY: t.height / b.fit.height,
      },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.6, ease: "expo.out" },
    );
    gsap.fromTo(veil.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: "power2.out" });
    gsap.fromTo(chrome.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.25, ease: "power3.out" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Closed (by us or by the browser): resume the page.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClosed = () => {
      lenis.current?.start();
      document.documentElement.classList.remove("lb-open");
      opened.current = null;
    };
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    d.addEventListener("close", onClosed);
    d.addEventListener("cancel", onCancel);
    return () => {
      d.removeEventListener("close", onClosed);
      d.removeEventListener("cancel", onCancel);
    };
  }, [close, lenis]);

  // A new slide: the large version fades in once it is there; the ghost is retired.
  useEffect(() => {
    if (!open) return;
    opened.current = index;
    setLoaded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onLoaded = () => {
    setLoaded(true);
    gsap.fromTo(full.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out", onComplete: () => gsap.set(ghost.current, { opacity: 0 }) });
  };

  const go = (delta: number) => {
    if (!open || total < 2) return;
    onIndex((index + delta + total) % total);
  };

  const onKey = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "Home") onIndex(0);
    else if (e.key === "End") onIndex(total - 1);
    else return;
    e.preventDefault();
  };

  const onDown = (e: PointerEvent) => {
    press.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: PointerEvent) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  };

  const fit = meta && stage.current ? contain(stage.current.getBoundingClientRect(), meta.w, meta.h) : null;
  const n = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <dialog
      ref={dialog}
      className="lb"
      aria-label={slide ? `${slide.cityName}, photo viewer` : "Photo viewer"}
      onKeyDown={onKey}
      onClick={(e) => {
        // The ink around the photo closes it; the controls and the photo do not.
        if ((e.target as HTMLElement).closest(".lb-stage, .lb-bar")) return;
        close();
      }}
    >
      <div className="lb-veil" ref={veil} />
      <div className="lb-bar lb-top" ref={(el) => {
        if (el) chrome.current[0] = el;
      }}>
        <span className="lb-city">{slide?.cityName}</span>
        <span className="lb-count" aria-live="polite" aria-atomic="true">
          {open ? (
            <>
              No.&nbsp;{n(index)} <span aria-hidden="true">/</span> {n(total - 1)}
            </>
          ) : null}
        </span>
      </div>
      <div className="lb-stage" ref={stage} onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (press.current = null)}>
        {/* The copy of the thumbnail that travels; the large version lands on top of it. */}
        <img className="lb-ghost" ref={ghost} alt="" aria-hidden="true" style={fit ? { width: fit.width, height: fit.height } : undefined} />
        {slide && fit && (
          <div className={`lb-full${loaded ? " is-loaded" : ""}`} ref={full} style={{ width: fit.width, height: fit.height }} key={slide.stem}>
            <Pic city={slide.city} stem={slide.stem} alt={slide.alt} sizes="100vw" eager onLoad={onLoaded} />
          </div>
        )}
      </div>
      <div className="lb-bar lb-bottom" ref={(el) => {
        if (el) chrome.current[1] = el;
      }}>
        <p className="lb-cap">{slide?.alt}</p>
        <div className="lb-ctl">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo">
            Prev
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo">
            Next
          </button>
          <button type="button" onClick={close} aria-label="Close the viewer" ref={closeBtn}>
            Close
          </button>
        </div>
      </div>
      {/* Neighbours load now, so that the next photo is already there. */}
      {open && total > 1 && (
        <div className="lb-preload" aria-hidden="true">
          {[index + 1, index - 1].map((j) => {
            const k = (j + total) % total;
            const s = slides[k];
            return <Pic key={s.stem} city={s.city} stem={s.stem} alt="" sizes="100vw" eager />;
          })}
        </div>
      )}
    </dialog>
  );
}
