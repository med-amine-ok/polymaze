import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutHorizontal from "@/components/AboutHorizontal";
import Stats from "@/components/Stats";
import Marquee from "@/components/Marquee";
import Destination from "@/components/Destination";
import FAQ from "@/components/Faq";
import Footer from "@/components/Footer";
import { useLenis } from "@/hooks/useLenis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "POLYMAZE 2026 · VIC" },
      { name: "description", content: "POLYMAZE 2026 —  robotics championship in Algiers. 24 teams. 120 robots. 10 countries. June 12–18, 2026." },
      { property: "og:title", content: "POLYMAZE 2026 — Algiers" },
      { property: "og:description", content: "The cinematic home of the world's most ambitious robotics championship." },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <main className="bg-white text-zinc-900 antialiased">
      <Navbar />
      <Hero />
      <AboutHorizontal />
      <Stats />
      <Marquee />
    
      <Destination />
      <FAQ />
      <Marquee reverse />
      <Footer />
    </main>
  );
}
