"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText = ({ text, className = "" }: AnimatedTextProps) => {
  const currentLettersRef = useRef<HTMLSpanElement[]>([]);
  const nextLettersRef = useRef<HTMLSpanElement[]>([]);

  const letters = text.split("");

  useLayoutEffect(() => {
    gsap.set(currentLettersRef.current, {
      yPercent: 0,
    });

    gsap.set(nextLettersRef.current, {
      yPercent: 100,
    });
  }, []);

  const handleEnter = () => {
    gsap.killTweensOf([currentLettersRef.current, nextLettersRef.current]);

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
    });
  };

  const handleLeave = () => {
    gsap.killTweensOf([currentLettersRef.current, nextLettersRef.current]);

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
    });
  };

  return (
    <span
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`group inline-block cursor-pointer text-black ${className}`}
    >
      <span className="relative block overflow-hidden">
        {/* Current text */}
        <span className="absolute inset-0 flex" aria-hidden="true">
          {letters.map((letter, index) => (
            <span
              key={`current-${index}`}
              ref={(element) => {
                if (element) {
                  currentLettersRef.current[index] = element;
                }
              }}
              className="inline-block transition-colors duration-300 group-hover:text-[#D2FF00]"
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>

        {/* Next text */}
        <span className="flex text-[#D2FF00]">
          {letters.map((letter, index) => (
            <span
              key={`next-${index}`}
              ref={(element) => {
                if (element) {
                  nextLettersRef.current[index] = element;
                }
              }}
              className="inline-block"
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
};

export default AnimatedText;
