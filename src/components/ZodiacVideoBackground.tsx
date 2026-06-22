import React from "react";
import { motion } from "motion/react";

export default function ZodiacVideoBackground() {
  const imageUrl = "https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(2).jpeg";

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0">
      
      {/* Absolute background image with divine panning/breathing animation */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.img
          src={imageUrl}
          referrerPolicy="no-referrer"
          alt="Divine Cosmic Astrological Form"
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center 30%",
            mixBlendMode: "screen",
          }}
          initial={{
            opacity: 0,
            scale: 1.1,
          }}
          animate={{
            opacity: 0.65,
            scale: [1.02, 1.07, 1.02],
            y: [4, -4, 4],
          }}
          transition={{
            opacity: { duration: 1.8, ease: "easeOut" },
            scale: {
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            },
            y: {
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      </div>

      {/* Radiant overlapping dark vignette scrims */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0c0a0f] via-[#0c0a0f]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#060509] via-[#060509]/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/35 pointer-events-none" />
      
    </div>
  );
}
