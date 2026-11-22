import { ogCard, ogSize } from "@/lib/og";
import { offHours, site } from "@/content";

export const alt = `${site.name} — off hours: photo and music`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    topLeft: offHours.topLeft,
    topRight: offHours.topRight,
    lines: [offHours.name[0], offHours.name[1]],
    bottom: `${site.name} · photographs by city, afro house produced in Ableton`,
  });
}
