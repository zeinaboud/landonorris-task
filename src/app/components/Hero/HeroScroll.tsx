"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NextRace from "./NextRace";
import MarqueeSection from "../after-hero/MarqueeSection";
import ScrollLockButton from "./ScrollLockButton";

gsap.registerPlugin(ScrollTrigger);

type HeroScrollProps = {
  children: ReactNode;
  nextSection: ReactNode;
};

const HeroScroll = ({ children, nextSection }: HeroScrollProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const nextRaceRef = useRef<HTMLDivElement>(null);
  const grayPersonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const hero = heroRef.current;
    const nextRace = nextRaceRef.current;
    const grayPerson = grayPersonRef.current;

    if (!section || !stage || !hero || !nextRace || !grayPerson) {
      return;
    }

    const ctx = gsap.context(() => {
      // ==========================================================
      // INITIAL STATES
      // ==========================================================

      gsap.set(hero, {
        opacity: 1,
        width: "100%",
        height: "100vh",
      });

      gsap.set(nextRace, {
        autoAlpha: 1,
        y: 0,
      });

      gsap.set(grayPerson, {
        autoAlpha: 0,
      });

      // ==========================================================
      // SCROLL TIMELINE
      // ==========================================================

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // ==========================================================
      // PHASE 1
      // HERO STARTS SHRINKING
      // ==========================================================

      tl.to(
        hero,
        {
          width: "68%",
          height: "72vh",
          y: "-4vh",
          borderRadius: "32px",
          ease: "none",
          duration: 0.75,
        },
        0,
      );

      // ==========================================================
      // NEXT RACE DISAPPEARS
      // ==========================================================

      tl.to(
        nextRace,
        {
          autoAlpha: 0,
          y: 10,
          ease: "none",
          duration: 0.12,
        },
        0.18,
      );

      // ==========================================================
      // PHASE 2
      // HERO SHRINKS MORE
      // ==========================================================

      tl.to(
        hero,
        {
          width: "38%",
          height: "62vh",
          y: "0",
          borderRadius: "32px",
          ease: "none",
          duration: 0.2,
        },
        0.75,
      );

      // ==========================================================
      // PHASE 3
      // HERO DISAPPEARS
      // ==========================================================

      tl.to(
        hero,
        {
          opacity: 0,
          ease: "none",
          duration: 0.04,
        },
        0.95,
      );

      // ==========================================================
      // PHASE 4
      // GRAY PERSON APPEARS
      // ==========================================================

      tl.to(
        grayPerson,
        {
          autoAlpha: 1,
          ease: "none",
          duration: 0.06,
        },
        0.97,
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      {/* ======================================================== */}
      {/* NEXT SECTION */}
      {/* ======================================================== */}

      <div className="absolute inset-0 z-0">{nextSection}</div>

      {/* ======================================================== */}
      {/* STICKY HERO STAGE */}
      {/* ======================================================== */}

      <div
        ref={stageRef}
        className="
          pointer-events-none
    sticky
    top-0
    z-10
    h-screen
    w-full
    overflow-hidden
    bg-white
        "
      >
        {/* ====================================================== */}
        {/* MARQUEE */}
        {/* ====================================================== */}

        <MarqueeSection />

        {/* ====================================================== */}
        {/* HERO */}
        {/* ====================================================== */}

        <div
          ref={heroRef}
          className="
            absolute
            left-1/2
            top-1/2
            z-20
            h-screen
            w-full
            -translate-x-1/2
            -translate-y-1/2
            overflow-hidden
          "
        >
          {children}
        </div>

        {/* ====================================================== */}
        {/* NEXT RACE */}
        {/* ====================================================== */}

        <NextRace ref={nextRaceRef} />

        {/* ====================================================== */}
        {/* GRAY PERSON */}
        {/* ====================================================== */}

        <div
          ref={grayPersonRef}
          className="
            pointer-events-none
            absolute
            inset-0
            z-30
            flex
            items-center
            justify-center
          "
        >
          <img
            src="/assets/hero/gray-person.jpg"
            alt="Lando Norris"
            className="
              h-[38vh]
              w-auto
              max-w-[60vw]
              object-contain
              sm:h-[42vh]
              md:h-[48vh]
              lg:h-[52vh]
              xl:h-[54vh]
            "
          />
        </div>
        <ScrollLockButton />
      </div>
    </section>
  );
};

export default HeroScroll;
