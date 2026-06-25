import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Moon, Sun, Star, Compass, HelpCircle, Activity, 
  RefreshCw, AlertCircle, BookOpen, Award, CheckCircle2, Heart, 
  TrendingUp, User, DollarSign, Briefcase, Home, Shield, ShieldAlert, 
  Download, Info, ChevronRight, Check, Volume2, VolumeX, Eye, Printer, 
  Clock, AlertTriangle, Lightbulb, Compass as TransitIcon
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { get_planetary_positions, PlanetInfo } from "../data/vedicData";
import CelestialBackground from "./CelestialBackground";
import ObstaclesBackground from "./ObstaclesBackground";
import BirthPlaceAutocomplete from "./BirthPlaceAutocomplete";
import { GeocodedPlace } from "../services/geocodingService";

// Default coordinates of major world cities
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  "New Delhi, India": { lat: 28.6139, lon: 77.2090 },
  "Mumbai, India": { lat: 19.0760, lon: 72.8777 },
  "Bengaluru, India": { lat: 12.9716, lon: 77.5946 },
  "Kolkata, India": { lat: 22.5726, lon: 88.3639 },
  "Chennai, India": { lat: 13.0827, lon: 80.2707 },
  "London, UK": { lat: 51.5074, lon: -0.1278 },
  "New York, USA": { lat: 40.7128, lon: -74.0060 },
  "San Francisco, USA": { lat: 37.7749, lon: -122.4194 },
  "Sydney, Australia": { lat: -33.8688, lon: 151.2093 },
  "Dubai, UAE": { lat: 25.2048, lon: 55.2708 },
  "Tokyo, Japan": { lat: 35.6762, lon: 139.6503 }
};

// Zodiac Sign names (Sanskrit + Western)
const ZODIAC_SIGNS = [
  { name: "Aries", sanskrit: "Mesha", lord: "Mars" },
  { name: "Taurus", sanskrit: "Vrishabha", lord: "Venus" },
  { name: "Gemini", sanskrit: "Mithuna", lord: "Mercury" },
  { name: "Cancer", sanskrit: "Karka", lord: "Moon" },
  { name: "Leo", sanskrit: "Simha", lord: "Sun" },
  { name: "Virgo", sanskrit: "Kanya", lord: "Mercury" },
  { name: "Libra", sanskrit: "Tula", lord: "Venus" },
  { name: "Scorpio", sanskrit: "Vrishchika", lord: "Mars" },
  { name: "Sagittarius", sanskrit: "Dhanu", lord: "Jupiter" },
  { name: "Capricorn", sanskrit: "Makara", lord: "Saturn" },
  { name: "Aquarius", sanskrit: "Kumbha", lord: "Saturn" },
  { name: "Pisces", sanskrit: "Meena", lord: "Jupiter" }
];

const SIGN_GLYPHS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

// Nakshatras spanning 13.333° each
const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", gana: "Deva" },
  { name: "Bharani", lord: "Venus", gana: "Manushya" },
  { name: "Krittika", lord: "Sun", gana: "Rakshasa" },
  { name: "Rohini", lord: "Moon", gana: "Deva" },
  { name: "Mrigashira", lord: "Mars", gana: "Deva" },
  { name: "Ardra", lord: "Rahu", gana: "Manushya" },
  { name: "Punarvasu", lord: "Jupiter", gana: "Deva" },
  { name: "Pushya", lord: "Saturn", gana: "Deva" },
  { name: "Ashlesha", lord: "Mercury", gana: "Rakshasa" },
  { name: "Magha", lord: "Ketu", gana: "Rakshasa" },
  { name: "Purva Phalguni", lord: "Venus", gana: "Manushya" },
  { name: "Uttara Phalguni", lord: "Sun", gana: "Manushya" },
  { name: "Hasta", lord: "Moon", gana: "Deva" },
  { name: "Chitra", lord: "Mars", gana: "Rakshasa" },
  { name: "Swati", lord: "Rahu", gana: "Deva" },
  { name: "Vishakha", lord: "Jupiter", gana: "Rakshasa" },
  { name: "Anuradha", lord: "Saturn", gana: "Deva" },
  { name: "Jyeshtha", lord: "Mercury", gana: "Rakshasa" },
  { name: "Mula", lord: "Ketu", gana: "Rakshasa" },
  { name: "Purva Ashadha", lord: "Venus", gana: "Manushya" },
  { name: "Uttara Ashadha", lord: "Sun", gana: "Manushya" },
  { name: "Shravana", lord: "Moon", gana: "Deva" },
  { name: "Dhanishta", lord: "Mars", gana: "Rakshasa" },
  { name: "Shatabhisha", lord: "Rahu", gana: "Rakshasa" },
  { name: "Purva Bhadrapada", lord: "Jupiter", gana: "Manushya" },
  { name: "Uttara Bhadrapada", lord: "Saturn", gana: "Manushya" },
  { name: "Revati", lord: "Mercury", gana: "Deva" }
];

// Vimshottari dasha lord ordering
const DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
};

// Concerns
const CONCERNS = [
  { id: "career", label: "Career & Vocation", icon: Briefcase },
  { id: "business", label: "Business & Trade", icon: TrendingUp },
  { id: "finance", label: "Financial Stability", icon: DollarSign },
  { id: "marriage", label: "Marriage & Commitment", icon: Heart },
  { id: "love", label: "Love & Relationships", icon: Heart },
  { id: "education", label: "Education & Studies", icon: BookOpen },
  { id: "family", label: "Family & Ancestors", icon: Home },
  { id: "health", label: "Health & Vitality", icon: Activity },
  { id: "peace", label: "Mental Peace & Stress", icon: Compass },
  { id: "legal", label: "Legal Issues & Disputes", icon: Shield },
  { id: "general", label: "General Life Guidance", icon: Sparkles }
];

const CONCERN_LABELS: Record<string, Record<string, string>> = {
  en: {
    career: "Career & Vocation",
    business: "Business & Trade",
    finance: "Financial Stability",
    marriage: "Marriage & Commitment",
    love: "Love & Relationships",
    education: "Education & Studies",
    family: "Family & Ancestors",
    health: "Health & Vitality",
    peace: "Mental Peace & Stress",
    legal: "Legal Issues & Disputes",
    general: "General Life Guidance"
  },
  hi: {
    career: "करियर और पेशा",
    business: "व्यापार और व्यवसाय",
    finance: "वित्तीय स्थिरता",
    marriage: "विवाह और प्रतिबद्धता",
    love: "प्रेम और संबंध",
    education: "शिक्षा और अध्ययन",
    family: "परिवार और पूर्वज",
    health: "स्वास्थ्य और जीवन शक्ति",
    peace: "मानसिक शांति और तनाव",
    legal: "कानूनी मुद्दे और विवाद",
    general: "सामान्य जीवन मार्गदर्शन"
  },
  bn: {
    career: "কর্মজীবন ও পেশা",
    business: "ব্যবসা ও বাণিজ্য",
    finance: "আর্থিক স্থিতিশীলতা",
    marriage: "বিবাহ ও প্রতিশ্রুতি",
    love: "প্রেম ও সম্পর্ক",
    education: "শিক্ষা ও অধ্যয়ন",
    family: "পরিবার ও পূর্বপুরুষ",
    health: "স্বাস্থ্য ও জীবনীশক্তি",
    peace: "মানসিক শান্তি ও মানসিক চাপ",
    legal: "আইনি সমস্যা ও বিরোধ",
    general: "সাধারণ জীবন নির্দেশিকা"
  },
  mr: {
    career: "करिअर आणि व्यवसाय",
    business: "व्यापार आणि व्यवसाय",
    finance: "आर्थिक स्थिरता",
    marriage: "लग्न आणि वचनबद्धता",
    love: "प्रेम आणि संबंध",
    education: "शिक्षण आणि अभ्यास",
    family: "कुटुंब आणि पूर्वज",
    health: "आरोग्य आणि जोम",
    peace: "मानसिक शांतता आणि ताण",
    legal: "कायदेशीर बाबी आणि वाद",
    general: "सामान्य जीवन मार्गदर्शन"
  },
  gu: {
    career: "કારકિર્દી અને વ્યવસાય",
    business: "વેપાર અને ધંધો",
    finance: "નાણાકીય સ્થિરતા",
    marriage: "લગ્ન અને પ્રતિબદ્ધતા",
    love: "પ્રેમ અને સંબંધો",
    education: "શિક્ષણ અને અભ્યાસ",
    family: "પરિવાર અને પૂર્વજો",
    health: "આરોગ્ય અને જોમ",
    peace: "માનસિક શાંતિ અને તણાવ",
    legal: "કાનૂની મુદ્દાઓ અને વિવાદો",
    general: "સામાન્ય જીવન માર્ગદર્શન"
  }
};

