"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface YellowWipeTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  isOpen: boolean;
}

const YellowWipeText = ({
  children,
  className = "",
  delay = 0,
  isOpen,
}: YellowWipeTextProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const wipeRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current || !wipeRef.current) {
      return;
    }

    gsap.killTweensOf([textRef.current, wipeRef.current]);

    if (!isOpen) {
      // Closed state.
      gsap.set(textRef.current, {
        opacity: 0,
      });

      gsap.set(wipeRef.current, {
        scaleX: 1,
        transformOrigin: "right center",
      });

      return;
    }

    // Text is underneath the yellow bar.
    gsap.set(textRef.current, {
      opacity: 1,
    });

    // Yellow bar covers the complete text.
    gsap.set(wipeRef.current, {
      scaleX: 1,
      transformOrigin: "right center",
    });

    const tl = gsap.timeline({
      delay,
    });

    // Yellow bar wipes away from left to right,
    // revealing the text underneath.
    tl.to(wipeRef.current, {
      scaleX: 0,
      duration: 0.4,
      ease: "power3.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [isOpen, delay]);

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <span ref={textRef}>{children}</span>

      <span
        ref={wipeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-[#D2FF00]"
      />
    </span>
  );
};

export default YellowWipeText;
