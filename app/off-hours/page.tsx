import type { Metadata } from "next";
import OffHead from "@/components/OffHead";
import Photo from "@/components/Photo";
import Music from "@/components/Music";
import Foot from "@/components/Foot";
import { offHours, site } from "@/content";

export const metadata: Metadata = {
  title: { absolute: offHours.title },
  description: offHours.description,
  alternates: { canonical: offHours.href },
  openGraph: {
    type: "website",
    url: `${site.url}${offHours.href}`,
    title: offHours.title,
    description: offHours.description,
    siteName: site.name,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: offHours.title, description: offHours.description },
};

export default function OffHours() {
  return (
    <main id="top">
      <OffHead />
      <Photo />
      <Music />
      <div className="section off-end">
        <Foot page="off" />
      </div>
    </main>
  );
}
