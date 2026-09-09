"use client";

import { useEffect, useRef } from "react";
import { Rive, StateMachineInput } from "@rive-app/canvas-lite";
import gsap from "gsap";

export default function NextRace() {
  const cardRef = useRef<HTMLDivElement>(null);
  const circuitCanvasRef = useRef<HTMLCanvasElement>(null);
  const helmetCanvasRef = useRef<HTMLCanvasElement>(null);

  const circuitRiveRef = useRef<Rive | null>(null);
  const helmetRiveRef = useRef<Rive | null>(null);

  useEffect(() => {
    if (!circuitCanvasRef.current || !helmetCanvasRef.current) return;

    const ctx = gsap.context(() => {
      if (!cardRef.current) return;

      gsap.fromTo(
        cardRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.75,
          ease: "power2.out",
        },
      );
    }, cardRef);

    // CIRCUIT
    const circuit = new Rive({
      src: "/assets/hero/rive/circuits.riv",
      canvas: circuitCanvasRef.current,
      autoplay: true,
      stateMachines: "circuits",
      onLoad: () => {
        const inputs = circuit.stateMachineInputs("circuits");

        if (!inputs) return;

        const silverstoneInput = inputs.find(
          (input) => input.name === "silverstone",
        );

        if (silverstoneInput && "value" in silverstoneInput) {
          (silverstoneInput as StateMachineInput).value = 1;
        }
      },
      onLoadError: (error) => {
        console.error("[NextRace] Failed to load circuit animation:", error);
      },
    });

    circuitRiveRef.current = circuit;

    // HELMET
    const helmet = new Rive({
      src: "/assets/hero/rive/reef.riv",
      canvas: helmetCanvasRef.current,
      autoplay: true,
      artboard: "helmet-reef",
      stateMachines: "helmet-reef_play",
      onLoadError: (error) => {
        console.error("[NextRace] Failed to load helmet animation:", error);
      },
    });

    helmetRiveRef.current = helmet;

    return () => {
      ctx.revert();
      circuit.cleanup();
      helmet.cleanup();

      circuitRiveRef.current = null;
      helmetRiveRef.current = null;
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="absolute bottom-5 left-5 z-50 h-[100px] w-[60px] text-[#535450] opacity-0 md:h-[244px] md:w-[119px]"
    >
      <img
        src="/assets/hero/next-rice.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      <div className="relative z-10 flex h-full w-full flex-col px-[7px] pt-[7px] pb-[7px] md:px-[10px] md:pt-[10px] md:pb-[9px]">
        <div className="flex h-[14px] items-start md:h-[18px]">
          <span className="font-mona text-[7px] font-bold uppercase leading-none md:text-[10px]">
            Next Race
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center">
          <div className="relative mt-[3px] h-[55px] w-[68px] md:mt-[4px] md:h-[75px] md:w-[92px]">
            <canvas
              ref={circuitCanvasRef}
              className="absolute inset-0 block h-full w-full"
            />
          </div>

          <div className="flex items-center justify-center gap-[2px] font-mona text-[7px] font-bold uppercase leading-none md:gap-[3px] md:text-[10px]">
            <span>Silverstone</span>
            <span>gp</span>
          </div>
        </div>

        <div className="mx-auto my-[6px] h-px w-[80%] bg-current md:my-[8px]" />

        <div className="flex flex-col items-center justify-center">
          <div className="relative h-[38px] w-[73px] md:h-[51px] md:w-[97px]">
            <canvas
              ref={helmetCanvasRef}
              className="absolute inset-0 block h-full w-full"
            />
          </div>

          <div className="mt-[2px] max-w-[95%] text-center font-mona text-[7px] font-bold uppercase leading-[0.9] md:mt-[3px] md:max-w-[95px] md:text-[10px]">
            <span>
              McLaren F1
              <br />
              since 2019
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
