"use client";

import ColoredHelmet from "./ColoredHelmet";
import GrayPerson from "./GrayPerson";
import Helmet3D from "./Helmet3D";
import HeroBackground from "./HeroBackground";
import { HeroMouseProvider } from "./HeroMouse";
import Person from "./Person";
import ScrollLockButton from "./ScrollLockButton";

const Hero = () => {
  return (
    <HeroMouseProvider>
      <div className="relative h-full w-full overflow-hidden">
        <HeroBackground />

        <Person />

        <Helmet3D />

        <ColoredHelmet />
        <ScrollLockButton />
      </div>
    </HeroMouseProvider>
  );
};

export default Hero;
