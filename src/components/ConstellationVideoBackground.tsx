import React from "react";
import { motion } from "motion/react";

export default function ConstellationVideoBackground() {
  const cosmicShivaImageUrl = "https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/Cosmic%20Shiva%20%F0%9F%8C%8C%20_%20Mahadev%20Universe%20Form%20_%20Divine%20Energy.jpeg";

  return (
    <div className="absolute top-0 left-0 w-full h-[150vh] md:h-[170vh] pointer-events-none overflow-hidden select-none z-0">
      
      {/* Complete Background Image: Cosmic Shiva (Mahadev Universe Form) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.img
          src={cosmicShivaImageUrl}
          referrerPolicy="no-referrer"
          alt="Cosmic Shiva - Mahadev Universe Form"
          className="w-full h-full object-cover"
          style={{
            objectPosition: "center 35%",
            mixBlendMode: "screen"
          }}
          initial={{
            opacity: 0,
            scale: 1.05,
          }}
          animate={{
            opacity: 0.85,
            scale: [1.0, 1.04, 1.0],
            y: [1, -1, 1],
          }}
          transition={{
            opacity: { duration: 1.8, ease: "easeOut" },
            scale: {
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut"
            },
            y: {
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      </div>

      {/* Atmospheric overlays and vignettes to integration with surrounding page theme */}
      {/* 1. Top blur-to-bg blend */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#09080c] via-[#09080c]/50 to-transparent pointer-events-none" />
      
      {/* 2. Middle blend scrim */}
      <div className="absolute inset-0 bg-[#09080c]/5 mix-blend-multiply pointer-events-none" />
      
      {/* 3. Bottom blur-to-bg blend fade out to Solid background */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#09080c] via-[#09080c]/30 to-transparent pointer-events-none" />
      
    </div>
  );
}
