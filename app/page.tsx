import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import MoreWork from "@/components/MoreWork";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";

// Photo and Music live on their own page since 22 November 2026 (app/off-hours).
export default function Home() {
  return (
    <>
      <Preloader />
      <main id="top">
        <Hero />
        <Work />
        <MoreWork />
        <Journey />
        <Contact />
      </main>
    </>
  );
}
