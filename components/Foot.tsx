import Link from "next/link";
import { offHours, site } from "@/content";
import Clock from "./Clock";

/** The last line of every page: who, where, the local time, and the way to the other page. */
export default function Foot({ page }: { page: "home" | "off" }) {
  return (
    <footer className="foot">
      <span>
        {site.name} · {site.city}, Switzerland
      </span>
      <Clock prefix="Local time " suffix=" (CET)" />
      {page === "home" ? (
        <Link className="foot-link" href={offHours.href}>
          {offHours.footLabel}
        </Link>
      ) : (
        <Link className="foot-link" href="/">
          {offHours.back}
        </Link>
      )}
      <span>
        {site.fonts} · © {site.year}
      </span>
    </footer>
  );
}
