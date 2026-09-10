"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const REPEAT_COUNT = 4;

const MarqueeSection = () => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;

    if (!topRow || !bottomRow) return;

    const ctx = gsap.context(() => {
      // On track: right → left
      gsap.fromTo(
        topRow,
        { xPercent: 0 },
        { xPercent: -50, duration: 14, ease: "none", repeat: -1 },
      );

      // Off track: left → right
      gsap.fromTo(
        bottomRow,
        { xPercent: -50 },
        { xPercent: 0, duration: 14, ease: "none", repeat: -1 },
      );
    });

    return () => ctx.revert();
  }, []);

  const textClass =
    "mx-6 text-[clamp(48px,6vw,110px)] font-bold leading-none tracking-[-0.04em]";

  const renderCopy = (label: string, colorClass: string) => (
    <div className="flex shrink-0">
      {Array.from({ length: REPEAT_COUNT }).map((_, index) => (
        <span key={index} className={`${textClass} ${colorClass}`}>
          {label}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden
      bg-[url('/assets/bg-website.png')]"
    >
      <div className="w-full">
        {/* On track: yellow, right → left */}
        <div className="w-full overflow-hidden whitespace-nowrap">
          <div ref={topRowRef} className="flex w-max">
            {renderCopy("ON TRACK", "text-yallow-300")}
            {renderCopy("ON TRACK", "text-yellow-300")}
          </div>
        </div>

        {/* Off track: black, left → right */}
        <div className="mt-2 w-full overflow-hidden whitespace-nowrap">
          <div ref={bottomRowRef} className="flex w-max">
            {renderCopy("OFF TRACK", "text-black")}
            {renderCopy("OFF TRACK", "text-black")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeSection;
