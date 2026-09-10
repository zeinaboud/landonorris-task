"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeroMouse } from "./HeroMouse";

const Person = () => {
  const personRef = useRef<HTMLImageElement>(null);
  const { current } = useHeroMouse();

  useEffect(() => {
    const person = personRef.current;
    if (!person) return;

    let animationFrame = 0;

    const update = () => {
      // Map shared mouse position (0 → 1) to a -1 → 1 range
      const x = current.current.x * 2 - 1;
      const y = current.current.y * 2 - 1;

      gsap.to(person, {
        x: x * 12,
        y: -y * 4,
        rotationY: x * 3,
        rotationX: y * 1.5,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });

      animationFrame = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrame);
      gsap.killTweensOf(person);
    };
  }, [current]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center"
      style={{ perspective: "1000px" }}
    >
      <img
        ref={personRef}
        src="/assets/hero/person2.webp"
        alt="Lando Norris"
        className="flex h-full w-auto max-w-none justify-center object-contain object-bottom"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      />
    </div>
  );
};

export default Person;
