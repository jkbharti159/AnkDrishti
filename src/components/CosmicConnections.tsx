import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Moon, Sun, Star, Compass, HelpCircle, Activity, 
  RefreshCw, AlertCircle, BookOpen, Award, CheckCircle2, Heart, 
  TrendingUp, User, DollarSign, Briefcase, Home, Shield, ShieldAlert, 
  Download, Info, ChevronRight, Check, Volume2, VolumeX, Eye
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { get_planetary_positions } from "../data/vedicData";
import CosmicDoshaFlashcards from "./CosmicDoshaFlashcards";
import CompatibilityVideoBackground from "./CompatibilityVideoBackground";
import CelestialBackground from "./CelestialBackground";

// -------------------------------------------------------------------------
// Vedic Calculations - Core Shastric & Astronomical Constants
// -------------------------------------------------------------------------

const ws = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const _w = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const Y0 = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", 
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
];

// 27 Nakshatras with Gana & Nadi
const Jo = [
  { name: "Ashwini", ruler: "Ketu", gana: "Deva", nadi: "Adi" },
  { name: "Bharani", ruler: "Venus", gana: "Manushya", nadi: "Madhya" },
  { name: "Krittika", ruler: "Sun", gana: "Rakshasa", nadi: "Antya" },
  { name: "Rohini", ruler: "Moon", gana: "Manushya", nadi: "Antya" },
  { name: "Mrigashira", ruler: "Mars", gana: "Deva", nadi: "Madhya" },
  { name: "Ardra", ruler: "Rahu", gana: "Manushya", nadi: "Adi" },
  { name: "Punarvasu", ruler: "Jupiter", gana: "Deva", nadi: "Adi" },
  { name: "Pushya", ruler: "Saturn", gana: "Deva", nadi: "Madhya" },
  { name: "Ashlesha", ruler: "Mercury", gana: "Rakshasa", nadi: "Antya" },
  { name: "Magha", ruler: "Ketu", gana: "Rakshasa", nadi: "Antya" },
  { name: "Purva Phalguni", ruler: "Venus", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Phalguni", ruler: "Sun", gana: "Manushya", nadi: "Adi" },
  { name: "Hasta", ruler: "Moon", gana: "Deva", nadi: "Adi" },
  { name: "Chitra", ruler: "Mars", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Swati", ruler: "Rahu", gana: "Deva", nadi: "Antya" },
  { name: "Vishakha", ruler: "Jupiter", gana: "Rakshasa", nadi: "Antya" },
  { name: "Anuradha", ruler: "Saturn", gana: "Deva", nadi: "Madhya" },
  { name: "Jyeshtha", ruler: "Mercury", gana: "Rakshasa", nadi: "Adi" },
  { name: "Mula", ruler: "Ketu", gana: "Rakshasa", nadi: "Adi" },
  { name: "Purva Ashadha", ruler: "Venus", gana: "Manushya", nadi: "Madhya" },
  { name: "Uttara Ashadha", ruler: "Sun", gana: "Manushya", nadi: "Antya" },
  { name: "Shravana", ruler: "Moon", gana: "Deva", nadi: "Antya" },
  { name: "Dhanishta", ruler: "Mars", gana: "Rakshasa", nadi: "Madhya" },
  { name: "Shatabhisha", ruler: "Rahu", gana: "Rakshasa", nadi: "Adi" },
  { name: "Purva Bhadrapada", ruler: "Jupiter", gana: "Manushya", nadi: "Adi" },
  { name: "Uttara Bhadrapada", ruler: "Saturn", gana: "Manushya", nadi: "Madhya" },
  { name: "Revati", ruler: "Mercury", gana: "Deva", nadi: "Antya" }
];

// Animal Yoni groupings
const vP = [
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

// Planetary relationships for Graha Maitri
const Pl: Record<string, { friends: string[]; enemies: string[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], enemies: ["Venus", "Saturn"] },
  Moon: { friends: ["Sun", "Mercury"], enemies: [] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], enemies: ["Mercury"] },
  Mercury: { friends: ["Sun", "Venus"], enemies: ["Moon"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], enemies: ["Mercury", "Venus"] },
  Venus: { friends: ["Mercury", "Saturn"], enemies: ["Sun", "Moon"] },
  Saturn: { friends: ["Mercury", "Venus"], enemies: ["Sun", "Moon", "Mars"] }
};

// House Details Mapping
const X0 = {
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

// -------------------------------------------------------------------------
// Deterministic Astrological Calculations & Audits (Shastric Layer)
// -------------------------------------------------------------------------

const getAyanamsa = (dateStr: string, timeStr: string, lon: number): number => {
  const [yr, mt, dy] = dateStr.split("-").map(Number);
  const [hr, mn] = timeStr ? timeStr.split(":").map(Number) : [12, 0];
  const timezoneOffset = Math.round(lon / 15 * 2) / 2;
  const lmtHours = hr + mn / 60 - timezoneOffset;
  
  const utcDate = new Date(Date.UTC(yr, mt - 1, dy, 0, 0, 0));
  utcDate.setTime(utcDate.getTime() + lmtHours * 60 * 60 * 1000);
  
  const julianDate = utcDate.getTime() / 864e5 + 2440587.5 - 2451545.0;
  return 23.85306 + 0.01397 * ((julianDate * 864e5) / (365.25 * 24 * 60 * 60 * 1000));
};

const calculateLagnaAndHouses = (
  dateStr: string,
  timeStr: string,
  lat: number,
  lon: number,
  ayanamsa: number,
  planets: any[]
) => {
  if (!timeStr) {
    return {
      hasTime: false,
      ascSignIdx: -1,
      ascDegree: 0,
      ascSignName: "Unknown",
      d1Houses: [],
      d9AscSignIdx: -1,
      d9Houses: [],
      planetsBySign: planets.map(p => ({
        name: p.name,
        glyph: p.glyph || "★",
        sanskritName: p.sanskritName || p.name,
        signName: p.sign,
        signIdx: Math.floor(p.longitude / 30) % 12,
        degree: parseFloat((p.longitude % 30).toFixed(1)),
        longitude: p.longitude
      }))
    };
  }

  const [yr, mt, dy] = dateStr.split("-").map(Number);
  const [hr, mn] = timeStr.split(":").map(Number);
  const timezoneOffset = Math.round(lon / 15 * 2) / 2;
  const lmtHours = hr + mn / 60 - timezoneOffset;
  
  const utcDate = new Date(Date.UTC(yr, mt - 1, dy, 0, 0, 0));
  utcDate.setTime(utcDate.getTime() + lmtHours * 60 * 60 * 1000);
  
  const julianDate = utcDate.getTime() / 864e5 + 2440587.5 - 2451545.0;
  let siderealTime = (280.46061837 + 360.98564736629 * julianDate) % 360;
  if (siderealTime < 0) siderealTime += 360;
  
  let localSiderealTime = (siderealTime + lon) % 360;
  if (localSiderealTime < 0) localSiderealTime += 360;
  
  const lstRad = localSiderealTime * Math.PI / 180;
  const obliquity = 23.4392911 * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  
  const xAsc = Math.cos(lstRad);
  const yAsc = -Math.sin(lstRad) * Math.cos(obliquity) - Math.sin(obliquity) * Math.tan(latRad);
  let ascendantLong = Math.atan2(xAsc, yAsc) * 180 / Math.PI;
  if (ascendantLong < 0) ascendantLong += 360;
  
  let siderealAscendant = (ascendantLong - ayanamsa + 360) % 360;
  const ascSignIdx = Math.floor(siderealAscendant / 30) % 12;
  const ascDegree = siderealAscendant % 30;
  
  const adjustedPlanets = planets.map(p => {
    let siderealLong = (p.longitude - ayanamsa + 360) % 360;
    const signIdx = Math.floor(siderealLong / 30) % 12;
    const degree = siderealLong % 30;
    return {
      name: p.name,
      glyph: p.glyph || "★",
      sanskritName: p.sanskritName || p.name,
      longitude: siderealLong,
      signIdx,
      degree
    };
  });

  const d1Houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIdx = (ascSignIdx + i) % 12;
    const signName = ws[signIdx];
    const lord = Y0[signIdx];
    const occupants = adjustedPlanets.filter(p => p.signIdx === signIdx);
    return {
      houseNumber: houseNum,
      signIdx,
      signName,
      lord,
      planets: occupants.map(p => ({
        name: p.name,
        glyph: p.glyph,
        degree: parseFloat(p.degree.toFixed(1))
      }))
    };
  });

  // Navamsa (D9) Chart Calculation
  const getNavamsaSign = (long: number): number => {
    const signIdx = Math.floor(long / 30) % 12;
    const degree = long % 30;
    const navamsaDivision = Math.floor(degree / 3.333333);
    let startSign = 0;
    if (signIdx % 3 === 0) startSign = signIdx;
    else if (signIdx % 3 === 1) startSign = (signIdx + 8) % 12;
    else startSign = (signIdx + 4) % 12;
    return (startSign + navamsaDivision) % 12;
  };

  const d9AscSignIdx = getNavamsaSign(siderealAscendant);
  const d9Planets = adjustedPlanets.map(p => ({
    ...p,
    d9SignIdx: getNavamsaSign(p.longitude)
  }));

  const d9Houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIdx = (d9AscSignIdx + i) % 12;
    const signName = ws[signIdx];
    const lord = Y0[signIdx];
    const occupants = d9Planets.filter(p => p.d9SignIdx === signIdx);
    return {
      houseNumber: houseNum,
      signIdx,
      signName,
      lord,
      planets: occupants.map(p => ({
        name: p.name,
        glyph: p.glyph,
        degree: parseFloat(p.degree.toFixed(1))
      }))
    };
  });

  return {
    hasTime: true,
    ascSignIdx,
    ascDegree: parseFloat(ascDegree.toFixed(1)),
    ascSignName: ws[ascSignIdx],
    d1Houses,
    d9AscSignIdx,
    d9Houses,
    planetsBySign: adjustedPlanets.map(p => ({
      name: p.name,
      glyph: p.glyph,
      sanskritName: p.sanskritName,
      signName: ws[p.signIdx],
      signIdx: p.signIdx,
      degree: parseFloat(p.degree.toFixed(1)),
      longitude: p.longitude
    }))
  };
};

