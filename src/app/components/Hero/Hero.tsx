"use client";

import ColoredHelmet from "./ColoredHelmet";
import Helmet3D from "./Helmet3D";
import HeroBackground from "./HeroBackground";
import { HeroMouseProvider } from "./HeroMouse";
import Person from "./Person";

const Hero = () => {
  return (
    <HeroMouseProvider>
      <div className="relative h-full w-full overflow-hidden">
        <HeroBackground />

        <Person />

        <Helmet3D />

        <ColoredHelmet />
      </div>
    </HeroMouseProvider>
  );
};

export default Hero;
