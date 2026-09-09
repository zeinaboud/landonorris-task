import Hero from "@/app/components/Hero/Hero";
import HeroScroll from "@/app/components/Hero/HeroScroll";
import NextRace from "@/app/components/Hero/NextRace";
import Intro from "./components/intro/Intro";
import Navbar from "./components/Navbar/Navbar";

export default function Home() {
  return (
    <main>
      <Intro />
      <Navbar />

      <HeroScroll nextSection={<NextRace />}>
        <Hero />
      </HeroScroll>
    </main>
  );
}
