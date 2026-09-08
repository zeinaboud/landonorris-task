"use client";

import { useState } from "react";
import StoreButton from "./StoreButton";
import MenuButton from "./MenuButton";

import MenuOverlay from "./MenuOverlay";
import LandoLogo from "./Landologo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Full-screen menu */}
      <MenuOverlay isOpen={isMenuOpen} />

      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 w-full px-4 py-3">
        <div className="grid h-[130px] grid-cols-1 md:h-[60px] md:grid-cols-3">
          <div className="order-3 flex items-center justify-center md:order-1 md:items-start md:justify-start">
            <img
              src="/assets/lando-norris-text-mobile.svg"
              alt="Kairo Voss"
              className="block w-[120px]  object-contain md:hidden"
            />
            <img
              src="/assets/title.png"
              alt="Kairo Voss"
              className="hidden w-[120px] object-contain md:block"
            />
          </div>

          <div className="order-2 flex items-center justify-center md:order-2 md:items-start">
            <LandoLogo />
          </div>

          <div className="order-1 flex items-start justify-between md:order-3 md:justify-end md:gap-3">
            <StoreButton />

            <MenuButton
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen((prev) => !prev)}
            />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
