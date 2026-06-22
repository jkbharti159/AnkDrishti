import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeDPlanetProps {
  planetName: string; // "Mars" | "Venus" | "Mercury" | "Moon" | "Sun" | "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto/Mars"
}

export default function ThreeDPlanet({ planetName }: ThreeDPlanetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 160;
    const height = container.clientHeight || 160;

    // 1. Scene, Camera, and Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffbf0, 1.8);
    mainLight.position.set(5, 3, 5);
    scene.add(mainLight);

    const backlight = new THREE.PointLight(0xa58860, 0.8, 10);
    backlight.position.set(-5, -2, -3);
    scene.add(backlight);

    // 3. Helper to create beautiful procedural planet textures on canvas
    const getProceduralTexture = (name: string): THREE.Texture => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();

      // Clean background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 256);

      const normalizedPlanet = name.toLowerCase();

      if (normalizedPlanet.includes("sun")) {
        // Blazing sun solar flares
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, "#b45309"); // Dark orange
        grad.addColorStop(0.5, "#ea580c"); // Rich orange-red
        grad.addColorStop(1, "#f59e0b"); // Yellow-gold
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 256);

        // Add solar granular flares and active spots
        for (let i = 0; i < 120; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 256;
          const r = 4 + Math.random() * 18;
          ctx.beginPath();
          const radialGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
          radialGrad.addColorStop(0, "#fef08a"); // Glowing bright yellow
          radialGrad.addColorStop(0.4, "#facc15");
          radialGrad.addColorStop(1, "transparent");
          ctx.fillStyle = radialGrad;
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (normalizedPlanet.includes("moon")) {
        // Silver surface with maria and crater distributions
        ctx.fillStyle = "#a1a1aa"; // Base silver gray
        ctx.fillRect(0, 0, 512, 256);

        // Maria (dark lunar plains)
        const mariaColors = ["#71717a", "#52525b", "#3f3f46"];
        for (let i = 0; i < 15; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 256;
          const rx = 30 + Math.random() * 70;
          const ry = 15 + Math.random() * 35;
          ctx.beginPath();
          const radial = ctx.createRadialGradient(x, y, 0, x, y, rx);
          radial.addColorStop(0, mariaColors[Math.floor(Math.random() * mariaColors.length)]);
          radial.addColorStop(1, "transparent");
          ctx.fillStyle = radial;
          ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
          ctx.fill();
        }

        // Craters (bright spots with white halos)
        for (let i = 0; i < 45; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 256;
          const r = 2 + Math.random() * 8;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = "#e4e4e7"; // Crater rim
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = "#71717a"; // Crater depth shadow
          ctx.fill();
        }
      } else if (normalizedPlanet.includes("mars")) {
        // Rust Red surface with dark iron basins and icy polar poles
        ctx.fillStyle = "#9a3412"; // Mars rust red
        ctx.fillRect(0, 0, 512, 256);

        // Dark iron basins
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 256;
          const r = 20 + Math.random() * 45;
          const radial = ctx.createRadialGradient(x, y, 0, x, y, r);
          radial.addColorStop(0, "rgba(50, 15, 5, 0.65)");
          radial.addColorStop(1, "transparent");
          ctx.fillStyle = radial;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Polar ice caps (at very top and very bottom margins)
        ctx.fillStyle = "#f8fafc";
        // Top cap
        ctx.beginPath();
        ctx.ellipse(256, 10, 80, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        // Bottom cap
        ctx.beginPath();
        ctx.ellipse(256, 246, 80, 20, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (normalizedPlanet.includes("jupiter")) {
        // Jovian stripes and Great Red Spot
        ctx.fillStyle = "#d97706"; // Light ochre gold
        ctx.fillRect(0, 0, 512, 256);

        // Layered wind bands of varying colors
        const bands = [
          { y: 20, h: 25, color: "#78350f" },
          { y: 55, h: 15, color: "#fef3c7" },
          { y: 80, h: 35, color: "#92400e" },
          { y: 130, h: 30, color: "#fde68a" },
          { y: 170, h: 25, color: "#b45309" },
          { y: 210, h: 20, color: "#d97706" }
        ];

        bands.forEach(b => {
          ctx.fillStyle = b.color;
          ctx.fillRect(0, b.y, 512, b.h);

          // Add turbulent wind ripples along the borders
          for (let step = 0; step < 512; step += 16) {
            ctx.beginPath();
            ctx.arc(step + Math.random() * 8, b.y + b.h / 2, 8 + Math.random() * 12, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // The Great Red Spot
        ctx.beginPath();
        const spotX = 360;
        const spotY = 165;
        const grsRad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 32);
        grsRad.addColorStop(0, "#be123c"); // Vivid crimson
        grsRad.addColorStop(0.5, "#991b1b"); // Deep ruby
        grsRad.addColorStop(1, "transparent");
        ctx.fillStyle = grsRad;
        ctx.ellipse(spotX, spotY, 34, 18, 0.08, 0, Math.PI * 2);
        ctx.fill();
      } else if (normalizedPlanet.includes("saturn")) {
        // Soft amber-bronze banding
        ctx.fillStyle = "#ca8a04";
        ctx.fillRect(0, 0, 512, 256);

        const bands = [
          { y: 10, h: 40, color: "#a16207" },
          { y: 65, h: 30, color: "#eab308" },
          { y: 110, h: 50, color: "#fef08a" },
          { y: 170, h: 35, color: "#ca8a04" },
          { y: 220, h: 25, color: "#854d0e" }
        ];

        bands.forEach(b => {
          ctx.fillStyle = b.color;
          ctx.fillRect(0, b.y, 512, b.h);
        });
      } else if (normalizedPlanet.includes("venus")) {
        // Acidic dense gold/sulfuric cloud cover
        ctx.fillStyle = "#eab308";
        ctx.fillRect(0, 0, 512, 256);

        // High altitude sulfur wind streaks
        for (let i = 0; i < 15; i++) {
          const cy = 40 + Math.random() * 180;
          const h = 10 + Math.random() * 30;
          const grad = ctx.createLinearGradient(0, cy, 512, cy + h);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.3, "rgba(254, 240, 138, 0.75)");
          grad.addColorStop(0.7, "rgba(202, 138, 4, 0.55)");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.fillRect(0, cy, 512, h);
        }
      } else if (normalizedPlanet.includes("uranus")) {
        // Pale cyan-teal hazy ice giant
        ctx.fillStyle = "#06b6d4";
        ctx.fillRect(0, 0, 512, 256);

        // Subtle gradient layers
        const grad = ctx.createLinearGradient(0, 0, 512, 256);
        grad.addColorStop(0, "rgba(34, 211, 238, 0.55)");
        grad.addColorStop(1, "rgba(8, 145, 178, 0.75)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 256);
      } else if (normalizedPlanet.includes("neptune")) {
        // Royal wind-swept cobalt blue and methane clouds
        ctx.fillStyle = "#1d4ed8";
        ctx.fillRect(0, 0, 512, 256);

        // White methane wisps
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          const startY = 30 + Math.random() * 180;
          ctx.moveTo(0, startY);
          ctx.bezierCurveTo(128, startY + 20, 384, startY - 20, 512, startY + 10);
          ctx.stroke();
        }

        // Great Dark Spot
        ctx.beginPath();
        const spotX = 180;
        const spotY = 140;
        const grsRad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, 30);
        grsRad.addColorStop(0, "#1e3a8a");
        grsRad.addColorStop(0.6, "rgba(29, 78, 216, 0.8)");
        grsRad.addColorStop(1, "transparent");
        ctx.fillStyle = grsRad;
        ctx.ellipse(spotX, spotY, 36, 22, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (normalizedPlanet.includes("mercury")) {
        // Steel grey heavily cratered rocky core
        ctx.fillStyle = "#52525b";
        ctx.fillRect(0, 0, 512, 256);

        // Heavy crater pockmarks
        for (let i = 0; i < 60; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 256;
          const r = 2 + Math.random() * 6;
          ctx.fillStyle = "rgba(39, 39, 42, 0.8)";
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(161, 161, 170, 0.4)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(x, y, r + 1, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        // Pluto / Dark star: enigmatic indigo-violet heart patchwork
        ctx.fillStyle = "#1e1b4b"; // Dark purple
        ctx.fillRect(0, 0, 512, 256);

        // Violet fog
        for (let i = 0; i < 8; i++) {
          ctx.beginPath();
          const x = Math.random() * 512;
          const y = Math.random() * 256;
          const gr = ctx.createRadialGradient(x, y, 0, x, y, 60);
          gr.addColorStop(0, "rgba(139, 92, 246, 0.45)");
          gr.addColorStop(1, "transparent");
          ctx.fillStyle = gr;
          ctx.arc(x, y, 60, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pluto's Heart (Tombaugh Regio)
        ctx.fillStyle = "#f5f3ff";
        ctx.beginPath();
        // Drawing a Heart form
        const hX = 260;
        const hY = 150;
        ctx.moveTo(hX, hY);
        ctx.bezierCurveTo(hX - 15, hY - 30, hX - 45, hY - 15, hX - 45, hY + 15);
        ctx.bezierCurveTo(hX - 45, hY + 35, hX - 15, hY + 50, hX, hY + 68);
        ctx.bezierCurveTo(hX + 15, hY + 50, hX + 45, hY + 35, hX + 45, hY + 15);
        ctx.bezierCurveTo(hX + 45, hY - 15, hX + 15, hY - 30, hX, hY);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    // 4. Create Planet Mesh Sphere
    const planetTexture = getProceduralTexture(planetName);
    const sphereGeometry = new THREE.SphereGeometry(1.2, 48, 48);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: planetTexture,
      shininess: planetName.toLowerCase().includes("sun") ? 0 : 25,
      bumpScale: 0.05,
      specular: new THREE.Color(0x333333),
    });

    const planetMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(planetMesh);

    // 5. Special Adornments (Rings for Saturn, corona for Sun)
    let extraGroup = new THREE.Group();
    scene.add(extraGroup);

    const normName = planetName.toLowerCase();
    if (normName.includes("saturn")) {
      // Saturn's gorgeous dual rings (using a flat RingGeometry)
      const ringGeometry = new THREE.RingGeometry(1.6, 2.7, 64);
      
      // Orient the ring geometry so we map U-V concentric coordinate textures
      const pos = ringGeometry.attributes.position;
      const uvs = ringGeometry.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const distance = Math.sqrt(x * x + y * y);
        
        // Map concentric distance as uv coordinates
        // distance between 1.6 and 2.7 normalized to 0.0 -> 1.0
        const normDist = (distance - 1.6) / 1.1; 
        uvs.setXY(i, normDist, 0.5);
      }
      uvs.needsUpdate = true;

      // Draw a concentric ring band texture and bind it
      const ringCanvas = document.createElement("canvas");
      ringCanvas.width = 256;
      ringCanvas.height = 16;
      const rCtx = ringCanvas.getContext("2d");
      if (rCtx) {
        rCtx.fillStyle = "#1e1b4b"; // transparency background
        rCtx.fillRect(0, 0, 256, 16);

        // Draw concentric gold rings of opacity
        const rGrad = rCtx.createLinearGradient(0, 0, 256, 0);
        rGrad.addColorStop(0, "rgba(234, 179, 8, 0.1)");
        rGrad.addColorStop(0.15, "rgba(217, 119, 6, 0.75)"); // A ring
        rGrad.addColorStop(0.48, "rgba(0, 0, 0, 0)"); // Cassini Division
        rGrad.addColorStop(0.53, "rgba(251, 191, 36, 0.9)"); // B ring
        rGrad.addColorStop(0.85, "rgba(161, 98, 7, 0.6)");
        rGrad.addColorStop(1.0, "rgba(251, 191, 36, 0.1)");
        rCtx.fillStyle = rGrad;
        rCtx.fillRect(0, 0, 256, 16);
      }
      const ringTexture = new THREE.CanvasTexture(ringCanvas);

      const ringMaterial = new THREE.MeshPhongMaterial({
        map: ringTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });

      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
      // Tilt Saturn rings (classic 27 degree tilt)
      ringMesh.rotation.x = Math.PI / 2 + 0.35;
      ringMesh.rotation.y = 0.2;
      extraGroup.add(ringMesh);
    } else if (normName.includes("sun")) {
      // High-frequency solar pulsing outer halo/atmosphere mesh
      const coronaGeo = new THREE.SphereGeometry(1.35, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xf97316,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      extraGroup.add(coronaMesh);

      // Sun halo points
      const sunParticlesCount = 80;
      const sunPartGeo = new THREE.BufferGeometry();
      const sunPartPositions = new Float32Array(sunParticlesCount * 3);
      const sunPartSpeeds: number[] = [];

      for (let i = 0; i < sunParticlesCount; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2 * Math.PI;
        const phi = Math.acos(2 * v - 1);
        const radius = 1.3 + Math.random() * 0.4;

        sunPartPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        sunPartPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        sunPartPositions[i * 3 + 2] = radius * Math.cos(phi);

        sunPartSpeeds.push(0.3 + Math.random() * 0.7);
      }

      sunPartGeo.setAttribute("position", new THREE.BufferAttribute(sunPartPositions, 3));
      const sunPartMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xfacc15,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });
      const sunPoints = new THREE.Points(sunPartGeo, sunPartMat);
      extraGroup.add(sunPoints);
    } else {
      // Ambient atmospheric dust rings around normal celestial bodies
      const dustCount = 120;
      const dustGeo = new THREE.BufferGeometry();
      const dustPositions = new Float32Array(dustCount * 3);

      const ringColor = normName.includes("mars") 
        ? new THREE.Color("#ef4444") 
        : normName.includes("neptune") 
        ? new THREE.Color("#60a5fa") 
        : new THREE.Color("#c5a880");

      for (let i = 0; i < dustCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 1.6 + Math.random() * 0.6;
        dustPositions[i * 3] = rad * Math.cos(angle);
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
        dustPositions[i * 3 + 2] = rad * Math.sin(angle);
      }

      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      const dustMat = new THREE.PointsMaterial({
        size: 0.045,
        color: ringColor,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const dustPoints = new THREE.Points(dustGeo, dustMat);
      dustPoints.rotation.x = 0.25; // tilt slightly
      extraGroup.add(dustPoints);
    }

    // 6. Interactive Drag Controls properties
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handlePointerDown = () => {
      isDragging = true;
      setIsRotating(false);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y,
      };

      if (isDragging) {
        const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            (deltaMove.y / 180) * Math.PI * 0.6,
            (deltaMove.x / 180) * Math.PI * 0.6,
            0,
            "XYZ"
          )
        );
        planetMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, planetMesh.quaternion);
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY,
      };
    };

    const handlePointerUp = () => {
      isDragging = false;
      // timeout rotation resumption
      setTimeout(() => {
        setIsRotating(true);
      }, 3500);
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // 7. Animation Loop
    const startTime = performance.now();
    let animId: number;

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const elapsed = (performance.now() - startTime) * 0.001;

      // Auto rotation
      if (isRotating && !isDragging) {
        planetMesh.rotation.y += 0.009;
        extraGroup.rotation.y += 0.003;
      }

      // Corona pulse
      if (normName.includes("sun")) {
        const corona = extraGroup.children[0] as THREE.Mesh;
        if (corona) {
          const s = 1.0 + Math.sin(elapsed * 2.5) * 0.05;
          corona.scale.set(s, s, s);
        }
      }

      renderer.render(scene, camera);
    };

    tick();

    // 8. Cleanup and disposal
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // dispose resources
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      planetTexture.dispose();
      try {
        renderer.forceContextLoss();
      } catch (e) {
        console.warn("Context loss not supported", e);
      }
      renderer.dispose();
    };
  }, [planetName, isRotating]);

  return (
    <div className="relative w-full h-[155px] flex items-center justify-center rounded-xl bg-[#030206]/40 border border-zinc-850 overflow-hidden select-none cursor-grab active:cursor-grabbing group">
      
      {/* 3D Container viewport */}
      <div ref={containerRef} className="w-[155px] h-[155px]" />

      {/* Tiny instructions tag overlay */}
      <div className="absolute bottom-1 px-2 py-0.5 rounded bg-[#09080c]/80 border border-zinc-800/65 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[7.5px] font-mono uppercase tracking-widest text-amber-500/70">
          ◀ Drag Sphere to Orbit ▶
        </span>
      </div>

    </div>
  );
}
