import { NextScript } from "next/document";
import ColoredHelmet from "./ColoredHelmet";
import Helmet3D from "./Helmet3D";
import HeroBackground from "./HeroBackground";
import { HeroMouseProvider } from "./HeroMouse";
import Person from "./Person";
import NextRace from "./NextRace";

const Hero = () => {
  return (
    <HeroMouseProvider>
      <section className="relative min-h-screen overflow-hidden bg-white">
        <HeroBackground />
        <Person />
        <Helmet3D />
        <ColoredHelmet />
        <NextRace />
      </section>
    </HeroMouseProvider>
  );
};

export default Hero;
