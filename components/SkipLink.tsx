"use client";

import { usePathname } from "next/navigation";
import { offHours } from "@/content";

/** First tab stop of every page: straight to the page's first section. */
export default function SkipLink() {
  const off = usePathname() === offHours.href;
  return (
    <a className="skip" href={off ? "#photo" : "#work"}>
      {off ? "Skip to photos" : "Skip to work"}
    </a>
  );
}