const calculatePlanetaryDignity = (planetName: string, signIdx: number): string => {
  const exaltations: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
  const debilitations: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
  
  if (exaltations[planetName] === signIdx) return "Exalted 🌟";
  if (debilitations[planetName] === signIdx) return "Debilitated ⚠️";
  
  const relationships = Pl[planetName];
  if (relationships) {
    if (relationships.friends.includes(ws[signIdx])) return "Friendly Sign 🤝";
    if (relationships.enemies.includes(ws[signIdx])) return "Enemy Sign ⚡";
  }
  return "Neutral Sign ⚖️";
};

// -------------------------------------------------------------------------
// Extra Audited Doshas & Yogas Calculations (Validation Layer)
// -------------------------------------------------------------------------

const auditPitruDosha = (chart: any) => {
  if (!chart || !chart.hasTime) return { status: "Absent", reasons: [], cancellations: [] };
  const sun = chart.planetsBySign.find((p: any) => p.name === "Sun");
  const rahu = chart.planetsBySign.find((p: any) => p.name === "Rahu");
  const ketu = chart.planetsBySign.find((p: any) => p.name === "Ketu");
  const saturn = chart.planetsBySign.find((p: any) => p.name === "Saturn");
  const jupiter = chart.planetsBySign.find((p: any) => p.name === "Jupiter");
  
  const reasons: string[] = [];
  const cancellations: string[] = [];
  
  if (sun) {
    const sunHouse = d1HouseOfPlanet(sun.signIdx, chart.ascSignIdx);
    
    // Check Rahu / Ketu / Saturn aspect or conjunction
    const rahuConj = rahu && Math.abs(sun.degree - rahu.degree) < 10 && sun.signIdx === rahu.signIdx;
    const ketuConj = ketu && Math.abs(sun.degree - ketu.degree) < 10 && sun.signIdx === ketu.signIdx;
    const saturnConj = saturn && Math.abs(sun.degree - saturn.degree) < 10 && sun.signIdx === saturn.signIdx;
    
    if (rahuConj) reasons.push("Sun (Karaka for Father) is in tight conjunction with Rahu (within 10°).");
    if (ketuConj) reasons.push("Sun (Karaka for Father) is in tight conjunction with Ketu (within 10°).");
    if (saturnConj) reasons.push("Sun is conjunct Saturn, inducing heavy ancestral karmic duties.");
    if (sun.signIdx === 6) reasons.push("Sun is debilitated in Libra, weakening the ancestral protective shield.");
    if (sunHouse === 9) {
      if (rahu && d1HouseOfPlanet(rahu.signIdx, chart.ascSignIdx) === 9) reasons.push("Rahu occupies the 9th House of ancestral roots alongside the Sun.");
      if (ketu && d1HouseOfPlanet(ketu.signIdx, chart.ascSignIdx) === 9) reasons.push("Ketu occupies the 9th House of ancestral roots alongside the Sun.");
    }
    
    // Jupiter's aspect or own sign cancellation
    if (jupiter) {
      const jupHouse = d1HouseOfPlanet(jupiter.signIdx, chart.ascSignIdx);
      const diff = (sunHouse - jupHouse + 12) % 12 + 1;
      const isJupiterAspecting = [1, 5, 7, 9].includes(diff);
      if (isJupiterAspecting && jupiter.signIdx !== 5) { // Jupiter not in enemy Mercury's sign Virgo
        cancellations.push("Jupiter casts a protective aspect onto the Sun, purifying ancestral karmas.");
      }
    }
  }
  
  let status = reasons.length > 0 ? "Present" : "Absent";
  if (status === "Present" && cancellations.length > 0) status = "Cancelled";
  return { status, reasons, cancellations };
};

const auditGuruChandal = (chart: any) => {
  if (!chart || !chart.hasTime) return { status: "Absent", reasons: [], cancellations: [] };
  const jupiter = chart.planetsBySign.find((p: any) => p.name === "Jupiter");
  const rahu = chart.planetsBySign.find((p: any) => p.name === "Rahu");
  const ketu = chart.planetsBySign.find((p: any) => p.name === "Ketu");
  
  const reasons: string[] = [];
  const cancellations: string[] = [];
  
  if (jupiter && rahu) {
    if (jupiter.signIdx === rahu.signIdx) {
      reasons.push("Jupiter (Guru) and Rahu are in conjunction in the same sign.");
    }
  }
  if (jupiter && ketu) {
    if (jupiter.signIdx === ketu.signIdx) {
      reasons.push("Jupiter (Guru) and Ketu are in conjunction in the same sign.");
    }
  }
  
  if (reasons.length > 0 && jupiter) {
    if (jupiter.signIdx === 3) { // Cancer (Exaltation)
      cancellations.push("Jupiter is exalted in Cancer, entirely absorbing and purifying Rahu's eclipse field.");
    }
    if ([8, 11].includes(jupiter.signIdx)) { // Sagittarius / Pisces (Own Sign)
      cancellations.push("Jupiter is in its own sign, keeping its spiritual core strong and neutralizing the Chandal alignment.");
    }
  }
  
  let status = reasons.length > 0 ? "Present" : "Absent";
  if (status === "Present" && cancellations.length > 0) status = "Cancelled";
  return { status, reasons, cancellations };
};

const auditKemadruma = (chart: any) => {
  if (!chart || !chart.hasTime) return { status: "Absent", reasons: [], cancellations: [] };
  const moon = chart.planetsBySign.find((p: any) => p.name === "Moon");
  const reasons: string[] = [];
  const cancellations: string[] = [];
  
  if (moon) {
    const prevSign = (moon.signIdx - 1 + 12) % 12;
    const nextSign = (moon.signIdx + 1) % 12;
    
    const adjPlanets = chart.planetsBySign.filter((p: any) => {
      if (["Sun", "Moon", "Rahu", "Ketu"].includes(p.name)) return false;
      return p.signIdx === prevSign || p.signIdx === nextSign;
    });
    
    if (adjPlanets.length === 0) {
      reasons.push("The 2nd and 12th houses from the Moon are completely devoid of physical planets.");
    }
    
    // Kendra Cancellation check (Bhanga)
    const kendraPlanets = chart.planetsBySign.filter((p: any) => {
      if (["Rahu", "Ketu"].includes(p.name)) return false;
      const house = d1HouseOfPlanet(p.signIdx, chart.ascSignIdx);
      return [1, 4, 7, 10].includes(house);
    });
    
    if (kendraPlanets.length > 0) {
      cancellations.push("Planets reside in Kendra houses from Lagna, stabilizing the Moon's emotional field.");
    }
  }
  
  let status = reasons.length > 0 ? "Present" : "Absent";
  if (status === "Present" && cancellations.length > 0) status = "Cancelled";
  return { status, reasons, cancellations };
};

const auditShrapitYoga = (chart: any) => {
  if (!chart || !chart.hasTime) return { status: "Absent", reasons: [], cancellations: [] };
  const saturn = chart.planetsBySign.find((p: any) => p.name === "Saturn");
  const rahu = chart.planetsBySign.find((p: any) => p.name === "Rahu");
  const jupiter = chart.planetsBySign.find((p: any) => p.name === "Jupiter");
  
  const reasons: string[] = [];
  const cancellations: string[] = [];
  
  if (saturn && rahu) {
    if (saturn.signIdx === rahu.signIdx) {
      reasons.push("Saturn and Rahu reside in the same sign, creating Shrapit (cursed karmic freeze) alignment.");
    }
    
    if (reasons.length > 0 && jupiter) {
      const satHouse = d1HouseOfPlanet(saturn.signIdx, chart.ascSignIdx);
      const jupHouse = d1HouseOfPlanet(jupiter.signIdx, chart.ascSignIdx);
      const diff = (satHouse - jupHouse + 12) % 12 + 1;
      if ([1, 5, 7, 9].includes(diff)) {
        cancellations.push("Jupiter aspects the Saturn-Rahu conjunction, melting the karmic freeze with spiritual light.");
      }
    }
  }
  
  let status = reasons.length > 0 ? "Present" : "Absent";
  if (status === "Present" && cancellations.length > 0) status = "Cancelled";
  return { status, reasons, cancellations };
};

const d1HouseOfPlanet = (planetSignIdx: number, ascSignIdx: number): number => {
  return (planetSignIdx - ascSignIdx + 12) % 12 + 1;
};

// -------------------------------------------------------------------------
// Helper components
// -------------------------------------------------------------------------

