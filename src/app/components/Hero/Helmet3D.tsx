"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const VERTEX_SHADER = `
  varying vec3 vPosition;

  void main() {
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vPosition;

  uniform float uTime;
  uniform float uOpacity;

  void main() {
    float scanEffect = pow(fract(-vPosition.y * 10.0 - uTime), 4.0) * 0.1;
    float alpha = scanEffect * uOpacity;
    gl_FragColor = vec4(vec3(0.0), alpha);
  }
`;

const DESKTOP_BREAKPOINT = "(min-width: 1024px)";
const DESKTOP_SCALE = 30;
const MOBILE_SCALE = 23;

const HelmetModel = () => {
  const { scene } = useGLTF("/assets/hero/helmet-21.glb");
  const [isDesktop, setIsDesktop] = useState(false);

  // Track desktop/mobile breakpoint to adjust model scale
  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);
    const updateScreen = () => setIsDesktop(mediaQuery.matches);

    updateScreen();
    mediaQuery.addEventListener("change", updateScreen);
    return () => mediaQuery.removeEventListener("change", updateScreen);
  }, []);

  // Build a wireframe clone of the loaded model using the scan shader
  const wireframe = useMemo(() => {
    const group = new THREE.Group();

    scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      const geometry = object.geometry.clone();
      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthTest: true,
        depthWrite: false,
        wireframe: true,
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0.45 },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(object.position);
      mesh.rotation.copy(object.rotation);
      mesh.scale.copy(object.scale);

      group.add(mesh);
    });

    return group;
  }, [scene]);

  // Animate the scan shader each frame
  useFrame((state) => {
    wireframe.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;

      const material = object.material;
      if (material instanceof THREE.ShaderMaterial && material.uniforms.uTime) {
        material.uniforms.uTime.value = state.clock.getElapsedTime() * 0.8;
      }
    });
  });

  const scale = isDesktop ? DESKTOP_SCALE : MOBILE_SCALE;

  return (
    <group scale={scale} position={[0, 0, 0]}>
      <primitive object={wireframe} />
    </group>
  );
};

const Helmet3D = () => {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-screen -translate-x-1/2">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <HelmetModel />
      </Canvas>
    </div>
  );
};

useGLTF.preload("/assets/hero/helmet-21.glb");

export default Helmet3D;
