"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Intro() {
  const introRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const leftTraceRef = useRef<SVGPathElement>(null);
  const rightTraceRef = useRef<SVGPathElement>(null);

  const leftRevealRef = useRef<SVGPathElement>(null);
  const rightRevealRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const intro = introRef.current;
    const logo = logoRef.current;

    const leftTrace = leftTraceRef.current;
    const rightTrace = rightTraceRef.current;

    const leftReveal = leftRevealRef.current;
    const rightReveal = rightRevealRef.current;

    if (
      !intro ||
      !logo ||
      !leftTrace ||
      !rightTrace ||
      !leftReveal ||
      !rightReveal
    ) {
      return;
    }

    const leftLength = leftTrace.getTotalLength();
    const rightLength = rightTrace.getTotalLength();

    const ctx = gsap.context(() => {
      // --------------------------------
      // Initial state
      // --------------------------------

      gsap.set(intro, {
        yPercent: 0,
        autoAlpha: 1,
      });

      gsap.set(logo, {
        scale: 1,
        transformOrigin: "50% 50%",
      });

      gsap.set([leftTrace, rightTrace], {
        opacity: 1,
      });

      gsap.set(leftTrace, {
        strokeDasharray: leftLength,
        strokeDashoffset: leftLength,
      });

      gsap.set(rightTrace, {
        strokeDasharray: rightLength,
        strokeDashoffset: rightLength,
      });

      gsap.set([leftReveal, rightReveal], {
        opacity: 0,
      });

      // --------------------------------
      // Intro timeline
      // --------------------------------

      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      // 1. Draw left side
      tl.to(leftTrace, {
        strokeDashoffset: 0,
        duration: 0.62,
        ease: "none",
      });

      // Reveal left fill immediately after drawing
      tl.to(
        leftReveal,
        {
          opacity: 1,
          duration: 0.08,
          ease: "none",
        },
        "-=0.06",
      );

      // 2. Draw right side
      tl.to(
        rightTrace,
        {
          strokeDashoffset: 0,
          duration: 0.68,
          ease: "none",
        },
        "-=0.12",
      );

      // Reveal right fill
      tl.to(
        rightReveal,
        {
          opacity: 1,
          duration: 0.08,
          ease: "none",
        },
        "-=0.06",
      );

      // 3. Very short settle
      tl.to(
        {},
        {
          duration: 0.12,
        },
      );

      // 4. Logo slightly compresses
      // This makes the transition feel intentional
      // instead of simply disappearing.
      tl.to(logo, {
        scale: 0.94,
        duration: 0.22,
        ease: "power2.in",
      });

      // 5. Curtain moves away
      // Hero is already mounted underneath.
      tl.to(
        intro,
        {
          yPercent: -100,
          duration: 0.85,
          ease: "power4.inOut",
        },
        "-=0.04",
      );
    }, introRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={introRef}
      className="fixed inset-0 z-[100000] flex items-center justify-center overflow-hidden bg-[#D2FF00]"
    >
      <div ref={logoRef} className="relative w-[78px] md:w-[105px]">
        <svg
          viewBox="0 0 31 34"
          className="pointer-events-none block h-auto w-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* =========================
              LEFT FILLED LOGO
          ========================= */}

          <path
            ref={leftRevealRef}
            d="M7.09698 24.7318C6.34358 24.7318 5.68571 24.2675 5.90896 23.3863L10.5333 4.19444C10.5389 4.17108 10.5385 4.14666 10.532 4.12352C10.5255 4.10038 10.5132 4.07929 10.4962 4.06227L6.47228 0.0408395C6.45461 0.0232942 6.4326 0.010755 6.4085 0.00450366C6.38441 -0.00174767 6.35908 -0.00148691 6.33511 0.00525974C6.31115 0.0120064 6.2894 0.0249966 6.2721 0.0429023C6.2548 0.0608079 6.24257 0.0829867 6.23665 0.107171L0.108965 25.501C-0.429108 27.7484 1.07324 29.8897 3.56362 29.8897H11.213H14.8166C14.8481 29.8898 14.8788 29.8793 14.9036 29.8598C14.9284 29.8403 14.9459 29.813 14.9532 29.7823L16.1279 24.9139C16.1329 24.8933 16.1332 24.8718 16.1287 24.8511C16.1242 24.8304 16.115 24.8109 16.1019 24.7942C16.0888 24.7775 16.0721 24.764 16.053 24.7548C16.0339 24.7455 16.013 24.7407 15.9918 24.7407L7.09698 24.7318Z"
            fill="#111112"
          />

          {/* =========================
              RIGHT FILLED LOGO
          ========================= */}

          <path
            ref={rightRevealRef}
            d="M23.6795 9.2618C24.4324 9.2618 25.0907 9.72661 24.8675 10.6072L20.2352 29.7996C20.2296 29.823 20.23 29.8474 20.2365 29.8706C20.243 29.8937 20.2554 29.9148 20.2723 29.9318L24.3037 33.9587C24.3213 33.9764 24.3433 33.9891 24.3674 33.9954C24.3915 34.0017 24.4169 34.0015 24.441 33.9948C24.465 33.988 24.4868 33.9749 24.5041 33.9569C24.5213 33.9389 24.5335 33.9166 24.5393 33.8923L30.6571 8.49256C31.1946 6.24523 29.6923 4.10383 27.2019 4.10383L15.9677 4.08997C15.9363 4.08999 15.9058 4.1006 15.8811 4.12008C15.8564 4.13957 15.839 4.16679 15.8316 4.19738L14.6075 9.26823L12.1661 19.4159C12.1611 19.4365 12.1608 19.4581 12.1922 19.5358C12.2054 19.5525 12.2222 19.566 12.2413 19.5752C12.2605 19.5844 12.2815 19.5892 12.3027 19.5891H17.2973C17.3288 19.5891 17.3595 19.5785 17.3842 19.5591C17.409 19.5396 17.4265 19.5123 17.434 19.4817L19.8704 9.37317C19.8777 9.34259 19.8951 9.31536 19.9198 9.29587C19.9445 9.27639 19.9751 9.26578 20.0065 9.26576L23.6795 9.2618Z"
            fill="#111112"
          />

          {/* =========================
              LEFT TRACE
          ========================= */}

          <path
            ref={leftTraceRef}
            d="M0.108965 25.501 L6.2721 0.0429 L10.5333 4.19444 L5.90896 23.3863 C5.68571 24.2675 6.34358 24.7318 7.09698 24.7318 L15.9918 24.7407"
            stroke="#111112"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* =========================
              RIGHT TRACE
          ========================= */}

          <path
            ref={rightTraceRef}
            d="M12.3027 19.5891 L17.2973 19.5891 L19.8704 9.37317 L23.6795 9.2618 C24.4324 9.2618 25.0907 9.72661 24.8675 10.6072 L20.2352 29.7996 L24.5393 33.8923 L30.6571 8.49256"
            stroke="#111112"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
