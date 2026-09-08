"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface MenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MenuButton = ({ isOpen, onToggle }: MenuButtonProps) => {
  const topLineRef = useRef<HTMLSpanElement>(null);
  const bottomLineRef = useRef<HTMLSpanElement>(null);
  const bgRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    // Set initial animation state
    gsap.set(topLineRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: "center center",
    });

    gsap.set(bottomLineRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: "center center",
    });

    gsap.set(bgRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
    });
  }, []);

  // Animate hover state
  const handleMouseEnter = () => {
    if (isOpen) return;

    gsap.killTweensOf([
      topLineRef.current,
      bottomLineRef.current,
      bgRef.current,
    ]);

    gsap.to(bgRef.current, {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.out",
    });

    gsap.to(topLineRef.current, {
      x: -4,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(bottomLineRef.current, {
      x: 4,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  // Reset hover state
  const handleMouseLeave = () => {
    if (isOpen) return;

    gsap.killTweensOf([
      topLineRef.current,
      bottomLineRef.current,
      bgRef.current,
    ]);

    gsap.to(bgRef.current, {
      scaleY: 0,
      duration: 0.4,
      ease: "power3.inOut",
    });

    gsap.to(topLineRef.current, {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(bottomLineRef.current, {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  useLayoutEffect(() => {
    gsap.killTweensOf([
      topLineRef.current,
      bottomLineRef.current,
      bgRef.current,
    ]);

    if (isOpen) {
      // Animate hamburger into X
      const timeline = gsap.timeline();

      timeline.to(
        bgRef.current,
        {
          scaleY: 1,
          duration: 0.35,
          ease: "power3.out",
        },
        0,
      );

      timeline.to(
        topLineRef.current,
        {
          x: -4,
          y: 3.5,
          rotation: 45,
          duration: 0.4,
          ease: "power3.inOut",
        },
        0,
      );

      timeline.to(
        bottomLineRef.current,
        {
          x: 4,
          y: -3.5,
          rotation: -45,
          duration: 0.4,
          ease: "power3.inOut",
        },
        0,
      );
    } else {
      // Animate X back into hamburger
      const timeline = gsap.timeline();

      timeline.to(
        topLineRef.current,
        {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "power3.inOut",
        },
        0,
      );

      timeline.to(
        bottomLineRef.current,
        {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "power3.inOut",
        },
        0,
      );

      timeline.to(
        bgRef.current,
        {
          scaleY: 0,
          duration: 0.4,
          ease: "power3.inOut",
        },
        0,
      );
    }
  }, [isOpen]);

  return (
    <button
      type="button"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="relative flex h-8 items-center justify-center gap-2 overflow-hidden rounded-md border border-black shadow px-1 md:h-14 md:border-2 md:px-4"
    >
      {/* Hover background */}
      <span ref={bgRef} className="absolute inset-0 z-0 bg-[#D2FF00]" />

      {/* Menu icon */}
      <span className="relative z-10 block h-5 w-5">
        <span
          ref={topLineRef}
          className="absolute right-0 top-[5px] block h-[1.5px] w-3 bg-black md:h-[2px]"
        />

        <span
          ref={bottomLineRef}
          className="absolute left-0 top-[12px] block h-[1.5px] w-3 bg-black md:h-[2px]"
        />
      </span>
    </button>
  );
};

export default MenuButton;