const LOADING_MESSAGES: Record<string, string[]> = {
  en: [
    "Collecting ancestral and cosmic coordinates...",
    "Erecting D1 Lagna and 16 Shodashvarga divisional structures...",
    "Computing current planetary transits (Gochar)...",
    "Running Vimshottari Mahadasha-Antardasha cycles...",
    "Diagnosing Shadbala strengths and major planetary doshas...",
    "Compiling astrological rules & traditional remedies...",
    "Synthesizing celestial report with deep Gemini insights..."
  ],
  hi: [
    "पूर्वजों और ब्रह्मांडीय निर्देशांकों का संग्रह...",
    "D1 लग्न और 16 षोडशवर्ग विभागीय संरचनाओं का निर्माण...",
    "वर्तमान ग्रह गोचर की गणना...",
    "विंशोत्तरी महादशा-अंतर्दशा चक्रों का संचालन...",
    "षडबल शक्ति और मुख्य ग्रहों के दोषों का विश्लेषण...",
    "ज्योतिषीय नियमों और पारंपरिक उपायों का संकलन...",
    "मिथुन (Gemini) अंतर्दृष्टि के साथ दिव्य रिपोर्ट तैयार करना..."
  ],
  bn: [
    "পূর্বপুরুষ এবং মহাজাগতিক স্থানাঙ্ক সংগ্রহ করা হচ্ছে...",
    "D1 লগ্ন এবং ১৬টি ষোড়শবর্ণ বিভাগীয় কাঠামো নির্মাণ...",
    "বর্তমান গ্রহ গোচর গণনা করা হচ্ছে...",
    "বিংশোত্তরী মহাদশা-অন্তর্দশা চক্র চালানো হচ্ছে...",
    "ষড়বল শক্তি এবং প্রধান গ্রহের দোষ বিশ্লেষণ করা হচ্ছে...",
    "জ্যোতিষীয় নিয়ম এবং ঐতিহ্যবাহী প্রতিকার সংকলন করা হচ্ছে...",
    "মিথুন (Gemini) অন্তর্দৃষ্টির সাথে মহাজাগতিক প্রতিবেদন তৈরি করা হচ্ছে..."
  ],
  mr: [
    "पूर्वज आणि ब्रह्मांडीय समन्वयांचे संकलन...",
    "D1 लग्न आणि 16 षोडशवर्ग विभागीय कुंडलियांची रचना...",
    "सध्याच्या ग्रह गोचराची गणना...",
    "विंशोत्तरी महादशा-अंतर्दशा चक्र चालवणे...",
    "षडबल शक्ती आणि मुख्य ग्रहांचे दोष विश्लेषण...",
    "ज्योतिषीय नियम आणि पारंपारिक उपायांचे संकलन...",
    "मिथुन (Gemini) अंतर्दृष्टीसह दिव्य अहवाल तयार करणे..."
  ],
  gu: [
    "પૂર્વજો અને બ્રહ્માંડીય કોઓર્ડિનેટ્સનું સંગ્રહ...",
    "D1 લગ્ન અને 16 ષોડશવર્ગ વિભાગીય કુંડળીઓની રચના...",
    "વર્તમાન ગ્રહ ગોચરની ગણતરી...",
    "વિંશોત્તરી મહાદશા-અંતર્દશા ચક્રો ચલાવવા...",
    "ષડબલ શક્તિ અને મુખ્ય ગ્રહોના દોષોનું વિશ્લેષણ...",
    "જ્યોતિષીય નિયમો અને પરંપરાગત ઉપાયોનું સંકલન...",
    "મિથુન (Gemini) આંતરદૃષ્ટિ સાથે દૈવી અહેવાલ તૈયાર કરવો..."
  ]
};

const ZODIAC_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    Aries: "Aries", Taurus: "Taurus", Gemini: "Gemini", Cancer: "Cancer",
    Leo: "Leo", Virgo: "Virgo", Libra: "Libra", Scorpio: "Scorpio",
    Sagittarius: "Sagittarius", Capricorn: "Capricorn", Aquarius: "Aquarius", Pisces: "Pisces"
  },
  hi: {
    Aries: "मेष", Taurus: "वृषभ", Gemini: "मिथुन", Cancer: "कर्क",
    Leo: "सिंह", Virgo: "कन्या", Libra: "तुला", Scorpio: "वृश्चिक",
    Sagittarius: "धनु", Capricorn: "मकर", Aquarius: "कुंभ", Pisces: "मीन"
  },
  bn: {
    Aries: "মেষ", Taurus: "বৃষ", Gemini: "মিথুন", Cancer: "কর্কট",
    Leo: "সিংহ", Virgo: "কন্যা", Libra: "তুলা", Scorpio: "বৃশ্চিক",
    Sagittarius: "ধনু", Capricorn: "মকর", Aquarius: "কুম্ভ", Pisces: "মীন"
  },
  mr: {
    Aries: "मेष", Taurus: "वृषभ", Gemini: "मिथुन", Cancer: "कर्क",
    Leo: "सिंह", Virgo: "कन्या", Libra: "तुला", Scorpio: "वृश्चिक",
    Sagittarius: "धनु", Capricorn: "मकर", Aquarius: "कुंभ", Pisces: "मीन"
  },
  gu: {
    Aries: "મેષ", Taurus: "વૃષભ", Gemini: "મિથુન", Cancer: "કર્ક",
    Leo: "સિંહ", Virgo: "કન્યા", Libra: "તુલા", Scorpio: "વૃશ્ચિક",
    Sagittarius: "ધનુ", Capricorn: "મકર", Aquarius: "કુંભ", Pisces: "મીન"
  }
};

