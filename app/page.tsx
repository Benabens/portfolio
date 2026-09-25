import Hero from "@/components/Hero";
import Work from "@/components/Work";
import MoreWork from "@/components/MoreWork";
import Journey from "@/components/Journey";
import Photo from "@/components/Photo";
import Music from "@/components/Music";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Work />
      <MoreWork />
      <Journey />
      <Photo />
      <Music />
      <Contact />
    </main>
  );
}
