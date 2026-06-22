import React, { useState } from "react";
import { zodiacNumberData, numberMeanings } from "../data/numerologyData";
import { Compass, Sparkles, Orbit } from "lucide-react";
import ThreeDPlanet from "./ThreeDPlanet";
import CelestialBackground from "./CelestialBackground";
import { useLanguage } from "../context/LanguageContext";

// Deterministic calendar scale generator for real-time horoscope readings
function generateDailyHoroscope(signName: string, planetName: string, element: string, number: number) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  
  const seedStr = `${signName}-${year}-${month}-${day}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  
  const physicalEnergy = 52 + (absHash % 43); // 52% to 94%
  const loveHarmony = 54 + ((absHash >> 2) % 41); // 54% to 94%
  const careerManifest = 50 + ((absHash >> 4) % 45); // 50% to 94%
  
  const houses = [
    "1st House of Self-Identity & New Beginnings",
    "2nd House of Values, Income & Self-Worth",
    "3rd House of Expression, Siblings & Intellectual Curiosity",
    "4th House of Ancestry, Home & Inner Comfort",
    "5th House of Creative Joy, Romance & Artistic Spark",
    "6th House of Sacred Rituals, Health & Daily Duty",
    "7th House of Sacred Commitments, Mirrors & Marriage",
    "8th House of Karmic Transitions, Shared Wealth & Subconscious Alchemy",
    "9th House of High philosophy, Travel & Spiritual Expansion",
    "10th House of Career Heights, Fame & Sovereign Legacy",
    "11th House of Community Grids, Hopes & Cosmic Allies",
    "12th House of Solitude, Dreams & Divine Release"
  ];
  const activeHouse = houses[absHash % houses.length];
  
  const themes = [
    "Material Metamorphosis",
    "Spiritual Rebirth & Alignment",
    "Vocalizing Hidden Truths",
    "Structuring Practical Boundaries",
    "Deep Emotional Catharsis",
    "Rekindling Original Joy",
    "Surrendering Past Karmic Bonds",
    "Elevating Community Grids",
    "Grounding Chaotic Intellect",
    "Activating Primal Sovereignty"
  ];
  const activeTheme = themes[(absHash >> 3) % themes.length];
  
  const planetAlignments = [
    `sextile with Mercury`,
    `trine with Venus`,
    `conjunction with Mars`,
    `opposition with Jupiter`,
    `square with Saturn`,
    `semi-sextile with Uranus`,
    `quincunx with Neptune`
  ];
  const currentAlignment = planetAlignments[(absHash >> 5) % planetAlignments.length];

  const affirmations = [
    "I release the urge to control; I flow with the natural cycles of cosmic light.",
    "My worth is not defined by external outputs. I am a sovereign child of the stars.",
    "I trust the silent, magical whisper of my intuitive guidance today.",
    "Every delay is a divine protection, aligning me with superior opportunities.",
    "I speak my truth with pristine clarity and compassionate strength.",
    "I am open to receiving abundance in expected and miraculous ways today.",
    "I anchor my energy deep in the earth, remaining steady amidst emotional storms."
  ];
  const dailyAffirmation = affirmations[(absHash >> 6) % affirmations.length];

  let paragraph = "";
  if (element === "Fire") {
    const sentences = [
      `Today, your ruling planet ${planetName} forms a dramatic ${currentAlignment}, igniting a powerful current of pioneering energy through your ${activeHouse}. It is an exceptional day to initiate bold projects and break free from stagnant routines.`,
      `The celestial climate ignites your inner furnace. With the grand astronomical transit highlighting your ${activeHouse}, your primary focus shifts to authentic self-assertion. Avoid reckless impulses, but do not hesitate to claim your sovereign space.`,
      `Fire demands flow. Under a geocentric deterministic cosmic calculation, the current astro-grid activates high-vibrational insights in your ${activeHouse}. You are encouraged to channel this fierce focus into structured, strategic goals.`
    ];
    paragraph = sentences[absHash % sentences.length];
  } else if (element === "Water") {
    const sentences = [
      `As a Water sign, the geocentric currents today pull your intense intuitive powers into quiet, profound tides. Your ruler ${planetName} in ${currentAlignment} opens a mystical channel in your ${activeHouse}. Listen to your deepest gut feelings.`,
      `Your emotional landscape is particularly receptive today as transits activate your ${activeHouse}. It is a perfect day for healing work, releasing old cosmic static, and nurturing close energetic alliances.`,
      `The cosmic waters run deep today. With a beautiful energetic flow through your ${activeHouse}, you are gifted with the power of emotional alchemy. Share your healing rays, but ensure your personal energetic shield is fully active.`
    ];
    paragraph = sentences[absHash % sentences.length];
  } else if (element === "Air") {
    const sentences = [
      `The mental winds are blowing fresh and clear today. Your ruling planet ${planetName} is beautifully aspected in ${currentAlignment}, charging your intellectual grid. A major breakthrough occurs inside your ${activeHouse}.`,
      `Communication is your sacred wand today. As the transits stimulate your ${activeHouse}, your words carry a high-vibrational resonance. Engage in cooperative strategy, write down your flashing insights, and share your vision with your allies.`,
      `The cosmic air currents bring dynamic adaptivity. The current celestial configuration highlights your ${activeHouse}, urging you to synthesize information from diverse spheres. Trust the intelligence of your curious, expansive mind.`
    ];
    paragraph = sentences[absHash % sentences.length];
  } else { // Earth
    const sentences = [
      `Today's grounded celestial frequencies support systematic, patient progress. Your ruling sphere ${planetName} in ${currentAlignment} brings structure to your ${activeHouse}. Concrete financial or home improvements are highly favored.`,
      `Slow down and anchor. With the transit energies focused on your ${activeHouse}, your capacity to build durable, beautiful foundations is magnified. Take practical steps to secure your wealth and emotional boundaries.`,
      `Earth is the builder. The deterministic astrological grids alignment today highlights your ${activeHouse}, urging you to translate spiritual vision into physical milestones. Your patience and discipline will earn heavy dividends.`
    ];
    paragraph = sentences[absHash % sentences.length];
  }

  const luckyHour = 1 + (absHash % 12);
  const ampm = (absHash % 2 === 0) ? "AM" : "PM";
  
  return {
    theme: activeTheme,
    house: activeHouse,
    physicalEnergy,
    loveHarmony,
    careerManifest,
    affirmation: dailyAffirmation,
    reading: paragraph,
    luckyTime: `${luckyHour}:00 ${ampm}`,
    luckyNumber: (absHash % 9) + 1
  };
}

