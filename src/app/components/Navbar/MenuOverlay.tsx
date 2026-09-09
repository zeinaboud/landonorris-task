"use client";

import { useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import AnimatedText from "../AnimatedText";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { label: "ON TRACK", hoverImageIndex: 0 },
  { label: "OFF TRACK", hoverImageIndex: 3 },
  { label: "CALENDAR", hoverImageIndex: null },
] as const;

const SOCIAL_LINKS = [
  { label: "TIKTOK", href: "https://www.tiktok.com" },
  { label: "INSTAGRAM", href: "https://www.instagram.com" },
  { label: "YOUTUBE", href: "https://www.youtube.com" },
  { label: "TWITCH", href: "https://www.twitch.tv" },
] as const;

const BUSINESS_EMAIL = "business@kairovoss-racing.com";
const TEAM_CAPTION = "mclaren f1 since 2019";

// wipeRefs layout: 0 = team caption, 1 = business enquiries, 2-5 = socials
const TEAM_CAPTION_WIPE_INDEX = 0;
const BUSINESS_WIPE_INDEX = 1;
const SOCIAL_WIPE_OFFSET = 2;

const TIMING = {
  openDuration: 0.9,
  closeDuration: 0.8,
  closeOverlayDelay: 0.15,
  curveHideAtOpen: 0.88,
  curveHideAtClose: 0.9,
  imageDrift: { duration: 0.9, ease: "power3.out" },
  imageHover: { duration: 0.5, ease: "power2.out" },
} as const;

const COLUMN_TOP_PERCENT = -16;
const COLUMN_BOTTOM_PERCENT = 16;

// Static lists only — switch to a keyed Map if NAV_ITEMS/SOCIAL_LINKS ever become dynamic
function assignRef<T>(store: React.MutableRefObject<T[]>, index: number) {
  return (el: T | null) => {
    if (el) store.current[index] = el;
  };
}

