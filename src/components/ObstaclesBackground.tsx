import React from "react";
import { motion } from "motion/react";

interface ObstaclesBackgroundProps {
  opacity?: number;
}

export default function ObstaclesBackground({
  opacity = 0.85 // Make background fully visible as requested by the user
}: ObstaclesBackgroundProps) {
  // Raw URL for the provided GitHub image
  const imageUrl = "https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(4).jpeg";

  return (
    <div id="obstacles-bg-container" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      
      {/* Animated Image Layer */}
      <motion.img
        id="obstacles-bg-image"
        src={imageUrl}
        referrerPolicy="no-referrer"
        alt="Cosmic Obstacles Guide"
        className="w-full h-full object-cover"
        style={{
          objectPosition: "center 40%",
        }}
        // Continuous organic floating and breathing animations
        initial={{ 
          opacity: 0, 
          scale: 1.05,
        }}
        animate={{ 
          opacity: opacity,
          scale: [1.02, 1.06, 1.02], // Breathing pulse
          y: [-5, 5, -5],             // Slow floating flow
          x: [-3, 3, -3]              // Gentle side-to-side drift
        }}
        transition={{
          opacity: { duration: 1.5, ease: "easeOut" },
          scale: { 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          y: { 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          x: { 
            duration: 16, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
      />

      {/* Atmospheric overlays to blend with the dark slate-950 (#020617) layout */}
      {/* 1. Top dark vignette */}
      <div id="obstacles-top-vignette" className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#020617] to-transparent pointer-events-none" />
      
      {/* 2. Bottom dark vignette */}
      <div id="obstacles-bottom-vignette" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
      
      {/* 3. Soft overlay to darken slightly so the foreground content pops */}
      <div id="obstacles-overlay-mask" className="absolute inset-0 bg-[#020617]/40 pointer-events-none" />

    </div>
  );
}
