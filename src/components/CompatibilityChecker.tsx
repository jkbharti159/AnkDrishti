import React, { useState } from "react";
import { getCompatibility, numberMeanings } from "../data/numerologyData";
import { Heart, ShieldAlert, Sparkles, RefreshCw, Layers } from "lucide-react";
import Swastika from "./Swastika";
import ThreeDSwastika from "./ThreeDSwastika";
import CelestialBackground from "./CelestialBackground";
import CompatibilityVideoBackground from "./CompatibilityVideoBackground";
import { useLanguage } from "../context/LanguageContext";

type AnimState = "idle" | "checking" | "merged" | "repelled";

export default function CompatibilityChecker() {
  const { language, t, getCompatibilityResult } = useLanguage();
  const [numA, setNumA] = useState<number>(1);
  const [numB, setNumB] = useState<number>(2);
  const [animState, setAnimState] = useState<AnimState>("idle");
  const [result, setResult] = useState<{ percent: number; summary: string } | null>(null);

  const testCompatibility = () => {
    setAnimState("checking");
    setResult(null);

    const comp = getCompatibility(numA, numB);

    setTimeout(() => {
      setResult(comp);
      if (comp.percent >= 80) {
        setAnimState("merged");
      } else {
        setAnimState("repelled");
      }
    }, 1200);
  };

  const resetForm = () => {
    setAnimState("idle");
    setResult(null);
  };

  // Get localized/translated result matching language
  const translatedResult = result ? getCompatibilityResult(numA, numB, result) : null;

  const numbersList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

  return (
    <section id="compatibility" className="relative py-52 md:py-64 px-4 bg-transparent border-t border-amber-500/5 overflow-hidden">
      
      {/* Living background cosmic video integration */}
      <CompatibilityVideoBackground />
      
      {/* Background celestial effect background layer */}
      <CelestialBackground glowColor="indigo" intensity="medium" />
      
      {/* Background celestial particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-400/20 rounded-full text-xs text-amber-300 font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <Heart className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Vibrational Synastry
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wider font-bold shadow-glow-title">
            COMPATIBILITY MERGER
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            Align two Life Paths or frequencies to analyze their atomic friction, elemental matches, and karmic connections.
          </p>
        </div>

        {/* INPUTS ROW */}
        <div className="bg-[#111015]/80 border border-zinc-800 p-6 rounded-2xl max-w-2xl mx-auto backdrop-blur-md">
          <div className="grid grid-cols-2 gap-6 mb-6">
            
            {/* Person A select */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Life Path Alpha
              </label>
              <select
                value={numA}
                onChange={(e) => {
                  setNumA(Number(e.target.value));
                  resetForm();
                }}
                className="w-full bg-[#16151b]/95 border border-zinc-800 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-amber-550 transition-all font-mono text-sm"
              >
                {numbersList.map((num) => (
                  <option key={num} value={num} className="bg-[#16151b]">
                    Number {num} — {numberMeanings[String(num)]?.title.replace(/^The\s+/i, "")}
                  </option>
                ))}
              </select>
            </div>

            {/* Person B select */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Life Path Beta
              </label>
              <select
                value={numB}
                onChange={(e) => {
                  setNumB(Number(e.target.value));
                  resetForm();
                }}
                className="w-full bg-[#16151b]/95 border border-zinc-800 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-amber-550 transition-all font-mono text-sm"
              >
                {numbersList.map((num) => (
                  <option key={num} value={num} className="bg-[#16151b]">
                    Number {num} — {numberMeanings[String(num)]?.title.replace(/^The\s+/i, "")}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <button
            onClick={testCompatibility}
            disabled={animState === "checking"}
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-mono uppercase font-bold text-xs tracking-widest rounded-lg shadow-[0_0_15px_rgba(197,168,128,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${animState === "checking" ? "animate-spin" : ""}`} />
            {animState === "checking" ? "FUSING ENERGIES..." : "SOLDER ORBITAL LINKS"}
          </button>
        </div>

        {/* ORB ANIMATION WINDOW */}
        <div className="relative h-[240px] max-w-lg mx-auto mt-16 flex items-center justify-center overflow-hidden rounded-xl bg-[#03000a]/50 border border-zinc-800">
          
          {/* Fusion central background grid */}
          <div className="absolute inset-0 pointer-events-none border border-zinc-800/10 opacity-30 flex items-center justify-center">
            <div className="w-[180px] h-[180px] rounded-full border border-zinc-800/20" />
            <div className="w-[100px] h-[100px] rounded-full border border-zinc-500/10" />
          </div>

          {/* 3D SWASTIKA Cosmic Symbol background model */}
          <ThreeDSwastika animState={animState} />

          {/* Left Orb (Alpha) */}
          <div
            className={`
              absolute w-16 h-16 rounded-full flex items-center justify-center text-sm font-serif font-black text-white border
              transition-all duration-1000 ease-out p-1
              ${animState === "idle" ? "translate-x-[-120px]" : ""}
              ${animState === "checking" ? "translate-x-[-30px] animate-pulse" : ""}
              ${animState === "merged" ? "[transform:translate3d(0,0,0)_scale(1.2)] opacity-0 duration-500" : ""}
              ${animState === "repelled" ? "translate-x-[-140px] animate-shake" : ""}
            `}
            style={{
              borderColor: numberMeanings[String(numA)]?.color || "#c5a880",
              background: `radial-gradient(circle, ${numberMeanings[String(numA)]?.color}40 0%, #16151b 100%)`,
              boxShadow: `0 0 25px ${numberMeanings[String(numA)]?.color}`
            }}
          >
            {numA}
          </div>

          {/* Right Orb (Beta) */}
          <div
            className={`
              absolute w-16 h-16 rounded-full flex items-center justify-center text-sm font-serif font-black text-white border
              transition-all duration-1000 ease-out p-1
              ${animState === "idle" ? "translate-x-[120px]" : ""}
              ${animState === "checking" ? "translate-x-[30px] animate-pulse" : ""}
              ${animState === "merged" ? "[transform:translate3d(0,0,0)_scale(1.2)] opacity-0 duration-500" : ""}
              ${animState === "repelled" ? "translate-x-[140px] animate-shake" : ""}
            `}
            style={{
              borderColor: numberMeanings[String(numB)]?.color || "#c5a880",
              background: `radial-gradient(circle, ${numberMeanings[String(numB)]?.color}40 0%, #16151b 100%)`,
              boxShadow: `0 0 25px ${numberMeanings[String(numB)]?.color}`
            }}
          >
            {numB}
          </div>

          {/* MERGED SUPER ORB (Visible only in 'merged' state) */}
          <div
            className={`
              absolute w-28 h-28 rounded-full flex flex-col items-center justify-center text-white border-2
              transition-all duration-1000 ease-elastic p-2 text-center
              ${animState === "merged" ? "scale-100 opacity-100" : "scale-0 opacity-0"}
            `}
            style={{
              borderColor: "#fbbf24",
              background: `radial-gradient(circle, rgba(251,191,36,0.25) 0%, rgba(197,168,128,0.3) 50%, #0c0a0f 100%)`,
              boxShadow: "0 0 45px rgba(251,191,36,0.6), 0 0 70px rgba(197,168,128,0.4)"
            }}
          >
            <Swastika size={32} glow={false} animated={true} className="mb-1" />
            <div className="text-xl font-serif font-black text-yellow-100 tracking-wider">
              {numA} ⚭ {numB}
            </div>
            <span className="text-[8px] font-mono uppercase text-[#fbbf24] font-bold tracking-widest mt-0.5">Unified</span>
          </div>


          {/* REPELL WARNING / SHAKE GLOW ORB */}
          {animState === "repelled" && (
            <div className="absolute flex flex-col items-center text-center animate-fade-in pointer-events-none z-10 bg-[#16151b]/95 px-3 py-1.5 rounded-full border border-red-500/30">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce mb-0.5" />
              <span className="text-[9px] font-mono font-bold text-red-300 uppercase tracking-widest">Magnetic Friction Detected</span>
            </div>
          )}

          {/* STATUS LABEL INSIDE SCREEN */}
          {animState === "idle" && (
            <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest pointer-events-none">Orbs Standby</span>
          )}
          {animState === "checking" && (
            <span className="text-[9px] font-mono uppercase text-amber-400 tracking-widest animate-pulse pointer-events-none">Summoning Fusion Streams...</span>
          )}

        </div>

        {/* RESULTS TEXT */}
        {translatedResult && (
          <div className="mt-12 bg-[#111015]/80 border border-zinc-800 p-6 md:p-8 rounded-2xl max-w-2xl mx-auto shadow-2xl animate-fade-in relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 w-1.5" 
              style={{ backgroundColor: translatedResult.percent >= 80 ? "#fbbf24" : "#ef4444" }}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-zinc-800 pb-4">
              <div>
                <h4 className="text-lg font-serif text-white uppercase tracking-wider font-bold">
                  Life Path {numA} & Life Path {numB} Synastry
                </h4>
                <p className="text-[10px] font-mono text-zinc-500 mt-0.5 uppercase">
                  Vibrational family index
                </p>
              </div>
              <div className="flex items-baseline gap-1 bg-[#16151b] px-4 py-2 border border-zinc-800 rounded-full shadow-[0_0_12px_rgba(197,168,128,0.1)]">
                <span className="text-3xl font-serif font-black text-white" style={{ color: translatedResult.percent >= 80 ? "#fbbf24" : "#f43f5e" }}>
                  {translatedResult.percent}%
                </span>
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Match</span>
              </div>
            </div>

            <p className="text-sm md:text-base text-zinc-300 font-sans leading-relaxed">
              {translatedResult.summary}
            </p>
          </div>
        )}

      </div>

    </section>
  );
}