const MenuOverlay = ({ isOpen, onClose }: MenuOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const curveRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | HTMLDivElement>(null);

  const titleRefs = useRef<HTMLDivElement[]>([]);
  const wipeRefs = useRef<HTMLSpanElement[]>([]);
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const firstColumnRef = useRef<HTMLDivElement>(null);
  const secondColumnRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useLayoutEffect(() => {
    if (!overlayRef.current || !contentRef.current || !curveRef.current) return;

    gsap.set(overlayRef.current, { yPercent: -100 });
    gsap.set(contentRef.current, { opacity: 1, y: 0 });
    gsap.set(titleRefs.current, { yPercent: -100 });
    gsap.set(wipeRefs.current, { scaleX: 1, transformOrigin: "left center" });
    gsap.set(imageRefs.current, { filter: "grayscale(100%)" });
    gsap.set(curveRef.current, { display: "none" });
  }, []);

  useLayoutEffect(() => {
    if (!overlayRef.current || !contentRef.current || !curveRef.current) return;

    gsap.killTweensOf([
      overlayRef.current,
      contentRef.current,
      curveRef.current,
      ...titleRefs.current,
      ...wipeRefs.current,
    ]);

    if (reducedMotion()) {
      gsap.set(overlayRef.current, { yPercent: isOpen ? 0 : -100 });
      gsap.set(titleRefs.current, { yPercent: isOpen ? 0 : -100 });
      gsap.set(wipeRefs.current, { scaleX: isOpen ? 0 : 1 });
      gsap.set(curveRef.current, { display: "none" });
      if (isOpen) firstLinkRef.current?.focus?.();
      return;
    }

    const tl = gsap.timeline();

    if (isOpen) {
      tl.set(curveRef.current, { display: "block" }, 0)
        .to(
          overlayRef.current,
          { yPercent: 0, duration: TIMING.openDuration, ease: "power4.inOut" },
          0,
        )
        .to(
          wipeRefs.current,
          {
            scaleX: 0,
            duration: TIMING.openDuration,
            ease: "power3.inOut",
            transformOrigin: "right center",
          },
          0,
        )
        .to(
          titleRefs.current,
          { yPercent: 0, duration: TIMING.openDuration, ease: "power4.out" },
          0,
        )
        .set(curveRef.current, { display: "none" }, TIMING.curveHideAtOpen)
        .call(() => firstLinkRef.current?.focus?.());
    } else {
      tl.set(curveRef.current, { display: "block" }, 0)
        .to(
          wipeRefs.current,
          {
            scaleX: 1,
            duration: TIMING.closeDuration,
            ease: "power3.inOut",
            transformOrigin: "right center",
          },
          0,
        )
        .set(titleRefs.current, { yPercent: -100 }, 0)
        // delayed so the wipe re-covers the text before the panel leaves
        .to(
          overlayRef.current,
          {
            yPercent: -100,
            duration: TIMING.closeDuration,
            ease: "power4.inOut",
          },
          TIMING.closeOverlayDelay,
        )
        .set(curveRef.current, { display: "none" }, TIMING.curveHideAtClose);
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, reducedMotion]);

  useLayoutEffect(() => {
    if (!isOpen || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    if (
      !overlayRef.current ||
      !firstColumnRef.current ||
      !secondColumnRef.current
    )
      return;
    if (reducedMotion()) return;

    const menu = overlayRef.current;
    const firstColumn = firstColumnRef.current;
    const secondColumn = secondColumnRef.current;
    const swapDistance = COLUMN_BOTTOM_PERCENT - COLUMN_TOP_PERCENT;

    // first column now starts at the TOP, second column starts at the BOTTOM
    // (swapped from the original — keep these three spots in sync if you
    // ever flip it again: initial state, drift formula, mouse-leave reset)
    gsap.set(firstColumn, { yPercent: COLUMN_TOP_PERCENT });
    gsap.set(secondColumn, { yPercent: COLUMN_BOTTOM_PERCENT });

    const moveFirstColumn = gsap.quickTo(
      firstColumn,
      "yPercent",
      TIMING.imageDrift,
    );
    const moveSecondColumn = gsap.quickTo(
      secondColumn,
      "yPercent",
      TIMING.imageDrift,
    );

    const handleMouseMove = (event: MouseEvent) => {
      const mouseProgress = gsap.utils.clamp(
        0,
        1,
        event.clientY / window.innerHeight,
      );
      const swapProgress = gsap.utils.clamp(0, 1, (mouseProgress - 0.5) * 2);
      moveFirstColumn(COLUMN_BOTTOM_PERCENT - swapDistance * swapProgress);
      moveSecondColumn(COLUMN_TOP_PERCENT + swapDistance * swapProgress);
    };

    const handleMouseLeave = () => {
      moveFirstColumn(COLUMN_BOTTOM_PERCENT);
      moveSecondColumn(COLUMN_TOP_PERCENT);
    };

    menu.addEventListener("mousemove", handleMouseMove);
    menu.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      menu.removeEventListener("mousemove", handleMouseMove);
      menu.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf([firstColumn, secondColumn]);
    };
  }, [reducedMotion]);

  const handleImageEnter = useCallback((index: number | null) => {
    if (index === null) return;
    const image = imageRefs.current[index];
    if (!image) return;
    gsap.to(image, { filter: "grayscale(0%)", ...TIMING.imageHover });
  }, []);

  const handleImageLeave = useCallback((index: number | null) => {
    if (index === null) return;
    const image = imageRefs.current[index];
    if (!image) return;
    gsap.to(image, { filter: "grayscale(100%)", ...TIMING.imageHover });
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 overflow-visible bg-[#282C20]"
      inert={!isOpen ? true : undefined}
      aria-hidden={!isOpen}
    >
      <img
        src="/assets/menu-bg-pattern.png"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div
        ref={curveRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-full h-[90px] w-[115%] -translate-x-1/2 -translate-y-[45px] rounded-[50%] bg-[#282C20]"
      />

      <div
        ref={contentRef}
        className="relative z-10 grid min-h-screen grid-cols-1 md:grid-cols-2"
      >
        <div className="relative hidden min-h-screen overflow-hidden md:block">
          <div className="absolute inset-0 flex gap-4 px-6">
            <div ref={firstColumnRef} className="flex w-1/2 flex-col gap-4">
              <img
                ref={assignRef(imageRefs, 0)}
                src="/assets/track-image-1.webp"
                alt=""
                className="h-[42vh] w-full shrink-0 object-cover grayscale"
              />
              <img
                ref={assignRef(imageRefs, 1)}
                src="/assets/track-image-2.webp"
                alt=""
                className="h-[42vh] w-full shrink-0 object-cover grayscale"
              />
            </div>
            <div ref={secondColumnRef} className="flex w-1/2 flex-col gap-4">
              <img
                ref={assignRef(imageRefs, 2)}
                src="/assets/track-image-3.webp"
                alt=""
                className="h-[42vh] w-full shrink-0 object-cover grayscale"
              />
              <img
                ref={assignRef(imageRefs, 3)}
                src="/assets/track-image-4.webp"
                alt=""
                className="h-[42vh] w-full shrink-0 object-cover grayscale"
              />
            </div>
          </div>
        </div>

        <div className="flex min-h-screen flex-col items-center px-6 py-24 md:px-10 md:py-10">
          <div className="flex w-full max-w-[600px] flex-1 flex-col items-center justify-center">
            <img
              src="/assets/home.png"
              alt=""
              className=" h-12 w-18 object-contain  md:h-16 md:w-36"
            />

            <nav className="flex w-full flex-col items-center">
              {NAV_ITEMS.map((item, i) => (
                <a
                  key={item.label}
                  href="#"
                  ref={
                    i === 0
                      ? (firstLinkRef as React.RefObject<HTMLAnchorElement>)
                      : undefined
                  }
                  className="w-full text-center"
                  onMouseEnter={() => handleImageEnter(item.hoverImageIndex)}
                  onMouseLeave={() => handleImageLeave(item.hoverImageIndex)}
                >
                  <div className="w-full overflow-hidden">
                    <div
                      ref={assignRef(titleRefs, i)}
                      className="flex justify-center"
                    >
                      <AnimatedText
                        text={item.label}
                        className="text-2xl font-bold uppercase tracking-tight text-white md:text-5xl"
                      />
                    </div>
                  </div>
                </a>
              ))}
            </nav>

            <div className="mt-10 flex w-full justify-center md:mt-12">
              <div className="w-full  text-center">
                <img
                  src="/assets/menu-logo.png"
                  alt="Vortex Racing"
                  className="mx-auto block w-[50px] md:w-[70px] object-contain"
                />
                <div className="relative inline-block">
                  <p className="mt-3 text-[6px] font-sans font-sans uppercase  text-white/70">
                    {TEAM_CAPTION}
                  </p>
                  <span
                    ref={assignRef(wipeRefs, TEAM_CAPTION_WIPE_INDEX)}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-[#D2FF00]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex w-full max-w-[600px] justify-center pb-4 md:mt-10">
            <nav className="flex flex-col items-center gap-2">
              <a href={`mailto:${BUSINESS_EMAIL}`} className="inline-block">
                <span className="relative inline-block">
                  <AnimatedText
                    text="BUSINESS ENQUIRIES"
                    className="text-sm font-medium uppercase tracking-wide text-white"
                  />
                  <span
                    ref={assignRef(wipeRefs, BUSINESS_WIPE_INDEX)}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-[#D2FF00]"
                  />
                </span>
              </a>

              <div className="flex items-center justify-center gap-3">
                {SOCIAL_LINKS.map((social, i) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <span className="relative inline-block">
                      <AnimatedText
                        text={social.label}
                        className="text-sm font-medium uppercase tracking-wide text-white"
                      />
                      <span
                        ref={assignRef(wipeRefs, SOCIAL_WIPE_OFFSET + i)}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-[#D2FF00]"
                      />
                    </span>
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOverlay;
