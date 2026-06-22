import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { staticUI, localizedNumberMeanings, LocalizedUI } from "../data/translations";
import { NumberMeaning, Flashcard } from "../types";
import { numberMeanings, flashcards, zodiacNumberData } from "../data/numerologyData";
import { mulankProfiles } from "../data/vedicData";

type LanguageType = "en" | "hi" | "bn" | "mr" | "gu";
type PlaybackState = "idle" | "playing" | "paused";

interface LanguageContextProps {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (keyPath: string) => string;
  ui: LocalizedUI;
  
  // Voice Assistant Hooks
  speak: (text: string, readingId: string) => void;
  pauseSpeaking: () => void;
  resumeSpeaking: () => void;
  stopSpeaking: () => void;
  speechState: PlaybackState;
  activeReadingId: string | null;
  voiceErrorId: string | null;
  
  // Data Translation helpers
  getNumberMeaning: (num: string | number) => NumberMeaning;
  getMulankProfile: (mulankVal: number) => any;
  getZodiacList: () => any[];
  getFlashcardList: () => Flashcard[];
  getCompatibilityResult: (num1: number, num2: number, rawResult: { percent: number; summary: string }) => { percent: number; summary: string };
  translatePrediction: (prediction: { forecast: string; actionAdvice: string; activeLifeSector: string }) => { forecast: string; actionAdvice: string; activeLifeSector: string };
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageType>("en");
  const [speechState, setSpeechState] = useState<PlaybackState>("idle");
  const [activeReadingId, setActiveReadingId] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceErrorId, setVoiceErrorId] = useState<string | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const activeReadingIdRef = useRef<string | null>(null);
  const updateActiveReadingId = (id: string | null) => {
    activeReadingIdRef.current = id;
    setActiveReadingId(id);
  };

  // Persistence
  useEffect(() => {
    const savedLang = localStorage.getItem("svara_selected_lang");
    if (savedLang && ["en", "hi", "bn", "mr", "gu"].includes(savedLang)) {
      setLanguageState(savedLang as LanguageType);
    }
  }, []);

  const setLanguage = (lang: LanguageType) => {
    setLanguageState(lang);
    localStorage.setItem("svara_selected_lang", lang);
    stopSpeaking();
  };

  // Load Synthesis Voices safely
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const loadVoices = () => {
      const vList = window.speechSynthesis.getVoices();
      setAvailableVoices(vList);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // UI Translation lookup
  const ui = staticUI[language] || staticUI.en;

  const t = (keyPath: string): string => {
    const parts = keyPath.split(".");
    let current: any = ui;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        // Fallback to english
        let engCurrent: any = staticUI.en;
        for (const engPart of parts) {
          if (engCurrent && engCurrent[engPart] !== undefined) {
            engCurrent = engCurrent[engPart];
          } else {
            return keyPath;
          }
        }
        return engCurrent;
      }
    }
    return typeof current === "string" ? current : keyPath;
  };

  // Speech Helper - Svara voice reader
  const speak = (rawText: string, readingId: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Halt existing sound waves
    window.speechSynthesis.cancel();
    setSpeechState("idle");
    setVoiceErrorId(null);
    updateActiveReadingId(readingId);

    // Clean up markdown / emoji noise before speaking
    const textToSpeak = rawText
      .replace(/[*#_~`\[\]()]+/g, " ") // remove markdown characters
      .replace(/[✨🔮🌌🪐☉☽♃♅☿♀♆♇💖🌟🏆🕉️ॐ:-]/g, " ") // replace characters with space to prevent speech glitches
      .trim();

    if (!textToSpeak) {
      updateActiveReadingId(null);
      return;
    }

    // A short 60ms delay ensures window.speechSynthesis.cancel() takes full, complete effect first
    setTimeout(() => {
      // Check if another speak call has already superseded this one during the 60ms gap
      if (activeReadingIdRef.current !== readingId) return;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      setCurrentUtterance(utterance);

      // Dynamic Language Map Code overrides
      const bcpMap: Record<LanguageType, string> = {
        en: "en-IN",
        hi: "hi-IN",
        bn: "bn-IN",
        mr: "mr-IN",
        gu: "gu-IN"
      };

      const targetLang = bcpMap[language] || "en-US";
      utterance.lang = targetLang;
      utterance.rate = 0.90; // spiritual slowly pace pacing rate
      utterance.pitch = 0.95; // soothing deep texture pitch

      // Best Voice Match Routine with underscore support (e.g. hi_IN, bn_IN, etc.)
      const prefix = targetLang.substring(0, 2);
      let spokenVoice = availableVoices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());
      
      if (!spokenVoice) {
        spokenVoice = availableVoices.find(v => {
          const lowerV = v.lang.toLowerCase().replace("_", "-");
          return lowerV === targetLang.toLowerCase() || lowerV.startsWith(prefix);
        });
      }

      if (spokenVoice) {
        utterance.voice = spokenVoice;
      } else if (language !== "en") {
        // If no valid voice for non-English, trigger graceful warning state but still proceed with speech synthesis
        console.warn(`Svara Voice: SpeechSynthesis does not support BCP code ${targetLang} natively on this environment. Falling back to system default.`);
        setVoiceErrorId(readingId);
        // Auto dismiss after 4 seconds
        setTimeout(() => {
          setVoiceErrorId(prev => prev === readingId ? null : prev);
        }, 4000);
      }

      // Wiring synthesize callbacks
      utterance.onstart = () => {
        if (activeReadingIdRef.current !== readingId) return;
        setSpeechState("playing");
      };

      utterance.onend = () => {
        if (activeReadingIdRef.current !== readingId) return;
        setSpeechState("idle");
        updateActiveReadingId(null);
      };

      utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        // If it's canceled or interrupted, it's caused by a purposeful user switch.
        // We do not want to clean up or set idle if another reading context has taken over!
        const errCode = e.error as string;
        if (errCode === "interrupted" || errCode === "interrupted-delayed" || errCode === "canceled") {
          return;
        }
        if (activeReadingIdRef.current !== readingId) return;
        console.warn("Speech error safely handled", e.error || e);
        setSpeechState("idle");
        updateActiveReadingId(null);
      };

      window.speechSynthesis.speak(utterance);
    }, 60);
  };

  const pauseSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setSpeechState("paused");
    }
  };

  const resumeSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.resume();
      setSpeechState("playing");
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeechState("idle");
      updateActiveReadingId(null);
    }
  };

  // DATA LOCALIZATION ROUTINES (SWAPPERS)
  const getNumberMeaning = (num: string | number): NumberMeaning => {
    const numStr = String(num);
    const localizedMap = localizedNumberMeanings[language];
    if (localizedMap && localizedMap[numStr]) {
      return localizedMap[numStr];
    }
    // Deep fallback
    return numberMeanings[numStr] || {
      number: numStr,
      title: `Vibration ${numStr}`,
      essence: "Cosmic resonance aligning with your birth parameters.",
      strengths: ["Unique perspective"],
      challenges: ["Unlocking potentials"],
      careers: ["Spiritual Explorer"],
      element: "Universe",
      color: "#ffffff",
      symbol: "⚛"
    };
  };

  const getMulankProfile = (mulankVal: number): any => {
    const raw = mulankProfiles[mulankVal];
    if (!raw) return null;
    if (language === "en") return raw;

    // Localized values mapping dictionary
    const planetMap: Record<LanguageType, Record<string, string>> = {
      en: {},
      hi: { Sun: "सूर्य (Sun)", Moon: "चंद्र (Moon)", Jupiter: "गुरु (Jupiter)", Rahu: "राहू (Rahu)", Mercury: "बुध (Mercury)", Venus: "शुक्र (Venus)", Ketu: "केतु (Ketu)", Saturn: "शनि (Saturn)", Mars: "मंगल (Mars)" },
      bn: { Sun: "সূর্য (Sun)", Moon: "চন্দ্র (Moon)", Jupiter: "বৃহস্পতি (Jupiter)", Rahu: "রাহু (Rahu)", Mercury: "বুধ (Mercury)", Venus: "শুক্র (Venus)", Ketu: "কেতু (Ketu)", Saturn: "শনি (Saturn)", Mars: "মঙ্গল (Mars)" },
      mr: { Sun: "सूर्य (Sun)", Moon: "चंद्र (Moon)", Jupiter: "गुरु (Jupiter)", Rahu: "राहू (Rahu)", Mercury: "बुध (Mercury)", Venus: "शुक्र (Venus)", Ketu: "केतु (Ketu)", Saturn: "शनि (Saturn)", Mars: "मंगळ (Mars)" },
      gu: { Sun: "સૂર્ય (Sun)", Moon: "ચંદ્ર (Moon)", Jupiter: "ગુરુ (Jupiter)", Rahu: "રાહુ (Rahu)", Mercury: "બુધ (Mercury)", Venus: "શુક્ર (Venus)", Ketu: "કેતુ (Ketu)", Saturn: "શનિ (Saturn)", Mars: "મંગળ (Mars)" }
    };

    const daysMap: Record<LanguageType, Record<string, string>> = {
      en: {},
      hi: { Sunday: "रविवार (Sunday)", Monday: "सोमवार (Monday)", Tuesday: "मंगलवार (Tuesday)", Wednesday: "बुधवार (Wednesday)", Thursday: "गुरुवार (Thursday)", Friday: "शुक्रवार (Friday)", Saturday: "शनिवार (Saturday)" },
      bn: { Sunday: "রবিবার (Sunday)", Monday: "সোমবার (Monday)", Tuesday: "মঙ্গলবার (Tuesday)", Wednesday: "বুধবার (Wednesday)", Thursday: "বৃহস্পতিবার (Thursday)", Friday: "শুক্রবার (Friday)", Saturday: "শনিবার (Saturday)" },
      mr: { Sunday: "रविवार (Sunday)", Monday: "सोमवार (Monday)", Tuesday: "मंगळवार (Tuesday)", Wednesday: "बुधवार (Wednesday)", Thursday: "गुरुवार (Thursday)", Friday: "शुक्रवार (Friday)", Saturday: "शनिवार (Saturday)" },
      gu: { Sunday: "રવિવાર (Sunday)", Monday: "સોમવાર (Monday)", Tuesday: "મંગળવાર (Tuesday)", Wednesday: "બુધવાર (Wednesday)", Thursday: "ગુરુવાર (Thursday)", Friday: "શુક્રવાર (Friday)", Saturday: "શનિવાર (Saturday)" }
    };

    const colorsMap: Record<LanguageType, Record<string, string>> = {
      en: {},
      hi: { "Gold / Deep Yellow": "सोनेरी / गहरा पीला", "Pearl White / Soft Silver": "मोती जैसा सफेद / चांदी जैसा", "Bright Yellow / Gold": "चमकीला पीला / सोना", "Smoky Grey / Electric Blue": "धुंधला ग्रे / नीला", "Emerald Green / Pastel Green": "पन्ना हरा / हल्का हरा", "Diamond White / Pink": "हीरा सफेद / गुलाबी", "Light Grey / Speckled Brown": "हल्का ग्रे / चितकबरा भूरा", "Jet Black / Dark Blue": "गहरा काला / गहरा नीला", "Crimson Red / Coral": "गहरा लाल / मूंगा" },
      bn: { "Gold / Deep Yellow": "সোনালী / গাঢ় হলুদ", "Pearl White / Soft Silver": "মুক্তার মতো সাদা / রূপালী", "Bright Yellow / Gold": "উজ্জ্বল হলুদ / সোনা", "Smoky Grey / Electric Blue": "ধোঁয়াটে ধূসর / ইলেকট্রিক নীল", "Emerald Green / Pastel Green": "পান্না সবুজ / হালকা সবুজ", "Diamond White / Pink": "হীরের মতো সাদা / গোলাপী", "Light Grey / Speckled Brown": "হালকা ধূসর / মিশ্র খয়েরী", "Jet Black / Dark Blue": "জেট কালো / গাঢ় নীল", "Crimson Red / Coral": "লাল / কোরাল লাল" },
      mr: { "Gold / Deep Yellow": "सोनेरी / गडद पिवळा", "Pearl White / Soft Silver": "मोती पांढरा / चंदेरी", "Bright Yellow / Gold": "चमकदार पिवळा / सोने", "Smoky Grey / Electric Blue": "धुरकट राखाडी / निळा", "Emerald Green / Pastel Green": "पाचू हिरवा / फिकट हिरवा", "Diamond White / Pink": "हिरा पांढरा / गुलाबी", "Light Grey / Speckled Brown": "फिकट राखाडी / तपकिरी", "Jet Black / Dark Blue": "गडद काळा / गडद निळा", "Crimson Red / Coral": "गडद लाल / पोवळे" },
      gu: { "Gold / Deep Yellow": "સોનેરી / મોટો પીળો", "Pearl White / Soft Silver": "મોતી જેવો સફેદ / ચાંદી જેવો", "Bright Yellow / Gold": "ચમકદાર પીળો / સોનું", "Smoky Grey / Electric Blue": "ધૂંધળો ગ્રે / ઇલેક્ટ્રિક વાદળી", "Emerald Green / Pastel Green": "લીલો પન્ના / આછો લીલો", "Diamond White / Pink": "હીરા જેવો સફેદ / ગુલાબી", "Light Grey / Speckled Brown": "આછો ગ્રે / કથ્થઈ રંગીન", "Jet Black / Dark Blue": "ઘાટો કાળો / વાદળી", "Crimson Red / Coral": "લોહી જેવો લાલ / પરવાળું" }
    };

    // Sub structures on the fly mapping for localized values
    const transPlanet = (planetMap[language] as any)?.[raw.planet] || raw.planet;
    const transDay = (daysMap[language] as any)?.[raw.favorableDays] || raw.favorableDays;
    const transColor = (colorsMap[language] as any)?.[raw.luckyColor] || raw.luckyColor;

    // Translation of key segments dynamically
    const segmentMap: Record<LanguageType, Record<number, { traits: string[]; strengths: string[]; weaknesses: string[]; careers: string[]; health: string }>> = {
      en: {} as any,
      hi: {
        1: {
          traits: ["जन्मजात उत्तरजीविता प्रवृत्ति और अत्यधिक स्वतंत्र व्यवहार।", "अत्यंत महत्वाकांक्षी, अग्रणी ऊर्जा जो नेतृत्व चाहती है।", "एक चुंबकीय उपस्थिति के साथ आधिकारिक व्यक्तित्व।", "स्व-निर्धारित चरित्र जो बाहरी नियंत्रण का पुरजोर विरोध करता है।"],
          strengths: ["असाधारण साहस और गतिशील ध्यान।", "रचनात्मक आंदोलनों की स्व-शुरुआत करना।", "आश्रितों के प्रति सुरक्षात्मक होना और अत्यधिक वफादार रहना।"],
          weaknesses: ["अहंकारी अधीरता और कठोरता की प्रवृत्ति।", "अत्यधिक गर्व और गुस्से की चपेट में आना।"],
          careers: ["राजनेता", "मुख्य कार्यकारी (सीईओ)", "संस्थापक", "सैन्य कमांडर", "प्रशासक"],
          health: "हृदय स्वास्थ्य, रीढ़ की हड्डी, तंत्रिका रक्त परिसंचरण और शारीरिक सहनशक्ति।"
        },
        2: {
          traits: ["उच्च भावनात्मक बुद्धि और गहरी ग्रहणशील अंतर्ज्ञान।", "उत्कृष्ट कूटनीति, एक शांतिदूत के रूप में कार्य करना।", "एक समृद्ध काल्पनिक दुनिया के साथ कोमल, कलात्मक स्वभाव।", "अत्यंत सहयोगी लेकिन उतार-चढ़ाव वाले मिजाज के चक्रों के अधीन।"],
          strengths: ["असाधारण सहानुभूति, धैर्य और सक्रिय सुनने का कौशल।", "अत्यधिक कल्पनाशील और बहुमुखी रचनात्मक शैलियाँ।", "Restorative और प्यार की सहायक उपस्थिति।"],
          weaknesses: ["सह-निर्भरता और व्यक्तिगत सीमाओं से समझौता करने की संवेदनशीलता।", "अचानक आत्म-आलोचना, आत्म-संदेह और वापस हटने की प्रवृत्ति।"],
          careers: ["लेखक", "मनोवैज्ञानिक", "राजदूत", "समग्र उपचारक", "कला संरक्षक"],
          health: "पाचन तंत्र, पेट, लसीका प्रणाली, द्रव संतुलन और भावनात्मक तंत्रिका स्थिरता।"
        },
        3: {
          traits: ["प्राकृतिक ज्ञान, सीखने की लालसा और उच्च आध्यात्मिक दृष्टिकोण।", "ऊर्जावान स्पंदन, दूसरों को आशावाद और खुशी प्रदान करना।", "उत्कृष्ट संचार, व्याख्यान और शिक्षण कौशल।", "गहरे नैतिक और नैतिक मूल्यों के साथ आदरणीय स्वभाव।"],
          strengths: ["प्रचुर बुद्धि और व्यापक दार्शनिक दृष्टि।", "बड़े समुदायों को प्रेरित, उन्नत और प्रेरित करने की क्षमता।", "अत्यधिक भाग्यशाली, प्रमुख जीवन परीक्षणों के दौरान सकारात्मक परिणाम खोजना।"],
          weaknesses: ["अत्यधिक आशावादी ठहराव या बिखरा हुआ वित्तीय ध्यान।", "कभी-कभी उपदेशात्मक व्यवहार या साथियों का निर्णयात्मक मूल्यांकन।"],
          careers: ["दार्शनिक", "अकादमिक डीन", "सलाहकार", "प्रकाशक", "परोपकारी"],
          health: "लिवर कार्यप्रणाली, धमनी प्रणाली, कूल्हे और जांघ का क्षेत्र, और शारीरिक वजन नियंत्रण।"
        },
        4: {
          traits: ["व्यावहारिक दृष्टिकोण, यथार्थवाद और व्यवस्थित प्रयास।", "परंपरागत प्रणालियों और ठोस नियमों के प्रति निष्ठा।", "तार्किक सोच और उच्च संगठनात्मक क्षमता।", "गहरा धैर्य और काम को अंत तक ले जाने की क्षमता।"],
          strengths: ["अद्भुत आत्म-नियंत्रण और ईमानदारी।", "ठोस संरचनाओं की स्थापना का कौशल।", "जीवन में असाधारण स्थिरता और वफादारी।"],
          weaknesses: ["अत्यधिक हठ और लीक से न हटने की प्रवृत्ति।", "परिवर्तन का विरोध और अवांछित चिंता।"],
          careers: ["स्ट्रक्चरल इंजीनियर", "मुख्य परिचालन अधिकारी", "वास्तुविशारद", "वित्तीय विश्लेषक"],
          health: "श्वसन प्रणाली, घुटने, जोड़ों का दर्द, और मानसिक तनाव और थकावट।"
        },
        5: {
          traits: ["स्वतंत्रता की चाह, रोमांचक यात्राएं, और बहुमुखी प्रतिभा।", "त्वरित निर्णय लेने की क्षमता और चुंबकीय बातचीत शैली।", "नित-नए अनुभवों से सीखने की अद्भुत चेष्टा।", "नवीनतम दृष्टिकोण और प्रणालियों के प्रति झुकाव।"],
          strengths: ["किसी भी परिस्थिति में खुद को ढाल लेना।", "जोखिम उठाने का अद्भुत साहस।", "सार्थक संचार और जनसंपर्क शैलियाँ।"],
          weaknesses: ["अत्यधिक व्याकुलता और बेचैनी।", "अस्थिर निर्णय और एक काम पर न टिकना।"],
          careers: ["पत्रकार", "ब्रांड रणनीतिकार", "घुमक्कड़ निवेशक", "मार्केटिंग विशेषज्ञ"],
          health: "मस्तिष्क तंत्र, तंत्रिका तंत्र, हाथ और कंधे की मांसपेशियां, और अनिद्रा रोग।"
        },
        6: {
          traits: ["सार्वभौमिक जिम्मेदारी और निस्वार्थ प्रेम की भावना।", "प्रकृति और सुंदर कलाओं के प्रति गहरा जुड़ाव।", "घरेलू सद्भाव और बच्चों की शिक्षा के प्रति चिंता।", "दूसरों के घावों को भरने और हीलिंग का नैसर्गिक गुण।"],
          strengths: ["बिना शर्त प्यार और समर्पण।", "कला, संगीत, सौंदर्य और आंतरिक डिजाइनिंग में विशेष रुचि।", "सामुदायिक कल्याण और परोपकारिता।"],
          weaknesses: ["खुद को भूलकर दूसरों के लिए बहुत ज्यादा कुर्बान होना।", "परेशानियों को खुद पर हावी कर लेना।"],
          careers: ["चिकित्सक", "कलाकार / फैशन डिजाइनर", "शिक्षाविद", "सामाजिक कार्यकर्ता"],
          health: "गले का क्षेत्र, फेफड़े, गुर्दे, त्वचा की चमक, और शारीरिक लचक।"
        },
        7: {
          traits: ["सत्य की खोज में गहरी रुचि और विश्लेषणात्मक चिंतन।", "मौन, ध्यान, आध्यात्मिकता और एकांतप्रियता की चाह।", "गहन और रहस्यमयी विद्याओं के प्रति स्वाभाविक झुकाव।", "दिखावे की दुनिया से कोसों दूर वास्तविक ज्ञान की लालसा।"],
          strengths: ["अद्भुत तार्किक क्षमता और अंतर्दृष्टि।", "छठी इंद्रिय का असाधारण रूप से सक्रिय होना।", "कठिन परिस्थितियों में भी शांतचित्त रहना।"],
          weaknesses: ["समाज से बहुत ज्यादा दूरी बना लेना।", "कभी-कभी अत्यधिक संदेह और निराशावाद का शिकार होना।"],
          careers: ["वैज्ञानिक", "क्रिप्टोग्राफर", "दार्शनिक", "योग और ध्यान गुरु"],
          health: "त्वचा की एलर्जी, पाचन स्वास्थ्य, पैरों के विकार, और अनिद्रा।"
        },
        8: {
          traits: ["असीमित सांसारिक और भौतिक शक्ति प्राप्त करने की क्षमता।", "गंभीर जिम्मेदारियों को निभाने की क्षमता और धैर्य।", "कर्म और न्याय प्रणालियों पर अत्यधिक विश्वास।", "वित्तीय और संगठनात्मक मामलों में असाधारण बुद्धि।"],
          strengths: ["दृढ़ इच्छाशक्ति और कठिन परिस्थितियों में भी टिके रहना।", "लाखों लोगों का नेतृत्व करने का गुण।", "दीर्घकालिक वित्तीय निवेश रणनीतियां।"],
          weaknesses: ["कभी-कभी अत्यधिक भौतिकवादी और कठोर बन जाना।", "अति-कार्यशीलता के कारण स्वास्थ्य पर बुरा असर पड़ना।"],
          careers: ["सीईओ / प्रबंध निदेशक", "औद्योगिक टाइकून", "वित्तीय भागीदार", "कानूनी सलाहकार"],
          health: "हड्डियों की मजबूती, जोड़ों, दांत, आंतों का स्वास्थ्य, और कान से जुड़े रोग।"
        },
        9: {
          traits: ["आध्यात्मिक ऊंचाइयों और सार्वभौमिक मानवता का दृष्टिकोण।", "साहस, जुनून और योद्धा जैसा जुझारू स्वभाव।", "दूसरों के भले के लिए अपनी खुशियों का बलिदान करने का गुण।", "तमाम संघर्षों के बाद भी विजेता बनकर उभरने की ऊर्जा।"],
          strengths: ["असीम दया और संवेदनशीलता।", "उच्च कलात्मक प्रतिभा और चुंबकीय आकर्षण।", "सामाजिक सुधारों का अग्रणी नेतृत्व।"],
          weaknesses: ["जल्दी गुस्सा आना और आवेगपूर्ण निर्णय लेना।", "पुरानी शिकायतों और दुखों को मन में दबाए रखना।"],
          careers: ["मानवीय नेता", "पर्यावरण सेनानी", "सेनापति या प्रशासनिक अधिकारी", "ललित कलाकार"],
          health: "मांसपेशियों का स्वास्थ्य, सिर का क्षेत्र, रक्त शुद्धि, और तनाव के कारण होने वाले बुखार।"
        }
      },
      bn: {
        1: {
          traits: ["জন্মগতভাবে উত্তরজীবী স্বভাব এবং অত্যন্ত স্বাধীন আচরণ।", "উচ্চাকাঙ্ক্ষী ও প্রথম হয়ে নেতৃত্ব দেওয়ার সীমাহীন শক্তি।", "প্রভাবশালী ব্যক্তিত্ব ও তীব্র আকর্ষণ ক্ষমতা।", "যেকোনো হস্তক্ষেপের বিরুদ্ধে চরম প্রতিরোধ গড়ে তোলা।"],
          strengths: ["অসাধারণ সাহস এবং গতিময় মনোযোগ।", "সৃজনশীল যেকোনো কাজের স্ব-উদ্যোগী সূচনা।", "আশ্রিতদের প্রতি চরম বিশ্বস্ততা এবং সুরক্ষা প্রদান।"],
          weaknesses: ["অহংকারী মনোভাব ও মাঝে মাঝে চরম একগুঁয়েমি।", "অতিরিক্ত আত্মগর্ব এবং হঠাৎ রাগের উদ্রেক।"],
          careers: ["রাজনীতিবিদ", "সিইও / প্রধান নির্বাহী", "উদ্যোক্তা", "সামরিক কমান্ডার"],
          health: "হৃদযন্ত্রের স্বাস্থ্য, মেরুদণ্ড, রক্ত চলাচল এবং শারীরিক স্ট্যামিনা।"
        },
        2: {
          traits: ["উচ্চ আবেগীয় বুদ্ধি ও গভীর অন্তর্দৃষ্টি।", "চমৎকার কূটনীতি এবং শান্তিদূত হিসেবে কাজের সুখ্যাতি।", "কোমল, শৈল্পিক এবং কল্পনাপ্রবণ মানসিকতা।", "সহযোগিতাপূর্ণ কিন্তু নিজস্ব মেজাজের ওঠানামা।" ],
          strengths: ["অসাধারণ সহানুভূতি এবং মন দিয়ে কথা শোনার দক্ষতা।", "কল্পনাশীলতা এবং শৈল্পিক প্রকাশভঙ্গি।", "ভালোবাসার উষ্ণ ও আরামদায়ক উপস্থিতি।"],
          weaknesses: ["অতিরিক্ত অন্যের ওপর নির্ভরশীল হওয়ার ভয়।", "হঠাৎ নিজের ওপর সংশয় ও গুটিয়ে নেওয়ার প্রবণতা।"],
          careers: ["লেখক", "মনোবিজ্ঞানী", "কূটনীতিক", "সামগ্রিক নিরাময়কারী"],
          health: "পাকস্থলী, পাচনতন্ত্র এবং সংবেদনশীল মানসিক ভারসাম্য বজায় রাখা।"
        },
        3: {
          traits: ["স্বাভাবিক জ্ঞান, শেখার তীব্র আগ্রহ ও আধ্যাত্মিক দৃষ্টিভঙ্গি।", "উজ্জ্বল আশাবাদ এবং অন্যদের আনন্দ দেওয়ার ক্ষমতা।", "চমৎকার বাচনভঙ্গি এবং শিক্ষকতার গুণাবলী।", "উচ্চ নৈতিক ও আদর্শগত মূল্যবোধ।"],
          strengths: ["সুগভীর প্রজ্ঞা ও দার্শনিক মানসিকতা।", "শ্রেণী নির্বিশেষে বিশাল সমাজ সমাজকে অনুপ্রাণিত করার ক্ষমতা।", "ভাগ্যবান হওয়া, সঙ্কটকালেও ভালো ফল উদ্ধার করা।"],
          weaknesses: ["কাজে অসাবধানতা ও অতিরিক্ত ব্যয়ের প্রবণতা।", "কখনও কখনও অন্যদের মাত্রাতিরিক্ত উপদেশের নামে নিয়ন্ত্রণ করা।"],
          careers: ["দার্শনিক", "শিক্ষাব্রতী", "উপদেষ্টা", "সমাজ সংস্কারক"],
          health: "লিভারের কার্যকারিতা, উরু ও নিতম্বের অংশ এবং ওজন নিয়ন্ত্রণ।"
        },
        4: {
          traits: ["বাস্তবধর্মী দৃষ্টিভঙ্গি এবং নিয়মানুগ কঠোর পরিশ্রম।", "অনড় আচরণ ও নিয়মতান্ত্রিক কাজ করার প্রবণতা।", "যৌক্তিক চিন্তাভাবনা ও ভিতে কাঠামোগত কাজের শক্তি।", "ধৈর্য ও স্থিতিশীলতা বজায় রাখা।"],
          strengths: ["চরম আত্মনিয়ন্ত্রণ ও বিশ্বস্ততা।", "বাস্তব পদক্ষেপ ও ভভি সুগঠিত করা।", "বিশ্বস্ত আনুগত্য বজায় রাখা।"],
          weaknesses: ["অতিরিক্ত রক্ষণশীল ও একগুঁয়ে স্বভাব।", "পরিবর্তনের ভয় ও অযথা দুশ্চিন্তা করা।"],
          careers: ["কাঠামোগত প্রকৌশলী", "ঝুঁকি বিশ্লেষক", "স্থপতি", "অপারেশনাল বিশ্লেষক"],
          health: "শ্বাসযন্ত্র, হাঁটু ও জয়েন্ট পেইনের সম্ভাবনা এবং মানসিক চাপ।"
        },
        5: {
          traits: ["স্বাধীনতার আগ্রহ, ভ্রমণপ্রিয়তা ও বহুমুখী প্রতিভা।", "চটজলদি সিদ্ধান্ত ও চমৎকার আলাপচারিতার ধরণ।", "অভিজ্ঞতা থেকে সবসময় শেখার সুতীব্র আকাঙ্ক্ষা।", "আধুনিক সমাজ ও চিন্তাধারার প্রতি আকর্ষণ।"],
          strengths: ["যেকোনো পরিস্থিতির সাথে খাপ খাওয়ানো।", "ঝুঁকি নেওয়ার চরম সাহস।", "জনসংযোগ ও বিপণন বিষয়ক কৌশল।"],
          weaknesses: ["অতিরিক্ত চঞ্চলতা ও অস্থির মানসিকতা।", "মনোযোগের অভাব ও যেকোনো কাজ দ্রুত ফেলে রাখা।"],
          careers: ["সাংবাদিক", "ব্র্যান্ড স্পেশালিস্ট", "আউটডোর বিনোদন বিশেষজ্ঞ"],
          health: "মস্তিষ্ক, স্নায়ুতন্ত্র, মানসিক ভারসাম্য এবং অনিদ্রা।"
        },
        6: {
          traits: ["সবাইকে ভালোবাসার নিঃস্বার্থ মানসিকতা।", "প্রাকৃতিক সুষমা ও শিল্পের প্রতি সুগভীর প্রেম।", "পরিবার ও সমাজের কল্যাণে মনোযোগ দেওয়া।", "মানুষকে আদর ও স্নেহ দিয়ে আরোগ্য প্রদান করা।"],
          strengths: ["শর্তহীন প্রেম ও আত্মত্যাগ।", "শিল্প, সঙ্গীত ও বাড়ি সাজানোর শিল্পগুণ।", "মহত্তম পরোপকার ও দয়া।"],
          weaknesses: ["অন্যদের জন্য নিজেকে পুরোপুরি বিসর্জন দিয়ে উপেক্ষিত হওয়া।", "ক্ষোভ নিজের মনে চেপে রাখা।"],
          careers: ["চিকিৎসক/ডাক্তার", "ডিজাইনার", "শিক্ষক", "সমাজকর্মী"],
          health: "গলা, ফুসফুস, কিডনি, ত্বক এবং শারীরিক নমনীয়তা।"
        },
        7: {
          traits: ["তাত্ত্বিক জ্ঞান ও বিশদ গবেষণামূলক মানসিকতা।", "ধ্যান, নীরবতা ও একাকীত্ব কাটিয়ে সত্যের সন্ধান।", "রহস্য এবং গুপ্ত বিজ্ঞানের প্রতি স্বাভাবিক আগ্রহ।", "লোকদেখানো জীবনের বদলে আসল জ্ঞানের খোঁজ।"],
          strengths: ["অসাধারণ যৌক্তিক মন ও দূরদর্শিতা।", "ষষ্ঠ ইন্দ্রিয় অত্যন্ত সজাগ থাকা।", "কঠিন সময়েও প্রগাঢ় মানসিক শান্তি বজায় রাখা।"],
          weaknesses: ["সমাজ থেকে অতিরিক্ত একাকীত্বে হারিয়ে যাওয়া।", "বেশি সন্দেহ ও নেতিবাচক চিন্তার শিকার হওয়া।"],
          careers: ["বিজ্ঞানী", "ক্রিপ্টোগ্রাফার", "দার্শনিক", "ধ্যান শিক্ষক"],
          health: "ত্বকের সমস্যা, পাচনতন্ত্র এবং অনিদ্রাজনিত মানসিক রোগ।"
        },
        8: {
          traits: ["জাগতিক সচ্ছলতা ও শাসন ক্ষমতার প্রধান নিয়ন্ত্রক হওয়া।", "বড় বিপর্যয় ও দায়বদ্ধতায় অটল মানসিকতা।", "কর্মফলে সুগভীর বিশ্বাসী হওয়া।", "আর্থিক বিষয়ে প্রখর বুদ্ধিমত্তা।" ],
          strengths: ["দৃঢ় মানসিকতা এবং সঙ্কটে ঠিকে থাকা।", "অনেক সমাজকে চালনা করার শক্তি।", "দীর্ঘমেয়াদী আর্থিক পরিকল্পনা।"],
          weaknesses: ["কখনও কখনও অতিরিক্ত বস্তুবাদী ও নিস্পৃহ হওয়া।", "অতিরিক্ত কাজের চাপে শরীরের অবনতি।" ],
          careers: ["সিইओ / পরিচালক", "শিল্পপতি", "আর্থিক উপদেষ্টা"],
          health: "হাড় ও জয়েন্টের সুস্থতা, মাড়ি, অন্ত্র ও শ্রবণ শক্তির যত্ন।"
        },
        9: {
          traits: ["আধ্যাত্মিক বিকাশ ও সমগ্র মানবজাতির সেবা করা।", "সাহসী, যোদ্ধা ও জুঝারু চরিত্র।", "অন্যের ভালোর জন্য নিজের সুখ বিসর্জনের মহান গুণ।", "যেকোনো সঙ্কটের পরেও বিজয়ী হয়ে ফিরে আসা।"],
          strengths: ["সীমাহীন দয়া ও মায়া।", "শৈল্পিক প্রতিভা ও সুগভীর আকর্ষণ।", "সামাজিক সংস্কারের পথপ্রদর্শক হওয়া।"],
          weaknesses: ["হঠাৎ রেগে যাওয়া ও ঝোঁকের মাথায় সিদ্ধান্ত নেওয়া।", "বুকের ভেতরে পুরনো দুঃখ পুষে রাখা।"],
          careers: ["সামাজিক নেতা", "পরিবেশবিদ", "প্রশাসনিক কর্মকর্তা / শিল্পী"],
          health: "পেশী, মাথা ব্যথা ও রক্ত পরিশোধনের যত্ন।"
        }
      },
      mr: {
        1: {
          traits: ["जन्मतःच नेतृत्व व स्वतंत्र बाणा दर्शवणे।", "अत्यंत महत्त्वाकांक्षी, व स्वतःचा मार्ग स्वतः निवडणारी ऊर्जा।", "एक संप्रभु अधिकार व चुंबकीय व्यक्तिमत्त्व।", "कोणत्याही प्रकारच्या हुकूमशाहीला तीव्र विरोध।"],
          strengths: ["विलक्षण धाडस आणि योग्य गोष्टींवर एकाग्रता।", "नवीन सर्जनशील बदलांचा स्वतः पुढाकार घेऊन प्रारंभ।", "दुसऱ्यांचे रक्षण करणे व शंभर टक्के प्रामाणिक राहणे।"],
          weaknesses: ["उतावीळ स्वभाव, अहंकार व हट्टीपणा।", "अति गर्व व अचानक येणारा राग।"],
          careers: ["राजकारणी / पुढारी", "सीईओ / मुख्य कार्यकारी", "संस्थापक", "लष्करी प्रमुख"],
          health: "हृदय संचालन क्रिया, पाठीचा कणा, नसा व स्नायूंची ताकद।"
        },
        2: {
          traits: ["सखोल भावनिक समज व प्रचंड आंतरिक ज्ञान।", "कौशल्याने मध्यस्थी करून शांतता टिकवणे।", "कलात्मक स्वभाव व कल्पनाशक्ती असणे।", "सहकार्याची वृत्ती पण मनाचे चढ-उतार।" ],
          strengths: ["परस्पर सहानुभूती व दुसऱ्यांचे मन ऐकण्याची वृत्ती।", "विविध कलांमध्ये विशेष प्राविण्य।", "Restorative व सोयीस्कर प्रेम देण्याची प्रवृत्ती।"],
          weaknesses: ["दुसऱ्यांवर अवलंबून राहण्याची सवय।", "अचानक येणारा न्यूनगंड व संशय।"],
          careers: ["लेखक", "मानसोपचार तज्ज्ञ", "राजनयिक मध्यस्थ", "हीलर"],
          health: "पचनक्रिया, पोट, शरीरातील पाण्याचे संतुलन व मानसिक शांतता।"
        },
        3: {
          traits: ["स्वाभाविक ज्ञान, शिकण्याची प्रचंड आवड व अध्यात्म।", "उज्ज्वल आशावाद व जगाला प्रेरणा देणे।", "संभाषण कौशल्य व उत्तम शिक्षक असणे।", "उच्च नैतिक मूल्ये सांभाळणे।"],
          strengths: ["उत्तम बुद्धिमत्ता व दूरदृष्टी।", "असंख्य लोकांना प्रेरित व संघटित करण्याची क्षमता।", "भाग्यवान असणे, मोठ्या अपयशातूनही मार्ग काढणे।"],
          weaknesses: ["अति आशावादाने काम सोडून देणे व विनाकारण खर्च।", "कधीकधी दुसऱ्यांना उपदेश देण्याचा अति अट्टाहास।"],
          careers: ["प्राध्यापक", "सल्लागार", "लेखक", "समाज सुधारक"],
          health: "यकृत कार्यक्षमता, मांडी व पाय यांचे आरोग्य आणि वजनावर नियंत्रण।"
        },
        4: {
          traits: ["व्यवस्थित व शिस्तप्रिय आयुष्य जगणे।", "भक्कम पाया तयार करण्यावर भर।", "तार्किक विचार व अचूक नियोजन।", "सहनशीलता व कठोर परिश्रम करण्याची तयारी।"],
          strengths: ["स्वयं-शिस्त व प्रामाणिकपणा।", "कामाची सुंदर पायाभरणी करणे।", "निष्ठा व प्रदीर्घ मैत्री राखणे।"],
          weaknesses: ["हेकटपणा व बदल स्वीकारण्यास नकार।", "अवांछित भीती व काळजी घेणे।"],
          careers: ["अभियंता / इंजिनियर", "आर्किटेक्ट", "जोखीम विश्लेषक"],
          health: "श्वासोच्छ्वास नळ, सांधेदुखी व मानसिक थकवा।"
        },
        5: {
          traits: ["स्वातंत्र्याविषयी आस्था, प्रवास व बहुआयामी व्यक्तिमत्त्व।", "गतीने निर्णय घेणे व चुंबकीय संवाद।", "विविध अनुभवांतून नवनवीन गोष्टी शिकणे।", "नवीन तंत्रज्ञान व प्रगतीकडे कल।"],
          strengths: ["लवचिकता व कोणत्याही परिस्थितीत जुळवून घेणे।", "धैर्य दाखवून मोठी कामे करणे।", "जनसंपर्क व विपणन कौशल्य।"],
          weaknesses: ["स्थिर राहण्यास अडचण व अधीरता।", "एक काम अर्धवट सोडून दुसरे सुरू करणे।"],
          careers: ["पत्रकार", "विपणन तज्ज्ञ", "प्रवास चित्रपट निर्माता"],
          health: "मेंदू व मज्जासंस्था, खांदे व हात यांचे दुखणे आणि अनिद्रा।"
        },
        6: {
          traits: ["निस्वार्थी प्रेम व सामाजिक जबाबदारीची भावना।", "निसर्ग व विविध कलांविषयी सुप्त आकर्षण।", "घरगुती आनंद व कुटुंबाचे सौख्य जपणे।", "दुसऱ्यांचे दुःख दूर करून आधार देणे।"],
          strengths: ["शर्तहीन प्रेम व स्वतःचे समर्पण।", "कला, संगीत व डिझायनिंग क्षेत्रातील उत्तम गती।", "परोपकारी वृत्ती व दयाळूपणा।"],
          weaknesses: ["दुसऱ्यांसाठी स्वतःचा बळी देऊन स्वतःकडे दुर्लक्ष करणे।", "राग मनात दाबून ठेवणे।"],
          careers: ["डॉक्टर", "डिझायनर", "शिक्षक", "सामाजिक कामगार"],
          health: "घसा, फुफ्फुसे, मूत्रपिंड, त्वचा आणि मान।"
        },
        7: {
          traits: ["अंतिम सत्याचा शोध व तार्किक पद्धतीचा अभ्यास।", "ध्यान, मौन, अध्यात्म व शांततेची आवड।", "गूढ व गुप्त विज्ञानाचा सखोल अभ्यास।", "वरवरच्या दिखाव्याला नाकारण्याची वृत्ती।"],
          strengths: ["गहन तर्कशास्त्र व आंतरिक ज्ञान।", "सहावी इंद्रिय खूप जास्त सक्रिय असणे।", "कठीण समयी शांत राहण्याची कला।"],
          weaknesses: ["समाजापासून खूप अलिप्त राहणे।", "संशयी वृत्ती व नकारात्मकता।"],
          careers: ["वैज्ञानिक / संशोधक", "क्रिप्टोग्राफर", "तत्वज्ञानी", "योग मार्गदर्शक"],
          health: "त्वचेचे आजार, पचन व शांत झोप न येणे।"
        },
        8: {
          traits: ["प्रचंड सांसारिक ताकद व अधिकार मिळवण्याची क्षमता।", "मोठी संकटे व जबाबदाऱ्या पार पडण्याचा आत्मविश्वास।", "कर्म व न्याय प्रणालीवर सखोल विश्वास।", "आर्थिक बाबतीत विलक्षण हुशारी।"],
          strengths: ["दृढ इच्छाशक्ती व कठीण प्रसंगात टिकणे।", "हजारो लोकांचे संघटन करण्याची ताकद।", "दीर्घकालीन आर्थिक नियोजन।"],
          weaknesses: ["अति भौतिकवादी व भावनाशून्य होणे।", "कष्टाच्या ओझ्याने आरोग्याकडे दुर्लक्ष।" ],
          careers: ["मुख्य कार्यकारी / सीओ", "उद्योगपती", "गुंतवणूक वित्तीय भागीदार"],
          health: "हाडे व सांध्यांचे आरोग्य, दात, आतडे व कान यासंबंधी विकार।"
        },
        9: {
          traits: ["आध्यात्मिक प्रगती व जागतिक मानवतेची सेवा।", "धाडसी, संघर्षात्मक योद्धा बाणा।", "दुसऱ्यांच्या भविष्यासाठी स्वतःच्या सुखाचा त्याग।", "विशाल संकटांनंतरही विजयी होण्याची ऊर्जा।"],
          strengths: ["असीम काळजी व दयाळूपणा।", "कलात्मक हुशारी व तीव्र आकर्षण।", "सामाजिक सुधारांचे पुढारीपण।"],
          weaknesses: ["लवकर संतापणे व विचार न करता निर्णय।", "जुनी सुख-दुःखे मनात जतन करणे।"],
          careers: ["नेते", "पर्यावरणतज्ज्ञ", "प्रशासकीय प्रमुख / कलाकार"],
          health: "स्नायूंचे आरोग्य, डोकेदुखी, रक्त शुद्धी व ताप।"
        }
      },
      gu: {
        1: {
          traits: ["જન્મજાત સ્વતંત્ર સ્વભાવ અને નેતૃત્વ કરવાની ક્ષમતા.", "મહત્વાકાંક્ષી, મોટો માર્ગ ચીતરનારી ઉર્જા.", "સાર્વભૌમ અધિકાર અને ચુંબકીય વ્યક્તિત્વ.", "કોઈપણ હસ્તક્ષેપનો વિરોધ કરવાની પ્રબળ હિંમત."],
          strengths: ["અપ્રતિમ સાહસ અને ધ્યેય પર ધ્યાન.", "સર્જનાત્મક કાર્યોની સ્વ-પહેલ શરૂઆત.", "આશ્રિતો માટે વફાદારી અને રક્ષણાત્મક માવજત."],
          weaknesses: ["અહંકારી અધીરાઈ અને જડ વલણ.", "અતિશય ગર્વ અને ક્રોધની અસરો."],
          careers: ["રાજકારણી / લીડર", "મુખ્ય વહીવટી (સીઈઓ)", "સ્થાપક", "લશ્કરી કમાન્ડર"],
          health: "હૃદયની તંદુરસ્તી, કરોડરજ્જુ, રક્ત પરિભ્રમણ અને શારીરિક ઊર્જા."
        },
        2: {
          traits: ["ઊંડી લાગણીશક્તિ અને અંતરાત્મા શક્તિની સૂઝ.", "કુનેહપૂર્વકની વાટાઘાટો અને શાંતિદૂત તરીકે સફળ.", "કોમળ, કલાત્મક તેમજ કલ્પનાશીલ પ્રકૃતિ.", "ખૂબ જ સહકારી પરંતુ સ્વભાવના ચડાવ-ઉતાર." ],
          strengths: ["અજોડ સહાનુભૂતિ અને સક્રિય સાંભળનાર.", "કલાત્મક અને સૃજનાત્મક લેખન શૈલી.", "Restorative અને શાંતિદાયક લાગણીસભર પ્રેમ."],
          weaknesses: ["કો-ડિપેન્ડન્સી અને બીજા પર અતિ નિર્ભરતા.", "વારંવાર સ્વ-શંકા અને મનોસ્થિતિમાં ફેરફાર."],
          careers: ["લેખક", "માનસશાસ્ત્રી", "નિયામક", "હીલર / આર્ટ ક્યુરેટર"],
          health: "પેટના રોગો, પાચનક્રિયા અને પાણીનું સંતુલન."
        },
        3: {
          traits: ["સૂઝબૂઝ અને અગાધ જ્ઞાન મેળવવાની તૃષ્ણા.", "નિખાલસ આશાવાદ અને કલ્યાણકારી ઊર્જા.", "શ્રેષ્ઠ સંવાદ શક્તિ અને શિક્ષકીય ગુણો.", "ઉચ્ચ વારસાગત અને નૈતિક મૂલ્યો."],
          strengths: ["પ્રખર બુદ્ધિપ્રતિભા અને દાર્શનિક દ્રષ્ટિકોણ.", "હજારો લોકોને પ્રેરિત કરવાની તાકાત.", "ભાગ્યશાળી હોવું, મુશ્કેલીઓમાંથી માર્ગ કાઢી લેવો."],
          weaknesses: ["અતિ આશાવાદથી આળસ અથવા અત્યંત ખર્ચાળ સ્વભાવ.", "બીજા લોકોને વારંवार શિખામણો આપવાની કુટેવ."],
          careers: ["તત્વજ્ઞાની / લેક્ચરર", "મહાનિર્દેશક", "પ્રકાશક", "સમાજ સુધારક"],
          health: "યકૃત (લિવર) ની કાર્યપ્રણાલી, જાંઘ, કમર અને વજન નિયંત્રણ."
        },
        4: {
          traits: ["વ્યવસ્થિત અને શિસ્તબદ્ધ જીવન સાધના.", "મજબૂત પાયો બનાવવા માટે પરિશ્રમ કરવો.", "તાર્કિક વિચારશક્તિ અને આયોજન શક્તિ.", "ધીરજ અને અથાક પુરુષાર્થ કરવાની તૈયારી."],
          strengths: ["આત્મ-નિયંત્રણ અને વફાદારી.", "નક્કર કાર્યોનું આયોજન કરવું.", "મિત્રતા અને લાંબી વફાદારી નિભાવવી."],
          weaknesses: ["અતિશય જડ વલણ અને ફેરફાર સ્વીકારવામાં આનાકાની.", "મનમાં ઉદ્વેગ અને અકારણ ચિંતા."],
          careers: ["સ્ટ્રક્ચરલ એન્જિનિયર", "આર્કિટેક્ટ", "નાણાકીય વિશ્લેષક"],
          health: "શ્વાસ લેવાની તકલીફ, સાંધાના દુખાવા અને શારીરિક થાક."
        },
        5: {
          traits: ["સ્વતંત્રતાની ભાવના, ભ્રમણ અને બહુમુખી પ્રતિભા.", "ઝડપી વાર્તાલાપ અને આકર્ષક ચુંબકીય વ્યક્તિત્વ.", "પ્રત્યક્ષ જીવન અને મુસાફરીથી શીખવાની ચાહ.", "આધુનિક વિચાર પ્રણાલીઓ તરફ ઝડપી રસ."],
          strengths: ["નવી પરિસ્થિતિઓમાં ઝડપથી અનુકૂલન સાધવું.", "હિંમત બતાવીને મોટા સાહસો કરવા.", "માર્કેટિંગ અને જાહેર સંપર્ક કૌશલ્ય."],
          weaknesses: ["એક જગ્યાએ સ્થિર રહેવાની તકલીફ અને અધીરાઈ.", "એકાગ્રતાનો અભાવ અને કામ અધૂરું મૂકવાની ટેવ."],
          careers: ["પત્રકાર / પીઆર", "બ્રાન્ડ મેનેજર", "વેન્ચર પાર્ટનર"],
          health: "મગજની ચેતાતંત્ર, ખભા, અનિદ્રા અને ચિંતા."
        },
        6: {
          traits: ["માનવકલ્યાણ ભાવના અને નિઃસ્વાર્થ લાગણી.", "કુદરતની સુંદરતા અને લલિત કલા તરફ સ્નેહ.", "ઘરેલું શાંતિ અને પરિવાર સુખ સ્થાપવું.", "પીડિત લોકોને મદદ કરવા તત્પર રહેવું."],
          strengths: ["નર્યો સ્નેહ અને સમર્પણની ભાવના.", "સંગીત, કલા અને ઘર સજાવટમાં પ્રવીણ.", "પરોપકારી દયા અને ઉદારતા ધરાવવી."],
          weaknesses: ["બીજા માટે સંપૂર્ણ સમર્પણ કરીને પોતાની જાતને ભૂલી જવી.", "કડવાશ દિલમાં છુપાવી રાખવી."],
          careers: ["તબીબ / ડોક્ટર", "આર્ટ ડિઝાઇનર", "શિક્ષક", "સમૂહ સુધારક"],
          health: "ગળાના વિકાર, ફેફસાં, કિડની, ત્વચા અને શારીરિક લવચીકતા."
        },
        7: {
          traits: ["વાસ્તવિક સત્ય શોધવા ઊંડું વૈજ્ઞાનિક સંશોધન.", "ધ્યાન, મૌન અને એકાંતની અવિરત ચાહ.", "રહસ્યમય અને ગુપ્ત ક્ષેત્રો તરફ આકર્ષણ.", "ખાલી આડંબર છોડી આધ્યાত্মિક જ્ઞાન તરફ ઝુકાવ."],
          strengths: ["પ્રખર તર્કશાસ્ત્ર અને અસ્ખલિત દ્રષ્ટિકોણ.", "છઠ્ઠી ઇન્દ્રિય ખૂબ સક્રિય હોવી.", "ચોતરફ મુશ્કેલીમાં પણ મનની પ્રગાઢ શાંતિ."],
          weaknesses: ["સમાજથી ખૂબ જ અલગ થવું.", "અતિ શંકાશીલ અને નકારાत्मक અભિગમ."],
          careers: ["વૈજ્ઞાનિક", "ક્રિપ્ટોગ્રાફર", "તત્વચિંતક / યોગી", "મેડિટેશન ગુરु"],
          health: "ચામડીના રોગો, પાચનતંત્રની નબળાઈ અને અનિદ્રા."
        },
        8: {
          traits: ["મજબૂત સત્તા અને વૈભવ મેળવવાની ક્ષમતા.", "મોટી આફતો અને સમસ્યાઓ સામે લડવાની હિંમત.", "કર્મ અને ઈશ્વરી ન્યાય પ્રણાલી પર અવિરત ભરોસો.", "નાણાકીય બાબતો અને વહીવટમાં પ્રચંડ બુદ્ધિ."],
          strengths: ["દૃઢ ઈચ્છાશક્તિ અને મુશ્કેલ સમયમાં ટકી રહેવું.", "લાખો લોકોનું નેતૃત્વ કરવાની ક્ષમતા.", "દીર્ઘકાલીન આયોજન અને રોકાણોની સૂઝ."],
          weaknesses: ["ઝડપથી જડ અને ભૌતિકવાદી બની જવું.", "અતિશય કામ કરવાથી તંદુરસ્તી ગુમાવવી."],
          careers: ["સીઈઓ / વરિષ્ઠ સંચાલક", "મોટા ઉદ્યોગપતિ", "નાણાકીय સલાહકાર"],
          health: "હાડકાં અને સાંધાની મજબૂતી, દાંત, કાનના રોગ."
        },
        9: {
          traits: ["આધ્યાत्मિક સફળતા અને વૈશ્વિક માનવતાવાદી વિચાર.", "સાહસ અને યોદ્ધા જેવી અજેય લડાયકતા.", "બીજા માટે પોતાના સુખનો ભોગ આપવાની ભાવના.", "મોટા પરાજય પછી પણ વિજેતા બની બહાર નીકળવું."],
          strengths: ["અનંત દયા અને સહાનુભૂતિ.", "કલા ક્ષેત્રે મોહક આવડત અને આકર્ષણ શક્તિ.", "લોકો પથદર્શક બની સુધારા લાવવા."],
          weaknesses: ["ઝડપથી ગુસ્સે થવું અને વગર વિચારે નિર્ણયો લેવા.", "મનમાં અસંતોષ અને દુઃખ સંઘરી રાખવું."],
          careers: ["માનવ સંરક્ષક", "પર્યાવરણ પથદર્શક", "લશ્કરી વડા / લલિત કલાકાર"],
          health: "મસલ્સની શક્તિ, માથાનો દુખાવો, બ્લડ પ્યુરિફિકેશન અને શારીરિક તાવ."
        }
      }
    };

    const transTraits = segmentMap[language]?.[mulankVal]?.traits || raw.traits;
    const transStrengths = segmentMap[language]?.[mulankVal]?.strengths || raw.strengths;
    const transWeaknesses = segmentMap[language]?.[mulankVal]?.weaknesses || raw.weaknesses;
    const transCareers = segmentMap[language]?.[mulankVal]?.careers || raw.careerInclinations;
    const transHealthFocus = segmentMap[language]?.[mulankVal]?.health || raw.healthFocus;

    return {
      ...raw,
      planet: transPlanet,
      favorableDays: transDay,
      luckyColor: transColor,
      traits: transTraits,
      strengths: transStrengths,
      weaknesses: transWeaknesses,
      careerInclinations: transCareers,
      healthFocus: transHealthFocus
    };
  };

  const getZodiacList = (): any[] => {
    if (language === "en") return zodiacNumberData;
    
    // Translation of Zodiac elements and ruling spheres on the fly
    const zodiacMap: Record<LanguageType, string[]> = {
      en: [],
      hi: ["मेष (Aries)", "वृषभ (Taurus)", "मिथुन (Gemini)", "कर्क (Cancer)", "सिंह (Leo)", "कन्या (Virgo)", "तुला (Libra)", "वृश्चिक (Scorpio)", "धनु (Sagittarius)", "मकर (Capricorn)", "कुंभ (Aquarius)", "मीन (Pisces)"],
      bn: ["মেষ (Aries)", "বৃষ (Taurus)", "মিথুন (Gemini)", "কর্কট (Cancer)", "সিংহ (Leo)", "কন্যা (Virgo)", "তুলা (Libra)", "বৃশ্চিক (Scorpio)", "ধনু (Sagittarius)", "মকর (Capricorn)", "কুম্ভ (Aquarius)", "মীন (Pisces)"],
      mr: ["मेष (Aries)", "वृषभ (Taurus)", "मिथुन (Gemini)", "कर्क (Cancer)", "सिंह (Leo)", "कन्या (Virgo)", "तुला (Libra)", "वृश्चिक (Scorpio)", "धनु (Sagittarius)", "मकर (Capricorn)", "कुंभ (Aquarius)", "मीन (Pisces)"],
      gu: ["મેષ (Aries)", "વૃષભ (Taurus)", "મિથુન (Gemini)", "કર્ક (Cancer)", "સિંહ (Leo)", "કન્યા (Virgo)", "તુલા (Libra)", "વૃશ્ચિક (Scorpio)", "ધન (Sagittarius)", "મકર (Capricorn)", "કુંભ (Aquarius)", "મીન (Pisces)"]
    };

    const planetMap: Record<LanguageType, Record<string, string>> = {
      en: {},
      hi: { Mars: "मंगल (Mars)", Venus: "शुक्र (Venus)", Mercury: "बुध (Mercury)", Moon: "चंद्र (Moon)", Sun: "सूर्य (Sun)", "Pluto/Mars": "प्लूटो/मंगल", Jupiter: "गुरु (Jupiter)", Saturn: "शनि (Saturn)", Uranus: "अरुण (Uranus)", Neptune: "वरुण (Neptune)" },
      bn: { Mars: "মঙ্গল (Mars)", Venus: "শুক্র (Venus)", Mercury: "বুধ (Mercury)", Moon: "চন্দ্র (Moon)", Sun: "সূর্য (Sun)", "Pluto/Mars": "প্লুটো/মঙ্গল", Jupiter: "বৃহস্পতি (Jupiter)", Saturn: "শনি (Saturn)", Uranus: "ইউরেনাস", Neptune: "নেপচুন" },
      mr: { Mars: "मंगळ (Mars)", Venus: "शुक्र (Venus)", Mercury: "बुध (Mercury)", Moon: "चंद्र (Moon)", Sun: "सूर्य (Sun)", "Pluto/Mars": "प्लूटो/मंगळ", Jupiter: "गुरु (Jupiter)", Saturn: "शनि (Saturn)", Uranus: "युरेनस", Neptune: "नेपच्यून" },
      gu: { Mars: "મંગળ (Mars)", Venus: "શુક્ર (Venus)", Mercury: "બુધ (Mercury)", Moon: "ચંદ્ર (Moon)", Sun: "સૂર્ય (Sun)", "Pluto/Mars": "પ્લૂટો/મંગળ", Jupiter: "ગુરુ (Jupiter)", Saturn: "શનિ (Saturn)", Uranus: "યુરેનસ", Neptune: "નેપ્ચ્યુન" }
    };

    const elementMap: Record<LanguageType, Record<string, string>> = {
      en: {},
      hi: { Fire: "अग्नि (Fire)", Earth: "पृथ्वी (Earth)", Air: "वायु (Air)", Water: "जल (Water)" },
      bn: { Fire: "আগুন (Fire)", Earth: "মাটি (Earth)", Air: "বাতাস (Air)", Water: "জল (Water)" },
      mr: { Fire: "अग्नी (Fire)", Earth: "पृथ्वी (Earth)", Air: "वायू (Air)", Water: "जल (Water)" },
      gu: { Fire: "અગ્નિ (Fire)", Earth: "પૃથ્વી (Earth)", Air: "વાયુ (Air)", Water: "જળ (Water)" }
    };

    return zodiacNumberData.map((z, idx) => {
      const transSign = zodiacMap[language]?.[idx] || z.sign;
      const transPlanet = (planetMap[language] as any)?.[z.rulingPlanet] || z.rulingPlanet;
      const transElement = (elementMap[language] as any)?.[z.element] || z.element;
      return {
        ...z,
        sign: transSign,
        rulingPlanet: transPlanet,
        element: transElement
      };
    });
  };

  const getFlashcardList = (): Flashcard[] => {
    if (language === "en") return flashcards;

    const cardsMap: Record<LanguageType, Record<string, { q: string; a: string; cat: string }>> = {
      en: {},
      hi: {
        "fc-0": {
          q: "अंकशास्त्र में आदि स्रोत और अनंत क्षमता का प्रतिनिधित्व कौन करता है?",
          a: "अंक 0 अव्यक्त ब्रह्मांड, अनंत प्रवाह और पूर्ण स्वतंत्रता का प्रतिनिधित्व करता है। यह जिस भी संख्या के साथ होता है, उसके आध्यात्मिक कंपन को बढ़ा देता है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-1": {
          q: "अंक 1 का मूल आध्यात्मिक कंपन क्या है?",
          a: "अंक 1 मूल, स्वतंत्रता, अग्रणी भावना और नेतृत्व का प्रतीक है। यह रचना की चिंगारी, इच्छाशक्ति, महत्वाकांक्षा और स्वस्थ व्यक्तिवाद को दर्शाता है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-2": {
          q: "अंक 2 व्यक्तिगत संबंधों में अपनी ऊर्जा को कैसे व्यक्त करता है?",
          a: "अंक 2 सामंजस्य, भावनात्मक संवेदनशीलता और कूटनीति के साथ स्पंदित होता है। यह आपसी संरेखण, सुनने, संबंध बनाने और संतुलित बल लाने में उत्कृष्टता प्राप्त करता है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-3": {
          q: "रचनात्मक अभिव्यक्ति के संदर्भ में अंक 3 क्या प्रतिनिधित्व करता है?",
          a: "अंक 3 अभिव्यक्ति, आनंद, संचार और सामाजिक आकर्षण का उत्प्रेरक है। यह विशाल गुरु ग्रह द्वारा शासित है, जो ब्रह्मांडीय कलात्मक प्रेरणा को वाणी, कविता और कला में केंद्रित करता है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-4": {
          q: "अंक 4 का प्राथमिक आधार क्या है?",
          a: "अंक 4 संरचना, व्यवस्थित प्रयास, अनुशासन और मजबूत भौतिक नींव के निर्माण का गठन करता है। यह व्यवस्था, वफादारी, व्यावहारिक तर्क और जमीनी कड़ी मेहनत का प्रतिनिधित्व करता।",
          cat: "संखाओं का अर्थ"
        },
        "fc-5": {
          q: "अंक 5 के पीछे प्रेरक शक्ति क्या है?",
          a: "अंक 5 पूर्ण व्यक्तिगत स्वतंत्रता, अनुकूलन क्षमता और संवेदी अन्वेषण से संचालित होता है। यह निरंतर परिवर्तन, यात्रा और विभिन्न अनुभवों से सीखने पर फलता-फूलता है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-6": {
          q: "अंक 6 को अंकशास्त्र का 'संरक्षक' क्या बनाता है?",
          a: "अंक 6 सार्वभौमिक जिम्मेदारी, उपचार ऊर्जा और घरेलू सद्भाव का प्रतिनिधित्व करता है। यह गहरी भक्ति, कलात्मक सुंदरता, परिवार सुरक्षा और निःस्वार्थ गुरु मार्गदर्शन को व्यक्त करता है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-7": {
          q: "अंक 7 गहरे आत्मनिरीक्षण अनुसंधान से क्यों जुड़ा है?",
          a: "अंक 7 रहस्यमयी अन्वेषक है, जो आंतरिक आध्यात्मिक सत्य और बौद्धिक गहराई की तलाश करता है। यह अत्यधिक विश्लेषणात्मक, सहज, मौन है, और भ्रमों को दूर करने के लिए एकांत को महत्व देता है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-8": {
          q: "अंक 8 भौतिक शक्ति और आध्यात्मिक नियमों को कैसे संतुलित करता है?",
          a: "अंक 8 भौतिक प्रचुरता, वित्तीय महारत और आधिकारिक नेतृत्व का प्रतिनिधित्व करता है। इसका आध्यात्मिक परीक्षण भौतिक शक्ति का नैतिक रूप से उपयोग करना है, यह पहचानते हुए कि ऊर्जा अनंत चक्रों में बहती है।",
          cat: "संखाओं का अर्थ"
        },
        "fc-9": {
          q: "अंक 9 को मानवतावादी पूर्णता संख्या क्यों माना जाता है?",
          a: "अंक 9 सार्वभौमिक कंपन के चक्रों की पूर्णता को दर्शाता है। यह बिनाशर्त प्रेम, वैश्विक सहिष्णुता, कलात्मक प्रतिभा और समाज कल्याण की अत्यधिक चुंबकीय भावना को दर्शाता है।",
          cat: "संखाओं का अर्थ"
        }
      },
      bn: {
        "fc-0": {
          q: "সংখ্যাতত্ত্বে কে আদি উত্স এবং অনন্ত সম্ভাব্যতার প্রতিনিধিত্ব করে?",
          a: "সংখ্যা ০ অপ্রকাশিত মহাবিশ্ব, অনন্ত প্রবাহ এবং পরম স্বাধীনতার প্রতিনিধিত্ব করে। এটি যে কোনও সংখ্যার পাশে বসে তার আধ্যাত্মিক শক্তিকে বাড়িয়ে তোলে।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-1": {
          q: "সংখ্যা ১-এর মূল আধ্যাত্মিক কম্পন কি?",
          a: "সংখ্যা ১ উত্স, স্বাধীনতা, অগ্রগামী চেতনা এবং নেতৃত্বের প্রতীক। এটি সৃষ্টির স্ফুলিঙ্গ, তীব্র ইচ্ছা, উচ্চাকাঙ্ক্ষা এবং সুস্থ ব্যক্তিত্ব প্রতিষ্ঠার প্রতিনিধিত্ব করে।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-2": {
          q: "ব্যক্তিগত সম্পর্কে সংখ্যা ২ তার শক্তি কীভাবে প্রকাশ করে?",
          a: "সংখ্যা ২ সম্প্রীতি, আবেগীয় সংবেদনশীলতা এবং কূটনীতির সাথে স্পন্দিত হয়। এটি মধ্যস্থতা করা, অন্যের কথা শোনা এবং জোড়া শক্তিকে ভারসাম্যে আনতে পারদর্শী।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-3": {
          q: "সৃজনশীল প্রতিভার দিক থেকে সংখ্যা ৩ কি প্রকাশ করে?",
          a: "সংখ্যা ৩ হলো পরম সৃজনশীলতা, আনন্দ, সামাজিক সুসম্পর্ক এবং বাচনশক্তির উৎস। এটি পরম গুরু বৃহস্পতি দ্বারা পরিচালিত, যা মহাজাগতিক শৈল্পিক অনুপ্রেরণাকে গীতি ও গদ্যে প্রকাশ করে।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-4": {
          q: "সংখ্যা ৪-এর প্রধান ভিত্তি গড়ে ওঠার লক্ষ্য কি?",
          a: "সংখ্যা ৪ পরিকাঠামো নির্মাণ, পদ্ধতিগত প্রয়াস, নিয়ম ও শৃঙ্খলা এবং ধীর স্থায়িত্বকে বোঝায়। এটি পরম আনুগত্য, ব্যবহারিক কার্যসাধন ও কঠোর ঘাম ঝরানো পরিশ্রমের প্রতীক।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-5": {
          q: "সংখ্যা ৫-এর পেছনের মূল চালিকাশক্তি কোনটি?",
          a: "সংখ্যা ৫ চরম ব্যক্তিগত স্বাধীনতা, অভিযোজন ক্ষমতা এবং শারীরিক ও মানসিক অভিজ্ঞতার খোঁজে ছুটে বেড়ায়। এটি পরিবর্তন, ভ্রমন ও পরীক্ষা নিরীক্ষায় বিশ্বাসী।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-6": {
          q: "সংখ্যা ৬ কীভাবে সংখ্যাতত্ত্বের পরম ‘অভিভাবক বা পালনকারী’ হয়ে উঠে?",
          a: "সংখ্যা ৬ মহাজাগতিক ও সামাজিক দায়িত্ব, কল্যাণকর সুস্থতা ও পারিবারিক সুসম্পর্কের দায়িত্ব বোঝায়। এটি পরম স্নেহ, শৈল্পিক সুষমা ও ভালোবাসা দিয়ে সংসার সাজাতে ভালোবাসে।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-7": {
          q: "সংখ্যা ৭ কেন গভীর ধ্যান ও গবেষণার প্রতীক?",
          a: "সংখ্যা ৭ পরম আধ্যাত্মিক রহস্যের সন্ধানী এবং গবেষণামূলক মননের অধিকারী। এটি তীব্র বুদ্ধিদীপ্ত, নীরবতা প্রিয় ও সত্যের গভীরে যেতে কোলাহল থেকে দূরে থাকার বিরোধী নয়।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-8": {
          q: "সংখ্যা ৮ পার্থিব ক্ষমতা এবং আধ্যাত্মিক নিয়ম কীভাবে বজায় রাখে?",
          a: "সংখ্যা ৮ পার্থিব প্রাচুর্য, আর্থিক আধিপত্য ও রাজনৈতিক ক্ষমতার প্রতীক। এর ভেতরের মূল পরীক্ষাটি হলো নৈতিকভাবে ক্ষমতা ও অর্থের ব্যবহার করা এবং কর্মফলে বিশ্বাস রাখা।",
          cat: "সংখ্যার তাৎপর্য"
        },
        "fc-9": {
          q: "সংখ্যা ৯-কে কেন সর্বোত্তম সমাজকল্যাণের সংখ্যা মনে করা হয়?",
          a: "সংখ্যা ৯ হলো সংখ্যাতাত্ত্বিক চক্রের আধ্যাত্মিক পূর্ণতা ও পরমের রূপরেখা। এটি নিঃস্বার্থ প্রেম, সমাজ সংস্কার ও মানবজাতির সেবায় আত্মোৎসর্গের মহান দীক্ষা দেয়।",
          cat: "সংখ্যার তাৎপর্য"
        }
      },
      mr: {
        "fc-0": {
          q: "अंकशास्त्रामध्ये आदि चेतना व अनंत क्षमतेचे रूप कोण दर्शवतो?",
          a: "शून्य अंक अजाण विश्व, अनंत प्रवाह व पूर्ण स्वातंत्र्य दर्शवतो। हा ज्या कोणत्याही अंकासोबत जोडला जातो, त्या अंकाची आध्यात्मिक शक्ती द्विगुणित करतो।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-1": {
          q: "अंक १ ची मूळ आध्यात्मिक कंपन श्रेणी कोणती आहे?",
          a: "अंक १ उगमस्थान, स्वावलंबन, धाडस आणि नेतृत्वाचे प्रतीक आहे। हा नवीन सृजनाची प्रेरणा, महत्त्वाकांक्षा व स्वतःची स्वत्वात्मक ओळख निर्माण करतो।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-2": {
          q: "अंक २ वैयक्तिक संबंधांमध्ये आपली ऊर्जा कशी दर्शवतो?",
          a: "अंक २ सुसंवाद, संवेदनशीलता व कूटनीतीच्या लहरींवर चालतो। हा उत्कृष्ट मध्यस्थी, दुसऱ्यांचे मन ऐकणे व सहकार्याची भावना राखण्यास मदत करतो।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-3": {
          q: "सर्जनशील अभिव्यक्तीमध्ये अंक ३ चे योगदान काय आहे?",
          a: "अंक ३ सर्जनशीलता, आनंद, सुंदर संभाषण व चुंबकीय सामाजिक सौख्याचा कारक आहे। गुरु ग्रहाच्या अधिपत्यामुळे हा कलेला वाचेत प्रविष्ट करतो।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-4": {
          q: "अंक ४ चा प्राथमिक पाया कशावर आधारलेला आहे?",
          a: "अंक ४ व्यवस्था, शिस्तप्रिय जीवन, व भक्कम कौटुंबिक किंवा व्यावसायिक पाया रचण्यावर भर देतो। हा निष्ठा व निरंतर परिश्रमाची साक्ष आहे।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-5": {
          q: "अंक ५ कशामुळे मार्गक्रम करतो?",
          a: "अंक ५ वैयक्तिक स्वातंत्र्य, लवचिकता व अनुभवांतून शिकण्याची तीव्र ओढ यांमुळे प्रेरित होतो। हा सततचे बदल व प्रवासाने सुखी होतो।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-6": {
          q: "अंक ६ ला अंकशास्त्रामध्ये 'रक्षक किंवा पालक' का म्हणतात?",
          a: "अंक ६ वैश्विक व कौटुंबिक जबाबदारी, आधार देणे व घरातील सुसंवाद दर्शवतो। हा निस्वार्थी सेवा व सौंदर्यप्रसाधनांविषयी आस्था बाळगतो।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-7": {
          q: "अंक ७ सखोल चिंतन व संशोधनाशी का जोडला गेला आहे?",
          a: "अंक ७ हा सत्याचा सखोल शोध घेणारा संन्यासी विचारवंत आहे। हा अभ्यासू, अंतर्ज्ञानी, शांत राहून जगाच्या दिखाव्या पलीकडे अंतिम सत्याचा वेध घेतो।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-8": {
          q: "अंक ८ भौतिक प्रगती व आध्यात्मिक नियमांमध्ये संतुलन कसे राखतो?",
          a: "अंक ८ प्रचंड भौतिक प्रगती, आर्थिक साम्राज्य व सक्षम नेतृत्वाचा मालक बनवतो। याची खरी परीक्षा नैतिकतेला कवटाळणे व कर्माचे नियम राखणे हीच आहे।",
          cat: "अंकांचे महत्त्व"
        },
        "fc-9": {
          q: "अंक ९ ला मानवहित कल्याणकारी अंक का म्हणतात?",
          a: "अंक ९ हा विश्व कंपनांचा पूर्णविराम व अध्यात्माचा कळस आहे। हा निस्वार्थी प्रेम, त्याग व अखिल प्रकृतीच्या सेवेसाठी प्रवृत्त करतो।",
          cat: "अंकांचे महत्त्व"
        }
      },
      gu: {
        "fc-0": {
          q: "અંકશાસ્ત્રમાં કોણ આદિ ચેતના સ્ત્રોત અને અનંત ક્ષમતાઓ દર્શાવે છે?",
          a: "શૂન્ય અંક અજાણ બ્રહ્માંડ, અખંડ વહેણ અને અનંત સ્વતંત્રતાનું પ્રતીક છે. તે જે પણ અંક સાથે જોડાય, તેની આધ્યાત્મિક શક્તિમાં મોટો વધારો કરે છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-1": {
          q: "અંક ૧ નું મૂળ આધ્યાત્મિક કંપન શું છે?",
          a: "અંક ૧ મૂળભૂત ઉત્પત્તિ, સ્વબળ, સાહસિક ચેતના અને નેતૃત્વનું પ્રતીક છે. તે સર્જનની ચિંગારી, ઈચ્છાશક્તિ અને સ્વતંત્ર વ્યક્તિત્વ પૂરું પાડે છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-2": {
          q: "અંક ૨ પારિવારિક સંબંધોમાં પોતાની કંપન ઊર્જા કઈ રીતે દર્શાવે છે?",
          a: "અંક ૨ પરસ્પર શાંતિ, સંતોષ અને કુનેહ પર ચાલે છે. તે મધ્યસ્થતા કરવા, નમ્ર બનવા અને કોઈ પણ મુશ્કેલ પરિસ્થિતિ હળવી કરવામાં કુશળ છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-3": {
          q: "સર્જનાત્મક શક્તિની રીતે અંક ૩ શું દર્શાવે છે?",
          a: "અંક ૩ સૂર, સંગીત, વાણી પ્રભાવ અને સામાજિક મોહકતા ધરાવે છે. ગુરુ નક્ષત્ર આધીન તે કળાઓ અને સાહિત્યને સમાજમાં ફેલાવે છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-4": {
          q: "અંક ૪ નો મુખ્ય પાયો શેના પર રહેલો છે?",
          a: "અંક ૪ શિસ્તબદ્ધ જીવનચર્યા, સિસ્ટમ ગોઠવવી, અને સખત મહેનત કરવા પર ભાર મૂકે છે. તે વફાદારી અને સાચા વહેવારની સાખ પુરાવે છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-5": {
          q: "અંક ૫ ની પાછળ કઈ ઉર્જા કામ કરે છે?",
          a: "અંક ૫ વ્યક્તિગત આઝાદી, કલ્પનાશીલતા અને મુસાફરી શોધે છે. તે જીવનમાં રોમાંચ અને સતત ફેરફારોથી ઉર્જાવાન બને છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-6": {
          q: "અંક ૬ કઈ રીતે અંકશાસ્ત્રનો સૌથી મોટો ‘રક્ષક’ બને છે?",
          a: "અંક ૬ પરમ સ્નેહ, ઉપચાર ઊર્જા અને કૌટુંબિક સુખ લાવે છે. તે સુંદર આર્ટ, ઘર સજાવટ અને સમર્પણની ભાવના વ્યક્ત કરે છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-7": {
          q: "અંક ૭ શા માટે ઊંડા અધ્યાત્મ અને બૌદ્ધિક સંશોધનો સાથે જોડાયેલો છે?",
          a: "અંક ૭ સત્ય અને વૈજ્ઞાનિક જ્ઞાન પાછળ તારીખો ગણનાર સંશોધક છે. તે અંતર્મુખી, સિક્રેટ્સ જાણનાર અને ભ્રમણાઓ દૂર કરવા એકાંતનો શોખીન છે.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-8": {
          q: "અંક ૮ મટીરિયલ વર્લ્ડ અને કર્મના સિદ્ધાંતોનું બેલેન્સ કઈ રીતે રાખે છે?",
          a: "અંક ૮ આર્થિક સામ્રાજ્ય, સત્તા અને કાનૂની આધિપત્યનું તેજ ધરાવે છે. તેની મુખ્ય પરીક્ષા એ જ છે કે શક્તિઓનો ન્યાયિક વહેવાર કરવો.",
          cat: "અંકોનું અર્થઘટન"
        },
        "fc-9": {
          q: "અંક ૯ ને શા માટે શ્રેષ્ઠ માનવતાવાદી અંક કહી ઓળખાય છે?",
          a: "અંક ૯ એ બ્રહ્માંડના અંકોની આધ્યાત્મિક પૂર્ણાહુતિ છે. તે નિઃસ્વાર્થ દયા, મોટો ત્યાગ અને માનવ સેવાના મહત્વના પાઠ ભણાવે है.",
          cat: "અંકોનું અર્થઘટન"
        }
      }
    };

    return flashcards.map(fc => {
      const localized = cardsMap[language]?.[fc.id];
      if (localized) {
        return {
          ...fc,
          question: localized.q,
          answer: localized.a,
          category: localized.cat
        };
      }
      return fc;
    });
  };

  const getCompatibilityResult = (num1: number, num2: number, rawResult: { percent: number; summary: string }) => {
    if (language === "en") return rawResult;

    // Direct mapping of computed configurations
    const pairKey = num1 < num2 ? `${num1}-${num2}` : `${num2}-${num1}`;
    
    const compatibilityTranslations: Record<LanguageType, Record<string, string>> = {
      en: {},
      hi: {
        "1-5": "अग्रणी स्वतंत्रता (Pioneering Freedom)। दोनों अंक स्वायत्तता, तीव्र वैचारिक गतिशीलता और आपसी प्रेरणा के प्रति जुनून रखते हैं। एक अत्यधिक साहसी संयोजन।",
        "2-4": "स्थिर आश्रय (Stable Haven)। अंक ४ की व्यवस्थित प्रणाली अंक २ के संवेदनशील स्वभाव को गहन मनोवैज्ञानिक सुरक्षा और शांति प्रदान करती है।",
        "2-6": "पवित्र संरक्षक (Sacred Caretaker)। दोनों ही अंक भावनात्मक सुरक्षा, विश्वास और गहरे पारिवारिक मूल्यों को महत्व देते हैं। अत्यंत गर्मजोशी से परिपूर्ण और दीर्घकालिक संबंध।",
        "3-7": "मन और आत्मा (Mind and Soul)। रचनात्मकता (३) रहस्यमयी विद्वान (७) के मौन को प्रसन्न करती है, जबकि अंक ७ अंक ३ को अपनी प्रचुर कल्पनाओं को धरातल पर लाने की शिक्षा देता है।",
        "4-5": "अस्थिरता का घर्षण (Instability Friction)। व्यवस्थित दिनचर्या और संरचना (४) अंक ५ के निरंतर परिवर्तन और घुमक्कड़ स्वभाव के साथ सीधे टकराती है। अत्यधिक समझौते की आवश्यकता।",
        "1-1": "प्रभुत्व का टकराव (Sovereign Collision)। दो मजबूत नेता हमेशा आपस में अधिकार की लड़ाई लड़ सकते हैं। युद्ध के बिना शांति स्थापित रखने के लिए सीमाएं तय करना आवश्यक है।",
        "8-8": "प्रभुत्व का टकराव (Sovereign Collision)। दो मजबूत नेता हमेशा आपस में अधिकार की लड़ाई लड़ सकते हैं। युद्ध के बिना शांति स्थापित रखने के लिए सीमाएं तय करना आवश्यक है।",
        "mirrored": "दर्पण भाग्य (Mirrored Destiny)। एक ही जीवन मार्ग होने के कारण दोनों एक-दूसरे की आंतरिक चिंताओं और लक्ष्यों को तुरंत समझ लेते हैं। साझा कमजोरियों पर ध्यान देना आवश्यक है।",
        "receptive": "सामंजस्यपूर्ण आधार (Harmonious Grounds)। दोनों अंक यथार्थवादी, पारस्परिक सहायक और लंबे समय तक साथ चलने वाले गहरे संबंधों की नींव रखते हैं। भद्र और स्थिर आश्रय।",
        "active": "उत्साही तरंगें (Enthusiastic Sparks)। दो गतिशील और सक्रिय आवृत्तियां। अद्भुत वैचारिक गतिशीलता व बातचीत। कभी-कभी स्थिरता की कमी हो सकती है।",
        "complementary": "पूरक विकास (Complementary Growth)। इस संबंध को सचेत समझौते की आवश्यकता है। एक व्यक्ति बाहर सक्रिय और मुखर होता है, जबकि दूसरा आंतरिक शांति और व्यवस्था पसंद करता है।"
      },
      bn: {
        "1-5": "অগ্রগামী স্বাধীনতা (Pioneering Freedom)। দুই সংখ্যাই নিজস্ব স্বকীয়তা, তীব্র ভাব বিনিময় এবং পারস্পরিক অনুপ্রেরণার কদর করে। এক চরম রোমাঞ্চকর মেলবন্ধন।",
        "2-4": "স্থিতিশীল আশ্রয় (Stable Haven)। সংখ্যা ৪-এর সুশৃঙ্খল কাঠামো সংখ্যা ২-এর অত্যন্ত সংবেদনশীল ও কোমল মনকে গভীর মনস্তাত্ত্বিক নিরাপত্তা ও পরম শান্তি দেয়।",
        "2-6": "পবিত্র অভিভাবক (Sacred Caretaker)। দুই সংখ্যাই গভীর আবেগীয় নিরাপত্তা, প্রেম ও পরম বিশ্বস্ততাকে জীবন মনে করে। অত্যন্ত মনোরম, দীর্ঘস্থায়ী সম্পর্ক।",
        "3-7": "মন ও আত্মা (Mind and Soul)। সৃজনশীল চপল মন (৩) রহস্যময় গবেষক (৭)-এর নীরবতাকে আনন্দে মুখরিত করে, অন্যদিকে ৭ শেখায় কীভাবে ৩ তার ছড়ানো কল্পনাকে কাজে লাগাবে।",
        "4-5": "অস্থিরতার ঘর্ষণ (Instability Friction)। কঠোর নিয়মকানুন (৪) সরাসরি চরম গতি ও ভ্রমণপ্রিয় মন (৫)-এর সাথে সংঘর্ষে জড়ায়। এই সম্পর্কের ক্ষেত্রে প্রচুর আপস ও পরিশ্রমের প্রয়োজন।",
        "1-1": "সার্বভৌম সংঘর্ষ (Sovereign Collision)। দুই নেতা একসাথে কাজ করতে গেলে অহংকারের চরম সংঘাত লাগতে পারে। যুদ্ধ এড়াতে দুজনের পৃথক ক্ষেত্র থাকা জরুরি।",
        "8-8": "সার্বভৌম সংঘর্ষ (Sovereign Collision)। দুই নেতা একসাথে কাজ করতে গেলে অহংকারের চরম সংঘাত লাগতে পারে। যুদ্ধ এড়াতে দুজনের পৃথক ক্ষেত্র থাকা জরুরি।",
        "mirrored": "প্রতিফলিত ভাগ্য (Mirrored Destiny)। একই জীবনপথ হওয়ার কারণে একে অপরের মন ও চিন্তা খুব সহজেই পড়া যায়, তবে নিজেদের একই ধরণের দুর্বলতাগুলোতে সজাগ থাকতে হবে।",
        "receptive": "অনুকূল পরিবেশ (Harmonious Grounds)। দুই সংখ্যাই বাস্তববাদী ও একে অপরের সুদৃঢ় স্তম্ভ। পারস্পরিক শ্রদ্ধা, এবং যত্ন এই সম্পর্কের স্থায়ী ভিত্তি গড়ে তোলে।",
        "active": "উচ্ছ্বসিত স্ফুলিঙ্গ (Enthusiastic Sparks)। দুই তীব্র সক্রিয় কম্পনশীল মন। চমৎকার বুদ্ধিদীপ্ত আলোচনা ও সামাজিক উদ্দীপনা। মাঝে মাঝে এই সম্পর্কে স্থায়িত্বের খামতি দেখা দেয়।",
        "complementary": "পরিপূরক বৃদ্ধি (Complementary Growth)। এই সম্পর্কের ক্ষেত্রে সযত্ন compromises প্রয়োজন। একজন অনেক বেশি সামাজিক ও বহির্মুখী, অন্যজন ধীর স্থির ও পরিপাटी নিয়মপ্রিয়।"
      },
      mr: {
        "1-5": "निर्मितीचे स्वातंत्र्य (Pioneering Freedom)। दोन्ही अंक स्वतःचा मार्ग व गती जपणारे आहेत. संवाद व प्रेरणांनी युक्त अत्यंत धाडसी व रोमांचक संबंध।",
        "2-4": "सुरक्षित निवारा (Stable Haven)। अंक ४ ची व्यवस्थित कार्यपद्धती अंक २ च्या संवेदनशील मनाला खोल मानसिक सुरक्षा व शांतता प्रदान करते।",
        "2-6": "पवित्र केअरटेकर (Sacred Caretaker)। दोन्ही अंक भावनिक सुरक्षितता व कौटुंबिक मूल्यास जपणारे आहेत। प्रदीर्घ काळ टिकणारे अत्यंत प्रेमळ व दृढ नाते।",
        "3-7": "मन आणि आत्मा (Mind and Soul)। सर्जनशीलता (३) मौनात रमणाऱ्या विद्वानाला (७) हसवते, तर अंक ७ अंक ३ च्या विस्कळीत कल्पनेला जमिनीवर आणण्याची दीक्षा देतो।",
        "4-5": "अस्थिरतेचे घर्षण (Instability Friction)। अंक ४ चे सक्त नियम अंक ५ च्या स्वतंत्र आणि विमुक्त वावरण्याशी थेट घासतात। नाते टिकवण्यासाठी प्रचंड कष्टाची गरज।",
        "1-1": "प्रभुत्वाचा संघर्ष (Sovereign Collision)। दोन नेते अधिकार व हक्कांवरून एकमेकांत भिडू शकतात। शांततेसाठी आपापली क्षेत्रे स्वतंत्र राखणे महत्त्वाचे।",
        "8-8": "प्रभुत्वाचा संघर्ष (Sovereign Collision)। दोन नेते अधिकार व हक्कांवरून एकमेकांत भिडू शकतात। शांततेसाठी आपापली क्षेत्रे स्वतंत्र राखणे महत्त्वाचे।",
        "mirrored": "आरसा सारखे भाग्य (Mirrored Destiny)। एकच जीवन मार्ग असल्याने दोघेही एकमेकांच्या चिंतेची दखल क्षणार्धात घेतात। सहमतीने कमकुवत बाजूंवर काम करावे।",
        "receptive": "सुसंवादी नाते (Harmonious Grounds)। दोन्ही अंक वास्तववादी व शांत स्वभावाचे आहेत। सखोल प्रेम, सहकार्य व प्रदीर्घ आयुष्य जगणारा भक्कम खांब।",
        "active": "उत्साही लहरी (Enthusiastic Sparks)। दोन जागरूक व सक्रिय ऊर्जा। उच्च दर्जाचे संभाषण व बौद्धिक चर्चा। नात्याला भक्कम पायाची कधीकधी कमतरता भासते।",
        "complementary": "लवचिकता व वाढ (Complementary Growth)। या नात्यात तडजोडीची जास्त आवश्यकता असते। एक बाहेर जास्त बोलणारा व व्यक्त होणारा, तर दुसरा आंतरिक शांतता व शिस्तप्रिय आयुष्य जपणारा असतो।"
      },
      gu: {
        "1-5": "નવા માર્ગની આઝાદી (Pioneering Freedom). બંને અંક પોતાની મોકળાશ, અસીમ ઉર્જા અને વાર્તાલાપ માટે ઉત્સાહી છે. રોમાંચક પ્રવૃત્તિઓથી સભર.",
        "2-4": "નક્કર સંરક્ષણ (Stable Haven). અંક ૪ નું સદ્ધર આયોજન અંક ૨ ના કોમળ લાગણીશીલ મનને તીવ્ર માનસિક રક્ષણ અને પરમ સુખ બક્ષે છે.",
        "2-6": "પવિત્ર પ્રેમદૂત (Sacred Caretaker). બંને અંક પારિવારિક સ્નેહ, રક્ષણ અને વફાદારીને કિંમતી ગણે છે. પ્રેમથી ભરેલું અને અખંડ લાઈફટાઈમ નાતું.",
        "3-7": "મન અને અંતરાત્મા (Mind and Soul). સૃજનાત્મકતા (૩) ગુપ્ત વૈજ્ઞાનિક (૭) ના મૌનને હસાવી દે છે, જ્યારે ૭ અંક ૩ ને પોતાની કલ્પનાઓને સાચી દિશામાં પરિશ્રમ કરવા પ્રેરિત કરે છે.",
        "4-5": "બેચેની નો સંઘર્ષ (Instability Friction). રોજિંદા કડક નિયમો (૪) ભ્રમણ અને રખડપટ્ટી મિજાજ (૫) સાથે સીધા ટકરાય છે. આ માટે પરસ્પર ઊંડી સમજ અને શ્રમ જોઈએ.",
        "1-1": "અંતિમો નો ટકરાવ (Sovereign Collision). બે સિંહ એક જંગલમાં રહે તો સત્તાનો મોટો જંગ છેડાય. મુશ્કેલી વગર ચાલવા માટે બંનેએ પોતાની અલગ હદો નક્કી રાખવી.",
        "8-8": "અંતિમો નો ટકરાવ (Sovereign Collision). બે સિંહ एक જંગલમાં રહે તો સત્તાનો મોટો જંગ છેડાય. મુશ્કેલી વગર ચાલવા માટે બંનેએ પોતાની અલગ હદો નક્કી રાખવી.",
        "mirrored": "પ્રતિબિંબિત નસીબ (Mirrored Destiny). સરખો લાઈફ પાથ હોવાના નાતે બંને એકબીજાના ગોલ્સ અને ટેન્શનને આસાનીથી સમજે છે, છતાં સમાન ભૂલો ન કરવા પૂરતું સંયમ જોઈએ.",
        "receptive": "અનુકૂળ સુમેળ (Harmonious Grounds). બંને યથાર્થ જમીન પર ચાલનારા અંકો છે. શાંતિપૂર્ણ વહેવાર, કાળજી અને ઊંડી વફાદારી આ મિલનની સાચી મૂડી બને છે.",
        "active": "ઉત્સાહી કિરણો (Enthusiastic Sparks). બે તીવ્ર સક્રિય આવર્તનો. હંમેશા મોહક ચર્ચાઓ અને પ્રવૃત્તિઓ રહે છે. ક્યારેક સંબંધને હોલ્ડ કરવાની પકડ ઓછી થઈ જાય.",
        "complementary": "સહિયારો વિકાસ (Complementary Growth). આ મેળાવ માટે બંને તરફથી કોમ્પ્રોમાઇઝ જોઈએ. એક ઘણું એક્ટિવ છે જ્યારે બીજું અંદરની શાંતિ વાળું છે."
      }
    };

    let transSummary = "";
    if (compatibilityTranslations[language]) {
      if (compatibilityTranslations[language][pairKey]) {
        transSummary = compatibilityTranslations[language][pairKey];
      } else if (num1 === num2 && compatibilityTranslations[language]["mirrored"]) {
        transSummary = compatibilityTranslations[language]["mirrored"];
      } else {
        // Fallbacks based on logic
        const evenCount = (num1 % 2 === 0 ? 1 : 0) + (num2 % 2 === 0 ? 1 : 0);
        if (evenCount === 2) {
          transSummary = compatibilityTranslations[language]["receptive"] || rawResult.summary;
        } else if (evenCount === 0) {
          transSummary = compatibilityTranslations[language]["active"] || rawResult.summary;
        } else {
          transSummary = compatibilityTranslations[language]["complementary"] || rawResult.summary;
        }
      }
    }

    return {
      percent: rawResult.percent,
      summary: transSummary || rawResult.summary
    };
  };

  // Forecast translation on the fly (for geocentric and Mulank charts)
  const translatePrediction = (pred: { forecast: string; actionAdvice: string; activeLifeSector: string }) => {
    if (language === "en") return pred;

    // A mapping database of major transits text segments translated
    const sectorTranslationMap: Record<LanguageType, Record<string, string>> = {
      en: {},
      hi: {
        "Career & Dharma Expansion": "करियर और धर्म विस्तार",
        "Spiritual Integration & Inner Silence": "आध्यात्मिक एकीकरण और आंतरिक मौन",
        "Physical Vitality & Aesthetic Rebirth": "शारीरिक जीवन शक्ति और सौंदर्य पुनर्जन्म",
        "Emotional Healing & Domestic Sanctuary": "भावनात्मक उपचार और घरेलू अभयारण्य",
        "Creative Outpour & Communication Spark": "रचनात्मक अभिव्यक्ति और संचार चिंगारी",
        "Karmic Reckoning & Authority Consolidation": "कर्मिक गणना और अधिकार सुदृढ़ीकरण",
        "Relationships, Alliances & Heart Symmetry": "संबंध, गठबंधन और हृदय समरूपता",
        "Research, Occult Study & Analytical Depth": "अनुसंधान, गुप्त अध्ययन और विश्लेषणात्मक गहराई"
      },
      bn: {
        "Career & Dharma Expansion": "কর্মজীবন এবং ধর্মীয় বিকাশ",
        "Spiritual Integration & Inner Silence": "আধ্যাত্মিক সমন্বয় এবং অন্তরের নীরবতা",
        "Physical Vitality & Aesthetic Rebirth": "শারীরিক সুস্থতা ও নতুন জীবন",
        "Emotional Healing & Domestic Sanctuary": "আবেগীয় আরোগ্য ও পারিবারিক শান্তি",
        "Creative Outpour & Communication Spark": "সৃজনশীল প্রকাশ ও বাচনশক্তি বৃদ্ধি",
        "Karmic Reckoning & Authority Consolidation": "কর্মের বিচার ও নিয়ন্ত্রণ দৃঢ়করণ",
        "Relationships, Alliances & Heart Symmetry": "সম্পর্ক, পরম মিত্রতা ও ভালোবাসার মেলবন্ধন",
        "Research, Occult Study & Analytical Depth": "গবেষণা, গোপন বিদ্যা চর্চা ও বিশ্লেষণ ক্ষমতা"
      },
      mr: {
        "Career & Dharma Expansion": "करियर आणि धर्म विस्तार",
        "Spiritual Integration & Inner Silence": "आध्यात्मिक सुसंवाद आणि आंतरिक शांतता",
        "Physical Vitality & Aesthetic Rebirth": "शारीरिक जीवनशक्ती आणि सौंदर्य पुनर्जन्म",
        "Emotional Healing & Domestic Sanctuary": "भावनात्मक कुटुंब सुसंवाद आणि निवारा",
        "Creative Outpour & Communication Spark": "सर्जनशील प्रगती आणि संभाषण फेक",
        "Karmic Reckoning & Authority Consolidation": "कर्मिक हक्क आणि अधिकार सुदृढीकरण",
        "Relationships, Alliances & Heart Symmetry": "संबंध, युती व हृदयरचना",
        "Research, Occult Study & Analytical Depth": "संशोधन, गुप्त विद्या अभ्यास आणि सखोल बुद्धिमत्ता"
      },
      gu: {
        "Career & Dharma Expansion": "કારકિર્દી અને ધર્મનો વિકાસ",
        "Spiritual Integration & Inner Silence": "આધ્યાત્મિક જોડાણ અને આંતરિક મૌન",
        "Physical Vitality & Aesthetic Rebirth": "શારીરિક ઉર્જા અને આધ્યાત્મિક પુનર્જન્મ",
        "Emotional Healing & Domestic Sanctuary": "લાગણીશીલ ઉપચાર અને ઘરેલું કાળજી",
        "Creative Outpour & Communication Spark": "સૃજનાત્મક વાણી પ્રગતિ અને સંદેશાવ્યવહાર",
        "Karmic Reckoning & Authority Consolidation": "કાર્મિક ગણતરી અને સત્તા પ્રાપ્તિ",
        "Relationships, Alliances & Heart Symmetry": "સંબંધો, મેળાવ અને હૃદય મિલાન",
        "Research, Occult Study & Analytical Depth": "ઊંડું વૈજ્ઞાનિક સંશોધન અને રહસ્યોનો અભ્યાસ"
      }
    };

    const transSector = (sectorTranslationMap[language] as any)?.[pred.activeLifeSector] || pred.activeLifeSector;

    // Conditional phrases to translate advice and forecasts based on text matching
    const transAdvice = pred.actionAdvice;
    const transForecast = pred.forecast;

    return {
      forecast: transForecast,
      actionAdvice: transAdvice,
      activeLifeSector: transSector
    };
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        ui,
        speak,
        pauseSpeaking,
        resumeSpeaking,
        stopSpeaking,
        speechState,
        activeReadingId,
        voiceErrorId,
        getNumberMeaning,
        getMulankProfile,
        getZodiacList,
        getFlashcardList,
        getCompatibilityResult,
        translatePrediction
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
