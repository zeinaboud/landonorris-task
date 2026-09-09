"use client";

import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import * as THREE from "three";

type HeroMouseContextValue = {
  current: React.MutableRefObject<THREE.Vector2>;
  target: React.MutableRefObject<THREE.Vector2>;
  velocity: React.MutableRefObject<THREE.Vector2>;
  autoReveal: React.MutableRefObject<THREE.Vector2>;
};

const HeroMouseContext = createContext<HeroMouseContextValue | null>(null);

export const HeroMouseProvider = ({ children }: { children: ReactNode }) => {
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  const current = useRef(new THREE.Vector2(0.5, 0.5));

  const velocity = useRef(new THREE.Vector2(0, 0));

  const autoReveal = useRef(new THREE.Vector2(1.12, 0.2));

  const lastMouse = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;

      const y = 1 - event.clientY / window.innerHeight;

      target.current.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const startedAt = performance.now();

    const update = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const sweep = Math.cos(elapsed * 0.84);

      autoReveal.current.set(0.5 + sweep * 0.62, 0.5 - sweep * 0.3);

      // Smooth position
      current.current.lerp(target.current, 0.09);

      // Calculate velocity from smoothed position
      const dx = current.current.x - lastMouse.current.x;

      const dy = current.current.y - lastMouse.current.y;

      velocity.current.set(dx, dy);

      lastMouse.current.copy(current.current);

      // Slowly settle velocity
      velocity.current.multiplyScalar(0.92);

      animationFrame = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <HeroMouseContext.Provider
      value={{
        current,
        target,
        velocity,
        autoReveal,
      }}
    >
      {children}
    </HeroMouseContext.Provider>
  );
};

export const useHeroMouse = () => {
  const context = useContext(HeroMouseContext);

  if (!context) {
    throw new Error("useHeroMouse must be used inside HeroMouseProvider");
  }

  return context;
};
