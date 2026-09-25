"use client";

import type { MouseEvent } from "react";
import { nav, site } from "@/content";
import { useMotion } from "@/lib/motion";
import Clock from "./Clock";

export default function Nav() {
  const { scrollTo } = useMotion();

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    scrollTo(href, href === "#top" ? 0 : -60);
  };

  return (
    <header className="nav">
      <a className="nav-name" href="#top" onClick={(e) => go(e, "#top")}>
        {site.name}
      </a>
      <nav className="nav-links" aria-label="Sections">
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={(e) => go(e, item.href)}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="nav-meta">
        <Clock />
      </div>
    </header>
  );
}
