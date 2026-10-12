"use client";

import { useRef, useState, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { setupReveals } from "@/lib/reveals";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { photoMeta } from "@/content/photos.generated";
import type { City } from "@/content";
import Pic from "./Pic";
import Lightbox, { type Slide } from "./Lightbox";

const count = (n: number) => `${n}\u00a0photo${n > 1 ? "s" : ""}`;

/** A city: its cover as a full-width band, the other photos in a row that opens under it. */
function Band({ city }: { city: City }) {
  // The row's photos are only mounted on first opening: nothing to download before.
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<number | null>(null);
  // Large versions fetched ahead (hover, focus, touch): the viewer opens on a sharp photo.
  const [warm, setWarm] = useState<string[]>([]);
  const warmed = useRef<Set<string>>(new Set());
  const heat = (stem: string) => setWarm((w) => (w.includes(stem) ? w : [...w, stem]));
  const warmImg = (stem: string) =>
    root.current?.querySelector<HTMLImageElement>(`.city-warm [data-stem="${stem}"] img`) ?? null;
  const openAt = (i: number) => {
    const stem = all[i];
    heat(stem);
    const t0 = performance.now();
    const wait = () => {
      const img = warmImg(stem);
      if ((img?.complete && img.naturalWidth) || warmed.current.has(stem) || performance.now() - t0 > 600) setView(i);
      else requestAnimationFrame(wait);
    };
    wait();
  };
  const root = useRef<HTMLLIElement>(null);
  const total = city.photos.length + 1;
  const altOf = (stem: string, i: number) => city.alts?.[stem] ?? `${city.name}, photo ${i + 1} of ${total}`;
  const all = [city.cover, ...city.photos];
  const slides: Slide[] = all.map((stem, i) => ({
    city: city.id,
    cityName: city.name,
    stem,
    alt: altOf(stem, i),
    caption: city.captions?.[stem] ?? city.name,
  }));
  // The thumbnail a slide grows from: its frame in the row (the cover is No. 01 there too).
  const origin = (i: number) =>
    root.current?.querySelector<HTMLImageElement>(`.strip li[data-stem="${slides[i]?.stem}"] img`) ??
    root.current?.querySelector<HTMLImageElement>(".city-img img") ??
    null;
  const where = [city.country !== city.name ? city.country : "", city.year].filter(Boolean).join(" · ");

  const toggle = () => {
    if (open || mounted) return setOpen(!open);
    setMounted(true);
    all.slice(0, 2).forEach(heat);
    // Two frames: the row mounts collapsed first, so its first opening is animated too.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  return (
    <li className={`city${open ? " is-open" : ""}${city.coverTone === "light" ? " is-light" : ""}`} id={`city-${city.id}`} ref={root}>
      <h3 className="city-head">
        <button
          type="button"
          className="city-cover"
          aria-expanded={open}
          aria-controls={`city-row-${city.id}`}
          onClick={toggle}
          data-cursor="view"
        >
          <span className="city-img">
            <Pic city={city.id} stem={city.cover} band alt="" sizes="100vw" style={{ objectPosition: city.coverFocus }} />
          </span>
          {/* One line per part of the name: the line count never changes while the width axis moves. */}
          <span className="city-name">
            {city.name.split(/(?<=–) /).map((line) => (
              <span key={line}>{line} </span>
            ))}
          </span>
          <span className="city-top">
            <span>{where}</span>
            <span>{count(total)}</span>
          </span>
        </button>
      </h3>
      <div
        className="city-row"
        id={`city-row-${city.id}`}
        onTransitionEnd={(e) => {
          // The page got taller or shorter: the triggers below have moved.
          if (e.target === e.currentTarget && e.propertyName === "grid-template-rows") ScrollTrigger.refresh();
        }}
      >
        <div className="city-row-in">
          {mounted && (
            <ul className="strip">
              {all.map((stem, i) => {
                const meta = photoMeta[stem];
                if (!meta) return null;
                const n = String(i + 1).padStart(2, "0");
                return (
                  <li key={stem} data-stem={stem} style={{ "--r": (meta.w / meta.h).toFixed(4) } as CSSProperties}>
                    {/* The link is the no-script fallback: with script, it opens the viewer in place. */}
                    <a
                      href={`/photos/${city.id}/${stem}-2400.jpg`}
                      data-cursor="view"
                      tabIndex={open ? undefined : -1}
                      onPointerEnter={() => heat(stem)}
                      onFocus={() => heat(stem)}
                      onTouchStart={() => heat(stem)}
                      onClick={(e) => {
                        e.preventDefault();
                        openAt(i);
                      }}
                    >
                      <Pic city={city.id} stem={stem} alt={altOf(stem, i)} sizes="(max-width: 700px) 60vw, 28rem" />
                      <span className="strip-n">No.&nbsp;{n}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      {warm.length > 0 && (
        <div className="city-warm lb-preload" aria-hidden="true">
          {warm.map((stem) => (
            <span data-stem={stem} key={stem}>
              <Pic city={city.id} stem={stem} alt="" sizes="100vw" eager onLoad={() => warmed.current.add(stem)} />
            </span>
          ))}
        </div>
      )}
      <Lightbox
        slides={slides}
        index={view}
        origin={origin}
        sharp={(i) => {
          const img = warmImg(slides[i]?.stem ?? "");
          return img?.complete && img.naturalWidth ? img.currentSrc : null;
        }}
        onIndex={setView}
        onClose={() => setView(null)}
      />
    </li>
  );
}

type Intro = { label: string; title: string; titleEmphasis: string; note: string };

/**
 * One band per city. The cover drifts a little against the scroll and the name
 * widens on Archivo's width axis, as the name does in the hero. The list comes
 * from the server (components/Photo.tsx): a hidden band never reaches the browser.
 */
export default function PhotoBands({ cities, intro }: { cities: City[]; intro: Intro }) {
  const scope = useRef<HTMLElement>(null);

  useSectionMotion(scope, (root) => {
    setupReveals(root);
    if (prefersReducedMotion()) return;
    gsap.utils.toArray<HTMLElement>(".city-cover", root).forEach((cover) => {
      gsap.fromTo(
        cover.querySelector(".city-img"),
        { yPercent: -5 },
        { yPercent: 5, ease: "none", scrollTrigger: { trigger: cover, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.fromTo(
        cover.querySelector(".city-name"),
        { "--wd": 64 },
        { "--wd": 120, ease: "none", scrollTrigger: { trigger: cover, start: "top 95%", end: "center 45%", scrub: true } },
      );
    });
  });

  return (
    <section className="section photo" id="photo" ref={scope} aria-labelledby="photo-h">
      <div className="section-head">
        <p className="lbl">{intro.label}</p>
        <h2 id="photo-h" data-reveal="fade">
          {intro.title}
          <em>{intro.titleEmphasis}</em>
        </h2>
        <p className="head-note">{intro.note}</p>
      </div>
      <ol className="cities">
        {cities.map((city) => (
          <Band city={city} key={city.id} />
        ))}
      </ol>
    </section>
  );
}
