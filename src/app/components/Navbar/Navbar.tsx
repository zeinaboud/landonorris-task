"use client";

import { useState } from "react";
import StoreButton from "./StoreButton";
import MenuButton from "./MenuButton";
import MenuOverlay from "./MenuOverlay";
import LandoLogo from "./Landologo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <MenuOverlay isOpen={isMenuOpen} onClose={handleCloseMenu} />

      <nav
        className="
          pointer-events-auto
          fixed
          inset-x-0
          top-0
          z-[99999]
          w-full
          px-4
          py-3
        "
      >
        <div className="grid h-[130px] grid-cols-1 md:h-[60px] md:grid-cols-3">
          {/* LEFT */}
          <div className="order-3 flex items-center justify-center md:order-1 md:items-start md:justify-start">
            <img
              src="/assets/lando-norris-text-mobile.svg"
              alt="Kairo Voss"
              className="block w-[120px] object-contain md:hidden"
            />

            <img
              src="/assets/title.png"
              alt="Kairo Voss"
              className="hidden w-[120px] object-contain md:block"
            />
          </div>

          {/* CENTER */}
          <div className="order-2 flex items-center justify-center md:order-2 md:items-start">
            <LandoLogo />
          </div>

          {/* RIGHT */}
          <div className="order-1 flex items-start justify-between md:order-3 md:justify-end md:gap-3">
            <StoreButton />

            <MenuButton isOpen={isMenuOpen} onToggle={handleToggleMenu} />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
