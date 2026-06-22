import React, { useState, useEffect, useRef } from "react";
import { numberMeanings } from "../data/numerologyData";
import { NumberMeaning } from "../types";
import { Sparkles, HelpCircle, X, Compass, Layers, Globe, ShieldAlert } from "lucide-react";
import CelestialBackground from "./CelestialBackground";
import ConstellationVideoBackground from "./ConstellationVideoBackground";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

interface NodePosition {
  id: string;
  x: number; // percentage X
  y: number; // percentage Y
}

export default function ConstellationGrid() {
  const { language, t, getNumberMeaning } = useLanguage();
  const [selectedNumDetail, setSelectedNumDetail] = useState<NumberMeaning | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Sync modal content if language changes live
  useEffect(() => {
    if (selectedNumDetail) {
      const updated = getNumberMeaning(String(selectedNumDetail.number));
      if (updated) setSelectedNumDetail(updated);
    }
  }, [language]);

  // Core constellation coordinate maps for desktop views
  const nodePositions: NodePosition[] = [
    { id: "0", x: 50, y: 50 },
    { id: "1", x: 18, y: 25 },
    { id: "2", x: 34, y: 18 },
    { id: "3", x: 66, y: 18 },
    { id: "4", x: 82, y: 25 },
    { id: "5", x: 14, y: 55 },
    { id: "6", x: 86, y: 55 },
    { id: "7", x: 23, y: 80 },
    { id: "8", x: 77, y: 80 },
    { id: "9", x: 50, y: 85 },
    { id: "11", x: 33, y: 40 },
    { id: "22", x: 67, y: 40 },
    { id: "33", x: 50, y: 22 }
  ];

  // Families groupings to draw connective SVG strands
  const connectionStrands = [
    // Initiator / Mental Will Family
    { from: "1", to: "5" },
    { from: "5", to: "7" },
    { from: "7", to: "9" },
    // Receptive / Pacifist Family
    { from: "2", to: "4" },
    { from: "4", to: "8" },
    { from: "8", to: "9" },
    // Creative & Art Family
    { from: "3", to: "6" },
    { from: "6", to: "8" },
    // Celestial Masters Loop
    { from: "11", to: "22" },
    { from: "22", to: "33" },
    { from: "33", to: "11" },
    // Primordial connections to Masters & Humankind
    { from: "0", to: "11" },
    { from: "0", to: "22" },
    { from: "0", to: "33" },
    { from: "0", to: "9" }
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Quick polling trigger to bypass early sizing lag
    const t = setTimeout(handleResize, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t);
    };
  }, []);

  const openNumMeaning = (numKey: string) => {
    const data = getNumberMeaning(numKey);
    if (data) setSelectedNumDetail(data);
  };

  return (
    <section id="meanings" className="relative pt-[115vh] pb-32 md:pt-[130vh] md:pb-40 px-4 bg-transparent overflow-hidden border-t border-amber-500/5">
      
      {/* Living background matching upper/lower cosmic energy streams */}
      <ConstellationVideoBackground />
      
      {/* Background celestial effect background layer */}
      <CelestialBackground glowColor="purple" intensity="medium" />
      
      {/* Background ambient auroral orbs */}
      <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-yellow-650/5 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        
        {/* Constellation Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-400/20 rounded-full text-xs text-amber-300 font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <Compass className="w-3.5 h-3.5 text-amber-400 rotate-45 animate-spin" style={{ animationDuration: "12s" }} />
            {t("rays.badge") || "Celestial Mapping Constellation"}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wider font-bold shadow-glow-title">
            {t("rays.title") || "NUMERIC CONSTELLATIONS"}
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            {t("rays.sub") || "Explore the energetic rays. On desktop, they organize as a linked cosmic map. Hover or click nodes to interact with their details."}
          </p>
        </div>

        {/* CONSTELLATION CONTAINER WRAP */}
        <div 
          ref={containerRef}
          className="relative min-h-[650px] md:min-h-[960px] w-full"
        >
          {/* Connector strands removed to present clean, elegant node space */}

          {/* DESKTOP CONSTELLATION NODES & MOBILE GRID LAYOUTS */}
          {/* Mobile view is standard bento grid; Desktop maps out to coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:block gap-6 relative" style={{ zIndex: 10 }}>
            {nodePositions.map((node) => {
              const info = getNumberMeaning(node.id);
              if (!info) return null;

              return (
                <div
                  key={node.id}
                  onClick={() => openNumMeaning(node.id)}
                  style={{
                    // Absolute positioning applied on screens md: and larger
                    left: dimensions.width > 768 ? `${node.x}%` : undefined,
                    top: dimensions.width > 768 ? `${node.y}%` : undefined,
                  } as React.CSSProperties}
                  className={`
                    md:absolute md:-translate-x-1/2 md:-translate-y-1/2 cursor-pointer group
                    transition-all duration-300 hover:scale-105 active:scale-95
                  `}
                >
                  <div 
                    className="bg-[#111015]/85 hover:bg-[#1b1921] border rounded-xl p-4 flex gap-4.5 items-center w-full md:w-[220px] shadow-[0_10px_25px_rgba(0,0,0,0.55)] transition-all ease-out"
                    style={{
                      borderColor: `${info.color}35`,
                      boxShadow: `0 0 15px ${info.color}15, inset 0 0 8px rgba(197,168,128,0.05)`
                    }}
                  >
                    {/* Glowing Circular Number Orb */}
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center border text-white font-serif font-black flex-shrink-0 transition-shadow duration-300 group-hover:shadow-[0_0_15px_var(--glow)] text-base"
                      style={{
                        borderColor: info.color,
                        background: `radial-gradient(circle, ${info.color}25 30%, #09080c 100%)`,
                        "--glow": info.color
                      } as React.CSSProperties}
                    >
                      {info.number}
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="text-xs font-serif font-bold text-white tracking-wider uppercase truncate group-hover:text-amber-300 transition-colors">
                        {info.title.replace(/^The\s+/i, "")}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-400 mt-0.5 truncate uppercase">
                        El: {info.element} • {info.symbol}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* LOWER REGION ARTWORK - ANIMATED BACKGROUND */}
      <div className="absolute top-[150vh] md:top-[170vh] bottom-0 left-0 right-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* Soft upper scrim to fade image in from the dark zone */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#09080c] via-[#09080c]/60 to-transparent pointer-events-none" />

        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <motion.img
            src="https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(1).jpeg"
            referrerPolicy="no-referrer"
            alt="Lower Celestial Radiance"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "center",
              mixBlendMode: "screen"
            }}
            initial={{
              opacity: 0,
              scale: 1.06,
            }}
            animate={{
              opacity: 0.45,
              scale: [1.02, 1.06, 1.02],
              x: [3, -3, 3],
              y: [4, -2, 4],
            }}
            transition={{
              opacity: { duration: 2.0, ease: "easeOut" },
              scale: {
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut"
              },
              x: {
                duration: 26,
                repeat: Infinity,
                ease: "easeInOut"
              },
              y: {
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        </div>

        {/* Environmental blending overlays */}
        <div className="absolute inset-0 bg-[#09080c]/12 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#09080c] via-[#09080c]/70 to-transparent pointer-events-none" />

      </div>

      {/* DETAIL VIEW MODAL - SHARED */}
      {selectedNumDetail && (
        <div className="fixed inset-0 bg-[#09080c]/85 backdrop-blur-md z-[20000] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#16151b] border border-amber-500/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_55px_rgba(197,168,128,0.22)] my-8">
            
            {/* Header banner */}
            <div
              className="px-6 py-8 relative flex flex-col justify-end min-h-[140px]"
              style={{
                background: `linear-gradient(135deg, ${selectedNumDetail.color}2A, #16151b 90%)`
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedNumDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#09080c]/60 hover:bg-[#09080c]/90 text-amber-200 hover:text-white transition-all cursor-pointer border border-amber-500/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-4 items-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border-2 text-2xl font-serif font-black shadow-[0_0_20px_var(--glow)] text-white"
                  style={{
                    borderColor: selectedNumDetail.color,
                    textShadow: `0 0 10px ${selectedNumDetail.color}`,
                    "--glow": `${selectedNumDetail.color}50`
                  } as React.CSSProperties}
                >
                  {selectedNumDetail.number}
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase">{t("rays.universalFreq") || "Universal Frequency"}</span>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-wide uppercase mt-0.5">
                    {selectedNumDetail.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal content body */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Essence statement */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-wider font-bold text-amber-400 uppercase">{t("rays.coreEssence") || "Core Essence & Alignment"}</span>
                <p className="text-zinc-300 leading-relaxed font-sans text-sm italic border-l-2 p-3 bg-[#09080c]/60" style={{ borderColor: selectedNumDetail.color }}>
                  "{selectedNumDetail.essence}"
                </p>
              </div>

              {/* Strengths & Challenges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Strengths */}
                <div className="space-y-3 bg-[#09080c]/50 p-4 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#22c55e] font-bold block border-b border-zinc-800 pb-1.5">
                    {t("rays.dominantStrengths") || "✦ Dominant Strengths"}
                  </span>
                  <ul className="space-y-2">
                    {selectedNumDetail.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-[#eedbb3] flex gap-2 items-start leading-tight">
                        <span className="text-[#22c55e] mt-0.5">✔</span>
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="space-y-3 bg-[#09080c]/50 p-4 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block border-b border-zinc-800 pb-1.5">
                    {t("rays.growthChallenges") || "▲ Growth Challenges"}
                  </span>
                  <ul className="space-y-2">
                    {selectedNumDetail.challenges.map((ch, idx) => (
                      <li key={idx} className="text-xs text-[#eedbb3] flex gap-2 items-start leading-tight">
                        <span className="text-rose-400 mt-0.5">✦</span>
                        {ch}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Dynamic Careers & Alchemy Links */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">{t("rays.cosmicElement") || "Cosmic Element"}</span>
                    <span className="text-sm font-serif text-white tracking-wide">{selectedNumDetail.element}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">{t("rays.sacredSymbol") || "Sacred Astral Symbol"}</span>
                    <span className="text-sm font-serif text-white tracking-wide flex gap-1.5 items-center font-bold">
                      <span className="text-lg" style={{ color: selectedNumDetail.color }}>{selectedNumDetail.symbol}</span>
                      {selectedNumDetail.symbol === "☉" ? (t("rays.sunMapping") || "Sun Mapping") : selectedNumDetail.symbol === "☽" ? (t("rays.lunarReflection") || "Lunar Reflection") : (t("rays.geometricForce") || "Geometric Force")}
                    </span>
                  </div>
                </div>

                <div className="bg-[#09080c]/85 p-4 rounded-xl border border-zinc-850">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block pb-1.5">
                    {t("rays.careerChannels") || "💼 Highly Aligned Career Channels"}
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedNumDetail.careers.map((car, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#111015] border border-zinc-800 text-xs font-sans text-zinc-300"
                      >
                        {car}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer with actions */}
            <div className="bg-[#111015] p-4 flex justify-end border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedNumDetail(null)}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white text-xs font-mono uppercase rounded-lg tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(197,168,128,0.25)]"
              >
                {t("rays.closeBtn") || "Close Integration"}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
