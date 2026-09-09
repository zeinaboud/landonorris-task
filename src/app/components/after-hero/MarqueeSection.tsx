"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const MarqueeSection = () => {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;

    if (!topRow || !bottomRow) return;

    const ctx = gsap.context(() => {
      // ============================================================
      // ON TRACK
      // RIGHT → LEFT
      // ============================================================

      gsap.fromTo(
        topRow,
        {
          xPercent: 0,
        },
        {
          xPercent: -50,
          duration: 14,
          ease: "none",
          repeat: -1,
        },
      );

      // ============================================================
      // OFF TRACK
      // LEFT → RIGHT
      // ============================================================

      gsap.fromTo(
        bottomRow,
        {
          xPercent: -50,
        },
        {
          xPercent: 0,
          duration: 14,
          ease: "none",
          repeat: -1,
        },
      );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-10
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      <div className="w-full">
        {/* ========================================================
            ON TRACK
            YELLOW
            RIGHT → LEFT
        ======================================================== */}

        <div className="w-full overflow-hidden whitespace-nowrap">
          <div ref={topRowRef} className="flex w-max">
            {/* COPY 1 */}

            <div className="flex shrink-0">
              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>
            </div>

            {/* COPY 2 */}

            <div className="flex shrink-0">
              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-yellow-400
                "
              >
                ON TRACK
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            OFF TRACK
            BLACK
            LEFT → RIGHT
        ======================================================== */}

        <div className="mt-2 w-full overflow-hidden whitespace-nowrap">
          <div ref={bottomRowRef} className="flex w-max">
            {/* COPY 1 */}

            <div className="flex shrink-0">
              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>
            </div>

            {/* COPY 2 */}

            <div className="flex shrink-0">
              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>

              <span
                className="
                  mx-6
                  text-[clamp(48px,6vw,110px)]
                  font-bold
                  leading-none
                  tracking-[-0.04em]
                  text-black
                "
              >
                OFF TRACK
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarqueeSection;
