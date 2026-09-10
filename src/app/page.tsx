import Hero from "@/app/components/Hero/Hero";
import HeroScroll from "@/app/components/Hero/HeroScroll";
import Intro from "./components/intro/Intro";
import Navbar from "./components/Navbar/Navbar";

export default function Home() {
  return (
    <main>
      <Intro />
      <Navbar />

      <HeroScroll>
        <Hero />
      </HeroScroll>
    </main>
  );
}
