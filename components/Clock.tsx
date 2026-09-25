"use client";

import { useEffect, useState } from "react";
import { site } from "@/content";

/** Local time in Lausanne. Renders the city alone on the server, then the time. */
export default function Clock({ prefix = `${site.city} · `, suffix = "" }: { prefix?: string; suffix?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: site.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 10000);
    return () => window.clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{time ? `${prefix}${time}${suffix}` : site.city}</span>;
}