export default function ZodiacWheel() {
  const { language, t, getZodiacList, getNumberMeaning } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Wheel dimensions
  const radius = 175; // px circular radius
  const entriesCount = 12;

  const activeIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;
  const zodiacList = getZodiacList();
  const activeSign = zodiacList[activeIdx];

  // Wheel perspective tilt parameters when hovered
  const getTiltStyle = () => {
    const tiltIdx = hoveredIdx !== null ? hoveredIdx : selectedIdx;
    const angle = (tiltIdx * 360) / entriesCount;
    // Slightly tilt towards current index
    return {
      transform: `perspective(1200px) rotateX(22deg) rotateY(${(angle - 180) * 0.04}deg)`,
    };
  };

  return (
    <section id="wheel" className="relative py-52 md:py-64 px-4 bg-transparent border-t border-amber-500/5 overflow-hidden">
      
      {/* Background celestial effect background layer */}
      <CelestialBackground glowColor="amber" intensity="medium" />
      
      {/* Back glow orbs */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-400/20 rounded-full text-xs text-amber-300 font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <Orbit className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            {language === 'hi' ? 'खगोलीय-संख्यात्मक मैट्रिक्स' : language === 'bn' ? 'নাক্ষত্রিক-সাংখ্যিক ম্যাট্রিক্স' : language === 'mr' ? 'खगोलीय-संख्यात्मक मॅट्रिक्स' : language === 'gu' ? 'ખગોળીય-સંખ્યાત્મક મેટ્રિક્સ' : 'Astral-Numerical Matrix'}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wider font-bold shadow-glow-title">
            {t("zodiac.title") || "THE ZODIAC DIAL"}
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            {t("zodiac.sub") || "Hover over constellations of the zodiac to analyze their mathematical links, ruling cosmic entities, and numerological rays."}
          </p>
        </div>

        {/* PERSPECTIVE WORKSPACE PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: THE WHEEL (Trig positioned absolute circle, spans 7 cols) */}
          <div className="lg:col-span-7 flex justify-center items-center h-[320px] xs:h-[380px] sm:h-[430px] md:h-[480px] lg:h-[520px] relative overflow-hidden">
            
            {/* Tilted relative frame */}
            <div
              style={getTiltStyle()}
              className="relative w-[480px] h-[480px] rounded-full border border-zinc-850 flex items-center justify-center transition-all duration-700 ease-out origin-center scale-[0.58] xs:scale-[0.72] sm:scale-[0.85] md:scale-[0.95] lg:scale-100"
            >
              
              {/* Outer decorative gold ring */}
              <div className="absolute inset-2 rounded-full border border-yellow-500/10 pointer-events-none shadow-[0_0_20px_rgba(251,191,36,0.03),inset_0_0_15px_rgba(251,191,36,0.03)]" />
              <div className="absolute inset-8 rounded-full border-2 border-zinc-805 pointer-events-none border-dashed animate-spin" style={{ animationDuration: "120s" }} />

              {/* CONNECTIVE SVG LINE (From central orbit to active node) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                <line
                  x1="240"
                  y1="240"
                  x2={240 + radius * Math.cos((activeIdx * 2 * Math.PI) / entriesCount - Math.PI / 2)}
                  y2={240 + radius * Math.sin((activeIdx * 2 * Math.PI) / entriesCount - Math.PI / 2)}
                  stroke={getNumberMeaning(activeSign.number)?.color || "#c5a880"}
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  className="animate-dash"
                />
              </svg>

              {/* CORE CENTRAL ORB (displays central active sign/number alignment) */}
              <div
                className="absolute w-24 h-24 rounded-full flex flex-col items-center justify-center border-4 border-[#16151b] shadow-[0_0_40px_rgba(197,168,128,0.22)] relative z-10 select-none bg-[#111015]"
                style={{
                  borderColor: getNumberMeaning(activeSign.number)?.color || "#c5a880",
                  boxShadow: `0 0 35px ${getNumberMeaning(activeSign.number)?.color || "#c5a880"}50`
                }}
              >
                <div className="text-center animate-fade-in flex flex-col items-center">
                  <span className="text-3xl font-serif font-black text-white" style={{ textShadow: `0 0 8px ${getNumberMeaning(activeSign.number)?.color}90` }}>
                    {activeSign.number}
                  </span>
                  <span 
                    className="text-[9px] font-mono tracking-widest uppercase font-bold"
                    style={{ color: getNumberMeaning(activeSign.number)?.color }}
                  >
                    {t("zodiac.linked") || "Linked"}
                  </span>
                </div>
              </div>

              {/* 12 ZODIAC SIGNS (TRIG MATHEMATIC POSITION) */}
              {zodiacList.map((sign, idx) => {
                const angle = (idx * 2 * Math.PI) / entriesCount - Math.PI / 2; // offset 1/4 rot to start at top (12 o'clock)
                const xVal = radius * Math.cos(angle);
                const yVal = radius * Math.sin(angle);
                const isHovered = hoveredIdx === idx;

                const nodeColor = getNumberMeaning(sign.number)?.color || "#c5a880";

                return (
                  <div
                    key={sign.sign}
                    onMouseEnter={() => {
                      setHoveredIdx(idx);
                      setSelectedIdx(idx);
                    }}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`
                      absolute w-12 h-12 rounded-full flex flex-col items-center justify-center cursor-crosshair
                      border transition-all duration-300 select-none bg-[#111015]/95
                    `}
                    style={{
                      transform: `translate3d(${xVal}px, ${yVal}px, 0) scale(${isHovered ? 1.25 : 1.0})`,
                      zIndex: isHovered ? 25 : 10,
                      borderColor: isHovered ? nodeColor : "rgba(197,168,128,0.2)",
                      boxShadow: isHovered ? `0 0 20px ${nodeColor}80` : "none"
                    }}
                  >
                    <span className="text-lg text-white" style={{ color: isHovered ? nodeColor : "white" }}>
                      {sign.glyph}
                    </span>
                    <span className="text-[7px] font-mono text-zinc-500 uppercase group-hover:text-white truncate">
                      {sign.sign.substring(0, 3)}
                    </span>
                  </div>
                );
              })}

            </div>
          </div>

          {/* RIGHT: ACTIVE NODE DETAILS (Spans 5 cols) */}
          <div className="lg:col-span-5">
            {activeSign ? (
              <div className="bg-[#111015]/80 border border-zinc-805 p-6 md:p-8 rounded-2xl relative shadow-2xl animate-fade-in">
                
                {/* Accent vertical boundary */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" 
                  style={{ backgroundColor: getNumberMeaning(activeSign.number)?.color }}
                />

                <div className="flex justify-between items-center pb-4 border-b border-zinc-800 mb-5">
                  <div>
                    <span className="text-[10px] font-mono text-[#fbbf24] uppercase tracking-wider block">
                      {language === 'hi' ? 'ज्योतिषीय संकल्पना' : language === 'bn' ? 'জ্যোতিষ তাত্ত্বিক নোঙ্গর' : language === 'mr' ? 'ज्योतिषीय संदर्भ' : language === 'gu' ? 'જ્યોતિષીય સંકલન' : 'Astrological Anchor'}
                    </span>
                    <h3 className="text-2xl font-serif text-white tracking-wider font-bold">
                      {activeSign.sign} {language === "hi" ? "नक्षत्र" : language === "bn" ? "নক্ষত্রমণ্ডল" : language === "mr" ? "नक्षत्र" : language === "gu" ? "નક્ષત્ર" : "Constellation"}
                    </h3>
                  </div>
                  <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">{activeSign.glyph}</span>
                </div>

                <div className="space-y-4">
                  {/* 3D Planetary Simulation */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block tracking-wider font-semibold">
                      {language === 'hi' ? 'त्रिविमीय ब्रह्मांडीय घुमाव (सक्रिय घूर्णन)' : language === 'bn' ? 'ত্রিমাত্রিক গোলক সংযোগ (ঘূর্ণায়মান)' : language === 'mr' ? 'त्रिमिती गोलाकार संरेखन' : language === 'gu' ? 'ત્રિ-પરિમાણીય ગોળાકાર સંતુલન' : '3D Spherical Alignment (Revolving)'}
                    </span>
                    <ThreeDPlanet planetName={zodiacNumberData[activeIdx]?.rulingPlanet || "Mars"} />
                  </div>

                  {/* Planet & Element Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#09080c]/80 p-3 rounded-xl border border-zinc-850">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">{t("zodiac.rulingSphere") || "Ruling Sphere"}</span>
                      <span className="text-sm font-serif text-white font-bold">{activeSign.rulingPlanet}</span>
                    </div>
                    <div className="bg-[#09080c]/80 p-3 rounded-xl border border-zinc-850">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">{t("zodiac.triplicityElement") || "Triplicity Element"}</span>
                      <span className="text-sm font-serif text-white font-bold">{activeSign.element}</span>
                    </div>
                  </div>

                  {/* Association Segment */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase block font-bold">{t("zodiac.resonatingKey") || "Resonating Numerology Key"}</span>
                    <div className="flex gap-4.5 items-center p-3 rounded-xl bg-[#09080c]/45 border border-zinc-850">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center border text-white font-serif font-black"
                        style={{
                          borderColor: getNumberMeaning(activeSign.number)?.color,
                          background: `radial-gradient(circle, ${getNumberMeaning(activeSign.number)?.color}25 0%, transparent 100%)`
                        }}
                      >
                        {activeSign.number}
                      </div>
                      <div>
                        <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">
                          {getNumberMeaning(activeSign.number)?.title}
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                          {t("zodiac.resonanceSubText") || "Frequencies and astral lines aligned."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Essence */}
                  <div className="space-y-1 border-t border-zinc-800 pt-4">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase block">{t("zodiac.archetypeRays") || "Rays of the Archetype"}</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans italic animate-fade-in">
                      "{getNumberMeaning(activeSign.number)?.essence}"
                    </p>
                  </div>

                  {/* DAILY TRANSIT HOROSCOPE */}
                  <div className="mt-5 pt-5 border-t border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                        🔮 Daily Transit Horoscope (Real-Time Grid)
                      </span>
                      <span className="text-[8px] font-mono text-zinc-500 uppercase">
                        {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {(() => {
                      const ds = generateDailyHoroscope(activeSign.sign, activeSign.rulingPlanet, activeSign.element, activeSign.number);
                      return (
                        <div className="space-y-3.5 bg-amber-500/5 rounded-xl p-4 border border-amber-500/10">
                          {/* Theme and Focus */}
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="text-[8px] font-mono text-zinc-500 uppercase font-black tracking-widest block">Transit Theme</span>
                              <h4 className="text-sm font-serif text-white font-bold tracking-wide mt-0.5">{ds.theme}</h4>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] font-mono text-zinc-500 uppercase font-black tracking-widest block">Active Vector</span>
                              <span className="text-[10px] font-mono text-amber-300 font-bold block mt-0.5">{ds.house.split(" of ")[0]}</span>
                            </div>
                          </div>

                          {/* Reading Paragraph */}
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light">
                            {ds.reading}
                          </p>

                          {/* Affirmation Card */}
                          <div className="bg-[#111015]/60 border border-zinc-800/80 px-3 py-2.5 rounded-lg">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-widest">Affirmation of the Day</span>
                            <p className="text-[10.5px] text-amber-200/90 italic font-serif leading-snug mt-1 font-light">
                              "{ds.affirmation}"
                            </p>
                          </div>

                          {/* Deterministic score bars */}
                          <div className="space-y-2.5 pt-2 border-t border-zinc-900">
                            <div>
                              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1">
                                <span>⚡ Physical Vitality</span>
                                <span className="text-zinc-450">{ds.physicalEnergy}%</span>
                              </div>
                              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400" style={{ width: `${ds.physicalEnergy}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1">
                                <span>💖 Heart Resonance</span>
                                <span className="text-zinc-455">{ds.loveHarmony}%</span>
                              </div>
                              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-teal-400" style={{ width: `${ds.loveHarmony}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 mb-1">
                                <span>💼 Career Alignment</span>
                                <span className="text-zinc-450">{ds.careerManifest}%</span>
                              </div>
                              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-400" style={{ width: `${ds.careerManifest}%` }} />
                              </div>
                            </div>
                          </div>

                          {/* Lucky items row */}
                          <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs border-t border-zinc-900">
                            <div className="bg-[#111015]/40 px-2 py-1.5 rounded border border-zinc-850">
                              <span className="block text-[8px] font-mono text-zinc-500 uppercase">Lucky Time</span>
                              <span className="font-mono text-zinc-300 font-bold">{ds.luckyTime}</span>
                            </div>
                            <div className="bg-[#111015]/40 px-2 py-1.5 rounded border border-zinc-850">
                              <span className="block text-[8px] font-mono text-zinc-500 uppercase">Lucky Frequency</span>
                              <span className="font-mono text-zinc-300 font-bold">Number {ds.luckyNumber}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-[#111015]/30 border border-zinc-800 p-8 rounded-2xl text-center shadow-xl border-dashed">
                <Compass className="w-12 h-12 text-amber-500/40 animate-spin mx-auto pb-1.5" style={{ animationDuration: "20s" }} />
                <h3 className="text-lg font-serif text-zinc-400 uppercase tracking-widest mt-2 border-b border-zinc-850 pb-2">
                  {language === 'hi' ? 'खगोलीय संबंध' : language === 'bn' ? 'মহাজাগতিক সম্পর্ক' : language === 'mr' ? 'खगोलीय संबंध' : language === 'gu' ? 'ખગોળીય સંબંધ' : 'Astral Correspondence'}
                </h3>
                <p className="text-xs text-zinc-500/70 max-w-sm mx-auto mt-2 leading-relaxed">
                  {t("zodiac.hoverPrompt") || "Hover over circular dial nodes to reveal their correspondence details."}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
}
