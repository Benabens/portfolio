"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { rechorTrip as trip } from "@/content/rechor-trip";

/** Minutes since midnight of "HH:MM". */
const mins = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
const hhmm = (m: number) => {
  const r = Math.max(0, Math.round(m));
  return `${String(Math.floor(r / 60)).padStart(2, "0")}:${String(r % 60).padStart(2, "0")}`;
};

type Key = { t: number; x: number; y: number; d: number; leg: number };
type Mark = { name: string; x: number; y: number; t: number; time: string; label: boolean; change: boolean };

/** Run length of the replay, start of the day to arrival. */
const DURATION = 11000;

/**
 * A real ReCHor journey replayed on the map: the train runs between stops at the
 * timetable's pace, the clock follows, each stop lights up as it is reached.
 */
export default function JourneyMap({ alt }: { alt: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(() => mins(trip.dep));
  const [running, setRunning] = useState(false);
  const raf = useRef(0);
  const started = useRef(false);

  // Keyframes (time → position along the route) and the stops to draw.
  const { keys, total, marks, path, t0, t1, legs } = useMemo(() => {
    const keys: Key[] = [];
    const marks: Mark[] = [];
    let d = 0;
    let prev: { x: number; y: number } | null = null;
    const push = (t: number, x: number, y: number, leg: number) => {
      if (prev) d += Math.hypot(x - prev.x, y - prev.y);
      keys.push({ t, x, y, d, leg });
      prev = { x, y };
    };
    const trains = trip.legs.filter((l) => l.kind === "train");
    const lastTrain = trains[trains.length - 1];
    trip.legs.forEach((leg, li) => {
      leg.stops.forEach((s, si) => {
        if (s.arr) push(mins(s.arr), s.x, s.y, li);
        if (s.dep) push(mins(s.dep), s.x, s.y, li);
        if (leg.kind !== "train") return;
        const first = si === 0;
        const last = si === leg.stops.length - 1;
        if (marks.some((m) => m.name === s.name)) return;
        const isEnd = (li === 0 && first) || (leg === lastTrain && last);
        const change = !isEnd && (first || last);
        marks.push({
          name: s.name.replace("/Freiburg", ""),
          x: s.x,
          y: s.y,
          t: mins((s.arr ?? s.dep) as string),
          time: (s.dep ?? s.arr) as string,
          label: isEnd || change || ["Lausanne", "Bern"].includes(s.name),
          change,
        });
      });
    });
    const pts = keys.filter((k, i) => i === 0 || k.x !== keys[i - 1].x || k.y !== keys[i - 1].y);
    const path = pts.map((k, i) => `${i ? "L" : "M"}${k.x} ${k.y}`).join("");
    return {
      keys,
      total: d,
      marks,
      path,
      t0: mins(trip.dep),
      t1: mins(trip.arr),
      legs: trains.map((l) => ({
        route: l.route as string,
        destination: l.destination as string,
        from: l.stops[0].name,
        to: l.stops[l.stops.length - 1].name,
        dep: l.stops[0].dep as string,
        arr: l.stops[l.stops.length - 1].arr as string,
        t0: mins(l.stops[0].dep as string),
        t1: mins(l.stops[l.stops.length - 1].arr as string),
      })),
    };
  }, []);

  // Where the train is at time `t`.
  const at = (time: number) => {
    let i = 0;
    while (i < keys.length - 1 && keys[i + 1].t <= time) i++;
    const a = keys[i];
    const b = keys[Math.min(i + 1, keys.length - 1)];
    const span = b.t - a.t;
    const f = span > 0 ? Math.min(1, Math.max(0, (time - a.t) / span)) : 0;
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, d: a.d + (b.d - a.d) * f };
  };

  const play = () => {
    cancelAnimationFrame(raf.current);
    if (prefersReducedMotion()) {
      setT(t1);
      return;
    }
    setRunning(true);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // Ease the whole run a little at both ends, not each leg.
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setT(t0 + (t1 - t0) * e);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setT(t1);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          play();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = at(t);
  const active = legs.findIndex((l) => t >= l.t0 && t < l.t1 + 0.01);
  const [, , W, H] = trip.viewBox;

  return (
    <div className="jm" ref={root}>
      <div className="jm-map">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt}>
          <path className="jm-land" d={trip.country} />
          <path className="jm-lake" d={trip.lakes} />
          <path className="jm-route-bg" d={path} />
          <path className="jm-route" d={path} style={{ strokeDasharray: total, strokeDashoffset: total - pos.d }} />
          {marks.map((m) => {
            const on = t >= m.t - 0.01;
            const dx = m.x > W * 0.7 ? -12 : 12;
            return (
              <g key={m.name} className={`jm-stop${on ? " is-on" : ""}${m.change ? " is-change" : ""}`}>
                <circle cx={m.x} cy={m.y} r={m.label ? 5.5 : 3.5} />
                {m.label && (
                  <text x={m.x + dx} y={m.y - 10} textAnchor={dx < 0 ? "end" : "start"}>
                    <tspan className="jm-name">{m.name}</tspan>
                    <tspan className="jm-time" dx="8">
                      {m.time}
                    </tspan>
                  </text>
                )}
              </g>
            );
          })}
          <circle className="jm-pulse" cx={pos.x} cy={pos.y} r="14" />
          <circle className="jm-train" cx={pos.x} cy={pos.y} r="7" />
        </svg>
        <div className="jm-hud" aria-hidden="true">
          <span className="jm-clock">{hhmm(t)}</span>
          <span className="jm-now">{active >= 0 ? `${legs[active].route} → ${legs[active].destination}` : t >= t1 ? "Arrived, St. Moritz" : "Change"}</span>
        </div>
        <div className="jm-stat" aria-hidden="true">
          {trip.routingMs}&nbsp;ms to route the day · {trip.journeysThatDay} Pareto-optimal journeys
        </div>
      </div>
      <ol className="jm-legs">
        {legs.map((l, i) => (
          <li key={l.route} className={i === active ? "is-active" : t >= l.t1 ? "is-done" : ""}>
            <span className="jm-route-name">{l.route}</span>
            <span className="jm-leg-span">
              {l.dep} {l.from} → {l.arr} {l.to}
            </span>
          </li>
        ))}
        <li className="jm-replay">
          <button type="button" className="fig-ctl" onClick={play} disabled={running}>
            Replay
          </button>
        </li>
      </ol>
    </div>
  );
}
