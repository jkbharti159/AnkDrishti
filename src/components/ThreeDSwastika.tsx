import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeDSwastikaProps {
  intensity?: "low" | "medium" | "high";
  animState?: "idle" | "checking" | "merged" | "repelled";
}

export default function ThreeDSwastika({
  intensity = "medium",
  animState = "idle"
}: ThreeDSwastikaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 240;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 5.0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.45);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffd700, 2.2);
    mainLight.position.set(5, 5, 4);
    scene.add(mainLight);

    const pointGlow = new THREE.PointLight(0xf59e0b, 1.5, 10);
    pointGlow.position.set(0, 0, 1);
    scene.add(pointGlow);

    // 3. Create the 3D Swastika Group
    const swastikaGroup = new THREE.Group();
    scene.add(swastikaGroup);

    // Dimensions
    const L = 0.9;         // Arm length scale
    const t = 0.14;        // Line thickness
    const d = 0.22;        // 3D thickness (depth)

    // Gold material with shiny specs and warm emission
    const goldMaterial = new THREE.MeshPhongMaterial({
      color: 0xf59e0b,
      emissive: 0x5c3a00,
      specular: 0xfffbeb,
      shininess: 90,
      transparent: true,
      opacity: 0.85
    });

    const geometriesToDispose: THREE.BufferGeometry[] = [];

    // Helper to add parts to the group
    const addBoxPart = (w: number, h: number, dp: number, px: number, py: number, pz: number) => {
      const geo = new THREE.BoxGeometry(w, h, dp);
      const mesh = new THREE.Mesh(geo, goldMaterial);
      mesh.position.set(px, py, pz);
      swastikaGroup.add(mesh);
      geometriesToDispose.push(geo);
    };

    // 1. Vertical centerpiece
    addBoxPart(t, 2 * L, d, 0, 0, 0);

    // 2. Horizontal centerpiece
    addBoxPart(2 * L, t, d, 0, 0, 0);

    // 3. Top right-bent arm (offset to overlap cleanly)
    addBoxPart(L + t / 2, t, d, L / 2 + t / 4, L, 0);

    // 4. Right bottom-bent arm
    addBoxPart(t, L + t / 2, d, L, -L / 2 - t / 4, 0);

    // 5. Bottom left-bent arm
    addBoxPart(L + t / 2, t, d, -L / 2 - t / 4, -L, 0);

    // 6. Left top-bent arm
    addBoxPart(t, L + t / 2, d, -L, L / 2 + t / 4, 0);

    // 4 Sacred Spherical Bindu Dots (spheres)
    const dotGeo = new THREE.SphereGeometry(0.1, 16, 16);
    geometriesToDispose.push(dotGeo);
    const dotMaterial = new THREE.MeshPhongMaterial({
      color: 0xffb000,
      emissive: 0x92400e,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });

    const dotOffset = L / 2;
    const dots = [
      { x: dotOffset, y: dotOffset },
      { x: dotOffset, y: -dotOffset },
      { x: -dotOffset, y: -dotOffset },
      { x: -dotOffset, y: dotOffset }
    ];

    dots.forEach((pos) => {
      const dotMesh = new THREE.Mesh(dotGeo, dotMaterial);
      dotMesh.position.set(pos.x, pos.y, t);
      swastikaGroup.add(dotMesh);
    });

    // 4. Celestial Rings in background around swastika
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const ringGeo1 = new THREE.RingGeometry(1.6, 1.62, 64);
    geometriesToDispose.push(ringGeo1);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xd97706,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.5;
    orbitGroup.add(ringMesh1);

    const ringGeo2 = new THREE.RingGeometry(2.1, 2.12, 64);
    geometriesToDispose.push(ringGeo2);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 3;
    orbitGroup.add(ringMesh2);

    // Dynamic scale down a tiny bit to sit nicely inside the parent
    swastikaGroup.scale.set(0.9, 0.9, 0.9);

    // 5. Watch for Parent Resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || width;
        const h = entry.contentRect.height || height;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(container);

    // 6. Animation Loop (Warning-safe ticks with performance.now)
    const startTime = performance.now();
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Base rotation rates
      let rotSpeed = 0.45;
      let pulseSpeed = 1.0;

      // Modify rotation and dynamics based on synastry animation states!
      if (animState === "checking") {
        rotSpeed = 2.4; // High energy spinning during fusion
        pulseSpeed = 4.0;
      } else if (animState === "merged") {
        rotSpeed = 0.2; // Calm unified slow rotation
        pulseSpeed = 0.6;
      } else if (animState === "repelled") {
        rotSpeed = -0.5; // Backwards friction lock rotation
        pulseSpeed = 2.0;
      }

      // 3D rotation of Symbol
      swastikaGroup.rotation.y = elapsed * rotSpeed;
      swastikaGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.25;
      swastikaGroup.rotation.z = Math.cos(elapsed * 0.15) * 0.1;

      // Background orbit rotation
      orbitGroup.rotation.y = -elapsed * 0.15;
      orbitGroup.rotation.z = elapsed * 0.08;

      // Cosmic breathing scale pulsation
      const baseScale = 0.9;
      const pulse = Math.sin(elapsed * 2.2 * pulseSpeed) * 0.06;
      const targetScale = baseScale + pulse;
      swastikaGroup.scale.set(targetScale, targetScale, targetScale);

      // Flashing dot intensity
      dotMaterial.opacity = 0.75 + Math.sin(elapsed * 4.0) * 0.15;

      renderer.render(scene, camera);
    };

    tick();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometriesToDispose.forEach((geo) => geo.dispose());
      goldMaterial.dispose();
      dotMaterial.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      try {
        renderer.forceContextLoss();
      } catch (e) {
        // Safe check
      }
      renderer.dispose();
    };
  }, [animState]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center z-0 opacity-40">
      <div ref={containerRef} className="w-full h-full min-h-[220px]" />
    </div>
  );
}
