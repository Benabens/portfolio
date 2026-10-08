"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveals";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { mmss } from "@/lib/format";
import { featuredTrack as t, musicIntro } from "@/content";

const PlayIcon = () => (
  <svg className="ico-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 4l14 8-14 8z" />
  </svg>
);
const PauseIcon = () => (
  <svg className="ico-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);

/**
 * One original production, played as an excerpt over its own waveform:
 * the build-up on the left, the drop marked at its exact bar, click to seek.
 */
export default function Music() {
  const scope = useRef<HTMLElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const playBtn = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [note, setNote] = useState("");

  useSectionMotion(scope, setupReveals);
  const { contextSafe } = useGSAP(() => {}, { scope });

  const pulse = contextSafe(() => {
    if (playBtn.current) gsap.fromTo(playBtn.current, { scale: 0.92 }, { scale: 1, duration: 0.6, ease: "expo.out" });
  });

  const play = async () => {
    const a = audio.current;
    if (!a) return;
    try {
      await a.play();
      setPlaying(true);
      setNote("");
    } catch {
      setNote(musicIntro.errorNote);
    }
  };
  const toggle = () => {
    pulse();
    if (audio.current && !audio.current.paused) {
      audio.current.pause();
      setPlaying(false);
    } else void play();
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audio.current;
    if (!a) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * t.duration;
    setTime(a.currentTime);
    if (a.paused) void play();
  };

  const played = time / t.duration;
  const dropPct = (t.dropAt / t.duration) * 100;

  return (
    <section className="section music" id="music" ref={scope} aria-labelledby="music-h">
      <div className="section-head">
        <p className="lbl">{musicIntro.label}</p>
        <h2 id="music-h" data-reveal="fade">
          {musicIntro.title}
          <em>{musicIntro.titleEmphasis}</em>
        </h2>
      </div>

      <div className="feat" data-reveal="fade">
        <div className="feat-head">
          <button
            className={playing ? "play is-playing" : "play"}
            ref={playBtn}
            onClick={toggle}
            aria-label={playing ? "Pause" : `Play an excerpt of ${t.title}`}
            data-magnetic
            data-cursor="play"
          >
            <PlayIcon />
            <PauseIcon />
          </button>
          <div className="feat-id">
            <p className="now-lbl">{t.tag}</p>
            <p className="feat-title">{t.title}</p>
            <ul className="feat-facts">
              {t.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="wave-wrap">
          <div
            className="wave"
            onClick={seek}
            role="slider"
            tabIndex={0}
            aria-label="Position in the excerpt"
            aria-valuemin={0}
            aria-valuemax={t.duration}
            aria-valuenow={Math.round(time)}
            aria-valuetext={mmss(time)}
            onKeyDown={(e) => {
              const a = audio.current;
              if (!a) return;
              if (e.key === "ArrowRight") a.currentTime = Math.min(t.duration, a.currentTime + 4);
              if (e.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 4);
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                toggle();
              }
            }}
          >
            {t.peaks.map((p, i) => (
              <span
                key={i}
                className={(i + 0.5) / t.peaks.length <= played ? "w-bar is-played" : "w-bar"}
                style={{ height: `${Math.max(6, p * 100)}%` }}
              />
            ))}
            <span className="w-drop" style={{ left: `${dropPct}%` }} aria-hidden="true">
              <span>Drop</span>
            </span>
          </div>
          <div className="wave-legend">
            <span>Build-up</span>
            <span className="tab">
              {mmss(time)} / {mmss(t.duration)}
            </span>
          </div>
        </div>

        <p className="feat-note">{t.excerptNote}</p>
        <p className="deck-note" aria-live="polite">
          {note}
        </p>
      </div>

      <p className="deck-ctx">{musicIntro.context}</p>
      <audio
        ref={audio}
        preload="metadata"
        src={t.src}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onError={() => {
          setNote(musicIntro.errorNote);
          setPlaying(false);
        }}
      />
    </section>
  );
}
