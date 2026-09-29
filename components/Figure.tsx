"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import type { CaseMedia } from "@/content";

type Clip = Extract<CaseMedia, { kind: "video" }>;
type Matrix = Extract<CaseMedia, { kind: "matrix" }>;

/** Share of the row above which a cell is dark enough for white figures (4.5:1 both sides). */
const DARK = 0.64;

function Matrices({ media }: { media: Matrix }) {
  const [markRow, markCol] = media.mark;
  return (
    <div className="mx" role="group" aria-label={media.alt}>
      {media.panels.map((panel) => (
        <table className="mx-t" key={panel.title}>
          <caption>{panel.title}</caption>
          <thead>
            <tr>
              <td />
              {media.classes.map((c) => (
                <th scope="col" key={c}>
                  {c}
                </th>
              ))}
              <th scope="col" className="mx-r">
                Recall
              </th>
            </tr>
          </thead>
          <tbody>
            {panel.rows.map((row, i) => {
              const total = row.reduce((a, b) => a + b, 0);
              return (
                <tr key={media.classes[i]}>
                  <th scope="row">{media.classes[i]}</th>
                  {row.map((v, j) => {
                    const share = total ? v / total : 0;
                    const cls = [share > DARK ? "on" : "", i === markRow && j === markCol ? "mark" : ""].join(" ").trim();
                    return (
                      <td
                        key={media.classes[j]}
                        className={cls || undefined}
                        style={{ ["--a" as string]: share.toFixed(3) }}
                        title={`${v} of ${total} ${media.classes[i]} samples predicted ${media.classes[j]}`}
                      >
                        {v}
                      </td>
                    );
                  })}
                  <td className="mx-r">{(total ? row[i] / total : 0).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ))}
      <p className="mx-note">{media.note}</p>
    </div>
  );
}

/** A muted loop that only runs while it is on screen. The visitor can hold it. */
function useClip() {
  const video = useRef<HTMLVideoElement>(null);
  const held = useRef(false);
  const seen = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    // Reduced motion: the poster stays until the visitor asks for the clip.
    held.current = prefersReducedMotion();
    const sync = () => {
      if (seen.current && !held.current && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        seen.current = entry.isIntersecting;
        sync();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    held.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return { video, playing, toggle };
}

function ClipFigure({ media }: { media: Clip }) {
  const { video, playing, toggle } = useClip();
  return (
    <>
      <div className="fig-frame">
        <video
          ref={video}
          className="fig-media"
          width={media.width}
          height={media.height}
          poster={media.poster}
          preload="none"
          muted
          loop
          playsInline
          aria-label={media.alt}
        >
          <source src={media.src} type="video/mp4" />
          {media.webm && <source src={media.webm} type="video/webm" />}
        </video>
      </div>
      <figcaption>
        <span className="fig-n">Fig.&nbsp;{media.figure}</span>
        <span className="fig-cap">{media.caption}</span>
        <button type="button" className="fig-ctl" onClick={toggle}>
          {playing ? "Pause" : "Play"}
        </button>
      </figcaption>
    </>
  );
}

/** An exhibit attached to a case study: thin frame, figure number, serif caption. */
export default function Figure({ media }: { media: CaseMedia }) {
  return (
    <figure className="fig" data-reveal="fade">
      {media.kind === "video" ? (
        <ClipFigure media={media} />
      ) : (
        <>
          <div className="fig-frame">
            {media.kind === "image" ? (
              <Image
                className="fig-media"
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                sizes="(max-width: 820px) 100vw, 44rem"
              />
            ) : (
              <Matrices media={media} />
            )}
          </div>
          <figcaption>
            <span className="fig-n">Fig.&nbsp;{media.figure}</span>
            <span className="fig-cap">{media.caption}</span>
          </figcaption>
        </>
      )}
    </figure>
  );
}
