"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import NextRace from "./NextRace";
import MarqueeSection from "../after-hero/MarqueeSection";
import Signature from "../after-hero/Signature";
import ScrollLockButton from "./ScrollLockButton";

gsap.registerPlugin(ScrollTrigger);

type HeroScrollProps = {
  children: ReactNode;
  nextSection?: ReactNode;
};

const HeroScroll = ({ children, nextSection }: HeroScrollProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const nextRaceRef = useRef<HTMLDivElement>(null);
  const grayPersonRef = useRef<HTMLDivElement>(null);
  const signatureContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const hero = heroRef.current;
    const nextRace = nextRaceRef.current;
    const grayPerson = grayPersonRef.current;

    if (!section || !stage || !hero || !nextRace || !grayPerson) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(hero, { opacity: 1, width: "100%", height: "100vh" });
      gsap.set(nextRace, { autoAlpha: 1, y: 0 });
      gsap.set(grayPerson, { autoAlpha: 0 });
      gsap.set(signatureContainerRef.current, {
        autoAlpha: 0,
        clipPath: "inset(0 0 100% 0)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: hero starts shrinking
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

      // Next race disappears
      tl.to(
        nextRace,
        { autoAlpha: 0, y: 10, ease: "none", duration: 0.12 },
        0.18,
      );

      // Phase 2: hero shrinks more
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

      // Phase 3: hero disappears
      tl.to(hero, { opacity: 0, ease: "none", duration: 0.04 }, 0.95);

      // Phase 4: gray person appears
      tl.to(grayPerson, { autoAlpha: 1, ease: "none", duration: 0.06 }, 0.97);

      // Phase 5: reveal the signature from top to bottom
      tl.to(
        signatureContainerRef.current,
        {
          autoAlpha: 1,
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          duration: 0.12,
        },
        0.9,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[220vh]">
      {nextSection && <div className="absolute inset-0 z-0">{nextSection}</div>}

      {/* Sticky hero stage */}
      <div
        ref={stageRef}
        className="pointer-events-none sticky top-0 z-10 h-screen w-full overflow-hidden bg-white"
      >
        <MarqueeSection />

        <div
          ref={heroRef}
          className="absolute left-1/2 top-1/2 z-20 h-screen w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        >
          {children}
        </div>

        <NextRace ref={nextRaceRef} />

        <div
          ref={grayPersonRef}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
        >
          <img
            src="/assets/hero/gray-person.jpg"
            alt="Lando Norris"
            className="h-[38vh] w-auto max-w-[60vw] object-contain sm:h-[42vh] md:h-[48vh] lg:h-[52vh] xl:h-[54vh]"
          />
        </div>

        <div
          ref={signatureContainerRef}
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
        >
          <Signature />
        </div>

        <ScrollLockButton />
      </div>
    </section>
  );
};

export default HeroScroll;
