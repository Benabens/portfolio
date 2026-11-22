import { ogCard, ogSize } from "@/lib/og";
import { profile, site } from "@/content";

export const alt = `${site.name} — portfolio`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    topLeft: profile.heroTopLeft,
    topRight: profile.heroTopRight,
    lines: [profile.firstName, profile.lastName],
    bottom: "Communication Systems at EPFL · software, machine learning, teaching",
    stamp: profile.stamp,
  });
}
