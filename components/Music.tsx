"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { setupReveals } from "@/lib/reveals";
import { useSectionMotion } from "@/lib/useSectionMotion";
import { mmss } from "@/lib/format";
import { musicIntro, tracks } from "@/content";

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
 * The transport. Reads `src` from content/music.ts; while a track has no file
 * it shows "[ preview coming ]" instead of pretending to play.
 */
export default function Music() {
  const scope = useRef<HTMLElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const playBtn = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [note, setNote] = useState("");
  const track = tracks[index];

  useSectionMotion(scope, setupReveals);
  const { contextSafe } = useGSAP(() => {}, { scope });

  const pulse = contextSafe(() => {
    if (playBtn.current) gsap.fromTo(playBtn.current, { scale: 0.92 }, { scale: 1, duration: 0.6, ease: "expo.out" });
  });

  const stop = () => {
    audio.current?.pause();
    setPlaying(false);
  };

  const toggle = async () => {
    const a = audio.current;
    if (!track.src || !a) {
      setNote(musicIntro.missingNote);
      pulse();
      return;
    }
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
        setNote("");
      } catch {
        setNote(musicIntro.errorNote);
      }
    } else stop();
  };

  const select = (i: number) => {
    if (i !== index) {
      stop();
      setIndex(i);
      setTime(0);
      setNote("");
      // Let React swap the <audio src> before trying to play.
      window.setTimeout(() => void toggleFor(i), 0);
    } else void toggle();
  };
  const toggleFor = async (i: number) => {
    const t = tracks[i];
    const a = audio.current;
    if (!t.src || !a) {
      setNote(musicIntro.missingNote);
      pulse();
      return;
    }
    try {
      await a.play();
      setPlaying(true);
    } catch {
      setNote(musicIntro.errorNote);
    }
  };

  const progress = track.src && audio.current?.duration ? (time / audio.current.duration) * 100 : 0;

  return (
    <section className="section music" id="music" ref={scope} aria-labelledby="music-h">
      <div className="section-head">
        <p className="lbl">{musicIntro.label}</p>
        <h2 id="music-h" data-reveal="fade">
          {musicIntro.title}
          <em>{musicIntro.titleEmphasis}</em>
        </h2>
      </div>
      <div className="transport" data-reveal="fade">
        <button
          className={playing ? "play is-playing" : "play"}
          ref={playBtn}
          onClick={() => void toggle()}
          aria-label={playing ? "Pause" : `Play ${track.title}`}
          data-magnetic
          data-cursor="play"
        >
          <PlayIcon />
          <PauseIcon />
        </button>
        <div>
          <p className="now-lbl">{musicIntro.nowLabel}</p>
          <p id="now-title">{track.title}</p>
          <p className="now-sub">{track.subtitle}</p>
          <div className="bar">
            <div className="bar-track" aria-hidden="true">
              <div className="bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="bar-times">
              <span>{mmss(time)}</span>
              <span>{mmss(track.duration)}</span>
            </div>
          </div>
          <p className="deck-note" aria-live="polite">
            {note}
          </p>
        </div>
      </div>
      <ol className="tracks">
        {tracks.map((t, i) => (
          <li className={i === index ? "track is-active" : "track"} key={t.id}>
            <button onClick={() => select(i)}>
              <span className="tr-n">{t.number}</span>
              <span>
                <span className="tr-t">{t.title}</span>
                <span className="tr-s">{t.subtitle}</span>
              </span>
              <span className="tr-d">{mmss(t.duration)}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="deck-ctx">{musicIntro.context}</p>
      <audio
        ref={audio}
        preload="none"
        src={track.src ?? undefined}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onError={() => {
          if (track.src) {
            setNote(musicIntro.errorNote);
            setPlaying(false);
          }
        }}
      />
    </section>
  );
}
