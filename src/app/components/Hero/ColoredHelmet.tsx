"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ColoredHelmet = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // ==================================================
    // HELMET IMAGE POSITION / SIZE
    // ==================================================

    const HELMET_SCALE = 2.3;

    const HELMET_X = 0;

    const HELMET_Y = -0.4;

    // ==================================================
    // SCENE
    // ==================================================

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // ==================================================
    // TEXTURE
    // ==================================================

    const textureLoader = new THREE.TextureLoader();

    const helmetTexture = textureLoader.load(
      "/assets/hero/unvisible-helmet.png",
    );

    helmetTexture.minFilter = THREE.LinearFilter;

    helmetTexture.magFilter = THREE.LinearFilter;

    helmetTexture.wrapS = THREE.ClampToEdgeWrapping;

    helmetTexture.wrapT = THREE.ClampToEdgeWrapping;

    helmetTexture.colorSpace = THREE.SRGBColorSpace;

    // ==================================================
    // GEOMETRY
    // ==================================================

    const geometry = new THREE.PlaneGeometry(1, 1);

    // ==================================================
    // MATERIAL
    // ==================================================

    const material = new THREE.ShaderMaterial({
      transparent: true,

      depthWrite: false,

      depthTest: false,

      uniforms: {
        uTexture: {
          value: helmetTexture,
        },

        uTime: {
          value: 0,
        },

        uMouse: {
          value: new THREE.Vector2(0.5, 0.5),
        },

        uMouseVelocity: {
          value: new THREE.Vector2(0, 0),
        },

        uResolution: {
          value: new THREE.Vector2(
            container.clientWidth,
            container.clientHeight,
          ),
        },

        uRadius: {
          value: 0.105,
        },

        uSoftness: {
          value: 0.075,
        },
      },

      // ==================================================
      // VERTEX
      // ==================================================

      vertexShader: `

      varying vec2 vUv;

      void main() {

        vUv = uv;

        gl_Position =
          projectionMatrix *
          modelViewMatrix *
          vec4(
            position,
            1.0
          );
      }

    `,

      // ==================================================
      // FRAGMENT
      // ==================================================

      fragmentShader: `

      uniform sampler2D uTexture;

      uniform float uTime;

      uniform vec2 uMouse;

      uniform vec2 uMouseVelocity;

      uniform vec2 uResolution;

      uniform float uRadius;

      uniform float uSoftness;

      varying vec2 vUv;


      // ==================================================
      // RANDOM
      // ==================================================

      float random(vec2 p) {

        return fract(
          sin(
            dot(
              p,
              vec2(
                127.1,
                311.7
              )
            )
          )
          *
          43758.5453123
        );
      }


      // ==================================================
      // NOISE
      // ==================================================

      float noise(vec2 p) {

        vec2 i =
          floor(p);

        vec2 f =
          fract(p);


        f =
          f *
          f *
          (
            3.0 -
            2.0 *
            f
          );


        float a =
          random(i);

        float b =
          random(
            i +
            vec2(
              1.0,
              0.0
            )
          );

        float c =
          random(
            i +
            vec2(
              0.0,
              1.0
            )
          );

        float d =
          random(
            i +
            vec2(
              1.0,
              1.0
            )
          );


        return mix(
          mix(
            a,
            b,
            f.x
          ),
          mix(
            c,
            d,
            f.x
          ),
          f.y
        );
      }


      // ==================================================
      // MAIN
      // ==================================================

      void main() {

        // ----------------------------------------------
        // Helmet image
        // ----------------------------------------------

        vec4 image =
          texture2D(
            uTexture,
            vUv
          );


        // ----------------------------------------------
        // Cursor
        // ----------------------------------------------

        float aspect =
          uResolution.x /
          uResolution.y;


        vec2 relative =
          vUv -
          uMouse;


        relative.x *=
          aspect;


        // ----------------------------------------------
        // Mouse speed
        // ----------------------------------------------

        float speed =
          length(
            uMouseVelocity
          );


        speed =
          clamp(
            speed * 20.0,
            0.0,
            1.0
          );


        // ----------------------------------------------
        // Ellipse
        // ----------------------------------------------

        float radiusX =
          uRadius +
          speed * 0.035;


        float radiusY =
          uRadius * 0.88 +
          speed * 0.012;


        // ----------------------------------------------
        // Organic edge
        // ----------------------------------------------

        float angle =
          atan(
            relative.y,
            relative.x
          );


        float wave1 =
          sin(
            angle * 5.0 +
            uTime * 0.45
          );


        float wave2 =
          sin(
            angle * 8.0 -
            uTime * 0.30
          );


        float organic =
          noise(
            vUv * 4.0 +
            uTime * 0.04
          );


        float edge =
            wave1 * 0.018
          + wave2 * 0.010
          + (
              organic - 0.5
            )
            * 0.025;


        // ----------------------------------------------
        // Ellipse distance
        // ----------------------------------------------

        float ellipse =
          sqrt(
            pow(
              relative.x /
              radiusX,
              2.0
            )
            +
            pow(
              relative.y /
              radiusY,
              2.0
            )
          );


        ellipse +=
          edge;


        // ----------------------------------------------
        // Invisible reveal mask
        // ----------------------------------------------

        float reveal =
          1.0 -
          smoothstep(
            1.0,
            1.0 +
            uSoftness * 5.0,
            ellipse
          );


        reveal =
          clamp(
            reveal,
            0.0,
            1.0
          );


        // ----------------------------------------------
        // IMPORTANT
        //
        // No gray background.
        // No shadow.
        // No circle.
        //
        // Only the helmet image is revealed.
        // ----------------------------------------------

        gl_FragColor =
          vec4(
            image.rgb,
            image.a * reveal
          );
      }

    `,
    });

    // ==================================================
    // MESH
    // ==================================================

    const mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(HELMET_SCALE, HELMET_SCALE, 1);

    mesh.position.set(HELMET_X, HELMET_Y, 0);

    mesh.renderOrder = 30;

    scene.add(mesh);

    // ==================================================
    // MOUSE
    // ==================================================

    const targetMouse = new THREE.Vector2(0.5, 0.5);

    const currentMouse = new THREE.Vector2(0.5, 0.5);

    const targetVelocity = new THREE.Vector2(0, 0);

    const currentVelocity = new THREE.Vector2(0, 0);

    let lastX = 0.5;

    let lastY = 0.5;

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;

      const y = 1 - event.clientY / window.innerHeight;

      targetMouse.set(x, y);

      targetVelocity.set(x - lastX, y - lastY);

      lastX = x;

      lastY = y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ==================================================
    // RESIZE
    // ==================================================

    const handleResize = () => {
      const width = container.clientWidth;

      const height = container.clientHeight;

      renderer.setSize(width, height);

      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    // ==================================================
    // ANIMATION
    // ==================================================

    const clock = new THREE.Clock();

    let animationFrame = 0;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      material.uniforms.uTime.value = clock.getElapsedTime();

      // ----------------------------------------------
      // Smooth mouse
      // ----------------------------------------------

      currentMouse.lerp(targetMouse, 0.1);

      material.uniforms.uMouse.value.copy(currentMouse);

      // ----------------------------------------------
      // Smooth velocity
      // ----------------------------------------------

      currentVelocity.lerp(targetVelocity, 0.15);

      material.uniforms.uMouseVelocity.value.copy(currentVelocity);

      // Gradually stop velocity
      targetVelocity.multiplyScalar(0.82);

      renderer.render(scene, camera);
    };

    animate();

    // ==================================================
    // CLEANUP
    // ==================================================

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("resize", handleResize);

      geometry.dispose();

      material.dispose();

      helmetTexture.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="
     pointer-events-none
     absolute
     inset-0
     z-30
     h-full
     w-full
   "
    />
  );
};

export default ColoredHelmet;
