import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CelestialCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060509, 0.005);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 10;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // AMBIENT LIGHTS & DIRECT LIGHTS
    const ambientLight = new THREE.AmbientLight(0x1a1510, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc5a880, 3, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xb59670, 2, 50);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // 1. STARFIELD (8000+ points)
    const starsCount = 8000;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);

    const colorPalette = [
      new THREE.Color("#ffffff"), // Pure white
      new THREE.Color("#fbbf24"), // Gold
      new THREE.Color("#c5a880"), // Champagne
      new THREE.Color("#e5e0d8")  // Platinum
    ];

    for (let i = 0; i < starsCount; i++) {
      // Coordinate sphere
      const radius = 80 + Math.random() * 150;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random color from palette
      const mixColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = mixColor.r;
      colors[i * 3 + 1] = mixColor.g;
      colors[i * 3 + 2] = mixColor.b;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circular glowing star material using a Canvas texture
    const starCanvas = document.createElement("canvas");
    starCanvas.width = 16;
    starCanvas.height = 16;
    const starCtx = starCanvas.getContext("2d");
    if (starCtx) {
      const grad = starCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      starCtx.fillStyle = grad;
      starCtx.fillRect(0, 0, 16, 16);
    }
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 0.65,
      vertexColors: true,
      map: starTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 1.5 MAIN UNIFIED CELESTIAL GROUP (Used to position the sacred geometry, OM symbol, planets, and numbers collectively)
    const mainCelestialGroup = new THREE.Group();
    scene.add(mainCelestialGroup);

    // 2. ROTATING GLOWING SACRED GEOMETRY (Removed)
    // 3. (Empty)


    // MOUSE PARALLAX HANDLER
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // RESIZE HANDLER
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        renderer.setSize(w, h);
        const aspect = w / h;
        camera.aspect = aspect;
        
        // Portrait/narrow display adaptive camera distancing and alignment
        if (aspect < 1.0) {
          // Calculate custom depth to keep components/orbit lines fully visible
          camera.position.z = Math.max(10, Math.min(8.23 / aspect, 18));
          mainCelestialGroup.scale.set(0.40, 0.40, 0.40);
          mainCelestialGroup.position.x = 0.0;
          mainCelestialGroup.position.y = 2.4;
        } else {
          camera.position.z = 10;
          // Shift the entire celestial group just below the "Astrology Dial" tab
          mainCelestialGroup.scale.set(0.46, 0.46, 0.46);
          mainCelestialGroup.position.x = Math.min(aspect * 2.15, 4.3);
          mainCelestialGroup.position.y = 1.85;
        }

        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    const startTimeTicks = performance.now();

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTimeTicks) * 0.001;

      // Slow starfield spin
      starField.rotation.y = elapsedTime * 0.015;
      starField.rotation.x = elapsedTime * 0.005;

      // Smooth Mouse Parallax
      const targetCamX = mouseRef.current.x * 2.5;
      const targetCamY = mouseRef.current.y * 2.5;
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      
      // Look at the offset horizontal and vertical points to maintain correct prospective view
      camera.lookAt(mainCelestialGroup.position.x * 0.35, mainCelestialGroup.position.y * 0.35, 0);

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      // Dispose materials & geometries
      starGeometry.dispose();
      starMaterial.dispose();


      renderer.dispose();
    };
  }, []);

  return (
    <div
      id="celestial-canvas-container"
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
