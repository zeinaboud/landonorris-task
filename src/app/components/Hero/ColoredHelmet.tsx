"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useHeroMouse } from "./HeroMouse";

const MODEL_PATH = "/assets/hero/helmet-21.glb";

const BASE_COLOR =
  "/assets/hero/textures/helmet/webp/gold/Norris_Helmet_mat_BaseColor.webp";

const METALLIC =
  "/assets/hero/textures/helmet/webp/Norris_Helmet_mat_Metallic.webp";

const NORMAL =
  "/assets/hero/textures/helmet/webp/Norris_Helmet_mat_Normal.webp";

const ROUGHNESS =
  "/assets/hero/textures/helmet/webp/Norris_Helmet_mat_Roughness.webp";

function ColoredHelmetModel() {
  const { scene } = useGLTF(MODEL_PATH);

  const { current } = useHeroMouse();

  const { size } = useThree();

  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));

  const timeRef = useRef(0);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    const baseColor = loader.load(BASE_COLOR);
    const metallic = loader.load(METALLIC);
    const normal = loader.load(NORMAL);
    const roughness = loader.load(ROUGHNESS);

    // Base color needs sRGB
    baseColor.colorSpace = THREE.SRGBColorSpace;

    // Data textures stay linear
    metallic.colorSpace = THREE.NoColorSpace;

    normal.colorSpace = THREE.NoColorSpace;

    roughness.colorSpace = THREE.NoColorSpace;

    // GLB UV orientation
    baseColor.flipY = false;
    metallic.flipY = false;
    normal.flipY = false;
    roughness.flipY = false;

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }

      const material = new THREE.MeshStandardMaterial({
        map: baseColor,

        metalnessMap: metallic,

        normalMap: normal,

        roughnessMap: roughness,

        metalness: 1,

        roughness: 0.35,

        transparent: true,

        opacity: 1,

        depthTest: true,

        depthWrite: false,

        side: THREE.FrontSide,
      });

      material.onBeforeCompile = (shader) => {
        // -----------------------------------------
        // UNIFORMS
        // -----------------------------------------

        shader.uniforms.uRevealMouse = {
          value: new THREE.Vector2(0.5, 0.5),
        };

        shader.uniforms.uResolution = {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        };

        shader.uniforms.uRevealRadius = {
          value: 0.105,
        };

        shader.uniforms.uRevealSoftness = {
          value: 0.075,
        };

        shader.uniforms.uTime = {
          value: 0,
        };

        // -----------------------------------------
        // COMMON
        // -----------------------------------------

        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <common>",
          `
              #include <common>

              uniform vec2 uRevealMouse;

              uniform vec2 uResolution;

              uniform float uRevealRadius;

              uniform float uRevealSoftness;

              uniform float uTime;
            `,
        );

        // -----------------------------------------
        // ORGANIC REVEAL MASK
        // -----------------------------------------

        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <alphatest_fragment>",
          `
              // -----------------------------------
              // SCREEN SPACE
              // -----------------------------------

              vec2 screenUV =
                gl_FragCoord.xy /
                uResolution;


              // -----------------------------------
              // POSITION RELATIVE TO MOUSE
              // -----------------------------------

              vec2 p =
                screenUV -
                uRevealMouse;


              // Correct aspect ratio
              // so the blob doesn't become oval
              // because of the screen dimensions.

              p.x *=
                uResolution.x /
                uResolution.y;


              // Distance from mouse

              float distanceFromMouse =
                length(p);


              // Angle around mouse

              float angle =
                atan(
                  p.y,
                  p.x
                );


              // -----------------------------------
              // ORGANIC DISTORTION
              // -----------------------------------

              float distortion =
                  sin(
                    angle * 3.0 +
                    uTime * 1.4
                  ) * 0.018

                + sin(
                    angle * 5.0 -
                    uTime * 1.1
                  ) * 0.012

                + sin(
                    angle * 8.0 +
                    uTime * 0.8
                  ) * 0.008

                + sin(
                    angle * 13.0 -
                    uTime * 0.6
                  ) * 0.004;


              // -----------------------------------
              // SUBTLE RADIAL MOVEMENT
              // -----------------------------------

              float radialWave =
                sin(
                  distanceFromMouse * 28.0 -
                  uTime * 2.5
                ) * 0.004;


              // -----------------------------------
              // FINAL ORGANIC RADIUS
              // -----------------------------------

              float organicRadius =
                uRevealRadius +
                distortion +
                radialWave;


              // -----------------------------------
              // SOFT MASK
              // -----------------------------------

              float reveal =
                1.0 -
                smoothstep(
                  organicRadius,
                  organicRadius +
                    uRevealSoftness,
                  distanceFromMouse
                );


              // -----------------------------------
              // MOVING EDGE
              // -----------------------------------

              float edge =
                smoothstep(
                  organicRadius * 0.55,
                  organicRadius +
                    uRevealSoftness,
                  distanceFromMouse
                );


              float edgeWave =
                sin(
                  distanceFromMouse * 40.0 -
                  uTime * 3.5
                );


              reveal +=
                edgeWave *
                0.004 *
                edge;


              // -----------------------------------
              // CLAMP
              // -----------------------------------

              reveal =
                clamp(
                  reveal,
                  0.0,
                  1.0
                );


              // -----------------------------------
              // HIDE OUTSIDE MASK
              // -----------------------------------

              if (reveal <= 0.001) {
                discard;
              }


              // Apply reveal to material alpha

              diffuseColor.a *= reveal;


              #include <alphatest_fragment>
            `,
        );

        // Save compiled shader
        material.userData.shader = shader;
      };

      material.needsUpdate = true;

      object.material = material;

      materialsRef.current.push(material);
    });

    // -----------------------------------------
    // RESIZE
    // -----------------------------------------

    const handleResize = () => {
      materialsRef.current.forEach((material) => {
        const shader = material.userData.shader;

        if (!shader) {
          return;
        }

        shader.uniforms.uResolution.value.set(
          window.innerWidth,
          window.innerHeight,
        );
      });
    };

    window.addEventListener("resize", handleResize);

    // -----------------------------------------
    // CLEANUP
    // -----------------------------------------

    return () => {
      window.removeEventListener("resize", handleResize);

      materialsRef.current.forEach((material) => {
        material.dispose();
      });

      baseColor.dispose();

      metallic.dispose();

      normal.dispose();

      roughness.dispose();

      materialsRef.current = [];
    };
  }, [scene]);

  // -----------------------------------------
  // MOUSE + ANIMATION
  // -----------------------------------------

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime();

    const targetX = current.current.x;

    const targetY = 1 - current.current.y;

    // Smooth mouse movement

    smoothMouse.current.x = THREE.MathUtils.lerp(
      smoothMouse.current.x,
      targetX,
      0.12,
    );

    smoothMouse.current.y = THREE.MathUtils.lerp(
      smoothMouse.current.y,
      targetY,
      0.12,
    );

    // Update shaders

    materialsRef.current.forEach((material) => {
      const shader = material.userData.shader;

      if (!shader) {
        return;
      }

      shader.uniforms.uRevealMouse.value.copy(smoothMouse.current);

      shader.uniforms.uTime.value = timeRef.current;

      shader.uniforms.uResolution.value.set(size.width, size.height);
    });
  });

  // -----------------------------------------
  // HELMET SCALE
  // -----------------------------------------

  const scale = size.width >= 1024 ? 30 : 23;

  return (
    <group scale={scale} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// -----------------------------------------
// COMPONENT
// -----------------------------------------

export default function ColoredHelmet() {
  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-30
      "
    >
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 35,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        {/* Main light */}

        <ambientLight intensity={1.8} />

        {/* Front/right light */}

        <directionalLight position={[3, 5, 5]} intensity={3} />

        {/* Secondary light */}

        <directionalLight position={[-4, 2, 3]} intensity={1.5} />

        <ColoredHelmetModel />
      </Canvas>
    </div>
  );
}

// Preload GLB

useGLTF.preload(MODEL_PATH);
