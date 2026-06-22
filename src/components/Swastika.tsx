import React from "react";

interface SwastikaProps {
  className?: string;
  size?: number;
  glow?: boolean;
  animated?: boolean;
}

export default function Swastika({
  className = "",
  size = 60,
  glow = true,
  animated = true,
}: SwastikaProps) {
  return (
    <div
      className={`inline-flex items-center justify-center relative select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer subtle glowing ring and warm aura */}
      {glow && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/10 to-amber-600/25 blur-md animate-pulse pointer-events-none" />
          <div className="absolute inset-2 rounded-full border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.25)] pointer-events-none" />
        </>
      )}

      {/* Actual SVG representation */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full text-amber-400 transition-transform duration-1000 ${
          animated ? "animate-spin" : ""
        }`}
        style={{
          animationDuration: "50s", // Ultra-slow peaceful rotatory cycle
          filter: glow ? "drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))" : "none",
        }}
      >
        <defs>
          {/* Spiritual Solar Glow Filter */}
          <filter id="vedic-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Sacred Outer Protection Dial/Petals */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="rgba(245,158,11,0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="rgba(245,158,11,0.12)"
          strokeWidth="1"
        />

        {/* Outer Halo Background Layer (Underlay glow) */}
        {glow && (
          <g opacity="0.35" filter="url(#vedic-glow)">
            <path
              d="
                M 20 20 L 20 50 L 80 50 L 80 80
                M 80 20 L 50 20 L 50 80 L 20 80
              "
              stroke="#f59e0b"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Clean, flawless continuous joint-paths of Clockwise Vedic Swastika */}
        <g filter={glow ? "url(#vedic-glow)" : "none"}>
          <path
            d="
              M 20 20 L 20 50 L 80 50 L 80 80
              M 80 20 L 50 20 L 50 80 L 20 80
            "
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 4 Auspicious Bindu Dots inside quadrants, perfectly centered */}
          {/* Top-Right Quadrant Dot */}
          <circle cx="66" cy="34" r="3.5" fill="currentColor" />
          {/* Bottom-Right Quadrant Dot */}
          <circle cx="66" cy="66" r="3.5" fill="currentColor" />
          {/* Bottom-Left Quadrant Dot */}
          <circle cx="34" cy="66" r="3.5" fill="currentColor" />
          {/* Top-Left Quadrant Dot */}
          <circle cx="34" cy="34" r="3.5" fill="currentColor" />
        </g>
      </svg>
    </div>
  );
}
