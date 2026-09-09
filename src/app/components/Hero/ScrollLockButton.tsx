"use client";

import { useEffect, useState } from "react";

const ScrollLockButton = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isLocked) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      html.style.overflow = "";
      body.style.overflow = "";
    }

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [isLocked]);

  const handleClick = () => {
    setIsLocked((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isLocked ? "Back to scroll" : "Tap to lock"}
      aria-pressed={isLocked}
      className="pointer-events-auto absolute bottom-5 right-5 z-[100] flex h-10 items-center md:hidden"
    >
      <span className="px-4 text-[9px] font-bold text-white uppercase tracking-[0.08em]">
        {isLocked ? "BACK TO SCROLL" : "TAP TO LOCK"}
      </span>

      <span className="flex h-10 w-10 items-center justify-center border-r border-black/20 rounded-[4px] bg-[#D2FF00] text-black">
        {isLocked ? (
          <span className="text-[16px] font-bold text-white leading-none">
            ×
          </span>
        ) : (
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute h-[1px] w-3 bg-white font-bold" />
            <span className="absolute h-3 w-[1px] bg-white font-bold" />
          </span>
        )}
      </span>
    </button>
  );
};

export default ScrollLockButton;
