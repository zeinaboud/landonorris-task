"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { FaBagShopping } from "react-icons/fa6";

const StoreButton = () => {
  const currentLettersRef = useRef<HTMLSpanElement[]>([]);
  const nextLettersRef = useRef<HTMLSpanElement[]>([]);

  const letters = "Store".split("");

  useLayoutEffect(() => {
    gsap.set(currentLettersRef.current, {
      yPercent: 0,
    });

    gsap.set(nextLettersRef.current, {
      yPercent: 100,
    });
  }, []);

  const handleEnter = () => {
    gsap.killTweensOf(currentLettersRef.current);
    gsap.killTweensOf(nextLettersRef.current);

    gsap.to(currentLettersRef.current, {
      yPercent: -100,
      duration: 0.45,
      ease: "power3.inOut",
      stagger: 0.05,
    });

    gsap.to(nextLettersRef.current, {
      yPercent: 0,
      duration: 0.45,
      ease: "power3.inOut",
      stagger: 0.05,
      onComplete: () => {
        gsap.set(nextLettersRef.current, {
          yPercent: 0,
        });
      },
    });
  };

  const handleLeave = () => {
    gsap.killTweensOf(currentLettersRef.current);
    gsap.killTweensOf(nextLettersRef.current);

    gsap.to(nextLettersRef.current, {
      yPercent: 100,
      duration: 0.45,
      ease: "power3.inOut",
      stagger: 0.05,
    });

    gsap.to(currentLettersRef.current, {
      yPercent: 0,
      duration: 0.45,
      ease: "power3.inOut",
      stagger: 0.05,
      onComplete: () => {
        gsap.set(currentLettersRef.current, {
          yPercent: 0,
        });
      },
    });
  };

  return (
    <button
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative flex h-7 items-center justify-center gap-2 rounded-md bg-[#D2FF00] px-3 text-sm font-bold uppercase text-black md:h-15  md:text-lg"
    >
      <FaBagShopping className="shrink-0 text-sm md:text-lg" />

      <span className="relative block h-[24px] w-[50px] overflow-hidden md:w-[60px]">
        <span className="absolute inset-0 z-10 flex items-center justify-center">
          {letters.map((letter, index) => (
            <span
              key={`current-${index}`}
              ref={(el) => {
                if (el) {
                  currentLettersRef.current[index] = el;
                }
              }}
              className="inline-block"
            >
              {letter}
            </span>
          ))}
        </span>

        <span className="absolute inset-0 z-20 flex items-center justify-center">
          {letters.map((letter, index) => (
            <span
              key={`next-${index}`}
              ref={(el) => {
                if (el) {
                  nextLettersRef.current[index] = el;
                }
              }}
              className="inline-block"
            >
              {letter}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
};

export default StoreButton;
