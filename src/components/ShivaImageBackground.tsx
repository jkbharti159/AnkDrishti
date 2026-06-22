import React from "react";
import { motion } from "motion/react";

interface ShivaImageBackgroundProps {
  opacity?: number;
  verticalOffset?: string; // e.g. "50%"
  horizontalOffset?: string; // e.g. "4.5%"
}

export default function ShivaImageBackground({
  opacity = 0.88,
  verticalOffset = "50%",
  horizontalOffset = "4.5%"
}: ShivaImageBackgroundProps) {
  const imageUrl = "https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(6).jpeg";

  return (
    <div id="shiva-bg-container" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      
      {/* Meditating Shiva Animated Image Component */}
      <motion.img
        id="shiva-bg-image"
        src={imageUrl}
        referrerPolicy="no-referrer"
        alt="Celestial Shiva"
        className="w-full h-full object-cover"
        style={{
          objectPosition: `center ${verticalOffset}`,
          mixBlendMode: "screen"
        }}
        // Detailed premium entrance and breathing animations
        initial={{ 
          opacity: 0, 
          scale: 1.15,
          x: horizontalOffset,
        }}
        animate={{ 
          opacity: opacity,
          scale: [1.06, 1.11, 1.06], // Gentle breathing pulse
          y: [-6, 6, -6],           // Living, floating ambient flow
          x: [horizontalOffset, horizontalOffset, horizontalOffset]
        }}
        transition={{
          opacity: { duration: 1.8, ease: "easeOut" },
          scale: { 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          },
          y: { 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }
        }}
      />

      {/* Elegant atmospheric overlays for high textual contrast */}
      {/* 1. Dark vignette on top to blend with the header */}
      <div id="shiva-top-vignette" className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#060509]/60 via-[#060509]/30 to-transparent pointer-events-none" />
      
      {/* 2. Soft bottom gradient to blend into the calculator section */}
      <div id="shiva-bottom-vignette" className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#060509]/60 via-[#060509]/30 to-transparent pointer-events-none" />
      
      {/* 3. Radial center-to-edge dark vignette to keep sides clean and focus the viewer on the center */}
      <div id="shiva-radial-vignette" className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(6,5,9,0.15)_60%,rgba(6,5,9,0.45)_100%)] pointer-events-none" />

    </div>
  );
}
