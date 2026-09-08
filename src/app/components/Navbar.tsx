"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { FaBagShopping } from "react-icons/fa6";

const Navbar = () => {
  // Store animation
  const currentLettersRef = useRef<HTMLSpanElement[]>([]);
  const nextLettersRef = useRef<HTMLSpanElement[]>([]);

  // Menu animation
  const menuTopLineRef = useRef<HTMLSpanElement>(null);
  const menuBottomLineRef = useRef<HTMLSpanElement>(null);
  const menuBgRef = useRef<HTMLSpanElement>(null);

  // Logo animation
  const logoTraceLeftRef = useRef<SVGPathElement>(null);
  const logoTraceRightRef = useRef<SVGPathElement>(null);

  const logoRevealLeftRef = useRef<SVGPathElement>(null);
  const logoRevealRightRef = useRef<SVGPathElement>(null);

  const letters = "Store".split("");

  useLayoutEffect(() => {
    // -----------------------------
    // STORE INITIAL STATE
    // -----------------------------

    gsap.set(currentLettersRef.current, {
      yPercent: 0,
    });

    gsap.set(nextLettersRef.current, {
      yPercent: 100,
    });

    // -----------------------------
    // MENU INITIAL STATE
    // -----------------------------

    gsap.set(menuTopLineRef.current, {
      x: 0,
    });

    gsap.set(menuBottomLineRef.current, {
      x: 0,
    });

    gsap.set(menuBgRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
    });

    // -----------------------------
    // LOGO INITIAL STATE
    // -----------------------------

    const traces = [logoTraceLeftRef.current, logoTraceRightRef.current].filter(
      Boolean,
    ) as SVGPathElement[];

    traces.forEach((path) => {
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });
    });

    gsap.set([logoRevealLeftRef.current, logoRevealRightRef.current], {
      opacity: 0,
    });
  }, []);

  // =====================================================
  // STORE
  // =====================================================

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

  // =====================================================
  // MENU
  // =====================================================

  const handleMenuEnter = () => {
    gsap.killTweensOf([
      menuTopLineRef.current,
      menuBottomLineRef.current,
      menuBgRef.current,
    ]);

    gsap.to(menuBgRef.current, {
      scaleY: 1,
      duration: 0.5,
      ease: "power3.out",
    });

    gsap.to(menuTopLineRef.current, {
      x: -4,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(menuBottomLineRef.current, {
      x: 4,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleMenuLeave = () => {
    gsap.killTweensOf([
      menuTopLineRef.current,
      menuBottomLineRef.current,
      menuBgRef.current,
    ]);

    gsap.to(menuBgRef.current, {
      scaleY: 0,
      duration: 0.4,
      ease: "power3.inOut",
    });

    gsap.to(menuTopLineRef.current, {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.to(menuBottomLineRef.current, {
      x: 0,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  // =====================================================
  // LOGO
  // =====================================================

  const handleLogoEnter = () => {
    const leftTrace = logoTraceLeftRef.current;
    const rightTrace = logoTraceRightRef.current;

    const leftReveal = logoRevealLeftRef.current;
    const rightReveal = logoRevealRightRef.current;

    if (!leftTrace || !rightTrace || !leftReveal || !rightReveal) {
      return;
    }

    gsap.killTweensOf([leftTrace, rightTrace, leftReveal, rightReveal]);

    // Reset
    const leftLength = leftTrace.getTotalLength();
    const rightLength = rightTrace.getTotalLength();

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

    // -------------------------------------------------
    // LEFT — yellow pen starts first
    // -------------------------------------------------

    gsap.to(leftTrace, {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: "power2.inOut",
    });

    gsap.to(leftReveal, {
      opacity: 1,
      duration: 0.7,
      ease: "power2.inOut",
    });

    // -------------------------------------------------
    // RIGHT — follows the left
    // -------------------------------------------------

    gsap.to(rightTrace, {
      strokeDashoffset: 0,
      duration: 0.85,
      delay: 0.45,
      ease: "power2.inOut",
    });

    gsap.to(rightReveal, {
      opacity: 1,
      duration: 0.85,
      delay: 0.45,
      ease: "power2.inOut",
    });
  };

  const handleLogoLeave = () => {
    const leftTrace = logoTraceLeftRef.current;
    const rightTrace = logoTraceRightRef.current;

    const leftReveal = logoRevealLeftRef.current;
    const rightReveal = logoRevealRightRef.current;

    if (!leftTrace || !rightTrace || !leftReveal || !rightReveal) {
      return;
    }

    gsap.killTweensOf([leftTrace, rightTrace, leftReveal, rightReveal]);

    const leftLength = leftTrace.getTotalLength();
    const rightLength = rightTrace.getTotalLength();

    // Hide fill
    gsap.to([leftReveal, rightReveal], {
      opacity: 0,
      duration: 0.45,
      ease: "power2.inOut",
    });

    // Erase drawing
    gsap.to(rightTrace, {
      strokeDashoffset: rightLength,
      duration: 0.45,
      ease: "power2.inOut",
    });

    gsap.to(leftTrace, {
      strokeDashoffset: leftLength,
      duration: 0.45,
      delay: 0.12,
      ease: "power2.inOut",
    });
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full px-4 py-3">
      <div className="grid h-[180px] grid-cols-1 md:h-[60px] md:grid-cols-3">
        {/* ================================================= */}
        {/* RIGHT — STORE + MENU */}
        {/* ================================================= */}

        <div className="order-1 flex items-start justify-between md:order-3 md:justify-end md:gap-3">
          {/* STORE */}
          <button
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="relative flex h-7 items-center justify-center gap-2 rounded-md bg-[#D2FF00] px-3 text-sm font-bold uppercase text-black md:h-10 md:px-4 md:text-lg"
          >
            <FaBagShopping className="shrink-0 text-sm md:text-lg" />

            <span className="relative block h-[24px] w-[50px] overflow-hidden md:w-[60px]">
              {/* Current */}
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

              {/* Next */}
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

          {/* MENU */}
          <button
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
            type="button"
            className="relative flex h-8 items-center justify-center gap-2 overflow-hidden rounded-md border border-black px-1 md:h-10 md:border-2 md:px-3"
          >
            {/* Yellow background */}
            <span
              ref={menuBgRef}
              className="absolute inset-0 z-0 bg-[#D2FF00]"
            />

            {/* Menu icon */}
            <span className="relative z-10 block h-5 w-5">
              {/* Top line */}
              <span
                ref={menuTopLineRef}
                className="absolute right-0 top-[5px] block h-[1.5px] w-3 bg-black md:h-[2px]"
              />

              {/* Bottom line */}
              <span
                ref={menuBottomLineRef}
                className="absolute left-0 top-[12px] block h-[1.5px] w-3 bg-black"
              />
            </span>
          </button>
        </div>

        {/* ================================================= */}
        {/* LEFT — LANDO NORRIS TEXT */}
        {/* ================================================= */}

        <div className="order-3 flex items-center justify-center md:order-1 md:items-start md:justify-start">
          <img
            src="/assets/lando-norris-text-mobile.svg"
            alt="Lando Norris"
            className="block w-[130px] object-contain md:w-[150px]"
          />
        </div>

        {/* ================================================= */}
        {/* CENTER — LANDO NORRIS LOGO */}
        {/* ================================================= */}

        <div
          className="order-2 flex items-center justify-center md:order-2 md:items-start"
          onMouseEnter={handleLogoEnter}
          onMouseLeave={handleLogoLeave}
        >
          <div className="relative w-[25px] md:w-[30px]">
            {/* BLACK BASE LOGO */}

            <img
              src="/assets/ln-logo-svg.svg"
              alt="Lando Norris logo"
              className="block w-full object-contain brightness-0"
            />

            {/* ================================================= */}
            {/* SVG DRAWING LAYER */}
            {/* ================================================= */}

            <svg
              viewBox="0 0 31 34"
              className="pointer-events-none absolute inset-0 block h-full w-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* ================================================= */}
              {/* YELLOW FILLED LOGO */}
              {/* ================================================= */}

              <path
                ref={logoRevealLeftRef}
                d="M7.09698 24.7318C6.34358 24.7318 5.68571 24.2675 5.90896 23.3863L10.5333 4.19444C10.5389 4.17108 10.5385 4.14666 10.532 4.12352C10.5255 4.10038 10.5132 4.07929 10.4962 4.06227L6.47228 0.0408395C6.45461 0.0232942 6.4326 0.010755 6.4085 0.00450366C6.38441 -0.00174767 6.35908 -0.00148691 6.33511 0.00525974C6.31115 0.0120064 6.2894 0.0249966 6.2721 0.0429023C6.2548 0.0608079 6.24257 0.0829867 6.23665 0.107171L0.108965 25.501C-0.429108 27.7484 1.07324 29.8897 3.56362 29.8897H11.213H14.8166C14.8481 29.8898 14.8788 29.8793 14.9036 29.8598C14.9284 29.8403 14.9459 29.813 14.9532 29.7823L16.1279 24.9139C16.1329 24.8933 16.1332 24.8718 16.1287 24.8511C16.1242 24.8304 16.115 24.8109 16.1019 24.7942C16.0888 24.7775 16.0721 24.764 16.053 24.7548C16.0339 24.7455 16.013 24.7407 15.9918 24.7407L7.09698 24.7318Z"
                fill="#D2FF00"
                opacity="0"
              />

              <path
                ref={logoRevealRightRef}
                d="M23.6795 9.2618C24.4324 9.2618 25.0907 9.72661 24.8675 10.6072L20.2352 29.7996C20.2296 29.823 20.23 29.8474 20.2365 29.8706C20.243 29.8937 20.2554 29.9148 20.2723 29.9318L24.3037 33.9587C24.3213 33.9764 24.3433 33.9891 24.3674 33.9954C24.3915 34.0017 24.4169 33.9948 24.441 33.9948C24.465 33.988 24.4868 33.9749 24.5041 33.9569C24.5213 33.9389 24.5335 33.9166 24.5393 33.8923L30.6571 8.49256C31.1946 6.24523 29.6923 4.10383 27.2019 4.10383L15.9677 4.08997C15.9363 4.08999 15.9058 4.1006 15.8811 4.12008C15.8564 4.13957 15.839 4.16679 15.8316 4.19738L14.6075 9.26823L12.1661 19.4159C12.1611 19.4365 12.1608 19.4581 12.1653 19.4788C12.1698 19.4996 12.179 19.5191 12.1922 19.5358C12.2054 19.5525 12.2222 19.566 12.2413 19.5752C12.2605 19.5844 12.2815 19.5892 12.3027 19.5891H17.2973C17.3288 19.5891 17.3595 19.5785 17.3842 19.5591C17.409 19.5396 17.4265 19.5123 17.434 19.4817L19.8704 9.37317C19.8777 9.34259 19.8951 9.31536 19.9198 9.29587C19.9445 9.27639 19.9751 9.26578 20.0065 9.26576L23.6795 9.2618Z"
                fill="#D2FF00"
                opacity="0"
              />

              {/* ================================================= */}
              {/* YELLOW PEN — LEFT */}
              {/* ================================================= */}

              <path
                ref={logoTraceLeftRef}
                d="M0.108965 25.501
                   L6.2721 0.0429
                   L10.5333 4.19444
                   L5.90896 23.3863
                   C5.68571 24.2675 6.34358 24.7318 7.09698 24.7318
                   L15.9918 24.7407"
                stroke="#D2FF00"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* ================================================= */}
              {/* YELLOW PEN — RIGHT */}
              {/* ================================================= */}

              <path
                ref={logoTraceRightRef}
                d="M12.3027 19.5891
                   L17.2973 19.5891
                   L19.8704 9.37317
                   L23.6795 9.2618
                   C24.4324 9.2618 25.0907 9.72661 24.8675 10.6072
                   L20.2352 29.7996
                   L24.5393 33.8923
                   L30.6571 8.49256"
                stroke="#D2FF00"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
