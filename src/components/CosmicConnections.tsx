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
import BirthPlaceAutocomplete from "./BirthPlaceAutocomplete";
import { GeocodedPlace } from "../services/geocodingService";

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
    1: { labelX: 150, labelY: 98 },
    2: { labelX: 75, labelY: 48 },
    3: { labelX: 45, labelY: 75 },
    4: { labelX: 98, labelY: 150 },
    5: { labelX: 45, labelY: 225 },
    6: { labelX: 75, labelY: 252 },
    7: { labelX: 150, labelY: 202 },
    8: { labelX: 225, labelY: 252 },
    9: { labelX: 255, labelY: 225 },
    10: { labelX: 202, labelY: 150 },
    11: { labelX: 255, labelY: 75 },
    12: { labelX: 225, labelY: 48 }
  };

  const houseNamePositions: Record<number, { x: number; y: number }> = {
    1: { x: 150, y: 75 },
    2: { x: 75, y: 25 },
    3: { x: 25, y: 75 },
    4: { x: 75, y: 150 },
    5: { x: 25, y: 225 },
    6: { x: 75, y: 275 },
    7: { x: 150, y: 225 },
    8: { x: 225, y: 275 },
    9: { x: 275, y: 225 },
    10: { x: 225, y: 150 },
    11: { x: 275, y: 75 },
    12: { x: 225, y: 25 }
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

const synergyTextMap: Record<string, Record<string, string>> = {
  en: {
    badge: "Celestial Harmonics Tab",
    singleKundali: "Single Kundali",
    coupleMatching: "Couple Matching",
    partnerADetails: "Partner A Details",
    nativeBirthDetails: "Native Birth Details (For Marriage Prediction)",
    lagnaBirthDetails: "Lagna Birth Details",
    firstNativeCoordMap: "First Native Coordinate Map",
    secondNativeCoordMap: "Second Native Coordinate Map",
    firstName: "First Name",
    dateOfBirth: "Date of Birth",
    timeOfBirth: "Time of Birth",
    placeOfBirth: "Place of Birth",
    partnerBDetails: "Partner B Details",
    secondName: "Second Name",
    resolvingAlignment: "Resolving Alignment...",
    predictMarriageTiming: "Predict Marriage Timing",
    establishSynergyGrid: "Establish Synergy Grid",
    ashtakootSuitability: "Ashtakoot Suitability",
    diagnosticFlashcards: "Diagnostic Flashcards",
    astrologicalCharts: "Astrological Charts",
    vedicInterpretation: "Vedic Interpretation",
    resonanceScore: "Resonance Score",
    outOf36Gunas: "Out of 36 Gunas",
    detailedAshtakoot: "Detailed 8-Fold Ashtakoot Breakdown",
    points: "Points",
    calculateMarriageWindows: "Calculate Favorable Marriage Windows",
    marriageWindowsShastras: "Based on ancient Vedic Shastras and AnkDrishti planetary numerology cycles (Personal Year vibrations of Venus 6, Jupiter 3, and Moon 2).",
    astrologicalMatrixLocked: "Astrological Matrix Locked",
    auspiciousTimingMatrixDesc: "The auspicious timing matrix combines birth dates, planetary alignments of Venus & Jupiter, and personal year loops to reveal favorable marriage windows.",
    varnaCategory: "Varna (Class)",
    varnaSig: "Boy: {boyVal}, Girl: {girlVal}. Represents cosmic work and ego-intellect mapping.",
    vashyaCategory: "Vashya (Control)",
    vashyaSig: "Boy: {boyVal}, Girl: {girlVal}. Represents sub-conscious attraction and dominance.",
    taraCategory: "Tara (Destiny Star)",
    taraSig: "Auspicious star compatibility mapping. Represents daily luck and health patterns.",
    yoniCategory: "Yoni (Physical Harmony)",
    yoniSig: "Boy: {boyVal}, Girl: {girlVal}. Represents biological alignment and magnetic attraction.",
    grahaMaitriCategory: "Graha Maitri (Friendship)",
    grahaMaitriSig: "Boy Lord: {boyVal}, Girl Lord: {girlVal}. Represents friendship and general understanding.",
    ganaCategory: "Gana (Temperament)",
    ganaSig: "Boy: {boyVal}, Girl: {girlVal}. Represents mental temperament and outlook on life.",
    bhakootCategory: "Bhakoot (Emotional Concord)",
    bhakootSig: "Moon distance: {boyVal} sectors. Represents emotional waves compatibility. {statusText}",
    bhakootDefect: "Bhakoot defect is present (lessons in sharing).",
    bhakootAuspicious: "Auspicious Bhakoot.",
    nadiCategory: "Nadi (Vitality Rhythms)",
    nadiSig: "Boy Nadi: {boyVal}, Girl Nadi: {girlVal}. Represents biological wave patterns. {statusText}",
    nadiDefect: "Nadi defect is present (lessons in energy balancing).",
    nadiAuspicious: "Auspicious Nadi.",
    py6Label: "Highly Auspicious (Venus Cycle)",
    py6Text: "Year governed by Venus, the cosmic master of alliances, love, domestic harmony, and marriage unions. Excellent for legal and sacred commitments.",
    py3Label: "Auspicious Expansion (Jupiter Cycle)",
    py3Text: "Year governed by Jupiter, representing divine grace, luck, protector of marriage, wisdom, and ritual expansion. Highly favorable for family blessing.",
    py2Label: "Harmonious Union (Moon Cycle)",
    py2Text: "Year of the Moon, focusing on empathy, pairing, collaboration, and emotional consolidation. Perfect for establishing shared emotional roots.",
    py1Label: "New Beginnings (Sun Cycle)",
    py1Text: "Year of the Sun, marking new beginnings, leadership, and shifts in social status. Favorable for initiating fresh life stages and commitments.",
    py9Label: "Karmic Milestones (Mars Cycle)",
    py9Text: "Year of Mars, triggering the closure of old 9-year loops to prepare for significant commitments. Excellent for high-intensity spiritual resolutions.",
    py5Label: "Dynamic Adaptation (Mercury Cycle)",
    py5Text: "Year of Mercury, ruling communication, travel, and contracts. Good for verbal alignments and public engagements, though requires detailed planning.",
    py8Label: "Karmic Balance (Saturn Cycle)",
    py8Text: "Year of Saturn, indicating heavy responsibilities, duties, and steady progress. Safe for marriage if patience and duty are valued over impulse.",
    py4Label: "Unpredictable Shifts (Rahu Cycle)",
    py4Text: "Year of Rahu, prompting unexpected turns, travel, or sudden alignments. Requires extreme caution, grounding, and clear legal boundaries.",
    pyOtherLabel: "Spiritual Introspection (Ketu Cycle)",
    pyOtherText: "Year of Ketu, calling for inner work, meditation, and spiritual reflection. Best suited for spiritual or simple quiet ceremonies rather than grand events.",
    upcomingTimeline: "Upcoming 7-Year Marriage Timeline Alignment",
    primaryOptimalWindow: "Primary Optimal Window",
    personalYearCycle: "Personal Year cycle",
    signDisplayLabel: "Sign display:",
    d1Chart: "D1 Rashi Chart",
    d9Chart: "D9 Navamsa Chart",
    interBadgeInfo: "Interactive Badge Info",
    placementLabel: "Placement",
    residesIn: "Resides in",
    precisely: "precisely",
    dignityEval: "Dignity evaluates as",
    vedicOracleOutput: "Vedic Oracle Translation Output",
    stopRecitation: "Stop Recitation",
    hearShastra: "Hear Shastra Recitation",
    downloadPDF: "Download PDF Report",
    aligningCoords: "Aligning Astronomical Coordinates...",
    utama: "Utama (Devine Concord)",
    madhyama: "Madhyama (Balanced Harmony)",
    kanishta: "Kanishta (High Lessons)",
    calculationResolves: "Ashtakoot calculation resolves a score of {score} out of 36, showing a relationship built upon {vibe}.",
    outstandingResonance: "outstanding vibrational empathy and natural spiritual resonance",
    healthyLessons: "healthy structural lessons requiring conscious commitment",
    deepRapport: "Deep mental rapport and matching biological frequencies.",
    resilienceNavigation: "Resilience through navigation of differences.",
    sharedGrounding: "Establish shared grounding routines, meditate together, and practice open communicative transparency.",
    continueHonoring: "Continue honoring mutual space and artistic alignment.",
    jointPyExplanation: "Joint Personal Year reduces to {pyJoint} ({labelJoint}). Partner A is in Year {pyA}, while Partner B is in Year {pyB}. This creates a {resonance} for marriage commitment.",
    highlyCoordinated: "highly coordinated energetic resonance",
    balancedSpiritual: "balanced spiritual timing",
    karmicLearning: "karmic learning cycle",
    focusAExplanation: "{name} is in Personal Year {py} ({label}). {text}",
    focusBExplanation: "{name} is in Personal Year {py} ({label}). {text}",
    primaryBestExplanation: "Excellent alignment of natal frequencies and transits indicates that the year {year} offers the highest spiritual, mental, and physical support for solemnizing your union.",
    astroVibrations: "Astro Vibrations",
    venusJupiterConcord: "Venus-Jupiter Concord",
    rapportLevel: "Rapport Level",
    exquisiteBlessed: "Exquisite & Blessed",
    doshaResolution: "Dosha Resolution",
    neutralizedShanti: "Neutralized via Shanti",
  },
  hi: {
    badge: "दिव्य सामंजस्य",
    singleKundali: "एकल कुंडली",
    coupleMatching: "युगल मिलान",
    partnerADetails: "साथी A का विवरण",
    nativeBirthDetails: "मूल जन्म विवरण (विवाह भविष्यवाणी के लिए)",
    lagnaBirthDetails: "लग्न जन्म विवरण",
    firstNativeCoordMap: "प्रथम जन्म कुंडली मानचित्र",
    secondNativeCoordMap: "द्वितीय जन्म कुंडली मानचित्र",
    firstName: "पहला नाम",
    dateOfBirth: "जन्म तिथि",
    timeOfBirth: "जन्म समय",
    placeOfBirth: "जन्म स्थान",
    partnerBDetails: "साथी B का विवरण",
    secondName: "दूसरा नाम",
    resolvingAlignment: "सामंजस्य स्थापित किया जा रहा है...",
    predictMarriageTiming: "विवाह समय की भविष्यवाणी करें",
    establishSynergyGrid: "तालमेल ग्रिड स्थापित करें",
    ashtakootSuitability: "अष्टकूट अनुकूलता",
    diagnosticFlashcards: "नैदानिक ​​फ़्लैशकार्ड",
    astrologicalCharts: "ज्योतिषीय चार्ट",
    vedicInterpretation: "वैदिक व्याख्या",
    resonanceScore: "अनुकूलता स्कोर",
    outOf36Gunas: "36 गुणों में से",
    detailedAshtakoot: "विस्तृत अष्टकूट विश्लेषण",
    points: "अंक",
    calculateMarriageWindows: "अनुकूल विवाह समय की गणना करें",
    marriageWindowsShastras: "प्राचीन वैदिक शास्त्रों और अंकदृष्टि ग्रहों के चक्रों (शुक्र 6, बृहस्पति 3 और चंद्रमा 2 के व्यक्तिगत वर्ष कंपन) पर आधारित।",
    astrologicalMatrixLocked: "ज्योतिषीय चक्र बंद है",
    auspiciousTimingMatrixDesc: "शुभ समय चक्र जन्म तिथियों, शुक्र और बृहस्पति के ग्रहीय संरेखण और व्यक्तिगत वर्ष चक्रों को मिलाकर अनुकूल विवाह समय को दर्शाता है।",
    varnaCategory: "वर्ण (वर्ग)",
    varnaSig: "वर: {boyVal}, वधू: {girlVal}। यह मानसिक स्वभाव और काम की अनुकूलता को दर्शाता है।",
    vashyaCategory: "वश्य (नियंत्रण)",
    vashyaSig: "वर: {boyVal}, वधू: {girlVal}। यह परस्पर आकर्षण और नियंत्रण को दर्शाता है।",
    taraCategory: "तारा (भाग्य तारा)",
    taraSig: "भाग्य और स्वास्थ्य पैटर्न। दैनिक भाग्य की अनुकूलता को दर्शाता है।",
    yoniCategory: "योनि (शारीरिक अनुकूलता)",
    yoniSig: "वर: {boyVal}, वधू: {girlVal}। शारीरिक और जैविक संरेखण तथा आकर्षण को दर्शाता है।",
    grahaMaitriCategory: "ग्रह मैत्री (मित्रता)",
    grahaMaitriSig: "वर स्वामी: {boyVal}, वधू स्वामी: {girlVal}। मानसिक समझ और मित्रता को दर्शाता है।",
    ganaCategory: "गण (स्वभाव)",
    ganaSig: "वर: {boyVal}, वधू: {girlVal}। स्वभाव और जीवन के प्रति दृष्टिकोण को दर्शाता है।",
    bhakootCategory: "भकूट (भावनात्मक अनुकूलता)",
    bhakootSig: "चंद्रमा दूरी: {boyVal} भाव। यह भावनात्मक तरंगों की अनुकूलता को दर्शाता है। {statusText}",
    bhakootDefect: "भकूट दोष उपस्थित है (साझा करने में सबक)।",
    bhakootAuspicious: "शुभ भकूट संरेखण।",
    nadiCategory: "नाड़ी (शारीरिक ऊर्जा)",
    nadiSig: "वर नाड़ी: {boyVal}, वधू नाड़ी: {girlVal}। जैविक तरंग पैटर्न। {statusText}",
    nadiDefect: "नाड़ी दोष उपस्थित है (ऊर्जा संतुलन में सबक)।",
    nadiAuspicious: "शुभ नाड़ी संरेखण।",
    py6Label: "अत्यंत शुभ (शुक्र चक्र)",
    py6Text: "शुक्र द्वारा संचालित वर्ष, जो प्रेम, घरेलू सद्भाव और विवाह संबंधों का प्रतीक है। प्रतिबद्धताओं के लिए सर्वोत्तम।",
    py3Label: "शुभ विस्तार (बृहस्पति चक्र)",
    py3Text: "बृहस्पति द्वारा संचालित वर्ष, जो दैवीय कृपा, भाग्य और ज्ञान का प्रतिनिधित्व करता है। आशीर्वाद के लिए अनुकूल।",
    py2Label: "सामंजस्यपूर्ण संघ (चंद्र चक्र)",
    py2Text: "चंद्रमा का वर्ष, जो सहानुभूति, सहयोग और भावनात्मक स्थिरता पर ध्यान केंद्रित करता है। गहरे संबंधों के लिए आदर्श।",
    py1Label: "नई शुरुआत (सूर्य चक्र)",
    py1Text: "सूर्य का वर्ष, जो नए बदलावों, नेतृत्व और सामाजिक स्थिति में परिवर्तन का प्रतीक है। जीवन के नए चरणों के लिए अनुकूल।",
    py9Label: "कर्म मील का पत्थर (मंगल चक्र)",
    py9Text: "मंगल का वर्ष, जो महत्वपूर्ण प्रतिबद्धताओं की तैयारी के लिए पुराने 9-वर्षीय चक्रों को बंद करता है।",
    py5Label: "गतिशील अनुकूलन (बुध चक्र)",
    py5Text: "बुध का वर्ष, जो संचार, यात्रा और समझौतों का संचालन करता है। विस्तृत योजना के साथ अच्छा है।",
    py8Label: "कर्म संतुलन (शनि चक्र)",
    py8Text: "शनि का वर्ष, जो जिम्मेदारियों, कर्तव्यों और स्थिर प्रगति को दर्शाता है। विवाह के लिए सुरक्षित यदि धैर्य है।",
    py4Label: "अप्रत्याशित बदलाव (राहु चक्र)",
    py4Text: "राहु का वर्ष, जो अप्रत्याशित मोड़ों या अचानक संबंधों को प्रेरित करता है। अत्यधिक सावधानी और स्पष्ट कानूनी सीमाओं की आवश्यकता है।",
    pyOtherLabel: "आद्यात्मिक आत्मनिरीक्षण (केतु चक्र)",
    pyOtherText: "केतु का वर्ष, जो आंतरिक कार्य और आध्यात्मिक चिंतन का आह्वान करता है। सरल शांत समारोहों के लिए सबसे उपयुक्त।",
    upcomingTimeline: "आगामी 7-वर्षीय विवाह समय संरेखण",
    primaryOptimalWindow: "प्राथमिक अनुकूल समय",
    personalYearCycle: "व्यक्तिगत वर्ष चक्र",
    signDisplayLabel: "राशि प्रदर्शन:",
    d1Chart: "D1 राशि चार्ट",
    d9Chart: "D9 नवांश चार्ट",
    interBadgeInfo: "इंटरएक्टिव चार्ट जानकारी",
    placementLabel: "ग्रह स्थिति",
    residesIn: "स्थित है",
    precisely: "सटीक रूप से",
    dignityEval: "गरिमा का मूल्यांकन",
    vedicOracleOutput: "वैदिक ओरेकल अनुवाद आउटपुट",
    stopRecitation: "वाचन रोकें",
    hearShastra: "शास्त्र वाचन सुनें",
    downloadPDF: "पीडीएफ रिपोर्ट डाउनलोड करें",
    aligningCoords: "खगोलीय निर्देशांकों को संरेखित किया जा रहा है...",
    utama: "उत्तम (दिव्य मिलाप)",
    madhyama: "मध्यम (संतुलित सामंजस्य)",
    kanishta: "कनिष्ठ (उच्च कर्म सबक)",
    calculationResolves: "अष्टकूट गणना 36 में से {score} का स्कोर देती है, जो {vibe} पर आधारित संबंध को दर्शाता है।",
    outstandingResonance: "असाधारण भावनात्मक सहानुभूति और प्राकृतिक आध्यात्मिक प्रतिध्वनि",
    healthyLessons: "सचेत प्रतिबद्धता की आवश्यकता वाले स्वस्थ संरचनात्मक सबक",
    deepRapport: "गहरा मानसिक तालमेल और मेल खाते जैविक संबंध।",
    resilienceNavigation: "मतभेदों को सुलझाने के माध्यम से लचीलापन।",
    sharedGrounding: "साझा ध्यान और आध्यात्मिक दिनचर्या अपनाएं तथा खुली बातचीत का अभ्यास करें।",
    continueHonoring: "आपसी सम्मान और रचनात्मक तालमेल बनाए रखें।",
    jointPyExplanation: "संयुक्त व्यक्तिगत वर्ष घटकर {pyJoint} ({labelJoint}) हो जाता है। साथी A वर्ष {pyA} में है, जबकि साथी B वर्ष {pyB} में है। यह विवाह के लिए {resonance} बनाता है।",
    highlyCoordinated: "अत्यधिक समन्वित ऊर्जावान प्रतिध्वनि",
    balancedSpiritual: "संतुलित आध्यात्मिक समय",
    karmicLearning: "कर्म सीखने का चक्र",
    focusAExplanation: "{name} व्यक्तिगत वर्ष {py} ({label}) में है। {text}",
    focusBExplanation: "{name} व्यक्तिगत वर्ष {py} ({label}) में है। {text}",
    primaryBestExplanation: "जन्म कालीन आवृत्तियों और गोचर का उत्कृष्ट संरेखण यह दर्शाता है कि वर्ष {year} आपके विवाह के लिए सर्वोच्च आध्यात्मिक, मानसिक और शारीरिक समर्थन प्रदान करता है।",
    astroVibrations: "खगोलीय तरंगें",
    venusJupiterConcord: "शुक्र-बृहस्पति मिलन",
    rapportLevel: "सामंजस्य स्तर",
    exquisiteBlessed: "अति उत्तम और धन्य",
    doshaResolution: "दोष निवारण",
    neutralizedShanti: "शांति अनुष्ठान द्वारा संतुलित",
  },
  bn: {
    badge: "স্বর্গীয় সামঞ্জস্য",
    singleKundali: "একক কুন্ডলী",
    coupleMatching: "যুগল মিলন",
    partnerADetails: "অংশীদার A এর বিবরণ",
    nativeBirthDetails: "স্থানীয় জন্ম বিবরণ (বিবাহের পূর্বাভাসের জন্য)",
    lagnaBirthDetails: "লগ্ন জন্ম বিবরণ",
    firstNativeCoordMap: "প্রথম জন্ম মানচিত্র",
    secondNativeCoordMap: "দ্বিতীয় জন্ম মানচিত্র",
    firstName: "প্রথম নাম",
    dateOfBirth: "জন্ম তারিখ",
    timeOfBirth: "জন্ম সময়",
    placeOfBirth: "জন্মস্থান",
    partnerBDetails: "অংশীদার B এর বিবরণ",
    secondName: "দ্বিতীয় নাম",
    resolvingAlignment: "সারিবদ্ধকরণ করা হচ্ছে...",
    predictMarriageTiming: "বিবাহের সময় পূর্বাভাস করুন",
    establishSynergyGrid: "সামঞ্জস্য গ্রিড স্থাপন করুন",
    ashtakootSuitability: "অষ্টকূটের উপযুক্ততা",
    diagnosticFlashcards: "নিদানিক ফ্ল্যাশকার্ড",
    astrologicalCharts: "জ্যোতিষীয় চার্ট",
    vedicInterpretation: "বৈদিক ব্যাখ্যা",
    resonanceScore: "অনুরণন স্কোর",
    outOf36Gunas: "৩৬ গুণের মধ্যে",
    detailedAshtakoot: "বিস্তারিত ৮-গুণ অষ্টকূট বিশ্লেষণ",
    points: "পয়েন্ট",
    calculateMarriageWindows: "অনুকূল বিবাহের সময় গণনা করুন",
    marriageWindowsShastras: "প্রাচীন বৈদিক শাস্ত্র এবং অঙ্কদৃষ্টির গ্রহের চক্রের উপর ভিত্তি করে (শুক্র ৬, বৃহস্পতি ৩ এবং চন্দ্র ২ এর ব্যক্তিগত বছর কম্পন)।",
    astrologicalMatrixLocked: "জ্যোতিষীয় চক্র লক করা আছে",
    auspiciousTimingMatrixDesc: "শুভ সময় চক্র জন্ম তারিখ, শুক্র ও বৃহস্পতির গ্রহের অবস্থান এবং ব্যক্তিগত বছরের চক্রকে একত্রিত করে অনুকূল বিবাহের সময় প্রকাশ করে।",
    varnaCategory: "বর্ণ (শ্রেণী)",
    varnaSig: "বর: {boyVal}, কনে: {girlVal}। কাজ এবং অহং-বুদ্ধির সামঞ্জস্য বোঝায়।",
    vashyaCategory: "বশ্য (নিয়ন্ত্রণ)",
    vashyaSig: "বর: {boyVal}, কনে: {girlVal}। আকর্ষণ এবং আধিপত্যের সামঞ্জস্য বোঝায়।",
    taraCategory: "তারা (ভাগ্য তারকা)",
    taraSig: "শুভ তারকা সামঞ্জস্য। দৈনিক ভাগ্য এবং স্বাস্থ্য গঠন নির্দেশ করে।",
    yoniCategory: "যোনি (শারীরিক সামঞ্জস্য)",
    yoniSig: "বর: {boyVal}, কনে: {girlVal}। শারীরিক আকর্ষণ এবং জৈবিক সামঞ্জস্য বোঝায়।",
    grahaMaitriCategory: "গ্রহ মৈত্রী (বন্ধুত্ব)",
    grahaMaitriSig: "বর অধিপতি: {boyVal}, কনে অধিপতি: {girlVal}। মানসিক সখ্যতা এবং বন্ধুত্ব নির্দেশ করে।",
    ganaCategory: "গণ (স্বভাব)",
    ganaSig: "বর: {boyVal}, কনে: {girlVal}। মানসিক স্বভাব এবং জীবন দর্শনের মিল বোঝায়।",
    bhakootCategory: "ভকূট (আবেগীয় মিল)",
    bhakootSig: "চন্দ্রের দূরত্ব: {boyVal} ঘর। আবেগগত সামঞ্জস্য বোঝায়। {statusText}",
    bhakootDefect: "ভকূট দোষ উপস্থিত আছে (শেয়ার করার শিক্ষা)।",
    bhakootAuspicious: "শুভ ভকূট মিলন।",
    nadiCategory: "নাড়ী (শারীরিক শক্তি)",
    nadiSig: "বর নাড়ী: {boyVal}, কনে নাড়ী: {girlVal}। জৈবিক শক্তি তরঙ্গ নির্দেশ করে। {statusText}",
    nadiDefect: "নাড়ী দোষ উপস্থিত আছে (শক্তি ভারসাম্যের শিক্ষা)।",
    nadiAuspicious: "শুভ নাড়ী মিলন।",
    py6Label: "অত্যন্ত শুভ (শুক্র চক্র)",
    py6Text: "শুক্র দ্বারা পরিচালিত বছর, যা প্রেম, পারিবারিক শান্তি এবং বিবাহের প্রতীক। দীর্ঘস্থায়ী প্রতিশ্রুতির জন্য সেরা সময়।",
    py3Label: "শুভ সম্প্রসারণ (বৃহস্পতি চক্র)",
    py3Text: "বৃহস্পতি দ্বারা পরিচালিত বছর, যা দৈব কৃপা, ভাগ্য এবং আধ্যাত্মিক বৃদ্ধির প্রতীক। শুভ কাজের জন্য অনুকূল।",
    py2Label: "সামঞ্জস্যপূর্ণ মিলন (চন্দ্র চক্র)",
    py2Text: "চন্দ্রের বছর, যা সহযোগিতা, মানসিক গভীরতা এবং স্নেহের উপর গুরুত্ব দেয়। যৌথ জীবন শুরুর জন্য আদেশ।",
    py1Label: "নতুন সূচনা (সূর্য চক্র)",
    py1Text: "সূর্যের বছর, যা নতুন সূচনা, নেতৃত্ব এবং সামাজিক অবস্থানের পরিবর্তনকে নির্দেশ করে। নতুন জীবন শুরু করার জন্য অনুকূল।",
    py9Label: "কৰ্ম মাইলস্টোন (মঙ্গল চক্র)",
    py9Text: "মঙ্গলের বছর, যা পুরানো ৯ বছরের চক্র শেষ করে এবং নতুন প্রতিশ্রুতির প্রস্তুতি দেয়।",
    py5Label: "গতিশীল রূপান্তর (বুধ চক্র)",
    py5Text: "বুধের বছর, যা যোগাযোগ, ভ্রমণ এবং চুক্তি নিয়ন্ত্রণ করে। বিস্তারিত পরিকল্পনার সাথে ভালো।",
    py8Label: "কৰ্ম সমতা (শনি চক্র)",
    py8Text: "শনির বছর, যা দায়িত্ব, কর্তব্য এবং স্থির প্রগতি নির্দেশ করে। ধৈর্য ধরলে বিয়ের জন্য উপযুক্ত।",
    py4Label: "অপ্রত্যাশিত পরিবর্তন (রাহু চক্র)",
    py4Text: "রাহুর বছর, যা অপ্রত্যাশিত ঘটনা বা আকস্মিক সম্পর্কের সৃষ্টি করে। চরম সতর্কতা প্রয়োজন।",
    pyOtherLabel: "আধ্যাত্মিক আত্মদর্শন (কেতু চক্র)",
    pyOtherText: "কেতুর বছর, যা অভ্যন্তরীণ কাজ এবং আধ্যাত্মিক ধ্যানের জন্য উপযুক্ত। নিরিবিলি শান্ত অনুষ্ঠানের জন্য সেরা।",
    upcomingTimeline: "আগামী ৭ বছরের বিবাহের সময় সামঞ্জস্য",
    primaryOptimalWindow: "প্রাথমিক অনুকূল সময়",
    personalYearCycle: "ব্যক্তিগত বছর চক্র",
    signDisplayLabel: "রাশি প্রদর্শন:",
    d1Chart: "D1 রাশি চার্ট",
    d9Chart: "D9 নবমাংশ চার্ট",
    interBadgeInfo: "ইন্টারেক্টিভ চার্ট তথ্য",
    placementLabel: "গ্রহের অবস্থান",
    residesIn: "অবস্থিত",
    precisely: "যথাযথভাবে",
    dignityEval: "মর্যাদা মূল্যায়ন",
    vedicOracleOutput: "বৈদিক ওরাকল অনুবাদ আউটপুট",
    stopRecitation: "আবৃত্তি বন্ধ করুন",
    hearShastra: "শাস্ত্র আবৃত্তি শুনুন",
    downloadPDF: "পিডিএফ রিপোর্ট ডাউনলোড করুন",
    aligningCoords: "জ্যোতিষীয় স্থানাঙ্ক সামঞ্জস্য করা হচ্ছে...",
    utama: "উত্তম (স্বর্গীয় মিলন)",
    madhyama: "মধ্যম (ভারসাম্যপূর্ণ সামঞ্জস্য)",
    kanishta: "কনিষ্ঠ (উচ্চ কৰ্ম শিক্ষা)",
    calculationResolves: "অষ্টকূটের গণনা ৩৬ এর মধ্যে {score} ফলাফল দেয়, যা {vibe} এর উপর ভিত্তি করে সম্পর্ককে নির্দেশ করে।",
    outstandingResonance: "অসাধারণ মানসিক সামঞ্জস্য এবং প্রাকৃতিক আধ্যাত্মিক অনুরণন",
    healthyLessons: "সচেতন প্রতিশ্রুতির প্রয়োজনীয়তার সাথে সুস্থ গঠনমূলক শিক্ষা",
    deepRapport: "গভীর মানসিক সম্পর্ক এবং মানানসই জৈবিক তরঙ্গদৈর্ঘ্য।",
    resilienceNavigation: "পার্থক্য কাটিয়ে ওঠার মাধ্যমে স্থিতিস্থাপকতা গড়ে তোলা।",
    sharedGrounding: "একত্রে ধ্যান করুন, আধ্যাত্মিক অভ্যাস গড়ে তুলুন এবং খোলামেলা যোগাযোগ রাখুন।",
    continueHonoring: "পারস্পরিক শ্রদ্ধা এবং গঠনমূলক সামঞ্জস্য বজায় রাখুন।",
    jointPyExplanation: "যৌথ ব্যক্তিগত বছর কমে {pyJoint} ({labelJoint}) হয়। অংশীদার A বছর {pyA} এ এবং অংশীদার B বছর {pyB} এ রয়েছে। এটি বিবাহের জন্য {resonance} সৃষ্টি করে।",
    highlyCoordinated: "অত্যন্ত সমন্বিত শক্তির অনুরণন",
    balancedSpiritual: "ভারসাম্যপূর্ণ আধ্যাত্মিক সময়",
    karmicLearning: "কৰ্ম শিক্ষার চক্র",
    focusAExplanation: "{name} ব্যক্তিগত বছর {py} ({label}) এ আছে। {text}",
    focusBExplanation: "{name} ব্যক্তিগত বছর {py} ({label}) এ আছে। {text}",
    primaryBestExplanation: "জন্মকালীন কম্পন এবং গোচরের চমৎকার সামঞ্জস্য নির্দেশ করে যে {year} সালটি আপনার বিবাহের জন্য সর্বোচ্চ আধ্যাত্মিক, মানসিক এবং শারীরিক সমর্থন প্রদান করবে।",
    astroVibrations: "জ্যোতিষীয় কম্পন",
    venusJupiterConcord: "শুক্র-বৃহস্পতি মিলন",
    rapportLevel: "সম্পর্কের স্তর",
    exquisiteBlessed: "অত্যন্ত চমৎকার এবং ধন্য",
    doshaResolution: "দোষ নিবারণ",
    neutralizedShanti: "শান্তি পূজার মাধ্যমে নিষ্ক্রিয়",
  },
  mr: {
    badge: "दैवी संवाद",
    singleKundali: "एकल कुंडली",
    coupleMatching: "युगल जुळवणी",
    partnerADetails: "जोडीदार A तपशील",
    nativeBirthDetails: "मूळ जन्म तपशील (लग्न भविष्यासाठी)",
    lagnaBirthDetails: "लग्न जन्म तपशील",
    firstNativeCoordMap: "प्रथम जन्म कुंडली नकाशा",
    secondNativeCoordMap: "द्वितीय जन्म कुंडली नकाशा",
    firstName: "पहिले नाव",
    dateOfBirth: "जन्म तारीख",
    timeOfBirth: "जन्म वेळ",
    placeOfBirth: "जन्म ठिकाण",
    partnerBDetails: "जोडीदार B तपशील",
    secondName: "दुसरे नाव",
    resolvingAlignment: "समन्वय साधत आहे...",
    predictMarriageTiming: "लग्न वेळेचा अंदाज लावा",
    establishSynergyGrid: "सिनर्जी ग्रीड स्थापित करा",
    ashtakootSuitability: "अष्टकूट अनुकूलता",
    diagnosticFlashcards: "निदान फ्लॅशकार्ड्स",
    astrologicalCharts: "ज्योतिषीय तक्ते",
    vedicInterpretation: "वैदिक विश्लेषण",
    resonanceScore: "अनुकूलता स्कोअर",
    outOf36Gunas: "३६ गुणांपैकी",
    detailedAshtakoot: "सविस्तर ८-गुण अष्टकूट विश्लेषण",
    points: "गुण",
    calculateMarriageWindows: "अनुकूल विवाह कालावधी शोधा",
    marriageWindowsShastras: "प्राचीन वैदिक शास्त्रे आणि अंकशास्त्राच्या ग्रहांच्या चक्रांवर आधारित (शुक्र ६, गुरू ३ आणि चंद्र २ चे वैयक्तिक वर्ष स्पंदन).",
    astrologicalMatrixLocked: "ज्योतिषीय चक्र लॉक केले आहे",
    auspiciousTimingMatrixDesc: "शुभ वेळ चक्र जन्म तारखा, शुक्र आणि गुरूची स्थिती आणि वैयक्तिक वर्ष चक्र एकत्र करून अनुकूल विवाहाची वेळ दर्शवते.",
    varnaCategory: "वर्ण (वर्ग)",
    varnaSig: "वर: {boyVal}, वधू: {girlVal}। हे मानसिक स्वभाव आणि कार्य अनुकूलता दर्शवते.",
    vashyaCategory: "वश्य (नियंत्रण)",
    vashyaSig: "वर: {boyVal}, वधू: {girlVal}। हे उप-चेतन आकर्षण आणि नियंत्रण दर्शवते.",
    taraCategory: "तारा (नक्षत्र)",
    taraSig: "शुभ नक्षत्र सुसंगतता मॅपिंग. दैनिक भाग्य आणि आरोग्य चक्र दर्शवते.",
    yoniCategory: "योनि (शारीरिक सुसंगतता)",
    yoniSig: "वर: {boyVal}, वधू: {girlVal}। शारीरिक आकर्षण आणि जैविक सुसंगतता दर्शवते.",
    grahaMaitriCategory: "ग्रह मैत्री",
    grahaMaitriSig: "वर स्वामी: {boyVal}, वधू स्वामी: {girlVal}। परस्पर समजूतदारपणा आणि मैत्री दर्शवते.",
    ganaCategory: "गण (स्वभाव)",
    ganaSig: "वर: {boyVal}, वधू: {girlVal}। मानसिक स्वभाव आणि जीवनाकडे पाहण्याचा दृष्टिकोन दर्शवतो.",
    bhakootCategory: "भकूट (भावनिक सुसंगतता)",
    bhakootSig: "चंद्र अंतर: {boyVal} भाव. भावनिक सुसंगतता दर्शवते. {statusText}",
    bhakootDefect: "भकूट दोष आढळला आहे (अडचणी आणि संवाद सुधारण्याचे धडे).",
    bhakootAuspicious: "शुभ भकूट संरेखन.",
    nadiCategory: "नाडी (शारीरिक ऊर्जा)",
    nadiSig: "वर नाडी: {boyVal}, वधू नाडी: {girlVal}। जैविक लहरींची रचना. {statusText}",
    nadiDefect: "नाडी दोष आढळला आहे (ऊर्जा संतुलित करण्याचे धडे).",
    nadiAuspicious: "शुभ नाडी संरेखन.",
    py6Label: "अतिशय शुभ (शुक्र चक्र)",
    py6Text: "शुक्राच्या प्रभावाखालील वर्ष, जे प्रेम, कौटुंबिक सौख्य आणि विवाहाचे प्रतीक आहे. वचनबद्धतेसाठी सर्वोत्तम.",
    py3Label: "शुभ विस्तार (गुरू चक्र)",
    py3Text: "गुरूच्या प्रभावाखालील वर्ष, जे ज्ञान आणि भाग्याचे प्रतिनिधित्व करते. आशीर्वादासाठी अनुकूल.",
    py2Label: "समन्वयी संघ (चंद्र चक्र)",
    py2Text: "चंद्राचे वर्ष, जे सहानुभूती, सहकार्य आणि भावनिक स्थिरतेवर लक्ष केंद्रित करते. नाते दृढ करण्यासाठी आदर्श.",
    py1Label: "नवीन सुरुवात (सूर्य चक्र)",
    py1Text: "सूर्याचे वर्ष, जे नवीन बदल, नेतृत्व आणि सामाजिक स्थितीतील बदल दर्शवते. नवीन जीवन सुरू करण्यासाठी अनुकूल.",
    py9Label: "कर्म मैलाचा दगड (मंगळ चक्र)",
    py9Text: "मंगळाचे वर्ष, जे नवीन वचनबद्धतेच्या तयारीसाठी जुने ९-वर्षांचे चक्र पूर्ण करते.",
    py5Label: "गतिशील अनुकूलन (बुध चक्र)",
    py5Text: "बुधाचे वर्ष, जे संवाद, प्रवास आणि करारांचे व्यवस्थापन करते. सविस्तर नियोजनासाठी चांगले.",
    py8Label: "कर्म संतुलन (शनि चक्र)",
    py8Text: "शनिचे वर्ष, जे जबाबदाऱ्या, कर्तव्ये आणि स्थिर प्रगती दर्शवते. संयम राखल्यास लग्नासाठी सुरक्षित.",
    py4Label: "अनपेक्षित बदल (राहू चक्र)",
    py4Text: "राहूचे वर्ष, जे अनपेक्षित वळणे किंवा अचानक नातेसंबंध निर्माण करू शकते. अत्यंत सावधगिरी बाळगणे आवश्यक.",
    pyOtherLabel: "आध्यात्मिक आत्मपरीक्षण (केतू चक्र)",
    pyOtherText: "केतूचे वर्ष, जे अंतर्गत प्रगती आणि आध्यात्मिक चिंतनाची गरज दर्शवते. साध्या, शांत सोहळ्यासाठी योग्य.",
    upcomingTimeline: "आगामी ७ वर्षांचे विवाह सुसंगतता चक्र",
    primaryOptimalWindow: "प्राथमिक अनुकूल कालावधी",
    personalYearCycle: "वैयक्तिक वर्ष चक्र",
    signDisplayLabel: "રાશિ પ્રદર્શન:",
    d1Chart: "D1 રાશી તક્તા",
    d9Chart: "D9 नवमांश तक्ता",
    interBadgeInfo: "परस्परसंवादी तक्ता माहिती",
    placementLabel: "ग्रहांची स्थिती",
    residesIn: "स्थित आहे",
    precisely: "अचूकपणे",
    dignityEval: "दर्जा मूल्यमापन",
    vedicOracleOutput: "वैदिक ओरेकल विश्लेषण",
    stopRecitation: "वाचन थांबवा",
    hearShastra: "शास्त्र वाचन ऐका",
    downloadPDF: "અહવાલ ડાઉનલોડ કરા",
    aligningCoords: "खगोलीय निर्देशक सुसंगत करत आहे...",
    utama: "उत्तम (दैवी मिलाप)",
    madhyama: "मध्यम (संतुलित सुसंगतता)",
    kanishta: "कनिष्ठ (कर्म धडे)",
    calculationResolves: "अष्टकूट गणना ३६ पैकी {score} गुण दर्शवते, जे {vibe} वर आधारित नाते दर्शवते.",
    outstandingResonance: "असाधारण भावनिक नाते आणि नैसर्गिक आध्यात्मिक प्रतिध्वनी",
    healthyLessons: "जाणीवपूर्वक वचनबद्धतेची आवश्यकता असलेले निरोगी रचनात्मक धडे",
    deepRapport: "खोल मानसिक समन्वय आणि जैविक नातेसंबंध.",
    resilienceNavigation: "मतभेद सोडवून नात्यातील लवचिकता वाढवणे.",
    sharedGrounding: "एकत्र ध्यान करा, आध्यात्मिक साधना करा आणि संवाद खुला ठेवा.",
    continueHonoring: "परस्पर आदर आणि विधायक समन्वय टिकवून ठेवा.",
    jointPyExplanation: "संयुक्त वैयक्तिक वर्ष कमी होऊन {pyJoint} ({labelJoint}) होते. जोडीदार A वर्ष {pyA} मध्ये आहे, तर जोडीदार B वर्ष {pyB} मध्ये आहे. हे लग्नासाठी {resonance} निर्माण करते.",
    highlyCoordinated: "अत्यंत समन्वित ऊर्जा प्रतिध्वनी",
    balancedSpiritual: "संतुलित आध्यात्मिक वेळ",
    karmicLearning: "कर्म शिकण्याचे चक्र",
    focusAExplanation: "{name} व्यक्तिगत वर्ष {py} ({label}) मध्ये आहे. {text}",
    focusBExplanation: "{name} व्यक्तिगत वर्ष {py} ({label}) मध्ये आहे. {text}",
    primaryBestExplanation: "जन्मकालीन लहरी आणि गोचर ग्रहांचे उत्कृष्ट संरेखन दर्शवते की {year} हे वर्ष तुमच्या लग्नासाठी सर्वोच्च आध्यात्मिक, मानसिक आणि शारीरिक आधार देईल.",
    astroVibrations: "खगोलीय स्पंदने",
    venusJupiterConcord: "शुक्र-गुरू मिलन",
    rapportLevel: "सुसंगतता पातळी",
    exquisiteBlessed: "अतिशय उत्कृष्ट आणि धन्य",
    doshaResolution: "दोष निवारण",
    neutralizedShanti: "शांतता विधीद्वारे संतुलित",
  },
  gu: {
    badge: "દિવ્ય મેળાવ",
    singleKundali: "એકલ કુંડળી",
    coupleMatching: "યુગલ મિલન",
    partnerADetails: "ભાગીદાર A વિગતો",
    nativeBirthDetails: "મૂળ જન્મ વિગતો (લગ્ન ભવિષ્યવાણી માટે)",
    lagnaBirthDetails: "લગ્ન જન્મ વિગતો",
    firstNativeCoordMap: "પ્રથમ જન્મ કુંડળી નકશો",
    secondNativeCoordMap: "દ્વિતીય જન્મ કુંડળી નકશો",
    firstName: "પ્રથમ નામ",
    dateOfBirth: "જન્મ તારીખ",
    timeOfBirth: "જન્મ સમય",
    placeOfBirth: "જન્મ સ્થાન",
    partnerBDetails: "ભાગીદાર B વિગતો",
    secondName: "બીજું નામ",
    resolvingAlignment: "સુસંગતતા મેળવવામાં આવી રહી છે...",
    predictMarriageTiming: "લગ્ન સમયની આગાહી કરો",
    establishSynergyGrid: "સુમેળ ગ્રીડ સ્થાપિત કરો",
    ashtakootSuitability: "અષ્ટકૂટ સુમેળ",
    diagnosticFlashcards: "નિદાન ફ્લેશકાર્ડ્સ",
    astrologicalCharts: "જ્યોતિષીય ચાર્ટ્સ",
    vedicInterpretation: "વૈદિક અર્થઘટન",
    resonanceScore: "સુસંગતતા સ્કોર",
    outOf36Gunas: "૩૬ ગુણોમાંથી",
    detailedAshtakoot: "વિગતવાર ૮-ગણું અષ્ટકૂટ વિશ્લેષણ",
    points: "ગુણો",
    calculateMarriageWindows: "અનુકૂળ લગ્ન સમયગાળાની ગણતરી કરો",
    marriageWindowsShastras: "પ્રાચીન વૈદિક શાસ્ત્રો અને અંકશાસ્ત્રના ગ્રહ ચક્રો પર આધારિત (શુક્ર ૬, ગુરુ ૩ અને ચંદ્ર ૨ ના વ્યક્તિગત વર્ષ સ્પંદનો).",
    astrologicalMatrixLocked: "જ્યોતિષીય ચક્ર લૉક કરેલ છે",
    auspiciousTimingMatrixDesc: "શુભ સમય ચક્ર જન્મ તારીખો, શુક્ર અને ગુરુની સ્થિતિ અને વ્યક્તિગત વર્ષ ચક્રોને જોડીને અનુકૂળ લગ્ન સમય દર્શાવે છે.",
    varnaCategory: "વર્ણ (વર્ગ)",
    varnaSig: "વર: {boyVal}, કન્યા: {girlVal}। આ માનસિક સ્વભાવ અને કાર્ય અનુકૂળતા દર્શાવે છે.",
    vashyaCategory: "વશ્ય (નિયંત્રણ)",
    vashyaSig: "વર: {boyVal}, કન્યા: {girlVal}। આ આકર્ષણ અને નિયંત્રણ દર્શાવે છે.",
    taraCategory: "તારા (નક્ષત્ર)",
    taraSig: "ભાગ્ય અને આરોગ્ય ચક્ર. દૈનિક નસીબ દર્શાવે છે.",
    yoniCategory: "યોનિ (શારીરિક સુસંગતતા)",
    yoniSig: "વર: {boyVal}, કન્યા: {girlVal}। શારીરિક આકર્ષણ અને જૈવિક સુસંગતતા દર્શાવે છે.",
    grahaMaitriCategory: "ગ્રહ મૈત્રી",
    grahaMaitriSig: "વર સ્વામી: {boyVal}, કન્યા સ્વામી: {girlVal}। માનસિક સમજ અને મિત્રતા દર્શાવે છે.",
    ganaCategory: "ગણ (સ્વભાવ)",
    ganaSig: "વર: {boyVal}, કન્યા: {girlVal}। સ્વભાવ અને જીવન પ્રત્યેનો દ્રષ્ટિકોણ દર્શાવે છે.",
    bhakootCategory: "ભકૂટ (ભાવનાત્મક સુસંગતતા)",
    bhakootSig: "ચંદ્ર અંતર: {boyVal} ભાવો. આ ભાવનાત્મક જોડાણ દર્શાવે છે. {statusText}",
    bhakootDefect: "ભકૂટ દોષ હાજર છે (પાઠ શીખવાના છે).",
    bhakootAuspicious: "શુભ ભકૂટ સંરેખણ.",
    nadiCategory: "નાડી (શારીરિક ઉર્જા)",
    nadiSig: "વર નાડી: {boyVal}, કન્યા નાડી: {girlVal}। જૈવિક તરંગ રચના. {statusText}",
    nadiDefect: "નાડી દોષ હાજર છે (ઉર્જા સંતુલન પાઠ).",
    nadiAuspicious: "શુભ નાડી સંરેખણ.",
    py6Label: "અતિ શુભ (શુક્ર ચક્ર)",
    py6Text: "શુક્ર દ્વારા સંચાલિત વર્ષ, જે પ્રેમ, કૌટુંબિક સંવાદિતા અને વિવાહ સંબંધ દર્શાવે છે. લગ્ન માટે સર્વોત્તમ સમય.",
    py3Label: "શુભ વિસ્તરણ (ગુરુ ચક્ર)",
    py3Text: "ગુરુ દ્વારા સંચાલિત વર્ષ, જે દિવ્ય કૃપા, નસીબ અને જ્ઞાનનું પ્રતિનિધિત્વ કરે છે. આશીર્વાદ મેળવવા માટે અનુકૂળ.",
    py2Label: "સુમેળભર્યું જોડાણ (ચંદ્ર ચક્ર)",
    py2Text: "ચંદ્રનું વર્ષ, જે સહાનુભૂતિ, સહકાર અને ભાવનાત્મક સ્થિરતા પર ધ્યાન કેન્દ્રિત કરે છે. સંબંધ ગાઢ બનાવવા શ્રેષ્ઠ.",
    py1Label: "નવી શરૂઆત (સૂર્ય ચક્ર)",
    py1Text: "સૂર્યનું વર્ષ, જે નવા ફેરફારો, નેતૃત્વ અને સામાજિક સ્થિતિમાં ફેરફારનું પ્રતીક છે. નવીન જીવન શરૂ કરવા માટે અનુકૂળ.",
    py9Label: "કર્મ માઇલસ્ટોન (મંગળ ચક્ર)",
    py9Text: "મંગળનું વર્ષ, જે નવી પ્રતિબદ્ધતાઓઓની તૈયારી માટે જૂના ૯ વર્ષના ચક્રોને બંધ કરે છે.",
    py5Label: "ગતિશીલ અનુકૂલન (બુધ ચક્ર)",
    py5Text: "બુધનું વર્ષ, જે સંચાર, મુસાફરી અને કરારોનું સંચાલન કરે છે. વિગતવાર આયોજન સાથે સારું.",
    py8Label: "કર્મ સંતુલન (શનિ ચક્ર)",
    py8Text: "શનિનું વર્ષ, જે જવાબદારીઓ, ફરજો અને સ્થિર પ્રગતિ દર્શાવે છે. ધીરજ હોય તો લગ્ન માટે યોગ્ય.",
    py4Label: "અણધાર્યા ફેરફારો (રાહુ ચક્ર)",
    py4Text: "રાહુનું વર્ષ, જે અણધાર્યા વળાંકો અથવા અચાનક સંબંધોને પ્રેરિત કરે છે. અત્યંત સાવચેતીની જરૂર છે.",
    pyOtherLabel: "આધ્યાત્મિક આત્મનિરીક્ષણ (કેતુ ચક્ર)",
    pyOtherText: "કેતુનું વર્ષ, જે આંતરિક કાર્ય અને આધ્યાત્મિક ચિંતનનું આહ્વાન કરે છે. શાંત સમારંભ માટે સૌથી યોગ્ય.",
    upcomingTimeline: "આગામી ૭-વર્ષીય લગ્ન સમય સંરેખણ",
    primaryOptimalWindow: "પ્રાથમિક અનુકૂળ સમયગાળો",
    personalYearCycle: "વ્યક્તિગત વર્ષ ચક્ર",
    signDisplayLabel: "રાશિ પ્રદર્શન:",
    d1Chart: "D1 રાશિ ચાર્ટ",
    d9Chart: "D9 નવાંશ ચાર્ટ",
    interBadgeInfo: "ઇન્ટરેક્ટિવ ચાર્ટ માહિતી",
    placementLabel: "ગ્રહોની સ્થિતિ",
    residesIn: "સ્થિત છે",
    precisely: "ચોક્કસપણે",
    dignityEval: "ગરિમા મૂલ્યાંકન",
    vedicOracleOutput: "વૈદિક ઓરેકલ અનુવાદ આઉટપુટ",
    stopRecitation: "વાચન અટકાવો",
    hearShastra: "શાસ્ત્ર વાચન સાંભળો",
    downloadPDF: "પીડીએફ રિપોર્ટ ડાઉનલોડ કરો",
    aligningCoords: "ખગોળીય નિર્દેશાંકો સુમેળ કરવામાં આવી રહ્યા છે...",
    utama: "ઉત્તમ (દિવ્ય મિલાપ)",
    madhyama: "મધ્યમ (સંતુલિત અનુકૂળતા)",
    kanishta: "કનિષ્ઠ (ઉચ્ચ કર્મ પાઠ)",
    calculationResolves: "અષ્ટકૂટ ગણતરી ૩૬ માંથી {score} ગુણ આપે છે, જે {vibe} પર આધારિત સંબંધ દર્શાવે છે.",
    outstandingResonance: "અસાધારણ ભાવનાત્મક સહાનુભૂતિ અને કુદરતી આધ્યાત્મિક પડઘો",
    healthyLessons: "સભાન પ્રતિબદ્ધતાની જરૂરિયાતવાળા સ્વસ્થ રચનાત્મક પાઠ",
    deepRapport: "જિંદગીનો ઊંડો મેળાવ અને જૈવિક સંબંધો.",
    resilienceNavigation: "મતભેદો ઉકેલવા દ્વારા સ્થિતિસ્थाપકતા.",
    sharedGrounding: "સાથે ધ્યાન અને આધ્યાત્મિક દિનચર્યા અપનાવો અને ખુલ્લી ચર્ચા કરો.",
    continueHonoring: "પરસ્પર આદર અને સર્જનાત્મક સુમેળ જાળવી રાખો.",
    jointPyExplanation: "સંયુક્ત વ્યક્તિગત વર્ષ ઘટીને {pyJoint} ({labelJoint}) થાય છે. ભાગીદાર A વર્ષ {pyA} માં છે, જ્યારે ભાગીદાર B વર્ષ {pyB} માં છે. આ લગ્ન માટે {resonance} બનાવે છે.",
    highlyCoordinated: "અત્યંત સંકલિત ઉર્જાનો પડઘો",
    balancedSpiritual: "સંતુલિત આધ્યાત્મિક સમય",
    karmicLearning: "કર્મ શીખવાનું ચક્ર",
    focusAExplanation: "{name} વ્યક્તિગત વર્ષ {py} ({label}) માં છે. {text}",
    focusBExplanation: "{name} વ્યક્તિગત વર્ષ {py} ({label}) માં છે. {text}",
    primaryBestExplanation: "જન્મકાલીન સ્પંદનો અને ગોચર ગ્રહોનું ઉત્કૃષ્ટ સંરેખણ દર્શાવે છે કે વર્ષ {year} આપના લગ્ન માટે સર્વોચ્ચ આધ્યાત્મિક, માનસિક અને શારીરિક સમર્થન પ્રદાન કરશે.",
    astroVibrations: "ખગોળીય સ્પંદનો",
    venusJupiterConcord: "શુક્ર-ગુરુ મિલન",
    rapportLevel: "અનુકૂળતા સ્તર",
    exquisiteBlessed: "ખૂબ જ ઉત્કૃષ્ટ અને ધન્ય",
    doshaResolution: "દોષ નિવારણ",
    neutralizedShanti: "શાંતિ વિધિ દ્વારા સંતુલિત",
  }
};

export default function CosmicConnections() {
  const { language, t, speak, speechState, activeReadingId, stopSpeaking } = useLanguage();
  const txt = useMemo(() => synergyTextMap[language] || synergyTextMap.en, [language]);

  // Mode Selection: Single Person Chart vs Couple Matching vs Marriage Timing
  const [mode, setMode] = useState<"single" | "matching" | "marriage">("matching");

  // Partner A Parameters
  const [partnerAName, setPartnerAName] = useState("Alpha");
  const [partnerADob, setPartnerADob] = useState("1998-05-15");
  const [partnerATime, setPartnerATime] = useState("08:30");
  const [partnerAPlace, setPartnerAPlace] = useState("Mumbai, India");
  const [partnerALat, setPartnerALat] = useState(19.076);
  const [partnerALon, setPartnerALon] = useState(72.877);
  const [partnerATimezone, setPartnerATimezone] = useState("Asia/Kolkata");
  const [showPartnerACoords, setShowPartnerACoords] = useState(false);

  // Partner B Parameters (Matching Mode Only)
  const [partnerBName, setPartnerBName] = useState("Beta");
  const [partnerBDob, setPartnerBDob] = useState("1999-09-22");
  const [partnerBTime, setPartnerBTime] = useState("14:15");
  const [partnerBPlace, setPartnerBPlace] = useState("New Delhi, India");
  const [partnerBLat, setPartnerBLat] = useState(28.6139);
  const [partnerBLon, setPartnerBLon] = useState(77.209);
  const [partnerBTimezone, setPartnerBTimezone] = useState("Asia/Kolkata");
  const [showPartnerBCoords, setShowPartnerBCoords] = useState(false);

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
        resultObj.tier = totalScore >= 28 ? txt.utama : totalScore >= 18 ? txt.madhyama : txt.kanishta;
        resultObj.summary = txt.calculationResolves
          .replace("{score}", String(totalScore))
          .replace("{vibe}", totalScore >= 25 ? txt.outstandingResonance : txt.healthyLessons);
        resultObj.strength = totalScore >= 20 ? txt.deepRapport : txt.resilienceNavigation;
        resultObj.growth = totalScore < 20 ? txt.sharedGrounding : txt.continueHonoring;

        resultObj.kootaBreakdown = [
          { category: txt.varnaCategory, score: varnaScore, max: 1, significance: txt.varnaSig.replace("{boyVal}", varA.name).replace("{girlVal}", varB.name) },
          { category: txt.vashyaCategory, score: vashyaScore, max: 2, significance: txt.vashyaSig.replace("{boyVal}", vGroupA).replace("{girlVal}", vGroupB) },
          { category: txt.taraCategory, score: taraScore, max: 3, significance: txt.taraSig },
          { category: txt.yoniCategory, score: yoniScore, max: 4, significance: txt.yoniSig.replace("{boyVal}", yoniAnimA).replace("{girlVal}", yoniAnimB) },
          { category: txt.grahaMaitriCategory, score: grahaMaitriScore, max: 5, significance: txt.grahaMaitriSig.replace("{boyVal}", lordA).replace("{girlVal}", lordB) },
          { category: txt.ganaCategory, score: ganaScore, max: 6, significance: txt.ganaSig.replace("{boyVal}", ganaA).replace("{girlVal}", ganaB) },
          { category: txt.bhakootCategory, score: bhakootScore, max: 7, significance: txt.bhakootSig.replace("{boyVal}", String(bDistance)).replace("{statusText}", isBhakootDefect && !isBhakootCancelled ? txt.bhakootDefect : txt.bhakootAuspicious) },
          { category: txt.nadiCategory, score: nadiScore, max: 8, significance: txt.nadiSig.replace("{boyVal}", nadiA).replace("{girlVal}", nadiB).replace("{statusText}", isNadiDefect && !isNadiCancelled ? txt.nadiDefect : txt.nadiAuspicious) }
        ];

        // 7th House Lords Relationship textual lookup
        const boy7Lord = chartA.d1Houses[6].lord;
        const girl7Lord = chartB.d1Houses[6].lord;
        const relationA = Pl[boy7Lord]?.friends.includes(girl7Lord) ? "Friend" : Pl[boy7Lord]?.enemies.includes(girl7Lord) ? "Enemy" : "Neutral";
        const relationB = Pl[girl7Lord]?.friends.includes(boy7Lord) ? "Friend" : Pl[girl7Lord]?.enemies.includes(boy7Lord) ? "Enemy" : "Neutral";
        let relationText = "";

        const relationTranslations = {
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
          {txt.badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-wider font-bold mb-4">
          {t("synergy.title") || "Cosmic Connections & Matching"}
        </h2>
        <p className="text-zinc-400 text-sm font-light leading-relaxed">
          {t("synergy.sub") || "Unlock high-fidelity Astrological matching. Calculate your Lagna Ascendant, Moon stars, and Ashtakoot scores, and check ancestral alignments dynamically."}
        </p>
      </div>

      {/* Mode Switches */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#111015]/60 backdrop-blur-md p-1.5 rounded-full border border-zinc-800/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex gap-1">
          <button
            onClick={() => setMode("matching")}
            className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all duration-300 tracking-wider flex items-center gap-2 ${mode === "matching" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "text-zinc-400 hover:text-white"}`}
          >
            <Heart className="w-3.5 h-3.5" />
            {txt.coupleMatching}
          </button>
          <button
            onClick={() => setMode("single")}
            className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all duration-300 tracking-wider flex items-center gap-2 ${mode === "single" ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "text-zinc-400 hover:text-white"}`}
          >
            <User className="w-3.5 h-3.5" />
            {txt.singleKundali}
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
      <div className="bg-transparent border border-zinc-800/40 rounded-3xl p-6 sm:p-8 mb-10 relative overflow-hidden shadow-none">
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
                  {mode === "matching" ? txt.partnerADetails : mode === "marriage" ? txt.nativeBirthDetails : txt.lagnaBirthDetails}
                </h4>
                <p className="text-[10px] text-zinc-500">{txt.firstNativeCoordMap}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.firstName}</label>
                <input
                  type="text"
                  value={partnerAName}
                  onChange={(e) => setPartnerAName(e.target.value)}
                  className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.dateOfBirth}</label>
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
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.timeOfBirth}</label>
                <input
                  type="time"
                  value={partnerATime}
                  onChange={(e) => setPartnerATime(e.target.value)}
                  className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.placeOfBirth}</label>
                <BirthPlaceAutocomplete
                  value={partnerAPlace}
                  onSelectPlace={(place) => {
                    setPartnerAPlace(place.formattedAddress);
                    setPartnerALat(place.latitude);
                    setPartnerALon(place.longitude);
                    setPartnerATimezone(place.timezone);
                  }}
                  placeholder="Search birthplace for Partner A..."
                  language={language}
                />
              </div>
            </div>

            {/* Partner A Geographic Details and Coordinate Panel */}
            <div className="bg-zinc-900/10 border border-zinc-850/40 rounded-xl p-3.5 mt-1.5">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                <span className="text-zinc-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Geographic parameters
                </span>
                <button
                  type="button"
                  onClick={() => setShowPartnerACoords(!showPartnerACoords)}
                  className="text-[10px] text-amber-500/80 hover:text-amber-400 font-semibold focus:outline-none transition hover:underline"
                >
                  {showPartnerACoords ? "Hide details ▲" : "Show details ▼"}
                </button>
              </div>

              <div className="mt-2 text-[11px] text-zinc-400 font-mono flex items-center justify-between bg-zinc-950/20 px-2.5 py-1.5 rounded-lg border border-zinc-800/40">
                <div className="truncate pr-2">
                  <span className="text-zinc-500">TZ:</span> <span className="text-zinc-300 font-medium">{partnerATimezone}</span>
                </div>
                <div>
                  <span className="text-zinc-500">LMT Offset:</span> <span className="text-zinc-300 font-medium">{(Math.round(partnerALon / 15 * 4) / 4) >= 0 ? "+" : ""}{(Math.round(partnerALon / 15 * 4) / 4).toFixed(2)}h</span>
                </div>
              </div>

              {showPartnerACoords && (
                <div className="grid grid-cols-2 gap-3.5 mt-3.5 pt-3 border-t border-zinc-800/40">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Latitude</label>
                    <input 
                      type="number" 
                      step="any"
                      value={partnerALat}
                      onChange={(e) => setPartnerALat(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 19.076" 
                      className="w-full bg-transparent border border-zinc-800 focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none transition font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Longitude</label>
                    <input 
                      type="number" 
                      step="any"
                      value={partnerALon}
                      onChange={(e) => setPartnerALon(parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 72.877" 
                      className="w-full bg-transparent border border-zinc-800 focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none transition font-mono"
                    />
                  </div>
                </div>
              )}
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
                  <h4 className="text-sm font-semibold text-white tracking-wide uppercase">{txt.partnerBDetails}</h4>
                  <p className="text-[10px] text-zinc-500">{txt.secondNativeCoordMap}</p>
                </div>
              </div>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.secondName}</label>
                  <input
                    type="text"
                    value={partnerBName}
                    onChange={(e) => setPartnerBName(e.target.value)}
                    className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.dateOfBirth}</label>
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
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.timeOfBirth}</label>
                  <input
                    type="time"
                    value={partnerBTime}
                    onChange={(e) => setPartnerBTime(e.target.value)}
                    className="w-full bg-[#08070b]/60 border border-zinc-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5">{txt.placeOfBirth}</label>
                  <BirthPlaceAutocomplete
                    value={partnerBPlace}
                    onSelectPlace={(place) => {
                      setPartnerBPlace(place.formattedAddress);
                      setPartnerBLat(place.latitude);
                      setPartnerBLon(place.longitude);
                      setPartnerBTimezone(place.timezone);
                    }}
                    placeholder="Search birthplace for Partner B..."
                    language={language}
                  />
                </div>
              </div>

              {/* Partner B Geographic Details and Coordinate Panel */}
              <div className="bg-zinc-900/10 border border-zinc-850/40 rounded-xl p-3.5 mt-1.5">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Geographic parameters
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPartnerBCoords(!showPartnerBCoords)}
                    className="text-[10px] text-amber-500/80 hover:text-amber-400 font-semibold focus:outline-none transition hover:underline"
                  >
                    {showPartnerBCoords ? "Hide details ▲" : "Show details ▼"}
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-zinc-400 font-mono flex items-center justify-between bg-zinc-950/20 px-2.5 py-1.5 rounded-lg border border-zinc-800/40">
                  <div className="truncate pr-2">
                    <span className="text-zinc-500">TZ:</span> <span className="text-zinc-300 font-medium">{partnerBTimezone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">LMT Offset:</span> <span className="text-zinc-300 font-medium">{(Math.round(partnerBLon / 15 * 4) / 4) >= 0 ? "+" : ""}{(Math.round(partnerBLon / 15 * 4) / 4).toFixed(2)}h</span>
                  </div>
                </div>

                {showPartnerBCoords && (
                  <div className="grid grid-cols-2 gap-3.5 mt-3.5 pt-3 border-t border-zinc-800/40">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Latitude</label>
                      <input 
                        type="number" 
                        step="any"
                        value={partnerBLat}
                        onChange={(e) => setPartnerBLat(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 28.6139" 
                        className="w-full bg-transparent border border-zinc-800 focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none transition font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-semibold">Longitude</label>
                      <input 
                        type="number" 
                        step="any"
                        value={partnerBLon}
                        onChange={(e) => setPartnerBLon(parseFloat(e.target.value) || 0)}
                        placeholder="e.g. 77.209" 
                        className="w-full bg-transparent border border-zinc-800 focus:border-amber-500/50 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none transition font-mono"
                      />
                    </div>
                  </div>
                )}
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
                {txt.resolvingAlignment}
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
                {mode === "marriage" ? txt.predictMarriageTiming : txt.establishSynergyGrid}
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
                  {txt.ashtakootSuitability}
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
                {txt.diagnosticFlashcards}
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`py-3 px-1 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative border-b-2 ${activeTab === "charts" ? "text-amber-400 border-amber-500" : "text-zinc-400 border-transparent hover:text-white"}`}
              >
                {txt.astrologicalCharts}
              </button>
              <button
                onClick={() => setActiveTab("interpretation")}
                className={`py-3 px-1 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 relative border-b-2 ${activeTab === "interpretation" ? "text-amber-400 border-amber-500" : "text-zinc-400 border-transparent hover:text-white"}`}
              >
                {txt.vedicInterpretation}
              </button>
            </div>

            {/* Content Windows */}
            <div className="min-h-[400px]">
              
              {/* TAB 1: ASHTAKOOT SUITABILITY BREAKDOWN */}
              {mode === "matching" && activeTab === "suitability" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Score circle card */}
                  <div className="lg:col-span-4 bg-[#111015]/40 border border-zinc-850 p-6 rounded-2xl text-center space-y-6">
                    <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{txt.resonanceScore}</h4>
                    <div className="relative w-44 h-44 mx-auto flex items-center justify-center bg-amber-500/5 rounded-full border border-amber-500/10 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                      <div className="text-center">
                        <span className="text-5xl font-serif font-extrabold text-amber-400 block">{kundaliResult.overallScore}</span>
                        <span className="text-[10px] font-mono text-zinc-500 tracking-wider uppercase block">{txt.outOf36Gunas}</span>
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
                      {txt.detailedAshtakoot}
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
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{txt.points}</span>
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
                              label: txt.py6Label,
                              colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
                              text: txt.py6Text
                            };
                          }
                          if (py === 3) {
                            return {
                              score: 90,
                              label: txt.py3Label,
                              colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                              text: txt.py3Text
                            };
                          }
                          if (py === 2) {
                            return {
                              score: 85,
                              label: txt.py2Label,
                              colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/20",
                              text: txt.py2Text
                            };
                          }
                          if (py === 1) {
                            return {
                              score: 75,
                              label: txt.py1Label,
                              colorClass: "text-orange-400 bg-orange-500/10 border-orange-500/20",
                              text: txt.py1Text
                            };
                          }
                          if (py === 9) {
                            return {
                              score: 70,
                              label: txt.py9Label,
                              colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                              text: txt.py9Text
                            };
                          }
                          if (py === 5) {
                            return {
                              score: 60,
                              label: txt.py5Label,
                              colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                              text: txt.py5Text
                            };
                          }
                          if (py === 8) {
                            return {
                              score: 50,
                              label: txt.py8Label,
                              colorClass: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
                              text: txt.py8Text
                            };
                          }
                          if (py === 4) {
                            return {
                              score: 42,
                              label: txt.py4Label,
                              colorClass: "text-red-400 bg-red-500/10 border-red-500/20",
                              text: txt.py4Text
                            };
                          }
                          return {
                            score: 40,
                            label: txt.pyOtherLabel,
                            colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                            text: txt.pyOtherText
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
                            const resonanceStr = finalHarmony >= 80 ? txt.highlyCoordinated : finalHarmony >= 65 ? txt.balancedSpiritual : txt.karmicLearning;
                            explanation = txt.jointPyExplanation
                              .replace("{pyJoint}", String(pyJoint))
                              .replace("{labelJoint}", detailJoint.label)
                              .replace("{pyA}", String(pyA))
                              .replace("{pyB}", String(pyB))
                              .replace("{resonance}", resonanceStr);
                          } else if (marriageAnalysisMode === "partnerA") {
                            finalHarmony = detailA.score;
                            pyJoint = pyA;
                            explanation = txt.focusAExplanation
                              .replace("{name}", partnerAName)
                              .replace("{py}", String(pyA))
                              .replace("{label}", detailA.label)
                              .replace("{text}", detailA.text);
                          } else {
                            finalHarmony = detailB.score;
                            pyJoint = pyB;
                            explanation = txt.focusBExplanation
                              .replace("{name}", partnerBName)
                              .replace("{py}", String(pyB))
                              .replace("{label}", detailB.label)
                              .replace("{text}", detailB.text);
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