const PLANET_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu" },
  hi: { Sun: "सूर्य", Moon: "चंद्रमा", Mars: "मंगल", Mercury: "बुध", Jupiter: "बृहस्पति", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" },
  bn: { Sun: "সূর্য", Moon: "চন্দ্র", Mars: "मंगल", Mercury: "বুধ", Jupiter: "বৃহস্পতি", Venus: "শুক্র", Saturn: "শনি", Rahu: "রাহু", Ketu: "কেতু" },
  mr: { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनी", Rahu: "राहु", Ketu: "केतु" },
  gu: { Sun: "સૂર્ય", Moon: "ચંદ્ર", Mars: "મંગળ", Mercury: "બુધ", Jupiter: "ગુરુ", Venus: "શુક્ર", Saturn: "શનિ", Rahu: "રાહુ", Ketu: "કેતુ" }
};

const TRANSLATIONS = {
  en: {
    shastricDiagnosisEngine: "Shastric Diagnosis Engine",
    title: "Vedic Life Obstacle Analyzer",
    sub: "Unveil why you encounter delays or friction in your career, finance, or marital affairs. Combine 16 divisional charts with Vimshottari dashas and transits to discover remedies.",
    birthConcernDetails: "Birth & Concern Details",
    yourName: "Your Name",
    enterName: "Enter your name",
    dob: "Date of Birth",
    exactTime: "Exact Time",
    birthLocation: "Birth Location",
    customCoords: "Custom Coordinates",
    lat: "Latitude",
    lon: "Longitude",
    concernArea: "Specific Concern Area",
    evalTransitDate: "Evaluation Transit Date",
    analyzingCycles: "Analyzing Cycles...",
    runCosmicDiagnosis: "Run Cosmic Diagnosis",
    analyzingPatterns: "Analyzing Cosmic Chart Patterns",
    chamberStaleTitle: "Diagnostic Chamber Stale",
    chamberStaleDesc: "Submit your birth details in the sidebar panel to calculate planetary dignities, running dasha sequences, and compile remedies.",
    severityIndex: "Obstacle Severity Index",
    currentDasha: "Current Dasha",
    mahadashaLord: "Mahadasha Lord (MD)",
    antardashaLord: "Antardasha Lord (AD)",
    runsTill: "Runs till",
    chartSignature: "Chart Signature",
    ascendantLagna: "Ascendant (Lagna)",
    moonNakshatra: "Moon Nakshatra",
    noMajorDoshas: "No Major Doshas",
    interactiveCharts: "Interactive Shodashvarga Divisional Charts",
    interactiveChartsDesc: "Explore different astrological levels mapping specialized aspects of your life path.",
    northIndianStyle: "NORTH INDIAN STYLE KUNDALI • {chart} VIEW",
    activeBreakdown: "Active {chart} Breakdown",
    lagnaSign: "Lagna Sign",
    empty: "Empty",
    astrologicalVerdict: "Detailed Shastric Astrological Verdict",
    readWisdomAloud: "Read Wisdom Aloud",
    printReport: "Print Astrological Report",
    primaryObstacleRoots: "Primary Obstacle Roots",
    favorableTimingWindows: "Favorable Timing Windows",
    shadbalaStrengths: "Shadbala Strengths",
    transitGochar: "Transit Overlay (Gochar)",
    transitSign: "Transit Sign",
    lagnaHouse: "Lagna House",
    remedialFramework: "Prescribed Shastric Remedial Framework",
    remedialFrameworkDesc: "Traditional, non-superstitious behavioral and energy-balancing measures to strengthen weak significators.",
    remedySuffix: "Remedy",
    disclaimer: "MATHEMATICAL SHODASHVARGA COMPUTATION ENGINE • ALL INTERPRETATIONS IN ACCORDANCE WITH BRIHAT PARASHARA HORA SHASTRA RULES • ASTROLOGY PROVIDES SPIRITUAL SIGHT NOT ABSOLUTE PRE-DETERMINED FUTURES • PURUSHARTHA (CONSCIOUS ACTION) REIGNS SUPREME",
    significant: "Significant",
    moderate: "Moderate",
    emptyDasha: "No active dasha found.",
    years: "Years",
    house: "House"
  },
  hi: {
    shastricDiagnosisEngine: "शास्त्रीय निदान इंजन",
    title: "वैदिक जीवन बाधा विश्लेषक",
    sub: "जानें कि आपके करियर, वित्त या वैवाहिक मामलों में देरी या बाधाएं क्यों आ रही हैं। उपाय खोजने के लिए विंशोत्तरी दशा और गोचर के साथ 16 वर्गीय कुंडलियों का विश्लेषण करें।",
    birthConcernDetails: "जन्म और चिंता का विवरण",
    yourName: "आपका नाम",
    enterName: "अपना नाम दर्ज करें",
    dob: "जन्म तिथि",
    exactTime: "सटीक समय",
    birthLocation: "जन्म स्थान",
    customCoords: "कस्टम निर्देशांक",
    lat: "अक्षांश",
    lon: "रेखांश",
    concernArea: "विशिष्ट चिंता का क्षेत्र",
    evalTransitDate: "गोचर मूल्यांकन तिथि",
    analyzingCycles: "दशा चक्रों का विश्लेषण...",
    runCosmicDiagnosis: "कुंडली निदान शुरू करें",
    analyzingPatterns: "ब्रह्मांडीय चार्ट पैटर्न का विश्लेषण",
    chamberStaleTitle: "निदान कक्ष निष्क्रिय",
    chamberStaleDesc: "ग्रहों की गरिमा, सक्रिय दशा और उपायों की गणना करने के लिए बाईं ओर के पैनल में अपना विवरण सबमिट करें।",
    severityIndex: "बाधा गंभीरता सूचकांक",
    currentDasha: "वर्तमान दशा",
    mahadashaLord: "महादशा स्वामी (MD)",
    antardashaLord: "अंतर्दशा स्वामी (AD)",
    runsTill: "समाप्ति तिथि",
    chartSignature: "कुंडली हस्ताक्षर",
    ascendantLagna: "लग्न (Lagna)",
    moonNakshatra: "चंद्र नक्षत्र",
    noMajorDoshas: "कोई बड़ा दोष नहीं",
    interactiveCharts: "इंटरैक्टिव षोडशवर्ग विभागीय चार्ट",
    interactiveChartsDesc: "अपने जीवन पथ के विभिन्न क्षेत्रों को दर्शाने वाले विभिन्न ज्योतिषीय स्तरों का अन्वेषण करें।",
    northIndianStyle: "उत्तर भारतीय शैली कुंडली • {chart} दृश्य",
    activeBreakdown: "सक्रिय {chart} विश्लेषण",
    lagnaSign: "लग्न राशि",
    empty: "रिक्त",
    astrologicalVerdict: "विस्तृत शास्त्रीय ज्योतिषीय निर्णय",
    readWisdomAloud: "ज्ञानवाणी सुनें",
    printReport: "ज्योतिषीय रिपोर्ट प्रिंट करें",
    primaryObstacleRoots: "मुख्य बाधा के कारण",
    favorableTimingWindows: "अनुकूल समय चक्र",
    shadbalaStrengths: "षडबल शक्ति",
    transitGochar: "ग्रह गोचर स्थिति",
    transitSign: "गोचर राशि",
    lagnaHouse: "लग्न भाव",
    remedialFramework: "निर्धारित शास्त्रीय उपाय",
    remedialFrameworkDesc: "कमजोर ग्रहों को मजबूत करने के लिए पारंपरिक, व्यावहारिक और ऊर्जा-संतुलन वाले शास्त्रीय उपाय।",
    remedySuffix: "उपाय",
    disclaimer: "गणितीय षोडशवर्ग गणना इंजन • पराशर होरा शास्त्र के नियमों के अनुसार व्याख्या • ज्योतिष आध्यात्मिक दृष्टि प्रदान करता है, कोई निश्चित भाग्य नहीं • पुरुषार्थ (सचेत कर्म) सर्वोपरि है",
    significant: "गंभीर",
    moderate: "मध्यम",
    emptyDasha: "कोई सक्रिय दशा नहीं मिली।",
    years: "वर्ष",
    house: "भाव"
  },
  bn: {
    shastricDiagnosisEngine: "শাস্ত্রীয় নির্ণয় ইঞ্জিন",
    title: "বৈদিক জীবন বাধা বিশ্লেষক",
    sub: "আপনার কর্মজীবন, অর্থ বা দাম্পত্য জীবনে কেন বিলম্ব বা বাধার সম্মুখীন হচ্ছেন তা জানুন। প্রতিকার খুঁজতে ১৬টি বিভাগীয় চার্ট, বিংশোত্তরী দশা এবং গোচরের সমন্বয় করুন।",
    birthConcernDetails: "জন্ম ও উদ্বেগের বিবরণ",
    yourName: "আপনার নাম",
    enterName: "আপনার নাম লিখুন",
    dob: "জন্ম তারিখ",
    exactTime: "সঠিক সময়",
    birthLocation: "জন্ম স্থান",
    customCoords: "কাস্টম স্থানাঙ্ক",
    lat: "অক্ষাংশ",
    lon: "দ্রাঘিমাংশ",
    concernArea: "নির্দিষ্ট উদ্বেগের ক্ষেত্র",
    evalTransitDate: "গোচর মূল্যায়নের তারিখ",
    analyzingCycles: "দশা চক্র বিশ্লেষণ করা হচ্ছে...",
    runCosmicDiagnosis: "মহাজাগতিক নির্ণয় শুরু করুন",
    analyzingPatterns: "মহাজাগতিক চার্ট প্যাটার্ন বিশ্লেষণ করা হচ্ছে",
    chamberStaleTitle: "নির্ণয় কক্ষ নিষ্ক্রিয়",
    chamberStaleDesc: "গ্রহের স্থিতি, চলমান দশা এবং প্রতিকার গণনা করতে বাম পাশের প্যানেলে আপনার জন্মের বিবরণ জমা দিন।",
    severityIndex: "বাধার তীব্রতা সূচক",
    currentDasha: "চলমান দশা",
    mahadashaLord: "মহাদশা অধিপতি (MD)",
    antardashaLord: "অন্তর্দশা অধিপতি (AD)",
    runsTill: "চলবে",
    chartSignature: "কোষ্ঠী স্বাক্ষর",
    ascendantLagna: "লগ্ন (Lagna)",
    moonNakshatra: "চন্দ্র নক্ষত্র",
    noMajorDoshas: "কোনো বড় দোষ নেই",
    interactiveCharts: "ইন্টারেক্টিভ ষোড়শবর্ণ বিভাগীয় চার্ট",
    interactiveChartsDesc: "আপনার জীবন পথের বিশেষ দিকগুলি বিশ্লেষণ করতে বিভিন্ন জ্যোতিষীয় স্তরগুলি অন্বেষণ করুন।",
    northIndianStyle: "উত্তর ভারতীয় শৈলী কুন্ডলী • {chart} দৃশ্য",
    activeBreakdown: "সক্রিয় {chart} বিশ্লেষণ",
    lagnaSign: "লগ্ন রাশি",
    empty: "খালি",
    astrologicalVerdict: "বিস্তারিত শাস্ত্রীয় জ্যোতিষীয় সিদ্ধান্ত",
    readWisdomAloud: "জ্ঞানবাণী শুনুন",
    printReport: "জ্যোতিষীয় রিপোর্ট প্রিন্ট করুন",
    primaryObstacleRoots: "প্রধান বাধার কারণসমূহ",
    favorableTimingWindows: "অনুকূল সময় উইন্ডো",
    shadbalaStrengths: "ষড়বল শক্তি",
    transitGochar: "গ্রহ গোচর ওভারলে",
    transitSign: "গোচর রাশি",
    lagnaHouse: "লগ্ন ভাব",
    remedialFramework: "নির্ধারিত শাস্ত্রীয় প্রতিকার কাঠামো",
    remedialFrameworkDesc: "কোনো অন্ধবিশ্বাস ছাড়া দুর্বল কারক গ্রহগুলিকে শক্তিশালী করতে ঐতিহ্যবাহী এবং শক্তি-ভারসাম্যপূর্ণ ব্যবস্থা।",
    remedySuffix: "প্রতিকার",
    disclaimer: "গাণিতিক ষোড়শবর্ণ গণনা ইঞ্জিন • পরাশর হোরা শাস্ত্রের নিয়ম অনুযায়ী ব্যাখ্যা • জ্যোতিষ আধ্যাত্মিক পথ দেখায়, পূর্ব-নির্ধারিত ভাগ্য নয় • পুরুষার্থ (সচেতন কর্ম) সর্বশ্রেষ্ঠ",
    significant: "গুরুতর",
    moderate: "মধ্যম",
    emptyDasha: "কোনো সক্রিয় দশা পাওয়া যায়নি।",
    years: "বছর",
    house: "ভাব"
  },
  mr: {
    shastricDiagnosisEngine: "शास्त्रीय निदान इंजिन",
    title: "वैदिक जीवन अडथळा विश्लेषक",
    sub: "तुमच्या करिअर, वित्त किंवा वैवाहिक जीवनात का उशीर किंवा अडथळे येत आहेत ते जाणून घ्या. उपाय शोधण्यासाठी विंशोत्तरी दशा आणि गोचर सह १६ विभागीय कुंडलियांचे विश्लेषण करा।",
    birthConcernDetails: "जन्म आणि चिंतेचा तपशील",
    yourName: "तुमचे नाव",
    enterName: "तुमचे नाव प्रविष्ट करा",
    dob: "जन्म तारीख",
    exactTime: "अचूक वेळ",
    birthLocation: "जन्म स्थान",
    customCoords: "सानुकूल समन्वय",
    lat: "अक्षांश",
    lon: "रेखांश",
    concernArea: "विशिष्ट चिंतेचे क्षेत्र",
    evalTransitDate: "गोचर मूल्यमापन तारीख",
    analyzingCycles: "दशा चक्रांचे विश्लेषण सुरू आहे...",
    runCosmicDiagnosis: "कुंडली निदान सुरू करा",
    analyzingPatterns: "ब्रह्मांडीय चार्ट नमुन्यांचे विश्लेषण",
    chamberStaleTitle: "निदान कक्ष निष्क्रिय",
    chamberStaleDesc: "ग्रहांची गरिमा, सक्रिय दशा आणि उपायांची गणना करण्यासाठी डाव्या बाजूच्या पॅनेलमध्ये आपले तपशील सबमिट करा।",
    severityIndex: "अडथळा तीव्रता निर्देशांक",
    currentDasha: "सध्याची दशा",
    mahadashaLord: "महादशा स्वामी (MD)",
    antardashaLord: "अंतर्दशा स्वामी (AD)",
    runsTill: "समाप्ती पर्यंत",
    chartSignature: "कुंडली स्वाक्षरी",
    ascendantLagna: "लग्न (Lagna)",
    moonNakshatra: "चंद्र नक्षत्र",
    noMajorDoshas: "कोणताही मोठा दोष नाही",
    interactiveCharts: "इंटरएक्टिव्ह षोडशवर्ग विभागीय चार्ट",
    interactiveChartsDesc: "तुमच्या जीवन मार्गाच्या विशिष्ट पैलूंचे प्रतिनिधित्व करणाऱ्या विविध ज्योतिषीय स्तरांचे अन्वेषण करा।",
    northIndianStyle: "उत्तर भारतीय शैली कुंडली • {chart} दृश्य",
    activeBreakdown: "सक्रिय {chart} विश्लेषण",
    lagnaSign: "लग्न राशी",
    empty: "रिकामे",
    astrologicalVerdict: "तपशीलवार शास्त्रीय ज्योतिषीय निर्णय",
    readWisdomAloud: "ज्ञानवाणी ऐका",
    printReport: "ज्योतिषीय अहवाल प्रिंट करा",
    primaryObstacleRoots: "मुख्य अडथळ्यांची कारणे",
    favorableTimingWindows: "अनुकूल वेळ चक्र",
    shadbalaStrengths: "षडबल शक्ती",
    transitGochar: "ग्रह गोचर स्थिती",
    transitSign: "गोचर राशी",
    lagnaHouse: "लग्न स्थान",
    remedialFramework: "निर्धारित शास्त्रीय उपाय",
    remedialFrameworkDesc: "कमकुवत ग्रहांना बळकट करण्यासाठी पारंपारिक, व्यावहारिक आणि ऊर्जा-संतुलन राखणारे उपाय।",
    remedySuffix: "उपाय",
    disclaimer: "गणितीय षोडशवर्ग गणना इंजिन • पराशर होरा शास्त्राच्या नियमांनुसार व्याख्या • ज्योतिष आध्यात्मिक दृष्टी प्रदान करतो, अंतिम भविष्य नाही • पुरुषार्थ (सचेत कर्म) सर्वोपरि आहे",
    significant: "गंभीर",
    moderate: "मध्यम",
    emptyDasha: "कोणतीही सक्रिय दशा आढळली नाही.",
    years: "वर्षे",
    house: "स्थान"
  },
  gu: {
    shastricDiagnosisEngine: "શાસ્ત્રીય નિદાન એન્જિન",
    title: "વૈદિક જીવન અવરોધ વિશ્લેષક",
    sub: "તમારા વ્યવસાય, નાણાકીય બાબતો અથવા લગ્નજીવનમાં કેમ વિલંબ કે અવરોધો આવી રહ્યા છે તે જાણો. ઉપાયો શોધવા માટે ૧૬ વિભાગીય કુંડળી, વિંશોત્તરી દશા અને ગોચરનું વિશ્લેષણ કરો.",
    birthConcernDetails: "જન્મ અને ચિંતાની વિગતો",
    yourName: "તમારું નામ",
    enterName: "તમારું નામ દાખલ કરો",
    dob: "જન્મ તારીખ",
    exactTime: "ચોક્કસ સમય",
    birthLocation: "જન્મ સ્થાન",
    customCoords: "કસ્ટમ સંકલન",
    lat: "અક્ષાંશ",
    lon: "રેખાંશ",
    concernArea: "ચિંતાનો ચોક્કસ વિસ્તાર",
    evalTransitDate: "ગોચર મૂલ્યાંકન તારીખ",
    analyzingCycles: "દશા ચક્રોનું વિશ્લેષણ...",
    runCosmicDiagnosis: "કુંડળી નિદાન શરૂ કરો",
    analyzingPatterns: "બ્રહ્માંડીય ચાર્ટ પેટર્નનું વિશ્લેષણ",
    chamberStaleTitle: "નિદાન રૂમ નિષ્ક્રિય",
    chamberStaleDesc: "ગ્રહોની ગરિમા, સક્રિય દશા અને ઉપાયોની ગણતરી કરવા માટે ડાબી પેનલમાં તમારી વિગતો સબમિટ કરો.",
    severityIndex: "અવરોધ તીવ્રતા સૂચકાંક",
    currentDasha: "ચાલુ દશા",
    mahadashaLord: "મહાદશા સ્વામી (MD)",
    antardashaLord: "અંતર્દશા સ્વામી (AD)",
    runsTill: "સુધી ચાલશે",
    chartSignature: "કુંડળી હસ્તાક્ષર",
    ascendantLagna: "લગ્ન (Lagna)",
    moonNakshatra: "ચંદ્ર નક્ષત્ર",
    noMajorDoshas: "કોઈ મુખ્ય દોષ નથી",
    interactiveCharts: "ઇન્ટરેક્ટિવ ષોડશવર્ગ વિભાગીય ચાર્ટ",
    interactiveChartsDesc: "તમારા જીવન માર્ગના વિવિધ પાસાઓને સમજવા માટે વિવિધ જ્યોતિષીય સ્તરોનું અન્વેષણ કરો.",
    northIndianStyle: "ઉત્તર ભારતીય શૈલી કુંડળી • {chart} દ્રશ્ય",
    activeBreakdown: "સક્રિય {chart} વિશ્લેષણ",
    lagnaSign: "લગ્ન રાશિ",
    empty: "ખાલી",
    astrologicalVerdict: "વિગતવાર શાસ્ત્રીય જ્યોતિષીય ચુકાદો",
    readWisdomAloud: "જ્ઞાનવાણી સાંભળો",
    printReport: "જ્યોતિષીય અહેવાલ પ્રિન્ટ કરો",
    primaryObstacleRoots: "મુખ્ય અવરોધોના કારણો",
    favorableTimingWindows: "અનુકૂળ સમય ગાળો",
    shadbalaStrengths: "ષડબલ શક્તિ",
    transitGochar: "ગ્રહ ગોચર સ્થિતિ",
    transitSign: "ગોચર રાશિ",
    lagnaHouse: "લગ્ન સ્થાન",
    remedialFramework: "નિર્ધારિત શાસ્ત્રીય ઉપાયો",
    remedialFrameworkDesc: "નબળા ગ્રહોને મજબૂત કરવા માટે પરંપરાગત, વ્યવહારુ અને ઉર્જા-સંતુલન રાખતા ઉપાયો.",
    remedySuffix: "ઉપાય",
    disclaimer: "ગાણિતિક ષોડશવર્ગ ગણતરી એન્જિન • પરાશર હોરા શાસ્ત્રના નિયમો અનુસાર અર્થઘટન • જ્યોતિષ આધ્યાત્મિક દ્રષ્ટિ આપે છે, કોઈ ચોક્કસ ભવિષ્ય નહીં • પુરુષાર્થ (સભાન કર્મ) સર્વોપરી છે",
    significant: "ગંભીર",
    moderate: "મધ્યમ",
    emptyDasha: "કોઈ સક્રિય દશા મળી નથી.",
    years: "વર્ષો",
    house: "સ્થાન"
  }
};

export default function VedicLifeObstacleAnalyzer() {
  const { language } = useLanguage();

  const tLocal = (key: keyof typeof TRANSLATIONS.en): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  // Inputs State
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    birthTime: "",
    birthPlace: "New Delhi, India",
    customLat: "28.613900",
    customLon: "77.209000",
    customTimezone: "Asia/Kolkata",
    useCustomCoords: true,
    currentDate: new Date().toISOString().split("T")[0],
    currentLocation: "New Delhi, India",
    concern: "general"
  });

  // Calculation Results State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [reportResult, setReportResult] = useState<any | null>(null);
  const [activeChartTab, setActiveChartTab] = useState<string>("D1");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Added manual coordinate expansion toggle state
  const [showAdvancedCoords, setShowAdvancedCoords] = useState(false);

  const loadingMessages = LOADING_MESSAGES[language] || LOADING_MESSAGES.en;

  // Handle Autocomplete selection
  const handlePlaceSelect = (place: GeocodedPlace) => {
    setFormData(prev => ({
      ...prev,
      birthPlace: place.formattedAddress,
      customLat: place.latitude.toFixed(6), // Minimum 6 decimal places as requested
      customLon: place.longitude.toFixed(6),
      customTimezone: place.timezone,
      useCustomCoords: true,
      currentLocation: place.formattedAddress
    }));
  };

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Sound/TTS feature
  const toggleTTS = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      if (!reportResult || !reportResult.aiExplanation) return;
      const textToSpeak = reportResult.aiExplanation.replace(/[#*`_]/g, "");
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setSpeechUtterance(utterance);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Cancel speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Scientific geocentric calculation helpers
  const getAyanamsaDeg = (dateStr: string, timeStr: string, lon: number): number => {
    const [yr, mt, dy] = dateStr.split("-").map(Number);
    const [hr, mn] = timeStr ? timeStr.split(":").map(Number) : [12, 0];
    const timezoneOffset = Math.round(lon / 15 * 2) / 2;
    const lmtHours = hr + mn / 60 - timezoneOffset;
    
    const utcDate = new Date(Date.UTC(yr, mt - 1, dy, 0, 0, 0));
    utcDate.setTime(utcDate.getTime() + lmtHours * 60 * 60 * 1000);
    
    const julianDate = utcDate.getTime() / 864e5 + 2440587.5 - 2451545.0;
    return 23.85306 + 0.01397 * ((julianDate * 864e5) / (365.25 * 24 * 60 * 60 * 1000));
  };

  // Perform calculations locally first to create a complete mathematical package
  const executeLocalVedicCalculations = () => {
    const lat = parseFloat(formData.customLat) || 28.6139;
    const lon = parseFloat(formData.customLon) || 77.2090;
    const ayanamsa = getAyanamsaDeg(formData.dob, formData.birthTime, lon);

    // Get basic planetary coordinates from ephemeris
    const birthDateObj = new Date(`${formData.dob}T${formData.birthTime || "12:00"}:00`);
    const rawPlanets = get_planetary_positions(birthDateObj);

    // 1. Calculate Sidereal Ascendant (Lagna)
    const [yr, mt, dy] = formData.dob.split("-").map(Number);
    const [hr, mn] = (formData.birthTime || "12:00").split(":").map(Number);
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

    // Adjust planetary positions with Ayanamsa
    const planets = rawPlanets.map(p => {
      let siderealLong = (p.longitude - ayanamsa + 360) % 360;
      const signIdx = Math.floor(siderealLong / 30) % 12;
      const degree = siderealLong % 30;

      const exaltations: Record<string, number> = { Sun: 0, Moon: 1, Mars: 9, Mercury: 5, Jupiter: 3, Venus: 11, Saturn: 6 };
      const debilitations: Record<string, number> = { Sun: 6, Moon: 7, Mars: 3, Mercury: 11, Jupiter: 9, Venus: 5, Saturn: 0 };
      const ownSigns: Record<string, number[]> = { Sun: [4], Moon: [3], Mars: [0, 7], Mercury: [2, 5], Jupiter: [8, 11], Venus: [1, 6], Saturn: [9, 10] };

      let dignity = "Neutral";
      if (exaltations[p.name] === signIdx) dignity = "Exalted";
      else if (debilitations[p.name] === signIdx) dignity = "Debilitated";
      else if (ownSigns[p.name]?.includes(signIdx)) dignity = "Own Sign";

      return {
        ...p,
        longitude: siderealLong,
        signIdx,
        degree,
        signName: ZODIAC_SIGNS[signIdx].name,
        sanskritSign: ZODIAC_SIGNS[signIdx].sanskrit,
        lord: ZODIAC_SIGNS[signIdx].lord,
        dignity
      };
    });

    // 2. Compute 16 Divisional Charts (Shodashvarga)
    const generateDivisionalSigns = (planetLong: number, div: number, type: string) => {
      const signIdx = Math.floor(planetLong / 30) % 12;
      const deg = planetLong % 30;
      const dSize = 30 / div;
      const k = Math.floor(deg / dSize);

      switch (type) {
        case "D1": // Rashi
          return signIdx;
        case "D2": // Hora
          if (signIdx % 2 === 0) { // Odd Sign (Aries, Gemini...)
            return deg < 15 ? 4 : 3; // 4=Leo(Sun), 3=Cancer(Moon)
          } else { // Even Sign
            return deg < 15 ? 3 : 4;
          }
        case "D3": // Drekkana
          return (signIdx + k * 4) % 12;
        case "D4": // Chaturthamsa
          return (signIdx + k * 3) % 12;
        case "D7": // Saptamamsa
          return (signIdx % 2 === 0) ? (signIdx + k) % 12 : (signIdx + 6 + k) % 12;
        case "D9": // Navamsa
          let startD9 = 0;
          if (signIdx % 3 === 0) startD9 = signIdx; // Fire (0,4,8)
          else if (signIdx % 3 === 1) startD9 = (signIdx + 8) % 12; // Earth (1,5,9)
          else startD9 = (signIdx + 4) % 12; // Air/Water (2,6,10 or 3,7,11)
          return (startD9 + k) % 12;
        case "D10": // Dasamsa
          return (signIdx % 2 === 0) ? (signIdx + k) % 12 : (signIdx + 8 + k) % 12;
        case "D12": // Dwadasamsa
          return (signIdx + k) % 12;
        case "D16": // Shodashamsa
          const startD16 = (signIdx % 3 === 0) ? 0 : (signIdx % 3 === 1) ? 4 : 8;
          return (startD16 + k) % 12;
        case "D20": // Vimsamsa
          const startD20 = (signIdx % 3 === 0) ? 0 : (signIdx % 3 === 1) ? 8 : 4;
          return (startD20 + k) % 12;
        case "D24": // Chaturvimsamsa
          return (signIdx % 2 === 0) ? (4 + k) % 12 : (3 + k) % 12;
        case "D27": // Saptavimsamsa
          const startD27 = (signIdx % 3 === 0) ? 0 : (signIdx % 3 === 1) ? 9 : (signIdx % 3 === 2) ? 6 : 3;
          return (startD27 + k) % 12;
        case "D30": // Trimsamsa
          if (signIdx % 2 === 0) { // Odd Sign
            if (deg < 5) return 0; // Aries/Mars
            if (deg < 10) return 10; // Aquarius/Saturn
            if (deg < 18) return 8; // Sagittarius/Jupiter
            if (deg < 25) return 2; // Gemini/Mercury
            return 6; // Libra/Venus
          } else { // Even Sign
            if (deg < 5) return 1; // Taurus/Venus
            if (deg < 12) return 5; // Virgo/Mercury
            if (deg < 20) return 11; // Pisces/Jupiter
            if (deg < 25) return 9; // Capricorn/Saturn
            return 7; // Scorpio/Mars
          }
        case "D40": // Khavedamsa
          return (signIdx % 2 === 0) ? k % 12 : (6 + k) % 12;
        case "D45": // Akshavedamsa
          const startD45 = (signIdx % 3 === 0) ? 0 : (signIdx % 3 === 1) ? 4 : 8;
          return (startD45 + k) % 12;
        case "D60": // Shastyamsa
          return (signIdx + k) % 12;
        default:
          return signIdx;
      }
    };

    // Calculate house tables for any division
    const computeHousesForDivision = (divName: string) => {
      const divAscSign = generateDivisionalSigns(siderealAscendant, parseFloat(divName.replace("D", "")) || 1, divName);
      return Array.from({ length: 12 }, (_, i) => {
        const hNum = i + 1;
        const sIdx = (divAscSign + i) % 12;
        const occupants = planets.map(p => ({
          name: p.name,
          glyph: p.glyph,
          divSignIdx: generateDivisionalSigns(p.longitude, parseFloat(divName.replace("D", "")) || 1, divName)
        })).filter(p => p.divSignIdx === sIdx);

        return {
          houseNumber: hNum,
          signIdx: sIdx,
          signName: ZODIAC_SIGNS[sIdx].name,
          sanskritSign: ZODIAC_SIGNS[sIdx].sanskrit,
          lord: ZODIAC_SIGNS[sIdx].lord,
          planets: occupants
        };
      });
    };

    // Precompute all requested divisional charts!
    const divisionalCharts: Record<string, any[]> = {};
    const divs = ["D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"];
    divs.forEach(d => {
      divisionalCharts[d] = computeHousesForDivision(d);
    });

    // 3. Moon Chart (Chandra Kundali)
    const moonPlanet = planets.find(p => p.name === "Moon");
    const moonSignIdx = moonPlanet ? moonPlanet.signIdx : 0;
    const moonHouses = Array.from({ length: 12 }, (_, i) => {
      const hNum = i + 1;
      const sIdx = (moonSignIdx + i) % 12;
      const occupants = planets.filter(p => p.signIdx === sIdx);
      return {
        houseNumber: hNum,
        signIdx: sIdx,
        signName: ZODIAC_SIGNS[sIdx].name,
        lord: ZODIAC_SIGNS[sIdx].lord,
        planets: occupants
      };
    });

    // 4. Nakshatras & Astronomical details of planets
    const planetAstroDetails = planets.map(p => {
      const nakIdx = Math.floor(p.longitude / (360 / 27)) % 27;
      const exactPada = Math.floor((p.longitude % (360 / 27)) / (360 / 108)) + 1;
      const nak = NAKSHATRAS[nakIdx];

      // Dignities
      let dignity = "Neutral";
      const ownSign = ZODIAC_SIGNS[p.signIdx].lord === p.name;
      
      // Traditional Exaltation Degrees
      const exaltations: Record<string, { sign: number; deg: number }> = {
        Sun: { sign: 0, deg: 10 },
        Moon: { sign: 1, deg: 3 },
        Mars: { sign: 9, deg: 28 },
        Mercury: { sign: 5, deg: 15 },
        Jupiter: { sign: 3, deg: 5 },
        Venus: { sign: 11, deg: 27 },
        Saturn: { sign: 6, deg: 20 }
      };

      const ex = exaltations[p.name];
      if (ex) {
        if (p.signIdx === ex.sign) {
          dignity = p.degree <= ex.deg ? "Exalted" : "Own Sign / Great Friend";
        } else if (p.signIdx === (ex.sign + 6) % 12) {
          dignity = "Debilitated";
        } else if (ownSign) {
          dignity = "Own Sign (Swarashi)";
        }
      } else if (ownSign) {
        dignity = "Own Sign (Swarashi)";
      }

      return {
        name: p.name,
        sanskrit: p.sanskritName,
        sign: p.signName,
        sanskritSign: p.sanskritSign,
        degree: parseFloat(p.degree.toFixed(1)),
        nakshatra: nak.name,
        pada: exactPada,
        ruler: nak.lord,
        dignity
      };
    });

    // 5. Transit calculations (Gochar)
    const transitDateObj = new Date(formData.currentDate);
    const transitRaw = get_planetary_positions(transitDateObj);
    const transitPlanets = transitRaw.map(p => {
      const transSidereal = (p.longitude - ayanamsa + 360) % 360;
      const signIdx = Math.floor(transSidereal / 30) % 12;
      return {
        name: p.name,
        signIdx,
        signName: ZODIAC_SIGNS[signIdx].name,
        houseFromLagna: ((signIdx - ascSignIdx + 12) % 12) + 1,
        houseFromMoon: ((signIdx - moonSignIdx + 12) % 12) + 1
      };
    });

    // 6. Vimshottari Dasha calculation (current running periods)
    const natalMoon = planets.find(p => p.name === "Moon");
    const moonLong = natalMoon ? natalMoon.longitude : 0;
    const moonNakIdx = Math.floor(moonLong / (360 / 27)) % 27;
    const dashaStartLordIdx = moonNakIdx % 9;
    const nakBegins = moonNakIdx * (360 / 27);
    const fractionElapsed = (moonLong - nakBegins) / (360 / 27);

    let dashaTimeline: any[] = [];
    let cumulativeYears = fractionElapsed * DASHA_YEARS[DASHA_LORDS[dashaStartLordIdx]];
    let birthTimeMs = birthDateObj.getTime();
    
    // Construct Vimshottari Mahadasha timeline
    let currLordIdx = dashaStartLordIdx;
    let tempTimeMs = birthTimeMs - cumulativeYears * 365.25 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < 9; i++) {
      const lord = DASHA_LORDS[currLordIdx];
      const spanMs = DASHA_YEARS[lord] * 365.25 * 24 * 60 * 60 * 1000;
      const start = new Date(tempTimeMs);
      const end = new Date(tempTimeMs + spanMs);
      
      dashaTimeline.push({
        lord,
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
        duration: DASHA_YEARS[lord]
      });
      tempTimeMs += spanMs;
      currLordIdx = (currLordIdx + 1) % 9;
    }

    const currentTransitTime = transitDateObj.getTime();
    const activeMD = dashaTimeline.find(d => {
      const startMs = new Date(d.start).getTime();
      const endMs = new Date(d.end).getTime();
      return currentTransitTime >= startMs && currentTransitTime <= endMs;
    }) || dashaTimeline[dashaTimeline.length - 1];

    // Compute Antardashas within Active MD
    let activeAD = { lord: "Unknown", start: "", end: "" };
    if (activeMD) {
      const mdStartMs = new Date(activeMD.start).getTime();
      let subTempMs = mdStartMs;
      const totalMdDuration = activeMD.duration;
      let adLordIdx = DASHA_LORDS.indexOf(activeMD.lord);

      for (let j = 0; j < 9; j++) {
        const subLord = DASHA_LORDS[adLordIdx];
        const subYears = (totalMdDuration * DASHA_YEARS[subLord]) / 120;
        const spanMs = subYears * 365.25 * 24 * 60 * 60 * 1000;
        const subStart = new Date(subTempMs);
        const subEnd = new Date(subTempMs + spanMs);

        if (currentTransitTime >= subTempMs && currentTransitTime <= (subTempMs + spanMs)) {
          activeAD = {
            lord: subLord,
            start: subStart.toISOString().split("T")[0],
            end: subEnd.toISOString().split("T")[0]
          };
          break;
        }
        subTempMs += spanMs;
        adLordIdx = (adLordIdx + 1) % 9;
      }
    }

    // 7. Shadbala Relative Strengths (Deterministic Score)
    const computeShadbala = () => {
      return planets.map(p => {
        let score = 50; // base score
        const isExalted = p.dignity === "Exalted";
        const isDebilitated = p.dignity === "Debilitated";
        const isOwn = p.dignity.includes("Own");

        // Sthana Bala
        if (isExalted) score += 30;
        else if (isOwn) score += 20;
        else if (isDebilitated) score -= 25;

        // Dig Bala (Directional)
        const d1House = divisionalCharts["D1"].find(h => h.planets.some(pl => pl.name === p.name));
        const houseNum = d1House ? d1House.houseNumber : 1;
        if ((p.name === "Jupiter" || p.name === "Mercury") && houseNum === 1) score += 20;
        if ((p.name === "Sun" || p.name === "Mars") && houseNum === 10) score += 20;
        if (p.name === "Saturn" && houseNum === 7) score += 20;
        if ((p.name === "Moon" || p.name === "Venus") && houseNum === 4) score += 20;

        return {
          name: p.name,
          glyph: p.glyph,
          totalRupas: parseFloat((score / 10).toFixed(1)),
          percentage: Math.min(100, Math.max(10, score))
        };
      });
    };

    const shadbala = computeShadbala();

    // 8. Doshas Detection Engine (Traditional Shastric rules)
    const detectDoshas = () => {
      const activeDoshas: string[] = [];
      const d1Houses = divisionalCharts["D1"];

      // A. Mangal Dosha
      const marsHouse = d1Houses.find(h => h.planets.some(pl => pl.name === "Mars"));
      if (marsHouse) {
        const hNum = marsHouse.houseNumber;
        if ([1, 2, 4, 7, 8, 12].includes(hNum)) {
          // Check cancellation
          const ownSign = ZODIAC_SIGNS[marsHouse.signIdx].lord === "Mars";
          const jupiterInHouse = marsHouse.planets.some(pl => pl.name === "Jupiter");
          if (!ownSign && !jupiterInHouse) {
            activeDoshas.push("Mangal Dosha");
          }
        }
      }

      // B. Kaal Sarp Dosha
      const rahuHouse = d1Houses.find(h => h.planets.some(pl => pl.name === "Rahu"));
      const ketuHouse = d1Houses.find(h => h.planets.some(pl => pl.name === "Ketu"));
      if (rahuHouse && ketuHouse) {
        let rSign = rahuHouse.signIdx;
        let kSign = ketuHouse.signIdx;
        let start = Math.min(rSign, kSign);
        let end = Math.max(rSign, kSign);

        const insideCount = planets.filter(p => {
          if (p.name === "Rahu" || p.name === "Ketu") return false;
          return p.signIdx > start && p.signIdx < end;
        }).length;

        if (insideCount === 7 || insideCount === 0) {
          activeDoshas.push("Kaal Sarp Dosha");
        }
      }

      // C. Guru Chandal Dosha
      const jupiterHouse = d1Houses.find(h => h.planets.some(pl => pl.name === "Jupiter"));
      if (jupiterHouse && jupiterHouse.planets.some(pl => pl.name === "Rahu" || pl.name === "Ketu")) {
        activeDoshas.push("Guru Chandal Dosha");
      }

      // D. Grahan Dosha
      const sunHouse = d1Houses.find(h => h.planets.some(pl => pl.name === "Sun"));
      const moonHouse = d1Houses.find(h => h.planets.some(pl => pl.name === "Moon"));
      if (sunHouse && sunHouse.planets.some(pl => pl.name === "Rahu" || pl.name === "Ketu")) {
        activeDoshas.push("Grahan Dosha (Sun)");
      }
      if (moonHouse && moonHouse.planets.some(pl => pl.name === "Rahu" || pl.name === "Ketu")) {
        activeDoshas.push("Grahan Dosha (Moon)");
      }

      // E. Kemadruma Dosha (No planets in adjacent houses to Moon)
      if (moonHouse) {
        const mHNum = moonHouse.houseNumber;
        const prevHouseIdx = (mHNum - 2 + 12) % 12;
        const nextHouseIdx = mHNum % 12;
        const hasAdjacentPlanets = d1Houses[prevHouseIdx].planets.length > 0 || d1Houses[nextHouseIdx].planets.length > 0;
        if (!hasAdjacentPlanets) {
          activeDoshas.push("Kemadruma Dosha");
        }
      }

      // F. Shrapit Dosha
      const saturnHouse = d1Houses.find(h => h.planets.some(pl => pl.name === "Saturn"));
      if (saturnHouse && saturnHouse.planets.some(pl => pl.name === "Rahu")) {
        activeDoshas.push("Shrapit Dosha");
      }

      // G. Vish Yoga (Saturn & Moon conjunction)
      if (saturnHouse && saturnHouse.planets.some(pl => pl.name === "Moon")) {
        activeDoshas.push("Vish Yoga");
      }

      return activeDoshas;
    };

    const detectedDoshas = detectDoshas();

    return {
      metadata: {
        name: formData.name || "Seeker",
        dob: formData.dob,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        lat,
        lon,
        concern: formData.concern,
        currentDate: formData.currentDate,
        ayanamsa: parseFloat(ayanamsa.toFixed(3)),
        ascDegree: parseFloat(ascDegree.toFixed(1)),
        ascSignName: ZODIAC_SIGNS[ascSignIdx].name,
        ascSignIdx,
        moonSignIdx
      },
      planets: planetAstroDetails,
      divisionalCharts,
      moonChart: moonHouses,
      transit: transitPlanets,
      dasha: {
        timeline: dashaTimeline,
        activeMD,
        activeAD
      },
      shadbala,
      detectedDoshas
    };
  };

  // Diagnostic engine and report compiler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) {
      alert("Please provide at least your Name and Date of Birth.");
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    
    // Simulate loading steps visually
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingMessages.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 1200);

    try {
      // 1. Calculate rigorous local astrological parameters
      const localCalculationPackage = executeLocalVedicCalculations();

      // 2. Fetch highly customized dynamic summary report from the backend API
      const response = await fetch("/api/vedic-obstacle-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          dob: formData.dob,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          concern: formData.concern,
          currentDate: formData.currentDate,
          currentLocation: formData.currentLocation,
          astroDetails: localCalculationPackage,
          language
        })
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (data.error) {
        throw new Error(data.error);
      }

      // Merge backend report with the full client-side mathematical charts package!
      setReportResult({
        ...localCalculationPackage,
        severityScore: data.severityScore || 65,
        confidenceLevel: data.confidenceLevel || "High",
        rootCauses: data.rootCauses || [
          `Running the Vimshottari Mahadasha of ${localCalculationPackage.dasha.activeMD.lord}`,
          `Transit of Saturn in a challenging relation from Moon or Ascendant`,
          `Afflicted house lord corresponding to ${formData.concern}`
        ],
        timePredictions: data.timePredictions || "Favorable trends emerge when Jupiter transits to the next sign or during your upcoming dasha shift.",
        remedies: data.remedies || [
          { category: "Spiritual", text: `Chant the Beej Mantra of your running dasha lord (${localCalculationPackage.dasha.activeMD.lord}): 108 times daily.` },
          { category: "Charity", text: "Donate black sesame seeds, mustard oil, or blue cloth on Saturdays." },
          { category: "Lifestyle", text: "Practice pranayama and early morning grounding walks; prioritize discipline." }
        ],
        aiExplanation: data.aiExplanation || "Vedic diagnosis complete. See details below."
      });
    } catch (err) {
      console.error("Vedic Analyzer API failure, entering failsafe offline generator mode:", err);
      // Failsafe Rule-Based Engine generates a high-quality report locally if network/Gemini is down!
      const fallbackPackage = executeLocalVedicCalculations();
      
      const mdLord = fallbackPackage.dasha.activeMD.lord;
      const adLord = fallbackPackage.dasha.activeMD.lord === fallbackPackage.dasha.activeAD.lord 
        ? "itself" 
        : fallbackPackage.dasha.activeAD.lord;

      let score = 55;
      let reasons: string[] = [];
      let offlineExplanations = "";

      // Apply rules according to concern
      if (formData.concern === "career" || formData.concern === "business") {
        score = 65;
        reasons.push(`Vimshottari Dasha of ${mdLord} activates professional friction`);
        reasons.push("Saturn's transit influences your career sector, creating constructive delays and testing determination.");
        offlineExplanations = `Your current professional delays are caused by Saturn testing your foundation. With the running Mahadasha of ${mdLord}, expect a slow but highly grounding shift in your focus. Work on building structural disciplines rather than looking for quick escapes. Avoid starting massive risk-prone projects until your sub-dasha matures.`;
      } else if (formData.concern === "marriage" || formData.concern === "love") {
        score = 70;
        reasons.push("Affliction detected in the relationship axis or Navamsa (D9) chart.");
        reasons.push(`Active Antardasha of ${adLord} creating communication friction.`);
        offlineExplanations = `Emotional differences and delays in relationships are highly linked to your Navamsa (D9) chart dynamics. Since you are running the Antardasha of ${adLord}, planetary energies require you to first resolve inner conflicts before seeking external alignment. Be open to patient discussions and do not act out of impulsive insecurity.`;
      } else {
        reasons.push(`Running Vimshottari period of ${mdLord}-${adLord}`);
        reasons.push("General transit alignments require spiritual grounding and patience.");
        offlineExplanations = `Your concerns regarding ${formData.concern.toUpperCase()} are currently undergoing a period of cosmic auditing. The universe is requiring you to slow down, examine your foundations, and address long-ignored patterns. The planetary dasha of ${mdLord} highlights areas needing transformation and mature responsibility.`;
      }

      setReportResult({
        ...fallbackPackage,
        severityScore: score,
        confidenceLevel: "Medium (Offline Engine)",
        rootCauses: reasons,
        timePredictions: "Favorable transits will activate opportunities in the second half of this cycle. Keep refining your inner state.",
        remedies: [
          { category: "Spiritual", text: `Chant the sacred Gayatri Mantra or the Beej Mantra for ${mdLord} daily to harmonize vibrational imbalances.` },
          { category: "Charity", text: "Support non-profits or donate fresh food/water to animals on Saturdays and Tuesdays." },
          { category: "Lifestyle", text: "Maintain a strict daily solar routine (Surya Namaskar at sunrise) to strengthen your life force energy." }
        ],
        aiExplanation: offlineExplanations
      });
    } finally {
      setLoading(false);
    }
  };

  // North Indian Chart SVG Renderer (Fully Responsive and Interactive)
  const renderNorthIndianChart = (houses: any[]) => {
    if (!houses || houses.length < 12) return null;

    // Create house indexes mapping for North Indian Layout
    // Visual diamonds and triangles are drawn with absolute coordinates inside a 400x400 container.
    // Each house number corresponds to a specific area of the North Indian Chart.
    const getHousePlanetsStr = (houseNum: number) => {
      const h = houses.find(hs => hs.houseNumber === houseNum);
      if (!h || !h.planets || h.planets.length === 0) return "";
      return h.planets.map((p: any) => `${p.name.substring(0, 2)} ${parseFloat(p.degree || 0).toFixed(0)}°`).join(", ");
    };

    const getHouseSignStr = (houseNum: number) => {
      const h = houses.find(hs => hs.houseNumber === houseNum);
      if (!h) return "";
      return `${h.signIdx + 1}`; // Vedic convention writes Sign Index (1-based) in each house
    };

    return (
      <svg viewBox="0 0 400 400" className="w-full max-w-[360px] mx-auto border border-amber-500/30 rounded-xl bg-slate-950/80 shadow-inner">
        {/* Border Grid */}
        <rect x="10" y="10" width="380" height="380" fill="none" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.4" />
        
        {/* Diagonals */}
        <line x1="10" y1="10" x2="390" y2="390" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="390" y1="10" x2="10" y2="390" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* Inner Diamond */}
        <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Labels & Planets for the 12 Houses */}
        
        {/* House 1 (Ascendant) - Center Top Diamond */}
        <text x="200" y="130" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(1)}</text>
        <text x="200" y="150" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{getHousePlanetsStr(1)}</text>
        <text x="200" y="90" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">I (Lagna)</text>

        {/* House 2 - Top Left Triangle */}
        <text x="125" y="60" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(2)}</text>
        <text x="110" y="80" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(2)}</text>
        <text x="135" y="45" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">II</text>

        {/* House 3 - Left Top Triangle */}
        <text x="65" y="120" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(3)}</text>
        <text x="65" y="140" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(3)}</text>
        <text x="45" y="115" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">III</text>

        {/* House 4 - Left Center Diamond */}
        <text x="130" y="200" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(4)}</text>
        <text x="130" y="220" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{getHousePlanetsStr(4)}</text>
        <text x="90" y="200" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">IV</text>

        {/* House 5 - Left Bottom Triangle */}
        <text x="65" y="280" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(5)}</text>
        <text x="65" y="300" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(5)}</text>
        <text x="45" y="285" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">V</text>

        {/* House 6 - Bottom Left Triangle */}
        <text x="125" y="340" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(6)}</text>
        <text x="110" y="360" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(6)}</text>
        <text x="135" y="355" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">VI</text>

        {/* House 7 - Bottom Center Diamond */}
        <text x="200" y="270" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(7)}</text>
        <text x="200" y="290" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{getHousePlanetsStr(7)}</text>
        <text x="200" y="325" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">VII</text>

        {/* House 8 - Bottom Right Triangle */}
        <text x="275" y="340" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(8)}</text>
        <text x="290" y="360" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(8)}</text>
        <text x="265" y="355" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">VIII</text>

        {/* House 9 - Right Bottom Triangle */}
        <text x="335" y="280" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(9)}</text>
        <text x="335" y="300" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(9)}</text>
        <text x="355" y="285" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">IX</text>

        {/* House 10 - Right Center Diamond */}
        <text x="270" y="200" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(10)}</text>
        <text x="270" y="220" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{getHousePlanetsStr(10)}</text>
        <text x="310" y="200" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">X</text>

        {/* House 11 - Right Top Triangle */}
        <text x="335" y="120" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(11)}</text>
        <text x="335" y="140" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(11)}</text>
        <text x="355" y="115" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">XI</text>

        {/* House 12 - Top Right Triangle */}
        <text x="275" y="60" fill="#f59e0b" fontSize="11" textAnchor="middle" className="font-mono">{getHouseSignStr(12)}</text>
        <text x="290" y="80" fill="#ffffff" fontSize="10" textAnchor="middle">{getHousePlanetsStr(12)}</text>
        <text x="265" y="45" fill="#f59e0b" fontSize="8" fillOpacity="0.5" textAnchor="middle">XII</text>
      </svg>
    );
  };

  const activeHouses = reportResult ? reportResult.divisionalCharts[activeChartTab] : [];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans pb-16">
      <CelestialBackground />
      <ObstaclesBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4"
          >
            <Shield className="w-4 h-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">{tLocal("shastricDiagnosisEngine")}</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-sans font-bold tracking-tight text-white"
          >
            {tLocal("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-base text-slate-400 leading-relaxed"
          >
            {tLocal("sub")}
          </motion.p>
        </div>

        {/* Input Form Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 bg-transparent border border-slate-800/60 rounded-2xl p-6 shadow-none">
            <h2 className="text-xl font-sans font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" /> {tLocal("birthConcernDetails")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">{tLocal("yourName")}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="name" 
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={tLocal("enterName")} 
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">{tLocal("dob")}</label>
                  <input 
                    type="date" 
                    name="dob" 
                    required
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">{tLocal("exactTime")}</label>
                  <input 
                    type="time" 
                    name="birthTime" 
                    required
                    value={formData.birthTime}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">{tLocal("birthLocation")}</label>
                <BirthPlaceAutocomplete 
                  value={formData.birthPlace}
                  onSelectPlace={handlePlaceSelect}
                  placeholder="Enter city, town, or village name..."
                  language={language}
                />
              </div>

              {/* Geographic Details and Coordinate Panel */}
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 mt-1.5">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Geographic parameters
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAdvancedCoords(!showAdvancedCoords)}
                    className="text-[10px] text-amber-500/80 hover:text-amber-400 font-semibold focus:outline-none transition hover:underline"
                  >
                    {showAdvancedCoords ? "Hide details ▲" : "Show details ▼"}
                  </button>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 font-mono flex items-center justify-between bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-850">
                  <div className="truncate pr-2">
                    <span className="text-slate-500">TZ:</span> <span className="text-slate-300 font-medium">{formData.customTimezone || "Asia/Kolkata"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">LMT Offset:</span> <span className="text-slate-300 font-medium">{(Math.round((parseFloat(formData.customLon) || 77.209) / 15 * 4) / 4) >= 0 ? "+" : ""}{(Math.round((parseFloat(formData.customLon) || 77.209) / 15 * 4) / 4).toFixed(2)}h</span>
                  </div>
                </div>

                {showAdvancedCoords && (
                  <div className="grid grid-cols-2 gap-3.5 mt-3.5 pt-3 border-t border-slate-850/80">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Latitude</label>
                      <input 
                        type="number" 
                        step="any"
                        name="customLat" 
                        value={formData.customLat}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({ ...prev, customLat: val, useCustomCoords: true }));
                        }}
                        placeholder="e.g. 28.6139" 
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">Longitude</label>
                      <input 
                        type="number" 
                        step="any"
                        name="customLon" 
                        value={formData.customLon}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData(prev => ({ ...prev, customLon: val, useCustomCoords: true }));
                        }}
                        placeholder="e.g. 77.2090" 
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50 transition font-mono"
                      />
                    </div>
                    <div className="col-span-2 text-[9px] text-slate-500 font-mono leading-relaxed">
                      * Coordinates are automatically retrieved with high-precision 6+ decimal places from the global search engine for maximum mathematical accuracy in divisional charts (D9, D10, D16, etc.) and Vimshottari Mahadasha calculations.
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">{tLocal("concernArea")}</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {CONCERNS.map(item => {
                    const Icon = item.icon;
                    const isSelected = formData.concern === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, concern: item.id }))}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                          isSelected 
                            ? "bg-amber-500/10 border-amber-500/60 text-white" 
                            : "bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? "text-amber-400" : "text-slate-500"}`} />
                        <span className="text-xs font-medium truncate">
                          {CONCERN_LABELS[language]?.[item.id] || item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">{tLocal("evalTransitDate")}</label>
                  <input 
                    type="date" 
                    name="currentDate" 
                    value={formData.currentDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500/50 transition font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-semibold py-3 px-4 rounded-xl transition duration-300 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{tLocal("analyzingCycles")}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{tLocal("runCosmicDiagnosis")}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results/Dashboard Column */}
          <div className="lg:col-span-8 space-y-8">
            {loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800 rounded-2xl min-h-[400px]"
              >
                <div className="relative w-24 h-24 mb-6">
                  {/* Glowing planetary rings around loader */}
                  <div className="absolute inset-0 rounded-full border-4 border-amber-500/10 border-t-amber-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-purple-500/10 border-b-purple-500 animate-spin [animation-duration:3s]" />
                  <div className="absolute inset-4 rounded-full border-4 border-indigo-500/10 border-r-indigo-500 animate-spin [animation-duration:1.5s]" />
                  <Star className="absolute inset-0 m-auto w-6 h-6 text-amber-500 animate-pulse" />
                </div>
                <h3 className="text-lg font-sans font-medium text-white mb-2">{tLocal("analyzingPatterns")}</h3>
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={loadingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm font-mono text-amber-400/80 text-center max-w-sm"
                  >
                    {loadingMessages[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && !reportResult && (
              <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 border border-slate-800/50 border-dashed rounded-2xl min-h-[400px] text-center">
                <ShieldAlert className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-sans font-semibold text-slate-400">{tLocal("chamberStaleTitle")}</h3>
                <p className="text-slate-500 text-sm max-w-sm mt-2">
                  {tLocal("chamberStaleDesc")}
                </p>
              </div>
            )}

            {/* Complete Report Output */}
            {!loading && reportResult && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Header overview metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Severity Gauge */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center justify-center relative overflow-hidden">
                    <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500">Audited severity</div>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="54" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        <circle 
                          cx="64" 
                          cy="64" 
                          r="54" 
                          stroke={reportResult.severityScore > 65 ? "#ef4444" : "#f59e0b"} 
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray={339.29}
                          strokeDashoffset={339.29 - (339.29 * reportResult.severityScore) / 100}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white font-mono">{reportResult.severityScore}%</span>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Intensity</span>
                      </div>
                    </div>
                    <h4 className="mt-4 text-sm font-sans font-semibold text-slate-300">
                      {tLocal("severityIndex")}: <span className="text-amber-400 font-mono">{reportResult.severityScore > 65 ? tLocal("significant") : tLocal("moderate")}</span>
                    </h4>
                  </div>

                  {/* Active Vimshottari Dasha details */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-400">{tLocal("currentDasha")}</span>
                      <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-500 block">{tLocal("mahadashaLord")}</span>
                        <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
                          <span className="text-amber-400">{PLANET_TRANSLATIONS[language]?.[reportResult.dasha.activeMD.lord] || reportResult.dasha.activeMD.lord}</span>
                          <span className="text-xs font-mono text-slate-400">({DASHA_YEARS[reportResult.dasha.activeMD.lord]} {tLocal("years")})</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">{tLocal("antardashaLord")}</span>
                        <div className="text-lg font-semibold text-slate-200 mt-0.5">
                          {PLANET_TRANSLATIONS[language]?.[reportResult.dasha.activeAD.lord] || reportResult.dasha.activeAD.lord}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-4 bg-slate-950/40 p-2 rounded border border-slate-800/40">
                      {tLocal("runsTill")} {reportResult.dasha.activeAD.end}
                    </div>
                  </div>

                  {/* Shastric Audits and Profiles */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-3 mb-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-400">{tLocal("chartSignature")}</span>
                      <Award className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-500 block">{tLocal("ascendantLagna")}</span>
                        <div className="text-base font-semibold text-white mt-0.5">
                          {ZODIAC_TRANSLATIONS[language]?.[reportResult.metadata.ascSignName] || reportResult.metadata.ascSignName} ({reportResult.metadata.ascDegree}° degree)
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">{tLocal("moonNakshatra")}</span>
                        <div className="text-base font-semibold text-amber-300 mt-0.5">
                          {reportResult.planets.find((p: any) => p.name === "Moon")?.nakshatra || "Unknown"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap mt-4">
                      {reportResult.detectedDoshas.length > 0 ? (
                        reportResult.detectedDoshas.map((d: string) => (
                          <span key={d} className="text-[10px] font-mono bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full">
                            {d}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] font-mono bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded-full">
                          {tLocal("noMajorDoshas")}
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Kundali Visual Grid */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
                    <div>
                      <h3 className="text-lg font-sans font-semibold text-white">{tLocal("interactiveCharts")}</h3>
                      <p className="text-xs text-slate-400 mt-1">{tLocal("interactiveChartsDesc")}</p>
                    </div>

                    {/* Selector */}
                    <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {["D1", "D9", "D10", "D20", "D30", "D60"].map(d => (
                        <button
                          key={d}
                          onClick={() => setActiveChartTab(d)}
                          className={`text-xs font-mono px-3 py-1.5 rounded-lg transition ${
                            activeChartTab === d 
                              ? "bg-amber-500 text-slate-950 font-bold" 
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* SVG Chart Render */}
                    <div className="md:col-span-6 flex flex-col items-center">
                      {renderNorthIndianChart(activeHouses)}
                      <div className="text-[10px] font-mono text-amber-500/60 mt-3 text-center">
                        {tLocal("northIndianStyle").replace("{chart}", activeChartTab)}
                      </div>
                    </div>

                    {/* House Explanations */}
                    <div className="md:col-span-6 space-y-4">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center justify-between">
                          <span>{tLocal("activeBreakdown").replace("{chart}", activeChartTab)}</span>
                          <span className="text-[10px] text-slate-500">{tLocal("lagnaSign")}: {ZODIAC_TRANSLATIONS[language]?.[ZODIAC_SIGNS[activeHouses[0]?.signIdx || 0]?.name] || ZODIAC_SIGNS[activeHouses[0]?.signIdx || 0]?.name}</span>
                        </h4>
                        <div className="max-h-[250px] overflow-y-auto space-y-2.5 pr-2 custom-scrollbar">
                          {activeHouses.map((h: any) => (
                            <div key={h.houseNumber} className="flex items-start justify-between text-xs py-1.5 border-b border-slate-900/60 last:border-0">
                              <div>
                                <span className="font-mono text-slate-400 font-semibold">{tLocal("house")} {h.houseNumber}:</span>
                                <span className="text-slate-200 ml-1.5 font-medium">{ZODIAC_TRANSLATIONS[language]?.[h.signName] || h.signName} ({h.sanskritSign})</span>
                                <span className="text-[10px] font-mono text-slate-500 ml-1.5">Lord: {PLANET_TRANSLATIONS[language]?.[h.lord] || h.lord}</span>
                              </div>
                              <div className="text-right">
                                {h.planets.length > 0 ? (
                                  <span className="text-amber-300 font-bold">
                                    {h.planets.map((pl: any) => PLANET_TRANSLATIONS[language]?.[pl.name] || pl.name).join(", ")}
                                  </span>
                                ) : (
                                  <span className="text-slate-600 font-mono italic">{tLocal("empty")}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Interpretative Diagnosis */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h3 className="text-lg font-sans font-semibold text-white flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse" /> {tLocal("astrologicalVerdict")}
                    </h3>
                    
                    <div className="flex gap-2">
                      {/* Narration voice trigger */}
                      <button 
                        onClick={toggleTTS}
                        title={tLocal("readWisdomAloud")}
                        className={`p-2 rounded-xl border transition ${
                          isPlayingAudio 
                            ? "bg-amber-500 border-amber-500 text-slate-950" 
                            : "bg-slate-950 border-slate-800 text-amber-400 hover:border-slate-700"
                        }`}
                      >
                        {isPlayingAudio ? <VolumeX className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Print action trigger */}
                      <button 
                        onClick={() => window.print()}
                        title={tLocal("printReport")}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:border-slate-700 transition"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Verdict and summary */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Root Causes List */}
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> {tLocal("primaryObstacleRoots")}
                        </h4>
                        <ul className="space-y-2">
                          {reportResult.rootCauses.map((cause: string, i: number) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                              <span className="text-amber-500/80 font-mono">[{i + 1}]</span>
                              <span>{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Time Predictions */}
                      <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> {tLocal("favorableTimingWindows")}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {reportResult.timePredictions}
                        </p>
                      </div>

                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 mt-4 leading-relaxed font-sans text-slate-300 text-sm whitespace-pre-wrap">
                      {reportResult.aiExplanation}
                    </div>
                  </div>
                </div>

                {/* Planetary Strengths Detail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Shadbala Graph */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-base font-sans font-semibold text-white mb-4">{tLocal("shadbalaStrengths")}</h3>
                    <div className="space-y-3.5">
                      {reportResult.shadbala.map((p: any) => (
                        <div key={p.name} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-300 flex items-center gap-1">
                              <span className="text-slate-400 font-mono text-[10px]">{p.glyph}</span> {PLANET_TRANSLATIONS[language]?.[p.name] || p.name}
                            </span>
                            <span className="text-amber-400 font-mono text-[10px]">{p.totalRupas} Rupas ({p.percentage}%)</span>
                          </div>
                          <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full" 
                              style={{ width: `${p.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transit Status (Gochar) */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-base font-sans font-semibold text-white mb-4">{tLocal("transitGochar")}</h3>
                    <div className="max-h-[290px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {reportResult.transit.map((t: any) => (
                        <div key={t.name} className="flex items-center justify-between bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/40 text-xs">
                          <span className="font-semibold text-slate-200">{PLANET_TRANSLATIONS[language]?.[t.name] || t.name}</span>
                          <div className="flex gap-4">
                            <div className="text-slate-400">
                              {tLocal("transitSign")}: <span className="text-amber-300">{ZODIAC_TRANSLATIONS[language]?.[t.signName] || t.signName}</span>
                            </div>
                            <div className="text-slate-400">
                              {tLocal("lagnaHouse")}: <span className="text-purple-400">H{t.houseFromLagna}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Remedial Solutions (Shastric remedies) */}
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-sans font-semibold text-white mb-2">{tLocal("remedialFramework")}</h3>
                  <p className="text-xs text-slate-400 mb-6">{tLocal("remedialFrameworkDesc")}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reportResult.remedies.map((rem: any, i: number) => (
                      <div key={i} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-5 hover:border-amber-500/20 transition">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500 bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10">
                          {rem.category} {tLocal("remedySuffix")}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed mt-4 font-sans">
                          {rem.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Non-deterministic disclaimer */}
                <div className="text-[10px] font-mono text-slate-500 text-center bg-slate-900/10 border border-slate-900 rounded-xl p-4">
                  {tLocal("disclaimer")}
                </div>

              </motion.div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