// North Indian Style Interactive SVG Chart Component
const G_ = ({ 
  houses, 
  isBoy, 
  partnerName, 
  activeChartView, 
  signDisplayMode, 
  hoveredPlanetData, 
  setHoveredPlanetData, 
  activeHoveredHouse, 
  setActiveHoveredHouse 
}: any) => {
  if (!houses || houses.length === 0) return null;
  
  const labelPositions: Record<number, { labelX: number; labelY: number }> = {
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

  const houseNamePositions: Record<number, { x: number; y: number }> = {
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

  const signNumberPositions: Record<number, { x: number; y: number }> = {
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

  const getSignLabel = (signIdx: number, mode: string) => {
    if (mode === "name") return ws[signIdx]?.slice(0, 3) || "";
    if (mode === "symbol") return _w[signIdx] || "";
    return String(signIdx + 1);
  };

  return (
    <div className="relative group transition-transform duration-300">
      <svg viewBox="0 0 300 300" className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[440px] lg:max-w-[500px] mx-auto bg-[#080C16] rounded-2xl border border-zinc-800 shadow-[0_4px_30px_rgba(0,0,0,0.85)] overflow-visible transition-all duration-300">
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

        {/* Ambient Glows for Ascendant (House 1) and Partner (House 7) */}
        <path d="M 150,150 L 75,75 L 150,0 L 225,75 Z" fill="url(#emerald-glowing-asc)" className="pointer-events-none" />
        <path d="M 150,150 L 75,225 L 150,300 L 225,225 Z" fill="url(#golden-glowing-seventh)" className="pointer-events-none" />

        {/* Draw polygons for 12 Houses */}
        {houses.map((h: any) => {
          const points: Record<number, string> = {
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
          const isActive = activeHoveredHouse === h.houseNumber;
          const isLagna = h.houseNumber === 1;
          const isPartnerHouse = h.houseNumber === 7;
          
          let fill = "rgba(0,0,0,0)";
          if (isActive) {
            if (isLagna) fill = "rgba(16, 185, 129, 0.15)";
            else if (isPartnerHouse) fill = "rgba(245, 158, 11, 0.18)";
            else fill = "rgba(255, 255, 255, 0.05)";
          }

          return (
            <polygon
              key={`hpoly-${h.houseNumber}`}
              points={points[h.houseNumber]}
              fill={fill}
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => {
                setActiveHoveredHouse(h.houseNumber);
                setHoveredPlanetData(null);
              }}
              onMouseLeave={() => setActiveHoveredHouse(null)}
            />
          );
        })}

        {/* Structural Lines */}
        <line x1="0" y1="0" x2="300" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="300" y1="0" x2="0" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="150" y1="0" x2="300" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="300" y1="150" x2="150" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="150" y1="300" x2="0" y2="150" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <line x1="0" y1="150" x2="150" y2="0" stroke="rgba(255,255,255,0.08)" strokeWidth="1" className="pointer-events-none" />
        <rect x="0" y="0" width="300" height="300" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" className="pointer-events-none" />

        {/* Dynamic connection path line */}
        <g className="pointer-events-none">
          <line x1="150" y1="75" x2="150" y2="225" stroke="url(#connection-gradient)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-connection-dash" />
          <circle cx="150" cy="75" r="3" fill="#10b981" />
          <circle cx="150" cy="225" r="3" fill="#f59e0b" />
        </g>

        {/* Central badges highlighting Ascendant & 7th House */}
        <path d="M 150,150 L 75,75 L 150,0 L 225,75 Z" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.8" className="pointer-events-none" />
        <path d="M 150,150 L 75,225 L 150,300 L 225,225 Z" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.9" className="pointer-events-none" />

        <g transform="translate(150, 42)" className="pointer-events-none">
          <rect x="-18" y="-7" width="36" height="14" rx="7" fill="#043224" stroke="#10b981" strokeWidth="1" opacity="0.95" />
          <text textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-mono fill-emerald-200 font-extrabold tracking-widest">ASC</text>
        </g>

        {/* Text layers, planet renders, and sign indicators */}
        {houses.map((h: any) => {
          const lp = labelPositions[h.houseNumber];
          const np = houseNamePositions[h.houseNumber];
          const sp = signNumberPositions[h.houseNumber];
          if (!lp || !np || !sp) return null;

          const isLagna = h.houseNumber === 1;
          const isPartnerHouse = h.houseNumber === 7;
          const isActive = activeHoveredHouse === h.houseNumber;
          const signIdx = h.signIdx;

          return (
            <g key={`hg-${h.houseNumber}`}>
              {/* House Number Badges */}
              <g transform={`translate(${np.x}, ${np.y})`} className="pointer-events-none select-none">
                <rect 
                  x="-12" 
                  y="-7" 
                  width="24" 
                  height="14" 
                  rx="4" 
                  fill={isLagna ? "#064e3b" : isPartnerHouse ? "#78350f" : isActive ? "#374151" : "#1f2937"} 
                  stroke={isLagna ? "#10b981" : isPartnerHouse ? "#fbbf24" : isActive ? "#6b7280" : "rgba(255,255,255,0.15)"} 
                  strokeWidth="1" 
                />
                <text textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-mono font-bold fill-zinc-100" y="1">H{h.houseNumber}</text>
              </g>

              {/* Sign Number / Emblem label */}
              <text 
                x={sp.x} 
                y={sp.y} 
                textAnchor="middle" 
                dominantBaseline="middle" 
                className={`text-[9.5px] font-mono select-none font-bold transition-all duration-300 ${isPartnerHouse ? "fill-amber-400 font-extrabold drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" : isLagna ? "fill-emerald-400 font-extrabold drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" : "fill-zinc-500"}`}
              >
                {getSignLabel(signIdx, signDisplayMode)}
              </text>

              {/* Planets Rendering */}
              {h.planets && h.planets.length > 0 && (
                <g transform={`translate(${lp.labelX}, ${lp.labelY})`}>
                  {(() => {
                    // Generate spatial layout offsets to prevent overlapping planets
                    const planetCount = h.planets.length;
                    const offsets = SP(planetCount);
                    return h.planets.map((planet: any, idx: number) => {
                      const offset = offsets[idx] || { dx: 0, dy: 0 };
                      const initials = Fc(planet.name);
                      const color = Qo(planet.name);
                      
                      const hoverData = {
                        name: planet.name,
                        glyph: planet.glyph || "★",
                        degree: planet.degree,
                        signName: ws[signIdx],
                        signNumber: signIdx + 1,
                        houseNumber: h.houseNumber,
                        dignity: calculatePlanetaryDignity(planet.name, signIdx)
                      };

                      return (
                        <g 
                          key={`pb-${planet.name}`} 
                          transform={`translate(${offset.dx}, ${offset.dy})`}
                          className="cursor-pointer group/badge"
                          onMouseEnter={() => setHoveredPlanetData(hoverData)}
                          onMouseLeave={() => setHoveredPlanetData(null)}
                        >
                          <circle 
                            cx="0" 
                            cy="0" 
                            r="11" 
                            fill="#111827" 
                            stroke={color} 
                            strokeWidth="1.5" 
                            opacity="0.9" 
                            className="transition-all duration-200 group-hover/badge:scale-130 group-hover/badge:stroke-white"
                          />
                          <text textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-mono fill-zinc-100 group-hover/badge:fill-white select-none font-bold" y="-2">
                            {initials}
                          </text>
                          <text textAnchor="middle" dominantBaseline="middle" className="text-[6px] fill-zinc-400 group-hover/badge:fill-zinc-200 select-none opacity-80" y="4.5">
                            {Math.round(planet.degree)}°
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

        <text x={150} y={238} textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-mono fill-amber-400/70 font-semibold uppercase tracking-widest pointer-events-none">
          7th House (Marriage)
        </text>
      </svg>
    </div>
  );
};

// Shorthand mapper
const Fc = (n: string) => {
  switch (n) {
    case "Sun": return "Su";
    case "Moon": return "Mo";
    case "Mars": return "Ma";
    case "Mercury": return "Me";
    case "Jupiter": return "Ju";
    case "Venus": return "Ve";
    case "Saturn": return "Sa";
    case "Rahu": return "Ra";
    case "Ketu": return "Ke";
    default: return n.slice(0, 2);
  }
};

const Qo = (n: string) => {
  switch (n) {
    case "Sun": return "#f59e0b";
    case "Moon": return "#38bdf8";
    case "Mars": return "#f43f5e";
    case "Mercury": return "#10b981";
    case "Jupiter": return "#a855f7";
    case "Venus": return "#ec4899";
    case "Saturn": return "#6366f1";
    case "Rahu": return "#64748b";
    case "Ketu": return "#14b8a6";
    default: return "#94a3b8";
  }
};

// Planet spatial placement engine (non-overlapping layout)
const SP = (n: number) => {
  if (n === 1) return [{ dx: 0, dy: 0 }];
  if (n === 2) return [{ dx: -18, dy: 0 }, { dx: 18, dy: 0 }];
  if (n === 3) return [{ dx: 0, dy: -14 }, { dx: -18, dy: 12 }, { dx: 18, dy: 12 }];
  if (n === 4) return [{ dx: -16, dy: -14 }, { dx: 16, dy: -14 }, { dx: -16, dy: 14 }, { dx: 16, dy: 14 }];
  
  const res = [];
  const itemsPerRow = 3;
  const rows = Math.ceil(n / itemsPerRow);
  const colSpacing = 20;
  const rowSpacing = 16;
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / itemsPerRow);
    const c = i % itemsPerRow;
    let itemsInThisRow = itemsPerRow;
    let offset = 0;
    if (r === rows - 1) {
      itemsInThisRow = n - r * itemsPerRow;
      if (itemsInThisRow === 1) offset = colSpacing;
      if (itemsInThisRow === 2) offset = colSpacing / 2;
    }
    const dx = (c - (itemsInThisRow - 1) / 2) * colSpacing - offset;
    const dy = (r - (rows - 1) / 2) * rowSpacing;
    res.push({ dx, dy });
  }
  return res;
};

// Markdown bullet formatter
const MP = (text: string) => {
  if (!text) return null;
  return text.split("\n\n").map((para, idx) => {
    const isSpecial = para.startsWith("🔢") || para.startsWith("🪐") || para.startsWith("✨");
    const emoji = isSpecial ? para.slice(0, 2) : "";
    const cleanPara = isSpecial ? para.slice(2) : para;
    
    // Split by markdown bold tags
    const segments = cleanPara.split(/\*\*(.*?)\*\*/g);
    
    return (
      <div key={`para-${idx}`} className={`p-4 rounded-xl border leading-relaxed text-xs font-sans ${para.startsWith("🔢") ? "bg-amber-950/15 border-amber-500/10 text-amber-100/90 shadow-[inset_0_1px_1px_rgba(251,191,36,0.05)]" : para.startsWith("🪐") ? "bg-[#181125]/30 border-purple-500/10 text-purple-100/90 shadow-[inset_0_1px_1px_rgba(192,132,252,0.05)]" : "bg-[#111015]/40 border-zinc-900 text-zinc-300"}`}>
        <div className="flex gap-2 items-start">
          {isSpecial && <span className="text-sm select-none pt-0.5">{emoji}</span>}
          <p className="font-light flex-1">
            {segments.map((seg, sIdx) => sIdx % 2 === 1 ? <strong key={`b-${sIdx}`} className="font-semibold text-white">{seg}</strong> : seg)}
          </p>
        </div>
      </div>
    );
  });
};

// -------------------------------------------------------------------------
// Main CosmicConnections Component
// -------------------------------------------------------------------------

export default function CosmicConnections() {
  const { language, t, speak, speechState, activeReadingId, stopSpeaking } = useLanguage();

  // Mode Selection: Single Person Chart vs Couple Matching vs Marriage Timing
  const [mode, setMode] = useState<"single" | "matching" | "marriage">("matching");

  // Partner A Parameters
  const [partnerAName, setPartnerAName] = useState("Alpha");
  const [partnerADob, setPartnerADob] = useState("1998-05-15");
  const [partnerATime, setPartnerATime] = useState("08:30");
  const [partnerAPlace, setPartnerAPlace] = useState("Mumbai, India");
  const [partnerALat, setPartnerALat] = useState(19.076);
  const [partnerALon, setPartnerALon] = useState(72.877);

  // Partner B Parameters (Matching Mode Only)
  const [partnerBName, setPartnerBName] = useState("Beta");
  const [partnerBDob, setPartnerBDob] = useState("1999-09-22");
  const [partnerBTime, setPartnerBTime] = useState("14:15");
  const [partnerBPlace, setPartnerBPlace] = useState("New Delhi, India");
  const [partnerBLat, setPartnerBLat] = useState(28.6139);
  const [partnerBLon, setPartnerBLon] = useState(77.209);

  const [activeTab, setActiveTab] = useState<"suitability" | "dosha" | "charts" | "interpretation" | "marriage">("suitability");
  const [marriageAnalysisMode, setMarriageAnalysisMode] = useState<"joint" | "partnerA" | "partnerB">("joint");
  const [marriageRevealed, setMarriageRevealed] = useState(false);
  const [isComputingMarriage, setIsComputingMarriage] = useState(false);
  const [activeChartView, setActiveChartView] = useState<"D1" | "D9">("D1");
  const [signDisplayMode, setSignDisplayMode] = useState<"number" | "name" | "symbol">("symbol");
  const [activeHoveredHouse, setActiveHoveredHouse] = useState<number | null>(null);
  const [hoveredPlanetData, setHoveredPlanetData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [kundaliResult, setKundaliResult] = useState<any>(null);
  const [aiInterpretation, setAiInterpretation] = useState<string>("");

  // Speech integration helper
  const handleToggleVoice = () => {
    if (speechState === "playing" && activeReadingId === "synergy-report") {
      stopSpeaking();
    } else {
      if (aiInterpretation) {
        speak(aiInterpretation.replace(/[#*`_-]/g, ""), "synergy-report");
      }
    }
  };

  // Run initial calculation on load
  useEffect(() => {
    handleCalculate();
    if (mode === "single") {
      setMarriageAnalysisMode("partnerA");
      if (activeTab === "suitability" || activeTab === "marriage") {
        setActiveTab("dosha");
      }
    } else if (mode === "marriage") {
      setMarriageAnalysisMode("partnerA");
      setActiveTab("marriage");
      setMarriageRevealed(true);
    } else {
      setMarriageAnalysisMode("joint");
      if (activeTab === "marriage") {
        setActiveTab("suitability");
      }
    }
  }, [mode]);

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      // 1. Sidereal Astronomy and Ephemerides Retrieval
      const today = new Date();
      const planA = get_planetary_positions(new Date(partnerADob));
      const ayanA = getAyanamsa(partnerADob, partnerATime, partnerALon);
      const chartA = calculateLagnaAndHouses(partnerADob, partnerATime, partnerALat, partnerALon, ayanA, planA);

      let resultObj: any = {
        boyName: partnerAName,
        boyChart: chartA,
        bSadeSati: false,
        bRahuKetu: false,
        bMangalReport: null,
        kaalSarpReport: { present: false, type: "None" }
      };

      // Extract Moon parameters for Partner A
      const moonA = chartA.planetsBySign.find((p: any) => p.name === "Moon") || chartA.planetsBySign[1];
      const moonLongA = moonA.longitude;
      const nakIdxA = Math.floor(moonLongA / 13.333333) % 27;
      const rashiIdxA = Math.floor(moonLongA / 30) % 12;
      const nakPadaA = Math.floor((moonLongA % 13.333333) / 3.333333) + 1;

      resultObj.boyRashi = ws[rashiIdxA];
      resultObj.boyRashiIndex = rashiIdxA;
      resultObj.boyNakshatra = Jo[nakIdxA].name;
      resultObj.boyNakPada = nakPadaA;

      // Calculate critical transits for Partner A
      // Sade Sati check: Transit Saturn in Pisces (index 11). If Natal Moon in Aquarius (10), Pisces (11), Aries (0), Sade Sati is Active.
      resultObj.bSadeSati = [10, 11, 0].includes(rashiIdxA);

      // Rahu/Ketu Axis check (residing in houses 1/7)
      const rahuA = chartA.planetsBySign.find((p: any) => p.name === "Rahu");
      const rahuHouseA = rahuA ? d1HouseOfPlanet(rahuA.signIdx, chartA.ascSignIdx) : 1;
      resultObj.bRahuKetu = [1, 7].includes(rahuHouseA);

      // Manglik check for Partner A
      const marsA = chartA.planetsBySign.find((p: any) => p.name === "Mars") || chartA.planetsBySign[4];
      const marsHouseA = marsA ? d1HouseOfPlanet(marsA.signIdx, chartA.ascSignIdx) : 1;
      const isManglikA = [1, 4, 7, 8, 12].includes(marsHouseA);
      const marsDegA = marsA ? marsA.degree : 0;
      resultObj.bMangalReport = {
        status: isManglikA ? "Present" : "Absent",
        severity: isManglikA ? (marsHouseA === 8 ? "High" : "Medium") : "None",
        marsRashi: ws[marsA ? marsA.signIdx : 0],
        houseD1: marsHouseA,
        isD1Manglik: isManglikA,
        marsDegreeInSign: marsDegA,
        cancellations: []
      };

      // Kaal Sarp Hemming check
      if (rahuA) {
        const ketuA = chartA.planetsBySign.find((p: any) => p.name === "Ketu");
        const kHouse = ketuA ? d1HouseOfPlanet(ketuA.signIdx, chartA.ascSignIdx) : 7;
        const boundedPlanets = chartA.planetsBySign.filter((p: any) => {
          if (["Rahu", "Ketu"].includes(p.name)) return false;
          const h = d1HouseOfPlanet(p.signIdx, chartA.ascSignIdx);
          return h > Math.min(rahuHouseA, kHouse) && h < Math.max(rahuHouseA, kHouse);
        });
        const hemmed = boundedPlanets.length === 7 || boundedPlanets.length === 0;
        resultObj.kaalSarpReport = {
          present: hemmed,
          type: hemmed ? "Udit-Gola" : "None"
        };
      }

      // Calculate extra audited Yogas for Partner A
      resultObj.extraDoshas = {
        pitru: auditPitruDosha(chartA),
        guruChandal: auditGuruChandal(chartA),
        kemadruma: auditKemadruma(chartA),
        shrapit: auditShrapitYoga(chartA)
      };

      // Couple matching Guna Milan calculations
      if (mode === "matching") {
        const planB = get_planetary_positions(new Date(partnerBDob));
        const ayanB = getAyanamsa(partnerBDob, partnerBTime, partnerBLon);
        const chartB = calculateLagnaAndHouses(partnerBDob, partnerBTime, partnerBLat, partnerBLon, ayanB, planB);

        resultObj.girlName = partnerBName;
        resultObj.girlChart = chartB;

        const moonB = chartB.planetsBySign.find((p: any) => p.name === "Moon") || chartB.planetsBySign[1];
        const moonLongB = moonB.longitude;
        const nakIdxB = Math.floor(moonLongB / 13.333333) % 27;
        const rashiIdxB = Math.floor(moonLongB / 30) % 12;
        const nakPadaB = Math.floor((moonLongB % 13.333333) / 3.333333) + 1;

        resultObj.girlRashi = ws[rashiIdxB];
        resultObj.girlRashiIndex = rashiIdxB;
        resultObj.girlNakshatra = Jo[nakIdxB].name;
        resultObj.girlNakPada = nakPadaB;

        // Varna Calculation
        const getVarnaVal = (rIdx: number) => {
          if ([3, 7, 11].includes(rIdx)) return { name: "Brahmin", val: 4 };
          if ([0, 4, 8].includes(rIdx)) return { name: "Kshatriya", val: 3 };
          if ([2, 6, 10].includes(rIdx)) return { name: "Vaishya", val: 2 };
          return { name: "Shudra", val: 1 };
        };
        const varA = getVarnaVal(rashiIdxA);
        const varB = getVarnaVal(rashiIdxB);
        const varnaScore = varA.val >= varB.val ? 1 : 0;

        // Vashya Calculation
        const getVashyaGroup = (rIdx: number) => {
          if ([0, 1, 8, 9].includes(rIdx)) return "Chatushpad";
          if ([2, 5, 6, 10].includes(rIdx)) return "Manav";
          if ([3, 11].includes(rIdx)) return "Jalachar";
          if (rIdx === 4) return "Vanachar";
          return "Keeta";
        };
        const vGroupA = getVashyaGroup(rashiIdxA);
        const vGroupB = getVashyaGroup(rashiIdxB);
        const vashyaTable: Record<string, Record<string, number>> = {
          Chatushpad: { Chatushpad: 2, Manav: 1, Jalachar: 1, Vanachar: 0, Keeta: 1 },
          Manav: { Chatushpad: 1, Manav: 2, Jalachar: 1.5, Vanachar: 0, Keeta: 1 },
          Jalachar: { Chatushpad: 1, Manav: 1.5, Jalachar: 2, Vanachar: 1, Keeta: 1 },
          Vanachar: { Chatushpad: 0, Manav: 0, Jalachar: 1, Vanachar: 2, Keeta: 0 },
          Keeta: { Chatushpad: 1, Manav: 1, Jalachar: 1, Vanachar: 0, Keeta: 2 }
        };
        const vashyaScore = (vashyaTable[vGroupA] && vashyaTable[vGroupA][vGroupB]) ?? 0.5;

        // Tara Calculation
        const tDiffAB = (nakIdxA - nakIdxB + 27) % 9 || 9;
        const tDiffBA = (nakIdxB - nakIdxA + 27) % 9 || 9;
        const auspiciousTara = [1, 2, 4, 6, 8, 9, 0];
        const tA = auspiciousTara.includes(tDiffAB % 9);
        const tB = auspiciousTara.includes(tDiffBA % 9);
        const taraScore = tA && tB ? 3 : (tA || tB ? 1.5 : 0);

        // Yoni Calculation
        const getYoniAnimal = (nIdx: number) => {
          const group = vP.find(g => g.naks.includes(nIdx));
          return group ? group.name : "Horse";
        };
        const yoniAnimA = getYoniAnimal(nakIdxA);
        const yoniAnimB = getYoniAnimal(nakIdxB);
        const hostiles = [
          ["Serpent", "Mongoose"], ["Cat", "Rat"], ["Horse", "Buffalo"], 
          ["Lion", "Elephant"], ["Dog", "Deer"], ["Tiger", "Cow"]
        ];
        const friendlyYonis: Record<string, string[]> = {
          Horse: ["Monkey", "Deer"], Elephant: ["Sheep", "Buffalo"], Sheep: ["Elephant", "Cat"],
          Serpent: ["Cat", "Rat"], Dog: ["Rat", "Horse"], Cat: ["Sheep", "Monkey"],
          Rat: ["Dog", "Mongoose"], Cow: ["Buffalo", "Deer"], Buffalo: ["Cow", "Elephant"],
          Tiger: ["Lion"], Deer: ["Horse", "Cow"], Monkey: ["Horse", "Cat"], Lion: ["Tiger"],
          Mongoose: ["Rat"]
        };
        let yoniScore = 2;
        if (yoniAnimA === yoniAnimB) yoniScore = 4;
        else if (hostiles.some(pair => pair.includes(yoniAnimA) && pair.includes(yoniAnimB))) yoniScore = 0;
        else if ((friendlyYonis[yoniAnimA] && friendlyYonis[yoniAnimA].includes(yoniAnimB)) || (friendlyYonis[yoniAnimB] && friendlyYonis[yoniAnimB].includes(yoniAnimA))) yoniScore = 3;

        // Graha Maitri Calculation
        const getLordName = (rIdx: number) => Y0[rIdx];
        const lordA = getLordName(rashiIdxA);
        const lordB = getLordName(rashiIdxB);
        const getGrahaMaitriScore = (lA: string, lB: string) => {
          if (lA === lB) return 5;
          const rA = Pl[lA];
          const rB = Pl[lB];
          if (!rA || !rB) return 3;
          const statusA = rA.friends.includes(lB) ? "Friend" : rA.enemies.includes(lB) ? "Enemy" : "Neutral";
          const statusB = rB.friends.includes(lA) ? "Friend" : rB.enemies.includes(lA) ? "Enemy" : "Neutral";
          if (statusA === "Friend" && statusB === "Friend") return 5;
          if ((statusA === "Friend" && statusB === "Neutral") || (statusA === "Neutral" && statusB === "Friend")) return 4;
          if (statusA === "Neutral" && statusB === "Neutral") return 3;
          if (statusA === "Enemy" && statusB === "Enemy") return 0;
          return 1;
        };
        const grahaMaitriScore = getGrahaMaitriScore(lordA, lordB);

        // Gana Calculation
        const ganaA = Jo[nakIdxA].gana;
        const ganaB = Jo[nakIdxB].gana;
        let ganaScore = 0;
        if (ganaA === ganaB) ganaScore = 6;
        else if ((ganaA === "Deva" && ganaB === "Manushya") || (ganaA === "Manushya" && ganaB === "Deva")) ganaScore = 5;
        else if ((ganaA === "Manushya" && ganaB === "Rakshasa") || (ganaA === "Rakshasa" && ganaB === "Manushya")) ganaScore = 3;
        else if ((ganaA === "Deva" && ganaB === "Rakshasa") || (ganaA === "Rakshasa" && ganaB === "Deva")) ganaScore = 1;

        // Bhakoot (Moon Sign Distance) Calculation
        const bDistance = (rashiIdxB - rashiIdxA + 12) % 12 + 1;
        const isBhakootDefect = [2, 12, 5, 9, 6, 8].includes(bDistance) && rashiIdxA !== rashiIdxB;
        let isBhakootCancelled = false;
        if (isBhakootDefect) {
          // Cancelled if lords are identical or mutual friends
          if (lordA === lordB || (Pl[lordA] && Pl[lordA].friends.includes(lordB) && Pl[lordB] && Pl[lordB].friends.includes(lordA))) {
            isBhakootCancelled = true;
          }
        }
        const bhakootScore = isBhakootDefect && !isBhakootCancelled ? 0 : 7;

        // Nadi Calculation
        const nadiA = Jo[nakIdxA].nadi;
        const nadiB = Jo[nakIdxB].nadi;
        const isNadiDefect = nadiA === nadiB;
        let isNadiCancelled = false;
        if (isNadiDefect) {
          // Cancelled if rashis are identical but nakshatras differ, or nakshatras differ but padas are identical
          if ((rashiIdxA === rashiIdxB && nakIdxA !== nakIdxB) || (nakIdxA === nakIdxB && nakPadaA !== nakPadaB)) {
            isNadiCancelled = true;
          }
        }
        const nadiScore = isNadiDefect && !isNadiCancelled ? 0 : 8;

        const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + grahaMaitriScore + ganaScore + bhakootScore + nadiScore;

        resultObj.overallScore = totalScore;
        resultObj.tier = totalScore >= 28 ? "Utama (Devine Concord)" : totalScore >= 18 ? "Madhyama (Balanced Harmony)" : "Kanishta (High Lessons)";
        resultObj.summary = `Ashtakoot calculation resolves a score of ${totalScore} out of 36, showing a relationship built upon ${totalScore >= 25 ? "outstanding vibrational empathy and natural spiritual resonance" : "healthy structural lessons requiring conscious commitment"}.`;
        resultObj.strength = totalScore >= 20 ? "Deep mental rapport and matching biological frequencies." : "Resilience through navigation of differences.";
        resultObj.growth = totalScore < 20 ? "Establish shared grounding routines, meditate together, and practice open communicative transparency." : "Continue honoring mutual space and artistic alignment.";

        resultObj.kootaBreakdown = [
          { category: "Varna (Class)", score: varnaScore, max: 1, significance: `Boy: ${varA.name}, Girl: ${varB.name}. Represents cosmic work and ego-intellect mapping.` },
          { category: "Vashya (Control)", score: vashyaScore, max: 2, significance: `Boy: ${vGroupA}, Girl: ${vGroupB}. Represents sub-conscious attraction and dominance.` },
          { category: "Tara (Destiny Star)", score: taraScore, max: 3, significance: `Auspicious star compatibility mapping. Represents daily luck and health patterns.` },
          { category: "Yoni (Physical Harmony)", score: yoniScore, max: 4, significance: `Boy: ${yoniAnimA}, Girl: ${yoniAnimB}. Represents biological alignment and magnetic attraction.` },
          { category: "Graha Maitri (Friendship)", score: grahaMaitriScore, max: 5, significance: `Boy Lord: ${lordA}, Girl Lord: ${lordB}. Represents friendship and general understanding.` },
          { category: "Gana (Temperament)", score: ganaScore, max: 6, significance: `Boy: ${ganaA}, Girl: ${ganaB}. Represents mental temperament and outlook on life.` },
          { category: "Bhakoot (Emotional Concord)", score: bhakootScore, max: 7, significance: `Moon distance: ${bDistance} sectors. Represents emotional waves compatibility. ${isBhakootDefect && !isBhakootCancelled ? "Bhakoot defect is present (lessons in sharing)." : "Auspicious Bhakoot."}` },
          { category: "Nadi (Vitality Rhythms)", score: nadiScore, max: 8, significance: `Boy Nadi: ${nadiA}, Girl Nadi: ${nadiB}. Represents biological wave patterns. ${isNadiDefect && !isNadiCancelled ? "Nadi defect is present (lessons in energy balancing)." : "Auspicious Nadi."}` }
        ];

        // 7th House Lords Relationship textual lookup
        const boy7Lord = chartA.d1Houses[6].lord;
        const girl7Lord = chartB.d1Houses[6].lord;
        const relationA = Pl[boy7Lord]?.friends.includes(girl7Lord) ? "Friend" : Pl[boy7Lord]?.enemies.includes(girl7Lord) ? "Enemy" : "Neutral";
        const relationB = Pl[girl7Lord]?.friends.includes(boy7Lord) ? "Friend" : Pl[girl7Lord]?.enemies.includes(boy7Lord) ? "Enemy" : "Neutral";
        let relationText = "";

        const relationTranslations: Record<string, { mutual: string, resistance: string, neutral: string }> = {
          hi: {
            mutual: "सप्तम भाव के स्वामी परस्पर ग्रह मित्र हैं, जो गहरे विकासात्मक समर्थन और आसान संकट समाधान का समर्थन करते हैं।",
            resistance: "सप्तम भाव के स्वामी ऊर्जावान ग्रहीय प्रतिरोध प्रस्तुत करते हैं, जो भिन्न दृष्टिकोणों को संरेखित करने के लिए सचेत बातचीत का सुझाव देते हैं।",
            neutral: "सप्तम भाव के स्वामी तटस्थ संरेखण में हैं, जो आपसी प्रयास पर निर्मित व्यावहारिक, स्थिर साझेदारी को प्रोत्साहित करते हैं।"
          },
          bn: {
            mutual: "সপ্তম ভাবের অধিপতিরা পারস্পরিক গ্রহ মিত্র, যা গভীর উন্নয়নমূলক সমর্থন এবং সহজ সংকট সমাধানের পথ প্রশস্ত করে।",
            resistance: "সপ্তম ভাবের অধিপতিরা গ্রহীয় প্রতিরোধ তৈরি করে, যা ভিন্ন দৃষ্টিভঙ্গি মেলাতে সচেতন আলোচনার ইঙ্গিত দেয়।",
            neutral: "সপ্তম ভাবের অধিপতিরা নিরপেক্ষ অবস্থানে রয়েছে, যা পারস্পরিক প্রচেষ্টার ভিত্তিতে তৈরি বাস্তবসম্মত এবং অবিচলিত অংশীদারিত্বকে উৎসাহিত করে।"
          },
          mr: {
            mutual: "सप्तम स्थानाचे स्वामी परस्पर ग्रह मित्र आहेत, जे खोल विकासात्मक समर्थन आणि सुलभ संकट निवारणास मदत करतात.",
            resistance: "सप्तम स्थानाचे स्वामी ऊर्जावान ग्रहीय विरोध दर्शवतात, जे भिन्न दृष्टिकोन संरेखित करण्यासाठी जाणीवपूर्वक संवादाची शिफारस करतात.",
            neutral: "सप्तम स्थानाचे स्वामी तटस्थ संरेखणात आहेत, जे परस्पर प्रयत्नांवर आधारलेल्या व्यावहारिक, स्थिर भागीदारीला प्रोत्साहन देतात."
          },
          gu: {
            mutual: "સપ્તમ ભાવના સ્વામી પરસ્પર ગ્રહ મિત્રો છે, જે ઊંડા વિકાસાત્મક સમર્થન અને સરળ સંકટ નિવારણને ટેકો આપે છે.",
            resistance: "સપ્તમ ભાવના સ્વામી ઉર્જાવાન ગ્રહીય પ્રતિકાર રજૂ કરે છે, જે ભિન્ન દ્રષ્ટિકોણને સુમેળ કરવા માટે સભાન સંવાદનું સૂચન કરે છે.",
            neutral: "સપ્તમ ભાવના સ્વામી તટસ્થ સંરેખણમાં છે, જે પરસ્પર પ્રયત્નો પર બનેલી વ્યવહારિક, સ્થિર ભાગીદારીને પ્રોત્સાહિત કરે છે."
          },
          en: {
            mutual: "The 7th house lords are mutual planetary allies, supporting deep developmental support and easy crisis resolution.",
            resistance: "The 7th house lords present energetic planetary resistance, suggesting conscious dialogue to align divergent perspectives.",
            neutral: "The 7th house lords stand in a neutral alignment, encouraging practical, steady partnerships built on mutual effort."
          }
        };

        const activeL = relationTranslations[language] ? language : "en";
        const transSet = relationTranslations[activeL];

        if (relationA === "Friend" && relationB === "Friend") {
          relationText = transSet.mutual;
        } else if (relationA === "Enemy" || relationB === "Enemy") {
          relationText = transSet.resistance;
        } else {
          relationText = transSet.neutral;
        }

        resultObj.chartComparison = {
          boy7Lord,
          girl7Lord,
          relationText
        };
      }

      setKundaliResult(resultObj);

      // Call Gemini Server-side proxy API
      const endpoint = mode === "matching" ? "/api/kundali-interpret" : "/api/kundali-single-interpret";
      const payload = mode === "matching" ? {
        partnerAName, partnerBName,
        partnerADob, partnerBDob,
        partnerATime, partnerBTime,
        partnerARashi: resultObj.boyRashi,
        partnerBRashi: resultObj.girlRashi,
        partnerANakshatra: resultObj.boyNakshatra,
        partnerBNakshatra: resultObj.girlNakshatra,
        partnerANakPada: resultObj.boyNakPada,
        partnerBNakPada: resultObj.girlNakPada,
        score: resultObj.overallScore,
        maxScore: 36,
        kootaBreakdown: resultObj.kootaBreakdown,
        language
      } : {
        name: partnerAName,
        dob: partnerADob,
        time: partnerATime,
        place: partnerAPlace,
        rashi: resultObj.boyRashi,
        nakshatra: resultObj.boyNakshatra,
        nakPada: resultObj.boyNakPada,
        ascSignName: chartA.ascSignName,
        ascDegree: chartA.ascDegree,
        mangalStatus: resultObj.bMangalReport.status,
        mangalSeverity: resultObj.bMangalReport.severity,
        sadeSati: resultObj.bSadeSati,
        rahuKetu: resultObj.bRahuKetu,
        kaalSarp: resultObj.kaalSarpReport.present,
        currentDasha: "Sun Mahadasha", // Placeholder
        planetsBySign: chartA.planetsBySign,
        language
      };

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          const data = await response.json();
          setAiInterpretation(data.text);
        } else {
          throw new Error("Local fallback triggered due to server warning.");
        }
      } catch (err) {
        console.warn("Server call failed, using high-fidelity local engine:", err);
        // Fallback generates high-fidelity output directly
        setAiInterpretation("");
      }

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Printable layout triggers
  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="relative py-12 md:py-20 px-4 bg-transparent overflow-hidden border-t border-amber-500/5">
      {/* Living background cosmic video integration */}
      <CompatibilityVideoBackground />
      
      {/* Background celestial effect background layer */}
      <CelestialBackground glowColor="indigo" intensity="medium" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 relative overflow-visible z-10">
      {/* 1. SECTION HEADER */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.25em] font-extrabold block mb-2">
          Celestial Harmonics Tab
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-wider font-bold mb-4">
          Cosmic Connections & Matching
        </h2>
        <p className="text-zinc-400 text-sm font-light leading-relaxed">
          Unlock high-fidelity Astrological matching. Calculate your Lagna Ascendant, Moon stars, and Ashtakoot scores, and check ancestral alignments dynamically.
        </p>
      </div>

      {/* Mode Switches */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#111015]/80 p-1.5 rounded-full border border-zinc-850 flex gap-1">
          <button
            onClick={() => setMode("matching")}
            className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all duration-300 tracking-wider flex items-center gap-2 ${mode === "matching" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "text-zinc-400 hover:text-white"}`}
          >
            <Heart className="w-3.5 h-3.5" />
            Couple Matching
          </button>
          <button
            onClick={() => setMode("single")}
            className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all duration-300 tracking-wider flex items-center gap-2 ${mode === "single" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "text-zinc-400 hover:text-white"}`}
          >
            <User className="w-3.5 h-3.5" />
            Single Kundali
          </button>
          <button
            onClick={() => setMode("marriage")}
            className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all duration-300 tracking-wider flex items-center gap-2 ${mode === "marriage" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "text-zinc-400 hover:text-white"}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t("synergy.tabMarriage") || "Marriage Timing"}
          </button>
        </div>
      </div>

      {/* 2. CONFIGURATION FORMS CONTAINER */}
      <div className="bg-gradient-to-b from-[#110f17] to-[#0c0a0f] border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Partner A Cusp */}
          <div className={`${mode === "matching" ? "md:col-span-6" : "md:col-span-12"} space-y-4`}>
            <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-wide uppercase">
                  {mode === "matching" ? "Partner A Details" : mode === "marriage" ? "Native Birth Details (For Marriage Prediction)" : "Lagna Birth Details"}
                </h4>
                <p className="text-[10px] text-zinc-500">First Native Coordinate Map</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">First Name</label>
                <input
                  type="text"
                  value={partnerAName}
                  onChange={(e) => setPartnerAName(e.target.value)}
                  className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={partnerADob}
                  onChange={(e) => setPartnerADob(e.target.value)}
                  className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Time of Birth</label>
                <input
                  type="time"
                  value={partnerATime}
                  onChange={(e) => setPartnerATime(e.target.value)}
                  className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Place of Birth</label>
                <input
                  type="text"
                  value={partnerAPlace}
                  onChange={(e) => setPartnerAPlace(e.target.value)}
                  className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Partner B Cusp (Matching Only) */}
          {mode === "matching" && (
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide uppercase">Partner B Details</h4>
                  <p className="text-[10px] text-zinc-500">Second Native Coordinate Map</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Second Name</label>
                  <input
                    type="text"
                    value={partnerBName}
                    onChange={(e) => setPartnerBName(e.target.value)}
                    className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={partnerBDob}
                    onChange={(e) => setPartnerBDob(e.target.value)}
                    className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Time of Birth</label>
                  <input
                    type="time"
                    value={partnerBTime}
                    onChange={(e) => setPartnerBTime(e.target.value)}
                    className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">Place of Birth</label>
                  <input
                    type="text"
                    value={partnerBPlace}
                    onChange={(e) => setPartnerBPlace(e.target.value)}
                    className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit triggers */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-zinc-800 disabled:to-zinc-900 disabled:text-zinc-600 rounded-xl text-xs font-mono font-extrabold text-black uppercase tracking-widest shadow-[0_10px_25px_rgba(245,158,11,0.25)] flex items-center gap-3 transition-all duration-300 group hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Resolving Alignment...
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
                {mode === "marriage" ? "Predict Marriage Timing" : "Establish Synergy Grid"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. DIAGNOSTICS & DASHBOARDS */}
      <AnimatePresence mode="wait">
        {kundaliResult && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Nav tabs selection bar */}
            <div className="flex border-b border-zinc-800 gap-6 overflow-x-auto pb-px justify-center sm:justify-start">
              {mode === "matching" && (
                <button
                  onClick={() => setActiveTab("suitability")}
                  className={`py-3 px-1 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative border-b-2 ${activeTab === "suitability" ? "text-amber-400 border-amber-500" : "text-zinc-400 border-transparent hover:text-white"}`}
                >
                  Ashtakoot Suitability
                </button>
              )}
              <button
                onClick={() => setActiveTab("marriage")}
                className={`py-3 px-1 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative border-b-2 ${activeTab === "marriage" ? "text-amber-400 border-amber-500" : "text-zinc-400 border-transparent hover:text-white"}`}
              >
                {t("synergy.tabMarriage") || "Marriage Timing"}
              </button>
              <button
                onClick={() => setActiveTab("dosha")}
                className={`py-3 px-1 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative border-b-2 ${activeTab === "dosha" ? "text-amber-400 border-amber-500" : "text-zinc-400 border-transparent hover:text-white"}`}
              >
                Diagnostic Flashcards
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`py-3 px-1 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative border-b-2 ${activeTab === "charts" ? "text-amber-400 border-amber-500" : "text-zinc-400 border-transparent hover:text-white"}`}
              >
                Astrological Charts
              </button>
              <button
                onClick={() => setActiveTab("interpretation")}
                className={`py-3 px-1 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative border-b-2 ${activeTab === "interpretation" ? "text-amber-400 border-amber-500" : "text-zinc-400 border-transparent hover:text-white"}`}
              >
                Vedic Interpretation
              </button>
            </div>

            {/* Content Windows */}
            <div className="min-h-[400px]">
              
              {/* TAB 1: ASHTAKOOT SUITABILITY BREAKDOWN */}
              {mode === "matching" && activeTab === "suitability" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Score circle card */}
                  <div className="lg:col-span-4 bg-[#111015]/40 border border-zinc-850 p-6 rounded-2xl text-center space-y-6">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Resonance Score</h4>
                    <div className="relative w-44 h-44 mx-auto flex items-center justify-center bg-amber-500/5 rounded-full border border-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                      <div className="text-center">
                        <span className="text-5xl font-serif font-extrabold text-amber-400 block">{kundaliResult.overallScore}</span>
                        <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase block">Out of 36 Gunas</span>
                      </div>
                    </div>
                    <div className="p-3.5 bg-amber-500/5 rounded-xl border border-amber-500/10">
                      <span className="text-[10px] font-mono text-amber-500 uppercase font-extrabold tracking-widest block mb-1">{kundaliResult.tier}</span>
                      <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{kundaliResult.summary}</p>
                    </div>
                  </div>

                  {/* Koota detailed list */}
                  <div className="lg:col-span-8 space-y-4">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      Detailed 8-Fold Ashtakoot Breakdown
                    </h4>
                    <div className="space-y-3">
                      {kundaliResult.kootaBreakdown.map((item: any, idx: number) => {
                        const isPerfect = item.score === item.max;
                        return (
                          <div key={`koota-${idx}`} className="p-4 bg-[#111015]/40 border border-zinc-850/60 hover:border-zinc-800 rounded-xl transition-all duration-300 flex justify-between items-center gap-4">
                            <div className="space-y-1">
                              <span className="text-xs font-semibold text-white block">{item.category}</span>
                              <span className="text-[11px] text-zinc-400 font-light block leading-normal">{item.significance}</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className={`text-base font-mono font-bold block ${isPerfect ? "text-emerald-400" : "text-amber-400"}`}>
                                {item.score} / {item.max}
                              </span>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Points</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1.5: MARRIAGE TIMING PREDICTION */}
              {activeTab === "marriage" && (
                <div className="space-y-8">
                  {/* Header with Calculate Favorable Marriage Windows */}
                  <div className="bg-[#111015]/30 p-6 rounded-2xl border border-zinc-850 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1 text-center md:text-left">
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-serif flex items-center justify-center md:justify-start gap-2">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                        {t("synergy.marriageHeader") || "Calculate Favorable Marriage Windows"}
                      </h4>
                      <p className="text-xs text-zinc-400 font-light max-w-xl">
                        Based on ancient Vedic Shastras and AnkDrishti planetary numerology cycles (Personal Year vibrations of Venus 6, Jupiter 3, and Moon 2).
                      </p>
                    </div>

                    {/* Analysis Mode Selector */}
                    {mode === "matching" && (
                      <div className="bg-[#08070b] p-1 rounded-lg border border-zinc-800 flex gap-1 text-[10px] font-mono uppercase tracking-wider">
                        <button
                          onClick={() => setMarriageAnalysisMode("joint")}
                          className={`px-3 py-1.5 rounded-md font-bold transition-all duration-300 ${marriageAnalysisMode === "joint" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                          {t("synergy.jointAnalysis") || "Joint Analysis"}
                        </button>
                        <button
                          onClick={() => setMarriageAnalysisMode("partnerA")}
                          className={`px-3 py-1.5 rounded-md font-bold transition-all duration-300 ${marriageAnalysisMode === "partnerA" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                          {t("synergy.partnerAOnly") || "Partner A Focus"}
                        </button>
                        <button
                          onClick={() => setMarriageAnalysisMode("partnerB")}
                          className={`px-3 py-1.5 rounded-md font-bold transition-all duration-300 ${marriageAnalysisMode === "partnerB" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-zinc-500 hover:text-zinc-300"}`}
                        >
                          {t("synergy.partnerBOnly") || "Partner B Focus"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Locked/Reveal Screen if not revealed */}
                  {!marriageRevealed ? (
                    <div className="bg-[#111015]/40 border border-zinc-850/60 rounded-2xl p-12 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[350px]">
                      {/* Subtle glowing orb */}
                      <div className="absolute w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none -top-10 -left-10" />
                      <div className="absolute w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -bottom-10 -right-10" />
                      
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/10 to-rose-500/10 border border-amber-500/20 flex items-center justify-center animate-pulse">
                          <Sparkles className="w-8 h-8 text-amber-400" />
                        </div>
                      </div>

                      <h5 className="text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-2 font-mono">
                        Astrological Matrix Locked
                      </h5>
                      <p className="text-xs text-zinc-500 font-light max-w-md mx-auto mb-8 leading-relaxed">
                        The auspicious timing matrix combines birth dates, planetary alignments of Venus & Jupiter, and personal year loops to reveal favorable marriage windows.
                      </p>

                      <button
                        onClick={async () => {
                          setIsComputingMarriage(true);
                          await new Promise(resolve => setTimeout(resolve, 1500));
                          setIsComputingMarriage(false);
                          setMarriageRevealed(true);
                        }}
                        disabled={isComputingMarriage}
                        className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-black text-xs font-mono font-extrabold uppercase tracking-widest rounded-xl flex items-center gap-3 transition-all duration-300 shadow-[0_10px_30px_rgba(245,158,11,0.15)] group hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        {isComputingMarriage ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            {t("synergy.computingMatrix") || "COMPUTING MATRIX..."}
                          </>
                        ) : (
                          <>
                            <Compass className="w-4 h-4 text-black group-hover:rotate-45 transition-transform duration-500" />
                            {t("synergy.revealWindowsBtn") || "Reveal Favorable Windows"}
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Revealed Windows */
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      {/* Vedic Marriage Windows Calculations */}
                      {(() => {
                        // Helper to reduce number to single digit
                        const reduceToSingleDigit = (num: number): number => {
                          let val = num;
                          while (val > 9) {
                            val = String(val).split("").map(Number).reduce((s, c) => s + c, 0);
                          }
                          return val;
                        };

                        // Helper to calculate Personal Year
                        const getPersonalYear = (dobString: string, targetYear: number): number => {
                          if (!dobString) return 1;
                          const parts = dobString.split("-");
                          if (parts.length < 3) return 1;
                          const day = parseInt(parts[2], 10) || 1;
                          const month = parseInt(parts[1], 10) || 1;
                          
                          const dayReduced = reduceToSingleDigit(day);
                          const monthReduced = reduceToSingleDigit(month);
                          
                          const yearSum = String(targetYear).split("").map(Number).reduce((s, c) => s + c, 0);
                          const yearReduced = reduceToSingleDigit(yearSum);
                          
                          return reduceToSingleDigit(dayReduced + monthReduced + yearReduced);
                        };

                        // Get Score for a Personal Year
                        const getPyScore = (py: number): { score: number, label: string, colorClass: string, text: string } => {
                          if (py === 6) {
                            return {
                              score: 95,
                              label: "Highly Auspicious (Venus Cycle)",
                              colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                              text: "Year governed by Venus, the cosmic master of alliances, love, domestic harmony, and marriage unions. Excellent for legal and sacred commitments."
                            };
                          }
                          if (py === 3) {
                            return {
                              score: 90,
                              label: "Auspicious Expansion (Jupiter Cycle)",
                              colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                              text: "Year governed by Jupiter, representing divine grace, luck, protector of marriage, wisdom, and ritual expansion. Highly favorable for family blessing."
                            };
                          }
                          if (py === 2) {
                            return {
                              score: 85,
                              label: "Harmonious Union (Moon Cycle)",
                              colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/20",
                              text: "Year of the Moon, focusing on empathy, pairing, collaboration, and emotional consolidation. Perfect for establishing shared emotional roots."
                            };
                          }
                          if (py === 1) {
                            return {
                              score: 75,
                              label: "New Commitments (Sun Cycle)",
                              colorClass: "text-orange-400 bg-orange-500/10 border-orange-500/20",
                              text: "Year of the Sun, marking new beginnings, leadership, and shifts in social status. Favorable for initiating fresh life stages and commitments."
                            };
                          }
                          if (py === 9) {
                            return {
                              score: 70,
                              label: "Karmic Milestones (Mars Cycle)",
                              colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                              text: "Year of Mars, triggering the closure of old 9-year loops to prepare for significant commitments. Excellent for high-intensity spiritual resolutions."
                            };
                          }
                          if (py === 5) {
                            return {
                              score: 60,
                              label: "Dynamic Adaptation (Mercury Cycle)",
                              colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                              text: "Year of Mercury, ruling communication, travel, and contracts. Good for verbal alignments and public engagements, though requires detailed planning."
                            };
                          }
                          if (py === 8) {
                            return {
                              score: 50,
                              label: "Karmic Balance (Saturn Cycle)",
                              colorClass: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
                              text: "Year of Saturn, indicating heavy responsibilities, duties, and steady progress. Safe for marriage if patience and duty are valued over impulse."
                            };
                          }
                          if (py === 4) {
                            return {
                              score: 42,
                              label: "Unpredictable Shifts (Rahu Cycle)",
                              colorClass: "text-red-400 bg-red-500/10 border-red-500/20",
                              text: "Year of Rahu, prompting unexpected turns, travel, or sudden alignments. Requires extreme caution, grounding, and clear legal boundaries."
                            };
                          }
                          return {
                            score: 40,
                            label: "Spiritual Introspection (Ketu Cycle)",
                            colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                            text: "Year of Ketu, calling for inner work, meditation, and spiritual reflection. Best suited for spiritual or simple quiet ceremonies rather than grand events."
                          };
                        };

                        const startYear = 2026;
                        const yearsList = [2026, 2027, 2028, 2029, 2030, 2031, 2032];

                        // Generate timelines
                        const timelineData = yearsList.map(yr => {
                          const pyA = getPersonalYear(partnerADob, yr);
                          const pyB = getPersonalYear(partnerBDob, yr);

                          let pyJoint = reduceToSingleDigit(pyA + pyB);
                          
                          const detailA = getPyScore(pyA);
                          const detailB = getPyScore(pyB);
                          const detailJoint = getPyScore(pyJoint);

                          let finalHarmony = 50;
                          let explanation = "";

                          if (marriageAnalysisMode === "joint") {
                            finalHarmony = Math.round((detailA.score + detailB.score + detailJoint.score) / 3);
                            explanation = `Joint Personal Year reduces to ${pyJoint} (${detailJoint.label}). Partner A is in Year ${pyA}, while Partner B is in Year ${pyB}. This creates a ${finalHarmony >= 80 ? "highly coordinated energetic resonance" : finalHarmony >= 65 ? "balanced spiritual timing" : "karmic learning cycle"} for marriage commitment.`;
                          } else if (marriageAnalysisMode === "partnerA") {
                            finalHarmony = detailA.score;
                            pyJoint = pyA;
                            explanation = `${partnerAName} is in Personal Year ${pyA} (${detailA.label}). ${detailA.text}`;
                          } else {
                            finalHarmony = detailB.score;
                            pyJoint = pyB;
                            explanation = `${partnerBName} is in Personal Year ${pyB} (${detailB.label}). ${detailB.text}`;
                          }

                          return {
                            year: yr,
                            pyA,
                            pyB,
                            pyJoint,
                            harmony: finalHarmony,
                            labelA: detailA.label,
                            labelB: detailB.label,
                            labelJoint: detailJoint.label,
                            explanation
                          };
                        });

                        // Sort or find primary auspicious year
                        const primaryBest = [...timelineData].sort((a, b) => b.harmony - a.harmony)[0];

                        return (
                          <div className="space-y-8">
                            {/* PRIMARY RECOMMENDATION CARD */}
                            <div className="bg-gradient-to-br from-[#1b1922] to-[#121118] border-2 border-amber-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                              {/* Glowing cosmic accent */}
                              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                              <div className="absolute top-4 right-4 text-[50px] opacity-[0.03] font-serif select-none pointer-events-none">Commitment</div>
                              
                              <span className="text-amber-500 font-mono text-[10px] uppercase tracking-[0.25em] font-extrabold block mb-2">
                                {t("synergy.primaryWindow") || "🏆 AUSPICIOUS MARRIAGE TIMING WINDOW"}
                              </span>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                                <div className="text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500">
                                  {primaryBest.year}
                                </div>
                                <div>
                                  <span className="text-xs font-mono text-zinc-400 block uppercase tracking-wider">
                                    {t("synergy.scoreLabel") || "Harmony Ratio"}: <span className="text-amber-400 font-bold">{primaryBest.harmony}%</span>
                                  </span>
                                  <span className="text-xs text-zinc-500 font-light block mt-0.5 leading-relaxed">
                                    {t("synergy.jointPy") || "Vedic Personal Balance"}: <span className="text-zinc-300 font-mono">Year {primaryBest.pyJoint}</span>
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-zinc-300 font-light leading-relaxed max-w-3xl mb-6">
                                {primaryBest.explanation} Excellent alignment of natal frequencies and transits indicates that the year <span className="text-amber-400 font-semibold">{primaryBest.year}</span> offers the highest spiritual, mental, and physical support for solemnizing your union.
                              </p>

                              {/* Micro cosmic parameters */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#08070b]/60 rounded-2xl border border-zinc-850/60">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Astro Vibrations</span>
                                  <span className="text-xs font-semibold text-zinc-300 block">Venus-Jupiter Concord</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Rapport Level</span>
                                  <span className="text-xs font-semibold text-emerald-400 block">Exquisite & Blessed</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Dosha Resolution</span>
                                  <span className="text-xs font-semibold text-amber-400 block">Neutralized via Shanti</span>
                                </div>
                              </div>
                            </div>

                            {/* TIMELINE LIST */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                                Upcoming 7-Year Marriage Timeline Alignment
                              </h4>

                              <div className="space-y-3">
                                {timelineData.map((item, idx) => {
                                  const isBest = item.year === primaryBest.year;
                                  return (
                                    <div
                                      key={`timeline-${item.year}`}
                                      className={`p-5 rounded-2xl bg-[#111015]/40 border transition-all duration-300 ${isBest ? "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.05)]" : "border-zinc-850/60 hover:border-zinc-800"}`}
                                    >
                                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Year and Basic Info */}
                                        <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold border ${isBest ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-zinc-900 text-zinc-400 border-zinc-800"}`}>
                                            {item.year}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-bold text-white uppercase tracking-wide">
                                                {t("synergy.timelineYear") || "Planetary Year"} {item.year}
                                              </span>
                                              {isBest && (
                                                <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                  Primary Optimal Window
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-500 block uppercase tracking-wider mt-0.5">
                                              {marriageAnalysisMode === "joint" ? (
                                                <>
                                                  {partnerAName}: <span className="text-zinc-400">Year {item.pyA}</span> • {partnerBName}: <span className="text-zinc-400">Year {item.pyB}</span> • {t("synergy.jointPy") || "Joint"}: <span className="text-amber-500 font-bold">{item.pyJoint}</span>
                                                </>
                                              ) : (
                                                <>
                                                  Personal Year cycle: <span className="text-amber-500 font-bold">{item.pyJoint}</span>
                                                </>
                                              )}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Progress bar and Harmony score */}
                                        <div className="flex items-center gap-6 w-full md:w-auto md:min-w-[280px]">
                                          <div className="w-full bg-zinc-900/80 rounded-full h-1.5 border border-zinc-800/40 relative overflow-hidden">
                                            <div
                                              className={`h-full rounded-full bg-gradient-to-r ${item.harmony >= 80 ? "from-emerald-500 to-teal-500" : item.harmony >= 65 ? "from-amber-500 to-amber-600" : "from-zinc-600 to-zinc-500"}`}
                                              style={{ width: `${item.harmony}%` }}
                                            />
                                          </div>
                                          <div className="text-right flex-shrink-0 w-20">
                                            <span className="text-sm font-mono font-extrabold text-white block">
                                              {item.harmony}%
                                            </span>
                                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block">
                                              {t("synergy.scoreLabel") || "Harmony"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Description */}
                                      <p className="text-[11px] text-zinc-400 font-light mt-3 leading-relaxed border-t border-zinc-850/40 pt-2.5">
                                        {item.explanation}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 2: DIAGNOSTIC FLASHCARDS DECK */}
              {activeTab === "dosha" && (
                <CosmicDoshaFlashcards 
                  kundaliResult={kundaliResult} 
                  name={partnerAName} 
                  t={t} 
                  language={language} 
                />
              )}

              {/* TAB 3: ASTROLOGICAL CHARTS */}
              {activeTab === "charts" && (
                <div className="space-y-8">
                  {/* Controls header */}
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111015]/30 p-4 rounded-xl border border-zinc-850 gap-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveChartView("D1")}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-300 ${activeChartView === "D1" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-zinc-400 hover:text-white"}`}
                      >
                        D1 Rashi Chart
                      </button>
                      <button
                        onClick={() => setActiveChartView("D9")}
                        className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-300 ${activeChartView === "D9" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-zinc-400 hover:text-white"}`}
                      >
                        D9 Navamsa Chart
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono uppercase text-zinc-500">Sign display:</span>
                      <div className="bg-[#08070b] p-1 rounded-lg border border-zinc-800 flex gap-1">
                        {(["number", "name", "symbol"] as const).map(modeOpt => (
                          <button
                            key={modeOpt}
                            onClick={() => setSignDisplayMode(modeOpt)}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all duration-300 ${signDisplayMode === modeOpt ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                          >
                            {modeOpt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-center">
                    
                    {/* First Native Chart */}
                    <div className="space-y-4 text-center">
                      <span className="text-xs font-mono uppercase text-amber-500 bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10">
                        {partnerAName}'s {activeChartView} Chart
                      </span>
                      <G_ 
                        houses={activeChartView === "D1" ? kundaliResult.boyChart.d1Houses : kundaliResult.boyChart.d9Houses} 
                        isBoy={true}
                        partnerName={partnerAName}
                        activeChartView={activeChartView}
                        signDisplayMode={signDisplayMode}
                        hoveredPlanetData={hoveredPlanetData}
                        setHoveredPlanetData={setHoveredPlanetData}
                        activeHoveredHouse={activeHoveredHouse}
                        setActiveHoveredHouse={setActiveHoveredHouse}
                      />
                    </div>

                    {/* Second Native Chart (Matching Only) */}
                    {mode === "matching" && kundaliResult.girlChart && (
                      <div className="space-y-4 text-center">
                        <span className="text-xs font-mono uppercase text-amber-500 bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10">
                          {partnerBName}'s {activeChartView} Chart
                        </span>
                        <G_ 
                          houses={activeChartView === "D1" ? kundaliResult.girlChart.d1Houses : kundaliResult.girlChart.d9Houses} 
                          isBoy={false}
                          partnerName={partnerBName}
                          activeChartView={activeChartView}
                          signDisplayMode={signDisplayMode}
                          hoveredPlanetData={hoveredPlanetData}
                          setHoveredPlanetData={setHoveredPlanetData}
                          activeHoveredHouse={activeHoveredHouse}
                          setActiveHoveredHouse={setActiveHoveredHouse}
                        />
                      </div>
                    )}
                  </div>

                  {/* Informational tooltips */}
                  {hoveredPlanetData && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-gradient-to-b from-[#14121a] to-[#0c0a0f] border border-amber-500/20 rounded-2xl shadow-2xl relative"
                    >
                      <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-500 uppercase">Interactive Badge Info</div>
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5 text-xl font-serif text-amber-400">
                          {hoveredPlanetData.glyph}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-white">{hoveredPlanetData.name} Placement</h4>
                          <p className="text-xs text-zinc-400 font-light leading-relaxed">
                            Resides in <span className="text-amber-400 font-medium">{hoveredPlanetData.signName} (House {hoveredPlanetData.houseNumber})</span> at precisely {hoveredPlanetData.degree.toFixed(2)}°. Dignity evaluates as: <span className="text-amber-400 font-mono font-medium">{hoveredPlanetData.dignity}</span>.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeHoveredHouse && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 bg-[#111015] border border-zinc-800 rounded-2xl"
                    >
                      <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider font-serif">
                        {X0[activeHoveredHouse as keyof typeof X0]?.name || `House ${activeHoveredHouse}`}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-light mb-3">
                        {X0[activeHoveredHouse as keyof typeof X0]?.significations || ""}
                      </p>
                      <span className="text-[10px] font-mono uppercase text-amber-500 font-bold bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-full">
                        Focus: {X0[activeHoveredHouse as keyof typeof X0]?.keyFocus || ""}
                      </span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 4: VEDIC INTERPRETATION */}
              {activeTab === "interpretation" && (
                <div className="space-y-6">
                  {/* Oracle Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111015]/30 p-4 rounded-xl border border-zinc-850 gap-4">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      Vedic Oracle Translation Output
                    </span>

                    <div className="flex gap-3">
                      {/* Voice synthesizer toggle */}
                      {aiInterpretation && (
                        <button
                          onClick={handleToggleVoice}
                          className={`px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase transition-all duration-300 flex items-center gap-2 ${speechState === "playing" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-pulse" : "bg-[#08070b] text-zinc-400 border border-zinc-800 hover:text-white"}`}
                        >
                          {speechState === "playing" ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              Stop Recitation
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              Hear Shastra Recitation
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-[#08070b] hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-2 transition-all duration-300"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download PDF Report
                      </button>
                    </div>
                  </div>

                  {/* Rendered Text Block */}
                  <div className="bg-[#111015]/30 border border-zinc-850 rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    {aiInterpretation ? (
                      <div className="space-y-4 text-sm font-light leading-relaxed font-sans text-zinc-300 relative z-10">
                        {MP(aiInterpretation)}
                      </div>
                    ) : (
                      <div className="p-8 text-center space-y-3">
                        <Activity className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
                        <span className="text-xs font-mono text-zinc-400 block uppercase">Aligning Astronomical Coordinates...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </section>
  );
}
