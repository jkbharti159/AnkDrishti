import React, { useState, useEffect } from "react";
import { flashcards } from "../data/numerologyData";
import { Flashcard } from "../types";
import { Sparkles, RefreshCw, Layers, Brain, Check, ChevronLeft, ChevronRight, Award } from "lucide-react";
import CelestialBackground from "./CelestialBackground";
import TarotVideoBackground from "./TarotVideoBackground";
import { useLanguage } from "../context/LanguageContext";

type CategoryFilter = "All" | "Number Meanings" | "Numerology Basics" | "Compatibility" | "Symbols & Astrology Links" | "Vedic Mulank" | "Love & Marriage" | "Kundali Matching" | "Birth Charts";

export default function FlashcardDeck() {
  const { language, t, getFlashcardList } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [isShuffling, setIsShuffling] = useState(false);
  const [isMarkingKnown, setIsMarkingKnown] = useState(false);

  // Load and reset deck when category adjustments or language changes occur
  useEffect(() => {
    const cards = getFlashcardList();
    const rawList = cards.filter(c => {
      if (activeCategory === "All") return true;
      const originalCard = flashcards.find(fc => fc.id === c.id);
      return originalCard && originalCard.category === activeCategory;
    });
    setDeck(rawList);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [activeCategory, language, getFlashcardList]);

  const activeCards = deck.filter(c => !masteredIds.has(c.id));
  const currentCard = activeCards[currentIndex];

  const handleNext = () => {
    if (activeCards.length === 0) return;
    setIsFlipped(false);
    // Smooth transition
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeCards.length);
    }, 200);
  };

  const handlePrev = () => {
    if (activeCards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + activeCards.length) % activeCards.length);
    }, 200);
  };

  // Fisher-Yates shuffle engine with stagger triggers
  const handleShuffle = () => {
    setIsShuffling(true);
    setIsFlipped(false);

    setTimeout(() => {
      const shuffled = [...deck];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setDeck(shuffled);
      setCurrentIndex(0);
      setIsShuffling(false);
    }, 600);
  };

  const handleMarkAsKnown = () => {
    if (!currentCard) return;
    
    setIsMarkingKnown(true);
    
    // Animate fly-off card
    setTimeout(() => {
      setMasteredIds((prev) => {
        const updated = new Set(prev);
        updated.add(currentCard.id);
        return updated;
      });
      
      setIsFlipped(false);
      setIsMarkingKnown(false);

      // Reset index bounds safely
      if (currentIndex >= activeCards.length - 1) {
        setCurrentIndex(0);
      }
    }, 600); // match fly animation duration (600ms)
  };

  const resetMastery = () => {
    setMasteredIds(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Get color glow style representing the category
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Number Meanings":
        return "#fbbf24"; // Gold
      case "Numerology Basics":
        return "#a855f7"; // Violet
      case "Compatibility":
        return "#ec4899"; // Pink
      case "Symbols & Astrology Links":
        return "#38bdf8"; // Sky Blue
      case "Vedic Mulank":
        return "#10b981"; // Emerald Green
      case "Love & Marriage":
        return "#f43f5e"; // Rose
      case "Kundali Matching":
        return "#fb7185"; // Soft Red
      case "Birth Charts":
        return "#fbbf24"; // Amber Gold
      default:
        return "#c084fc";
    }
  };

  const currentCategoryGlow = currentCard ? getCategoryColor(currentCard.category) : "#c084fc";

  return (
    <section id="flashcards" className="relative py-52 md:py-64 px-4 bg-transparent border-t border-amber-500/5 overflow-hidden">
      
      {/* Living background cosmic video integration for Tarot card Study deck */}
      <TarotVideoBackground />
      
      {/* Background celestial effect background layer */}
      <CelestialBackground glowColor="blue" intensity="medium" />
      
      {/* Decorative stars / geometric background grids */}
      <div className="absolute top-[10%] left-[10%] opacity-20 pointer-events-none animate-pulse">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="10" stroke="#fbbf24" strokeWidth="1" />
          <line x1="30" y1="0" x2="30" y2="60" stroke="#fbbf24" strokeWidth="0.5" />
          <line x1="0" y1="30" x2="60" y2="30" stroke="#fbbf24" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="absolute bottom-[10%] right-[10%] opacity-25 pointer-events-none animate-pulse" style={{ animationDelay: "2s" }}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <polygon points="40,10 70,60 10,60" stroke="#c5a880" strokeWidth="0.5" />
          <line x1="40" y1="0" x2="40" y2="80" stroke="#c5a880" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Flashcard Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 border border-yellow-400/20 rounded-full text-xs text-yellow-300 font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <Brain className="w-3.5 h-3.5 text-yellow-400" />
            {language === 'hi' ? 'मंत्रमुग्ध ज्ञान प्रशिक्षक' : language === 'bn' ? 'রহস্যময় জ্ঞান প্রশিক্ষক' : language === 'mr' ? 'गुप्त ज्ञान प्रशिक्षक' : language === 'gu' ? 'ગુપ્ત જ્ઞાન પ્રશિક્ષક' : 'Arcane Wisdom Trainer'}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wider font-bold shadow-glow-title uppercase">
            {t("tarot.title") || "TAROT STUDY DECK"}
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            {t("tarot.sub") || "Master the core systems of celestial numbers, astrological keys, and calculations using these double-sided active Tarot flipcards."}
          </p>
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-3xl mx-auto">
          {(["All", "Number Meanings", "Numerology Basics", "Compatibility", "Symbols & Astrology Links", "Vedic Mulank", "Love & Marriage", "Kundali Matching", "Birth Charts"] as CategoryFilter[]).map((cat) => {
            const isActive = activeCategory === cat;
            const categoryLabels: Record<CategoryFilter, string> = {
              "All": t("tarot.catAll") || "All Topics",
              "Number Meanings": t("tarot.catMeanings") || "Number Meanings",
              "Numerology Basics": t("tarot.catBasics") || "Numerology Basics",
              "Compatibility": t("tarot.catCompatibility") || "Compatibility",
              "Symbols & Astrology Links": t("tarot.catSymbols") || "Astrology Links",
              "Vedic Mulank": t("tarot.catVedic") || "Vedic Mulank",
              "Love & Marriage": t("tarot.catLove") || "Love & Marriage",
              "Kundali Matching": t("tarot.catKundali") || "Kundali Matching",
              "Birth Charts": t("tarot.catCharts") || "Birth Charts"
            };
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition-all cursor-pointer
                  ${isActive 
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 border-amber-400 text-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.45)] font-bold" 
                    : "bg-[#111015]/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-900/20"}
                `}
              >
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>

        {/* PROGRESS & MASTEED METERS BAR */}
        <div className="flex justify-between items-center max-w-md mx-auto mb-6 px-2 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <span>
              {language === 'hi' ? 'डेक' : language === 'bn' ? 'ডেক' : language === 'mr' ? 'डेक' : language === 'gu' ? 'ડેક' : 'Deck'}: {activeCards.length > 0 ? `${currentIndex + 1} / ${activeCards.length}` : "0"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span className="text-yellow-400 uppercase font-bold">
              {t("tarot.mastered") || "Mastered"}: {masteredIds.size} / {deck.length}
            </span>
          </div>
        </div>

        {/* SHUFFLE & RESET CONTROLS HEADER */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleShuffle}
            disabled={activeCards.length <= 1 || isShuffling}
            className="px-4 py-2 bg-[#16151b] hover:bg-[#201e26] border border-amber-500/15 rounded-lg text-xs font-mono uppercase tracking-widest text-zinc-300 transition-all cursor-pointer flex items-center gap-2 enabled:hover:border-amber-500/40 disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${isShuffling ? "animate-spin" : ""}`} />
            {isShuffling ? t("tarot.shuffling") : (language === 'hi' ? 'कार्ड सफल करें' : language === 'bn' ? 'কার্ড সাফেল করুন' : language === 'mr' ? 'कार्ड शफल करा' : language === 'gu' ? 'કાર્ડ શફલ કરો' : 'Shuffle Cards')}
          </button>
          {masteredIds.size > 0 && (
            <button
              onClick={resetMastery}
              className="px-4 py-2 bg-[#16151b] hover:bg-[#2b1015] border border-red-500/20 rounded-lg text-xs font-mono uppercase tracking-widest text-red-300 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-400" />
              {t("tarot.resetDeck") || "Reset"}
            </button>
          )}
        </div>

        {/* TAROT CARDS WORKSPACE */}
        <div className="flex flex-col items-center justify-center min-h-[460px]">
          
          {activeCards.length > 0 && currentCard ? (
            <div className="relative w-full max-w-sm">
              
              {/* Background mockup cards (fanned deck-effect) */}
              <div className="absolute inset-0 bg-[#08070b] border border-zinc-900 rounded-2xl transform translate-y-3 translate-x-1.5 rotate-3 -z-20 opacity-30 shadow-2xl pointer-events-none" />
              <div className="absolute inset-0 bg-[#0c0b10] border border-zinc-800 rounded-2xl transform -translate-y-1.5 -translate-x-1 rotate-[-2deg] -z-10 opacity-70 shadow-xl pointer-events-none" />

              {/* ACTIVE INTERACTIVE ROTATE CARD CONTAINER */}
              <div
                className={`
                  w-full aspect-[2/3] perspective-1000 cursor-pointer
                  ${isMarkingKnown ? "animate-fly-away" : ""}
                  ${isShuffling ? "animate-shuffle-scatter" : ""}
                `}
                style={{ zIndex: 12 }}
              >
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`
                    relative w-full h-full transition-transform duration-700 transform-style-3d 
                    ${isFlipped ? "rotate-y-180" : ""}
                  `}
                >
                  
                  {/* CARD BACK SIDE (DEFAULT METATRON FILEGREE VIEW) */}
                  <div className="absolute inset-0 backface-hidden bg-[#111015] border-4 border-amber-600/40 rounded-2xl p-6 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.85)] relative overflow-hidden group hover:border-amber-400 transition-all">
                    
                    {/* Glowing background star light */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
                    
                    {/* Classical gold geometric Vector Mandala Pattern in background */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-300">
                      <svg width="220" height="220" viewBox="0 0 200 200" fill="none">
                        <circle cx="100" cy="100" r="90" stroke="#fbbf24" strokeWidth="0.75" strokeDasharray="3 3" />
                        <circle cx="100" cy="100" r="60" stroke="#fbbf24" strokeWidth="0.5" />
                        <circle cx="100" cy="100" r="30" stroke="#fbbf24" strokeWidth="1" />
                        <polygon points="100,10 178,145 22,145" stroke="#fbbf24" strokeWidth="0.5" />
                        <polygon points="100,190 22,55 178,55" stroke="#fbbf24" strokeWidth="0.5" />
                        <line x1="100" y1="0" x2="100" y2="200" stroke="#fbbf24" strokeWidth="0.5" />
                        <line x1="0" y1="100" x2="200" y2="100" stroke="#fbbf24" strokeWidth="0.5" />
                      </svg>
                    </div>

                    {/* Top segment category banner */}
                    <div className="flex justify-between items-center relative z-10 border-b border-zinc-800 pb-3">
                      <span className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase font-bold">
                        {currentCard.category}
                      </span>
                      <span className="text-xl">{currentCard.emoji}</span>
                    </div>

                    {/* Center question */}
                    <div className="my-auto relative z-10 text-center py-6">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-4">
                        {language === 'hi' ? 'रहस्यमयी प्रश्न' : language === 'bn' ? 'রহস্যময় প্রশ্ন' : language === 'mr' ? 'रहस्यमय प्रश्न' : language === 'gu' ? 'રહસ્યમય પ્રશ્ન' : 'Mystery Question'}
                      </span>
                      <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide font-black leading-relaxed">
                        {currentCard.question}
                      </h3>
                    </div>

                    {/* Prompt to click flip */}
                    <div className="text-center relative z-10 border-t border-zinc-800 pt-3">
                      <span className="text-[9px] font-mono text-amber-500/70 uppercase tracking-widest animate-pulse">
                        ✦ {t("tarot.flippedView") || "Tap Card to Unveil Answer"} ✦
                      </span>
                    </div>

                  </div>

                  {/* CARD FRONT SIDE (ANSWER REVEALED) */}
                  <div 
                    className="absolute inset-0 backface-hidden rotate-y-180 bg-[#111015] border-4 rounded-2xl p-6 flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.9)] relative overflow-hidden"
                    style={{ 
                      borderColor: `${currentCategoryGlow}60`,
                      boxShadow: `0 0 35px ${currentCategoryGlow}15, inset 0 0 20px rgba(197,168,128,0.05)`
                    }}
                  >
                    
                    {/* Glowing background reflection */}
                    <div 
                      className="absolute inset-0 opacity-15 mix-blend-color-dodge filter blur-3xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, ${currentCategoryGlow} 0%, transparent 70%)`
                      }}
                    />

                    {/* Header banner */}
                    <div 
                      className="flex justify-between items-center border-b pb-3"
                      style={{ borderColor: `${currentCategoryGlow}30` }}
                    >
                      <span 
                        className="text-[10px] font-mono tracking-widest uppercase font-bold"
                        style={{ color: currentCategoryGlow }}
                      >
                        {language === 'hi' ? 'दिव्य उत्तर' : language === 'bn' ? 'স্বর্গীয় উত্তর' : language === 'mr' ? 'दिव्य उत्तर' : language === 'gu' ? 'દિવ્ય ઉત્તર' : 'Celestial Answer'}
                      </span>
                      <span className="text-xl" style={{ filter: `drop-shadow(0 0 5px ${currentCategoryGlow}50)` }}>
                        {currentCard.emoji}
                      </span>
                    </div>

                    {/* Core Answer content */}
                    <div className="my-auto py-4">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-2 text-center">
                        {language === 'hi' ? 'आध्यात्मिक अंतर्दृष्टि' : language === 'bn' ? 'আধ্যাত্মিক অন্তর্দৃষ্টি' : language === 'mr' ? 'आध्यात्मिक अंतर्दृष्टी' : language === 'gu' ? 'આધ્યાત્મિક સમજ' : 'Spiritual Insight'}
                      </span>
                      <p className="text-sm md:text-base text-zinc-100 font-sans leading-relaxed text-center font-medium">
                        {currentCard.answer}
                      </p>
                    </div>

                    {/* Action prompt */}
                    <div 
                      className="text-center border-t pt-3"
                      style={{ borderColor: `${currentCategoryGlow}20` }}
                    >
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                        {language === 'hi' ? 'वापस पलटने के लिए क्लिक करें' : language === 'bn' ? 'উল্টাতে ফ্লিপ করুন' : language === 'mr' ? 'परत फिरवण्यासाठी टॅप करा' : language === 'gu' ? 'પાછા ફેરવવા માટે ટેપ કરો' : 'Tap To flip Back'}
                      </span>
                    </div>

                  </div>

                </div>
              </div>

              {/* CARD DECK PREV/NEXT & MASTERED NAVIGATION CHANNELS */}
              <div className="flex justify-between items-center mt-8 gap-4 px-2">
                
                {/* Prev */}
                <button
                  onClick={handlePrev}
                  className="p-3 bg-[#16151b] hover:bg-[#201e26] border border-zinc-800 hover:border-amber-500/50 rounded-full transition-all text-zinc-400 hover:text-white cursor-pointer"
                  title={t("tarot.prev") || "Previous Card"}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Mark as Known CTA */}
                <button
                  onClick={handleMarkAsKnown}
                  className="flex-1 py-3 px-5 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-mono uppercase tracking-widest text-xs font-bold rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.25)] hover:shadow-[0_0_25px_rgba(197,168,128,0.4)] flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-white" />
                  {t("tarot.markKnown") || "Mark as Mastered"}
                </button>

                {/* Next */}
                <button
                  onClick={handleNext}
                  className="p-3 bg-[#16151b] hover:bg-[#201e26] border border-zinc-800 hover:border-amber-500/50 rounded-full transition-all text-zinc-400 hover:text-white cursor-pointer"
                  title={t("tarot.next") || "Next Card"}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

              </div>

            </div>
          ) : (
            
            /* CONGRATULATIONS MASTER DECK SCREEN */
            <div className="bg-[#111015]/60 border border-yellow-500/40 p-10 rounded-2xl w-full max-w-md text-center backdrop-blur-md shadow-[0_0_35px_rgba(251,191,36,0.15)] animate-fade-in relative z-10">
              
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/40 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                <Award className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>

              <h3 className="text-2xl font-serif text-white tracking-widest font-black uppercase">
                {t("tarot.emptyDeck") || "Deck Fully Mastered!"}
              </h3>
              
              <p className="text-xs font-mono text-yellow-300 uppercase mt-2 tracking-widest font-bold">
                {language === 'hi' ? 'स्तर पूर्ण • संरेखण सुसंगत' : language === 'bn' ? 'লেভেল সম্পন্ন • অ্যালাইনমেন্ট সংগত' : language === 'mr' ? 'स्तर पूर्ण • संरेखन सुसंगत' : language === 'gu' ? 'લેવલ પૂર્ણ • સંતુલન સુસંગત' : 'Level Complete • Alignments Harmonized'}
              </p>

              <p className="text-sm font-sans text-zinc-400 mt-4 leading-relaxed">
                {t("tarot.emptySub") || "You have integrated all cosmic numerology flashcards under this filter category. The mystical orbits are fully synced to your mind."}
              </p>

              <div className="mt-8 space-y-3">
                <button
                  onClick={resetMastery}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.25)]"
                >
                  {t("tarot.resetDeck") || "Reset Study Progress"}
                </button>
                <button
                  onClick={() => setActiveCategory("All")}
                  className="w-full py-2.5 bg-transparent border border-zinc-800 hover:border-amber-500/40 font-mono text-zinc-400 text-xs rounded-lg uppercase tracking-widest transition-all cursor-pointer"
                >
                  {language === 'hi' ? 'सभी श्रेणियों का अन्वेषण करें' : language === 'bn' ? 'সব বিভাগ অন্বেষণ করুন' : language === 'mr' ? 'सर्व श्रेणी शोधा' : language === 'gu' ? 'બધી શ્રેણીઓ તપાસો' : 'Explore All Categories'}
                </button>
              </div>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}
