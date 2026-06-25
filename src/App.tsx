import React, { useState, useEffect } from "react";
import CelestialCanvas from "./components/CelestialCanvas";
import Calculator from "./components/Calculator";
import ConstellationGrid from "./components/ConstellationGrid";
import FlashcardDeck from "./components/FlashcardDeck";
import CosmicConnections from "./components/CosmicConnections";
import ZodiacWheel from "./components/ZodiacWheel";
import ZodiacVideoBackground from "./components/ZodiacVideoBackground";
import ShivaImageBackground from "./components/ShivaImageBackground";
import CustomCursor from "./components/CustomCursor";
import Swastika from "./components/Swastika";
import VedicLifeObstacleAnalyzer from "./components/VedicLifeObstacleAnalyzer";
import { Sparkles, Moon, Sun, Star, Compass, HelpCircle, ChevronDown, Compass as Astrolabe, ChevronRight, Linkedin, Globe, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "./context/LanguageContext";

const TABS = [
  { id: "portal", label: "Portal", icon: Sparkles },
  { id: "ank-map", label: "Ank-Map", icon: Star },
  { id: "rays", label: "Rays", icon: Compass },
  { id: "tarot", label: "Tarot", icon: Moon },
  { id: "synergy", label: "Synergy", icon: Sun },
  { id: "zodiac", label: "Zodiac", icon: Astrolabe },
  { id: "obstacles", label: "Obstacles", icon: Shield },
] as const;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"portal" | "ank-map" | "rays" | "tarot" | "synergy" | "zodiac" | "calculator" | "obstacles">("portal");
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Artificial 2.2s loader to allow Three.js WebGL and assets to establish connections
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId: "portal" | "ank-map" | "rays" | "tarot" | "synergy" | "zodiac" | "calculator" | "obstacles") => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevTab = () => {
    const tabList: ("portal" | "ank-map" | "rays" | "tarot" | "synergy" | "zodiac" | "obstacles")[] = ["portal", "ank-map", "rays", "tarot", "synergy", "zodiac", "obstacles"];
    let currentIdx = tabList.indexOf(activeTab as any);
    if (currentIdx === -1) currentIdx = 0;
    const prevIdx = (currentIdx - 1 + tabList.length) % tabList.length;
    handleTabChange(tabList[prevIdx]);
  };

  const goToNextTab = () => {
    const tabList: ("portal" | "ank-map" | "rays" | "tarot" | "synergy" | "zodiac" | "obstacles")[] = ["portal", "ank-map", "rays", "tarot", "synergy", "zodiac", "obstacles"];
    let currentIdx = tabList.indexOf(activeTab as any);
    if (currentIdx === -1) currentIdx = 0;
    const nextIdx = (currentIdx + 1) % tabList.length;
    handleTabChange(tabList[nextIdx]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target as HTMLElement).isContentEditable) {
        return;
      }
      if (e.key === "ArrowLeft") {
        goToPrevTab();
      } else if (e.key === "ArrowRight") {
        goToNextTab();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  // Staggered letters list for "AnkDrishti" title reveal
  const titleLetters = "AnkDrishti".split("");

  return (
    <div className="relative min-h-screen bg-[#060509] text-[#f4f3f7] select-none selection:bg-amber-500/20 selection:text-white">
      
      {/* Global custom tracking trailing cursor */}
      <CustomCursor />

      {/* 1. CINEMA LOADING SCREEN */}
      {isLoading && (
        <div className="fixed inset-0 bg-[#09080c] z-[99999] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out opacity-100 overflow-hidden">
          
          {/* Animated Celestial Sphere Background Image */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
            <motion.img
              src="https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(2).jpeg"
              referrerPolicy="no-referrer"
              alt="Aligning Celestial Spheres Loader"
              className="w-full h-full object-cover"
              style={{
                objectPosition: "center",
                mixBlendMode: "screen"
              }}
              initial={{
                opacity: 0,
                scale: 1.05,
              }}
              animate={{
                opacity: 0.85,
                scale: [1.02, 1.08, 1.02],
                x: [-4, 4, -4],
                y: [-3, 3, -3],
              }}
              transition={{
                opacity: { duration: 1.5, ease: "easeOut" },
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
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
            {/* Ambient edge gradients to blend properly with dark container borders while keeping image highly visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09080c] via-transparent to-[#09080c]/50 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09080c] via-transparent to-[#09080c]/50 pointer-events-none" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
              {/* Spinning outward rings */}
              <div className="absolute inset-0 border-2 border-dashed border-amber-500/10 rounded-full animate-spin" style={{ animationDuration: "12s" }} />
              <div className="absolute inset-4 border border-amber-500/20 rounded-full animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
              <div className="absolute inset-8 border border-yellow-600/30 rounded-full animate-spin" style={{ animationDuration: "3s" }} />
              
              {/* Centered auspicious Swastika talisman */}
              <Swastika size={52} glow={true} animated={true} />
            </div>

            <div className="text-center space-y-2.5">
              <h1 className="text-3xl font-decorative text-white tracking-[0.2em] font-black shadow-glow-title animate-pulse">
                AnkDrishti
              </h1>
              <p className="text-xs font-mono tracking-widest text-[#c5a880]/60 uppercase">
                {t("loading")}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 2. CORE APPS WRAPPER */}
      <div className={`transition-opacity duration-1000 ease-out ${isLoading ? "opacity-0" : "opacity-100"}`}>
        
        {/* NAV BAR HEADER */}
        <header className="fixed top-0 left-0 right-0 h-20 bg-[#09080c]/85 backdrop-blur-md border-b border-amber-500/5 z-[1000] flex items-center justify-between px-4 md:px-12 select-none pointer-events-auto gap-2 md:gap-4">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => handleTabChange("portal")}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-700 p-[1.5px] shadow-[0_0_15px_rgba(197,168,128,0.25)] flex items-center justify-center animate-spin" style={{ animationDuration: "12s" }}>
              <div className="w-full h-full bg-[#09080c] rounded-full flex items-center justify-center">
                <Astrolabe className="w-4.5 h-4.5 text-amber-400" />
              </div>
            </div>
            <span className="hidden sm:inline font-decorative font-black tracking-widest text-[#f4f3f7] text-sm md:text-lg shadow-glow-title">
                AnkDrishti
            </span>
          </div>

          {/* Navigation with animated glowing tabs */}
          <div className="flex-1 flex justify-center max-w-full overflow-hidden">
            <nav className="flex items-center gap-1 sm:gap-2 md:gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest relative z-[1001] overflow-x-auto scrollbar-none py-1.5 px-2 bg-[#121016]/60 border border-amber-500/5 rounded-full select-none">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative px-2.5 sm:px-3.5 py-1.5 rounded-full cursor-pointer flex items-center gap-1 sm:gap-1.5 transition-colors duration-300 select-none whitespace-nowrap outline-none ${
                      isActive 
                        ? "text-[#fff] font-bold" 
                        : "text-amber-100/55 hover:text-amber-200"
                    }`}
                  >
                    {/* Animated slide behind capsule */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabGlow"
                        className="absolute inset-0 bg-gradient-to-r from-amber-600/35 to-yellow-600/35 rounded-full border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    
                    {/* Extra intense animated core glow bubble */}
                    {isActive && (
                      <motion.div
                        layoutId="coreGlowPulse"
                        className="absolute -inset-1 bg-amber-500/10 rounded-full blur-[6px] -z-10 animate-pulse pointer-events-none"
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                      />
                    )}

                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 relative z-10 transition-transform duration-300 ${isActive ? "text-amber-300 scale-110 drop-shadow-[0_0_6px_rgba(251,191,36,0.85)]" : "text-amber-100/40"}`} />
                    <span className="relative z-10">{t("tabs." + tab.id)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 relative shrink-0">
            <button
              onClick={() => handleTabChange("ank-map")}
              className="hidden lg:block px-4 py-2 border border-amber-500/20 hover:border-amber-500/40 lg:bg-[#1a1822]/45 hover:bg-[#1a1822]/90 text-amber-200 hover:text-white transition-all text-xs font-mono uppercase tracking-wider rounded-lg shadow-md cursor-pointer shrink-0"
            >
              {t("calc.launchMap")}
            </button>

            {/* Language Selector Dropdown with Globe */}
            <div className="relative pointer-events-auto shrink-0 z-[2010]">
              <button
                id="lang-btn"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 border border-amber-500/20 bg-[#16151c]/65 hover:bg-[#1d1b26]/90 text-amber-300 hover:text-white rounded-lg text-xs font-mono transition-all cursor-pointer shadow-md select-none"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="uppercase font-bold tracking-wider">{language}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#111015]/95 backdrop-blur-md border border-amber-500/20 rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] z-[2020] py-1 font-mono text-[11px] select-none">
                  {(["en", "hi", "bn", "mr", "gu"] as const).map((lang) => {
                    const labels = {
                      en: "English",
                      hi: "हिन्दी",
                      bn: "বাংলা",
                      mr: "मराठी",
                      gu: "ગુજરાતી"
                    };
                    return (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setLangOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-amber-500/10 transition-colors flex items-center justify-between cursor-pointer ${language === lang ? "text-amber-400 font-bold bg-amber-500/5" : "text-zinc-400 hover:text-zinc-300"}`}
                      >
                        <span>{labels[lang]}</span>
                        {language === lang && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ACTIVE TAB DISPLAY AREA WITH SMOOTH CROSSFADE ANIMATION */}
        <main className="relative pt-20">
          <AnimatePresence mode="wait">
            {activeTab === "portal" && (
              <motion.div
                key="portal"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* HERO SECTION / LANDING OVERLAY */}
                <section className="relative w-full h-[200vh] sm:h-[215vh] md:h-[230vh] min-h-[1450px] flex flex-col justify-between items-center text-center px-4 py-24 overflow-hidden select-none">
                  
                  {/* THREE.JS WebGL BACKGROUND SCREEN */}
                  <CelestialCanvas />

                  {/* Meditating Shiva Image Background */}
                  <ShivaImageBackground />

                  {/* Sacred Welcome Note (Positioned at the Top with Transparent Background) */}
                  <div className="relative z-10 w-full max-w-xl px-2 pt-2 pointer-events-auto flex flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, y: -25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="relative px-6 py-4 bg-transparent border-none text-center w-full mx-auto"
                    >
                      {/* Aura glowing orb background */}
                      <div className="absolute -top-12 -left-12 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />

                      {/* Header Vedic elements */}
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/20" />
                        <Sparkles className="w-4 h-4 text-amber-400/80 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                        <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/20" />
                      </div>

                      <h2 className="text-xl md:text-2xl font-decorative text-white tracking-widest font-black leading-tight mb-2">
                        {t("portal.welcomeTitle")}
                      </h2>
                      
                      <span className="text-[10px] md:text-[11px] font-mono tracking-[0.2em] text-[#d4af37]/85 uppercase block mb-3.5 leading-normal">
                        ✦ {t("portal.welcomeSubtitle")} ✦
                      </span>

                      <div className="h-[1px] w-1/2 mx-auto bg-gradient-to-r from-transparent via-amber-500/10 to-transparent mb-3.5" />

                      <p className="text-xs md:text-sm text-amber-100/70 font-sans font-light leading-relaxed">
                        {t("portal.welcomeMessage")}
                      </p>
                    </motion.div>
                  </div>

                  {/* Center Space: Intentionally empty to let the magnificent 3D OM Symbol & celestial orbit lines shine unobstructed */}
                  <div className="pointer-events-none min-h-[240px] sm:min-h-[340px] md:min-h-[440px] flex-grow" />

                  {/* Bottom content: description and action button */}
                  <div className="relative z-10 space-y-8 max-w-2xl px-2 pb-6 md:pb-12 pointer-events-auto flex flex-col items-center">
                    
                    {/* Subtext description */}
                    <p className="text-sm md:text-base text-amber-100/75 font-sans font-light max-w-xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
                      {t("portal.tagline")}
                    </p>

                    {/* Pulsing button to scroll down */}
                    <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
                      <button
                        onClick={() => handleTabChange("ank-map")}
                        className="group px-7 py-4 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-serif tracking-widest font-bold uppercase text-xs rounded-full shadow-[0_0_20px_rgba(197,168,128,0.3)] hover:shadow-[0_0_30px_rgba(197,168,128,0.5)] transform active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer border border-amber-500/20"
                      >
                        {t("portal.cta")}
                        <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Down Indicator bottom pin */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer hover:text-white transition-colors z-10 text-amber-500/40 animate-bounce" onClick={() => handleTabChange("ank-map")}>
                    <span className="text-[9px] font-mono uppercase tracking-widest font-bold">{t("portal.alignDown")}</span>
                    <ChevronDown className="w-4.5 h-4.5" />
                  </div>

                </section>
              </motion.div>
            )}

            {activeTab === "ank-map" && (
              <motion.div
                key="ank-map"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Calculator />
              </motion.div>
            )}

            {activeTab === "rays" && (
              <motion.div
                key="rays"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ConstellationGrid />
              </motion.div>
            )}

            {activeTab === "tarot" && (
              <motion.div
                key="tarot"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <FlashcardDeck />
              </motion.div>
            )}

            {activeTab === "synergy" && (
              <motion.div
                key="synergy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CosmicConnections />
              </motion.div>
            )}

            {activeTab === "zodiac" && (
              <motion.div
                key="zodiac"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-full overflow-hidden bg-gradient-to-b from-[#0c0a0f] to-[#060509]"
              >
                <ZodiacVideoBackground />
                <ZodiacWheel />
              </motion.div>
            )}

            {activeTab === "obstacles" && (
              <motion.div
                key="obstacles"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <VedicLifeObstacleAnalyzer />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 8. SUBTLE GLOWING FOOTER */}
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-transparent to-[#050407]">
          <footer className="relative bg-transparent border-t border-amber-500/5 px-6 py-12 text-center overflow-hidden">
            
            {/* Subtle glowing horizon segment line */}
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent blur-sm" />

            {/* Cosmic Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
              {/* Radial deep spacial glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/[0.06] rounded-full blur-[110px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] h-[200px] bg-purple-600/[0.04] rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-[#6366f1]/[0.04] rounded-full blur-[100px] pointer-events-none" />
              
              {/* MAGNIFICENT ROTATING SPIRAL GALAXY */}
              <motion.div 
                className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-70"
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              >
                {/* Galaxy Central Core */}
                <div className="absolute w-14 h-14 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-600 blur-[12px] opacity-80 shadow-[0_0_40px_rgba(245,158,11,0.85)] animate-pulse" />
                <div className="absolute w-7 h-7 rounded-full bg-white blur-[2px] opacity-95 shadow-[0_0_18px_rgba(255,255,255,0.95)]" />

                {/* Spiral Arm A */}
                {[...Array(18)].map((_, i) => {
                  const angle = (i / 18) * Math.PI * 2.4;
                  const radius = 20 + i * 14;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const brightness = 1 - (i / 22);
                  return (
                    <motion.div
                      key={`arm-a-${i}`}
                      className="absolute rounded-full"
                      style={{
                        x,
                        y,
                        width: `${Math.max(2.5, 7 - i * 0.25)}px`,
                        height: `${Math.max(2.5, 7 - i * 0.25)}px`,
                        backgroundColor: i % 2 === 0 ? '#fcc419' : i % 3 === 0 ? '#a5a6f6' : '#fff',
                        boxShadow: `0 0 ${5 + i * 0.6}px ${i % 2 === 0 ? 'rgba(245,158,11,0.95)' : 'rgba(99,102,241,0.75)'}`,
                        opacity: brightness * 0.9,
                      }}
                      animate={{
                        scale: [0.8, 1.25, 0.8],
                      }}
                      transition={{
                        duration: 1.8 + (i % 3) * 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}

                {/* Spiral Arm B */}
                {[...Array(18)].map((_, i) => {
                  // Phase shifted by PI to generate symmetrical second arm
                  const angle = (i / 18) * Math.PI * 2.4 + Math.PI;
                  const radius = 20 + i * 14;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const brightness = 1 - (i / 22);
                  return (
                    <motion.div
                      key={`arm-b-${i}`}
                      className="absolute rounded-full"
                      style={{
                        x,
                        y,
                        width: `${Math.max(2.5, 7 - i * 0.25)}px`,
                        height: `${Math.max(2.5, 7 - i * 0.25)}px`,
                        backgroundColor: i % 2 === 0 ? '#fbbf24' : i % 3 === 0 ? '#c084fc' : '#ffffff',
                        boxShadow: `0 0 ${5 + i * 0.6}px ${i % 2 === 0 ? 'rgba(251,191,36,0.95)' : 'rgba(192,132,252,0.75)'}`,
                        opacity: brightness * 0.9,
                      }}
                      animate={{
                        scale: [0.85, 1.3, 0.85],
                      }}
                      transition={{
                        duration: 2.1 + (i % 3) * 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  );
                })}

                {/* Diffuse gas clouds in galaxy */}
                <div className="absolute w-[240px] h-[160px] rounded-full bg-amber-500/15 blur-[35px] rotate-45" />
                <div className="absolute w-[200px] h-[130px] rounded-full bg-purple-500/12 blur-[30px] -rotate-45" />
              </motion.div>

              {/* Twinkling Space Stars */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    top: `${8 + (i * 12) % 84}%`,
                    left: `${4 + (i * 15) % 92}%`,
                    width: `${i % 4 === 0 ? 3 : i % 2 === 0 ? 1.5 : 1}px`,
                    height: `${i % 4 === 0 ? 3 : i % 2 === 0 ? 1.5 : 1}px`,
                    boxShadow: i % 4 === 0 ? "0 0 12px rgba(255, 255, 255, 0.9)" : "0 0 6px rgba(255, 255, 255, 0.6)",
                  }}
                  animate={{
                    opacity: [0.2, 0.98, 0.2],
                    scale: i % 3 === 0 ? [0.75, 1.5, 0.75] : [0.85, 1.15, 0.85],
                  }}
                  transition={{
                    duration: 2.8 + (i % 5) * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              
              {/* Cosmic dust ring segment */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[1px] bg-gradient-to-r from-transparent via-amber-500/15 to-transparent rotate-[1.5deg]" />
            </div>

            <div className="max-w-4xl mx-auto space-y-6 relative z-10">
              
              <div className="flex flex-col items-center gap-2">
                <h3 className="font-decorative font-bold tracking-widest text-[#f4f3f7] text-sm">AnkDrishti</h3>
                
                <p className="text-xs font-mono text-amber-100/60 uppercase tracking-widest">
                  Developed by <a 
                    href="https://portfolio-w61x.onrender.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4 decoration-amber-400/30"
                  >
                    Jitendra Bharti
                  </a>
                </p>
              </div>

              <div className="flex justify-center items-center gap-5 text-xs font-mono text-amber-100/50 uppercase tracking-wider">
                <a 
                  href="https://portfolio-w61x.onrender.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber-100/70 hover:text-amber-300 transition-colors group"
                >
                  <img 
                    src="https://github.com/jkbharti159.png" 
                    alt="Jitendra Bharti" 
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full border border-amber-500/40 relative z-10 transition-transform duration-300 group-hover:scale-105"
                  />
                  <Globe className="w-3.5 h-3.5 text-amber-400/80" />
                  Portfolio
                </a>
                <span>•</span>
                <a 
                  href="https://www.linkedin.com/in/jkbharti159/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-amber-400/80" />
                  LinkedIn
                </a>
                <span>•</span>
                <button onClick={() => handleTabChange("ank-map")} className="hover:text-amber-300 transition-colors cursor-pointer bg-transparent border-none outline-none">Engine</button>
              </div>

            </div>

          </footer>
        </div>

      </div>

      {/* FLOATING ACTION TAB CONTROLLER FOR EASIER SWITCHING */}
      {!isLoading && (
        <div className="fixed bottom-6 right-6 z-[2000] flex items-center gap-1 bg-[#121016]/90 border border-amber-500/25 rounded-full p-1 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.9)] select-none">
          <button 
            type="button"
            onClick={goToPrevTab}
            className="w-8 h-8 rounded-full hover:bg-amber-500/10 text-amber-300 hover:text-white transition-all font-mono text-xs flex items-center justify-center font-bold cursor-pointer"
            title="Previous Tab (Left Arrow)"
          >
            ←
          </button>
          <div className="text-[9px] font-mono text-amber-100/70 border-x border-zinc-850 px-3.5 uppercase tracking-widest font-black">
            {t("tabs." + activeTab) || activeTab}
          </div>
          <button 
            type="button"
            onClick={goToNextTab}
            className="w-8 h-8 rounded-full hover:bg-amber-500/10 text-amber-300 hover:text-white transition-all font-mono text-xs flex items-center justify-center font-bold cursor-pointer"
            title="Next Tab (Right Arrow)"
          >
            →
          </button>
        </div>
      )}

    </div>
  );
}
