import React, { useEffect, useState, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  maxLife: number;
  life: number;
  opacity: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(true);
  const particleIdRef = useRef(0);
  const lastMousePos = useRef({ x: -100, y: -100, time: 0 });

  useEffect(() => {
    // Check if device is mobile/touch
    const checkIsMobile = () => {
      const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(hasTouch);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    if (isMobile) return;

    // Track cursor moves
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const last = lastMousePos.current;
      const dt = Math.max(1, now - last.time);
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;

      setPosition({ x: e.clientX, y: e.clientY });

      // Calculate cursor velocity (pixels per millisecond)
      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / dt;

      // Update position tracking ref
      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };

      // Prevent spawning massive storms on the initial warp-in
      if (last.x === -100) return;

      // Moving fast spawns finer, higher-energy star-dust bursts!
      const spawnCount = Math.min(6, Math.floor(velocity * 5.0) + (Math.random() < 0.2 ? 1 : 0));

      if (spawnCount > 0) {
        const newParticles: Particle[] = [];
        const colors = ["#fbbf24", "#f59e0b", "#ffffff", "#c084fc", "#38bdf8", "#a855f7"];

        for (let i = 0; i < spawnCount; i++) {
          const id = particleIdRef.current++;

          // Velocity slinging: particles shoot loosely in the opposite direction
          const scatterAngle = Math.random() * Math.PI * 2;
          const scatterSpeed = Math.random() * 1.2 + 0.3;

          // Sling factor: inertia opposite to cursor path
          const slingX = -(dx / dt) * 0.18;
          const slingY = -(dy / dt) * 0.18;

          const vx = slingX + Math.cos(scatterAngle) * scatterSpeed;
          const vy = slingY + Math.sin(scatterAngle) * scatterSpeed - 0.3; // Default soft upward draft

          // Size also depends on speed
          const size = Math.random() * (1.5 + Math.min(velocity * 1.5, 3.5)) + 1.2;

          // Faster velocity makes dust particles linger longer
          const maxLife = Math.floor(30 + Math.random() * 25 + Math.min(velocity * 20, 30));

          const color = colors[Math.floor(Math.random() * colors.length)];

          newParticles.push({
            id,
            x: e.clientX + (Math.random() - 0.5) * 8,
            y: e.clientY + (Math.random() - 0.5) * 8,
            vx,
            vy,
            size,
            color,
            maxLife,
            life: maxLife,
            opacity: 1.0
          });
        }

        setParticles((prev) => {
          const merged = [...prev, ...newParticles];
          if (merged.length > 70) {
            return merged.slice(merged.length - 70);
          }
          return merged;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Particle tick updates
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => {
            const nextLife = p.life - 1;
            const lifeRatio = nextLife / p.maxLife;

            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vx: p.vx * 0.94, // Air resistance / deceleration
              vy: (p.vy - 0.04) * 0.94, // Float upwards while decelerating
              life: nextLife,
              opacity: lifeRatio * (0.85 + Math.sin(nextLife * 0.2) * 0.15), // Twinkling / scintillation
              size: p.size * 0.985 // Slow dissolve
            };
          })
          .filter((p) => p.life > 0 && p.size > 0.5)
      );
    }, 16);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Primary Aura Dot */}
      <div
        className="fixed top-0 left-0 w-5 h-5 bg-purple-500/30 border border-purple-400/80 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          boxShadow: "0 0 16px rgba(192, 132, 252, 0.8)",
          zIndex: 9999
        }}
      />
      {/* Center Core Dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-yellow-400 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 min-h-1.5 min-w-1.5 transition-transform duration-0 ease-none"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          zIndex: 10000
        }}
      />
      {/* Trail Sparks */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed top-0 left-0 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3.5}px ${p.color}`,
            zIndex: 9998,
            opacity: p.opacity
          }}
        />
      ))}
    </>
  );
}
