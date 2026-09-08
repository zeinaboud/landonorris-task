"use client";

import HeroWebGL from "./HeroWebGL";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
      <HeroWebGL />
    </div>
  );
};

export default HeroBackground;
