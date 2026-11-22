"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, offHours, site } from "@/content";
import { useMotion } from "@/lib/motion";
import Clock from "./Clock";

export default function Nav() {
  const { scrollTo } = useMotion();
  const pathname = usePathname();
  const home = pathname === "/";

  // On the home page a section link scrolls (Lenis); from another page it navigates
  // home and RouteSync scrolls to the section once the page is there.
  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = href.slice(href.indexOf("#"));
    if (!home || !hash.startsWith("#")) return;
    e.preventDefault();
    scrollTo(hash, hash === "#top" ? 0 : -60);
  };

  return (
    <header className="nav">
      <Link className="nav-name" href="/#top" onClick={(e) => go(e, "/#top")}>
        {site.name}
      </Link>
      <nav className="nav-links" aria-label="Sections">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={(e) => go(e, item.href)}>
            {item.label}
          </Link>
        ))}
        <Link className="nav-aside" href={offHours.href} aria-current={pathname === offHours.href ? "page" : undefined}>
          {offHours.label}
        </Link>
      </nav>
      <div className="nav-meta">
        <Clock />
      </div>
    </header>
  );
}
