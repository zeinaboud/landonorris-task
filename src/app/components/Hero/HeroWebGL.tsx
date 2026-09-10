"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useHeroMouse } from "./HeroMouse";

const HeroWebGL = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { autoReveal } = useHeroMouse();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xffffff, 1);
    container.appendChild(renderer.domElement);

    // Textures
    const setupTexture = (texture: THREE.Texture) => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.colorSpace = THREE.SRGBColorSpace;
    };

    const loader = new THREE.TextureLoader();
    const patternTexture = loader.load("/assets/patern-white.jpeg");
    const grayTexture = loader.load("/assets/pattern3-gray.jpg");

    setupTexture(patternTexture);
    setupTexture(grayTexture);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const material = new THREE.ShaderMaterial({
      transparent: false,
      depthWrite: false,
      uniforms: {
        uTexture: { value: patternTexture },
        uGrayTexture: { value: grayTexture },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uMouseVelocity: { value: new THREE.Vector2(0, 0) },
        uMouseSpeed: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(
            container.clientWidth,
            container.clientHeight,
          ),
        },
        uTextureResolution: { value: new THREE.Vector2(1, 1) },
        uRevealRadius: { value: 0.115 },
        uRevealSoftness: { value: 0.075 },
      },

      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,

      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uGrayTexture;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uMouseVelocity;
        uniform float uMouseSpeed;
        uniform vec2 uResolution;
        uniform vec2 uTextureResolution;
        uniform float uRevealRadius;
        uniform float uRevealSoftness;

        varying vec2 vUv;

        float random(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);

          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        // Layered sine/cosine field used to gently warp the background pattern
        float organicField(vec2 p, float offset, float speed) {
          float t = uTime * speed;

          float a = sin(p.x * 4.0 + p.y * 2.7 + t + offset);
          float b = cos(p.x * 2.4 - p.y * 5.0 - t * 0.8 + offset);
          float c = sin((p.x - p.y) * 3.2 + t * 0.55 + offset);

          return a * 0.45 + b * 0.35 + c * 0.20;
        }

        // Warps the background UVs with organic fields plus a set of pulsing bubbles
        vec2 localDeformation(vec2 uv) {
          float t = uTime * 0.8;

          float field1 = organicField(uv, 0.0, 0.55);
          float field2 = organicField(uv * 1.35, 2.7, 0.42);
          float field3 = organicField(uv * 0.72, 5.4, 0.32);

          float breathe = sin(uv.x * 5.5 + uv.y * 4.0 + t * 1.4);
          float stretchX = sin(uv.y * 7.0 + t * 1.1);
          float stretchY = cos(uv.x * 6.0 - t * 0.95);

          float deformation = field1 * 0.45 + field2 * 0.30 + field3 * 0.25;
          float amount = deformation * 0.015;

          vec2 result = uv;
          result.x += amount + stretchX * breathe * 0.008;
          result.y += amount * 0.85 + stretchY * breathe * 0.008;

          // Organic bubbles
          vec2 centers[5];
          centers[0] = vec2(0.20, 0.72);
          centers[1] = vec2(0.48, 0.35);
          centers[2] = vec2(0.76, 0.68);
          centers[3] = vec2(0.32, 0.20);
          centers[4] = vec2(0.82, 0.25);

          float radii[5];
          radii[0] = 0.34;
          radii[1] = 0.31;
          radii[2] = 0.36;
          radii[3] = 0.30;
          radii[4] = 0.33;

          float pulseSpeed[5];
          pulseSpeed[0] = 2.0;
          pulseSpeed[1] = 1.7;
          pulseSpeed[2] = 2.2;
          pulseSpeed[3] = 1.55;
          pulseSpeed[4] = 1.9;

          float pulsePhase[5];
          pulsePhase[0] = 1.0;
          pulsePhase[1] = 2.4;
          pulsePhase[2] = 4.1;
          pulsePhase[3] = 5.3;
          pulsePhase[4] = 7.0;

          float pulseStrength[5];
          pulseStrength[0] = 0.018;
          pulseStrength[1] = 0.020;
          pulseStrength[2] = 0.017;
          pulseStrength[3] = 0.018;
          pulseStrength[4] = 0.017;

          for (int i = 0; i < 5; i++) {
            float d = distance(uv, centers[i]);
            float influence = 1.0 - smoothstep(0.01, radii[i], d);
            float pulse = sin(t * pulseSpeed[i] + pulsePhase[i]);
            vec2 dir = normalize(uv - centers[i] + vec2(0.0001));

            result += dir * influence * pulse * pulseStrength[i];
          }

          float squeeze = sin(uv.x * 8.0 + uv.y * 5.0 + t * 1.2);
          float squeeze2 = cos(uv.y * 7.0 - uv.x * 4.0 - t);

          result.x += squeeze * 0.0035;
          result.y += squeeze2 * 0.0035;

          return result;
        }

        // Builds the liquid cursor mask, stretched and trailed by mouse velocity
        float liquidReveal(vec2 uv) {
          float aspect = uResolution.x / uResolution.y;

          vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);
          vec2 mouse = vec2((uMouse.x - 0.5) * aspect, uMouse.y);
          vec2 delta = p - mouse;

          vec2 velocity = vec2(uMouseVelocity.x * aspect, uMouseVelocity.y);
          float speed = length(velocity);

          vec2 direction = speed > 0.0001 ? normalize(velocity) : vec2(1.0, 0.0);
          vec2 perpendicular = vec2(-direction.y, direction.x);

          float stretch = 1.0 + clamp(speed * 55.0, 0.0, 2.8);
          float along = dot(delta, direction);
          float across = dot(delta, perpendicular);

          float stretchedDistance = sqrt((along / stretch) * (along / stretch) + across * across);

          // Trail behind the cursor based on speed
          float trail = clamp(speed * 28.0, 0.0, 1.8);
          float forward = dot(delta, direction);
          float trailingPull = max(forward, 0.0) * trail * 0.38;

          stretchedDistance -= trailingPull;

          // Organic edge noise
          float largeNoise = noise(p * 4.5 + mouse * 1.8 + uTime * 0.08);
          float mediumNoise = noise(p * 8.0 - mouse * 1.2 - uTime * 0.05);
          float smallNoise = noise(p * 15.0 - mouse * 2.5);

          float organicOffset =
            (largeNoise - 0.5) * 0.050 +
            (mediumNoise - 0.5) * 0.025 +
            (smallNoise - 0.5) * 0.012;

          float organicDistance = stretchedDistance + organicOffset;

          float dynamicRadius = uRevealRadius + clamp(speed * 0.35, 0.0, 0.035);

          float reveal = 1.0 - smoothstep(dynamicRadius, dynamicRadius + uRevealSoftness, organicDistance);

          return clamp(reveal, 0.0, 1.0);
        }

        void main() {
          // Background deformation
          vec2 uv = localDeformation(vUv);
          uv = 0.5 + (uv - 0.5) * 0.70;

          // Correct UVs for texture aspect ratio
          float textureRatio = uTextureResolution.x / uTextureResolution.y;
          float screenRatio = uResolution.x / uResolution.y;
          vec2 correctedUv = uv;

          if (screenRatio > textureRatio) {
            float scale = textureRatio / screenRatio;
            correctedUv.x = 0.5 + (uv.x - 0.5) * scale;
          } else {
            float scale = screenRatio / textureRatio;
            correctedUv.y = 0.5 + (uv.y - 0.5) * scale;
          }

          vec4 original = texture2D(uTexture, correctedUv);
          vec4 gray = texture2D(uGrayTexture, correctedUv);

          float reveal = liquidReveal(vUv);

          // Outside the cursor bubble: colored pattern. Inside: gray pattern.
          vec3 finalColor = mix(original.rgb, gray.rgb, reveal);

          // Keep the shader fully opaque so the white renderer background
          // stays behind the pattern instead of making it disappear.
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse tracking
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const currentMouse = new THREE.Vector2(0.5, 0.5);
    const lastCurrentMouse = new THREE.Vector2(0.5, 0.5);
    const mouseVelocity = new THREE.Vector2(0, 0);
    const revealMouse = new THREE.Vector2(0.5, 0.5);
    let mouseSpeed = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = 1 - event.clientY / window.innerHeight;
      targetMouse.set(x, y);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize
    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation
    const clock = new THREE.Clock();
    let animationFrame = 0;
    let textureResolutionSet = false;

    const animate = () => {
      animationFrame = requestAnimationFrame(animate);

      material.uniforms.uTime.value = clock.getElapsedTime();

      if (
        !textureResolutionSet &&
        patternTexture.image?.width &&
        patternTexture.image?.height
      ) {
        material.uniforms.uTextureResolution.value.set(
          patternTexture.image.width,
          patternTexture.image.height,
        );
        textureResolutionSet = true;
      }

      // Smooth cursor and derive velocity/speed from the movement delta
      currentMouse.lerp(targetMouse, 0.09);

      const dx = currentMouse.x - lastCurrentMouse.x;
      const dy = currentMouse.y - lastCurrentMouse.y;

      const newVelocity = new THREE.Vector2(dx, dy);
      mouseVelocity.lerp(newVelocity, 0.55);
      mouseVelocity.multiplyScalar(0.97);

      const instantSpeed = Math.sqrt(dx * dx + dy * dy);
      mouseSpeed = THREE.MathUtils.lerp(
        mouseSpeed,
        Math.min(instantSpeed * 5, 0.08),
        0.5,
      );
      mouseSpeed *= 0.9;

      lastCurrentMouse.copy(currentMouse);

      // Update shader uniforms
      revealMouse.copy(autoReveal.current).lerp(currentMouse, 0.55);
      material.uniforms.uMouse.value.copy(revealMouse);
      material.uniforms.uMouseVelocity.value.copy(mouseVelocity);
      material.uniforms.uMouseSpeed.value = mouseSpeed;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();
      material.dispose();
      patternTexture.dispose();
      grayTexture.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoReveal]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
};

export default HeroWebGL;
