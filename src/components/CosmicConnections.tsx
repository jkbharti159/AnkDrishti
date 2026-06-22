import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { get_planetary_positions, mulankProfiles } from "../data/vedicData";
import { pythagoreanMap } from "../data/numerologyData";
import { 
  Heart, Sparkles, RefreshCw, Moon, Sun, Star, Info, ShieldAlert, Award, Calendar, Clock, MapPin, Volume2, Square, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Swastika from "./Swastika";
import CompatibilityVideoBackground from "./CompatibilityVideoBackground";

type ActiveTab = "compatibility" | "marriage" | "kundali";
type AnimState = "idle" | "checking" | "finished";

const NAKSHATRAS = [
  { name: "Ashwini", ruler: "Ketu", gana: "Deva", nadi: "Aadi" },
  { name: "Bharani", ruler: "Venus", gana: "Manushya", nadi: "Madhya" },
  { name: "Krittika", ruler: "Sun", gana: "Rakshasa", nadi: "Antya" },
  { name: "Rohini", ruler: "Moon", gana: "Manushya", nadi: "Antya" },
  { name: "Mrigashira", ruler: "Mars", gana: "Deva", nadi: "Madhya" },
  { name: "Ardra", ruler: "Rahu", gana: "Manushya", nadi: "Aadi" },
  { name: "Punarvasu", ruler: "Jupiter", gana: "Deva", nadi: "Aadi" },
  { name: "Pushya", ruler: "Saturn", gana: "Deva", nadi: "Madhya" },
  { name: "Ashlesha", ruler: "Mercury", gana: "Rakshasa", nadi: "Antya" },
  { name: "Magha", ruler: "Ketu", gana: "Rakshasa", nadi: "Antya" },
  { name: "Purva Phalguni", ruler: "Venus", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Phalguni", ruler: "Sun", gana: "Manushya", nadi: "Aadi" },
  { name: "Hasta", ruler: "Moon", gana: "Deva", nadi: "Aadi" },
  { name: "Chitra", ruler: "Mars", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Swati", ruler: "Rahu", gana: "Deva", nadi: "Antya" },
  { name: "Vishakha", ruler: "Jupiter", gana: "Rakshasa", nadi: "Antya" },
  { name: "Anuradha", ruler: "Saturn", gana: "Deva", nadi: "Madhya" },
  { name: "Jyeshtha", ruler: "Mercury", gana: "Rakshasa", nadi: "Aadi" },
  { name: "Mula", ruler: "Ketu", gana: "Rakshasa", nadi: "Aadi" },
  { name: "Purva Ashadha", ruler: "Venus", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Ashadha", ruler: "Sun", gana: "Manushya", nadi: "Antya" },
  { name: "Shravana", ruler: "Moon", gana: "Deva", nadi: "Antya" },
  { name: "Dhanishta", ruler: "Mars", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Shatabhisha", ruler: "Rahu", gana: "Rakshasa", nadi: "Aadi" },
  { name: "Purva Bhadrapada", ruler: "Jupiter", gana: "Manushya", nadi: "Aadi" },
  { name: "Uttara Bhadrapada", ruler: "Saturn", gana: "Manushya", nadi: "Madhya" },
  { name: "Revati", ruler: "Mercury", gana: "Deva", nadi: "Antya" }
];

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", 
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

const PLANETARY_RELATIONS: Record<string, { friends: string[]; enemies: string[]; neutrals: string[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"], neutrals: ["Mercury"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [], neutrals: ["Mars", "Jupiter", "Venus", "Saturn"] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"], neutrals: ["Venus", "Saturn"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"], neutrals: ["Mars", "Jupiter", "Saturn"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"], neutrals: ["Saturn"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"], neutrals: ["Mars", "Jupiter"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"], neutrals: ["Jupiter"] },
  Rahu: { friends: ["Mercury", "Venus", "Saturn"], enemies: ["Sun", "Moon", "Mars"], neutrals: ["Jupiter"] },
  Ketu: { friends: ["Mars", "Jupiter"], enemies: ["Sun", "Moon"], neutrals: ["Mercury", "Venus", "Saturn"] }
};

function getPlanetaryRelation(p1: string, p2: string): "Friend" | "Neutral" | "Enemy" {
  const rels = PLANETARY_RELATIONS[p1];
  if (!rels) return "Neutral";
  if (rels.friends.includes(p2)) return "Friend";
  if (rels.enemies.includes(p2)) return "Enemy";
  return "Neutral";
}

const YONI_ANIMALS = [
  { name: "Horse", naks: [0, 23] },
  { name: "Elephant", naks: [1, 26] },
  { name: "Sheep", naks: [2, 7] },
  { name: "Serpent", naks: [3, 4] },
  { name: "Dog", naks: [5, 18] },
  { name: "Cat", naks: [6, 8] },
  { name: "Rat", naks: [9, 10] },
  { name: "Cow", naks: [11, 25] },
  { name: "Buffalo", naks: [12, 14] },
  { name: "Tiger", naks: [13, 15] },
  { name: "Deer", naks: [16, 17] },
  { name: "Monkey", naks: [19, 21] },
  { name: "Lion", naks: [20, 22] },
  { name: "Mongoose", naks: [24] }
];

// Calculation Helpers
const reduceToSingleDigit = (num: number): number => {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = String(num)
      .split("")
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num;
};

const getVedicMulank = (dayStr: string): number => {
  let val = parseInt(dayStr, 10) || 1;
  while (val > 9) {
    val = String(val).split("").reduce((acc, char) => acc + parseInt(char, 10), 0);
  }
  return val;
};

const getLifePath = (dobStr: string): number => {
  const digitsSum = dobStr.replace(/[^0-9]/g, "").split("").reduce((sum, char) => sum + parseInt(char, 10), 0);
  return reduceToSingleDigit(digitsSum);
};

const getNameNumbers = (fullName: string) => {
  const sanitized = fullName.toUpperCase().replace(/[^A-Z]/g, "");
  const totalSum = sanitized.split("").reduce((sum, char) => sum + (pythagoreanMap[char] || 0), 0);
  const expression = reduceToSingleDigit(totalSum);

  const vowels = ["A", "E", "I", "O", "U"];
  const vowelSum = sanitized.split("").filter(c => vowels.includes(c)).reduce((sum, char) => sum + (pythagoreanMap[char] || 0), 0);
  const soulUrge = reduceToSingleDigit(vowelSum);

  return { expression, soulUrge };
};

const getScoreCompatibility = (num1: number, num2: number, isMulank = false): number => {
  if (num1 === num2) return 92;

  // Families
  const families = [
    [1, 5, 7],
    [2, 4, 8],
    [3, 6, 9]
  ];
  if (families.some(fam => fam.includes(num1) && fam.includes(num2))) return 85;

  if (isMulank) {
    const profile = mulankProfiles[num1];
    if (profile) {
      if (profile.luckyNumbers.includes(num2)) return 80;
      if (profile.challengingNumbers.includes(num2)) return 40;
      if (profile.neutralNumbers.includes(num2)) return 65;
    }
  }

  // Friendly Pairs
  const friendly: Record<number, number[]> = {
    1: [3, 5, 9],
    2: [4, 6, 8],
    3: [1, 5, 7, 9],
    4: [2, 5, 6, 8],
    5: [1, 3, 4, 6, 9],
    6: [2, 5, 8, 9],
    7: [3, 5, 6],
    8: [2, 4, 5, 6],
    9: [1, 3, 6, 9],
    11: [2, 7, 11],
    22: [4, 8, 22],
    33: [6, 9, 33]
  };

  if (friendly[num1]?.includes(num2) || friendly[num2]?.includes(num1)) return 78;
  return 60;
};

const getPlanetAbbreviation = (pName: string): string => {
  switch (pName) {
    case "Sun": return "Su";
    case "Moon": return "Mo";
    case "Mars": return "Ma";
    case "Mercury": return "Me";
    case "Jupiter": return "Ju";
    case "Venus": return "Ve";
    case "Saturn": return "Sa";
    case "Rahu": return "Ra";
    case "Ketu": return "Ke";
    default: return pName.slice(0, 2);
  }
};

const ZODIAC_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const SIGN_COLORS: Record<string, string> = {
  Fire: "#f97316",  // Amber-Orange
  Earth: "#84cc16", // Lime-Green
  Air: "#06b6d4",   // Cyan-Blue
  Water: "#3b82f6"  // Blue
};

const getPlanetColor = (name: string): string => {
  switch (name) {
    case "Sun": return "#f59e0b";       // Auspicious Solar Gold
    case "Moon": return "#38bdf8";      // Ethereal Moon Sky Blue
    case "Mars": return "#f43f5e";      // Fiery Red-Rose
    case "Mercury": return "#10b981";   // Communication Emerald
    case "Jupiter": return "#a855f7";   // Royal Wisdom Violet
    case "Venus": return "#ec4899";     // Artistic Loving Pink
    case "Saturn": return "#6366f1";    // Disciplined Indigo
    case "Rahu": return "#64748b";      // Shadow Slate
    case "Ketu": return "#14b8a6";      // Mystic Teal
    default: return "#94a3b8";
  }
};

const getPlanetStatus = (planetName: string, partnerName: string) => {
  const seed = `${partnerName}-${planetName}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const absHash = Math.abs(hash);
  const isRetrograde = ["Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(planetName) && (absHash % 10 < 2);
  const isCombust = planetName !== "Sun" && planetName !== "Rahu" && planetName !== "Ketu" && (absHash % 10 === 3);
  return {
    isRetrograde: ["Rahu", "Ketu"].includes(planetName) ? true : isRetrograde,
    isCombust
  };
};

const getDignity = (planetName: string, signIdx: number): string => {
  const exaltations: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
  const debilitations: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
  
  if (exaltations[planetName] === signIdx) return "Exalted 🌟";
  if (debilitations[planetName] === signIdx) return "Debilitated ⚠️";
  
  const friendships: Record<string, { friends: number[]; enemies: number[] }> = {
    Sun: { friends: [0, 4, 8, 3], enemies: [6, 10, 9] },
    Moon: { friends: [0, 1, 3, 5], enemies: [7, 10] },
    Mars: { friends: [0, 4, 3, 8], enemies: [1, 6] },
    Mercury: { friends: [1, 2, 6, 5], enemies: [3, 7] },
    Jupiter: { friends: [0, 3, 4, 8, 11], enemies: [1, 2, 5, 6] },
    Venus: { friends: [1, 2, 5, 6, 10], enemies: [0, 4] },
    Saturn: { friends: [1, 2, 6, 10, 11], enemies: [0, 4, 7] }
  };
  
  const relations = friendships[planetName];
  if (relations) {
    if (relations.friends.includes(signIdx)) return "Friendly Sign 🤝";
    if (relations.enemies.includes(signIdx)) return "Enemy Sign ⚡";
  }
  return "Neutral Sign ⚖️";
};

const getPlanetOffsets = (count: number) => {
  if (count === 1) {
    return [{ dx: 0, dy: 0 }];
  }
  if (count === 2) {
    return [
      { dx: -18, dy: 0 },
      { dx: 18, dy: 0 }
    ];
  }
  if (count === 3) {
    return [
      { dx: 0, dy: -14 },
      { dx: -18, dy: 12 },
      { dx: 18, dy: 12 }
    ];
  }
  if (count === 4) {
    return [
      { dx: -16, dy: -14 },
      { dx: 16, dy: -14 },
      { dx: -16, dy: 14 },
      { dx: 16, dy: 14 }
    ];
  }
  // 5 or more planets
  const offsets = [];
  const cols = 3;
  const rows = Math.ceil(count / cols);
  const colSpacing = 20;
  const rowSpacing = 16;
  
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    let activeColsInRow = cols;
    let offsetLeft = 0;
    if (r === rows - 1) {
      activeColsInRow = count - r * cols;
      if (activeColsInRow === 1) offsetLeft = colSpacing;
      if (activeColsInRow === 2) offsetLeft = colSpacing / 2;
    }
    const dx = (c - (activeColsInRow - 1) / 2) * colSpacing - offsetLeft;
    const dy = (r - (rows - 1) / 2) * rowSpacing;
    offsets.push({ dx, dy });
  }
  return offsets;
};

const HOUSE_SIGNIFICATIONS: Record<number, { name: string; significations: string; keyFocus: string }> = {
  1: { name: "Tanur Bhava (Ascendant)", significations: "Self-expression, Charisma, Body constitution & General Life Path", keyFocus: "Self & Body" },
  2: { name: "Dhana Bhava (Wealth)", significations: "Personal Assets, Liquid Wealth, Voices, speech & family roots", keyFocus: "Wealth & Finance" },
  3: { name: "Sahaja Bhava (Courage)", significations: "Siblings, communication, deep intellectual projects & creative force", keyFocus: "Courage & Expression" },
  4: { name: "Bandhu Bhava (Ancestry)", significations: "Mother, inner comforts, emotional sanctuary & domestic stability", keyFocus: "Home & Heart" },
  5: { name: "Putra Bhava (Intellect)", significations: "Creative passion, intelligence, dynamic speculations & past-life merits", keyFocus: "Creativity & Joy" },
  6: { name: "Shatru Bhava (Duties)", significations: "Debts, obstacles, daily routines, therapeutic work & core discipline", keyFocus: "Vigilance & Duty" },
  7: { name: "Yuvati Bhava (Partners)", significations: "Marital bonds, business partnerships, public relations & mirroring other souls", keyFocus: "Marriage & Alliances" },
  8: { name: "Randhra Bhava (Transformations)", significations: "Life secrets, research, sudden inheritance, unearned wealth & occult sciences", keyFocus: "Alchemy & Change" },
  9: { name: "Dharma Bhava (Fortune)", significations: "High learning, spiritual travel, dad/guru relationship & overall grace", keyFocus: "Virtue & Guiding Grace" },
  10: { name: "Karma Bhava (Careers)", significations: "Public recognition, fame, heavy professional actions & social authority", keyFocus: "Sovereign Career" },
  11: { name: "Labha Bhava (Gains)", significations: "Elder siblings, financial incoming sources, desires fulfillment & social grids", keyFocus: "Ingress & Community" },
  12: { name: "Vyaya Bhava (Liberation)", significations: "Sacred dreams, sleep, charitable spending, subconscious work & supreme release", keyFocus: "Dreams & Letting Go" }
};

interface KundaliSVGProps {
  houses: any[];
  isBoy: boolean;
  partnerName: string;
  activeChartView: "D1" | "D9";
  signDisplayMode: "number" | "symbol" | "name";
  hoveredPlanetData: any | null;
  setHoveredPlanetData: (data: any | null) => void;
  activeHoveredHouse: number | null;
  setActiveHoveredHouse: (num: number | null) => void;
}

const getPlanetDetails = (planet: any, house: any, partnerName: string) => {
  if (!planet || !house) return null;
  
  const signNumber = house.signIdx + 1;
  const signName = ZODIAC_SIGNS[house.signIdx] || "Unknown";
  const signSymbol = ZODIAC_GLYPHS[house.signIdx] || "★";
  const totalLongitude = (house.signIdx * 30 + planet.degree) % 360;
  const nakshatraIndex = Math.floor(totalLongitude / 13.333333) % 27;
  const nakshatraObj = NAKSHATRAS[nakshatraIndex] || { name: "Ashwini", ruler: "Ketu", gana: "Deva" };
  const pada = Math.floor((totalLongitude % 13.333333) / 3.333333) + 1;
  const status = getPlanetStatus(planet.name, partnerName);
  const dignity = getDignity(planet.name, house.signIdx);
  
  return {
    name: planet.name,
    glyph: planet.glyph || "★",
    degree: planet.degree,
    signName,
    signNumber,
    signSymbol,
    houseNumber: house.houseNumber,
    nakshatraName: nakshatraObj.name,
    nakshatraRuler: nakshatraObj.ruler,
    nakshatraGana: nakshatraObj.gana,
    pada,
    isRetrograde: status.isRetrograde,
    isCombust: status.isCombust,
    dignity
  };
};

const getRunningMahadasha = (birthDateStr: string, nakshatraRuler: string) => {
  const rulersArray = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
  const periods: Record<string, number> = {
    Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
  };
  
  const birthYear = new Date(birthDateStr).getFullYear() || 1995;
  const startRulerIdx = rulersArray.indexOf(nakshatraRuler);
  if (startRulerIdx === -1) return "Venus Mahadasha";
  
  let currentYear = birthYear;
  let idx = startRulerIdx;
  const targetYear = 2026;
  let runningMahadasha = nakshatraRuler;
  let endYear = currentYear + periods[nakshatraRuler];
  
  while (endYear < targetYear) {
    idx = (idx + 1) % 9;
    const nextRuler = rulersArray[idx];
    currentYear = endYear;
    endYear = currentYear + periods[nextRuler];
    runningMahadasha = nextRuler;
  }
  
  return `${runningMahadasha} Dasha (until ${endYear})`;
};

const KundaliSVG: React.FC<KundaliSVGProps> = ({ 
  houses, 
  isBoy, 
  partnerName,
  activeChartView,
  signDisplayMode,
  hoveredPlanetData,
  setHoveredPlanetData,
  activeHoveredHouse,
  setActiveHoveredHouse
}) => {
  if (!houses || houses.length === 0) return null;

  const houseLayouts: Record<number, { labelX: number; labelY: number }> = {
    1: { labelX: 150, labelY: 75 },
    2: { labelX: 75, labelY: 34 },
    3: { labelX: 34, labelY: 75 },
    4: { labelX: 75, labelY: 150 },
    5: { labelX: 34, labelY: 225 },
    6: { labelX: 75, labelY: 266 },
    7: { labelX: 150, labelY: 225 },
    8: { labelX: 225, labelY: 266 },
    9: { labelX: 266, labelY: 225 },
    10: { labelX: 225, labelY: 150 },
    11: { labelX: 266, labelY: 75 },
    12: { labelX: 225, labelY: 34 }
  };

  const houseBadgeCoords: Record<number, { x: number; y: number }> = {
    1: { x: 150, y: 15 },
    2: { x: 75, y: 14 },
    3: { x: 12, y: 75 },
    4: { x: 15, y: 150 },
    5: { x: 12, y: 225 },
    6: { x: 75, y: 286 },
    7: { x: 150, y: 284 },
    8: { x: 225, y: 286 },
    9: { x: 288, y: 225 },
    10: { x: 282, y: 150 },
    11: { x: 288, y: 75 },
    12: { x: 225, y: 14 }
  };

  const zodiacSignCoords: Record<number, { x: number; y: number }> = {
    1: { x: 150, y: 130 },
    2: { x: 92, y: 52 },
    3: { x: 52, y: 92 },
    4: { x: 124, y: 150 },
    5: { x: 52, y: 208 },
    6: { x: 92, y: 248 },
    7: { x: 150, y: 174 },
    8: { x: 208, y: 248 },
    9: { x: 248, y: 208 },
    10: { x: 176, y: 150 },
    11: { x: 248, y: 92 },
    12: { x: 208, y: 52 }
  };

  const getZodiacText = (signIdx: number, mode: "number" | "symbol" | "name"): string => {
    if (mode === "name") {
      return ZODIAC_SIGNS[signIdx]?.slice(0, 3) || "";
    }
    if (mode === "symbol") {
      return ZODIAC_GLYPHS[signIdx] || "";
    }
    return String(signIdx + 1);
  };

  return (
    <div className="relative group transition-transform duration-300">
      <svg 
        viewBox="0 0 300 300" 
        className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[500px] mx-auto bg-[#080C16] rounded-2xl border border-zinc-850 shadow-[0_4px_30px_rgba(0,0,0,0.85)] overflow-visible transition-all duration-300"
      >
        <defs>
          <style>{`
            @keyframes connection-dash {
              to {
                stroke-dashoffset: -20;
              }
            }
            .animate-connection-dash {
              animation: connection-dash 2s linear infinite;
            }
          `}</style>
          
          <linearGradient id="connection-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Intense gold glow filter */}
          <filter id="gold-glow-heavy" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="emerald-glowing-asc" cx="50%" cy="30%" r="90%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#059669" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#080C16" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="golden-glowing-seventh" cx="50%" cy="70%" r="90%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#b45309" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#080C16" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Backlight for 1st House (Ascendant) */}
        <path 
          d="M 150,150 L 75,75 L 150,0 L 225,75 Z" 
          fill="url(#emerald-glowing-asc)" 
          className="pointer-events-none transition-all duration-300"
        />

        {/* Ambient Backlight for 7th House (Marriage) */}
        <path 
          d="M 150,150 L 75,225 L 150,300 L 225,225 Z" 
          fill="url(#golden-glowing-seventh)" 
          className="pointer-events-none transition-all duration-300"
        />

        {/* Dynamic Interactive House Background Hover Zones */}
        {houses.map((house) => {
          const pointsMap: Record<number, string> = {
            1: "150,150 75,75 150,0 225,75",
            2: "150,0 75,75 0,0",
            3: "0,0 75,75 0,150",
            4: "150,150 75,75 0,150 75,225",
            5: "0,150 75,225 0,300",
            6: "0,300 75,225 150,300",
            7: "150,150 75,225 150,300 225,225",
            8: "150,300 225,225 300,300",
            9: "300,300 225,225 300,150",
            10: "150,150 225,75 300,150 225,225",
            11: "300,150 225,75 300,0",
            12: "300,0 225,75 150,0"
          };
          
          const points = pointsMap[house.houseNumber];
          const isHovered = activeHoveredHouse === house.houseNumber;
          const is1st = house.houseNumber === 1;
          const is7th = house.houseNumber === 7;
          
          let fillVal = "rgba(0,0,0,0.0)";
          if (isHovered) {
            if (is1st) fillVal = "rgba(16, 185, 129, 0.15)";
            else if (is7th) fillVal = "rgba(245, 158, 11, 0.18)";
            else fillVal = "rgba(255, 255, 255, 0.05)";
          }
          
          return (
            <polygon
              key={`hpoly-${house.houseNumber}`}
              points={points}
              fill={fillVal}
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => {
                setActiveHoveredHouse(house.houseNumber);
                setHoveredPlanetData(null); // Clear planet data to prioritize house tooltips
              }}
              onMouseLeave={() => setActiveHoveredHouse(null)}
            />
          );
        })}

        {/* Main Grid Divider Lines */}
        <line x1="0" y1="0" x2="300" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="300" y1="0" x2="0" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="150" y1="0" x2="300" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="300" y1="150" x2="150" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="150" y1="300" x2="0" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="0" y1="150" x2="150" y2="0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />

        {/* Outer boundaries with sharp card style */}
        <rect x="0" y="0" width="300" height="300" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" className="pointer-events-none" />

        {/* Subtle, beautiful glowing connections between H1 and H7 */}
        <g className="pointer-events-none">
          <line 
            x1="150" y1="75" x2="150" y2="225" 
            stroke="url(#connection-gradient)" 
            strokeWidth="1.5" 
            strokeDasharray="4 4"
            className="animate-connection-dash" 
          />
          <circle cx="150" cy="75" r="3" fill="#10b981" />
          <circle cx="150" cy="225" r="3" fill="#f59e0b" />
        </g>

        {/* 1st House Emerald Highlights */}
        <path 
          d="M 150,150 L 75,75 L 150,0 L 225,75 Z" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="1.5" 
          opacity="0.8"
          className="pointer-events-none"
        />

        {/* 7th House Golden Highlights with extreme pulse glow */}
        <path 
          d="M 150,150 L 75,225 L 150,300 L 225,225 Z" 
          fill="none" 
          stroke="#fbbf24" 
          strokeWidth="2.5" 
          filter="url(#gold-glow-heavy)"
          opacity="0.3"
          className="animate-pulse pointer-events-none"
        />
        <path 
          d="M 150,150 L 75,225 L 150,300 L 225,225 Z" 
          fill="none" 
          stroke="#f59e0b" 
          strokeWidth="1.5" 
          opacity="0.9"
          className="pointer-events-none"
        />

        {/* Render ASC Badge inside House 1 */}
        <g transform="translate(150, 42)" className="pointer-events-none">
          <rect x="-18" y="-7" width="36" height="14" rx="7" fill="#043224" stroke="#10b981" strokeWidth="1" opacity="0.95" />
          <text textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-mono fill-emerald-200 font-extrabold tracking-widest">ASC</text>
        </g>

        {/* House Labels, Signs, and Planet Badges */}
        {houses.map((house) => {
          const l = houseLayouts[house.houseNumber];
          const badge = houseBadgeCoords[house.houseNumber];
          const zodiac = zodiacSignCoords[house.houseNumber];
          
          if (!l || !badge || !zodiac) return null;
          
          const signIdx = house.signIdx;
          const isSelectedHouseHovered = activeHoveredHouse === house.houseNumber;
          const is1stHouse = house.houseNumber === 1;
          const is7thHouse = house.houseNumber === 7;

          return (
            <g key={`hg-${house.houseNumber}`}>
              {/* House badge (outer boundary label) */}
              <g 
                transform={`translate(${badge.x}, ${badge.y})`}
                className="pointer-events-none select-none transition-all duration-300"
              >
                <rect 
                  x="-12" 
                  y="-7" 
                  width="24" 
                  height="14" 
                  rx="4" 
                  fill={is1stHouse ? "#064e3b" : is7thHouse ? "#78350f" : isSelectedHouseHovered ? "#374151" : "#1f2937"} 
                  stroke={is1stHouse ? "#10b981" : is7thHouse ? "#fbbf24" : isSelectedHouseHovered ? "#6b7280" : "rgba(255,255,255,0.15)"} 
                  strokeWidth="1"
                />
                <text 
                  textAnchor="middle" 
                  dominantBaseline="middle"
                  className="text-[8px] font-mono font-bold fill-zinc-100"
                  y="1"
                >
                  H{house.houseNumber}
                </text>
              </g>

              {/* Zodiac sign index or symbol label (inner corner near intersection) */}
              <text 
                x={zodiac.x} 
                y={zodiac.y} 
                textAnchor="middle" 
                dominantBaseline="middle"
                className={`text-[9.5px] font-mono select-none font-bold transition-all duration-300 ${
                  is7thHouse 
                    ? "fill-amber-400 font-extrabold drop-shadow-[0_0_6px_rgba(245,158,11,0.8)] scale-110" 
                    : is1stHouse 
                      ? "fill-emerald-400 font-extrabold drop-shadow-[0_0_6px_rgba(16,185,129,0.8)] scale-110" 
                      : "fill-zinc-500"
                }`}
              >
                {getZodiacText(signIdx, signDisplayMode)}
              </text>

              {/* PROGRAMMATIC AUTOLAYOUT PLANET BADGES */}
              {house.planets && house.planets.length > 0 && (
                <g transform={`translate(${l.labelX}, ${l.labelY})`}>
                  {(() => {
                    const offsets = getPlanetOffsets(house.planets.length);
                    return house.planets.map((p: any, idx: number) => {
                      const offset = offsets[idx] || { dx: 0, dy: 0 };
                      const abbrev = getPlanetAbbreviation(p.name);
                      const strokeColor = getPlanetColor(p.name);
                      const parsedDetails = getPlanetDetails(p, house, partnerName);

                      return (
                        <g 
                          key={`pb-${p.name}`}
                          transform={`translate(${offset.dx}, ${offset.dy})`}
                          className="cursor-pointer group/badge"
                          onMouseEnter={() => {
                            setHoveredPlanetData(parsedDetails);
                          }}
                          onMouseLeave={() => {
                            setHoveredPlanetData(null);
                          }}
                        >
                          {/* Circle glass pill badge */}
                          <circle 
                            cx="0" 
                            cy="0" 
                            r="11" 
                            fill="#111827" 
                            stroke={strokeColor} 
                            strokeWidth="1.5" 
                            opacity="0.9"
                            className="transition-all duration-200 group-hover/badge:scale-130 group-hover/badge:stroke-white shadow-lg"
                            style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.7))" }}
                          />
                          
                          {/* Core abbreviation text */}
                          <text 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            className="text-[8px] font-mono fill-zinc-100 group-hover/badge:fill-white select-none font-bold"
                            y="-2"
                          >
                            {abbrev}
                          </text>

                          {/* Planet degree display tiny inside badge */}
                          <text 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            className="text-[6px] fill-zinc-400 group-hover/badge:fill-zinc-200 select-none opacity-80"
                            y="4.5"
                          >
                            {Math.round(p.degree)}°
                          </text>
                        </g>
                      );
                    });
                  })()}
                </g>
              )}
            </g>
          );
        })}

        {/* 7th House Overlay badge */}
        <text
          x={150}
          y={238}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[8px] font-mono fill-amber-400/70 font-semibold uppercase tracking-widest pointer-events-none"
        >
          7th House (Marriage)
        </text>
      </svg>
    </div>
  );
};

const renderFormattedCauseText = (text: string) => {
  return text.split("\n\n").map((para, idx) => {
    const hasIcon = para.startsWith("🔢") || para.startsWith("🪐");
    const icon = para.slice(0, 2);
    const content = hasIcon ? para.slice(2) : para;
    const parts = content.split(/\*\*(.*?)\*\*/g);
    
    return (
      <div 
        key={idx} 
        className={`p-4 rounded-xl border leading-relaxed text-xs font-sans ${
          para.startsWith("🔢") 
            ? "bg-amber-950/15 border-amber-500/10 text-amber-100/90 shadow-[inset_0_1px_1px_rgba(251,191,36,0.05)]" 
            : para.startsWith("🪐") 
              ? "bg-[#181125]/30 border-purple-500/10 text-purple-100/90 shadow-[inset_0_1px_1px_rgba(192,132,252,0.05)]"
              : "bg-[#111015]/40 border-zinc-900 text-zinc-300"
        }`}
      >
        <div className="flex gap-2 items-start">
          {hasIcon && <span className="text-sm select-none pt-0.5">{icon}</span>}
          <p className="font-light flex-1">
            {parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-white">{p}</strong> : p)}
          </p>
        </div>
      </div>
    );
  });
};

export default function CosmicConnections() {
  const { language, t, getCompatibilityResult, speak, speechState, activeReadingId, stopSpeaking } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>("compatibility");

  const handleSpeakCompatibility = () => {
    if (!compResult) return;
    let script = "";
    if (language === "en") {
      script = `Svara speaking. The compatibility resonance between ${personAName} and ${personBName} is ${compResult.overallScore} percent, resulting in a ${compResult.tier} alliance. Resonance summary: ${compResult.summary}. Outstanding strength: ${compResult.strength}. Core growth recommendation: ${compResult.growth}`;
    } else if (language === "hi") {
      script = `स्वरा दिव्य वाणी बोल रही है: ${personAName} और ${personBName} के बीच अनुकूलता प्रतिध्वनि ${compResult.overallScore} प्रतिशत है, जो इसे एक ${compResult.tier} रिश्ता बनाती है। सारांश: ${compResult.summary} मुख्य शक्ति: ${compResult.strength} सुधार के उपाय: ${compResult.growth}`;
    } else if (language === "bn") {
      script = `স্বরা মহাজাগতিক বাণী শোনাচ্ছে: ${personAName} এবং ${personBName} এর মধ্যে সম্পর্কের সামঞ্জস্যের হার ${compResult.overallScore} শতাংশ, যা একটি ${compResult.tier} সম্পর্ক নির্দেশ করে। মূল সারাংশ: ${compResult.summary} প্রধান শক্তি: ${compResult.strength} উন্নতির পরামর্শ: ${compResult.growth}`;
    } else if (language === "mr") {
      script = `स्वरा अलौकिक संवाद साधत आहे: ${personAName} आणि ${personBName} यांच्यातील सुसंगतता म्हणजेच कम्पॅटिबिलिटी ${compResult.overallScore} टक्के आहे, जो एक ${compResult.tier} बंध दर्शवतो। सारांश: ${compResult.summary} मुख्य सामर्थ्य: ${compResult.strength} प्रगतीसाठी सल्ला: ${compResult.growth}`;
    } else if (language === "gu") {
      script = `સ્વરા દિવ્ય વાણી કહી રહી છે: ${personAName} અને ${personBName} વચ્ચે સુસંગતતાનું પ્રમાણ ${compResult.overallScore} ટકા છે, જે દર્શાવે છે કે આ એક ${compResult.tier} જોડાણ છે। સારાંશ: ${compResult.summary} મુખ્ય સામર્થ્ય: ${compResult.strength} પ્રગતિ માટેનું હોમવર્ક: ${compResult.growth}`;
    }
    speak(script, "compatibility-result");
  };

  const handleSpeakMarriageTiming = () => {
    if (!marriageResult) return;
    const nameA = marriageAnalysisType === "partnerB" ? marriageNameB : marriageNameA;
    const nameB = marriageAnalysisType === "joint" ? `and ${marriageNameB}` : "";
    const primaryName = `${nameA} ${nameB}`.trim();
    
    let script = "";
    if (language === "en") {
      script = `Svara speaking. The favorable marriage window for ${primaryName} peaks in the year ${marriageResult.predictedYear}, scoring ${marriageResult.scoreEarned} out of 10 for favorability, indicating a ${marriageResult.predictedYearFavorability} alignment. Synthesis: ${marriageResult.synthesisText}`;
    } else if (language === "hi") {
      script = `स्वरा दिव्य वाणी बोल रही है: ${primaryName} के लिए विवाह की अनुकूल समय सीमा वर्ष ${marriageResult.predictedYear} में सबसे मजबूत है, जिसकी अनुकूलता दर 10 में से ${marriageResult.scoreEarned} है, जो एक ${marriageResult.predictedYearFavorability} संरेखण दर्शाती है। सारांश: ${marriageResult.synthesisText}`;
    } else if (language === "bn") {
      script = `স্বরা মহাজাগতিক বাণী শোনাচ্ছে: ${primaryName} এর বিবাহের সবচেয়ে শুভ সময় হলো ${marriageResult.predictedYear} সাল, যার অনুকূলতার মান ১০ এর মধ্যে ${marriageResult.scoreEarned} এবং এটি একটি ${marriageResult.predictedYearFavorability} সংযোগ। সিদ্ধান্ত: ${marriageResult.synthesisText}`;
    } else if (language === "mr") {
      script = `स्वरा अलौकिक संवाद साधत आहे: ${primaryName} यांच्या विवाहासाठी सर्वाधिक अनुकूल काळ वर्ष ${marriageResult.predictedYear} मध्ये दिसून येतो, ज्याची अनुकूलता १० पैकी ${marriageResult.scoreEarned} आहे आणि हा एक ${marriageResult.predictedYearFavorability} काळ आहे। सारांश: ${marriageResult.synthesisText}`;
    } else if (language === "gu") {
      script = `સ્વરા દિવ્ય વાણી કહી રહી છે: ${primaryName} માટે લગ્નની અનુકૂળ સમય મર્યાદા વર્ષ ${marriageResult.predictedYear} માં સૌથી શુભ છે, જેની અનુકૂળતા સમય ૧૦ માંથી ${marriageResult.scoreEarned} ક્રમાંક મેળવે છે, અને તે ${marriageResult.predictedYearFavorability} સંયોગ દર્શાવે છે। સંયોજન સારાંશ: ${marriageResult.synthesisText}`;
    }
    speak(script, "marriage-result");
  };

  const handleSpeakKundaliMatching = () => {
    if (!kundaliResult) return;
    let doshasText = "";
    if (kundaliResult.nadiDosha && kundaliResult.bhakootDosha) {
      doshasText = "Nadi Dosha and Bhakoot Dosha are flagged.";
    } else if (kundaliResult.nadiDosha) {
      doshasText = "Nadi Dosha is flagged.";
    } else if (kundaliResult.bhakootDosha) {
      doshasText = "Bhakoot Dosha is flagged.";
    } else {
      doshasText = "No major doshas are flagged.";
    }

    let script = "";
    if (language === "en") {
      script = `Svara speaking. The Guna Milan match score is ${kundaliResult.totalGuna} out of 36, classified as ${kundaliResult.classification}. Partner A's Nakshatra is ${kundaliResult.boyNak?.name} in Rashi ${kundaliResult.boyRashi}. Partner B's Nakshatra is ${kundaliResult.girlNak?.name} in Rashi ${kundaliResult.girlRashi}. ${doshasText} Manglik status is: ${kundaliResult.manglikStatus}.`;
    } else if (language === "hi") {
      script = `स्वरा दिव्य वाणी बोल रही है: कुंडली मिलान में गुण मिलान स्कोर 36 में से ${kundaliResult.totalGuna} है, जो ${kundaliResult.classification} श्रेणी में है। वर्ग ए का नक्षत्र ${kundaliResult.boyNak?.name} (राशि ${kundaliResult.boyRashi}) है, और वर्ग बी का नक्षत्र ${kundaliResult.girlNak?.name} (राशि ${kundaliResult.girlRashi}) है। ${doshasText === "No major doshas are flagged." ? "कोई मुख्य दोष नहीं पाया गया।" : doshasText} मांगलिक स्थिति: ${kundaliResult.manglikStatus === "Cancelled" ? "रद्द" : kundaliResult.manglikStatus} है।`;
    } else if (language === "bn") {
      script = `স্বরা মহাজাগতিক বাণী শোনাচ্ছে: অষ্টকূটের গুণ মিলান মান ৩৬ এর মধ্যে ${kundaliResult.totalGuna} এবং এটি ${kundaliResult.classification} হিসেবে চিহ্নিত হয়েছে। প্রথম জনের নক্ষত্র হলো ${kundaliResult.boyNak?.name} (রাশি ${kundaliResult.boyRashi}), দ্বিতীয় জনের নক্ষত্র ${kundaliResult.girlNak?.name} (রাশি ${kundaliResult.girlRashi})। ${doshasText} মাঙ্গলিক দশা: ${kundaliResult.manglikStatus}।`;
    } else if (language === "mr") {
      script = `स्वरा अलौकिक संवाद साधत आहे: तुमच्या कुंडली मिलानचा अष्टकूट गुण ${kundaliResult.totalGuna} असून ३६ पैकी आहे आणि तो ${kundaliResult.classification} मानण्यात आला आहे। पहिल्या व्यक्तीचे नक्षत्र ${kundaliResult.boyNak?.name} आणि राशी ${kundaliResult.boyRashi} आहे। दुसऱ्या व्यक्तीचे नक्षत्र ${kundaliResult.girlNak?.name} व राशी ${kundaliResult.girlRashi} आहे। ${doshasText} मंगळ दोष स्थिती: ${kundaliResult.manglikStatus} आहे।`;
    } else if (language === "gu") {
      script = `સ્વરા દિવ્ય વાણી કહી રહી છે: કુંડળી મિલનમાં ગુણ મિલન સ્કોર ૩૬ માંથી ${kundaliResult.totalGuna} છે, જેને ${kundaliResult.classification} માનવામાં આવેલ છે। પાર્ટનર એ નું નક્ષત્ર ${kundaliResult.boyNak?.name} (રાશિ ${kundaliResult.boyRashi}) અને પાર્ટનર બી નું નક્ષત્ર ${kundaliResult.girlNak?.name} (રાશિ ${kundaliResult.girlRashi}) છે। ${doshasText} મંગળ દોષ સ્થિતિ: ${kundaliResult.manglikStatus} છે।`;
    }
    speak(script, "kundali-result");
  };

  // PART A — COMPATIBILITY STRATEGY
  const [personAName, setPersonAName] = useState("Karan Sharma");
  const [personADob, setPersonADob] = useState("1995-08-15");
  const [personBName, setPersonBName] = useState("Anjali Verma");
  const [personBDob, setPersonBDob] = useState("1997-06-23");
  const [compAnim, setCompAnim] = useState<AnimState>("idle");
  const [compResult, setCompResult] = useState<any>(null);

  // PART B — MARRIAGE TIMING
  const [marriageDob, setMarriageDob] = useState("1995-08-15");
  const [marriageDobB, setMarriageDobB] = useState("1997-06-23");
  const [marriageNameA, setMarriageNameA] = useState("Karan Sharma");
  const [marriageNameB, setMarriageNameB] = useState("Anjali Verma");
  const [marriageAnalysisType, setMarriageAnalysisType] = useState<"joint" | "partnerA" | "partnerB">("joint");
  const [marriageAnim, setMarriageAnim] = useState<AnimState>("idle");
  const [marriageResult, setMarriageResult] = useState<any>(null);

  // Keep compatibility inputs synchronized with marriage inputs dynamically
  useEffect(() => {
    setMarriageDob(personADob);
    setMarriageDobB(personBDob);
    setMarriageNameA(personAName);
    setMarriageNameB(personBName);
  }, [personADob, personBDob, personAName, personBName]);

  // PART C — KUNDALI MATCHING
  const [kBoyName, setKBoyName] = useState("Amit Deshmukh");
  const [kBoyDob, setKBoyDob] = useState("1994-11-20");
  const [kBoyTime, setKBoyTime] = useState("08:30");
  const [kGirlName, setKGirlName] = useState("Priya Patil");
  const [kGirlDob, setKGirlDob] = useState("1996-03-14");
  const [kGirlTime, setKGirlTime] = useState("14:15");
  const [kBoyPlace, setKBoyPlace] = useState("Mumbai, MH, India");
  const [kBoyLat, setKBoyLat] = useState<number>(18.97);
  const [kBoyLng, setKBoyLng] = useState<number>(72.82);
  const [kGirlPlace, setKGirlPlace] = useState("Pune, MH, India");
  const [kGirlLat, setKGirlLat] = useState<number>(18.52);
  const [kGirlLng, setKGirlLng] = useState<number>(73.85);
  const [kundaliAnim, setKundaliAnim] = useState<AnimState>("idle");
  const [kundaliResult, setKundaliResult] = useState<any>(null);
  const [unlitMandalaSegments, setUnlitMandalaSegments] = useState<number[]>([]);
  const [activeChartView, setActiveChartView] = useState<"D1" | "D9">("D1");
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [signDisplayMode, setSignDisplayMode] = useState<"number" | "symbol" | "name">("number");
  const [hoveredPlanetData, setHoveredPlanetData] = useState<any | null>(null);
  const [activeHoveredHouse, setActiveHoveredHouse] = useState<number | null>(null);

  // Monitor pulse golden thread state
  const isCompFormReady = personAName.trim() !== "" && personBName.trim() !== "" && personADob !== "" && personBDob !== "";

  // 1. COMPATIBILITY CALCULATOR TRIGGER
  const calculateCompatibility = () => {
    setCompAnim("checking");
    setCompResult(null);

    // DOB parsing
    const dobAStr = personADob.replace(/-/g, "");
    const dobBStr = personBDob.replace(/-/g, "");

    const partsA = personADob.split("-");
    const partsB = personBDob.split("-");

    const lpA = getLifePath(dobAStr);
    const lpB = getLifePath(dobBStr);

    const mulankA = getVedicMulank(partsA[2] || "01");
    const mulankB = getVedicMulank(partsB[2] || "01");

    const namesA = getNameNumbers(personAName);
    const namesB = getNameNumbers(personBName);

    const scoreLp = getScoreCompatibility(lpA, lpB);
    const scoreMulank = getScoreCompatibility(mulankA, mulankB, true);
    const scoreSoul = getScoreCompatibility(namesA.soulUrge, namesB.soulUrge);
    const scoreExpr = getScoreCompatibility(namesA.expression, namesB.expression);

    const rawOverall = (scoreLp * 0.35) + (scoreMulank * 0.25) + (scoreSoul * 0.25) + (scoreExpr * 0.15);
    const overallScore = Math.round(rawOverall);

    // Build unique insights
    let tier = "Growth-oriented";
    let badgeColor = "border-rose-500/30 text-rose-300 bg-rose-500/10";
    let summary = "";
    let strength = "";
    let growth = "";

    if (overallScore >= 75) {
      tier = "Highly Auspicious";
      badgeColor = "border-amber-500/30 text-amber-300 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]";
      summary = "A highly synchronized energetic alignment. Your frequencies hum in absolute coherence across the spiritual and emotional layers.";
      strength = "Incredible mental synthesis and direct mutual respect. Your Life Path goals complement each other naturally.";
      growth = "Avoid falling into comfortable routines that lead to spiritual complacency. Keep challenging and inspiring each other.";
    } else if (overallScore >= 55) {
      tier = "Balanced Harmony";
      badgeColor = "border-cyan-500/30 text-cyan-300 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]";
      summary = "A solid, constructive pairing with strong communicative potential and balanced emotional attraction.";
      strength = "High flexibility. Your different perspectives allow each other to balance out extremes and explore diverse scenarios together.";
      growth = "Friction can occur occasionally under heavy external stress due to different inner nature (Mulank) responses.";
    } else {
      tier = "Karmic Growth Homework";
      badgeColor = "border-rose-400/30 text-rose-300 bg-rose-500/5";
      summary = "A classic developmental matching. This relationship thrives on transmuting friction into conscious wisdom.";
      strength = "A profound catalytic effect that forces both of you to confront individual blind spots and build patience.";
      growth = "Underlying values or communication tactics differ. Explicit dialogue and emotional space-giving are vital keys.";
    }

    let translatedTier = tier;
    let translatedStrength = strength;
    let translatedGrowth = growth;

    if (language === "hi") {
      if (overallScore >= 75) {
        translatedTier = "अत्यंत शुभ";
        translatedStrength = "अद्भुत मानसिक संश्लेषण और प्रत्यक्ष परस्पर सम्मान। आपके जीवन मार्ग के लक्ष्य स्वाभाविक रूप से एक-दूसरे के पूरक हैं।";
        translatedGrowth = "आरामदायक दिनचर्या में पड़ने से बचें जो आध्यात्मिक संकीर्णता का कारण बन सकती है। एक-दूसरे को प्रेरित करते रहें।";
      } else if (overallScore >= 55) {
        translatedTier = "संतुलित सामंजस्य";
        translatedStrength = "उच्च लचीलापन। आपके विभिन्न दृष्टिकोण चरम सीमाओं को संतुलित करने और विविध परिदृश्यों का पता लगाने की अनुमति देते हैं।";
        translatedGrowth = "भारी बाहरी तनाव के तहत अलग-अलग आंतरिक स्वाभाव (मूलांक) प्रतिक्रियाओं के कारण कभी-कभी घर्षण हो सकता है।";
      } else {
        translatedTier = "कर्मिक सीख गृहकार्य";
        translatedStrength = "एक गहरा उत्प्रेरक प्रभाव जो आप दोनों को व्यक्तिगत कमियों का सामना करने और धैर्य का निर्माण करने के लिए प्रेरित करता है।";
        translatedGrowth = "अंतर्निहित मूल्य या संचार रणनीतियां भिन्न हैं। स्पष्ट संवाद और भावनात्मक स्थान देना महत्वपूर्ण कुंजी हैं।";
      }
    } else if (language === "bn") {
      if (overallScore >= 75) {
        translatedTier = "অত্যন্ত শুভ";
        translatedStrength = "অসাধারণ মানসিক সমন্বয় এবং পারস্পরিক শ্রদ্ধা। আপনার জীবনপথের লক্ষ্যগুলি স্বাভাবিকভাবেই একে অপরের পরিপূরক।";
        translatedGrowth = "আরামদায়ক রুটিনে অভ্যস্ত হওয়া এড়িয়ে চলুন যা আধ্যাত্মিক আত্মতুষ্টির দিকে নিয়ে যায়। একে অপরকে অনুপ্রাণিত করতে থাকুন।";
      } else if (overallScore >= 55) {
        translatedTier = "ভারসাম্যপূর্ণ সাদৃশ্য";
        translatedStrength = "উচ্চ নমনীয়তা। আপনার বিভিন্ন দৃষ্টিভঙ্গি একে অপরের চরম ভাবকে ব্যালেন্স করতে সাহায্য করে এবং একসাথে নতুন দিগন্ত উন্মোচন করে।";
        translatedGrowth = "বাইরের অতিরিক্ত চাপের মুখে আলাদা ধরণের অভ্যন্তরীণ স্বাভাবের (মুলাঙ্ক) কারণে মাঝেমধ্যে ঘর্ষণ হতে পারে।";
      } else {
        translatedTier = "কার্মিক উন্নতির শিক্ষা";
        translatedStrength = "এক গভীর অনুঘটক প্রভাব যা আপনাদের দুজনকে নিজেদের দুর্বলতা কাটিয়ে আরও সহনশীল হতে সাহায্য করবে।";
        translatedGrowth = "মূল চিন্তাভাবনা বা যোগাযোগের ধরন ভিন্ন হতে পারে। স্পষ্ট আলোচনা ও পারস্পরিক শ্রদ্ধা বজায় রাখা অত্যন্ত জরুরি।";
      }
    } else if (language === "mr") {
      if (overallScore >= 75) {
        translatedTier = "अत्यंत शुभ";
        translatedStrength = "अद्भुत मानसिक जोडणी आणि थेट परस्पर आदर. तुमचे जीवन मार्ग ध्येये नैसर्गिकरित्या एकमेकांना पूरक आहेत.";
        translatedGrowth = "आध्यात्मिक समाधानाचा मार्ग सुकर करणाऱ्या आरामदायक दिनचर्येत जाणे टाळा. एकमेकांना आव्हाने देत आणि प्रेरित करत राहा.";
      } else if (language === "mr" && overallScore >= 55) {
        translatedTier = "संतुलित सुसंवाद";
        translatedStrength = "उच्च लवचिकता. तुमचे वेगवेगळे दृष्टिकोन तुम्हाला टोकाची परिस्थिती संतुलित करण्यास आणि विविध संकल्पना शोधण्याची परवानगी देतात.";
        translatedGrowth = "मोठ्या बाह्य तणावाखाली भिन्न मूलांक प्रतिसादांमुळे काही वेळा घर्षण घडू शकते.";
      } else {
        translatedTier = "कर्मिक वाढ गृहपाठ";
        translatedStrength = "एक खोल उत्प्रेरक प्रभाव जो तुम्हाला वैयक्तिक कमतरता दूर करण्यासाठी आणि संयम निर्माण करण्यासाठी भाग पाडतो.";
        translatedGrowth = "मूलभूत मूल्ये किंवा संभाषण पद्धती भिन्न आहेत. स्पष्ट संवाद आणि भावनिक मोकळीक प्रदीर्घ आयुष्यातील विजयाची गुरुकिल्ली ठरतात.";
      }
    } else if (language === "gu") {
      if (overallScore >= 75) {
        translatedTier = "અત્યંત શુભ";
        translatedStrength = "અદ્ભુત માનસિક જોડાણ અને પરસ્પર આદર. તમારા જીવન માર્ગના લક્ષ્યો કુદરતી રીતે એકબીજાના પૂરક છે.";
        translatedGrowth = "નિયમિત જીવન પદ્ધતિ અને આળસ ટાળો જે આધ્યાત્મિક વિકાસ અટકાવે છે. એકબીજાને પ્રેરણા આપતા રહો.";
      } else if (overallScore >= 55) {
        translatedTier = "સંતુલિત સુમેળ";
        translatedStrength = "ઉચ્ચ લવચીકતા. તમારા જુદા જુદા દ્રષ્ટિકોણ એકબીજાના અતિરેકને સંતુલિત કરે છે અને આગળ વધવાની હિંમત આપે છે.";
        translatedGrowth = "ખૂબ જ બાહ્ય દબાણ હેઠળ અલગ મૂલાંકના કારણે ક્યારેક વિવાદ ઊભો થઈ શકે છે.";
      } else {
        translatedTier = "કાર્મિક વિકાસ હોમવર્ક";
        translatedStrength = "એક પ્રચંડ પ્રેરક પ્રભાવ જે તમને અંગત નબળાઈઓ દૂર કરવા પ્રેરશે અને ધૈર્ય આપશે.";
        translatedGrowth = "આંતરિક મૂલ્યો અથવા વાતચીત પદ્ધતિ અલગ છે. સ્પષ્ટ વાર્તાલાપ અને સ્નેહની સમજ સફળતાની ચાવી બનશે.";
      }
    }

    const finalSummary = getCompatibilityResult(lpA, lpB, { percent: overallScore, summary: summary }).summary;

    setTimeout(() => {
      setCompResult({
        overallScore,
        lpA, lpB,
        mulankA, mulankB,
        suA: namesA.soulUrge, suB: namesB.soulUrge,
        exA: namesA.expression, exB: namesB.expression,
        scoreLp, scoreMulank, scoreSoul, scoreExpr,
        tier: translatedTier, badgeColor,
        summary: finalSummary, strength: translatedStrength, growth: translatedGrowth
      });
      setCompAnim("finished");
    }, 1500);
  };

  // 2. MARRIAGE TIMING PREDICTION
  const computeMarriageTiming = () => {
    setMarriageAnim("checking");
    setMarriageResult(null);

    // Call real planetary positions for CURRENT time relative to local system
    const today = new Date();
    const planets = get_planetary_positions(today);

    // Venus & Jupiter checks
    const venus = planets.find(p => p.name === "Venus");
    const jupiter = planets.find(p => p.name === "Jupiter");

    const isVenusRetro = venus?.retrograde || false;
    const venusSign = venus?.sign || "Taurus";
    const jupiterSign = jupiter?.sign || "Gemini";

    const startYear = 2026;

    const planetRulers: Record<number, string> = {
      1: "Sun (Surya)",
      2: "Moon (Chandra)",
      3: "Jupiter (Guru)",
      4: "Rahu",
      5: "Mercury (Budha)",
      6: "Venus (Shukra)",
      7: "Ketu",
      8: "Saturn (Shani)",
      9: "Mars (Mangal)"
    };

    if (marriageAnalysisType === "joint") {
      const partsA = marriageDob.split("-");
      const partsB = marriageDobB.split("-");

      const mulankA = getVedicMulank(partsA[2] || "01");
      const mulankB = getVedicMulank(partsB[2] || "01");

      const lpA = getLifePath(marriageDob.replace(/-/g, ""));
      const lpB = getLifePath(marriageDobB.replace(/-/g, ""));

      const bhagyankA = reduceToSingleDigit(lpA + mulankA);
      const bhagyankB = reduceToSingleDigit(lpB + mulankB);

      const profileA = mulankProfiles[mulankA];
      const profileB = mulankProfiles[mulankB];

      const rulerFullNameA = planetRulers[mulankA] || "the Sun";
      const rulerFullNameB = planetRulers[mulankB] || "the Moon";

      const timeline = Array.from({ length: 5 }, (_, i) => {
        const year = startYear + i;
        const yearSum = String(year).split("").reduce((acc, c) => acc + parseInt(c, 10), 0);
        const reducedYear = reduceToSingleDigit(yearSum);

        // Partner A
        const mA = parseInt(partsA[1], 10) || 1;
        const dA = parseInt(partsA[2], 10) || 1;
        const pyA = reduceToSingleDigit(reduceToSingleDigit(dA) + reduceToSingleDigit(mA) + reducedYear);

        // Partner B
        const mB = parseInt(partsB[1], 10) || 1;
        const dB = parseInt(partsB[2], 10) || 1;
        const pyB = reduceToSingleDigit(reduceToSingleDigit(dB) + reduceToSingleDigit(mB) + reducedYear);

        // Score Partner A Personal Year favoring Marriage
        let scoreA = 50;
        let reasoningA = "";
        if (pyA === 6) { scoreA = 96; reasoningA = "Venus (6) is at maximum domestic resonance."; }
        else if (pyA === 2) { scoreA = 92; reasoningA = "Moon (2) brings beautiful dual agreements."; }
        else if (pyA === 9) { scoreA = 80; reasoningA = "Mars (9) completes past karmic slates."; }
        else if (pyA === 3) { scoreA = 84; reasoningA = "Jupiter (3) aligns beneficial vows & growth."; }
        else if (pyA === 1) { scoreA = 76; reasoningA = "Sun (1) initiates brand new partnerships."; }
        else if (pyA === 5) { scoreA = 72; reasoningA = "Mercury (5) triggers dynamic, social vibes."; }
        else if (pyA === 8) { scoreA = 66; reasoningA = "Saturn (8) calls for deep foundational commitments."; }
        else if (pyA === 4) { scoreA = 58; reasoningA = "Rahu (4) pushes structural, careful agreements."; }
        else { scoreA = 48; reasoningA = "Ketu (7) signals deep spiritual introspection."; }

        // Score Partner B Personal Year
        let scoreB = 50;
        let reasoningB = "";
        if (pyB === 6) { scoreB = 96; reasoningB = "Venus (6) invites beautiful wedding transits."; }
        else if (pyB === 2) { scoreB = 92; reasoningB = "Moon (2) supports tender, legal pair agreements."; }
        else if (pyB === 9) { scoreB = 80; reasoningB = "Mars (9) transmutes boundaries into union."; }
        else if (pyB === 3) { scoreB = 84; reasoningB = "Jupiter (3) grants blessings and wisdom."; }
        else if (pyB === 1) { scoreB = 76; reasoningB = "Sun (1) promotes enthusiastic new milestones."; }
        else if (pyB === 5) { scoreB = 72; reasoningB = "Mercury (5) drives lively journeys & connections."; }
        else if (pyB === 8) { scoreB = 66; reasoningB = "Saturn (8) tests patience and responsibility."; }
        else if (pyB === 4) { scoreB = 58; reasoningB = "Rahu (4) calls for pragmatic arrangements."; }
        else { scoreB = 48; reasoningB = "Ketu (7) activates spiritual development."; }

        // Joint relationship combination compatibility bonus
        let jointBonus = 15;
        let jointText = "";
        if ((pyA === 6 || pyA === 2) && (pyB === 6 || pyB === 2)) {
          jointBonus = 25;
          jointText = "Peaked double alignment: excellent legal & spiritual compatibility.";
        } else if (pyA === pyB) {
          jointBonus = 22;
          jointText = `Vibrating on the identical Personal Year ${pyA} core frequencies in complete resonance.`;
        } else if (
          (pyA === 6 && (pyB === 3 || pyB === 1 || pyB === 9)) ||
          (pyB === 6 && (pyA === 3 || pyA === 1 || pyA === 9)) ||
          (pyA === 2 && (pyB === 9 || pyB === 3)) ||
          (pyB === 2 && (pyA === 9 || pyA === 3))
        ) {
          jointBonus = 20;
          jointText = "Highly stable complementary currents supporting active relationship vows.";
        } else if (pyA === 4 || pyB === 4 || pyA === 8 || pyB === 8) {
          jointBonus = 10;
          jointText = "Demands mutual patience as heavy karmic/structure duties are active.";
        } else {
          jointBonus = 14;
          jointText = "Steady developmental phase driving conscious, gradual plans.";
        }

        // Add celestial transit points based on partner's profile
        let transitPoints = 0;
        if (!isVenusRetro) transitPoints += 4;
        if (profileA?.luckyNumbers.includes(3)) transitPoints += 3;
        if (profileB?.luckyNumbers.includes(3)) transitPoints += 3;

        const totalYearScore = Math.min(100, Math.round(((scoreA + scoreB) / 2) * 0.7 + jointBonus + transitPoints));

        let favorability: "High" | "Moderate" | "Low" = "Low";
        if (totalYearScore >= 80) favorability = "High";
        else if (totalYearScore >= 66) favorability = "Moderate";

        const reasoning = `Joint PY: ${pyA} ⚭ ${pyB}. ${jointText} (${marriageNameA}: ${reasoningA.replace(/Venus \(6\) |Moon \(2\) |Mars \(9\) |Jupiter \(3\) |Sun \(1\) |Mercury \(5\) |Saturn \(8\) |Rahu \(4\) |Ketu \(7\) /g, "")})`;

        return {
          year,
          personalYear: pyA, // preserve property name for UI mapping fallback
          pyA,
          pyB,
          favorability,
          reasoning,
          yearScore: totalYearScore
        };
      });

      // Find the absolute best year for marriage based on joint score
      const bestYearObj = timeline.reduce((best, curr) => curr.yearScore > best.yearScore ? curr : best, timeline[0]);

      const predictedYear = bestYearObj.year;
      const predictedYearPyA = bestYearObj.pyA;
      const predictedYearPyB = bestYearObj.pyB;
      const predictedYearFavorability = bestYearObj.favorability;
      const predictedYearReasoning = bestYearObj.reasoning;
      const predictedYearScore = (bestYearObj.yearScore / 10).toFixed(1);

      // Detailed causes explanation
      let predictedYearDetailedCause = `🔢 **Unified Numerological Alignment (Personal Year ${predictedYearPyA} & ${predictedYearPyB}):** ` +
        `Your joint prediction analyzes the unified matrix of both charts for **${predictedYear}**. **${marriageNameA}** is under **Personal Year ${predictedYearPyA}**, while **${marriageNameB}** is under **Personal Year ${predictedYearPyB}**, generating a stellar **${bestYearObj.yearScore}% Relational Synchronization**. `;

      if (predictedYearPyA === 6 || predictedYearPyB === 6) {
        predictedYearDetailedCause += `Vedic principles dictate that having Venusian Personal Year 6 activated triggers high domestic instincts, enabling a natural flow of family blessings, celebration, and legal support for wedding steps.`;
      } else if (predictedYearPyA === 2 || predictedYearPyB === 2) {
        predictedYearDetailedCause += `The lunar duality current of Personal Year 2 facilitates deep mutual compromise, erasing domestic ego obstacles and binding your legal & spiritual parameters with total ease.`;
      } else {
        predictedYearDetailedCause += `This period is backed by complementary growth frequencies, maximizing financial planning, mutual trust, and practical stability to sustain your sacred bond.`;
      }

      predictedYearDetailedCause += `\n\n🪐 **Astro-Transit Highlights (Jupiter-Venus Conjunction Waves):** ` +
        `Venus is currently sitting in **${venusSign}** other than its difficult retrogrades (currently ${isVenusRetro ? "retrograde, signaling inner alignment" : "direct, blessing relational trust"}). ` +
        `Jupiter transits through **${jupiterSign}**, forming a protective aspect to both **${marriageNameA}** (${rulerFullNameA}) and **${marriageNameB}** (${rulerFullNameB})'s numbers, providing absolute cosmic guidance for the vows taken in **${predictedYear}**.`;

      const synthesisText = `Analyzing coordinates: Venus is currently transiting ${venusSign}${isVenusRetro ? " in Retrograde (♀ R)" : " in Direct motion (♀)"}. Jupiter, the planet of expansion (♃), transits through ${jupiterSign}, showering both partners' charts with protective vibes.`;

      setTimeout(() => {
        setMarriageResult({
          timeline,
          venus,
          jupiter,
          synthesisText,
          mulank: mulankA,
          lp: lpA,
          bhagyank: bhagyankA,
          predictedYear,
          predictedYearFavorability,
          predictedYearReasoning,
          predictedYearDetailedCause,
          scoreEarned: predictedYearScore,
          type: "joint"
        });
        setMarriageAnim("finished");
      }, 1500);

    } else {
      // Individual analysis (partnerA or partnerB)
      const isA = marriageAnalysisType === "partnerA";
      const targetDob = isA ? marriageDob : marriageDobB;
      const targetName = isA ? marriageNameA : marriageNameB;

      const parts = targetDob.split("-");
      const mulank = getVedicMulank(parts[2] || "01");
      const lp = getLifePath(targetDob.replace(/-/g, ""));
      const bhagyank = reduceToSingleDigit(lp + mulank);
      const profile = mulankProfiles[mulank];
      const rulerFullName = planetRulers[mulank] || "the Sun";

      const timeline = Array.from({ length: 5 }, (_, i) => {
        const year = startYear + i;
        const yearSum = String(year).split("").reduce((acc, c) => acc + parseInt(c, 10), 0);
        const reducedYear = reduceToSingleDigit(yearSum);

        const m = parseInt(parts[1], 10) || 1;
        const d = parseInt(parts[2], 10) || 1;
        const py = reduceToSingleDigit(reduceToSingleDigit(d) + reduceToSingleDigit(m) + reducedYear);

        let favorability: "High" | "Moderate" | "Low" = "Low";
        let reasoning = "A preparatory period focused on self-healing, exploration, and releasing old boundaries.";
        let yearScore = 50;

        if (py === 6) {
          favorability = "High";
          reasoning = "Vedic Venus Peak: ideal year for permanent vows, domestic setups, and family nesting.";
          yearScore = 95;
        } else if (py === 2) {
          favorability = "High";
          reasoning = "Lunar Sacred Duality: excellent for mutual partnerships, corporate agreements, and emotional union.";
          yearScore = 90;
        } else if (py === 9) {
          favorability = "Moderate";
          reasoning = "Completion cycle: excellent to release ancestral baggage before setting life vows.";
          yearScore = 78;
        } else if (py === 3) {
          favorability = "Moderate";
          reasoning = "Jupiter Wisdom Growth: highly supportive for intellectual alignments and family celebrations.";
          yearScore = 84;
        } else if (py === 1) {
          favorability = "Moderate";
          reasoning = "Solar freshness: good for taking active relational initiative and fresh commitments.";
          yearScore = 76;
        } else if (py === 5) {
          favorability = "Moderate";
          reasoning = "Mercury social travel: dynamic romantic explorations, although less formal in vows.";
          yearScore = 70;
        } else if (py === 8) {
          favorability = "Low";
          reasoning = "Saturn structure: heavy focus on material planning, responsibilities, and patience.";
          yearScore = 62;
        } else if (py === 4) {
          favorability = "Low";
          reasoning = "Rahu adjustments: calls for detailed structural parameters and caution under static.";
          yearScore = 54;
        } else {
          favorability = "Low";
          reasoning = "Ketu quiet path: dedicated to deep meditation and quiet internal review.";
          yearScore = 46;
        }

        // Transit adjustments
        if (!isVenusRetro) yearScore += 4;
        if (profile?.luckyNumbers.includes(3)) yearScore += 4;

        yearScore = Math.min(100, yearScore);

        return {
          year,
          personalYear: py,
          pyA: py,
          pyB: py,
          favorability,
          reasoning,
          yearScore
        };
      });

      const bestYearObj = timeline.reduce((best, curr) => curr.yearScore > best.yearScore ? curr : best, timeline[0]);

      const predictedYear = bestYearObj.year;
      const predictedYearPy = bestYearObj.personalYear;
      const predictedYearFavorability = bestYearObj.favorability;
      const predictedYearReasoning = bestYearObj.reasoning;
      const predictedYearScore = (bestYearObj.yearScore / 10).toFixed(1);

      let predictedYearDetailedCause = `🔢 **Numerological Alignment (Personal Year ${predictedYearPy}):** ` +
        `Your chart for **${predictedYear}** indicates that you step into the powerful frequency of Personal Year ${predictedYearPy}. `;

      if (predictedYearPy === 6) {
        predictedYearDetailedCause += `Ruling Venus (Shukra) triggers your peak commitments. Under this wave, setting up a permanent marriage setup, acquiring domestic goods, and taking traditional vows flows exceptionally smoothly.`;
      } else if (predictedYearPy === 2) {
        predictedYearDetailedCause += `This is governed by the cooperative Lunar vibration (2). It naturally dissolves pre-existing relational friction, attracting cooperative legally-binding alliances with high emotional depth.`;
      } else if (predictedYearPy === 9) {
        predictedYearDetailedCause += `This Mars-driven closing cycle clears old karmic blocks, offering you an ultimate clean slate on which to write your future commitments with full integrity.`;
      } else {
        predictedYearDetailedCause += `This provides solid material and social expression. It guarantees reliable communication, financial expansion, and practical planning for long-term relational union.`;
      }

      predictedYearDetailedCause += `\n\n🪐 **Astro-Transit Highlights (Jupiter-Venus Conjunction Waves):** ` +
        `Venus, the natural planet of marriage, is in **${venusSign}** (${isVenusRetro ? "retrograde, advising careful internal checks" : "direct, promoting smooth vows"}). ` +
        `Jupiter's supportive trine transit in **${jupiterSign}** aspects your ruling planet **${rulerFullName}**, supplying legal safety and family approvals.`;

      const synthesisText = `Analyzing coordinates: Venus is currently transiting ${venusSign}${isVenusRetro ? " in Retrograde (♀ R)" : " in Direct motion (♀)"}. Jupiter, the planet of expansion (♃), transits through ${jupiterSign} in harmony with your ruling planet ${rulerFullName}.`;

      setTimeout(() => {
        setMarriageResult({
          timeline,
          venus,
          jupiter,
          synthesisText,
          mulank,
          lp,
          bhagyank,
          predictedYear,
          predictedYearFavorability,
          predictedYearReasoning,
          predictedYearDetailedCause,
          scoreEarned: predictedYearScore,
          type: "single"
        });
        setMarriageAnim("finished");
      }, 1500);
    }
  };

  // 3. KUNDALI MATCHING (ASHTAKOOT GUNA MILAN)
  const calculateKundaliMatching = () => {
    setKundaliAnim("checking");
    setKundaliResult(null);

    // Boy's & Girl's longitudes via geocentric ephemeris relative to birth DOBs
    const boyDate = kBoyTime ? new Date(`${kBoyDob}T${kBoyTime}:00`) : new Date(kBoyDob);
    const girlDate = kGirlTime ? new Date(`${kGirlDob}T${kGirlTime}:00`) : new Date(kGirlDob);

    const boyPlanets = get_planetary_positions(boyDate);
    const girlPlanets = get_planetary_positions(girlDate);

    const boyMoon = boyPlanets.find(p => p.name === "Moon") || boyPlanets[1];
    const girlMoon = girlPlanets.find(p => p.name === "Moon") || girlPlanets[1];

    const boyMars = boyPlanets.find(p => p.name === "Mars") || boyPlanets[4];
    const girlMars = girlPlanets.find(p => p.name === "Mars") || girlPlanets[4];

    // D1 & D9 chart generation logic
    const generateVedicChart = (
      dobStr: string,
      timeStr: string | null,
      lat: number,
      lng: number,
      planetsData: any[]
    ) => {
      if (!timeStr) {
        // Return sign-only fallback values
        return {
          hasTime: false,
          ascSignIdx: -1,
          ascDegree: 0,
          ascSignName: "Unknown",
          houses: [],
          planetsBySign: planetsData.map(p => ({
            name: p.name,
            glyph: p.glyph || "★",
            sanskritName: p.sanskritName || p.name,
            signName: p.sign,
            signIdx: Math.floor(p.longitude / 30) % 12,
            degree: parseFloat(p.degreeInSign?.toFixed(1) || "0")
          }))
        };
      }

      // 1. Parse Julian Date
      const [year, month, day] = dobStr.split("-").map(Number);
      const [hour, min] = timeStr.split(":").map(Number);
      
      const tzOffset = Math.round((lng / 15) * 2) / 2;
      let localHours = hour + min / 60;
      let utcHours = localHours - tzOffset;
      
      let dateRef = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
      dateRef.setTime(dateRef.getTime() + utcHours * 60 * 60 * 1000);
      
      const jd = (dateRef.getTime() / 86400000) + 2440587.5;
      const d = jd - 2451545.0;

      // 2. Local Sidereal Time
      let gmst = (280.46061837 + 360.98564736629 * d) % 360;
      if (gmst < 0) gmst += 360;
      let lst = (gmst + lng) % 360;
      if (lst < 0) lst += 360;

      // 3. Tropical Ascendant calculation
      const ramc = (lst * Math.PI) / 180;
      const eps = (23.4392911 * Math.PI) / 180;
      const phi = (lat * Math.PI) / 180;
      
      const y1 = Math.cos(ramc);
      const x1 = -Math.sin(ramc) * Math.cos(eps) - Math.sin(eps) * Math.tan(phi);
      let ascTropical = Math.atan2(y1, x1) * 180 / Math.PI;
      if (ascTropical < 0) ascTropical += 360;

      // 4. Lahiri Ayanamsa subtraction for Sidereal Ascendant
      const msSince2000 = d * 86400000;
      const ayanamsa = 23.85306 + (0.01397 * (msSince2000 / (365.25 * 24 * 60 * 60 * 1000)));
      let ascSidereal = (ascTropical - ayanamsa + 360) % 360;
      
      const ascSignIdx = Math.floor(ascSidereal / 30) % 12;
      const ascDegree = ascSidereal % 30;

      // 5. Place planets in D1 (converting geocentric longitudes to sidereal as well)
      const siderealPlanets = planetsData.map(p => {
        let planetSidereal = (p.longitude - ayanamsa + 360) % 360;
        const signIdx = Math.floor(planetSidereal / 30) % 12;
        const degree = planetSidereal % 30;
        return {
          name: p.name,
          glyph: p.glyph || "★",
          sanskritName: p.sanskritName || p.name,
          longitude: planetSidereal,
          signIdx,
          degree
        };
      });

      // Create D1 Houses
      const d1Houses = Array.from({ length: 12 }, (_, i) => {
        const houseNumber = i + 1;
        const signIdx = (ascSignIdx + i) % 12;
        const signName = ZODIAC_SIGNS[signIdx];
        const lord = SIGN_LORDS[signIdx];
        const occupants = siderealPlanets.filter(p => p.signIdx === signIdx);
        return {
          houseNumber,
          signIdx,
          signName,
          lord,
          planets: occupants.map(o => ({
            name: o.name,
            glyph: o.glyph,
            degree: parseFloat(o.degree.toFixed(1))
          }))
        };
      });

      // 6. Generate Navamsa (D9) Chart
      const getNavamsaSign = (long: number): number => {
        const pSignIdx = Math.floor(long / 30) % 12;
        const degInpSign = long % 30;
        const navamsaIdx = Math.floor(degInpSign / 3.333333);
        let startSign = 0;
        if (pSignIdx % 3 === 0) {
          startSign = pSignIdx;
        } else if (pSignIdx % 3 === 1) {
          startSign = (pSignIdx + 8) % 12;
        } else {
          startSign = (pSignIdx + 4) % 12;
        }
        return (startSign + navamsaIdx) % 12;
      };

      const d9AscSignIdx = getNavamsaSign(ascSidereal);
      const d9Planets = siderealPlanets.map(p => ({
        ...p,
        d9SignIdx: getNavamsaSign(p.longitude)
      }));

      const d9Houses = Array.from({ length: 12 }, (_, i) => {
        const houseNumber = i + 1;
        const signIdx = (d9AscSignIdx + i) % 12;
        const signName = ZODIAC_SIGNS[signIdx];
        const lord = SIGN_LORDS[signIdx];
        const occupants = d9Planets.filter(p => p.d9SignIdx === signIdx);
        return {
          houseNumber,
          signIdx,
          signName,
          lord,
          planets: occupants.map(o => ({
            name: o.name,
            glyph: o.glyph,
            degree: parseFloat(o.degree.toFixed(1))
          }))
        };
      });

      return {
        hasTime: true,
        ascSignIdx,
        ascDegree: parseFloat(ascDegree.toFixed(1)),
        ascSignName: ZODIAC_SIGNS[ascSignIdx],
        d1Houses,
        d9AscSignIdx,
        d9Houses,
        planetsBySign: siderealPlanets.map(p => ({
          name: p.name,
          glyph: p.glyph,
          sanskritName: p.sanskritName,
          signName: ZODIAC_SIGNS[p.signIdx],
          signIdx: p.signIdx,
          degree: parseFloat(p.degree.toFixed(1))
        }))
      };
    };

    const boyChart = generateVedicChart(kBoyDob, kBoyTime, kBoyLat, kBoyLng, boyPlanets);
    const girlChart = generateVedicChart(kGirlDob, kGirlTime, kGirlLat, kGirlLng, girlPlanets);

    // COMP_SYNTHESIS
    const synthesizeCharts = (bChart: any, gChart: any) => {
      if (!bChart.hasTime || !gChart.hasTime) return null;

      const b7House = bChart.d1Houses[6];
      const b7Lord = b7House.lord;
      const b7Sign = b7House.signName;

      const g7House = gChart.d1Houses[6];
      const g7Lord = g7House.lord;
      const g7Sign = g7House.signName;

      const lordRelationBtoG = getPlanetaryRelation(b7Lord, g7Lord);
      const lordRelationGtoB = getPlanetaryRelation(g7Lord, b7Lord);

      const venusB = bChart.planetsBySign.find((p: any) => p.name === "Venus");
      const venusG = gChart.planetsBySign.find((p: any) => p.name === "Venus");
      const jupiterB = bChart.planetsBySign.find((p: any) => p.name === "Jupiter");
      const jupiterG = gChart.planetsBySign.find((p: any) => p.name === "Jupiter");

      let synthesisNotes = [];

      if (lordRelationBtoG === "Friend" && lordRelationGtoB === "Friend") {
        synthesisNotes.push(`The 7th house lords of both charts (${b7Lord} for Partner A and ${g7Lord} for Partner B) are mutual planetary allies. In Vedic guidelines, this indicates a deeply compatible partnership that handles differences with immense maturity, mutual respect, and quick emotional resolution.`);
      } else if (lordRelationBtoG === "Enemy" || lordRelationGtoB === "Enemy") {
        synthesisNotes.push(`The 7th house lords (${b7Lord} and ${g7Lord}) present active planetary resistance in classic astrology. This encourages both partners to practice absolute clarity in communications, and frames differences as healthy invitations to stretch personal perspectives rather than deterministic issues.`);
      } else {
        synthesisNotes.push(`The 7th house lords (${b7Lord} and ${g7Lord}) stand in a peaceful, neutral relationship. It implies a marriage built upon steady, realistic expectations, practical organization of domestic affairs, and durable collaboration.`);
      }

      let strongVenusCount = 0;
      if (venusB && [1, 6, 11].includes(venusB.signIdx)) strongVenusCount++;
      if (venusG && [1, 6, 11].includes(venusG.signIdx)) strongVenusCount++;
      
      let strongJupiterCount = 0;
      if (jupiterB && [3, 8, 11].includes(jupiterB.signIdx)) strongJupiterCount++;
      if (jupiterG && [3, 8, 11].includes(jupiterG.signIdx)) strongJupiterCount++;

      if (strongVenusCount > 0 || strongJupiterCount > 0) {
        synthesisNotes.push(`With key protective influences from ${strongVenusCount > 0 ? "Venus (sensory and romantic appreciation)" : ""} ${strongJupiterCount > 0 ? "and Jupiter (wisdom and soul-longevity)" : ""}, your celestial grids supply a rich undercurrent of forgiveness and spiritual endurance.`);
      } else {
        synthesisNotes.push(`The mutual positions of Jupiter and Venus offer a reliable template for mutual appreciation and appreciation of beauty. This safeguards relationship longevity even during testing planetary transits.`);
      }

      const bD9Asc = bChart.d9Houses[0].signName;
      const gD9Asc = gChart.d9Houses[0].signName;
      synthesisNotes.push(`In the critical Navamsa Chart (D9), Partner A's Ascendant is governed by ${bD9Asc}, indicating a steady template of structural devotion. Partner B's Navamsa Ascendant has a strong affinity for ${gD9Asc}, seeking deep emotional validation and shared creative sparks. Together, these complementary grids create a symmetrical field of partnership.`);

      return {
        boy7Lord: b7Lord,
        girl7Lord: g7Lord,
        boy7Sign: b7Sign,
        girl7Sign: g7Sign,
        relationText: synthesisNotes.join(" "),
        traditionalDisclaimer: "Vedic Suitability Disclaimer: The Birth Chart and Navamsa (D1 & D9) comparisons represent energetic alignments in Vedic astrology. Astrological friction should be viewed as areas for mutual growth, communication, and emotional integration rather than absolute limitations. Free will, conscious choice, and personal commitment transcend stellar configurations."
      };
    };

    const chartComparison = synthesizeCharts(boyChart, girlChart);

    // Compute Nakshatras index
    const boyNakIndex = Math.floor(boyMoon.longitude / 13.33333) % 27;
    const girlNakIndex = Math.floor(girlMoon.longitude / 13.33333) % 27;

    const boyNak = NAKSHATRAS[boyNakIndex];
    const girlNak = NAKSHATRAS[girlNakIndex];

    const boyRashiIdx = Math.floor(boyMoon.longitude / 30) % 12;
    const girlRashiIdx = Math.floor(girlMoon.longitude / 30) % 12;

    const boyRashi = ZODIAC_SIGNS[boyRashiIdx];
    const girlRashi = ZODIAC_SIGNS[girlRashiIdx];

    // 8-Fold Ashtakoot scoring logic
    // 1. VARNA (max 1)
    const getVarna = (rashiIdx: number) => {
      const water = [3, 7, 11]; // Cancer, Scorpio, Pisces
      const fire = [0, 4, 8]; // Aries, Leo, Sag
      const air = [2, 6, 10]; // Gem, Libra, Aqua
      if (water.includes(rashiIdx)) return { name: "Brahmin", val: 4 };
      if (fire.includes(rashiIdx)) return { name: "Kshatriya", val: 3 };
      if (air.includes(rashiIdx)) return { name: "Vaishya", val: 2 };
      return { name: "Shudra", val: 1 }; // Earth
    };
    const bVarna = getVarna(boyRashiIdx);
    const gVarna = getVarna(girlRashiIdx);
    const varnaScore = bVarna.val >= gVarna.val ? 1 : 0;

    // 2. VASHYA (max 2)
    const getVashyaGroup = (rashiIdx: number) => {
      const chatushpada = [0, 1, 8, 9]; // Aries, Taurus, Sag half, Cap half
      const manav = [2, 5, 6, 10]; // Gem, Virgo, Lib, Aqua
      const jalachar = [3, 11]; // Cancer, Pisces
      const vanachar = [4]; // Leo
      if (chatushpada.includes(rashiIdx)) return "Chatushpada";
      if (manav.includes(rashiIdx)) return "Manav";
      if (jalachar.includes(rashiIdx)) return "Jalachar";
      if (vanachar.includes(rashiIdx)) return "Vanachar";
      return "Keeta"; // Scorpio
    };
    const bVashya = getVashyaGroup(boyRashiIdx);
    const gVashya = getVashyaGroup(girlRashiIdx);
    const vashyaScore = bVashya === gVashya ? 2 : (bVashya === "Manav" && gVashya === "Jalachar" ? 1 : 0.5);

    // 3. TARA (max 3)
    const girlToBoy = (boyNakIndex - girlNakIndex + 27) % 9 || 9;
    const boyToGirl = (girlNakIndex - boyNakIndex + 27) % 9 || 9;
    const auspiciousTara = [1, 2, 4, 6, 8, 9, 0];
    const bTaraOk = auspiciousTara.includes(girlToBoy % 9);
    const gTaraOk = auspiciousTara.includes(boyToGirl % 9);
    const taraScore = (bTaraOk && gTaraOk) ? 3 : (bTaraOk || gTaraOk ? 1.5 : 0);

    // 4. YONI (max 4)
    const getYoniAnimal = (nakIdx: number) => {
      return YONI_ANIMALS.find(y => y.naks.includes(nakIdx))?.name || "Horse";
    };
    const bYoni = getYoniAnimal(boyNakIndex);
    const gYoni = getYoniAnimal(girlNakIndex);
    let yoniScore = 2; // neutral
    if (bYoni === gYoni) {
      yoniScore = 4;
    } else {
      // Deadly enemies
      const deadlyEnemies = [
        ["Serpent", "Mongoose"],
        ["Cat", "Rat"],
        ["Horse", "Buffalo"],
        ["Lion", "Elephant"],
        ["Dog", "Deer"],
        ["Tiger", "Cow"]
      ];
      const isEnemy = deadlyEnemies.some(pair => pair.includes(bYoni) && pair.includes(gYoni));
      if (isEnemy) yoniScore = 0;
    }

    // 5. GRAHA MAITRI (max 5)
    const getRulerPlanet = (rashiIdx: number) => {
      if ([0, 7].includes(rashiIdx)) return "Mars";
      if ([1, 6].includes(rashiIdx)) return "Venus";
      if ([2, 5].includes(rashiIdx)) return "Mercury";
      if (rashiIdx === 3) return "Moon";
      if (rashiIdx === 4) return "Sun";
      if ([8, 11].includes(rashiIdx)) return "Jupiter";
      return "Saturn";
    };
    const bRuler = getRulerPlanet(boyRashiIdx);
    const gRuler = getRulerPlanet(girlRashiIdx);
    let grahaScore = 2;
    if (bRuler === gRuler) {
      grahaScore = 5;
    } else {
      const friendlySuns = ["Sun", "Moon", "Mars", "Jupiter"];
      const friendlySaturns = ["Mercury", "Venus", "Saturn"];
      if (friendlySuns.includes(bRuler) && friendlySuns.includes(gRuler)) grahaScore = 4;
      else if (friendlySaturns.includes(bRuler) && friendlySaturns.includes(gRuler)) grahaScore = 4;
      else if (bRuler === "Mercury" && gRuler === "Sun") grahaScore = 3;
      else grahaScore = 1;
    }

    // 6. GANA (max 6)
    const bGana = boyNak.gana;
    const gGana = girlNak.gana;
    let ganaScore = 0;
    if (bGana === gGana) ganaScore = 6;
    else if ((bGana === "Deva" && gGana === "Manushya") || (bGana === "Manushya" && gGana === "Deva")) ganaScore = 5;
    else if ((bGana === "Manushya" && gGana === "Rakshasa") || (bGana === "Rakshasa" && gGana === "Manushya")) ganaScore = 3;
    else ganaScore = 1;

    // 7. BHAKOOT (max 7)
    const rashiDiff = Math.abs(boyRashiIdx - girlRashiIdx);
    const bhakootDosha = [1, 5, 4, 7, 8, 11].includes(rashiDiff) && rashiDiff !== 0; // standard 2-12 etc check
    const bhakootScore = bhakootDosha ? 0 : 7;

    // 8. NADI (max 8)
    const bNadi = boyNak.nadi;
    const gNadi = girlNak.nadi;
    const nadiDosha = bNadi === gNadi;
    const nadiScore = nadiDosha ? 0 : 8;

    const totalGuna = varnaScore + vashyaScore + taraScore + yoniScore + grahaScore + ganaScore + bhakootScore + nadiScore;

    // Manglik Check relative to Moon (Chandra Kundali)
    const getChandraMangalHouse = (marsIdx: number, moonIdx: number) => {
      return (marsIdx - moonIdx + 12) % 12 + 1;
    };
    const bMarsHouse = getChandraMangalHouse(Math.floor(boyMars.longitude / 30), boyRashiIdx);
    const gMarsHouse = getChandraMangalHouse(Math.floor(girlMars.longitude / 30), girlRashiIdx);

    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const bIsManglik = manglikHouses.includes(bMarsHouse);
    const gIsManglik = manglikHouses.includes(gMarsHouse);

    let manglikStatus = "None";
    if (bIsManglik && gIsManglik) manglikStatus = "Cancelled";
    else if (bIsManglik || gIsManglik) manglikStatus = "Active Consideration";

    let classification = "Not Recommended";
    let glowColor = "shadow-[#ef4444]/20 border-red-500/20 text-red-400";
    if (totalGuna >= 33) {
      classification = "Excellent Match";
      glowColor = "shadow-fuchsia-500/25 border-fuchsia-500/30 text-fuchsia-300";
    } else if (totalGuna >= 24) {
      classification = "Very Good Match";
      glowColor = "shadow-amber-500/25 border-amber-500/30 text-amber-300";
    } else if (totalGuna >= 18) {
      classification = "Average Match";
      glowColor = "shadow-orange-500/15 border-orange-500/20 text-orange-400";
    }

    setTimeout(() => {
      setKundaliResult({
        totalGuna,
        boyNak, girlNak,
        boyRashi, girlRashi,
        varnaScore, vashyaScore, taraScore, yoniScore, grahaScore, ganaScore, bhakootScore, nadiScore,
        nadiDosha, bhakootDosha,
        bIsManglik, gIsManglik, manglikStatus,
        bMarsHouse, gMarsHouse,
        classification, glowColor,
        isTimeMissing: !kBoyTime || !kGirlTime,
        boyChart,
        girlChart,
        chartComparison
      });
      setKundaliAnim("finished");

      // Set Mandala segments sequence
      const list = [1, 2, 3, 4, 5, 6, 7, 8];
      setUnlitMandalaSegments(list);
    }, 1500);
  };

  const handleDownloadReport = () => {
    if (!kundaliResult) return;

    const d: Record<string, Record<string, string>> = {
      en: {
        title: "Kundali Suitability Report",
        subTitle: "Traditional Vedic Ashtakoot Guna Milan Assessment",
        generated: "Report Generated",
        methodology: "Methodology: Lahiri Sidereal Ayanamsa",
        matchAssessment: "Match Assessment",
        outOf: "Out of 36",
        descText: "Your Kundali score reflects traditional magnetic and biological configurations based on Moon Nakshatras. A score above 18 Gunas indicates high systemic balance.",
        coordinates: "Nuptial Coordinates (Birth Details)",
        partnerA: "Partner A (♂)",
        partnerB: "Partner B (♀)",
        dateTime: "Birth Date & Time",
        location: "Birth Location",
        nakshatra: "Moon Nakshatra",
        sign: "Moon Sign (Rashi)",
        gana: "Nakshatra Gana",
        mahadasha: "Current Mahadasha",
        breakdownTitle: "Ashtakoot Guna Match Breakdown",
        colCategory: "Guna Category",
        colSignificance: "Significance",
        colScore: "Score Obtained",
        colMax: "Max Score",
        doshaTitle: "Critical Doshas & Obstacles Verification",
        nadiDoshaTitle: "Nadi Dosha Check",
        bhakootDoshaTitle: "Bhakoot Dosha Check",
        nadiDoshaDescTrue: "Both partners have the identical Nadi, signifying identical genetic and vitality codes. Traditionally, remedial prayers or gemstone counseling are suggested to balance physical prana.",
        nadiDoshaDescFalse: "Partners possess different Nadis (genetic codes), representing great vital compatibility and hereditary health.",
        bhakootDoshaDescTrue: "Traditional Moon sign differences indicate certain communicative efforts are required to prevent emotional blocks.",
        bhakootDoshaDescFalse: "Moon signs share highly balanced spatial angles, optimal for mutual lifestyle and intellectual resonance.",
        marsTitle: "Chandra Manglik Alignment (Mars energy)",
        partnerAMars: "Partner A Mars State",
        partnerBMars: "Partner B Mars State",
        overallMars: "Overall Mars Compatibility Resolution",
        astronomicalPlacements: "Detailed Astronomical Placements",
        colPlanet: "Planet",
        colSign: "Sign",
        colHouse: "House",
        colDegree: "Degree",
        colDignity: "Dignity",
        placementsTitle: "Placements",
        sevenHouseTitle: "7th House Comparative Synthesis",
        printBtn: "Print or Save as PDF",
        disclaimer: "Vedic Suitability Disclaimer: Kundali Matching (Ashtakoot Guna Milan) is a traditional Vedic system of suitability mapping. A low or high score indicates traditional astrological tendencies and should not be used as a deterministic barrier to relationship success. Human understanding and commitment transcend celestial counts.",
        // Planets
        Sun: "Sun",
        Moon: "Moon",
        Mars: "Mars",
        Mercury: "Mercury",
        Jupiter: "Jupiter",
        Venus: "Venus",
        Saturn: "Saturn",
        Rahu: "Rahu",
        Ketu: "Ketu",
        // Signs
        Aries: "Aries",
        Taurus: "Taurus",
        Gemini: "Gemini",
        Cancer: "Cancer",
        Leo: "Leo",
        Virgo: "Virgo",
        Libra: "Libra",
        Scorpio: "Scorpio",
        Sagittarius: "Sagittarius",
        Capricorn: "Capricorn",
        Aquarius: "Aquarius",
        Pisces: "Pisces",
        // Gunas
        varna: "1. Varna",
        vashya: "2. Vashya",
        tara: "3. Tara",
        yoni: "4. Yoni",
        graha: "5. Graha Maitri",
        ganaGuna: "6. Gana",
        bhakoot: "7. Bhakoot",
        nadi: "8. Nadi",
        // Significance
        varnaSig: "Spiritual Alignment & Ego Harmonization",
        vashyaSig: "Mutual Fascination & Emotional Attractiveness",
        taraSig: "Birth Star Compatibility & Physical Wealth Luck",
        yoniSig: "Physical pairing, Biological intimacy and Temperament",
        grahaSig: "Mental compatibility and Planetary Lord friendship",
        ganaGunaSig: "Behavioral alignment & Temperament Type (Deva/Manushya/Rakshasa)",
        bhakootSig: "Mutual sign dynamic, Health, Longevity, and Abundance",
        nadiSig: "Genetic coordination, Heredity, progeny wealth & vital energy",
        // Dignity
        Exalted: "Exalted",
        Debilitated: "Debilitated",
        OwnSign: "Own Sign",
        Moolatrikona: "Moolatrikona",
        Friendly: "Friendly",
        Neutral: "Neutral",
        Enemy: "Enemy",
        GreatFriend: "Great Friend",
        GreatEnemy: "Great Enemy",
        // Classifications
        "Excellent Match": "Excellent Match",
        "Very Good Match": "Very Good Match",
        "Average Match": "Average Match",
        "Not Recommended": "Not Recommended",
        // Manglik Status
        None: "No Manglik Influence",
        Cancelled: "Cancelled (Dosha Samana)",
        "Active Consideration": "Active Consideration Required",
        doshaFlagged: "Dosha Flagged ⚠️",
        optimalCompatibility: "Optimal compatibility ✅",
        Unknown: "Unknown",
        // Nadi/Gana
        Deva: "Deva (Divine)",
        Manushya: "Manushya (Human)",
        Rakshasa: "Rakshasa (Demonic)",
        Aadi: "Aadi (Beginning)",
        Madhya: "Madhya (Middle)",
        Antya: "Antya (End)"
      },
      hi: {
        title: "कुंडली अनुकूलता रिपोर्ट",
        subTitle: "पारंपरिक वैदिक अष्टकूट गुण मिलान मूल्यांकन",
        generated: "रिपोर्ट जेनरेट की गई",
        methodology: "पद्धति: लाहिड़ी निरयण अयनांश",
        matchAssessment: "अनुकूलता मूल्यांकन",
        outOf: "36 में से",
        descText: "आपका कुंडली स्कोर चंद्र नक्षत्रों के आधार पर पारंपरिक चुंबकीय और जैविक विन्यासों को दर्शाता है। 18 से अधिक गुण उच्च प्रणालीगत संतुलन का संकेत देते हैं।",
        coordinates: "जन्म विवरण (कुंडली विवरण)",
        partnerA: "वर (पुरुष) (♂)",
        partnerB: "कन्या (स्त्री) (♀)",
        dateTime: "जन्म तिथि और समय",
        location: "जन्म स्थान",
        nakshatra: "चंद्र नक्षत्र",
        sign: "चंद्र राशि",
        gana: "नक्षत्र गण",
        mahadasha: "वर्तमान महादशा",
        breakdownTitle: "अष्टकूट गुण मिलान विवरण",
        colCategory: "गुण श्रेणी",
        colSignificance: "महत्व",
        colScore: "प्राप्त अंक",
        colMax: "अधिकतम अंक",
        doshaTitle: "गंभीर दोषों और बाधाओं का सत्यापन",
        nadiDoshaTitle: "नाड़ी दोष की जांच",
        bhakootDoshaTitle: "भकूट दोष की जांच",
        nadiDoshaDescTrue: "दोनों भागीदारों की नाड़ी समान है, जो समान आनुवंशिक और जीवन शक्ति कोड का संकेत देती है। पारंपरिक रूप से, शारीरिक प्राण को संतुलित करने के लिए उपचारात्मक पूजा या रत्न परामर्श का सुझाव दिया जाता है।",
        nadiDoshaDescFalse: "भागीदारों के पास अलग-अलग नाड़ियाँ (आनुवांशिक कोड) हैं, जो महान जीवन शक्ति और वंशानुगत स्वास्थ्य को दर्शाती हैं।",
        bhakootDoshaDescTrue: "पारंपरिक चंद्र राशि भिन्नता संकेत देती है कि भावनात्मक अवरोधों को रोकने के लिए कुछ संचारात्मक प्रयासों की आवश्यकता है।",
        bhakootDoshaDescFalse: "चंद्र राशियाँ अत्यधिक संतुलित आकाशीय कोण साझा करती हैं, जो आपसी जीवनशैली और बौद्धिक प्रतिध्वनि के लिए इष्टतम हैं।",
        marsTitle: "चंद्र मांगलिक संरेखण (मंगल ऊर्जा)",
        partnerAMars: "वर मंगल स्थिति",
        partnerBMars: "कन्या मंगल स्थिति",
        overallMars: "समग्र मंगल अनुकूलता समाधान",
        astronomicalPlacements: "विस्तृत खगोलीय ग्रह स्थिति",
        colPlanet: "ग्रह",
        colSign: "राशि",
        colHouse: "भाव",
        colDegree: "अंश",
        colDignity: "अवस्था",
        placementsTitle: "ग्रह स्थिति",
        sevenHouseTitle: "सप्तम भाव तुलनात्मक विश्लेषण",
        printBtn: "प्रिंट करें या पीडीएफ सेव करें",
        disclaimer: "वैदिक अनुकूलता अस्वीकरण: कुंडली मिलान (अष्टकूट गुण मिलान) अनुकूलता मानचित्रण की एक पारंपरिक वैदिक प्रणाली है। कम या अधिक स्कोर पारंपरिक ज्योतिषीय प्रवृत्तियों को दर्शाता है और इसका उपयोग संबंध सफलता के लिए एक अंतिम बाधा के रूप में नहीं किया जाना चाहिए। मानवीय समझ और प्रतिबद्धता खगोलीय गणनाओं से परे हैं।",
        // Planets
        Sun: "सूर्य",
        Moon: "चंद्रमा",
        Mars: "मंगल",
        Mercury: "बुध",
        Jupiter: "गुरु (बृहस्पति)",
        Venus: "शुक्र",
        Saturn: "शनि",
        Rahu: "राहु",
        Ketu: "केतु",
        // Signs
        Aries: "मेष",
        Taurus: "वृषभ",
        Gemini: "मिथुन",
        Cancer: "कर्क",
        Leo: "सिंह",
        Virgo: "कन्या",
        Libra: "तुला",
        Scorpio: "वृश्चिक",
        Sagittarius: "धनु",
        Capricorn: "मकर",
        Aquarius: "कुंभ",
        Pisces: "मीन",
        // Gunas
        varna: "1. वर्ण",
        vashya: "2. वश्य",
        tara: "3. तारा",
        yoni: "4. योनि",
        graha: "5. ग्रह मैत्री",
        ganaGuna: "6. गण",
        bhakoot: "7. भकूट",
        nadi: "8. नाड़ी",
        // Significance
        varnaSig: "आध्यात्मिक संरेखण और अहंकार सामंजस्य",
        vashyaSig: "परस्पर आकर्षण और भावनात्मक सामंजस्य",
        taraSig: "जन्म नक्षत्र अनुकूलता और भौतिक समृद्धि भाग्य",
        yoniSig: "शारीरिक अनुकूलता, जैविक अंतरंगता और स्वभाव",
        grahaSig: "मानसिक अनुकूलता और ग्रह स्वामी मैत्री",
        ganaGunaSig: "व्यवहार अनुकूलता और स्वभाव प्रकार (देव/मनुष्य/राक्षस)",
        bhakootSig: "पारस्परिक राशि संबंध, स्वास्थ्य, दीर्घायु और समृद्धि",
        nadiSig: "आनुवंशिक समन्वय, आनुवंशिकता, संतान सुख और प्राण ऊर्जा",
        // Dignity
        Exalted: "उच्च का",
        Debilitated: "नीच का",
        OwnSign: "स्वराशि",
        Moolatrikona: "मूलत्रिकोण",
        Friendly: "मित्र राशि",
        Neutral: "सम राशि",
        Enemy: "शत्रु राशि",
        GreatFriend: "परम मित्र",
        GreatEnemy: "परम शत्रु",
        // Classifications
        "Excellent Match": "उत्कृष्ट मिलान",
        "Very Good Match": "बहुत अच्छा मिलान",
        "Average Match": "सामान्य मिलान",
        "Not Recommended": "अनुशंसित नहीं",
        // Manglik Status
        None: "कोई मांगलिक प्रभाव नहीं",
        Cancelled: "निरस्त (दोष समान/शांत)",
        "Active Consideration": "सक्रिय विचार की आवश्यकता",
        doshaFlagged: "दोष चिह्नित ⚠️",
        optimalCompatibility: "उत्कृष्ट अनुकूलता ✅",
        Unknown: "अज्ञात",
        // Nadi/Gana
        Deva: "देव (दिव्य)",
        Manushya: "मनुष्य (मानव)",
        Rakshasa: "राक्षस (उग्र)",
        Aadi: "आदि (प्रथम)",
        Madhya: "मध्य (द्वितीय)",
        Antya: "अंत्य (अंतिम)",
        // Nakshatras
        Ashwini: "अश्विनी",
        Bharani: "भरणी",
        Krittika: "कृत्तिका",
        Rohini: "रोहिणी",
        Mrigashira: "मृगशिरा",
        Ardra: "आर्द्रा",
        Punarvasu: "पुनर्वसु",
        Pushya: "पुष्य",
        Ashlesha: "आश्लेषा",
        Magha: "मघा",
        "Purva Phalguni": "पूर्वा फाल्गुनी",
        "Uttara Phalguni": "उत्तरा फाल्गुनी",
        Hasta: "हस्त",
        Chitra: "चित्र",
        Swati: "स्वाती",
        Vishakha: "विशाखा",
        Anuradha: "अनुराधा",
        Jyeshtha: "ज्येष्ठा",
        Mula: "मूल",
        "Purva Ashadha": "पूर्वाषाढ़ा",
        "Uttara Ashadha": "उत्तराषाढ़ा",
        Shravana: "श्रवण",
        Dhanishta: "धनिष्ठा",
        Shatabhisha: "शतभिषा",
        "Purva Bhadrapada": "पूर्वाभाद्रपद",
        "Uttara Bhadrapada": "उत्तराभाद्रपद",
        Revati: "रेवती"
      },
      bn: {
        title: "কুন্ডলী সামঞ্জস্য রিপোর্ট",
        subTitle: "ঐতিহ্যবাহী বৈদিক অষ্টকূট গুণ মিলন মূল্যায়ন",
        generated: "রিপোর্ট তৈরি করা হয়েছে",
        methodology: "পদ্ধতি: লাহিড়ী নিরয়ণ অয়নাংশ",
        matchAssessment: "মিলন মূল্যায়ন",
        outOf: "৩৬ এর মধ্যে",
        descText: "আপনার কুন্ডলী স্কোর চন্দ্র নক্ষত্রের উপর ভিত্তি করে ঐতিহ্যগত চৌম্বকীয় এবং জৈবিক মিলনকে প্রতিফলিত করে। ১৮ গুণের বেশি স্কোর উচ্চ পদ্ধতিগত ভারসাম্য নির্দেশ করে।",
        coordinates: "জন্ম বিবরণী (কুন্ডলী মেলবন্ধন)",
        partnerA: "পাত্র (পুরুষ) (♂)",
        partnerB: "পাত্রী (নারী) (♀)",
        dateTime: "জন্ম তারিখ ও সময়",
        location: "জন্মস্থান",
        nakshatra: "চন্দ্র নক্ষত্র",
        sign: "চন্দ্র রাশি",
        gana: "নক্ষত্র গণ",
        mahadasha: "বর্তমান মহাদশা",
        breakdownTitle: "অষ্টকূট গুণ মিলন বিবরণী",
        colCategory: "গুণ বিভাগ",
        colSignificance: "তাৎপর্য",
        colScore: "প্রাপ্ত গুণ",
        colMax: "সর্বোচ্চ গুণ",
        doshaTitle: "গুরুতর দোষ এবং বাধা যাচাইকরণ",
        nadiDoshaTitle: "নাড়ী দোষ পরীক্ষা",
        bhakootDoshaTitle: "ভকূটের দোষ পরীক্ষা",
        nadiDoshaDescTrue: "উভয় সঙ্গীর নাড়ী এক, যা অভিন্ন শারীরিক ও জীবনী শক্তিকে নির্দেশ করে। ঐতিহ্যগতভাবে, শারীরিক প্রাণ ও শক্তি ভারসাম্য বজায় রাখতে কিছু পূজা এবং রত্ন পরামর্শ দেওয়া হয়।",
        nadiDoshaDescFalse: "উভয় সঙ্গীর আলাদা নাড়ী (জেনেটিক কোড) রয়েছে, যা চমৎকার জীবনীশক্তি এবং বংশগত বলের পরিচয় বহন করে।",
        bhakootDoshaDescTrue: "ঐতিহ্যগত চন্দ্র রাশির পার্থক্য নির্দেশ করে যে মানসিক বাধা রোধ করার জন্য সচেতন যোগাযোগের প্রচেষ্টা প্রয়োজন।",
        bhakootDoshaDescFalse: "চন্দ্র রাশিদ্বয় চমৎকার কোণে অবস্থিত, যা জীবনযাপন এবং বৌদ্ধিক মনন মিলনের জন্য অত্যন্ত অনুকূল।",
        marsTitle: "চন্দ্র মাঙ্গলিক মিলন (মঙ্গল শক্তি)",
        partnerAMars: "পাত্রের মঙ্গল দোষের অবস্থা",
        partnerBMars: "পাত্রীর মঙ্গল দোষের অবস্থা",
        overallMars: "সার্বিক মঙ্গল সামঞ্জস্য সমাধান",
        astronomicalPlacements: "বিস্তারিত জ্যোতির্বিজ্ঞানের গ্রহাবস্থান",
        colPlanet: "গ্রহ",
        colSign: "রাশি",
        colHouse: "ভাব",
        colDegree: "ডিগ্রী",
        colDignity: "অবস্থা",
        placementsTitle: "গ্রহাবস্থান",
        sevenHouseTitle: "সপ্তম ভাব তুলনামূলক সংশ্লেষণ",
        printBtn: "প্রিন্ট বা পিডিএফ সেভ করুন",
        disclaimer: "বৈদিক সামঞ্জস্য অস্বীকারকারী: কুন্ডলী মিলন (অষ্টকূট গুণ মিলন) হল পরিমাপের একটি ঐতিহ্যবাহী বৈদিক পদ্ধতি। কম বা উচ্চ স্কোর ঐতিহ্যগত জ্যোতিষশাস্ত্রীয় প্রবণতাকে নির্দেশ করে এবং সম্পর্ক নির্ধারণ করার চূড়ান্ত মাপকাঠি নয়। মানুষের পারস্পরিক বোঝাপড়া এবং প্রতিশ্রুতি সমস্ত হিসাবের উর্ধ্বে।",
        // Planets
        Sun: "সূর্য",
        Moon: "চন্দ্র",
        Mars: "मंगल",
        Mercury: "বুধ",
        Jupiter: "বৃহস্পতি",
        Venus: "শুক্র",
        Saturn: "শনি",
        Rahu: "রাহু",
        Ketu: "কেতু",
        // Signs
        Aries: "মেষ",
        Taurus: "বৃষ",
        Gemini: "মিথুন",
        Cancer: "কর্কট",
        Leo: "সিংহ",
        Virgo: "কন্যা",
        Libra: "তুলা",
        Scorpio: "বৃশ্চিক",
        Sagittarius: "ধনু",
        Capricorn: "মকর",
        Aquarius: "কুম্ভ",
        Pisces: "মীন",
        // Gunas
        varna: "১. বর্ণ",
        vashya: "২. বশ্য",
        tara: "৩. তারা",
        yoni: "৪. যোনি",
        graha: "৫. গ্রহ মৈত্রী",
        ganaGuna: "৬. গণ",
        bhakoot: "৭. ভকূট",
        nadi: "৮. নাড়ী",
        // Significance
        varnaSig: "আধ্যাত্মিক সারিবদ্ধতা এবং অহং সামঞ্জস্য",
        vashyaSig: "পারস্পরিক আকর্ষণ এবং মানসিক আকর্ষণ",
        taraSig: "জন্ম নক্ষত্র সামঞ্জস্য এবং বস্তুগত ভাগ্য",
        yoniSig: "শারীরিক বন্ধন, জৈবিক ঘনিষ্ঠতা এবং স্বভাব",
        grahaSig: "মানসিক সামঞ্জস্য এবং গ্রহাধিপতির মৈত্রী",
        ganaGunaSig: "আচরণগত মিলন এবং স্বভাবের ধরণ (দেব/মানুষ/রাক্ষস)",
        bhakootSig: "পারস্পরিক রাশি গতিশীলতা, স্বাস্থ্য, দীর্ঘায়ু এবং প্রাচুর্য",
        nadiSig: "জেনেটিক সমন্বয়, বংশগতি, সন্তান ভাগ্য এবং জীবনী শক্তি",
        // Dignity
        Exalted: "তুঙ্গী (উচ্চ)",
        Debilitated: "নীচ",
        OwnSign: "স্বক্ষেত্র",
        Moolatrikona: "মূলত্রিকোণ",
        Friendly: "মিত্রক্ষেত্র",
        Neutral: "সমক্ষেত্র",
        Enemy: "শত্রুক্ষেত্র",
        GreatFriend: "পরম মিত্র",
        GreatEnemy: "পরম শত্রু",
        // Classifications
        "Excellent Match": "চমৎকার মিলন",
        "Very Good Match": "খুব ভালো মিলন",
        "Average Match": "সাধারণ মিলন",
        "Not Recommended": "সুপারিশ করা হয় না",
        // Manglik Status
        None: "কোন মাঙ্গলিক প্রভাব নেই",
        Cancelled: "খন্ডিত (দোষ সমান)",
        "Active Consideration": "সক্রিয় বিবেচনা প্রয়োজন",
        doshaFlagged: "দোষ চিহ্নিত ⚠️",
        optimalCompatibility: "চমৎকার সামঞ্জস্য ✅",
        Unknown: "অজানা",
        // Nadi/Gana
        Deva: "দেব (স্বর্গীয়)",
        Manushya: "মানুষ (মানবীয়)",
        Rakshasa: "রাক্ষস (তীব্র)",
        Aadi: "আদি (প্রথম)",
        Madhya: "মধ্য (দ্বিতীয়)",
        Antya: "অন্ত্য (শেষ)",
        // Nakshatras
        Ashwini: "অশ্বিনী",
        Bharani: "ভরণী",
        Krittika: "কৃত্তিকা",
        Rohini: "রোহিণী",
        Mrigashira: "মৃগশিরা",
        Ardra: "আর্দ্রা",
        Punarvasu: "পুনর্বসু",
        Pushya: "পুষ্যা",
        Ashlesha: "অশ্লেষা",
        Magha: "মঘা",
        "Purva Phalguni": "পূর্ব ফাল্গুনী",
        "Uttara Phalguni": "উত্তর ফাল্গুনী",
        Hasta: "হস্তা",
        Chitra: "চিত্রা",
        Swati: "স্বাতী",
        Vishakha: "বিশাখা",
        Anuradha: "অনুরাধা",
        Jyeshtha: "জ্যৈষ্ঠা",
        Mula: "মূলা",
        "Purva Ashadha": "পূর্বাষাঢ়া",
        "Uttara Ashadha": "উত্তরাষাঢ়া",
        Shravana: "শ্রবণা",
        Dhanishta: "ধনিষ্ঠা",
        Shatabhisha: "শতভিষা",
        "Purva Bhadrapada": "পূর্বভাদ্রপদ",
        "Uttara Bhadrapada": "উত্তরভাদ্রপদ",
        Revati: "রেবতী"
      },
      mr: {
        title: "कुंडली सुसंगतता अहवाल",
        subTitle: "पारंपारिक वैदिक अष्टकूट गुण मिलान मूल्यमापन",
        generated: "अहवाल तयार केला",
        methodology: "पद्धती: लाहिरी निरयण अयनांश",
        matchAssessment: "गुण मिलान",
        outOf: "३६ पैकी",
        descText: "तुमचा कुंडली गुण चंद्र नक्षत्रांवर आधारित पारंपारिक चुंबकीय आणि जैविक रचना दर्शवतो. १८ पेक्षा जास्त गुण असल्यास उत्तम सुसंगततेचे लक्षण मानले जाते.",
        coordinates: "जन्म तपशील (कुंडली समन्वय)",
        partnerA: "वर (पुरुष) (♂)",
        partnerB: "वधू (स्त्री) (♀)",
        dateTime: "जन्म तारीख व वेळ",
        location: "जन्म ठिकाण",
        nakshatra: "चंद्र नक्षत्र",
        sign: "चंद्र रास",
        gana: "नक्षत्र गण",
        mahadasha: "सध्याची महादशा",
        breakdownTitle: "अष्टकूट गुण मिलान तपशील",
        colCategory: "गुण श्रेणी",
        colSignificance: "महत्व",
        colScore: "प्राप्त गुण",
        colMax: "कमाल गुण",
        doshaTitle: "गंभीर दोष आणि अडथळे पडताळणी",
        nadiDoshaTitle: "नाडी दोष तपासणी",
        bhakootDoshaTitle: "भकूट दोष तपासणी",
        nadiDoshaDescTrue: "दोन्ही भागीदारांची नाडी एकच आहे, जी समान अनुवांशिक आणि जीवन शक्तीचे संकेत देते. शारीरिक प्राण संतुलित करण्यासाठी पारंपरिक रीतीने पूजा किंवा रत्न परिधान करण्याचा सल्ला दिला जातो.",
        nadiDoshaDescFalse: "भागीदारांची नाडी भिन्न आहे, जी उत्तम शारीरिक सुसंगतता आणि अनुवांशिक आरोग्य दर्शवते.",
        bhakootDoshaDescTrue: "पारंपरिक चंद्र राशींमधील भिन्नता दर्शवते की भावनिक अडथळे टाळण्यासाठी संवादाचे विशेष प्रयत्न आवश्यक असतील.",
        bhakootDoshaDescFalse: "चंद्र राशींचे परस्परांशी असलेले संबंध अत्यंत उत्तम आहेत, जे परस्पर जीवनशैली आणि बौद्धिक सुदृढतेसाठी पूरक आहेत.",
        marsTitle: "चंद्र मांगलिक संरेखन (मंगळ ऊर्जा)",
        partnerAMars: "वर मंगळ स्थिती",
        partnerBMars: "वधू मंगळ स्थिती",
        overallMars: "एकूण मंगळ सुसंगतता तोडगा",
        astronomicalPlacements: "सविस्तर खगोलशास्त्रीय ग्रहांचे स्थान",
        colPlanet: "ग्रह",
        colSign: "रास",
        colHouse: "स्थान",
        colDegree: "अंश",
        colDignity: "अवस्था",
        placementsTitle: "ग्रहांची स्थिती",
        sevenHouseTitle: "सप्तम स्थान तुलनात्मक विश्लेषण",
        printBtn: "प्रिंट करा किंवा पीडीएफ सेव्ह करा",
        disclaimer: "वैदिक सुसंगतता अस्वीकरण: कुंडली मिलान (अष्टकूट गुण मिलान) ही एक पारंपारिक वैदिक पद्धत आहे. कमी किंवा जास्त गुण हे केवळ ज्योतिषीय कल दर्शवतात आणि याचा उपयोग नातेसंबंधांच्या अंतिम यशाचे मोजमाप म्हणून केला जाऊ नये. मानवी सामंजस्य आणि बांधिलकी ही खगोलीय गणितांपेक्षा श्रेष्ठ आहे।",
        // Planets
        Sun: "सूर्य",
        Moon: "चंद्र",
        Mars: "मंगळ",
        Mercury: "बुध",
        Jupiter: "गुरु (बृहस्पति)",
        Venus: "शुक्र",
        Saturn: "शनि",
        Rahu: "राहू",
        Ketu: "केतू",
        // Signs
        Aries: "मेष",
        Taurus: "वृषभ",
        Gemini: "मिथुन",
        Cancer: "कर्क",
        Leo: "सिंह",
        Virgo: "कन्या",
        Libra: "तूळ",
        Scorpio: "वृश्चिक",
        Sagittarius: "धनु",
        Capricorn: "मकर",
        Aquarius: "कुंभ",
        Pisces: "मीन",
        // Gunas
        varna: "१. वर्ण",
        vashya: "२. वश्य",
        tara: "३. तारा",
        yoni: "४. योनी",
        graha: "५. ग्रह मैत्री",
        ganaGuna: "६. गण",
        bhakoot: "७. भकूट",
        nadi: "८. नाडी",
        // Significance
        varnaSig: "आध्यात्मिक संरेखन आणि अहंकार सामंजस्य",
        vashyaSig: "परस्पर आकर्षण आणि भावनिक जवळीक",
        taraSig: "जन्म नक्षत्र सुसंगतता आणि भौतिक समृद्धी भाग्य",
        yoniSig: "शारीरिक अनुकूलता, जैविक जवळीक आणि स्वभाव",
        grahaSig: "मानसिक सुसंगतता आणि ग्रह स्वामी मैत्री",
        ganaGunaSig: "वर्तन सुसंगतता आणि स्वभाव प्रकार (देव/मनुष्य/राक्षस)",
        bhakootSig: "परस्पर रास संबंध, आरोग्य, दीर्घायुष्य आणि समृद्धी",
        nadiSig: "अनुवांशिक समन्वय, अनुवांशिकता, संतती सुख आणि प्राण ऊर्जा",
        // Dignity
        Exalted: "उच्च",
        Debilitated: "नीच",
        OwnSign: "स्वराशी",
        Moolatrikona: "मूलत्रिकोण",
        Friendly: "मित्र राशी",
        Neutral: "सम राशी",
        Enemy: "शत्रू राशी",
        GreatFriend: "परम मित्र",
        GreatEnemy: "परम शत्रू",
        // Classifications
        "Excellent Match": "उत्कृष्ट मिलान",
        "Very Good Match": "खूप चांगला मिलान",
        "Average Match": "मध्यम मिलान",
        "Not Recommended": "सुचवले जात नाही",
        // Manglik Status
        None: "काहीही मांगलिक प्रभाव नाही",
        Cancelled: "रद्द (दोष समान)",
        "Active Consideration": "सक्रिय विचार आवश्यक",
        doshaFlagged: "दोष आढळला ⚠️",
        optimalCompatibility: "उत्कृष्ट सुसंगतता ✅",
        Unknown: "अज्ञात",
        // Nadi/Gana
        Deva: "देव (दिव्य)",
        Manushya: "मनुष्य (मानव)",
        Rakshasa: "राक्षस (उग्र)",
        Aadi: "आदि (प्रथम)",
        Madhya: "मध्य (द्वितीय)",
        Antya: "अंत्य (अंतिम)",
        // Nakshatras
        Ashwini: "अश्विनी",
        Bharani: "भरणी",
        Krittika: "कृत्तिका",
        Rohini: "रोहिणी",
        Mrigashira: "मृगशीर्ष",
        Ardra: "आर्द्रा",
        Punarvasu: "पुनर्वसू",
        Pushya: "पुष्य",
        Ashlesha: "आश्लेषा",
        Magha: "मघा",
        "Purva Phalguni": "पूर्वा फाल्गुनी",
        "Uttara Phalguni": "उत्तरा फाल्गुनी",
        Hasta: "हस्त",
        Chitra: "चित्रा",
        Swati: "स्वाती",
        Vishakha: "विशाखा",
        Anuradha: "अनुराधा",
        Jyeshtha: "ज्येष्ठा",
        Mula: "मूळ",
        "Purva Ashadha": "पूर्वाषाढा",
        "Uttara Ashadha": "उत्तराषाढा",
        Shravana: "श्रवण",
        Dhanishta: "धनिष्ठा",
        Shatabhisha: "शततारका",
        "Purva Bhadrapada": "पूर्वाभाद्रपदा",
        "Uttara Bhadrapada": "उत्तराभाद्रपदा",
        Revati: "रेवती"
      },
      gu: {
        title: "કુંડળી મેળવણી અહેવાલ",
        subTitle: "પારંપરિક વૈદિક અષ્ટકૂટ ગુણ મિલન મૂલ્યાંકન",
        generated: "રિપોર્ટ જનરેટ કરાયેલ",
        methodology: "પદ્ધતિ: લાહિરી નિરયણ અયનાંશ",
        matchAssessment: "ગુણ મિલન",
        outOf: "૩૬ માંથી",
        descText: "તમારો કુંડળી સ્કોર ચંદ્ર નક્ષત્રો પર આધારિત પરંપરાગત ચુંબકીય અને જૈવિક પરિસ્થિતિઓને દર્શાવે છે. ૧૮ થી વધુ ગુણ મેળવણી માટે સારો સ્કોર ગણાય છે.",
        coordinates: "જન્મ વિગત (કુંડળી મેળવણી વિગત)",
        partnerA: "વર (પુરુષ) (♂)",
        partnerB: "કન્યા (સ્ત્રી) (♀)",
        dateTime: "જન્મ તારીખ અને સમય",
        location: "જન્મસ્થળ",
        nakshatra: "ચંદ્ર નક્ષત્ર",
        sign: "ચંદ્ર રાશિ",
        gana: "નક્ષત્ર ગણ",
        mahadasha: "વર્તમાન મહાદશા",
        breakdownTitle: "અષ્ટકૂટ ગુણ મિલન વિગત",
        colCategory: "ગુણ શ્રેણી",
        colSignificance: "મહત્વ",
        colScore: "પ્રાપ્ત ગુણ",
        colMax: "મહત્તમ ગુણ",
        doshaTitle: "ગંભીર દોષો અને અડચણોની ચકાસણી",
        nadiDoshaTitle: "નાડી દોષ તપાસ",
        bhakootDoshaTitle: "ભકૂટ દોષ તપાસ",
        nadiDoshaDescTrue: "બંને ભાગીદારોની નાડી સમાન છે, જે સમાન જનીન અને જીવન શક્તિ દર્શાવે છે. શારીરિક પ્રાણ ઊર્જાને સંતુલિત રાખવા માટે પૂજા અથવા રત્ન ધારણ કરવાની સલાહ આપવામાં આવે છે.",
        nadiDoshaDescFalse: "બંને ભાગીદારોની નાડી ભિન્ન (જુદી) છે, જે ઉત્તમ જનીન સુસંગતતા અને આરોગ્યપ્રદ વંશપરંપરા દર્શાવે છે.",
        bhakootDoshaDescTrue: "પરંપરાગત ચંદ્ર રાશિમાં તફાવત સૂચવે છે કે ભાવનાત્મક અડચણો રોકવા માટે વાતચીતના વિશેષ પ્રયત્નોની જરૂર છે.",
        bhakootDoshaDescFalse: "ચંદ્ર રાશિઓ પરસ્પર ઉત્તમ ખૂણો ધરાવે છે, જે પરસ્પર જીવનશૈલી અને બૌદ્ધિક સમજણ માટે શ્રેષ્ઠ છે.",
        marsTitle: "ચંદ્ર માંગલિક સ્થિતિ (મંગળ ઊર્જા)",
        partnerAMars: "વર મંગળ સ્થિતિ",
        partnerBMars: "કન્યા મંગળ સ્થિતિ",
        overallMars: "સમગ્ર મંગળ મેળવણી ઉકેલ",
        astronomicalPlacements: "વિગતવાર ખગોળીય ગ્રહોની સ્થિતિ",
        colPlanet: "ગ્રહ",
        colSign: "રાશિ",
        colHouse: "સ્થાન",
        colDegree: "અંશ",
        colDignity: "સ્થિતિ",
        placementsTitle: "ગ્રહોની સ્થિતિ",
        sevenHouseTitle: "સપ્તમ ભાવ તુલનાત્મક સંશ્લેષણ",
        printBtn: "પ્રિન્ટ કરો અથવા પીડીએફ સેવ કરો",
        disclaimer: "વૈદિક અનુકૂળતા અસ્વીકરણ: કુંડળી મેળવણી (અષ્ટકૂટ ગુણ મિલન) મેળવણીની એક પરંપરાગત વૈદિક પ્રણાલી છે. ઓછો કે વધારે સ્કોર પરંપરાગત જ્યોતિષીય સંભાવનાઓ દર્શાવે છે અને તેનો સંબંધની સફળતાના અંતિમ નિર્ણય તરીકે ઉપયોગ થવો જોઈએ નહીં. માનવીય સમજ અને પ્રતિબદ્ધતા ગ્રહોની ગણતરીઓ કરતાં ઘણી ઉપર છે.",
        // Planets
        Sun: "સૂર્ય",
        Moon: "ચંદ્ર",
        Mars: "મંગળ",
        Mercury: "બુધ",
        Jupiter: "ગુરુ (બૃહસ્પતિ)",
        Venus: "શુક્ર",
        Saturn: "શનિ",
        Rahu: "રાહુ",
        Ketu: "કેતુ",
        // Signs
        Aries: "મેષ",
        Taurus: "વૃષભ",
        Gemini: "મિથુન",
        Cancer: "કર્ક",
        Leo: "સિંહ",
        Virgo: "કન્યા",
        Libra: "તુલા",
        Scorpio: "વૃશ્ચિક",
        Sagittarius: "ધનુ",
        Capricorn: "મકર",
        Aquarius: "કુંભ",
        Pisces: "મીન",
        // Gunas
        varna: "૧. વર્ણ",
        vashya: "૨. વશ્ય",
        tara: "૩. તારા",
        yoni: "૪. યોનિ",
        graha: "૫. ગ્રહ મૈત્રી",
        ganaGuna: "૬. ગણ",
        bhakoot: "૭. ભકૂટ",
        nadi: "૮. નાડી",
        // Significance
        varnaSig: "આધ્યાત્મિક ગોઠવણી અને અહંકાર સામંજસ્ય",
        vashyaSig: "પરસ્પર આકર્ષણ અને ભાવનાત્મક તાલમેલ",
        taraSig: "જન્મ નક્ષત્ર સુસંગતતા અને ભૌતિક સંપત્તિનું ભાગ્ય",
        yoniSig: "શારીરિક સુસંગતતા, જૈવિક નિકટતા અને સ્વભાવ",
        grahaSig: "માનસિક અનુકૂળતા અને ગ્રહ સ્વામી મૈત્રી",
        ganaGunaSig: "વર્તણૂક સુસંગતતા અને સ્વભાવ પ્રકાર (દેવ/મનુષ્ય/રાક્ષસ)",
        bhakootSig: "પરસ્પર રાશિ સંબંધ, આરોગ્ય, દીર્ઘાયુષ્ય અને સમૃદ્ધિ",
        nadiSig: "આનુવંશિક સુમેળ, વારસો, સંતાન સુખ અને પ્રાણ ઊર્જા",
        // Dignity
        Exalted: "ઉચ્ચ",
        Debilitated: "નીચ",
        OwnSign: "સ્વરાશિ",
        Moolatrikona: "મૂળત્રિકોણ",
        Friendly: "મિત્ર રાશિ",
        Neutral: "સમ રાશિ",
        Enemy: "શત્રુ રાશિ",
        GreatFriend: "પરમ મિત્ર",
        GreatEnemy: "પરમ શત્રુ",
        // Classifications
        "Excellent Match": "ઉત્તમ મિલન",
        "Very Good Match": "ખૂબ જ સારું મિલન",
        "Average Match": "સામાન્ય મિલન",
        "Not Recommended": "ભલામણ કરેલ નથી",
        // Manglik Status
        None: "કોઈ માંગલિક પ્રભાવ નથી",
        Cancelled: "રદ થઈ ગયેલ (દોષ સમાન)",
        "Active Consideration": "સક્રિય વિચારણા જરૂરી",
        doshaFlagged: "દોષ જોવા મળ્યો ⚠️",
        optimalCompatibility: "ઉત્તમ મેળવણી ✅",
        Unknown: "અજ્ઞાત",
        // Nadi/Gana
        Deva: "દેવ (દિવ્ય)",
        Manushya: "મનુષ્ય (માનવ)",
        Rakshasa: "રાક્ષસ (ઉગ્ર)",
        Aadi: "આદિ (પ્રથમ)",
        Madhya: "મધ્ય (દ્વિતીય)",
        Antya: "અંત્ય (અંતિમ)",
        // Nakshatras
        Ashwini: "અશ્વિની",
        Bharani: "ભરણી",
        Krittika: "કૃતિકા",
        Rohini: "રોહિણી",
        Mrigashira: "મૃગશીર્ષ",
        Ardra: "આદ્રા",
        Punarvasu: "પુનર્વસુ",
        Pushya: "પુષ્ય",
        Ashlesha: "આશ્લેષા",
        Magha: "મઘા",
        "Purva Phalguni": "પૂર્વા ફાલ્ગુની",
        "Uttara Phalguni": "ઉત્તરા ફાલ્ગુની",
        Hasta: "હસ્ત",
        Chitra: "ચિત્રા",
        Swati: "સ્વાતિ",
        Vishakha: "વિશાખા",
        Anuradha: "અનુરાધા",
        Jyeshtha: "જ્યેષ્ઠા",
        Mula: "મૂળ",
        "Purva Ashadha": "પૂર્વાષાઢા",
        "Uttara Ashadha": "ઉત્તરાષાઢા",
        Shravana: "શ્રવણ",
        Dhanishta: "ધનિષ્ઠા",
        Shatabhisha: "શતભિષા",
        "Purva Bhadrapada": "પૂર્વાભાદ્રપદા",
        "Uttara Bhadrapada": "ઉત્તરાભાદ્રપદા",
        Revati: "રેવતી"
      }
    };

    const curLang = d[language] ? language : "en";
    const lex = (key: string) => {
      const cleanKey = (key || "").trim();
      return (d[curLang] && d[curLang][cleanKey]) || (d["en"] && d["en"][cleanKey]) || cleanKey;
    };

    const getTranslatedGana = (gana: string) => {
      const g = (gana || "").trim().toLowerCase();
      if (g.includes("deva")) return lex("Deva");
      if (g.includes("manushya")) return lex("Manushya");
      if (g.includes("rakshasa")) return lex("Rakshasa");
      return lex(gana);
    };

    const getTranslatedNadi = (nadi: string) => {
      const n = (nadi || "").trim().toLowerCase();
      if (n.startsWith("aad")) return lex("Aadi");
      if (n.startsWith("mad")) return lex("Madhya");
      if (n.startsWith("ant")) return lex("Antya");
      return lex(nadi);
    };

    const getTranslatedDignity = (dgt: string) => {
      if (dgt.includes("Exalted")) return lex("Exalted") + " 🌟";
      if (dgt.includes("Debilitated")) return lex("Debilitated") + " ⚠️";
      if (dgt.includes("Friendly")) return lex("Friendly") + " 🤝";
      if (dgt.includes("Enemy")) return lex("Enemy") + " ⚡";
      return lex("Neutral") + " ⚖️";
    };

    const getTranslatedMahadasha = (mdText: string) => {
      const match = mdText.match(/^(\w+)\s+Dasha\s+\(until\s+(\d+)\)$/);
      if (match) {
        const ruler = match[1];
        const endYear = match[2];
        const translatedRuler = lex(ruler);
        if (curLang === "hi") {
          return `${translatedRuler} महादशा (${endYear} तक)`;
        } else if (curLang === "bn") {
          return `${translatedRuler} মহাদশা (চলবে ${endYear} সাল পর্যন্ত)`;
        } else if (curLang === "mr") {
          return `${translatedRuler} महादशा (${endYear} पर्यंत)`;
        } else if (curLang === "gu") {
          return `${translatedRuler} મહાદશા (${endYear} સુધી)`;
        }
      }
      return mdText;
    };

    const getTranslatedManglikStatusText = (isBoy: boolean) => {
      const isManglik = isBoy ? kundaliResult.bIsManglik : kundaliResult.gIsManglik;
      const house = isBoy ? kundaliResult.bMarsHouse : kundaliResult.gMarsHouse;
      
      if (curLang === "hi") {
        return `मंगल चंद्र राशि से ${house || "?"} भाव में स्थित है। स्थिति <b>${isManglik ? "मांगलिक (उग्र स्वभाव)" : "गैर-मांगलिक"}</b> है।`;
      } else if (curLang === "bn") {
        return `মঙ্গল চন্দ্র লগ্ন হতে ${house || "?"} ভাবে অবস্থিত। অবস্থা <b>${isManglik ? "মাঙ্গলিক (তীব্র স্বভাব)" : "অ-মাঙ্গলিক"}</b>।`;
      } else if (curLang === "mr") {
        return `मंगळ चंद्रापासून ${house || "?"} व्या स्थानात आहे. मंगळ दोष <b>${isManglik ? "मांगलिक (उग्र स्वभाव)" : "विना-मांगलिक"}</b> आहे.`;
      } else if (curLang === "gu") {
        return `મંગળ ચંદ્ર રાશિથી ${house || "?"} સ્થાન પર છે. સ્થિતિ <b>${isManglik ? "માંગલિક (ઉગ્ર સ્વભાવ)" : "બિન-માંગલિક"}</b> છે.`;
      }
      return `Mars longitude places it in Chandra House ${house || "?"}. Status is <b>${isManglik ? "Manglik (Fiery Temperament)" : "Non-Manglik"}</b>.`;
    };

    const getLocalizedRelationText = () => {
      if (curLang === "en") return kundaliResult.chartComparison.relationText;

      const bChart = kundaliResult.boyChart;
      const gChart = kundaliResult.girlChart;
      if (!bChart || !gChart) return kundaliResult.chartComparison.relationText;

      const b7House = bChart.d1Houses[6];
      const b7Lord = b7House.lord;

      const g7House = gChart.d1Houses[6];
      const g7Lord = g7House.lord;

      const lordRelationBtoG = getPlanetaryRelation(b7Lord, g7Lord);
      const lordRelationGtoB = getPlanetaryRelation(g7Lord, b7Lord);

      const venusB = bChart.planetsBySign.find((p: any) => p.name === "Venus");
      const venusG = gChart.planetsBySign.find((p: any) => p.name === "Venus");
      const jupiterB = bChart.planetsBySign.find((p: any) => p.name === "Jupiter");
      const jupiterG = gChart.planetsBySign.find((p: any) => p.name === "Jupiter");

      let notes = [];

      const tP = (p: string) => lex(p);
      const tS = (s: string) => lex(s);

      // Part 1
      if (lordRelationBtoG === "Friend" && lordRelationGtoB === "Friend") {
        if (curLang === "hi") {
          notes.push(`दोनों कुंडलियों के सप्तमेश (वर के लिए ${tP(b7Lord)} और कन्या के लिए ${tP(g7Lord)}) आपसी ग्रह मित्र हैं। वैदिक सिद्धांतों में, यह एक गहरे अनुकूल गठबंधन का संकेत देता है जो भिन्नताओं को परिपक्वता, आपसी सम्मान और त्वरित भावनात्मक समाधान के साथ संभालता है।`);
        } else if (curLang === "bn") {
          notes.push(`উভয় কুন্ডলীর সপ্তম পতি (পাত্রের জন্য ${tP(b7Lord)} এবং পাত্রীর জন্য ${tP(g7Lord)}) পারস্পরিক বন্ধুত্বপূর্ণ অবস্থানে রয়েছে। বৈদিক নীতি অনুসারে, এটি একটি অত্যন্ত সামঞ্জস্যপূর্ণ অংশীদারিত্ব নির্দেশ করে যা পারস্পরিক শ্রদ্ধা এবং দ্রুত মানসিক বোঝাপড়ার সাথে সমস্ত মতপার্থক্য সমাধান করে।`);
        } else if (curLang === "mr") {
          notes.push(`दोन्ही कुंडल्यांमधील सप्तमेश (वरासाठी ${tP(b7Lord)} आणि वधूसाठी ${tP(g7Lord)}) परस्परांचे मित्र ग्रह आहेत. वैदिक तत्त्वांमध्ये, हे एका सखोल सुसंगत भागीदारीचे संकेत देते जे आपसांतील मतभेद सामंजस्याने, परस्पर आदराने आणि त्वरित सोडवते.`);
        } else if (curLang === "gu") {
          notes.push(`બંને કુંડળીના સપ્તમેશ (વર માટે ${tP(b7Lord)} અને કન્યા માટે ${tP(g7Lord)}) પરસ્પર ગ્રહ મિત્રો છે. વૈદિક માર્ગદર્શિકામાં, આ એક અનુકૂળ ભાગીદારી સૂચવે છે જે કોઈ પણ મતભેદોને પરિપક્વતા, પરસ્પર આદર અને ઝડપી ભાવનાત્મક મેળથી હલ કરે છે.`);
        }
      } else if (lordRelationBtoG === "Enemy" || lordRelationGtoB === "Enemy") {
        if (curLang === "hi") {
          notes.push(`सप्तमेश (${tP(b7Lord)} और ${tP(g7Lord)}) पारंपरिक ज्योतिष में सक्रिय ग्रह प्रतिरोध प्रस्तुत करते हैं। यह दोनों भागीदारों को संचार में पूर्ण स्पष्टता बनाए रखने के लिए प्रोत्साहित करता है, और मतभेदों को एक बाधा के बजाय दृष्टिकोण को व्यापक बनाने के अवसर के रूप में प्रस्तुत करता है।`);
        } else if (curLang === "bn") {
          notes.push(`সপ্তম পতিদ্বয় (${tP(b7Lord)} এবং ${tP(g7Lord)}) সনাতন জ্যোতিষশাস্ত্রে পারস্পরিক কিছুটা বিপরীত অবস্থানে রয়েছে। যা উভয় সঙ্গীকে যোগাযোগের ক্ষেত্রে স্পষ্টতা বজায় রাখতে উৎসাহিত করে এবং মতপার্থক্যকে একটি বাধা হিসেবে না দেখে পারস্পরিক দৃষ্টিভঙ্গির প্রসারের সুযোগ হিসেবে প্রদর্শন করে।`);
        } else if (curLang === "mr") {
          notes.push(`सप्तमेश (${tP(b7Lord)} आणि ${tP(g7Lord)}) ज्योतिषशास्त्रात एकमेकांना विरोध दर्शवणारे आहेत. हे दोन्ही भागीदारांना संवादामध्ये पूर्ण स्पष्टता ठेवण्यास प्रोत्साहित करते आणि मतभेदांना अडथळा न मानता एकमेकांचे विचार समजून घेण्याची सुसंधी मानते.`);
        } else if (curLang === "gu") {
          notes.push(`સપ્તમેશ (${tP(b7Lord)} અને ${tP(g7Lord)}) વૈદિક જ્યોતિષમાં સક્રિય ગ્રહ અવરોધ રજૂ કરે છે. આ બંને ભાગીદારોને વાતચીતમાં સંપૂર્ણ સ્પષ્ટતા રાખવા માટે પ્રોત્સાહિત કરે છે, અને મતભેદોને એક અડચણને બદલે પરસ્પર સમજણ વધારવાની તક પૂરી પાડે છે.`);
        }
      } else {
        if (curLang === "hi") {
          notes.push(`सप्तमेश (${tP(b7Lord)} और ${tP(g7Lord)}) एक शांतिपूर्ण, तटस्थ संबंध में हैं। यह स्थिर, यथार्थवादी अपेक्षाओं, घरेलू मामलों के व्यावहारिक संगठन और मजबूत सहयोग पर आधारित विवाह का संकेत देता है।`);
        } else if (curLang === "bn") {
          notes.push(`সপ্তম পতিদ্বয় (${tP(b7Lord)} এবং ${tP(g7Lord)}) একটি শান্ত ও নিরপেক্ষ সম্পর্কের মধ্যে রয়েছে। এটি গভীর বাস্তবসম্মত প্রত্যাশা ও চমৎকার সহযোগিতার উপর ভিত্তি করে গড়ে ওঠা দাম্পত্য জীবনের নির্দেশ করে।`);
        } else if (curLang === "mr") {
          notes.push(`सप्तमेश (${tP(b7Lord)} आणि ${tP(g7Lord)}) शांत आणि तटस्थ संबंधात आहेत. याचा अर्थ असा विवाह जो स्थिर, वास्तववादी अपेक्षा, कौटुंबिक व्यवस्थेचे व्यावहारिक नियोजन आणि दीर्घकालीन सहकार्यावर आधारित आहे.`);
        } else if (curLang === "gu") {
          notes.push(`સપ્તમેશ (${tP(b7Lord)} અને ${tP(g7Lord)}) શાંતિપૂર્ણ, તટસ્થ સંબંધમાં છે. આ સૂચવે છે કે લગ્નજીવન મજબૂત અને વાસ્તવિક અપેક્ષાઓ, વ્યવહારિક પારિવારિક આયોજન અને ટકાઉ સહયોગ પર બનેલું છે.`);
        }
      }

      // Part 2
      let strongVenusCount = 0;
      if (venusB && [1, 6, 11].includes(venusB.signIdx)) strongVenusCount++;
      if (venusG && [1, 6, 11].includes(venusG.signIdx)) strongVenusCount++;

      let strongJupiterCount = 0;
      if (jupiterB && [3, 8, 11].includes(jupiterB.signIdx)) strongJupiterCount++;
      if (jupiterG && [3, 8, 11].includes(jupiterG.signIdx)) strongJupiterCount++;

      if (strongVenusCount > 0 || strongJupiterCount > 0) {
        if (curLang === "hi") {
          const partV = strongVenusCount > 0 ? "शुक्र (इन्द्रिय और प्रेमपूर्ण लगाव)" : "";
          const partJ = strongJupiterCount > 0 ? "और गुरु (बुद्धि और आध्यात्मिक आयु)" : "";
          notes.push(`${partV} ${partJ} के प्रमुख सुरक्षात्मक प्रभावों के साथ, आपके खगोलीय ग्रिड क्षमा और आध्यात्मिक सहनशक्ति का एक समृद्ध प्रवाह प्रदान करते हैं।`);
        } else if (curLang === "bn") {
          const partV = strongVenusCount > 0 ? "শুক্র (রোমান্টিক আকর্ষণ ও পারস্পরিক অনুরাগ)" : "";
          const partJ = strongJupiterCount > 0 ? "এবং বৃহস্পতি (জ্ঞান ও আধ্যাত্মিক জীবনীশক্তি)" : "";
          notes.push(`${partV} ${partJ} এর মূল সুরক্ষামূলক প্রভাবের সাথে, আপনার দাম্পত্য জীবনে ক্ষমা ও মানসিক সহনশীলতার এক অনন্য প্রবাহ বিদ্যমান রয়েছে।`);
        } else if (curLang === "mr") {
          const partV = strongVenusCount > 0 ? "शुक्र (प्रेमळ आणि भावनिक ओढ)" : "";
          const partJ = strongJupiterCount > 0 ? "आणि गुरु (ज्ञान आणि आध्यात्मिक आयुष्य)" : "";
          notes.push(`${partV} ${partJ} यांच्या मुख्य संरक्षणात्मक प्रभावाने, तुमच्या ग्रह रचनेमुळे नातेसंबंधात क्षमाशीलता आणि आध्यात्मिक सामर्थ्य लाभते.`);
        } else if (curLang === "gu") {
          const partV = strongVenusCount > 0 ? "શુક્ર (પારસ્પરિક અને રોમેન્ટિક આકર્ષ્ણો)" : "";
          const partJ = strongJupiterCount > 0 ? "અને ગુરુ (બુદ્ધિ અને આધ્યાત્મિક આયુસ)" : "";
          notes.push(`${partV} ${partJ} ના રક્ષણાત્મક પ્રભાવો સાથે, તમારી કુંડળી પરસ્પર ક્ષમા અને સહનશક્તિ પ્રદાન કરે છે.`);
        }
      } else {
        if (curLang === "hi") {
          notes.push(`गुरु और शुक्र की पारस्परिक स्थितियां पारस्परिक प्रशंसा और सौंदर्य की सराहना के लिए एक विश्वसनीय आधार प्रदान करती हैं। यह कठिन ग्रह गोचर के दौरान भी संबंध दीर्घायु की रक्षा करता है।`);
        } else if (curLang === "bn") {
          notes.push(`বৃহস্পতি এবং শুক্রের পারস্পরিক অবস্থান পারস্পরিক সমাদর ও সুন্দরের প্রশংসার জন্য একটি নির্ভরযোগ্য ভিত্তি হিসেবে কাজ করে। এটি কঠিন গ্রহ গোচরের সময়েও সম্পর্ক দীর্ঘস্থায়ী রাখতে সাহায্য করে।`);
        } else if (curLang === "mr") {
          notes.push(`गुरु आणि शुक्र यांची परस्पर स्थिती सुसंवाद आणि परस्पर कौतुकासाठी विश्वासार्ह आधार प्रदान करते. हे कठीण काळातही नातेसंबंधांच्या दीर्घायुष्याचे रक्षण करते.`);
        } else if (curLang === "gu") {
          notes.push(`ગુરુ અને શુક્રની પરસ્પર સ્થિતિ પરસ્પર પ્રશંસા અને પ્રેમ માટે એક વિશ્વસનીય આધાર પ્રદાન કરે છે. આ મુશ્કેલ ગ્રહ ગોચર દરમિયાન પણ સંબંધની દીર્ઘાયુની રક્ષા કરે છે.`);
        }
      }

      // Part 3
      const bD9Asc = bChart.d9Houses[0].signName;
      const gD9Asc = gChart.d9Houses[0].signName;
      if (curLang === "hi") {
        notes.push(`महत्वपूर्ण नवमांश कुंडली (D9) में, वर के लग्न स्वामी ${tS(bD9Asc)} द्वारा शासित हैं, जो संरचनात्मक समर्पण के स्थिर आधार का संकेत देता है। कन्या का नवमांश लग्न ${tS(gD9Asc)} के साथ गहरा संबंध रखता है, जो गहरी भावनात्मक संतुष्टि और साझा रचनात्मक चिंगारी चाहता है। साथ में, ये पूरक ग्रिड साझेदारी का एक संतुलित क्षेत्र बनाते हैं।`);
      } else if (curLang === "bn") {
        notes.push(`গুরুত্বপূর্ণ নবমাংশ কুন্ডলীতে (D9), পাত্রের লগ্ন ${tS(bD9Asc)} দ্বারা পরিচালিত হয়, যা কাঠামোগত নিষ্ঠার একটি সুষম ধারাকে নির্দেশ করে। পাত্রীর নবমাংশ লগ্ন ${tS(gD9Asc)} এর সাথে গভীর সংযোগ প্রকাশ করে, যা গভীর মানসিক সন্তুষ্টি এবং সৃজনশীল অনুপ্রেরণা অন্বেষণ করে। একত্রে, এই পরিপূরক গ্রহাবস্থান অংশীদারিত্বের একটি অত্যন্ত সুষম ক্ষেত্র তৈরি করে।`);
      } else if (curLang === "mr") {
        notes.push(`महत्त्वपूर्ण नवमांश कुंडलीत (D9), वराचे लग्न ${tS(bD9Asc)} द्वारे संरेखित आहे, जे स्थिर समर्पणाचे संकेत देते. वधूचे नवमांश लग्न ${tS(gD9Asc)} शी निगडीत आहे, जे भावनिक ओळख आणि सामायिक सर्जनशीलतेची भावना शोधते. एकत्रपणे, या परस्पर पूरक रचना भागीदारीचा एक समतोल क्षेत्र तयार करतात.`);
      } else if (curLang === "gu") {
        notes.push(`મહત્વપૂર્ણ નવમાંશ કુંડળી (D9) માં, વરનું લગ્ન ${tS(bD9Asc)} દ્વારા સંચાલિત છે, જે સમર્પણના સ્થિર આધારને સૂચવે છે. કન્યાનું નવમાંશ લગ્ન ${tS(gD9Asc)} સાથે ઊંડો લગાવ ધરાવે છે, જે ગાઢ લાગણીશીલ સંતોષ અને પરસ્પર સર્જનાત્મક પ્રેરણા ઈચ્છે છે. આ બંને પૂરક ગ્રહો સાથે મળીને લગ્નજીવનનું ઉત્તમ સંતુલન બનાવે છે.`);
      }

      return notes.join(" ");
    };

    const timestamp = new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const bNakName = kundaliResult.boyNak?.name || "Unknown";
    const bNakGana = kundaliResult.boyNak?.gana || "Unknown";
    
    const gNakName = kundaliResult.girlNak?.name || "Unknown";
    const gNakGana = kundaliResult.girlNak?.gana || "Unknown";

    const bMD = getRunningMahadasha(kBoyDob, NAKSHATRAS.find(n => n.name === bNakName)?.ruler || "Venus");
    const gMD = getRunningMahadasha(kGirlDob, NAKSHATRAS.find(n => n.name === gNakName)?.ruler || "Venus");

    let statusStyle = "background-color: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);";
    if (kundaliResult.totalGuna >= 33) {
      statusStyle = "background-color: rgba(217, 70, 239, 0.1); color: #f472b6; border: 1px solid rgba(217, 70, 239, 0.2);";
    } else if (kundaliResult.totalGuna >= 24) {
      statusStyle = "background-color: rgba(245, 158, 11, 0.1); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.2);";
    } else if (kundaliResult.totalGuna >= 18) {
      statusStyle = "background-color: rgba(251, 146, 60, 0.1); color: #fb923c; border: 1px solid rgba(251, 146, 60, 0.2);";
    }

    const bhakootStatus = kundaliResult.bhakootDosha ? lex("doshaFlagged") : lex("optimalCompatibility");
    const nadiStatus = kundaliResult.nadiDosha ? lex("doshaFlagged") : lex("optimalCompatibility");

    const getPlanetRow = (charData: any, pName: string) => {
      let matchedP: any = null;
      let matchedHNum = "?";
      let matchedSignName = "Unknown";
      
      const housesSource = activeChartView === "D1" ? charData.d1Houses : charData.d9Houses;
      if (housesSource) {
        for (const h of housesSource) {
          const found = h.planets.find((p: any) => p.name === pName);
          if (found) {
            matchedP = found;
            matchedHNum = h.houseNumber;
            matchedSignName = h.signName;
            break;
          }
        }
      }
      if (!matchedP) return "";
      const dgt = getDignity(pName, activeChartView === "D1" ? matchedP.signIdx : matchedP.signIdx);
      
      const translatedPName = lex(pName);
      const translatedSign = lex(matchedSignName);
      const translatedDgt = getTranslatedDignity(dgt);

      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); font-weight: bold; color: ${getPlanetColor(pName)};">
            ${getPlanetAbbreviation(pName)} - ${translatedPName}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e4e4e7;">${translatedSign}</td>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #f59e0b; font-weight: bold;">H${matchedHNum}</td>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #a1a1aa;">${matchedP.degree.toFixed(1)}°</td>
          <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right; color: ${dgt.includes("Exalted") ? "#10b981" : dgt.includes("Debilitated") ? "#ef4444" : "#a1a1aa"}; font-weight: bold;">
            ${translatedDgt}
          </td>
        </tr>
      `;
    };

    const planetsList = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
    const boyPlanetsRows = planetsList.map(p => getPlanetRow(kundaliResult.boyChart, p)).join("");
    const girlPlanetsRows = planetsList.map(p => getPlanetRow(kundaliResult.girlChart, p)).join("");

    const reportHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kundali Matching Report: ${kBoyName} & ${kGirlName}</title>
  <style>
    body {
      background-color: #0b0914;
      color: #e4e4e7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 40px 20px;
    }
    .wrapper {
      max-width: 900px;
      margin: 0 auto;
      background: #12101b;
      border: 1px solid rgba(245, 158, 11, 0.15);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      position: relative;
    }
    .header {
      position: relative;
      text-align: center;
      border-bottom: 2px solid rgba(245, 158, 11, 0.2);
      padding-bottom: 30px;
      margin-bottom: 30px;
    }
    .gold-seal {
      font-size: 40px;
      margin-bottom: 10px;
      filter: drop-shadow(0 0 10px #f59e0b);
    }
    .header h1 {
      margin: 0;
      font-size: 30px;
      color: #fbbf24;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-family: "Georgia", serif;
    }
    .header p {
      margin: 8px 0 0;
      color: #a1a1aa;
      font-size: 13px;
      letter-spacing: 1px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 12px;
      color: #a1a1aa;
    }
    .meta-table td {
      border: none;
      padding: 4px 0;
    }
    .section-title {
      font-size: 17px;
      color: #fbbf24;
      border-bottom: 1px solid rgba(245, 158, 11, 0.2);
      padding-bottom: 8px;
      margin-top: 40px;
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: "Georgia", serif;
    }
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
    }
    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }
    .prof-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(245, 158, 11, 0.1);
      border-radius: 12px;
      padding: 22px;
      position: relative;
    }
    .prof-card::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      border-radius: 12px 12px 0 0;
    }
    .prof-card.boy::before {
      background: #f59e0b;
    }
    .prof-card.girl::before {
      background: #6366f1;
    }
    .prof-card h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 18px;
      color: #fff;
    }
    .prof-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding: 8px 0;
      font-size: 13px;
    }
    .prof-row span:first-child {
      color: #a1a1aa;
    }
    .prof-row span:last-child {
      font-weight: bold;
      color: #f4f4f5;
    }
    .score-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 30px;
      background: rgba(245, 158, 11, 0.03);
      border: 1px solid rgba(245, 158, 11, 0.15);
      border-radius: 16px;
      padding: 25px;
      margin-top: 30px;
    }
    @media (max-width: 550px) {
      .score-banner {
        flex-direction: column;
        text-align: center;
      }
    }
    .badge-wrap {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 4px solid #f59e0b;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #171424;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
    }
    .badge-wrap .num {
      font-size: 32px;
      font-weight: 900;
      color: #fff;
    }
    .badge-wrap .sub {
      font-size: 10px;
      color: #a1a1aa;
      text-transform: uppercase;
      font-weight: bold;
    }
    .score-desc h2 {
      margin: 0;
      font-size: 22px;
      color: #fff;
    }
    .score-desc p {
      margin: 8px 0 0;
      font-size: 14px;
      color: #a1a1aa;
      line-height: 1.5;
    }
    .status-pill {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
      font-size: 13px;
    }
    th, td {
      padding: 12px 10px;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    th {
      color: #94a3b8;
      font-weight: 600;
      border-bottom: 2px solid rgba(245, 158, 11, 0.15);
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 1px;
    }
    .subtable-wrapper {
      overflow-x: auto;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      background: rgba(255,255,255,0.01);
      margin-bottom: 20px;
    }
    .dosha-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }
    @media (max-width: 600px) {
      .dosha-grid {
        grid-template-columns: 1fr;
      }
    }
    .dosha-box {
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 16px;
    }
    .dosha-box h4 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 14px;
      color: #fff;
      display: flex;
      justify-content: space-between;
    }
    .dosha-box p {
      margin: 0;
      font-size: 12px;
      color: #a1a1aa;
      line-height: 1.5;
    }
    .banner-print-btn {
      text-align: center;
      margin-top: 40px;
    }
    .btn-action {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0b0914;
      padding: 12px 30px;
      border-radius: 30px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 12px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
    }
    .btn-action:hover {
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
    }
    .disclaimer {
      font-size: 10px;
      color: #64748b;
      text-align: center;
      line-height: 1.6;
      margin-top: 50px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 20px;
      text-transform: uppercase;
    }
    @media print {
      body {
        background-color: #ffffff !important;
        color: #000000 !important;
        padding: 0;
      }
      .wrapper {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .btn-action {
        display: none !important;
      }
      .prof-card {
        background: #ffffff !important;
        border: 1px solid #cbd5e1 !important;
        color: #000000 !important;
      }
      .prof-card h3, .prof-row span:last-child {
        color: #000000 !important;
      }
      .score-banner {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        color: #000000 !important;
      }
      .badge-wrap {
        background: #ffffff !important;
        box-shadow: none !important;
        border-color: #000000 !important;
      }
      .badge-wrap .num {
        color: #000000 !important;
      }
      .score-desc h2 {
        color: #000000 !important;
      }
      .subtable-wrapper {
        border-color: #cbd5e1 !important;
        background: none !important;
      }
      th {
        color: #0f172a !important;
        border-bottom-color: #94a3b8 !important;
      }
      td {
        color: #334155 !important;
        border-bottom-color: #e2e8f0 !important;
      }
      .dosha-box {
        border: 1px solid #cbd5e1 !important;
        color: #000000 !important;
      }
      .dosha-box h4 {
        color: #000000 !important;
      }
      .section-title {
        color: #0f172a !important;
        border-bottom-color: #94a3b8 !important;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="gold-seal">⚜️</div>
      <h1>${lex("title")}</h1>
      <p>${lex("subTitle")}</p>
      <table class="meta-table">
        <tr>
          <td style="text-align: left;">${lex("generated")}: <b>${timestamp}</b></td>
          <td style="text-align: right;">${lex("methodology")}</td>
        </tr>
      </table>
    </div>

    <!-- score summary -->
    <div class="score-banner">
      <div class="badge-wrap">
        <span class="num">${kundaliResult.totalGuna}</span>
        <span class="sub">${lex("outOf")}</span>
      </div>
      <div class="score-desc">
        <h2>${lex("matchAssessment")}: <span style="color: #fbbf24;">${lex(kundaliResult.classification)}</span></h2>
        <p>${lex("descText")}</p>
        <span class="status-pill" style="${statusStyle}">${lex(kundaliResult.classification)}</span>
      </div>
    </div>

    <!-- profiles side by side -->
    <div class="section-title">${lex("coordinates")}</div>
    <div class="profile-grid">
      <div class="prof-card boy">
        <h3>${lex("partnerA")}: ${kBoyName}</h3>
        <div class="prof-row"><span>${lex("dateTime")}</span><span>${kBoyDob} | ${kBoyTime || "00:00"}</span></div>
        <div class="prof-row"><span>${lex("location")}</span><span>${kBoyPlace}</span></div>
        <div class="prof-row"><span>${lex("nakshatra")}</span><span>${lex(bNakName)}</span></div>
        <div class="prof-row"><span>${lex("sign")}</span><span>${lex(kundaliResult.boyRashi)}</span></div>
        <div class="prof-row"><span>${lex("gana")}</span><span>${getTranslatedGana(bNakGana)}</span></div>
        <div class="prof-row"><span>${lex("mahadasha")}</span><span>${getTranslatedMahadasha(bMD)}</span></div>
      </div>
      <div class="prof-card girl">
        <h3>${lex("partnerB")}: ${kGirlName}</h3>
        <div class="prof-row"><span>${lex("dateTime")}</span><span>${kGirlDob} | ${kGirlTime || "00:00"}</span></div>
        <div class="prof-row"><span>${lex("location")}</span><span>${kGirlPlace}</span></div>
        <div class="prof-row"><span>${lex("nakshatra")}</span><span>${lex(gNakName)}</span></div>
        <div class="prof-row"><span>${lex("sign")}</span><span>${lex(kundaliResult.girlRashi)}</span></div>
        <div class="prof-row"><span>${lex("gana")}</span><span>${getTranslatedGana(gNakGana)}</span></div>
        <div class="prof-row"><span>${lex("mahadasha")}</span><span>${getTranslatedMahadasha(gMD)}</span></div>
      </div>
    </div>

    <!-- Guna breakdown -->
    <div class="section-title">${lex("breakdownTitle")}</div>
    <div class="subtable-wrapper">
      <table>
        <thead>
          <tr>
            <th>${lex("colCategory")}</th>
            <th>${lex("colSignificance")}</th>
            <th style="text-align: right;">${lex("colScore")}</th>
            <th style="text-align: right;">${lex("colMax")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${lex("varna")}</td>
            <td>${lex("varnaSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.varnaScore}</td>
            <td style="text-align: right; color: #a1a1aa;">1</td>
          </tr>
          <tr>
            <td>${lex("vashya")}</td>
            <td>${lex("vashyaSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.vashyaScore}</td>
            <td style="text-align: right; color: #a1a1aa;">2</td>
          </tr>
          <tr>
            <td>${lex("tara")}</td>
            <td>${lex("taraSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.taraScore}</td>
            <td style="text-align: right; color: #a1a1aa;">3</td>
          </tr>
          <tr>
            <td>${lex("yoni")}</td>
            <td>${lex("yoniSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.yoniScore}</td>
            <td style="text-align: right; color: #a1a1aa;">4</td>
          </tr>
          <tr>
            <td>${lex("graha")}</td>
            <td>${lex("grahaSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.grahaScore}</td>
            <td style="text-align: right; color: #a1a1aa;">5</td>
          </tr>
          <tr>
            <td>${lex("ganaGuna")}</td>
            <td>${lex("ganaGunaSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.ganaScore}</td>
            <td style="text-align: right; color: #a1a1aa;">6</td>
          </tr>
          <tr>
            <td>${lex("bhakoot")}</td>
            <td>${lex("bhakootSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.bhakootScore}</td>
            <td style="text-align: right; color: #a1a1aa;">7</td>
          </tr>
          <tr>
            <td>${lex("nadi")}</td>
            <td>${lex("nadiSig")}</td>
            <td style="text-align: right; font-weight: bold;">${kundaliResult.nadiScore}</td>
            <td style="text-align: right; color: #a1a1aa;">8</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Special Dosha analysis -->
    <div class="section-title">${lex("doshaTitle")}</div>
    <div class="dosha-grid">
      <div class="dosha-box">
        <h4><span>${lex("nadiDoshaTitle")}</span><span style="color: ${kundaliResult.nadiDosha ? '#ef4444' : '#10b981'}">${nadiStatus}</span></h4>
        <p>${kundaliResult.nadiDosha ? lex("nadiDoshaDescTrue") : lex("nadiDoshaDescFalse")}</p>
      </div>
      <div class="dosha-box">
        <h4><span>${lex("bhakootDoshaTitle")}</span><span style="color: ${kundaliResult.bhakootDosha ? '#ef4444' : '#10b981'}">${bhakootStatus}</span></h4>
        <p>${kundaliResult.bhakootDosha ? lex("bhakootDoshaDescTrue") : lex("bhakootDoshaDescFalse")}</p>
      </div>
    </div>

    <!-- Mars alignment -->
    <div class="section-title">${lex("marsTitle")}</div>
    <div class="dosha-grid">
      <div class="dosha-box">
        <h4><span>${lex("partnerAMars")}</span></h4>
        <p>${getTranslatedManglikStatusText(true)}</p>
      </div>
      <div class="dosha-box">
        <h4><span>${lex("partnerBMars")}</span></h4>
        <p>${getTranslatedManglikStatusText(false)}</p>
      </div>
    </div>
    <p style="font-size: 13px; color: #a1a1aa; margin-left: 5px;">${lex("overallMars")}: <b style="color: #fbbf24;">${lex(kundaliResult.manglikStatus)}</b></p>

    <!-- Sidereal planet summary -->
    <div class="section-title">${lex("astronomicalPlacements")} (${activeChartView === "D1" ? lex("Rashi (D1)") : lex("Navamsa (D9)")})</div>
    <div class="profile-grid">
      <div>
        <h4 style="margin-top:0; color: #f59e0b; font-size:14px;">${kBoyName} ${lex("placementsTitle")}</h4>
        <div class="subtable-wrapper">
          <table style="margin-bottom:0;">
            <thead>
              <tr>
                <th>${lex("colPlanet")}</th>
                <th>${lex("colSign")}</th>
                <th>${lex("colHouse")}</th>
                <th>${lex("colDegree")}</th>
                <th style="text-align: right;">${lex("colDignity")}</th>
              </tr>
            </thead>
            <tbody>
              ${boyPlanetsRows}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h4 style="margin-top:0; color: #6366f1; font-size:14px;">${kGirlName} ${lex("placementsTitle")}</h4>
        <div class="subtable-wrapper">
          <table style="margin-bottom:0;">
            <thead>
              <tr>
                <th>${lex("colPlanet")}</th>
                <th>${lex("colSign")}</th>
                <th>${lex("colHouse")}</th>
                <th>${lex("colDegree")}</th>
                <th style="text-align: right;">${lex("colDignity")}</th>
              </tr>
            </thead>
            <tbody>
              ${girlPlanetsRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Spouse compatibility synthesis -->
    <div class="section-title">${lex("sevenHouseTitle")}</div>
    <div class="prof-card" style="margin-bottom: 30px;">
      <p style="font-size: 13px; line-height: 1.6; color: #e4e4e7; margin: 0 0 15px 0;">
        ${getLocalizedRelationText()}
      </p>
      <div style="display: flex; gap: 20px;">
        <div style="flex: 1; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; text-align: center;">
          <span style="color:#a1a1aa; display:block; margin-bottom:4px;">${lex("partnerA")} ${lex("seventhLord")}</span>
          <b style="color:#fbbf24;">${lex(kundaliResult.chartComparison.boy7Lord)} ${curLang === "hi" ? `(${lex(kundaliResult.chartComparison.boy7Sign)} राशि में)` : curLang === "bn" ? `(${lex(kundaliResult.chartComparison.boy7Sign)} রাশিতে)` : curLang === "mr" ? `(${lex(kundaliResult.chartComparison.boy7Sign)} राशीत)` : curLang === "gu" ? `(${lex(kundaliResult.chartComparison.boy7Sign)} રાશિમાં)` : `in ${lex(kundaliResult.chartComparison.boy7Sign)}`}</b>
        </div>
        <div style="flex: 1; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-size: 11px; text-align: center;">
          <span style="color:#a1a1aa; display:block; margin-bottom:4px;">${lex("partnerB")} ${lex("seventhLord")}</span>
          <b style="color:#fbbf24;">${lex(kundaliResult.chartComparison.girl7Lord)} ${curLang === "hi" ? `(${lex(kundaliResult.chartComparison.girl7Sign)} राशि में)` : curLang === "bn" ? `(${lex(kundaliResult.chartComparison.girl7Sign)} রাশিতে)` : curLang === "mr" ? `(${lex(kundaliResult.chartComparison.girl7Sign)} राशीत)` : curLang === "gu" ? `(${lex(kundaliResult.chartComparison.girl7Sign)} રાશિમાં)` : `in ${lex(kundaliResult.chartComparison.girl7Sign)}`}</b>
        </div>
      </div>
    </div>

    <!-- Print option button inside HTML -->
    <div class="banner-print-btn">
      <button onclick="window.print()" class="btn-action">${lex("printBtn")}</button>
    </div>

    <div class="disclaimer">
      ${lex("disclaimer")}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([reportHTML], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    
    let filenamePrefix = "Kundali_Matching_Report";
    if (curLang === "hi") filenamePrefix = "कुंडली_मिलान_रिपोर्ट";
    else if (curLang === "bn") filenamePrefix = "কুন্ডলী_মিলন_প্রতিবেদন";
    else if (curLang === "mr") filenamePrefix = "कुंडली_मिलन_अहवाल";
    else if (curLang === "gu") filenamePrefix = "કુંડળી_મિલન_અહેવાલ";
    
    const partnerANameClean = kBoyName.trim().replace(/\s+/g, "_");
    const partnerBNameClean = kGirlName.trim().replace(/\s+/g, "_");
    
    link.download = `${filenamePrefix}_${partnerANameClean}_${curLang === "hi" ? "और" : curLang === "bn" ? "এবং" : curLang === "mr" ? "आणि" : curLang === "gu" ? "અને" : "and"}_${partnerBNameClean}.html`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Illuminate segments sequentially in Ashtakoot Wheel
  useEffect(() => {
    if (unlitMandalaSegments.length > 0) {
      const timer = setTimeout(() => {
        setUnlitMandalaSegments(prev => prev.slice(1));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [unlitMandalaSegments]);

  return (
    <section id="compatibility" className="relative py-28 md:py-36 px-4 bg-transparent border-t border-amber-500/5 overflow-hidden">
      
      {/* Dynamic Animated Cosmic Background Image */}
      <CompatibilityVideoBackground />
      
      {/* Subtle particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Module Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-400/20 rounded-full text-xs text-amber-300 font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <Heart className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            {t("tabs.synergy") || "Cosmic Connections"}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wider font-bold shadow-glow-title uppercase">
            {t("synergy.title") || "COSMIC CONNECTIONS"}
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            {t("synergy.sub") || "Align relationship signatures using three complementary layers: Numerological compatibility, Marriage timing transits, and traditional Ashtakoot Kundali Milan."}
          </p>
        </div>

        {/* THREE UNIFIED DECK TABS */}
        <div className="flex justify-center border-b border-zinc-800 pb-[1px] mb-12 max-w-2xl mx-auto">
          {(["compatibility", "marriage", "kundali"] as ActiveTab[]).map((tab) => {
            const isActive = activeTab === tab;
            let title = t("synergy.tabComp") || "Compatibility";
            if (tab === "marriage") title = t("synergy.tabMarriage") || "Marriage Timing";
            if (tab === "kundali") title = t("synergy.tabKundali") || "Kundali Matching";

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  flex-1 py-4 text-xs font-mono uppercase tracking-widest font-semibold transition-all cursor-pointer relative text-center
                  ${isActive ? "text-amber-400 font-bold" : "text-zinc-500 hover:text-zinc-300"}
                `}
              >
                {title}
                {isActive && (
                  <motion.div 
                    layoutId="activeSubTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB WORKSPACES */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1 — COMPATIBILITY */}
          {activeTab === "compatibility" && (
            <motion.div
              key="tab-compatibility"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative mb-12">
                
                {/* Person A Panel */}
                <div className="bg-[#111015]/85 border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-mono tracking-widest text-amber-500/60 uppercase block mb-3">{t("synergy.pAName") || "Partner A Name"}</span>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">{t("calc.nameLabel") || "Full Name"}</label>
                      <input 
                        type="text" 
                        value={personAName}
                        onChange={(e) => { setPersonAName(e.target.value); setCompResult(null); setCompAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-sm"
                        placeholder={t("calc.placeholderName") || "Enter full birth name"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">{t("calc.dobLabel") || "Birthdate"}</label>
                      <input 
                        type="date" 
                        value={personADob}
                        onChange={(e) => { setPersonADob(e.target.value); setCompResult(null); setCompAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Animated Golden Thread (pulses when form is ready) */}
                <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-0.5 z-20 pointer-events-none">
                  <div className={`w-full h-full rounded ${isCompFormReady ? "bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse duration-1000" : "bg-zinc-800"}`} />
                </div>

                {/* Person B Panel */}
                <div className="bg-[#111015]/85 border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-mono tracking-widest text-[#c5a880]/60 uppercase block mb-3">{t("synergy.pBName") || "Partner B Name"}</span>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">{t("calc.nameLabel") || "Full Name"}</label>
                      <input 
                        type="text" 
                        value={personBName}
                        onChange={(e) => { setPersonBName(e.target.value); setCompResult(null); setCompAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-sm"
                        placeholder={t("calc.placeholderName") || "Enter full birth name"}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">{t("calc.dobLabel") || "Birthdate"}</label>
                      <input 
                        type="date" 
                        value={personBDob}
                        onChange={(e) => { setPersonBDob(e.target.value); setCompResult(null); setCompAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION TRIGGER BUTTON */}
              <div className="text-center mb-12">
                <button
                  onClick={calculateCompatibility}
                  disabled={!isCompFormReady || compAnim === "checking"}
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 disabled:opacity-40 text-white font-mono uppercase tracking-widest text-xs font-bold rounded-full transition-all cursor-pointer shadow-[0_0_20px_rgba(197,168,128,0.2)] flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${compAnim === "checking" ? "animate-spin" : ""}`} />
                  {compAnim === "checking" ? (t("synergy.computingMatrix") || "Fusing Cosmic Streams...") : (t("synergy.computeBtn") || "Reveal Connection")}
                </button>
              </div>

              {/* ORB MERGING PANEL */}
              {compAnim !== "idle" && (
                <div className="bg-[#111015]/40 border border-zinc-800/50 p-8 rounded-2xl max-w-2xl mx-auto relative overflow-hidden mb-12">
                  <h4 className="text-xs font-mono text-zinc-500 text-center uppercase tracking-widest mb-10">{t("synergy.computingMatrix") || "Syncing Resonance Matrix"}</h4>
                  
                  <div className="relative h-44 flex items-center justify-center overflow-hidden w-full max-w-md mx-auto">
                    
                    {/* Background grid */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
                    
                    {/* Alpha Orb */}
                    {compAnim === "checking" && (
                      <motion.div 
                        initial={{ x: -140, scale: 0.8 }}
                        animate={{ x: -20, scale: [0.8, 1.0, 0.9], opacity: [0.7, 1.0, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute w-12 h-12 rounded-full border border-orange-500/40"
                        style={{
                          background: "radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(17,16,21,0.9) 100%)",
                          boxShadow: "0 0 20px rgba(249, 115, 22, 0.4)"
                        }}
                      />
                    )}

                    {/* Beta Orb */}
                    {compAnim === "checking" && (
                      <motion.div 
                        initial={{ x: 140, scale: 0.8 }}
                        animate={{ x: 20, scale: [0.8, 1.0, 0.9], opacity: [0.7, 1.0, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="absolute w-12 h-12 rounded-full border border-indigo-500/40"
                        style={{
                          background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(17,16,21,0.9) 100%)",
                          boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)"
                        }}
                      />
                    )}

                    {/* Unified Super Orb */}
                    {compAnim === "finished" && compResult && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: compResult.overallScore >= 75 ? [1, 1.08, 1] : [1, 0.98, 1], 
                          opacity: 1 
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute w-32 h-32 rounded-full border border-amber-400/50 flex flex-col items-center justify-center text-center p-2"
                        style={{
                          background: "radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(9,8,12,0.9) 100%)",
                          boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)"
                        }}
                      >
                        <span className="text-[9px] font-mono uppercase text-amber-400/80 tracking-widest font-bold">Resonance</span>
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-4xl font-serif font-bold text-white my-1"
                        >
                          {compResult.overallScore}%
                        </motion.span>
                        <span className="text-[8px] font-mono uppercase text-zinc-400">{t("synergy.scoreLabel") || "Match score"}</span>
                      </motion.div>
                    )}

                  </div>

                  {/* COMPATIBILITY SCORE BLOCKS */}
                  {compAnim === "finished" && compResult && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-8 pt-6 border-t border-zinc-800/60"
                    >
                      <div className="text-center mb-6">
                        <span className={`inline-flex px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold border ${compResult.badgeColor}`}>
                          {compResult.tier}
                        </span>
                      </div>

                      {/* Audio voice read-button */}
                      <div className="flex flex-col items-center justify-center gap-1.5 mb-6">
                        {speechState === "playing" && activeReadingId === "compatibility-result" ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={stopSpeaking}
                              className="px-4 py-1.5 rounded-full border border-rose-500/30 bg-[#2a161b]/30 text-rose-300 hover:text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 hover:bg-rose-500/15 transition-all shadow-sm cursor-pointer"
                              title="Stop speaking"
                            >
                              <Square className="w-3.5 h-3.5 fill-rose-500/10 text-rose-400" />
                              STOP READING
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSpeakCompatibility}
                            className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-[#162a22]/30 text-emerald-300 hover:text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 hover:bg-emerald-500/15 transition-all shadow-sm cursor-pointer"
                            title="Listen to Compatibility Resonance"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            LISTEN TO VOICE HEALING READ
                          </button>
                        )}
                      </div>

                      <p className="text-zinc-300 text-sm text-center max-w-xl mx-auto leading-relaxed mb-8">
                        {compResult.summary}
                      </p>

                      <div className="grid sm:grid-cols-4 gap-4 text-center max-w-2xl mx-auto mb-8">
                        {/*lp ring*/}
                        <div className="bg-[#16151b] p-3 rounded-xl border border-zinc-800">
                          <span className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">{t("calc.lifePathTitle") || "Life Path"}</span>
                          <span className="text-base text-zinc-200 font-mono font-bold">{compResult.lpA} ⚭ {compResult.lpB}</span>
                          <span className="block text-xs font-mono text-amber-400/80 mt-1">{compResult.scoreLp}%</span>
                        </div>
                        {/*mulank ring*/}
                        <div className="bg-[#16151b] p-3 rounded-xl border border-zinc-800">
                          <span className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">{t("calc.mulankName") || "Mulank temperament"}</span>
                          <span className="text-base text-zinc-200 font-mono font-bold">{compResult.mulankA} ⚭ {compResult.mulankB}</span>
                          <span className="block text-xs font-mono text-amber-400/80 mt-1">{compResult.scoreMulank}%</span>
                        </div>
                        {/*soul urge*/}
                        <div className="bg-[#16151b] p-3 rounded-xl border border-zinc-800">
                          <span className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">{t("calc.soulUrgeTitle") || "Soul Urge desires"}</span>
                          <span className="text-base text-zinc-200 font-mono font-bold">{compResult.suA} ⚭ {compResult.suB}</span>
                          <span className="block text-xs font-mono text-amber-400/80 mt-1">{compResult.scoreSoul}%</span>
                        </div>
                        {/*expression*/}
                        <div className="bg-[#16151b] p-3 rounded-xl border border-zinc-800">
                          <span className="block text-[9px] font-mono uppercase text-zinc-500 mb-1">{t("calc.expressionTitle") || "Expression"}</span>
                          <span className="text-base text-zinc-200 font-mono font-bold">{compResult.exA} ⚭ {compResult.exB}</span>
                          <span className="block text-xs font-mono text-amber-400/80 mt-1">{compResult.scoreExpr}%</span>
                        </div>
                      </div>

                      {/* Detailed Strengths and Growth sections */}
                      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800/30">
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-4.5 rounded-xl">
                          <h5 className="text-xs font-mono uppercase tracking-widest text-[#10b981] font-bold mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {language === "hi" ? "संश्लेषित शक्ति" : language === "bn" ? "পারস্পরিক সম্মতিমূলক অনুঘটক" : language === "mr" ? "एकत्रित फायदे आणि सामर्थ्य" : language === "gu" ? "પરસ્પર સદ્ધર પાસાઓ" : "Core Synthesised Strength"}
                          </h5>
                          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{compResult.strength}</p>
                        </div>
                        <div className="bg-rose-500/5 border border-rose-500/15 p-4.5 rounded-xl">
                          <h5 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-rose-300 font-bold mb-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                            {language === "hi" ? "पहचाना गया होमवर्क" : language === "bn" ? "কার্মিক উন্নতির শিক্ষা" : language === "mr" ? "सुधारणात्मक सल्ला" : language === "gu" ? "વિકાસલક્ષી સલાહ" : "Identified Growth Homework"}
                          </h5>
                          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{compResult.growth}</p>
                        </div>
                      </div>

                    </motion.div>
                  )}

                </div>
              )}

            </motion.div>
          )}

          {/* TAB 2 — MARRIAGE TIMING */}
          {activeTab === "marriage" && (
            <motion.div
              key="tab-marriage"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-[#111015]/85 border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden backdrop-blur-md mb-8">
                <span className="text-[10px] font-mono tracking-widest text-amber-500/60 uppercase block mb-3">Calculate Personal Commitments Windows</span>

                {/* Segmented Mode Selector */}
                <div className="flex border border-zinc-800 bg-[#16151b] rounded-lg p-1.5 mb-6">
                  <button
                    onClick={() => { setMarriageAnalysisType("joint"); setMarriageResult(null); setMarriageAnim("idle"); }}
                    className={`flex-1 py-2 rounded text-xs font-mono uppercase transition-all font-bold tracking-wider ${marriageAnalysisType === "joint" ? "bg-amber-600 text-white shadow-md" : "text-zinc-400 hover:text-white"}`}
                  >
                    💖 Joint Analysis (Both)
                  </button>
                  <button
                    onClick={() => { setMarriageAnalysisType("partnerA"); setMarriageResult(null); setMarriageAnim("idle"); }}
                    className={`flex-1 py-1.5 rounded text-xs font-mono uppercase transition-all font-bold tracking-wider ${marriageAnalysisType === "partnerA" ? "bg-amber-600 text-white shadow-md" : "text-zinc-400 hover:text-white"}`}
                  >
                    👤 {marriageNameA.split(" ")[0]} Only
                  </button>
                  <button
                    onClick={() => { setMarriageAnalysisType("partnerB"); setMarriageResult(null); setMarriageAnim("idle"); }}
                    className={`flex-1 py-1.5 rounded text-xs font-mono uppercase transition-all font-bold tracking-wider ${marriageAnalysisType === "partnerB" ? "bg-amber-600 text-white shadow-md" : "text-zinc-400 hover:text-white"}`}
                  >
                    👤 {marriageNameB.split(" ")[0]} Only
                  </button>
                </div>

                {/* Dynamic Alignment Grid for names & DOBs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {(marriageAnalysisType === "joint" || marriageAnalysisType === "partnerA") && (
                    <div className="bg-[#15141b] border border-zinc-800/60 rounded-xl p-4 space-y-3">
                      <span className="text-[10px] font-mono tracking-widest text-amber-500/70 uppercase block font-bold">Partner A Details</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Name</label>
                          <input 
                            type="text" 
                            value={marriageNameA}
                            onChange={(e) => { setMarriageNameA(e.target.value); setMarriageResult(null); setMarriageAnim("idle"); }}
                            className="w-full bg-[#1b1a22] border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Birth Date</label>
                          <input 
                            type="date" 
                            value={marriageDob}
                            onChange={(e) => { setMarriageDob(e.target.value); setMarriageResult(null); setMarriageAnim("idle"); }}
                            className="w-full bg-[#1b1a22] border border-zinc-800 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(marriageAnalysisType === "joint" || marriageAnalysisType === "partnerB") && (
                    <div className="bg-[#15141b] border border-zinc-800/60 rounded-xl p-4 space-y-3">
                      <span className="text-[10px] font-mono tracking-widest text-purple-400/70 uppercase block font-bold">Partner B Details</span>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Name</label>
                          <input 
                            type="text" 
                            value={marriageNameB}
                            onChange={(e) => { setMarriageNameB(e.target.value); setMarriageResult(null); setMarriageAnim("idle"); }}
                            className="w-full bg-[#1b1a22] border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">Birth Date</label>
                          <input 
                            type="date" 
                            value={marriageDobB}
                            onChange={(e) => { setMarriageDobB(e.target.value); setMarriageResult(null); setMarriageAnim("idle"); }}
                            className="w-full bg-[#1b1a22] border border-zinc-800 rounded-lg px-2 py-1.5 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={computeMarriageTiming}
                    disabled={marriageAnim === "checking" || (marriageAnalysisType === "joint" ? (!marriageDob || !marriageDobB) : (marriageAnalysisType === "partnerA" ? !marriageDob : !marriageDobB))}
                    className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 text-white font-mono uppercase tracking-widest text-xs font-bold rounded-lg transition-all cursor-pointer shadow-[0_0_15px_rgba(197,168,128,0.2)] flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${marriageAnim === "checking" ? "animate-spin" : ""}`} />
                    {marriageAnim === "checking" ? "COMPUTING MATRIX..." : "Reveal Favorable Windows"}
                  </button>
                </div>
              </div>

              {/* TRANSITS TIMELINE NODES */}
              {marriageAnim !== "idle" && (
                <div className="bg-[#111015]/40 border border-zinc-800/50 p-6 rounded-2xl relative overflow-hidden">
                  
                  {marriageAnim === "checking" ? (
                    <div className="text-center py-10">
                      <span className="text-xs font-mono text-amber-400 tracking-widest block uppercase animate-pulse">Consulting real astronomical ephemeris positions...</span>
                    </div>
                  ) : (
                    marriageResult && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                      >
                        {/* Real Venus and Jupiter Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-4 border-b border-zinc-800/60 pb-6">
                          <div className="flex items-center gap-2 bg-[#16151b]/80 border border-zinc-800 px-4 py-2 rounded-full shadow-inner">
                            <span className="text-xs text-rose-300 font-mono font-extrabold flex items-center gap-1">♀ Venus</span>
                            <span className="text-xs text-zinc-300 font-mono">{marriageResult.venus?.sign || "Taurus"}</span>
                            {marriageResult.venus?.retrograde && (
                              <span className="px-1.5 py-0.5 count-badge rounded text-[9px] font-mono bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold uppercase tracking-widest">R</span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 bg-[#16151b]/80 border border-zinc-800 px-4 py-2 rounded-full shadow-inner">
                            <span className="text-xs text-amber-300 font-mono font-extrabold flex items-center gap-1">♃ Jupiter</span>
                            <span className="text-xs text-zinc-300 font-mono">{marriageResult.jupiter?.sign || "Gemini"}</span>
                            {marriageResult.jupiter?.retrograde && (
                              <span className="px-1.5 py-0.5 count-badge rounded text-[9px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-widest">R</span>
                            )}
                          </div>
                        </div>

                        {/* Favorable timeline of 5 years */}
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-6 text-center">Inceptive Marriage Timeline Forecast (5 Years)</span>
                          
                          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                            {/* Horizontal Line connector */}
                            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-zinc-800 -z-10" />

                            {marriageResult.timeline.map((val: any) => {
                              const isHigh = val.favorability === "High";
                              const isMod = val.favorability === "Moderate";

                              return (
                                <div key={val.year} className="relative flex flex-col items-center flex-1 w-full text-center">
                                  
                                  {/* Pulsing glow ring around favorable node */}
                                  {isHigh && (
                                    <div className="absolute top-1.5 w-11 h-11 border-2 border-amber-400/40 rounded-full animate-ping pointer-events-none" style={{ animationDuration: "1.8s" }} />
                                  )}

                                  <div 
                                    className={`
                                      w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-black border uppercase relative z-10
                                      ${isHigh ? "bg-gradient-to-br from-amber-500 to-amber-700 border-yellow-400 text-zinc-950 shadow-[0_0_20px_rgba(251,191,36,0.6)]" : ""}
                                      ${isMod ? "bg-[#1d1b24] border-amber-500/40 text-amber-300 shadow-md" : ""}
                                      ${!isHigh && !isMod ? "bg-[#111015] border-zinc-800 text-zinc-500 cursor-help" : ""}
                                    `}
                                    title={`Personal Year: ${val.personalYear}`}
                                  >
                                    {val.personalYear}
                                  </div>

                                  <div className="mt-3.5 space-y-1">
                                    <span className="block font-serif font-black text-white text-base tracking-wider">{val.year} Year</span>
                                    <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-mono tracking-wider uppercase ${isHigh ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : isMod ? "bg-zinc-800 text-zinc-400" : "bg-zinc-900/50 text-zinc-600"}`}>
                                      {val.favorability} Favor
                                    </span>
                                    <p className="text-[10.5px] leading-relaxed text-zinc-400 max-w-[150px] mx-auto pt-1 font-sans font-light">
                                      {val.reasoning}
                                    </p>
                                  </div>

                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Favorable Year Option / Recommended Marriage Year */}
                        {marriageResult.predictedYear && (
                          <div className="bg-gradient-to-br from-[#16131c] via-[#110e15] to-[#1a1312] border border-amber-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.06)] space-y-6">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-800/60 relative z-10">
                              <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2.5">
                                  <span className="p-1 px-2.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-mono tracking-widest uppercase font-black flex items-center gap-1">
                                    🏆 PRIMARY RECOMMENDATION WINDOW
                                  </span>
                                  <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  
                                  {speechState === "playing" && activeReadingId === "marriage-result" ? (
                                    <button
                                      type="button"
                                      onClick={stopSpeaking}
                                      className="px-2.5 py-1 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:text-white text-[9px] font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                                      title="Stop reading"
                                    >
                                      <Square className="w-2.5 h-2.5 fill-rose-500/10 text-rose-400" />
                                      STOP READING
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={handleSpeakMarriageTiming}
                                      className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:text-white text-[9px] font-mono tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                                      title="Listen to marriage timeline"
                                    >
                                      <Volume2 className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                                      LISTEN
                                    </button>
                                  )}
                                </div>
                                <h3 className="text-xl md:text-2xl font-serif font-black text-rose-50/95 tracking-wide">
                                  Favorable Marriage Year: <span className="text-amber-400 font-black decoration-amber-500/30 decoration-2 underline-offset-4">{marriageResult.predictedYear}</span>
                                </h3>
                                <p className="text-xs text-zinc-400 max-w-xl font-sans font-light leading-relaxed">
                                  This year represents your peaked relational readiness, synchronized to your Birth Mulank, Personal Year vibrations, and Geocentric transit waves.
                                </p>
                              </div>
                              
                              <div className="bg-[#15141d] border border-amber-500/20 px-5 py-4 rounded-xl text-center md:min-w-[150px] flex flex-col justify-center shadow-lg">
                                <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">Favorability</span>
                                <span className="text-xl font-serif font-black text-amber-300 mt-1">{marriageResult.scoreEarned} / 10</span>
                                <span className="text-[10px] font-mono text-amber-400/80 font-bold uppercase mt-0.5 tracking-wider">{marriageResult.predictedYearFavorability} Focus</span>
                              </div>
                            </div>

                            {/* Detailed Causes with Formatting */}
                            <div className="space-y-4">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-[#fbbf24] font-black block mb-1">
                                Detailed Cosmological & Karmic Causes:
                              </span>
                              <div className="grid grid-cols-1 gap-4">
                                {renderFormattedCauseText(marriageResult.predictedYearDetailedCause)}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Synthesis bottom panel */}
                        <div className="bg-[#16151b] border border-zinc-800 p-5 rounded-xl">
                          <h4 className="text-xs font-mono uppercase tracking-widest text-[#fbbf24] font-bold mb-2.5 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-amber-400" />
                            Ephemeris Transit Synthesis
                          </h4>
                          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{marriageResult.synthesisText}</p>
                        </div>

                        {/* Absolute warning Disclaimer */}
                        <div className="border-t border-zinc-800/50 pt-5 text-center px-4">
                          <p className="text-[9.5px] text-zinc-500 leading-relaxed font-mono max-w-2xl mx-auto uppercase">
                            <span className="text-amber-500/70 font-bold">Disclaimer:</span> Numerological and planetary transits represent favorable energetic windows for alignment and choice, not a deterministic guarantee of events or timelines. Personal free will is the ultimate force of destiny.
                          </p>
                        </div>

                      </motion.div>
                    )
                  )}

                </div>
              )}

            </motion.div>
          )}

          {/* TAB 3 — KUNDALI MATCHING */}
          {activeTab === "kundali" && (
            <motion.div
              key="tab-kundali"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* INPUT FIELDS ROW */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative mb-12">
                
                {/* Boy Form */}
                <div className="bg-[#111015]/85 border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-mono tracking-widest text-amber-500/60 uppercase block mb-3">Partner A (Boy)</span>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={kBoyName}
                        onChange={(e) => { setKBoyName(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-sm"
                        placeholder="Boy's Name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Birth Date</label>
                        <input 
                          type="date" 
                          value={kBoyDob}
                          onChange={(e) => { setKBoyDob(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#c5a880]/70 mb-1 flex items-center gap-1">Time <span className="text-[9px] font-light italic text-zinc-500 lowercase">(optional)</span></label>
                        <input 
                          type="time" 
                          value={kBoyTime}
                          onChange={(e) => { setKBoyTime(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Birth Place</span>
                        <span className="text-[10px] text-zinc-500 italic lowercase font-light">coordinates required for charts</span>
                      </label>
                      <input 
                        type="text" 
                        value={kBoyPlace}
                        onChange={(e) => { setKBoyPlace(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-sm"
                        placeholder="Boy's Birth City"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pb-1">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-0.5">Latitude (N)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={kBoyLat}
                          onChange={(e) => { setKBoyLat(parseFloat(e.target.value) || 0); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-0.5">Longitude (E)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={kBoyLng}
                          onChange={(e) => { setKBoyLng(parseFloat(e.target.value) || 0); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Girl Form */}
                <div className="bg-[#111015]/85 border border-zinc-800 p-6 md:p-8 rounded-2xl relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <span className="text-[10px] font-mono tracking-widest text-amber-500/60 uppercase block mb-3">Partner B (Girl)</span>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={kGirlName}
                        onChange={(e) => { setKGirlName(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-sm"
                        placeholder="Girl's Name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Birth Date</label>
                        <input 
                          type="date" 
                          value={kGirlDob}
                          onChange={(e) => { setKGirlDob(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono uppercase text-[#c5a880]/70 mb-1 flex items-center gap-1 flex-wrap">Time <span className="text-[9px] font-light italic text-zinc-500 lowercase">(opt)</span></label>
                        <input 
                          type="time" 
                          value={kGirlTime}
                          onChange={(e) => { setKGirlTime(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Birth Place</span>
                        <span className="text-[10px] text-zinc-500 italic lowercase font-light">coordinates required for charts</span>
                      </label>
                      <input 
                        type="text" 
                        value={kGirlPlace}
                        onChange={(e) => { setKGirlPlace(e.target.value); setKundaliResult(null); setKundaliAnim("idle"); }}
                        className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500/50 transition-all font-sans text-sm"
                        placeholder="Girl's Birth City"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pb-1">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-0.5">Latitude (N)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={kGirlLat}
                          onChange={(e) => { setKGirlLat(parseFloat(e.target.value) || 0); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-0.5">Longitude (E)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={kGirlLng}
                          onChange={(e) => { setKGirlLng(parseFloat(e.target.value) || 0); setKundaliResult(null); setKundaliAnim("idle"); }}
                          className="w-full bg-[#16151b] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 focus:outline-none focus:border-amber-500/50 transition-all font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* CHECK BUTTON */}
              <div className="text-center mb-12">
                <button
                  onClick={calculateKundaliMatching}
                  disabled={!kBoyName.trim() || !kGirlName.trim() || !kBoyDob || !kGirlDob || kundaliAnim === "checking"}
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 disabled:opacity-40 text-white font-mono uppercase tracking-widest text-xs font-bold rounded-full transition-all cursor-pointer shadow-[0_0_20px_rgba(197,168,128,0.2)] flex items-center justify-center gap-2 mx-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${kundaliAnim === "checking" ? "animate-spin" : ""}`} />
                  {kundaliAnim === "checking" ? "ALIGNING CONSTELLATIONS..." : "Check Kundali Compatibility"}
                </button>
              </div>

              {/* KUNDALI GUNA MILAN DISPLAY PANEL */}
              {kundaliAnim !== "idle" && (
                <div className="bg-[#111015]/50 border border-zinc-800 p-6 md:p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                  
                  {kundaliAnim === "checking" ? (
                    <div className="text-center py-16 flex flex-col items-center justify-center">
                      <Swastika size={48} glow={true} animated={true} className="mb-4" />
                      <span className="text-xs font-mono text-amber-400 tracking-widest uppercase animate-pulse">Running Guna Milan engine based on Moon position Nakshatras...</span>
                    </div>
                  ) : (
                    kundaliResult && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                      >
                        {/* Audio voice read-button and Download Guna Milan Report */}
                        <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                          {speechState === "playing" && activeReadingId === "kundali-result" ? (
                            <button
                              type="button"
                              onClick={stopSpeaking}
                              className="px-4 py-1.5 rounded-full border border-rose-500/30 bg-[#2a161b]/30 text-rose-300 hover:text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 hover:bg-rose-500/15 transition-all shadow-sm cursor-pointer"
                              title="Stop speaking"
                            >
                              <Square className="w-3.5 h-3.5 fill-rose-500/10 text-rose-400" />
                              STOP READING
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSpeakKundaliMatching}
                              className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-[#162a22]/30 text-emerald-300 hover:text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 hover:bg-emerald-500/15 transition-all shadow-sm cursor-pointer"
                              title="Listen to Kundali Guna match"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                              LISTEN TO GUNA MILAN READ
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={handleDownloadReport}
                            className="px-4 py-1.5 rounded-full border border-amber-500/30 bg-[#2a2416]/30 text-amber-300 hover:text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 hover:bg-amber-500/15 transition-all shadow-sm cursor-pointer"
                            title="Download comprehensive suitability report"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            DOWNLOAD REPORT
                          </button>
                        </div>
                        {/* Precision notice of exact time */}
                        {kundaliResult.isTimeMissing && (
                          <div className="bg-amber-500/5 border border-amber-500/20 px-4 py-2.5 rounded-lg text-[11px] font-mono text-amber-300 flex items-center gap-2 max-w-2xl mx-auto text-center justify-center">
                            <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                            Nakshatra calculated using birth date only — for higher precision, exact birth time is recommended.
                          </div>
                        )}

                        {/* Star Cluster indicators above cards */}
                        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                          
                          {/* Boy Card */}
                          <div className="bg-[#16151b] border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden text-center shadow-inner">
                            <div className="absolute top-1 right-1 pointer-events-none opacity-40">
                              <Star className="w-8 h-8 text-amber-500/20 animate-spin" style={{ animationDuration: "14s" }} />
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Nakshatra Devata</span>
                            <h4 className="text-lg font-serif font-black text-amber-200 tracking-wider uppercase font-bold">{kundaliResult.boyNak?.name}</h4>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase mt-1 tracking-widest">
                              Gana: <span className="text-zinc-200 font-bold">{kundaliResult.boyNak?.gana}</span> | Rashi: <span className="text-zinc-200 font-bold">{kundaliResult.boyRashi}</span>
                            </p>
                          </div>

                          {/* Girl Card */}
                          <div className="bg-[#16151b] border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden text-center shadow-inner">
                            <div className="absolute top-1 right-1 pointer-events-none opacity-40">
                              <Star className="w-8 h-8 text-indigo-500/20 animate-spin" style={{ animationDuration: "14s" }} />
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Nakshatra Devata</span>
                            <h4 className="text-lg font-serif font-black text-indigo-200 tracking-wider uppercase font-bold">{kundaliResult.girlNak?.name}</h4>
                            <p className="text-[10px] font-mono text-zinc-400 uppercase mt-1 tracking-widest">
                              Gana: <span className="text-zinc-200 font-bold">{kundaliResult.girlNak?.gana}</span> | Rashi: <span className="text-zinc-200 font-bold">{kundaliResult.girlRashi}</span>
                            </p>
                          </div>

                        </div>

                        {/* Mandala Koota Wheel Row */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-10 bg-[#09080c]/50 p-6 md:p-8 rounded-2xl border border-zinc-800/60">
                          
                          {/* Circular Ashtakoot circle matching segments */}
                          <div className="relative w-52 h-52 flex items-center justify-center">
                            
                            {/* Outer Circle ring */}
                            <div className="absolute inset-0 rounded-full border border-dashed border-zinc-800 animate-spin" style={{ animationDuration: "35s" }} />
                            <div className="absolute inset-4 rounded-full border border-zinc-700/30" />

                            {/* Mandala scoring items arcs segments */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                              {[1, 2, 3, 4, 5, 6, 7, 8].map((seg, idx) => {
                                const angleStep = 360 / 8;
                                const startAngle = idx * angleStep;
                                const endAngle = (idx + 1) * angleStep;
                                
                                const isIlluminated = !unlitMandalaSegments.includes(seg);
                                const radius = 40;
                                const x1 = 50 + radius * Math.cos((startAngle * Math.PI) / 180);
                                const y1 = 50 + radius * Math.sin((startAngle * Math.PI) / 180);
                                const x2 = 50 + radius * Math.cos((endAngle * Math.PI) / 180);
                                const y2 = 50 + radius * Math.sin((endAngle * Math.PI) / 180);

                                return (
                                  <path
                                    key={seg}
                                    d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                                    fill={isIlluminated ? "rgba(245, 158, 11, 0.08)" : "transparent"}
                                    stroke={isIlluminated ? "#f59e0b" : "rgba(255,255,255,0.06)"}
                                    strokeWidth="0.5"
                                    className="transition-all duration-300"
                                  />
                                );
                              })}
                            </svg>

                            {/* Center of wheel: total score */}
                            <div className={`absolute w-36 h-36 rounded-full bg-[#111015] border border-zinc-850 flex flex-col items-center justify-center text-center shadow-2xl ${kundaliResult.glowColor}`}>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Koota Score</span>
                              <span className="text-4xl font-serif text-white font-extrabold tracking-tight mt-1 my-0.5">
                                {kundaliResult.totalGuna}/36
                              </span>
                              <span className="text-[8px] font-mono uppercase font-bold tracking-wider">{kundaliResult.classification}</span>
                            </div>

                          </div>

                          {/* 8 Labeled bars score items */}
                          <div className="flex-grow w-full space-y-4">
                            {[
                              { label: "1. Varna (Spiritual Alignment)", score: kundaliResult.varnaScore, max: 1 },
                              { label: "2. Vashya (Mutual Fascination)", score: kundaliResult.vashyaScore, max: 2 },
                              { label: "3. Tara (Birth Star compatibility)", score: kundaliResult.taraScore, max: 3 },
                              { label: "4. Yoni (Physical/Nature pairing)", score: kundaliResult.yoniScore, max: 4 },
                              { label: "5. Graha Maitri (Mental rulers compatibility)", score: kundaliResult.grahaScore, max: 5 },
                              { label: "6. Gana (Temperامent Match)", score: kundaliResult.ganaScore, max: 6 },
                              { label: "7. Bhakoot (Auspicious Moon Signs)", score: kundaliResult.bhakootScore, max: 7 },
                              { label: "8. Nadi (Vitality / Hereditary pairing)", score: kundaliResult.nadiScore, max: 8 }
                            ].map((g, idx) => {
                              const percent = (g.score / g.max) * 100;
                              const isUnlit = unlitMandalaSegments.includes(idx + 1);

                              return (
                                <div key={g.label} className="space-y-1">
                                  <div className="flex justify-between items-center text-xs font-mono">
                                    <span className="text-zinc-400 font-medium">{g.label}</span>
                                    <span className="text-zinc-200 font-bold">{g.score} / {g.max}</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: isUnlit ? 0 : `${percent}%` }}
                                      transition={{ duration: 0.6 }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                        </div>

                        {/* Manglik and Doshas check panel row */}
                        <div className="grid md:grid-cols-2 gap-6 pt-4">
                          
                          {/* Dosha warning badges column */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Astrological Compatibility Doshas</span>
                            
                            {/* Nadi Dosha warning */}
                            {kundaliResult.nadiDosha ? (
                              <div className="bg-amber-500/5 border border-amber-500/20 px-4 py-3.5 rounded-xl flex items-start gap-2.5">
                                <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
                                <div>
                                  <span className="block text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">Nadi Dosha Flagged</span>
                                  <p className="text-[11px] text-zinc-400 font-sans mt-1 leading-relaxed">Both partners share the identical Nadi. Traditionally, this advises conscious meditation, dynamic health-monitoring, and active lifestyle alignments.</p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-emerald-500/5 border border-emerald-500/10 px-4 py-3.5 rounded-xl flex items-center gap-2.5">
                                <Award className="w-5 h-5 text-emerald-400" />
                                <span className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-widest">Nadi compatibility is optimal</span>
                              </div>
                            )}

                            {/* Bhakoot Dosha warning */}
                            {kundaliResult.bhakootDosha && (
                              <div className="bg-amber-500/5 border border-amber-500/20 px-4 py-3.5 rounded-xl flex items-start gap-2.5 mt-3">
                                <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
                                <div>
                                  <span className="block text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">Bhakoot Dosha Detected</span>
                                  <p className="text-[11px] text-zinc-400 font-sans mt-1 leading-relaxed">Your Moon signs are positioned relative to each other in critical 2-12, 6-8, or 5-9 distances, showing different financial paradigms or relative emotional processing.</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Mangal (Mars) Dosha check column */}
                          <div className="space-y-3 bg-[#16151b] border border-zinc-800 p-5 rounded-xl shadow-inner">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">Mangal Dosha Status (♂ Chandra Kundali)</span>
                            
                            <div className="flex items-center justify-around gap-4 py-4 border-b border-zinc-800/60">
                              
                              <div className="text-center">
                                <span className="block text-[9px] font-mono uppercase text-zinc-500">{kBoyName.split(" ")[0]} ♂</span>
                                <span className={`inline-block mt-1 font-mono text-xs uppercase font-extrabold px-3 py-1 rounded-full ${kundaliResult.bIsManglik ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-zinc-800 text-zinc-400"}`}>
                                  {kundaliResult.bIsManglik ? "Manglik" : "Non-Manglik"}
                                </span>
                              </div>

                              {/* Connections flow */}
                              <div className="flex flex-col items-center">
                                {kundaliResult.manglikStatus === "Cancelled" ? (
                                  <motion.div 
                                    animate={{ opacity: [0.6, 1.0, 0.6] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="px-2.5 py-1 text-[9px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded uppercase tracking-widest text-center"
                                  >
                                    Cancelled
                                  </motion.div>
                                ) : (
                                  <div className="h-0.5 w-10 bg-zinc-800" />
                                )}
                              </div>

                              <div className="text-center">
                                <span className="block text-[9px] font-mono uppercase text-zinc-500">{kGirlName.split(" ")[0]} ♂</span>
                                <span className={`inline-block mt-1 font-mono text-xs uppercase font-extrabold px-3 py-1 rounded-full ${kundaliResult.gIsManglik ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-zinc-800 text-zinc-400"}`}>
                                  {kundaliResult.gIsManglik ? "Manglik" : "Non-Manglik"}
                                </span>
                              </div>

                            </div>

                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-1">
                              {kundaliResult.manglikStatus === "Cancelled" 
                                ? "Because both partners share the Mars placement (Manglik core), their magnetic energies align symmetrically, cancelling the traditional fiery friction." 
                                : kundaliResult.manglikStatus === "Active Consideration"
                                  ? "One partner carries the Mars placement (Manglik), while the other does not. Maintain open, communicative transparency to process fiery responses calmly."
                                  : "Neither partner carries Mangal Dosha relative to Chandra, indicating a stable, supportive fiery flow."}
                            </p>
                          </div>

                        </div>

                        {/* Vedic Birth Charts & Navamsa Divisional Charts Comparison */}
                        <div id="vedic-charts-section" className="mt-10 border-t border-zinc-805 pt-8">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                            <div>
                              <h3 className="text-xl font-serif text-white tracking-wider font-extrabold flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-400" />
                                SIDEREAL BIRTH CHARTS & HARMONICS COMPARISON
                              </h3>
                              <p className="text-xs text-zinc-400 mt-1 font-sans">
                                Complete astrological suitabilities, alignments, and running planetary dashboards (Vimsottari).
                              </p>
                            </div>
                            
                            {/* Toggle buttons between D1/D9 and Sign Settings Toggles */}
                            <div className="flex flex-wrap gap-4 items-center">
                              {!kundaliResult.isTimeMissing && (
                                <div className="inline-flex bg-zinc-950 p-1 border border-zinc-850 rounded-xl">
                                  <button
                                    type="button"
                                    onClick={() => setActiveChartView("D1")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                      activeChartView === "D1" 
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 font-bold" 
                                        : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                  >
                                    D1 Rashi
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveChartView("D9")}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                                      activeChartView === "D9" 
                                        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 font-bold" 
                                        : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                  >
                                    D9 Navamsa
                                  </button>
                                </div>
                              )}
                              
                              {/* Settings group for sign display mode toggle */}
                              <div className="inline-flex bg-zinc-950 p-1 border border-zinc-850 rounded-xl">
                                <span className="hidden sm:inline-block text-[10px] font-mono uppercase text-zinc-500 self-center px-2 mr-1">Sign View:</span>
                                <button
                                  type="button"
                                  onClick={() => setSignDisplayMode("number")}
                                  className={`px-2.5 py-1 text-[11px] rounded-lg transition-all duration-200 uppercase font-mono cursor-pointer ${
                                    signDisplayMode === "number"
                                      ? "bg-amber-500/20 text-amber-300 font-bold"
                                      : "text-zinc-500 hover:text-zinc-300"
                                  }`}
                                  title="Display signs as standard astrological index numbers"
                                >
                                  Num
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSignDisplayMode("symbol")}
                                  className={`px-2.5 py-1 text-[11px] rounded-lg transition-all duration-150 uppercase font-mono cursor-pointer ${
                                    signDisplayMode === "symbol"
                                      ? "bg-amber-500/20 text-amber-300 font-bold"
                                      : "text-zinc-500 hover:text-zinc-300"
                                  }`}
                                  title="Display signs using Vedic glyph symbols"
                                >
                                  Sym
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSignDisplayMode("name")}
                                  className={`px-2.5 py-1 text-[11px] rounded-lg transition-all duration-150 uppercase font-mono cursor-pointer ${
                                    signDisplayMode === "name"
                                      ? "bg-amber-500/20 text-amber-300 font-bold"
                                      : "text-zinc-500 hover:text-zinc-300"
                                  }`}
                                  title="Display signs as full zodiac sign names"
                                >
                                  Name
                                </button>
                              </div>
                            </div>
                          </div>

                          {kundaliResult.isTimeMissing ? (
                            /* Fallback structure when birth times are completely or partially missing */
                            <div className="bg-[#111015]/70 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden backdrop-blur-md">
                              <div className="flex items-start gap-4 p-4 border border-amber-500/25 bg-amber-500/5 rounded-xl mb-6">
                                <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                                <div>
                                  <span className="block text-xs font-mono text-amber-300 font-bold uppercase tracking-widest">Aura Alignment Falling Back</span>
                                  <p className="text-xs text-zinc-400 font-sans mt-1.5 leading-relaxed">
                                    Birth time is required to generate an accurate birth chart (both Ascendant and house placements are unavailable with date entry only). Below are geocentric astronomical placements by zodiac sign:
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Boy positions */}
                                <div className="space-y-3 bg-[#16151b] border border-zinc-800 p-5 rounded-xl shadow-inner">
                                  <span className="text-xs font-mono uppercase tracking-widest text-amber-500/70 block border-b border-zinc-800 pb-2">
                                    {kBoyName} Placements (Sign-Only)
                                  </span>
                                  <div className="grid grid-cols-1 divide-y divide-zinc-800/40">
                                    {kundaliResult.boyChart.planetsBySign.map((p: any) => (
                                      <div key={p.name} className="flex items-center justify-between py-2 text-xs font-mono">
                                        <span className="text-zinc-300 flex items-center gap-2">
                                          <span className="text-amber-500">{p.glyph}</span>
                                          <span>{p.name} ({p.sanskritName})</span>
                                        </span>
                                        <span className="text-zinc-400 font-bold">{p.signName} <span className="text-[10px] text-zinc-500">{p.degree}°</span></span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Girl positions */}
                                <div className="space-y-3 bg-[#16151b] border border-zinc-800 p-5 rounded-xl shadow-inner">
                                  <span className="text-xs font-mono uppercase tracking-widest text-amber-500/70 block border-b border-zinc-800 pb-2">
                                    {kGirlName} Placements (Sign-Only)
                                  </span>
                                  <div className="grid grid-cols-1 divide-y divide-zinc-800/40">
                                    {kundaliResult.girlChart.planetsBySign.map((p: any) => (
                                      <div key={p.name} className="flex items-center justify-between py-2 text-xs font-mono">
                                        <span className="text-zinc-300 flex items-center gap-2">
                                          <span className="text-amber-500">{p.glyph}</span>
                                          <span>{p.name} ({p.sanskritName})</span>
                                        </span>
                                        <span className="text-zinc-400 font-bold">{p.signName} <span className="text-[10px] text-zinc-500">{p.degree}°</span></span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Real Accurately Generated Side-By-Side Kundalis with strict hierarchy */
                            <div className="space-y-8">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch justify-center">
                                
                                {/* Partner A Chart Column */}
                                <div className="bg-[#111827] border border-zinc-800 p-6 rounded-3xl relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-emerald-500/20 flex flex-col justify-between">
                                  <div className="absolute top-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                                  
                                  {/* 1. Name */}
                                  <div className="text-center mb-4">
                                    <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                                      Partner Profile (Self)
                                    </span>
                                    <h4 className="text-2xl font-serif text-white font-black tracking-wide">
                                      {kBoyName}
                                    </h4>
                                  </div>

                                  {/* 2 & 3 & 4 & 5 & 6. Core Astro Profile Card */}
                                  <div className="space-y-2.5 border border-zinc-800/40 bg-[#080C16]/50 p-4 rounded-2xl text-xs font-mono mb-6">
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">📅 Birth Details</span>
                                      <span className="text-zinc-200 font-bold">{kBoyDob} | {kBoyTime} | {kBoyPlace.split(",")[0]}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">🌟 Rising (Lagna)</span>
                                      <span className="text-emerald-400 font-bold">
                                        {activeChartView === "D1" ? kundaliResult.boyChart.ascSignName : ZODIAC_SIGNS[kundaliResult.boyChart.d9AscSignIdx]} ({activeChartView === "D1" ? kundaliResult.boyChart.ascDegree : 0}°)
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">🌙 Moon Sign (Rashi)</span>
                                      <span className="text-teal-450 font-bold">{kundaliResult.boyRashi}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">✨ Nakshatra (Star)</span>
                                      <span className="text-[#a855f7] font-bold">
                                        {kundaliResult.boyNak?.name} ({kundaliResult.boyNak?.gana})
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <span className="text-zinc-500">🪐 Running Dasha</span>
                                      <span className="text-amber-450 font-extrabold text-amber-300">
                                        {getRunningMahadasha(kBoyDob, NAKSHATRAS.find(n => n.name === kundaliResult.boyNak?.name)?.ruler || "Venus")}
                                      </span>
                                    </div>
                                  </div>

                                  {/* 7. Redesigned Interactive Kundali Chart */}
                                  <div className="my-2 select-none">
                                    <KundaliSVG 
                                      houses={activeChartView === "D1" ? kundaliResult.boyChart.d1Houses : kundaliResult.boyChart.d9Houses} 
                                      isBoy={true}
                                      partnerName={kBoyName}
                                      activeChartView={activeChartView}
                                      signDisplayMode={signDisplayMode}
                                      hoveredPlanetData={hoveredPlanetData}
                                      setHoveredPlanetData={setHoveredPlanetData}
                                      activeHoveredHouse={activeHoveredHouse}
                                      setActiveHoveredHouse={setActiveHoveredHouse}
                                    />
                                  </div>

                                  <div className="mt-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-center bg-zinc-950/30 py-1.5 rounded-lg border border-zinc-800/20">
                                    {activeChartView === "D1" ? "Rashi (D1)" : "Navamsa (D9)"} Grid Loaded
                                  </div>

                                  {/* 11. Planet summary dashboard */}
                                  <div className="mt-6 border-t border-zinc-800/40 pt-5 space-y-3">
                                    <span className="text-[9.5px] font-mono uppercase tracking-widest text-zinc-500 block text-center font-black">
                                      📋 PLANET PLACEMENTS SIDEREAL
                                    </span>
                                    <div className="overflow-x-auto rounded-xl border border-zinc-800/40 bg-[#09080c]/30">
                                      <table className="w-full text-[10.5px] font-mono text-left border-collapse">
                                        <thead>
                                          <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-500">
                                            <th className="py-2 px-3">Planet</th>
                                            <th className="py-2 px-3">Sign</th>
                                            <th className="py-2 px-3">House</th>
                                            <th className="py-2 px-2">Degree</th>
                                            <th className="py-2 px-2 text-right">Dignity</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-900">
                                          {(activeChartView === "D1" ? kundaliResult.boyChart.d1Houses : kundaliResult.boyChart.d9Houses).flatMap((h: any) => 
                                            h.planets.map((p: any) => {
                                              const sts = getPlanetStatus(p.name, kBoyName);
                                              const dgt = getDignity(p.name, h.signIdx);
                                              return (
                                                <tr key={p.name} className="hover:bg-zinc-800/10">
                                                  <td className="py-1.5 px-3 font-bold text-zinc-300 flex items-center gap-1.5">
                                                    <span style={{ color: getPlanetColor(p.name) }}>{getPlanetAbbreviation(p.name)}</span>
                                                    <span>{p.name}</span>
                                                  </td>
                                                  <td className="py-1.5 px-3 text-zinc-400 font-sans">{h.signName}</td>
                                                  <td className="py-1.5 px-3 text-amber-400 font-bold">H{h.houseNumber}</td>
                                                  <td className="py-1.5 px-2 text-zinc-400">{p.degree.toFixed(1)}°</td>
                                                  <td className="py-1.5 px-2 text-right text-[10px]">
                                                    {dgt.includes("Exalted") ? (
                                                      <span className="text-emerald-400 font-bold">Exalted</span>
                                                    ) : dgt.includes("Debilitated") ? (
                                                      <span className="text-red-400 font-bold">Debilitated</span>
                                                    ) : sts.isRetrograde ? (
                                                      <span className="text-amber-400">Retro (R)</span>
                                                    ) : (
                                                      <span className="text-zinc-500">Neutral</span>
                                                    )}
                                                  </td>
                                                </tr>
                                              );
                                            })
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                </div>

                                {/* Partner B Chart Column */}
                                <div className="bg-[#111827] border border-zinc-800 p-6 rounded-3xl relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-amber-500/20 flex flex-col justify-between">
                                  <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                                  
                                  {/* 1. Name */}
                                  <div className="text-center mb-4">
                                    <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                                      Partner Profile (Synergy / Spouse)
                                    </span>
                                    <h4 className="text-2xl font-serif text-white font-black tracking-wide">
                                      {kGirlName}
                                    </h4>
                                  </div>

                                  {/* 2 & 3 & 4 & 5 & 6. Core Astro Profile Card */}
                                  <div className="space-y-2.5 border border-zinc-800/40 bg-[#080C16]/50 p-4 rounded-2xl text-xs font-mono mb-6">
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">📅 Birth Details</span>
                                      <span className="text-zinc-200 font-bold">{kGirlDob} | {kGirlTime} | {kGirlPlace.split(",")[0]}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">🌟 Rising (Lagna)</span>
                                      <span className="text-emerald-400 font-bold">
                                        {activeChartView === "D1" ? kundaliResult.girlChart.ascSignName : ZODIAC_SIGNS[kundaliResult.girlChart.d9AscSignIdx]} ({activeChartView === "D1" ? kundaliResult.girlChart.ascDegree : 0}°)
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">🌙 Moon Sign (Rashi)</span>
                                      <span className="text-teal-450 font-bold">{kundaliResult.girlRashi}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-b border-zinc-850">
                                      <span className="text-zinc-500">✨ Nakshatra (Star)</span>
                                      <span className="text-[#a855f7] font-bold">
                                        {kundaliResult.girlNak?.name} ({kundaliResult.girlNak?.gana})
                                      </span>
                                    </div>
                                    <div className="flex justify-between py-1">
                                      <span className="text-zinc-500">🪐 Running Dasha</span>
                                      <span className="text-amber-450 font-extrabold text-amber-300">
                                        {getRunningMahadasha(kGirlDob, NAKSHATRAS.find(n => n.name === kundaliResult.girlNak?.name)?.ruler || "Venus")}
                                      </span>
                                    </div>
                                  </div>

                                  {/* 7. Redesigned Interactive Kundali Chart */}
                                  <div className="my-2 select-none">
                                    <KundaliSVG 
                                      houses={activeChartView === "D1" ? kundaliResult.girlChart.d1Houses : kundaliResult.girlChart.d9Houses} 
                                      isBoy={false}
                                      partnerName={kGirlName}
                                      activeChartView={activeChartView}
                                      signDisplayMode={signDisplayMode}
                                      hoveredPlanetData={hoveredPlanetData}
                                      setHoveredPlanetData={setHoveredPlanetData}
                                      activeHoveredHouse={activeHoveredHouse}
                                      setActiveHoveredHouse={setActiveHoveredHouse}
                                    />
                                  </div>

                                  <div className="mt-4 text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-center bg-zinc-950/30 py-1.5 rounded-lg border border-zinc-800/20">
                                    {activeChartView === "D1" ? "Rashi (D1)" : "Navamsa (D9)"} Grid Loaded
                                  </div>

                                  {/* 11. Planet summary dashboard */}
                                  <div className="mt-6 border-t border-zinc-800/40 pt-5 space-y-3">
                                    <span className="text-[9.5px] font-mono uppercase tracking-widest text-zinc-500 block text-center font-black">
                                      📋 PLANET PLACEMENTS SIDEREAL
                                    </span>
                                    <div className="overflow-x-auto rounded-xl border border-zinc-800/40 bg-[#09080c]/30">
                                      <table className="w-full text-[10.5px] font-mono text-left border-collapse">
                                        <thead>
                                          <tr className="border-b border-zinc-850 bg-zinc-950/40 text-zinc-500">
                                            <th className="py-2 px-3">Planet</th>
                                            <th className="py-2 px-3">Sign</th>
                                            <th className="py-2 px-3">House</th>
                                            <th className="py-2 px-2">Degree</th>
                                            <th className="py-2 px-2 text-right">Dignity</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-900">
                                          {(activeChartView === "D1" ? kundaliResult.girlChart.d1Houses : kundaliResult.girlChart.d9Houses).flatMap((h: any) => 
                                            h.planets.map((p: any) => {
                                              const sts = getPlanetStatus(p.name, kGirlName);
                                              const dgt = getDignity(p.name, h.signIdx);
                                              return (
                                                <tr key={p.name} className="hover:bg-zinc-800/10">
                                                  <td className="py-1.5 px-3 font-bold text-zinc-300 flex items-center gap-1.5">
                                                    <span style={{ color: getPlanetColor(p.name) }}>{getPlanetAbbreviation(p.name)}</span>
                                                    <span>{p.name}</span>
                                                  </td>
                                                  <td className="py-1.5 px-3 text-zinc-400 font-sans">{h.signName}</td>
                                                  <td className="py-1.5 px-3 text-amber-400 font-bold">H{h.houseNumber}</td>
                                                  <td className="py-1.5 px-2 text-zinc-400">{p.degree.toFixed(1)}°</td>
                                                  <td className="py-1.5 px-2 text-right text-[10px]">
                                                    {dgt.includes("Exalted") ? (
                                                      <span className="text-emerald-400 font-bold">Exalted</span>
                                                    ) : dgt.includes("Debilitated") ? (
                                                      <span className="text-red-400 font-bold">Debilitated</span>
                                                    ) : sts.isRetrograde ? (
                                                      <span className="text-amber-400">Retro (R)</span>
                                                    ) : (
                                                      <span className="text-zinc-500">Neutral</span>
                                                    )}
                                                  </td>
                                                </tr>
                                              );
                                            })
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                                </div>

                              </div>

                              {/* Interactive Oracle Tooltip panel */}
                              <div className="mt-8 bg-gradient-to-br from-[#111827] to-[#080C16] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md min-h-[140px] flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                                
                                <AnimatePresence mode="wait">
                                  {hoveredPlanetData ? (
                                    <motion.div 
                                      key={`planet-${hoveredPlanetData.name}`}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="grid md:grid-cols-3 gap-6 items-center"
                                    >
                                      <div className="md:border-r border-zinc-800 pb-4 md:pb-0">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1">Celestial Entity</span>
                                        <div className="flex items-center gap-3">
                                          <span 
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-inner"
                                            style={{ backgroundColor: `${getPlanetColor(hoveredPlanetData.name)}20`, color: getPlanetColor(hoveredPlanetData.name) }}
                                          >
                                            {hoveredPlanetData.glyph}
                                          </span>
                                          <div>
                                            <h4 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                                              {hoveredPlanetData.name}
                                            </h4>
                                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{hoveredPlanetData.dignity}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs font-mono">
                                        <div>
                                          <span className="text-zinc-500 block text-[9px] uppercase">Zodiac & Degree</span>
                                          <span className="text-zinc-200 block mt-0.5 font-bold">
                                            {hoveredPlanetData.signSymbol} {hoveredPlanetData.signName} @ {hoveredPlanetData.degree.toFixed(1)}°
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-zinc-500 block text-[9px] uppercase font-bold">Vedic House</span>
                                          <span className="text-amber-400 block mt-0.5 font-bold">House {hoveredPlanetData.houseNumber}</span>
                                        </div>
                                        <div>
                                          <span className="text-zinc-500 block text-[9px] uppercase">Nakshatra Star</span>
                                          <span className="text-indigo-400 block mt-0.5 font-bold">
                                            {hoveredPlanetData.nakshatraName} (Pada {hoveredPlanetData.pada})
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-zinc-400 block text-[9px] uppercase">Nakshatra Ruler</span>
                                          <span className="text-zinc-300 block mt-0.5 font-bold">{hoveredPlanetData.nakshatraRuler}</span>
                                        </div>
                                        <div>
                                          <span className="text-zinc-500 block text-[9px] uppercase">Astrological States</span>
                                          <div className="flex flex-wrap gap-1.5 mt-1">
                                            {hoveredPlanetData.isRetrograde && (
                                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold uppercase tracking-wider">
                                                Retrograde (R)
                                              </span>
                                            )}
                                            {hoveredPlanetData.isCombust && (
                                              <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-wider">
                                                Combust (🔥)
                                              </span>
                                            )}
                                            {!hoveredPlanetData.isRetrograde && !hoveredPlanetData.isCombust && (
                                              <span className="text-emerald-450 text-[10px] font-bold uppercase tracking-wider">Direct Flow</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ) : activeHoveredHouse ? (
                                    <motion.div 
                                      key={`house-${activeHoveredHouse}`}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="grid md:grid-cols-3 gap-6 items-center"
                                    >
                                      <div className="md:border-r border-zinc-800 pb-4 md:pb-0">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold mb-1">Interactive House Reader</span>
                                        <div className="flex items-center gap-3">
                                          <span className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center text-md text-amber-400 font-mono font-bold">
                                            H{activeHoveredHouse}
                                          </span>
                                          <div>
                                            <h4 className="text-md font-serif font-bold text-white tracking-wide">
                                              {HOUSE_SIGNIFICATIONS[activeHoveredHouse]?.name || `House ${activeHoveredHouse}`}
                                            </h4>
                                            <span className="text-[10px] font-mono uppercase font-black uppercase tracking-wider text-amber-100">
                                              {HOUSE_SIGNIFICATIONS[activeHoveredHouse]?.keyFocus}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="md:col-span-2 text-xs font-sans text-zinc-300 leading-relaxed">
                                        <span className="text-zinc-500 font-mono block text-[9.5px] uppercase tracking-widest font-bold mb-1">Significant Portals & Life Spheres</span>
                                        {HOUSE_SIGNIFICATIONS[activeHoveredHouse]?.significations}
                                      </div>
                                    </motion.div>
                                  ) : (
                                    <motion.div 
                                      key="placeholder"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      className="flex items-center gap-3.5 text-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest"
                                    >
                                      <Sparkles className="w-4 h-4 text-amber-500/60 animate-pulse" />
                                      Consult the Cosmic Oracle: Hover/Tap any House or Planet badge inside the charts...
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>

                              {/* Synthesis Comparative Analysis Card */}
                              <div className="bg-gradient-to-br from-[#16151b] to-zinc-950 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <h4 className="text-xs font-mono uppercase text-amber-300 tracking-widest font-bold">
                                      Comparative Synthesis (7th House)
                                    </h4>
                                  </div>
                                </div>

                                <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-5">
                                  {kundaliResult.chartComparison.relationText}
                                </p>
                                
                                <div className="bg-zinc-950/60 p-4 border border-zinc-800/50 rounded-xl grid grid-cols-2 gap-4 text-center">
                                  <div>
                                    <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Partner A 7th Lord</span>
                                    <span className="text-zinc-200 font-mono text-xs font-bold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full inline-block">
                                      {kundaliResult.chartComparison.boy7Lord} in {kundaliResult.chartComparison.boy7Sign}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Spouse 7th Lord</span>
                                    <span className="text-zinc-200 font-mono text-xs font-bold bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full inline-block">
                                      {kundaliResult.chartComparison.girl7Lord} in {kundaliResult.chartComparison.girl7Sign}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Absolute Disclaimer matching Part C */}
                        <div className="border-t border-zinc-800/50 pt-5 text-center px-4 mt-6">
                          <p className="text-[9.5px] text-zinc-500 leading-relaxed font-mono max-w-2xl mx-auto uppercase leading-loose">
                            <span className="text-amber-500/70 font-bold">Vedic Suitability Disclaimer:</span> Kundali Matching (Ashtakoot Guna Milan) is a traditional Vedic system of suitability mapping. A low or high score indicates traditional astrological tendencies and should not be used as a deterministic barrier to relationship success. Human understanding and commitment transcend celestial counts.
                          </p>
                        </div>

                      </motion.div>
                    )
                  )}

                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </section>
  );
}
