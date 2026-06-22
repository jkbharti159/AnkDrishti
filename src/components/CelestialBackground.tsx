import React, { useMemo } from "react";
import { Sparkles } from "lucide-react";

interface CelestialBackgroundProps {
  glowColor?: "amber" | "purple" | "blue" | "indigo";
  intensity?: "subtle" | "medium" | "deep";
}

export default function CelestialBackground({
  glowColor = "amber",
  intensity = "subtle"
}: CelestialBackgroundProps) {
  // Generate random static stars inside a useMemo hook so they do not recreate on re-renders, preventing flashing
  const starsArray = useMemo(() => {
    const arr = [];
    const colors = {
      amber: ["#f59e0b", "#fbbf24", "#d97706", "#ffffff"],
      purple: ["#c084fc", "#a855f7", "#e9d5ff", "#ffffff"],
      blue: ["#38bdf8", "#0ea5e9", "#bae6fd", "#ffffff"],
      indigo: ["#6366f1", "#4f46e5", "#c7d2fe", "#ffffff"]
    };
    const palette = colors[glowColor] || colors.amber;

    for (let i = 0; i < 16; i++) {
      const top = Math.floor(Math.random() * 90) + 5;
      const left = Math.floor(Math.random() * 90) + 5;
      const size = Math.random() * 2 + 1; // 1px to 3px
      const delay = Math.random() * 4; // up to 4s delay
      const duration = Math.random() * 3 + 2; // 2s to 5s duration
      const color = palette[Math.floor(Math.random() * palette.length)];

      arr.push({
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        size,
        delay: `${delay}s`,
        duration: `${duration}s`,
        color
      });
    }
    return arr;
  }, [glowColor]);

  // Determine glow intensity classes
  const glowOpacityClass =
    intensity === "deep"
      ? "opacity-25"
      : intensity === "medium"
      ? "opacity-15"
      : "opacity-10";

  // Determine glow color maps
  const glowColors = {
    amber: "bg-radial-gradient from-amber-500/10 via-amber-900/5 to-transparent",
    purple: "bg-radial-gradient from-purple-500/10 via-purple-900/5 to-transparent",
    blue: "bg-radial-gradient from-sky-500/10 via-sky-900/5 to-transparent",
    indigo: "bg-radial-gradient from-indigo-500/10 via-indigo-900/5 to-transparent"
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      
      {/* 1. Nebula Cosmic Dust Radial Glow Orbs */}
      <div 
        className={`absolute top-0 left-1/4 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full filter blur-[100px] sm:filter blur-[130px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen transition-opacity duration-1000 ${glowOpacityClass}`}
        style={{
          background: glowColor === "purple" 
            ? "radial-gradient(circle, rgba(168,85,247,0.12) 0%, rgba(88,28,135,0.03) 70%, transparent 100%)"
            : glowColor === "blue"
            ? "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(15,23,42,0.03) 70%, transparent 100%)"
            : glowColor === "indigo"
            ? "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(49,46,129,0.03) 70%, transparent 100%)" 
            : "radial-gradient(circle, rgba(245,158,11,0.11) 0%, rgba(120,53,4,0.03) 70%, transparent 100%)"
        }}
      />
      <div 
        className={`absolute bottom-0 right-1/4 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full filter blur-[100px] sm:filter blur-[130px] translate-x-1/2 translate-y-1/2 mix-blend-screen transition-opacity duration-1000 ${glowOpacityClass}`}
        style={{
          background: glowColor === "purple" 
            ? "radial-gradient(circle, rgba(98,28,135,0.08) 0%, rgba(168,85,247,0.01) 75%, transparent 100%)"
            : glowColor === "blue" 
            ? "radial-gradient(circle, rgba(14,116,144,0.08) 0%, rgba(56,189,248,0.01) 75%, transparent 100%)"
            : glowColor === "indigo"
            ? "radial-gradient(circle, rgba(49,46,129,0.08) 0%, rgba(99,102,241,0.01) 75%, transparent 100%)"
            : "radial-gradient(circle, rgba(120,53,4,0.07) 0%, rgba(245,158,11,0.01) 75%, transparent 100%)"
        }}
      />

      {/* 2. Starry Constellation Twinkle Overlays */}
      {starsArray.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full transition-all duration-1000"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 3}px ${star.color}ae`,
            opacity: 0.15,
            animation: `twinkle ${star.duration} ease-in-out infinite alternate`,
            animationDelay: star.delay
          }}
        />
      ))}

      {/* Inline style block to declare keyframe animations safely if they do not exist in the global tailwind stylesheet */}
      <style>{`
        @keyframes twinkle {
          0% {
            opacity: 0.1;
            transform: scale(0.85);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.15);
          }
          100% {
            opacity: 0.15;
            transform: scale(0.9);
          }
        }
        @keyframes float-orbit {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.05);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
      `}</style>

      {/* 3. Celestial Pythagorean Mathematical Coordinate Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.025]" style={{ zIndex: 0 }}>
        <defs>
          <radialGradient id="grid-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fade-mask">
            <rect width="100%" height="100%" fill="url(#grid-fade)" />
          </mask>
        </defs>
        
        {/* Elegant structural circles representing astrological and numeric orbits */}
        <g mask="url(#fade-mask)">
          <circle cx="50%" cy="50%" r="22%" fill="none" stroke="#ffe082" strokeWidth="0.75" strokeDasharray="3 6" />
          <circle cx="50%" cy="50%" r="38%" fill="none" stroke="#ffe082" strokeWidth="0.5" />
          <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#ffe082" strokeWidth="0.75" strokeDasharray="12 12" />
          
          {/* Constellation connectors */}
          <line x1="15%" y1="20%" x2="45%" y2="50%" stroke="#ffe082" strokeWidth="0.5" strokeDasharray="4" />
          <line x1="85%" y1="35%" x2="55%" y2="50%" stroke="#ffe082" strokeWidth="0.5" strokeDasharray="4" />
          <line x1="25%" y1="80%" x2="45%" y2="50%" stroke="#ffe082" strokeWidth="0.5" strokeDasharray="4" />
          <line x1="75%" y1="75%" x2="55%" y2="50%" stroke="#ffe082" strokeWidth="0.5" strokeDasharray="4" />
        </g>
      </svg>
    </div>
  );
}
