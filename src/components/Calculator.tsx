import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  getCompatibility,
  numberMeanings as rawNumberMeanings,
  pythagoreanMap,
} from "../data/numerologyData";
import {
  mulankProfiles as rawMulankProfiles,
  get_planetary_positions,
  getMulankPrediction,
} from "../data/vedicData";
import { CalculationResult, NumberMeaning } from "../types";
import { useLanguage } from "../context/LanguageContext";
import {
  Shield,
  Sparkles,
  BookOpen,
  Star,
  HelpCircle,
  X,
  ChevronRight,
  Mail,
  LogOut,
  Trash2,
  Bookmark,
  Check,
  History,
  User,
  Calendar,
  Orbit,
  Compass,
  RefreshCw,
  Pause,
  Play,
  Square,
  Volume2,
  AlertCircle,
} from "lucide-react";
import Swastika from "./Swastika";
import CelestialBackground from "./CelestialBackground";
import CalculatorVideoBackground from "./CalculatorVideoBackground";

export interface DestinyProfile {
  id: string;
  name: string;
  day: string;
  month: string;
  year: string;
  calcYear: string;
  results: CalculationResult;
  savedAt: string;
  email: string; // "guest" or logged-in email
}

export default function Calculator() {
  const {
    language,
    t,
    getNumberMeaning,
    getMulankProfile,
    translatePrediction,
    speak,
    speechState,
    activeReadingId,
    voiceErrorId,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
  } = useLanguage();

  const numberMeanings = React.useMemo(() => {
    const proxy: Record<string, NumberMeaning> = {};
    Object.keys(rawNumberMeanings).forEach((key) => {
      proxy[key] = getNumberMeaning(key);
    });
    return proxy;
  }, [language, getNumberMeaning]);

  const mulankProfiles = React.useMemo(() => {
    const proxy: Record<number, any> = {};
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((val) => {
      proxy[val] = getMulankProfile(val);
    });
    return proxy;
  }, [language, getMulankProfile]);

  const handleSpeakMulank = () => {
    const p = mulankProfiles[mulankVal!];
    if (!p) return;
    const traitsText = p.traits.join(". ");
    const strengthsText = p.strengths.join(". ");

    let script = "";
    if (language === "en") {
      script = `Svara speaking. You are Root Number ${mulankVal}, ruled by planetary energy ${p.planet}, ${p.sanskritName}. Your core characteristics are: ${traitsText}. Your anchored strengths are: ${strengthsText}. Your auspicious color is ${p.luckyColor}.`;
    } else if (language === "hi") {
      script = `स्वरा दिव्य वाणी बोल रही है: आपका मूलांक ${mulankVal} है, जिसके स्वामी ग्रह ${p.planet} (${p.sanskritName}) हैं। आपके मूल गुण हैं: ${traitsText} आपकी ताकतें हैं: ${strengthsText} आपका शुभ रंग है ${p.luckyColor}।`;
    } else if (language === "bn") {
      script = `স্বরা মহাজাগতিক বাণী শোনাচ্ছে: আপনার মূলাঙ্ক হলো ${mulankVal}, এবং এর শাসক গ্রহ ${p.planet}। আপনার প্রধান বৈশিষ্ট্যগুলি হলো: ${traitsText} আপনার শুভ শক্তিগুলি হলো: ${strengthsText} আপনার সৌভাগ্যের রঙ হলো ${p.luckyColor}।`;
    } else if (language === "mr") {
      script = `स्वरा अलौकिक संवाद साधत आहे: तुमची मूलांक संख्या ${mulankVal} असून स्वामी ग्रह ${p.planet} आहेत। तुमचे स्वभाव विशेष आहेत: ${traitsText} तुमची प्रमुख बलस्थाने आहेत: ${strengthsText} तुमचा भाग्यवान रंग ${p.luckyColor} हा आहे।`;
    } else if (language === "gu") {
      script = `સ્વરા દિવ્ય અવાજ પ્રગટ થાય છે: તમારો મૂલાંક ${mulankVal} છે, જેના સ્વામી ગ્રહ ${p.planet} છે. તમારા મુખ્ય લક્ષણો છે: ${traitsText} તમારી અદભુત શક્તિઓ છે: ${strengthsText} તમારો લકી કલર ${p.luckyColor} છે.`;
    }
    speak(script, `mulank-${mulankVal}`);
  };

  const handleSpeakBhagyank = () => {
    const p = mulankProfiles[bhagyankVal!];
    if (!p) return;
    const careers = p.careerInclinations.slice(0, 3).join(", ");

    let script = "";
    if (language === "en") {
      script = `Svara speaking. Your Destiny Bhagyank number is ${bhagyankVal}, governed by the planetary influence of ${p.planet} (${p.sanskritName}). It shapes your outer fate and life path. Optimal career directions aligned with this frequency are: ${careers}. Your favorable companion values are: ${p.luckyNumbers.join(", ")}.`;
    } else if (language === "hi") {
      script = `स्वरा दिव्य वाणी बोल रही है: आपका भाग्यांक ${bhagyankVal} है, जिसके स्वामी ग्रह ${p.planet} (${p.sanskritName}) हैं। यह आपके बाहरी भाग्य और जीवन मार्ग को आकार देता है। इस ऊर्जा के अनुकूल करियर क्षेत्र हैं: ${careers}। आपके शुभ मार्गदर्शक अंक हैं: ${p.luckyNumbers.join(", ")}।`;
    } else if (language === "bn") {
      script = `স্বরা মহাজাগতিক বাণী শোনাচ্ছে: আপনার ভাগ্যাঙ্ক হলো ${bhagyankVal}, এবং এর শাসক গ্রহ ${p.planet}। এটি আপনার জীবনের বাহ্যিক ভাগ্য এবং পথ নির্দেশ করে। আপনার উপযোগী কর্মক্ষেত্রগুলি হলো: ${careers}। আপনার অনুকূল সংখ্যাগুলি হলো: ${p.luckyNumbers.join(", ")}।`;
    } else if (language === "mr") {
      script = `स्वरा अलौकिक संवाद साधत आहे: तुमची भाग्यांक संख्या ${bhagyankVal} असून स्वामी ग्रह ${p.planet} आहेत। हे तुमचे बाह्य नशीब आणि जीवन मार्ग ठरवते। तुमच्यासाठी योग्य करिअर क्षेत्रे: ${careers} ही आहेत। तुमचे अनुकूल अंक: ${p.luckyNumbers.join(", ")}।`;
    } else if (language === "gu") {
      script = `સ્વરા દિવ્ય અવાજ પ્રગટ થાય છે: તમારો ભાગ્યાંક ${bhagyankVal} છે, જેના સ્વામી ગ્રહ ${p.planet} છે. આ તમારા બાહ્ય ભાગ્ય અને જીવન પથને નક્કી કરે છે. તમારા માટે અનુકૂળ કારકિર્દી ક્ષેત્રો છે: ${careers}. તમારા લકી નંબર્સ છે: ${p.luckyNumbers.join(", ")}.`;
    }
    speak(script, `bhagyank-${bhagyankVal}`);
  };

  const handleSpeakDailyPrediction = () => {
    if (!prediction) return;
    const pTrans = translatePrediction(prediction);
    let script = "";
    if (language === "en") {
      script = `Daily guidance for root number ${mulankVal}. Current transit is governed by ruling planet ${pTrans.rulingPlanet}. The cosmic forecast reveals: ${pTrans.forecast}. Aligned action advice is: ${pTrans.actionAdvice}.`;
    } else if (language === "hi") {
      script = `मूलांक ${mulankVal} के लिए आज का दिव्य संदेश। आज के गोचर के स्वामी ग्रह ${pTrans.rulingPlanet} हैं। ब्रह्मांडीय पूर्वानुमान कहता है: ${pTrans.forecast} इसके लिए आज की शुभ सलाह है: ${pTrans.actionAdvice}।`;
    } else if (language === "bn") {
      script = `মূলাঙ্ক ${mulankVal} এর আজকের দৈনন্দิน নির্দেশনা। আজকের রাশিচক্রের শাসক গ্রহ হলো ${pTrans.rulingPlanet}। মহাজাগতিক পূর্বাভাস বলছে: ${pTrans.forecast} এর জন্য শুভ পরম পরামর্শ হলো: ${pTrans.actionAdvice}।`;
    } else if (language === "mr") {
      script = `मूलांक संख्या ${mulankVal} साठी आजचा अलौकिक संदेश। आजचा स्वामी ग्रह ${pTrans.rulingPlanet} आहे। आजचे भाकीत सांगत आहे: ${pTrans.forecast} नात्याची व कृतीची शुभ दिशा: ${pTrans.actionAdvice}।`;
    } else if (language === "gu") {
      script = `મૂલાંક ${mulankVal} માટે આજનું વિશેષ માર્ગદર્શન. આજના નક્ષત્ર સ્વામી ગ્રહ ${pTrans.rulingPlanet} છે. બ્રહ્માંડ ભવિષ્યવાણી દર્શાવે છે: ${pTrans.forecast} આજના સફળ કાર્યો માટે સલાહ છે: ${pTrans.actionAdvice}.`;
    }
    speak(script, `transit-${mulankVal}`);
  };

  const getCoordinateLabel = (key: string): string => {
    if (language === "hi") {
      if (key === "lifePath") return "जीवन पथ (Life Path)";
      if (key === "destiny") return "भाग्य (Destiny)";
      if (key === "soulUrge") return "आत्मा की इच्छा (Soul Urge)";
      if (key === "personality") return "व्यक्तित्व (Personality)";
      if (key === "birthday") return "जन्मदिन (Birthday)";
      if (key === "personalYear") return "व्यक्तिगत वर्ष (Personal Year)";
    } else if (language === "bn") {
      if (key === "lifePath") return "জীবন পথ (Life Path)";
      if (key === "destiny") return "ভাগ্য (Destiny)";
      if (key === "soulUrge") return "আত্মার ইচ্ছা (Soul Urge)";
      if (key === "personality") return "ব্যক্তিত্ব (Personality)";
      if (key === "birthday") return "জন্মদিন (Birthday)";
      if (key === "personalYear") return "ব্যক্তিগত বছর (Personal Year)";
    } else if (language === "mr") {
      if (key === "lifePath") return "जीवन पथ (Life Path)";
      if (key === "destiny") return "भाग्य (Destiny)";
      if (key === "soulUrge") return "आत्म्याची तीव्र इच्छा (Soul Urge)";
      if (key === "personality") return "व्यक्तिमत्व (Personality)";
      if (key === "birthday") return "वाढदिवस (Birthday)";
      if (key === "personalYear") return "वैयक्तिक वर्ष (Personal Year)";
    } else if (language === "gu") {
      if (key === "lifePath") return "જીવન પથ (Life Path)";
      if (key === "destiny") return "ભાગ્ય (Destiny)";
      if (key === "soulUrge") return "આત્માની પ્રબળ ઈચ્છા (Soul Urge)";
      if (key === "personality") return "વ્યક્તિત્વ (Personality)";
      if (key === "birthday") return "જન્મદિવસ (Birthday)";
      if (key === "personalYear") return "વ્યક્તિગત वर्ष (Personal Year)";
    }
    if (key === "lifePath") return "Life Path";
    if (key === "destiny") return "Destiny";
    if (key === "soulUrge") return "Soul Urge";
    if (key === "personality") return "Personality";
    if (key === "birthday") return "Birthday";
    if (key === "personalYear") return "Personal Year";
    return key;
  };

  const handleSpeakWestern = (
    label: string,
    num: number,
    readingId: string,
  ) => {
    const meaning = getNumberMeaning(num);
    const title = meaning.title || "";
    const essence = meaning.essence || "";
    const strengths = (meaning.strengths || []).join(", ");

    let script = "";
    if (language === "hi") {
      script = `स्वरा दिव्य वाणी बोल रही है: आपके ${label} की ऊर्जा संख्या ${num} है, जिसका शीर्षक ${title} है। मुख्य सार है: ${essence}। आपके विशेष लाभ हैं: ${strengths}।`;
    } else if (language === "bn") {
      script = `স্বরা মহাজাগতিক বাণী শোনাচ্ছে: আপনার ${label} স্পন্দন সংখ্যা হলো ${num} যার মহাজাগতিক রূপ ${title}। প্রধান বিবরণ: ${essence}। আপনার শক্তির দিকগুলি হলো: ${strengths}।`;
    } else if (language === "mr") {
      script = `स्वरा अलौकिक संवाद साधत आहे: तुमची ${label} संख्या ${num} आहे, ज्याचे नाव ${title} आहे। मुख्य सारांश: ${essence}। तुमचे बलस्थाने: ${strengths}।`;
    } else if (language === "gu") {
      script = `સ્વરા દિવ્ય અવાજ રજૂ કરે છે: તમારી ${label} વાઇબ્રેશન સંખ્યા ${num} છે, જેનું શીર્ષક ${title} છે. મુખ્ય વિગતો: ${essence} તમારી વિશેષ શક્તિઓ: ${strengths}.`;
    } else {
      script = `Svara speaking. Your ${label} vibration number is ${num}, signifying the archetype of ${title}. The celestial essence is: ${essence}. Your strengths include: ${strengths}.`;
    }

    speak(script, readingId);
  };

  const [activeSystem, setActiveSystem] = useState<"western" | "vedic">(
    "western",
  );
  const [name, setName] = useState("");
  const [day, setDay] = useState("15");
  const [month, setMonth] = useState("08");
  const [year, setYear] = useState("1995");
  const [calcYear, setCalcYear] = useState("2026");

  // Vedic states
  const [vedicDay, setVedicDay] = useState("23");
  const [vedicMonth, setVedicMonth] = useState("10");
  const [vedicYear, setVedicYear] = useState("1996");
  const [isVedicCalculating, setIsVedicCalculating] = useState(false);
  const [hasVedicCalculated, setHasVedicCalculated] = useState(false);
  const [vedicSteps, setVedicSteps] = useState<string[]>([]);
  const [mulankVal, setMulankVal] = useState<number | null>(null);
  const [bhagyankVal, setBhagyankVal] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<any | null>(null);
  const [isFetchingPrediction, setIsFetchingPrediction] = useState(false);

  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [selectedNumDetail, setSelectedNumDetail] =
    useState<NumberMeaning | null>(null);

  // Sync modal content if language changes live to prevent disappearing or stale rows
  useEffect(() => {
    if (selectedNumDetail) {
      const updated = getNumberMeaning(String(selectedNumDetail.number));
      if (updated) setSelectedNumDetail(updated);
    }
  }, [language, selectedNumDetail?.number]);

  // Email authentication states
  const [activeEmail, setActiveEmail] = useState<string>(() => {
    return localStorage.getItem("ank_active_email") || "";
  });
  const [emailInput, setEmailInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Saved Profiles state
  const [savedProfiles, setSavedProfiles] = useState<DestinyProfile[]>(() => {
    const stored = localStorage.getItem("ank_saved_profiles");
    return stored ? JSON.parse(stored) : [];
  });

  // State to hold custom name for the report when saving
  const [customProfileName, setCustomProfileName] = useState("");
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Custom count up animation values
  const [displayVals, setDisplayVals] = useState({
    lifePath: 0,
    destiny: 0,
    soulUrge: 0,
    personality: 0,
    birthday: 0,
    personalYear: 0,
  });

  // Track active interactive 3D rotations
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const lastSwitchTime = useRef(0);
  useEffect(() => {
    if (typeof window === "undefined") return;

    let touchStartY = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastSwitchTime.current < 650) return;

      const element = document.getElementById("calculator");
      const calculatorTop = element ? element.offsetTop : 0;

      // If we scroll up and scroll offset is near or above the calculator section's top boundary
      const relativeOffset = window.scrollY - calculatorTop;

      if (e.deltaY < -18 && relativeOffset <= 250) {
        setActiveSystem((prev) => {
          lastSwitchTime.current = now;
          return prev === "western" ? "vedic" : "western";
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const dragDistance = touchEndY - touchStartY; // positive swipe down -> scrolls page up

      const now = Date.now();
      if (now - lastSwitchTime.current < 650) return;

      const element = document.getElementById("calculator");
      const calculatorTop = element ? element.offsetTop : 0;
      const relativeOffset = window.scrollY - calculatorTop;

      if (dragDistance > 65 && relativeOffset <= 250) {
        setActiveSystem((prev) => {
          lastSwitchTime.current = now;
          return prev === "western" ? "vedic" : "western";
        });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Reduction helper respecting 11, 22, 33
  const reduceToNumerology = (num: number): number => {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = String(num)
        .split("")
        .reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return num;
  };

  // --- VEDIC SPECIFIC UTILITIES ---
  const calculateVedicMulank = (d: number): number => {
    let val = d;
    while (val > 9) {
      val = String(val)
        .split("")
        .reduce((acc, char) => acc + parseInt(char, 10), 0);
    }
    return val;
  };

  const calculateVedicBhagyank = (
    dStr: string,
    mStr: string,
    yStr: string,
  ): number => {
    const fullStr = `${dStr.padStart(2, "0")}${mStr.padStart(2, "0")}${yStr}`;
    let sum = fullStr
      .split("")
      .reduce((acc, char) => acc + parseInt(char, 10), 0);
    while (sum > 9) {
      sum = String(sum)
        .split("")
        .reduce((acc, char) => acc + parseInt(char, 10), 0);
    }
    return sum;
  };

  const generateVedicReductionSteps = (dayNum: number): string[] => {
    const steps: string[] = [];
    steps.push(`${dayNum}`);
    if (dayNum > 9) {
      const digits = String(dayNum).split("");
      const sum = digits.reduce((a, b) => a + parseInt(b, 10), 0);
      steps.push(`${digits.join(" + ")} → ${sum}`);
      if (sum > 9) {
        const secondDigits = String(sum).split("");
        const secondSum = secondDigits.reduce((a, b) => a + parseInt(b, 10), 0);
        steps.push(`${secondDigits.join(" + ")} → ${secondSum}`);
      }
    }
    return steps;
  };

  const startVedicCalculation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVedicCalculating(true);
    setHasVedicCalculated(false);
    setVedicSteps([]);
    setMulankVal(null);
    setBhagyankVal(null);
    setPrediction(null);

    const dNum = parseInt(vedicDay, 10);
    const stepsList = generateVedicReductionSteps(dNum);
    const finalMulank = calculateVedicMulank(dNum);
    const finalBhagyank = calculateVedicBhagyank(
      vedicDay,
      vedicMonth,
      vedicYear,
    );

    let idx = 0;
    const currentList: string[] = [];
    const interval = setInterval(() => {
      if (idx < stepsList.length) {
        currentList.push(stepsList[idx]);
        setVedicSteps([...currentList]);
        idx++;
      } else {
        clearInterval(interval);
        setMulankVal(finalMulank);
        setBhagyankVal(finalBhagyank);
        setIsVedicCalculating(false);
        setHasVedicCalculated(true);

        setTimeout(() => {
          const el = document.getElementById("vedic_results_anchor");
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
    }, 600);
  };

  const fetchVedicPrediction = () => {
    if (!mulankVal) return;
    setIsFetchingPrediction(true);
    setTimeout(() => {
      const pred = getMulankPrediction(mulankVal, new Date());
      setPrediction(pred);
      setIsFetchingPrediction(false);
      setTimeout(() => {
        const el = document.getElementById("vedic_prediction_anchor");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }, 800);
  };

  const loadTestCase = () => {
    setName("John Michael Smith");
    setDay("15");
    setMonth("08");
    setYear("1995");
    setCalcYear("2026");
  };

  const calculateNumerology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCalculating(true);
    setHasCalculated(false);

    // 1. Life Path (Full DOB digits sum)
    const dobString = `${day.padStart(2, "0")}${month.padStart(2, "0")}${year}`;
    const dobDigitsSum = dobString
      .split("")
      .reduce((sum, char) => sum + (parseInt(char, 10) || 0), 0);
    const lifePath = reduceToNumerology(dobDigitsSum);

    // 2. Full Name Filtering
    const sanitizedName = name.toUpperCase().replace(/[^A-Z]/g, "");

    // 3. Expression/Destiny (All letters)
    const nameSum = sanitizedName
      .split("")
      .reduce((sum, char) => sum + (pythagoreanMap[char] || 0), 0);
    const destiny = reduceToNumerology(nameSum);

    // 4. Soul Urge (Vowels list: A, E, I, O, U)
    const vowels = ["A", "E", "I", "O", "U"];
    const vowelSum = sanitizedName
      .split("")
      .filter((char) => vowels.includes(char))
      .reduce((sum, char) => sum + (pythagoreanMap[char] || 0), 0);
    const soulUrge = reduceToNumerology(vowelSum);

    // 5. Personality (Consonants list - not vowels)
    const consonantSum = sanitizedName
      .split("")
      .filter((char) => !vowels.includes(char))
      .reduce((sum, char) => sum + (pythagoreanMap[char] || 0), 0);
    const personality = reduceToNumerology(consonantSum);

    // 6. Birthday (Day string reduced)
    const birthdayVal = parseInt(day, 10);
    const birthday = reduceToNumerology(birthdayVal);

    // 7. Personal Year (Day + Month + Current calculating year)
    // Formula: sum of reduced Day, Month, and calculated Year
    const dayReduced = reduceToNumerology(parseInt(day, 10));
    const monthReduced = reduceToNumerology(parseInt(month, 10));
    const calcYearSum = calcYear
      .split("")
      .reduce((sum, char) => sum + (parseInt(char, 10) || 0), 0);
    const yearReduced = reduceToNumerology(calcYearSum);
    const personalYear = reduceToNumerology(
      dayReduced + monthReduced + yearReduced,
    );

    const calculated: CalculationResult = {
      lifePath,
      destiny,
      soulUrge,
      personality,
      birthday,
      personalYear,
    };

    setResults(calculated);

    // Launch count-up animations simulating alignment
    setTimeout(() => {
      setIsCalculating(false);
      setHasCalculated(true);

      const duration = 1200; // ms
      const steps = 30;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        setDisplayVals({
          lifePath: Math.round(calculated.lifePath * progress),
          destiny: Math.round(calculated.destiny * progress),
          soulUrge: Math.round(calculated.soulUrge * progress),
          personality: Math.round(calculated.personality * progress),
          birthday: Math.round(calculated.birthday * progress),
          personalYear: Math.round(calculated.personalYear * progress),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          // Set absolute final values to matches master values exactly
          setDisplayVals({
            lifePath: calculated.lifePath,
            destiny: calculated.destiny,
            soulUrge: calculated.soulUrge,
            personality: calculated.personality,
            birthday: calculated.birthday,
            personalYear: calculated.personalYear,
          });
        }
      }, duration / steps);
    }, 1000);
  };

  const toggleFlip = (key: string) => {
    setFlippedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showDetailModal = (numValue: number | string) => {
    const detail = numberMeanings[String(numValue)];
    if (detail) setSelectedNumDetail(detail);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsLoggingIn(true);
    setTimeout(() => {
      const formattedEmail = emailInput.trim().toLowerCase();
      setActiveEmail(formattedEmail);
      localStorage.setItem("ank_active_email", formattedEmail);
      setIsLoggingIn(false);
      setEmailInput("");
    }, 900);
  };

  const handleLogout = () => {
    setActiveEmail("");
    localStorage.removeItem("ank_active_email");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !results) return;

    const profileTitle =
      customProfileName.trim() || name.trim() + "'s Destiny Map";
    const newProfile: DestinyProfile = {
      id: "prof_" + Date.now(),
      name: profileTitle,
      day,
      month,
      year,
      calcYear,
      results,
      savedAt: new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      email: activeEmail || "guest",
    };

    const updated = [newProfile, ...savedProfiles];
    setSavedProfiles(updated);
    localStorage.setItem("ank_saved_profiles", JSON.stringify(updated));
    setCustomProfileName("");
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const loadProfile = (prof: DestinyProfile) => {
    setName(prof.name.replace(/['’]s Destiny Map$/i, "").replace(/['’]s/i, ""));
    setDay(prof.day);
    setMonth(prof.month);
    setYear(prof.year);
    setCalcYear(prof.calcYear);
    setResults(prof.results);
    setHasCalculated(true);
    setIsCalculating(false);

    setDisplayVals({
      lifePath: prof.results.lifePath,
      destiny: prof.results.destiny,
      soulUrge: prof.results.soulUrge,
      personality: prof.results.personality,
      birthday: prof.results.birthday,
      personalYear: prof.results.personalYear,
    });

    // Auto scroll to results
    setTimeout(() => {
      const el = document.getElementById("results_destination");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const deleteProfile = (id: string) => {
    const updated = savedProfiles.filter((p) => p.id !== id);
    setSavedProfiles(updated);
    localStorage.setItem("ank_saved_profiles", JSON.stringify(updated));
  };

  // Generate range of options
  const daysArray = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const monthsArray = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );
  const yearsArray = Array.from({ length: 120 }, (_, i) => String(2026 - i));
  const calcYearsArray = Array.from({ length: 10 }, (_, i) => String(2022 + i));

  return (
    <section
      id="calculator"
      className="relative py-52 md:py-64 px-4 bg-transparent overflow-hidden border-t border-amber-500/5"
    >
      {/* Living background cosmic video integration */}
      <CalculatorVideoBackground />

      {/* Background celestial effect background layer */}
      <CelestialBackground glowColor="amber" intensity="medium" />

      {/* Background radial alignment light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Component Title Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-400/20 rounded-full text-xs text-amber-300 font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(197,168,128,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 rotate-12 animate-pulse" />
            {language === "hi"
              ? "पवित्र गणितीय इंजन"
              : language === "bn"
                ? "পবিত্র গাণিতিক ইঞ্জিন"
                : language === "mr"
                  ? "पवित्र गणितीय इंजिन"
                  : language === "gu"
                    ? "પવિત્ર ગાણિતીક એન્જિન"
                    : "Sacred Mathematical Engine"}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wider font-bold shadow-glow-title uppercase">
            {language === "hi"
              ? "दिव्य कैलकुलेटर"
              : language === "bn"
                ? "মহাজাগতিক ক্যালকুলেটর"
                : language === "mr"
                  ? "दिव्य कॅल्क्युलेटर"
                  : language === "gu"
                    ? "આકાશી કેલ્ક્યુલેટર"
                    : "CELESTIAL CALCULATOR"}
          </h2>
          <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm md:text-base">
            {language === "hi"
              ? "अपने भाग्य पथ और दिव्य संबंधों की गणना करने के लिए अपना पूरा जन्म नाम और जन्म तिथि दर्ज करें।"
              : language === "bn"
                ? "আপনার ভাগ্যের পথ এবং মহাজাগतिक সংযোগ গণনা করতে আপনার জন্মের পুরো নাম এবং জন্মতারিখ লিখুন।"
                : language === "mr"
                  ? "आपला भाग्य पथ आणि दैवी संबंध मोजण्यासाठी आपले पूर्ण जन्म नाव आणि जन्मतारीख प्रविष्ट करा."
                  : language === "gu"
                    ? "તમારો ભાગ્ય પથ અને દિવ્ય કનેક્શન્સ ગણવા માટે તમારું પૂરું નામ અને જન્મ તારીખ દાખલ કરો."
                    : "Enter your full birth name and date of birth to calculate your life path and cosmic connections."}
          </p>
        </div>

        {/* System Selector Tabs */}
        <div className="flex justify-center border border-zinc-800/60 pb-[1px] mb-12 max-w-xl mx-auto relative z-40 bg-[#16141a]/60 backdrop-blur-md rounded-xl p-1 gap-1 shadow-lg">
          {[
            {
              id: "western",
              label:
                language === "hi"
                  ? "पश्चिमी न्यूमरोलॉजी (Western)"
                  : language === "bn"
                    ? "পাশ্চাত্য সংখ্যাতত্ত্ব (Western)"
                    : language === "mr"
                      ? "पाश्चात्य अंकशास्त्र (Western)"
                      : language === "gu"
                        ? "પશ્ચિમી ન્યુમરોલોજી (Western)"
                        : "Western Numerology",
            },
            {
              id: "vedic",
              label:
                language === "hi"
                  ? "वैदिक मूलांक और भाग्यांक"
                  : language === "bn"
                    ? "বৈদিক মূলাঙ্ক ও ভাগ্যাঙ্ক"
                    : language === "mr"
                      ? "वैदिक मूलांक आणि भाग्यांक"
                      : language === "gu"
                        ? "વૈદિક મૂલાંક અને ભાગ્યાંક"
                        : "Vedic Mulank & Bhagyank",
            },
          ].map((sys) => {
            const isActive = activeSystem === sys.id;
            return (
              <button
                key={sys.id}
                onClick={() => {
                  setActiveSystem(sys.id as "western" | "vedic");
                }}
                className={`
                  flex-1 py-5 px-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold transition-all cursor-pointer relative text-center rounded-lg select-none duration-150 outline-none hover:bg-white/5 active:scale-98
                  ${isActive ? "text-amber-400 font-bold" : "text-zinc-300 hover:text-white font-medium"}
                `}
                style={{ touchAction: "manipulation" }}
              >
                <span className="relative z-10 block">{sys.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSystemUnderline"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Form Container Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeSystem === "western" ? (
            <motion.div
              key="western"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-7 bg-transparent border border-zinc-800/80 rounded-2xl p-6 md:p-8 relative transition-all duration-300 hover:border-[#c5a880]/35">
                  <button
                    type="button"
                    onClick={loadTestCase}
                    className="absolute -top-3.5 right-6 px-3.5 py-1.5 bg-[#c5a880] text-slate-950 font-bold font-mono text-[10px] rounded-full hover:bg-amber-100 transition-all uppercase tracking-widest shadow-[0_4px_12px_rgba(197,168,128,0.35)]"
                  >
                    ⚡{" "}
                    {language === "hi"
                      ? "टेस्ट केस John Smith"
                      : language === "bn"
                        ? "টেস্ট কেস John Smith"
                        : language === "mr"
                          ? "चाचणी केस John Smith"
                          : language === "gu"
                            ? "ટેસ્ટ કેસ John Smith"
                            : "Load Test Case (John Smith)"}
                  </button>

                  <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-6">
                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                    <div>
                      <h3 className="font-serif text-lg text-white uppercase tracking-wider font-bold">
                        {t("calc.titleWestern") || "PSYCHO-NUMERIC MATRIX"}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-400 uppercase mt-0.5">
                        {t("calc.descWestern") ||
                          "Pythagorean Vibrational & Personality Portrait"}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={calculateNumerology} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a880] font-semibold">
                          {t("calc.nameLabel") || "Full Name"}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={
                            t("calc.placeholderName") ||
                            "Enter full birth name..."
                          }
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-transparent border border-zinc-800/80 rounded-lg px-4 py-3 text-white placeholder-zinc-400/85 focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-amber-500/30 font-medium transition-all"
                        />
                      </div>

                      {/* DOB Options Group */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a880] font-semibold">
                          {t("calc.dobLabel") || "Birth Date"}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="bg-transparent border border-zinc-800/80 rounded-lg px-1.5 py-3 text-white focus:outline-none focus:border-[#c5a880] transition-all text-sm font-mono cursor-pointer"
                          >
                            {daysArray.map((d) => (
                              <option
                                key={d}
                                value={d}
                                className="bg-[#111015]"
                              >
                                {d}
                              </option>
                            ))}
                          </select>

                          <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-transparent border border-zinc-800/80 rounded-lg px-1.5 py-3 text-white focus:outline-none focus:border-[#c5a880] transition-all text-sm font-mono cursor-pointer"
                          >
                            {monthsArray.map((m) => (
                              <option
                                key={m}
                                value={m}
                                className="bg-[#111015]"
                              >
                                {m}
                              </option>
                            ))}
                          </select>

                          <select
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="bg-transparent border border-zinc-800/80 rounded-lg px-1.5 py-3 text-white focus:outline-none focus:border-[#c5a880] transition-all text-sm font-mono cursor-pointer"
                          >
                            {yearsArray.map((y) => (
                              <option
                                key={y}
                                value={y}
                                className="bg-[#111015]"
                              >
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Year to calculate personal year */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#c5a880] font-semibold">
                          {t("calc.calcYearLabel") ||
                            "Target Personal Year Mapping"}
                        </label>
                        <select
                          value={calcYear}
                          onChange={(e) => setCalcYear(e.target.value)}
                          className="w-full bg-transparent border border-zinc-800/80 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#c5a880] transition-all text-sm font-mono cursor-pointer"
                        >
                          {calcYearsArray.map((cy) => (
                            <option
                              key={cy}
                              value={cy}
                              className="bg-[#111015]"
                            >
                              {language === "hi"
                                ? `वर्ष: ${cy}`
                                : language === "bn"
                                  ? `বছর: ${cy}`
                                  : language === "mr"
                                    ? `वर्ष: ${cy}`
                                    : language === "gu"
                                      ? `વર્ષ: ${cy}`
                                      : `Year: ${cy}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Submit CTA */}
                      <div className="flex items-end">
                        <button
                          type="submit"
                          disabled={isCalculating}
                          className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-bold font-serif tracking-widest uppercase rounded-lg shadow-[0_0_20px_rgba(197,168,128,0.35)] hover:shadow-[0_0_30px_rgba(197,168,128,0.55)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/20 disabled:opacity-55"
                        >
                          <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                          {isCalculating
                            ? t("calc.calculating") || "ALIGNING AXIS..."
                            : t("calc.computeBtnWestern") || "Align Vibrations"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Right Column: Cosmic Identity Auth & Destiny Profiles (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* 1. COSMIC SECURE AUTHENTICATION CARD */}
                  <div className="bg-[#111015]/85 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-lg shadow-xl relative overflow-hidden transition-all hover:border-amber-500/25">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping absolute" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 relative" />
                      <span className="font-mono text-[10px] tracking-widest uppercase text-amber-400 font-bold">
                        {language === "hi"
                          ? "कॉस्मिक पहचान अर्जन"
                          : language === "bn"
                            ? "মহাজাগতিক পরিচয় অর্জন"
                            : language === "mr"
                              ? "कॉस्मिक ओळख प्राप्ती"
                              : language === "gu"
                                ? "કાર્મિક ઓળખ પ્રાપ્તિ"
                                : "COSMIC IDENTITY ACCRUAL"}
                      </span>
                    </div>

                    {activeEmail ? (
                      // Authenticated View
                      <div className="space-y-4 animate-fade-in text-left">
                        <div className="flex items-center gap-3 bg-[#09080c]/70 p-3 rounded-xl border border-zinc-800">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-mono uppercase text-[#c5a880] block leading-none">
                              {language === "hi"
                                ? "सक्रिय साधक"
                                : language === "bn"
                                  ? "সক্রিয় সাধক"
                                  : language === "mr"
                                    ? "सक्रिय साधक"
                                    : language === "gu"
                                      ? "સક્રિય સાધક"
                                      : "Active Practitioner"}
                            </span>
                            <span className="text-xs font-mono font-medium text-white truncate block mt-0.5">
                              {activeEmail}
                            </span>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg bg-zinc-800/20 hover:bg-rose-500/10 hover:text-rose-400 text-zinc-400 transition-colors border border-transparent hover:border-rose-500/20"
                            title={
                              language === "hi"
                                ? "सत्र समाप्त करें"
                                : language === "bn"
                                  ? "সেশন मुछून"
                                  : language === "mr"
                                    ? "सत्र बंद करा"
                                    : language === "gu"
                                      ? "સેસન સમાપ્ત કરો"
                                      : "Annihilate Session"
                            }
                          >
                            <LogOut className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-400 uppercase leading-normal tracking-wide">
                          {language === "hi"
                            ? "सुरक्षित हस्ताक्षर के तहत भाग्य लॉग समक्रमित किए जा रहे हैं।"
                            : language === "bn"
                              ? "সুরক্ষিত স্বাক্ষরের অধীনে ভাগ্য লগ সিঙ্ক করা হচ্ছে।"
                              : language === "mr"
                                ? "सुरक्षित स्वाक्षरीसह भाग्य नोंदी समक्रमित केल्या जात आहेत।"
                                : language === "gu"
                                  ? "સુરક્ષિત હસ્તાક્ષર હેઠળ ભાગ્ય લોગ જોઈન્ટ થઈ રહ્યા છે."
                                  : "Synchronizing destiny logs under secure signature. Calculated entries are saved exclusively to your cosmic vault."}
                        </p>
                      </div>
                    ) : (
                      // Login Form Panel
                      <form
                        onSubmit={handleLogin}
                        className="space-y-3.5 text-left"
                      >
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                          {language === "hi"
                            ? "भाग्य रजिस्टरों तक पहुँचें या अपने व्यक्तिगत ईमेल आईडी के तहत गणना सहेजें।"
                            : language === "bn"
                              ? "ভাগ্য রেজিস্টার অ্যাক্সেস করুন বা আপনার ব্যক্তিগত ইমেল আইডি দিয়ে গণনা সংরক্ষণ করুন।"
                              : language === "mr"
                                ? "भाग्य नोंदवहीमध्ये प्रवेश करा किंवा आपल्या वैयक्तिक ईमेल आयडी अंतर्गत गणना जतन करा।"
                                : language === "gu"
                                  ? "ભાગ્ય રજીસ્ટર મેળવો અથવા તમારા પર્સનલ ઇમેઇલ આઈડી હેઠળ ગણતરીઓ સાચવો."
                                  : "Access destiny registers or save calculations under your personal email ID."}
                        </p>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                            <input
                              type="email"
                              required
                              value={emailInput}
                              onChange={(e) => setEmailInput(e.target.value)}
                              placeholder="spiritual.seeker@email.com"
                              className="w-full bg-[#09080c]/90 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-amber-450 transition-all font-mono"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isLoggingIn}
                            className="px-4 bg-[#c5a880] hover:bg-amber-100 text-slate-950 font-bold font-mono text-xs uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-1 min-w-[90px] disabled:opacity-50 cursor-pointer"
                          >
                            {isLoggingIn ? (
                              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            ) : language === "hi" ? (
                              "प्रवेश"
                            ) : language === "bn" ? (
                              "প্রবেশ"
                            ) : language === "mr" ? (
                              "प्रवेश"
                            ) : language === "gu" ? (
                              "પ્રવેશો"
                            ) : (
                              "ACCESS"
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* 2. SAVED CHARTS / DESTINY ARCHIVE */}
                  <div className="bg-[#111015]/85 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-lg shadow-xl relative overflow-hidden transition-all hover:border-amber-500/25 flex-1 flex flex-col">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <Swastika size={140} className="text-amber-500" />
                    </div>

                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-amber-400" />
                        <span className="font-mono text-[10px] tracking-widest uppercase text-amber-300 font-bold">
                          {t("calc.savedProfilesHeader") ||
                            "SAVED DESTINY CHARTS"}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-[#c5a880]/10 border border-[#c5a880]/20 rounded-full text-[9px] font-mono text-amber-300 uppercase">
                        {
                          savedProfiles.filter((p) =>
                            activeEmail
                              ? p.email === activeEmail
                              : p.email === "guest",
                          ).length
                        }{" "}
                        {language === "hi"
                          ? "चार्ट्स"
                          : language === "bn"
                            ? "চার্ট"
                            : language === "mr"
                              ? "चार्ट"
                              : language === "gu"
                                ? "ચાર્ટ"
                                : "Charts"}
                      </span>
                    </div>

                    {/* Profiles list mapping */}
                    <div className="space-y-3 max-h-[310px] overflow-y-auto pr-1 flex-1 custom-scrollbar">
                      {savedProfiles.filter((p) =>
                        activeEmail
                          ? p.email === activeEmail
                          : p.email === "guest",
                      ).length === 0 ? (
                        // Empty state
                        <div className="py-12 text-center text-zinc-500 border border-dashed border-zinc-800/60 rounded-xl space-y-4 px-4 bg-[#09080c]/20">
                          <Bookmark className="w-8 h-8 mx-auto text-zinc-700 stroke-[1.5] animate-pulse" />
                          <div className="space-y-1">
                            <p className="font-serif text-xs font-bold text-zinc-400 uppercase tracking-wider">
                              {language === "hi"
                                ? "कोई मूलरूप संरक्षित नहीं है"
                                : language === "bn"
                                  ? "কোন আর্কেটাইপ সংরক্ষিত নেই"
                                  : language === "mr"
                                    ? "कोणतेही रूप जतन केलेले नाही"
                                    : language === "gu"
                                      ? "કોઈ આર્કિટાઈપ સાચવેલ નથી"
                                      : "No Archetypes Preserved"}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500 uppercase leading-normal">
                              {t("calc.noSavedProfiles") ||
                                "Verify coordinates, calculate results, and save them below."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        // Listed profiles
                        savedProfiles
                          .filter((p) =>
                            activeEmail
                              ? p.email === activeEmail
                              : p.email === "guest",
                          )
                          .map((prof) => (
                            <div
                              key={prof.id}
                              onClick={() => loadProfile(prof)}
                              className="group flex items-center justify-between gap-3 p-3 bg-[#09080c]/60 hover:bg-[#1b1921] border border-zinc-800/80 hover:border-amber-500/30 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                            >
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <Bookmark className="w-3 h-3 text-amber-400/80 group-hover:scale-110 transition-transform" />
                                  <span className="text-xs font-serif font-bold text-white tracking-wide truncate uppercase block group-hover:text-amber-300 transition-colors">
                                    {prof.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 uppercase">
                                  <span>
                                    DOB: {prof.day}/{prof.month}/{prof.year}
                                  </span>
                                  <span>•</span>
                                  <span className="text-amber-200/50">
                                    {prof.savedAt}
                                  </span>
                                </div>

                                {/* Interactive numbers quick indicator badge */}
                                <div className="flex gap-1 pt-1.5">
                                  <span
                                    className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                    title="Life Path"
                                  >
                                    LP: {prof.results.lifePath}
                                  </span>
                                  <span
                                    className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#c084fc]/10 text-purple-300 border border-[#c084fc]/20"
                                    title="Destiny"
                                  >
                                    DN: {prof.results.destiny}
                                  </span>
                                  <span
                                    className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
                                    title="Personal Year"
                                  >
                                    PY: {prof.results.personalYear}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProfile(prof.id);
                                }}
                                className="p-2 rounded-lg text-zinc-500 hover:text-rose-450 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/25"
                                title="Purge Coordinates"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RESULTS FIELD */}
              {hasCalculated && results && (
                <div className="mt-16 space-y-12">
                  {/* Burst Header */}
                  <div className="text-center animate-fade-in relative flex flex-col items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center -z-10 blur-xl">
                      <div className="w-48 h-12 bg-amber-500/10 rounded-full animate-pulse" />
                    </div>
                    <Swastika size={60} className="mb-4 text-amber-400" />
                    <h3 className="text-2xl md:text-3xl font-serif text-amber-300 tracking-widest uppercase font-bold">
                      🔮 YOUR EVOLUTIONARY COORDINATES 🔮
                    </h3>
                    <p className="text-xs font-mono text-zinc-400 mt-2">
                      Click medallions to flip and reveal cosmic attributes.
                    </p>
                  </div>

                  {/* Inline save-card with destination anchor for smooth scroll load */}
                  <div
                    id="results_destination"
                    className="scroll-mt-24 max-w-2xl mx-auto w-full bg-gradient-to-r from-[#191622] via-[#100e16] to-[#14111c] border border-amber-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-lg"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Bookmark className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-serif font-black tracking-widest text-[#c5a880] uppercase">
                          PRESERVE DESTINY MAP
                        </h4>
                        <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                          Save to{" "}
                          {activeEmail
                            ? `Account Vault (${activeEmail})`
                            : "Local Browser Guest Cache"}
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSaveProfile}
                      className="flex gap-2 w-full md:w-auto"
                    >
                      <input
                        type="text"
                        placeholder="Set custom name (e.g. My Soul Map)"
                        value={customProfileName}
                        onChange={(e) => setCustomProfileName(e.target.value)}
                        className="bg-[#09080c]/80 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30 w-full md:w-48 placeholder-zinc-650 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
                      >
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        PERSIST
                      </button>
                    </form>
                  </div>

                  {showSaveSuccess && (
                    <div className="max-w-xl mx-auto py-3 px-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-xs rounded-xl flex items-center justify-center gap-2 animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                      <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span>
                        COSMIC ARCHIVE REGISTERED AND ALIGNED SUCCESSFULLY!
                      </span>
                    </div>
                  )}

                  {/* Medallions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* LIFE PATH */}
                    <div className="perspective-1000 w-full h-[256px]">
                      <div
                        onClick={() => toggleFlip("lifePath")}
                        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                          flippedCards["lifePath"] ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-[#1b1921] to-[#111015] border border-amber-500/30 rounded-xl p-5 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(197,168,128,0.1)] hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(197,168,128,0.22)] transition-all">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                            Life Path Vibration
                          </span>

                          {/* Glowing Medallion Sphere */}
                          <div
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-655 to-[#111015] p-[2px] shadow-[0_0_25px_rgba(197,168,128,0.4)] flex items-center justify-center animate-float"
                            style={{ animationDelay: "0s" }}
                          >
                            <div className="w-full h-full bg-[#111015] rounded-full flex items-center justify-center">
                              <span className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-amber-300">
                                {displayVals.lifePath}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <h4 className="text-sm font-serif font-bold text-white tracking-widest uppercase">
                              {numberMeanings[String(results.lifePath)]
                                ?.title || "Evaluating..."}
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-400 mt-1">
                              Core soul blueprint
                            </p>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#16151b] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-[0_0_25px_rgba(197,168,128,0.15)]">
                          <div className="space-y-3">
                            <div className="flex border-b border-zinc-800 pb-2 items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Details - LP
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#c5a880] font-bold">
                                Element:{" "}
                                {
                                  numberMeanings[String(results.lifePath)]
                                    ?.element
                                }
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-4 italic">
                              "
                              {
                                numberMeanings[String(results.lifePath)]
                                  ?.essence
                              }
                              "
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDetailModal(results.lifePath);
                              }}
                              className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-xs font-mono text-amber-200 hover:text-white rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                              {language === "hi"
                                ? "आर्कटाइप"
                                : language === "bn"
                                  ? "আর্কটাইপ"
                                  : language === "mr"
                                    ? "आर्कटाइप"
                                    : language === "gu"
                                      ? "આર્કટાઈપ"
                                      : "Archetype"}
                            </button>

                            {activeReadingId === "lifePath" &&
                            speechState === "playing" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  stopSpeaking();
                                }}
                                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-mono text-rose-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Square className="w-3.5 h-3.5 fill-rose-500/10" />
                                {language === "hi"
                                  ? "बंद"
                                  : language === "bn"
                                    ? "থামুন"
                                    : language === "mr"
                                      ? "थांबवा"
                                      : language === "gu"
                                        ? "બંધ"
                                        : "Stop"}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeakWestern(
                                    getCoordinateLabel("lifePath"),
                                    results.lifePath,
                                    "lifePath",
                                  );
                                }}
                                className="px-4 py-2 bg-[#1a1724] hover:bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                {language === "hi"
                                  ? "सुनें"
                                  : language === "bn"
                                    ? "শুনুন"
                                    : language === "mr"
                                      ? "ऐका"
                                      : language === "gu"
                                        ? "સાંભળો"
                                        : "Listen"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DESTINY / EXPRESSION */}
                    <div className="perspective-1000 w-full h-[256px]">
                      <div
                        onClick={() => toggleFlip("destiny")}
                        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                          flippedCards["destiny"] ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-[#1b1921] to-[#111015] border border-amber-500/30 rounded-xl p-5 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(197,168,128,0.1)] hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(197,168,128,0.22)] transition-all">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                            Destiny Expression
                          </span>

                          {/* Glowing Medallion Sphere */}
                          <div
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-655 to-[#111015] p-[2px] shadow-[0_0_25px_rgba(197,168,128,0.4)] flex items-center justify-center animate-float font-bold"
                            style={{ animationDelay: "0.2s" }}
                          >
                            <div className="w-full h-full bg-[#111015] rounded-full flex items-center justify-center">
                              <span className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-101 to-amber-300">
                                {displayVals.destiny}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <h4 className="text-sm font-serif font-bold text-white tracking-widest uppercase">
                              {numberMeanings[String(results.destiny)]?.title ||
                                "Evaluating..."}
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-400 mt-1">
                              Innate talents & execution
                            </p>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#16151b] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-[0_0_25px_rgba(197,168,128,0.15)]">
                          <div className="space-y-3">
                            <div className="flex border-b border-zinc-800 pb-2 items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Details - Destiny
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#c5a880] font-bold">
                                Element:{" "}
                                {
                                  numberMeanings[String(results.destiny)]
                                    ?.element
                                }
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-4 italic">
                              "
                              {numberMeanings[String(results.destiny)]?.essence}
                              "
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDetailModal(results.destiny);
                              }}
                              className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-xs font-mono text-amber-200 hover:text-white rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                              {language === "hi"
                                ? "आर्कटाइप"
                                : language === "bn"
                                  ? "আর্কটাইপ"
                                  : language === "mr"
                                    ? "आर्कटाइप"
                                    : language === "gu"
                                      ? "આર્કટાઈપ"
                                      : "Archetype"}
                            </button>

                            {activeReadingId === "destiny" &&
                            speechState === "playing" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  stopSpeaking();
                                }}
                                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-mono text-rose-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Square className="w-3.5 h-3.5 fill-rose-500/10" />
                                {language === "hi"
                                  ? "बंद"
                                  : language === "bn"
                                    ? "থামুন"
                                    : language === "mr"
                                      ? "थांबवा"
                                      : language === "gu"
                                        ? "    "
                                        : "Stop"}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeakWestern(
                                    getCoordinateLabel("destiny"),
                                    results.destiny,
                                    "destiny",
                                  );
                                }}
                                className="px-4 py-2 bg-[#1a1724] hover:bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                {language === "hi"
                                  ? "सुनें"
                                  : language === "bn"
                                    ? "শুনুন"
                                    : language === "mr"
                                      ? "ऐका"
                                      : language === "gu"
                                        ? "સાંભળો"
                                        : "Listen"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SOUL URGE */}
                    <div className="perspective-1000 w-full h-[256px]">
                      <div
                        onClick={() => toggleFlip("soulUrge")}
                        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                          flippedCards["soulUrge"] ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-[#1b1921] to-[#111015] border border-amber-500/30 rounded-xl p-5 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(197,168,128,0.1)] hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(197,168,128,0.22)] transition-all">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                            Soul Urge Vibration
                          </span>

                          {/* Glowing Medallion Sphere */}
                          <div
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-655 to-[#111015] p-[2px] shadow-[0_0_25px_rgba(197,168,128,0.4)] flex items-center justify-center animate-float font-bold"
                            style={{ animationDelay: "0.4s" }}
                          >
                            <div className="w-full h-full bg-[#111015] rounded-full flex items-center justify-center">
                              <span className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-101 to-amber-300">
                                {displayVals.soulUrge}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <h4 className="text-sm font-serif font-bold text-white tracking-widest uppercase">
                              {numberMeanings[String(results.soulUrge)]
                                ?.title || "Evaluating..."}
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-400 mt-1">
                              Innermost driving desires
                            </p>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#16151b] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-[0_0_25px_rgba(197,168,128,0.15)]">
                          <div className="space-y-3">
                            <div className="flex border-b border-zinc-800 pb-2 items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Details - Soul Urge
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#c5a880] font-bold">
                                Element:{" "}
                                {
                                  numberMeanings[String(results.soulUrge)]
                                    ?.element
                                }
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-4 italic">
                              "
                              {
                                numberMeanings[String(results.soulUrge)]
                                  ?.essence
                              }
                              "
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDetailModal(results.soulUrge);
                              }}
                              className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-xs font-mono text-amber-200 hover:text-white rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                              {language === "hi"
                                ? "आर्कटाइप"
                                : language === "bn"
                                  ? "আর্কটাইপ"
                                  : language === "mr"
                                    ? "आर्कटाइप"
                                    : language === "gu"
                                      ? "આર્કટાઈપ"
                                      : "Archetype"}
                            </button>

                            {activeReadingId === "soulUrge" &&
                            speechState === "playing" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  stopSpeaking();
                                }}
                                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-mono text-rose-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Square className="w-3.5 h-3.5 fill-rose-500/10" />
                                {language === "hi"
                                  ? "बंद"
                                  : language === "bn"
                                    ? "থামুন"
                                    : language === "mr"
                                      ? "थांबवा"
                                      : language === "gu"
                                        ? "બંધ"
                                        : "Stop"}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeakWestern(
                                    getCoordinateLabel("soulUrge"),
                                    results.soulUrge,
                                    "soulUrge",
                                  );
                                }}
                                className="px-4 py-2 bg-[#1a1724] hover:bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                {language === "hi"
                                  ? "सुनें"
                                  : language === "bn"
                                    ? "শুনুন"
                                    : language === "mr"
                                      ? "ऐका"
                                      : language === "gu"
                                        ? "સાંભળો"
                                        : "Listen"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PERSONALITY */}
                    <div className="perspective-1000 w-full h-[256px]">
                      <div
                        onClick={() => toggleFlip("personality")}
                        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                          flippedCards["personality"] ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-[#1b1921] to-[#111015] border border-amber-500/30 rounded-xl p-5 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(197,168,128,0.1)] hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(197,168,128,0.22)] transition-all">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                            Outer Personality
                          </span>

                          {/* Glowing Medallion Sphere */}
                          <div
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-655 to-[#111015] p-[2px] shadow-[0_0_25px_rgba(197,168,128,0.4)] flex items-center justify-center animate-float font-bold"
                            style={{ animationDelay: "0.6s" }}
                          >
                            <div className="w-full h-full bg-[#111015] rounded-full flex items-center justify-center">
                              <span className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-101 to-amber-300">
                                {displayVals.personality}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <h4 className="text-sm font-serif font-bold text-white tracking-widest uppercase">
                              {numberMeanings[String(results.personality)]
                                ?.title || "Evaluating..."}
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-400 mt-1">
                              Social shield & persona
                            </p>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#16151b] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-[0_0_25px_rgba(197,168,128,0.15)]">
                          <div className="space-y-3">
                            <div className="flex border-b border-zinc-800 pb-2 items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Details - Personality
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#c5a880] font-bold">
                                Element:{" "}
                                {
                                  numberMeanings[String(results.personality)]
                                    ?.element
                                }
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-4 italic">
                              "
                              {
                                numberMeanings[String(results.personality)]
                                  ?.essence
                              }
                              "
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDetailModal(results.personality);
                              }}
                              className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-xs font-mono text-amber-200 hover:text-white rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                              {language === "hi"
                                ? "आर्कटाइप"
                                : language === "bn"
                                  ? "আর্কটাইপ"
                                  : language === "mr"
                                    ? "आर्कटाइप"
                                    : language === "gu"
                                      ? "આર્કટાઈપ"
                                      : "Archetype"}
                            </button>

                            {activeReadingId === "personality" &&
                            speechState === "playing" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  stopSpeaking();
                                }}
                                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-mono text-rose-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Square className="w-3.5 h-3.5 fill-rose-500/10" />
                                {language === "hi"
                                  ? "बंद"
                                  : language === "bn"
                                    ? "থামুন"
                                    : language === "mr"
                                      ? "थांबवा"
                                      : language === "gu"
                                        ? "    "
                                        : "Stop"}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeakWestern(
                                    getCoordinateLabel("personality"),
                                    results.personality,
                                    "personality",
                                  );
                                }}
                                className="px-4 py-2 bg-[#1a1724] hover:bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                {language === "hi"
                                  ? "सुनें"
                                  : language === "bn"
                                    ? "শুনুন"
                                    : language === "mr"
                                      ? "ऐका"
                                      : language === "gu"
                                        ? "સાંભળો"
                                        : "Listen"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BIRTHDAY */}
                    <div className="perspective-1000 w-full h-[256px]">
                      <div
                        onClick={() => toggleFlip("birthday")}
                        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                          flippedCards["birthday"] ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-[#1b1921] to-[#111015] border border-amber-500/30 rounded-xl p-5 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(197,168,128,0.1)] hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(197,168,128,0.22)] transition-all">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                            Birthday Energy
                          </span>

                          {/* Glowing Medallion Sphere */}
                          <div
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-655 to-[#111015] p-[2px] shadow-[0_0_25px_rgba(197,168,128,0.4)] flex items-center justify-center animate-float font-bold"
                            style={{ animationDelay: "0.8s" }}
                          >
                            <div className="w-full h-full bg-[#111015] rounded-full flex items-center justify-center">
                              <span className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-101 to-amber-300">
                                {displayVals.birthday}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <h4 className="text-sm font-serif font-bold text-white tracking-widest uppercase">
                              {numberMeanings[String(results.birthday)]
                                ?.title || "Evaluating..."}
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-400 mt-1">
                              Inherent sub-talents
                            </p>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#16151b] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-[0_0_25px_rgba(197,168,128,0.15)]">
                          <div className="space-y-3">
                            <div className="flex border-b border-zinc-800 pb-2 items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Details - Birthday
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#c5a880] font-bold">
                                Element:{" "}
                                {
                                  numberMeanings[String(results.birthday)]
                                    ?.element
                                }
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-4 italic">
                              "
                              {
                                numberMeanings[String(results.birthday)]
                                  ?.essence
                              }
                              "
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDetailModal(results.birthday);
                              }}
                              className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-xs font-mono text-amber-200 hover:text-white rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                              {language === "hi"
                                ? "आर्कटाइप"
                                : language === "bn"
                                  ? "আর্কটাইপ"
                                  : language === "mr"
                                    ? "आर्कटाइप"
                                    : language === "gu"
                                      ? "આર્કટાઈપ"
                                      : "Archetype"}
                            </button>

                            {activeReadingId === "birthday" &&
                            speechState === "playing" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  stopSpeaking();
                                }}
                                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-mono text-rose-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Square className="w-3.5 h-3.5 fill-rose-500/10" />
                                {language === "hi"
                                  ? "बंद"
                                  : language === "bn"
                                    ? "থামুন"
                                    : language === "mr"
                                      ? "थांबवा"
                                      : language === "gu"
                                        ? "    "
                                        : "Stop"}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeakWestern(
                                    getCoordinateLabel("birthday"),
                                    results.birthday,
                                    "birthday",
                                  );
                                }}
                                className="px-4 py-2 bg-[#1a1724] hover:bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                                {language === "hi"
                                  ? "सुनें"
                                  : language === "bn"
                                    ? "শুনুন"
                                    : language === "mr"
                                      ? "ऐका"
                                      : language === "gu"
                                        ? "સાંભળો"
                                        : "Listen"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PERSONAL YEAR */}
                    <div className="perspective-1000 w-full h-[256px]">
                      <div
                        onClick={() => toggleFlip("personalYear")}
                        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
                          flippedCards["personalYear"] ? "rotate-y-180" : ""
                        }`}
                      >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-gradient-to-b from-[#1b1921] to-[#111015] border border-amber-500/30 rounded-xl p-5 flex flex-col items-center justify-between shadow-[0_0_20px_rgba(197,168,128,0.1)] hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(197,168,128,0.22)] transition-all">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                            Personal Year: {calcYear}
                          </span>

                          {/* Glowing Medallion Sphere */}
                          <div
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-amber-655 to-[#111015] p-[2px] shadow-[0_0_25px_rgba(197,168,128,0.4)] flex items-center justify-center animate-float font-bold"
                            style={{ animationDelay: "1.0s" }}
                          >
                            <div className="w-full h-full bg-[#111015] rounded-full flex items-center justify-center">
                              <span className="text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-101 to-[#d4af37]">
                                {displayVals.personalYear}
                              </span>
                            </div>
                          </div>

                          <div className="text-center">
                            <h4 className="text-sm font-serif font-bold text-white tracking-widest uppercase">
                              {numberMeanings[String(results.personalYear)]
                                ?.title || "Evaluating..."}
                            </h4>
                            <p className="text-[11px] font-mono text-zinc-400 mt-1">
                              Current temporal path cycle
                            </p>
                          </div>
                        </div>

                        {/* Back Side */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#16151b] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between shadow-[0_0_25px_rgba(197,168,128,0.15)]">
                          <div className="space-y-3">
                            <div className="flex border-b border-zinc-800 pb-2 items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                                Details - temporal
                              </span>
                              <span className="text-[10px] font-mono uppercase text-[#c5a880] font-bold">
                                Element:{" "}
                                {
                                  numberMeanings[String(results.personalYear)]
                                    ?.element
                                }
                              </span>
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-4 italic">
                              "
                              {
                                numberMeanings[String(results.personalYear)]
                                  ?.essence
                              }
                              "
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showDetailModal(results.personalYear);
                              }}
                              className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-[#c5a880]/25 text-xs font-mono text-amber-200 hover:text-white rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#c5a880]" />
                              {language === "hi"
                                ? "आर्कटाइप"
                                : language === "bn"
                                  ? "আর্কটাইপ"
                                  : language === "mr"
                                    ? "आর্কटाइप"
                                    : language === "gu"
                                      ? "આર્કટાઈપ"
                                      : "Archetype"}
                            </button>

                            {activeReadingId === "personalYear" &&
                            speechState === "playing" ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  stopSpeaking();
                                }}
                                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-xs font-mono text-rose-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Square className="w-3.5 h-3.5 fill-rose-500/10" />
                                {language === "hi"
                                  ? "बंद"
                                  : language === "bn"
                                    ? "থামুন"
                                    : language === "mr"
                                      ? "थांबवा"
                                      : language === "gu"
                                        ? "    "
                                        : "Stop"}
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSpeakWestern(
                                    getCoordinateLabel("personalYear"),
                                    results.personalYear,
                                    "personalYear",
                                  );
                                }}
                                className="px-4 py-2 bg-[#1a1724] hover:bg-amber-500/10 border border-[#c5a880]/20 text-xs font-mono text-amber-300 rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-[#c5a880]" />
                                {language === "hi"
                                  ? "सुनें"
                                  : language === "bn"
                                    ? "শুনুন"
                                    : language === "mr"
                                      ? "ऐका"
                                      : language === "gu"
                                        ? "સાંભળો"
                                        : "Listen"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="vedic"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
              className="space-y-12 animate-fade-in w-full text-left"
            >
              {/* Vedic Input Area */}
              <div className="w-full max-w-2xl mx-auto bg-transparent border border-emerald-500/20 rounded-2xl p-6 md:p-8 relative transition-all duration-300 hover:border-emerald-550/30">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Orbit className="w-24 h-24 text-emerald-400" />
                </div>

                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-6">
                  <Compass
                    className="w-5 h-5 text-emerald-400 animate-spin"
                    style={{ animationDuration: "30s" }}
                  />
                  <div>
                    <h3 className="font-serif text-lg text-white uppercase tracking-wider font-bold">
                      {t("calc.titleVedic") || "VEDIC MULANK ENGINE"}
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400 uppercase mt-0.5">
                      {t("calc.descVedic") ||
                        "Vedic Root Frequency & Destiny Indicators"}
                    </p>
                  </div>
                </div>

                <form onSubmit={startVedicCalculation} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                      {t("calc.dobLabel") || "Birth Date"} (Vedic)
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-300 font-medium mb-1">
                          {language === "hi"
                            ? "दिन"
                            : language === "bn"
                              ? "দিন"
                              : language === "mr"
                                ? "दिवस"
                                : language === "gu"
                                  ? "દિવસ"
                                  : "DAY"}
                        </span>
                        <select
                          value={vedicDay}
                          onChange={(e) => setVedicDay(e.target.value)}
                          className="w-full bg-transparent border border-zinc-800 rounded-lg px-2.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm font-mono cursor-pointer"
                        >
                          {Array.from({ length: 31 }, (_, i) =>
                            String(i + 1).padStart(2, "0"),
                          ).map((d) => (
                            <option key={d} value={d} className="bg-zinc-950">
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-300 font-medium mb-1">
                          {language === "hi"
                            ? "महीना"
                            : language === "bn"
                              ? "মাস"
                              : language === "mr"
                                ? "महिना"
                                : language === "gu"
                                  ? "મહિનો"
                                  : "MONTH"}
                        </span>
                        <select
                          value={vedicMonth}
                          onChange={(e) => setVedicMonth(e.target.value)}
                          className="w-full bg-transparent border border-zinc-800 rounded-lg px-2.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm font-mono cursor-pointer"
                        >
                          {Array.from({ length: 12 }, (_, i) =>
                            String(i + 1).padStart(2, "0"),
                          ).map((m) => (
                            <option key={m} value={m} className="bg-zinc-950">
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="block text-[9px] font-mono text-zinc-300 font-medium mb-1">
                          {language === "hi"
                            ? "वर्ष"
                            : language === "bn"
                              ? "বছর"
                              : language === "mr"
                                ? "वर्ष"
                                : language === "gu"
                                  ? "વર્ષ"
                                  : "YEAR"}
                        </span>
                        <select
                          value={vedicYear}
                          onChange={(e) => setVedicYear(e.target.value)}
                          className="w-full bg-transparent border border-zinc-800 rounded-lg px-2.5 py-3 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm font-mono cursor-pointer"
                        >
                          {Array.from({ length: 120 }, (_, i) =>
                            String(2026 - i),
                          ).map((y) => (
                            <option key={y} value={y} className="bg-zinc-950">
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isVedicCalculating}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600/20 to-teal-650/15 hover:from-emerald-600/30 hover:to-teal-650/25 border border-emerald-500/35 text-emerald-300 hover:text-white font-mono text-xs tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.12)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVedicCalculating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                        {t("calc.reducingVedic") || "VIBRATING MATRIX..."}
                      </>
                    ) : (
                      <>
                        <Orbit
                          className="w-4 h-4 text-emerald-500 animate-spin"
                          style={{ animationDuration: "6s" }}
                        />
                        {t("calc.computeBtnVedic") ||
                          "COMPUTE VEDIC FREQUENCIES"}
                      </>
                    )}
                  </button>
                </form>

                {/* Reduction Steps Animation */}
                {vedicSteps.length > 0 && (
                  <div className="mt-8 space-y-3 pt-6 border-t border-zinc-900">
                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
                      {language === "hi"
                        ? "अंक सरलीकरण पथ"
                        : language === "bn"
                          ? "ডিজিট হ্রাসের পথ"
                          : language === "mr"
                            ? "अंक कपात मार्ग"
                            : language === "gu"
                              ? "અંક ઘટાડા માર્ગ"
                              : "Digit Reduction Pathway"}
                    </h4>
                    <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
                      {vedicSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/70 border border-emerald-500/10 text-emerald-300 font-mono text-xs rounded-lg shadow-inner animate-fade-in"
                        >
                          <span className="text-zinc-500">STAGE {idx + 1}</span>
                          <span className="font-bold text-center flex-1">
                            {step}
                          </span>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vedic Results Display Area */}
              {hasVedicCalculated &&
                mulankVal !== null &&
                bhagyankVal !== null && (
                  <div
                    id="vedic_results_anchor"
                    className="scroll-mt-24 space-y-12 pt-8"
                  >
                    {/* Results Header */}
                    <div className="text-center relative flex flex-col items-center">
                      <div className="absolute inset-x-0 w-64 h-8 bg-emerald-500/5 rounded-full blur-xl mx-auto -z-10" />
                      <h3 className="text-2xl md:text-3xl font-serif text-emerald-300 tracking-widest uppercase font-bold">
                        🔮 VEDIC DUAL FREQUENCIES 🔮
                      </h3>
                      <p className="text-xs font-mono text-zinc-400 mt-2 max-w-md mx-auto">
                        Your cosmic signature comprising the inner spark
                        (Mulank) and exterior journey path (Bhagyank).
                      </p>
                    </div>

                    {/* Core Badges Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                      {/* 1. Mulank Badge Card (Mandala Orbit style) */}
                      <div className="bg-[#111015]/90 border border-emerald-500/20 rounded-2xl p-6.5 flex flex-col items-center justify-center relative overflow-hidden shadow-lg hover:border-emerald-500/35 transition-all text-center">
                        <div className="absolute inset-0 bg-radial-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

                        <h4 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-6 font-bold">
                          MULANK (ROOT NUMBER)
                        </h4>

                        {/* Mandala Wrapper */}
                        <div className="relative w-44 h-44 rounded-full border border-dashed border-emerald-500/30 flex items-center justify-center bg-zinc-950/40 shadow-[0_0_35px_rgba(16,185,129,0.08)]">
                          {/* Rotating orbit */}
                          <div
                            className="absolute inset-0 animate-spin"
                            style={{ animationDuration: "12s" }}
                          >
                            <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-zinc-950 border border-emerald-400 flex items-center justify-center text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)] select-none">
                              <div
                                className="animate-spin"
                                style={{
                                  animationType: "reverse",
                                  animationDirection: "reverse",
                                  animationDuration: "12s",
                                }}
                              >
                                <span className="text-base font-serif font-black">
                                  {mulankProfiles[mulankVal].glyph}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Central text */}
                          <div className="text-center z-10">
                            <span className="text-6xl font-serif font-black text-white">
                              {mulankVal}
                            </span>
                            <span className="block text-[8px] font-mono text-zinc-400 mt-1 uppercase">
                              REDUCED ROOT
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 text-center flex flex-col items-center">
                          <span className="text-sm font-serif font-semibold text-white block">
                            Ruled by {mulankProfiles[mulankVal].planet} (
                            {mulankProfiles[mulankVal].sanskritName})
                          </span>
                          <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider max-w-xs leading-relaxed">
                            Represents your core psychological structure,
                            temperament, and soul's inner nature.
                          </p>

                          {/* Svara Audio Assistant Controller */}
                          <div className="mt-4 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              {activeReadingId === `mulank-${mulankVal}` &&
                              speechState === "playing" ? (
                                <div className="flex gap-1 items-center px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-mono">
                                  <span className="relative flex h-1.5 w-1.5 mr-0.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                  </span>
                                  <span>SVARA READING...</span>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-1">
                              {activeReadingId === `mulank-${mulankVal}` ? (
                                <>
                                  {speechState === "playing" ? (
                                    <button
                                      type="button"
                                      onClick={pauseSpeaking}
                                      className="w-8 h-8 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:text-white flex items-center justify-center hover:bg-emerald-500/20 transition-all shadow-md cursor-pointer"
                                      title="Pause Guidance"
                                    >
                                      <Pause className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={resumeSpeaking}
                                      className="w-8 h-8 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:text-white flex items-center justify-center hover:bg-emerald-500/20 transition-all shadow-md cursor-pointer"
                                      title="Resume Guidance"
                                    >
                                      <Play className="w-3.5 h-3.5 ml-0.5" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={stopSpeaking}
                                    className="w-8 h-8 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:text-white flex items-center justify-center hover:bg-rose-500/20 transition-all shadow-md cursor-pointer"
                                    title="Stop Svara"
                                  >
                                    <Square className="w-3.5 h-3.5 fill-rose-500/10" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSpeakMulank}
                                  className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-[#162a22]/30 text-emerald-300 hover:text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 hover:bg-emerald-500/15 transition-all shadow-sm cursor-pointer"
                                  title="Listen to Root Profile"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                                  LISTEN TO HEALING READ
                                </button>
                              )}
                            </div>

                            {/* SpeechSynthesis unavailability graceful fallback banner */}
                            {voiceErrorId === `mulank-${mulankVal}` && (
                              <span className="text-[8px] font-mono text-amber-450 mt-1 uppercase text-center block max-w-xxs px-2 leading-tight">
                                Voice synthesis not loaded in your browser for
                                this language fallback.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Bhagyank Badge Card */}
                      <div className="bg-[#111015]/90 border border-amber-500/20 rounded-2xl p-6.5 flex flex-col items-center justify-center relative overflow-hidden shadow-lg hover:border-amber-500/35 transition-all text-center">
                        <div className="absolute inset-0 bg-radial-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

                        <h4 className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-6 font-bold">
                          BHAGYANK (DESTINY NUMBER)
                        </h4>

                        {/* Visual Arc representation */}
                        <div
                          className="relative w-44 h-44 rounded-full border-4 border-[#1c1917]/80 flex items-center justify-center bg-zinc-950/40 shadow-[0_0_35px_rgba(245,158,11,0.06)]"
                          style={{ borderColor: "#d9770650" }}
                        >
                          <div className="absolute inset-2.5 rounded-full border border-dashed border-amber-500/20" />
                          <div className="text-center z-10">
                            <span className="text-6xl font-serif font-black text-white">
                              {bhagyankVal}
                            </span>
                            <span className="block text-[8px] font-mono text-zinc-450 mt-1 uppercase">
                              FULL DOB SUM
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 text-center flex flex-col items-center">
                          <span className="text-sm font-serif font-semibold text-white block">
                            Ruled by {mulankProfiles[bhagyankVal].planet} (
                            {mulankProfiles[bhagyankVal].sanskritName})
                          </span>
                          <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider max-w-xs leading-relaxed">
                            Represents your destiny, broader life path, career
                            gateways, and cumulative opportunities.
                          </p>

                          {/* Svara Audio Assistant Controller for Bhagyank */}
                          <div className="mt-4 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                              {activeReadingId === `bhagyank-${bhagyankVal}` &&
                              speechState === "playing" ? (
                                <div className="flex gap-1 items-center px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-450 font-mono animate-pulse">
                                  <span className="relative flex h-1.5 w-1.5 mr-0.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                  </span>
                                  <span>SVARA READING...</span>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex items-center justify-center gap-2 mt-1">
                              {activeReadingId === `bhagyank-${bhagyankVal}` ? (
                                <>
                                  {speechState === "playing" ? (
                                    <button
                                      type="button"
                                      onClick={pauseSpeaking}
                                      className="w-8 h-8 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-455 hover:text-white flex items-center justify-center hover:bg-amber-500/20 transition-all shadow-md cursor-pointer"
                                      title="Pause Guidance"
                                    >
                                      <Pause className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={resumeSpeaking}
                                      className="w-8 h-8 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:text-white flex items-center justify-center hover:bg-amber-500/20 transition-all shadow-md cursor-pointer"
                                      title="Resume Guidance"
                                    >
                                      <Play className="w-3.5 h-3.5 ml-0.5" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={stopSpeaking}
                                    className="w-8 h-8 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-450 hover:text-white flex items-center justify-center hover:bg-rose-500/20 transition-all shadow-md cursor-pointer"
                                    title="Stop Svara"
                                  >
                                    <Square className="w-3.5 h-3.5 fill-rose-550/10" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleSpeakBhagyank}
                                  className="px-4 py-1.5 rounded-full border border-amber-500/30 bg-[#2d2216]/30 text-amber-300 hover:text-white text-[10px] font-mono tracking-wider flex items-center gap-1.5 hover:bg-amber-500/15 transition-all shadow-sm cursor-pointer"
                                  title="Listen to Destiny Profile"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  LISTEN TO HEALING READ
                                </button>
                              )}
                            </div>

                            {/* SpeechSynthesis unavailability graceful fallback banner */}
                            {voiceErrorId === `bhagyank-${bhagyankVal}` && (
                              <span className="text-[8px] font-mono text-amber-450 mt-1 uppercase text-center block max-w-xxs px-2 leading-tight">
                                Voice synthesis not loaded in your browser for
                                this language fallback.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Traits Profiles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                      {/* Traits Card */}
                      <div className="bg-[#111015]/85 border border-zinc-800 rounded-2xl p-5.5 hover:border-emerald-500/20 transition-all flex flex-col">
                        <span className="text-xs font-mono tracking-widest uppercase text-emerald-450 font-bold border-b border-zinc-800 pb-2 mb-4 block">
                          🌌 CORE CHARACTERISTICS
                        </span>
                        <ul className="space-y-3 text-xs leading-relaxed text-zinc-300 flex-1">
                          {mulankProfiles[mulankVal].traits.map((tr, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-emerald-400 font-bold select-none">
                                ✦
                              </span>
                              <span>{tr}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Strengths Card */}
                      <div className="bg-[#111015]/85 border border-zinc-800 rounded-2xl p-5.5 hover:border-emerald-500/20 transition-all flex flex-col">
                        <span className="text-xs font-mono tracking-widest uppercase text-teal-400 font-bold border-b border-zinc-800 pb-2 mb-4 block">
                          🛡️ ANCHORED STRENGTHS
                        </span>
                        <ul className="space-y-3 text-xs leading-relaxed text-zinc-300 flex-1">
                          {mulankProfiles[mulankVal].strengths.map((st, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-teal-400 font-bold select-none">
                                ✔
                              </span>
                              <span>{st}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses Card */}
                      <div className="bg-[#111015]/85 border border-zinc-800 rounded-2xl p-5.5 hover:border-emerald-500/20 transition-all flex flex-col">
                        <span className="text-xs font-mono tracking-widest uppercase text-rose-450 font-bold border-b border-zinc-800 pb-2 mb-4 block">
                          ⚠️ VULNERABILITIES
                        </span>
                        <ul className="space-y-3 text-xs leading-relaxed text-zinc-300 flex-1">
                          {mulankProfiles[mulankVal].weaknesses.map((wk, i) => (
                            <li key={i} className="flex gap-2 items-start">
                              <span className="text-rose-450 font-bold select-none">
                                ✕
                              </span>
                              <span>{wk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Quick Swatches / Calendar Widget / Compatibility */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto font-mono">
                      {/* Swatches & Info Row (Column spans 5) */}
                      <div className="md:col-span-5 bg-[#111015]/85 border border-zinc-800 rounded-2xl p-5 space-y-5">
                        {/* Color Swatch */}
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                            Lucky Cosmic Shade
                          </span>
                          <div className="flex items-center gap-3.5">
                            <div
                              className="w-12 h-12 rounded-xl shadow-lg border border-white/10 relative overflow-hidden flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  mulankProfiles[mulankVal].luckyColorHex,
                                boxShadow: `0 0 20px ${mulankProfiles[mulankVal].luckyColorHex}40`,
                              }}
                            />
                            <div>
                              <span className="block text-xs font-mono font-bold text-white leading-tight">
                                {mulankProfiles[mulankVal].luckyColor}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">
                                {mulankProfiles[mulankVal].luckyColorHex}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Favorable Days Calendar Widget */}
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">
                            Favorable Day Alignment
                          </span>
                          <div className="grid grid-cols-7 gap-1 max-w-sm">
                            {[
                              "Sun",
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                            ].map((dayName, idx) => {
                              const daysFull = [
                                "Sunday",
                                "Monday",
                                "Tuesday",
                                "Wednesday",
                                "Thursday",
                                "Friday",
                                "Saturday",
                              ];
                              const activeDayName = daysFull[idx];
                              const isFavorable = mulankProfiles[
                                mulankVal
                              ].favorableDays
                                .toLowerCase()
                                .includes(activeDayName.toLowerCase());

                              return (
                                <div
                                  key={dayName}
                                  className={`
                                py-2 text-center text-[10px] font-mono rounded-lg border transition-all select-none
                                ${
                                  isFavorable
                                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-300 font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                                    : "border-zinc-850 bg-zinc-950 text-zinc-550"
                                }
                              `}
                                  title={
                                    isFavorable
                                      ? "Extremely Favorable Alignment"
                                      : "Ordinary Day"
                                  }
                                >
                                  {dayName}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-[9px] font-mono text-zinc-500 mt-2 uppercase">
                            High planetary waves manifest on{" "}
                            {mulankProfiles[mulankVal].favorableDays}s.
                          </p>
                        </div>
                      </div>

                      {/* Compatibility Strip (Column spans 7) */}
                      <div className="md:col-span-7 bg-[#111015]/85 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                            Vedic Compatibility Matrix
                          </span>
                          <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider mb-4">
                            Frequency Affinities vs Other Root Numbers
                          </h4>

                          <div className="grid grid-cols-9 gap-1.5 pt-1">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                              const isSelf = num === mulankVal;
                              const isFriendly =
                                mulankProfiles[mulankVal].luckyNumbers.includes(
                                  num,
                                );
                              const isChallenging =
                                mulankProfiles[
                                  mulankVal
                                ].challengingNumbers.includes(num);

                              let cellStyle = "";
                              let statusLabel = "";

                              if (isSelf) {
                                cellStyle =
                                  "border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]";
                                statusLabel = "SELF";
                              } else if (isFriendly) {
                                cellStyle =
                                  "border-teal-400 bg-teal-500/5 text-teal-300 shadow-[0_0_8px_rgba(45,212,191,0.15)]";
                                statusLabel = "FRIEND";
                              } else if (isChallenging) {
                                cellStyle =
                                  "border-rose-400/40 bg-rose-500/5 text-rose-350 shadow-[0_0_8px_rgba(244,63,94,0.1)]";
                                statusLabel = "CLASH";
                              } else {
                                cellStyle =
                                  "border-zinc-850 bg-zinc-950/50 text-zinc-550";
                                statusLabel = "NEUT";
                              }

                              return (
                                <div
                                  key={num}
                                  className={`flex flex-col items-center justify-center p-2 rounded-xl border ${cellStyle} select-none transition-all hover:scale-105`}
                                >
                                  <span className="text-base font-serif font-black">
                                    {num}
                                  </span>
                                  <span className="text-[7.5px] font-mono tracking-tighter mt-0.5 block">
                                    {statusLabel}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-zinc-850 text-xs text-left">
                          <div>
                            <span className="text-[9px] text-[#cbd5e1]/40 block uppercase">
                              Career Gateway Inclinations
                            </span>
                            <p className="text-zinc-300 font-sans mt-1 text-[11px] leading-relaxed">
                              {mulankProfiles[mulankVal].careerInclinations
                                .slice(0, 3)
                                .join(", ")}
                            </p>
                          </div>
                          <div>
                            <span className="text-[9px] text-[#cbd5e1]/40 block uppercase">
                              Vedic Health Focus Area
                            </span>
                            <p className="text-zinc-300 font-sans mt-1 text-[11px] leading-relaxed">
                              {mulankProfiles[mulankVal].healthFocus}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Prediction Trigger Card */}
                    <div className="max-w-xl mx-auto text-center space-y-6 pt-4">
                      <button
                        onClick={fetchVedicPrediction}
                        disabled={isFetchingPrediction}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white font-mono text-xs uppercase tracking-widest rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isFetchingPrediction ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            RETRIEVING TRANSITS...
                          </>
                        ) : (
                          <>
                            <Orbit className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            GET TODAY'S{" "}
                            {mulankProfiles[mulankVal].planet.toUpperCase()}{" "}
                            PREDICTION
                          </>
                        )}
                      </button>

                      {prediction && (
                        <div
                          id="vedic_prediction_anchor"
                          className="scroll-mt-32 max-w-xl mx-auto bg-gradient-to-br from-[#12161b] via-[#090b0e] to-[#0d1012] border border-emerald-500/30 rounded-2xl p-6 text-left relative overflow-hidden shadow-2xl animate-fade-in font-mono"
                        >
                          {/* Pulsing colored glow of the ruling planet */}
                          <div
                            className="absolute -right-24 -top-24 w-48 h-48 rounded-full blur-[70px] opacity-25 pointer-events-none transition-all duration-1000 animate-pulse"
                            style={{ backgroundColor: prediction.color }}
                          />

                          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-sm shadow-md"
                                style={{
                                  borderColor: `${prediction.color}40`,
                                  color: prediction.color,
                                  backgroundColor: `${prediction.color}10`,
                                }}
                              >
                                {prediction.glyph}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-serif font-black text-white uppercase tracking-widest leading-none">
                                    DAILY TRANSIT PREDICTION
                                  </h5>

                                  {activeReadingId ===
                                  `transit-${mulankVal}` ? (
                                    <button
                                      type="button"
                                      onClick={stopSpeaking}
                                      className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 hover:text-rose-300 border border-rose-500/30 cursor-pointer text-[8px] font-mono leading-none flex items-center justify-center gap-0.5"
                                      title="Stop Svara"
                                    >
                                      <Square className="w-2 h-2 fill-rose-500/20" />
                                      STOP
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={handleSpeakDailyPrediction}
                                      className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 cursor-pointer text-[8px] font-mono leading-none flex items-center justify-center gap-0.5 animate-pulse"
                                      title="Listen Speak Aloud"
                                    >
                                      <Volume2 className="w-2 h-2" />
                                      SPEAK
                                    </button>
                                  )}
                                </div>
                                <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-wider mt-1 block">
                                  RULER {prediction.rulingPlanet} (
                                  {prediction.sanskritName}) IN{" "}
                                  {prediction.transitSign}
                                </span>
                              </div>
                            </div>

                            <div className="text-right text-xs font-mono">
                              <span className="block text-[8px] text-zinc-500 uppercase leading-none mb-0.5">
                                Auspicious Index
                              </span>
                              <span
                                className="font-sans font-bold"
                                style={{ color: prediction.color }}
                              >
                                {prediction.impactScore}/100
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4 text-xs leading-relaxed text-zinc-300">
                            <p className="font-sans text-zinc-300">
                              {prediction.forecast}
                            </p>

                            <div className="bg-zinc-950/60 border border-zinc-850/60 rounded-xl p-3">
                              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">
                                Aligned Action Advice
                              </span>
                              <p className="text-xs font-sans text-emerald-300 font-semibold">
                                {prediction.actionAdvice}
                              </p>
                            </div>

                            <div className="flex gap-4 items-center justify-between pt-2.5 border-t border-zinc-850 text-[10px] font-mono text-zinc-500 uppercase leading-none">
                              <div>
                                <span>Sector Activated:</span>
                                <span className="text-white ml-2 font-sans font-bold">
                                  {prediction.activeLifeSector}
                                </span>
                              </div>
                              <div>
                                <span>Orbit Status:</span>
                                <span
                                  className={`ml-2 font-sans font-bold ${prediction.retrograde ? "text-amber-450" : "text-emerald-400"}`}
                                >
                                  {prediction.retrograde
                                    ? "RETROGRADE (☤)"
                                    : "DIRECT (➔)"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAIL DRAWER / MODAL WINDOW */}
      {selectedNumDetail && (
        <div className="fixed inset-0 bg-[#0a0118]/85 backdrop-blur-md z-[20000] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-[#150a2e] border border-purple-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-[0_0_55px_rgba(168,85,247,0.3)] my-8">
            {/* Header with color-accent banner */}
            <div
              className="px-6 py-8 relative flex flex-col justify-end min-h-[140px]"
              style={{
                background: `linear-gradient(135deg, ${selectedNumDetail.color}2A, #150a2e 90%)`,
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedNumDetail(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#0a0118]/60 hover:bg-[#0a0118]/90 text-purple-300 hover:text-white transition-all cursor-pointer border border-purple-500/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-4 items-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border-2 text-2xl font-serif font-black shadow-[0_0_20px_var(--glow)] text-white"
                  style={
                    {
                      borderColor: selectedNumDetail.color,
                      textShadow: `0 0 10px ${selectedNumDetail.color}`,
                      "--glow": `${selectedNumDetail.color}50`,
                    } as React.CSSProperties
                  }
                >
                  {selectedNumDetail.number}
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#fbbf24] uppercase">
                    Universal Frequency
                  </span>
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
                <span className="text-[10px] font-mono tracking-wider font-bold text-purple-300 uppercase">
                  Core Essence & Alignment
                </span>
                <p
                  className="text-purple-100/90 leading-relaxed font-sans text-sm italic border-l-2 p-3 bg-[#0a0118]/45"
                  style={{ borderColor: selectedNumDetail.color }}
                >
                  "{selectedNumDetail.essence}"
                </p>
              </div>

              {/* Strengths & Challenges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-3 bg-[#0a0118]/30 p-4 rounded-xl border border-purple-900/40">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#22c55e] font-bold block border-b border-purple-900/40 pb-1.5">
                    ✦ Dominant Strengths
                  </span>
                  <ul className="space-y-2">
                    {selectedNumDetail.strengths.map((str, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-purple-200/90 flex gap-2 items-start leading-tight"
                      >
                        <span className="text-[#22c55e] mt-0.5">✔</span>
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="space-y-3 bg-[#0a0118]/30 p-4 rounded-xl border border-purple-900/40">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold block border-b border-purple-900/40 pb-1.5">
                    ▲ Growth Challenges
                  </span>
                  <ul className="space-y-2">
                    {selectedNumDetail.challenges.map((ch, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-purple-200/90 flex gap-2 items-start leading-tight"
                      >
                        <span className="text-rose-400 mt-0.5">✦</span>
                        {ch}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Dynamic Careers & Alchemy Links */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-t border-purple-900/40 pt-4">
                  <div>
                    <span className="text-[10px] font-mono text-purple-300 uppercase font-bold block">
                      Cosmic Element
                    </span>
                    <span className="text-sm font-serif text-white tracking-wide">
                      {selectedNumDetail.element}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-purple-300 uppercase font-bold block">
                      Sacred Astral Symbol
                    </span>
                    <span className="text-sm font-serif text-white tracking-wide flex gap-1.5 items-center">
                      <span
                        className="text-lg"
                        style={{ color: selectedNumDetail.color }}
                      >
                        {selectedNumDetail.symbol}
                      </span>
                      {selectedNumDetail.symbol === "☉"
                        ? "Sun Mapping"
                        : selectedNumDetail.symbol === "☽"
                          ? "Lunar Reflection"
                          : "Geometric Force"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#0a0118]/55 p-4 rounded-xl border border-purple-950">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#fbbf24] font-bold block pb-1.5">
                    💼 Highly Aligned Career Channels
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedNumDetail.careers.map((car, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[#110826] border border-purple-500/20 text-xs font-sans text-purple-200"
                      >
                        {car}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="bg-[#110826] p-4 flex justify-end border-t border-purple-900/40">
              <button
                type="button"
                onClick={() => setSelectedNumDetail(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono uppercase rounded-lg tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.3)]"
              >
                Close Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
