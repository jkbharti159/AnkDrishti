import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  Award, 
  Check, 
  Info, 
  Sparkles, 
  RotateCw, 
  Compass, 
  Moon, 
  Activity, 
  Zap,
  TrendingUp,
  User,
  Heart,
  DollarSign,
  Briefcase,
  Home,
  Shield,
  HelpCircle,
  Cpu,
  BookOpen,
  CheckCircle2
} from "lucide-react";

const localUiTranslations: Record<string, Record<string, string>> = {
  en: {
    cardsTitle: "Astrological Audit Cards",
    cardsSubtitle: "Vedic Diagnostics Deck",
    vettingEngine: "CLASSICAL VEDIC VETTING ENGINE",
    tapToUnveil: "Tap to Unveil 3-Layer Diagnostics",
    validationLive: "Validation Engine Live",
    diagnosticEngine: "3-Layer Diagnostic Engine",
    astro: "Astro",
    classic: "Classic",
    valid: "Valid",
    primaryChart: "Primary Chart Focus",
    additionalCharts: "Additional Chart Verification",
    crossCheckedVerdict: "Cross-Checked Verdict",
    tapToFlipBack: "Tap Card to Flip Back",
    layer1: "Layer 1: High-Precision Ephemeris",
    layer2: "Layer 2: Shastric Canonical Rules",
    layer3: "Layer 3: Cross-Checked Verdict",
    mangalClass: "Class: Agni Dosha",
    sadesatiClass: "Class: Shani Transit Cycle",
    rahuketuClass: "Class: Karmic Nodes",
    kaalsarpClass: "Class: Nabhasa Hemming",
    pitruClass: "Class: Pitru-Karaka",
    guruchandalClass: "Class: Chandal Alignment",
    kemadrumaClass: "Class: Lunar Isolation",
    shrapitClass: "Class: Karmic Freeze",
    statusPresent: "Present",
    statusAbsent: "Absent",
    statusCancelled: "Cancelled",
    statusActive: "Active",
    statusActiveAxis: "Active Axis",
    statusClear: "Clear",
    statusDetected: "Detected",
    vargasTitle: "Kundali Divisional Chart Vetting Guide",
    vargasSubtitle: "Vargas System Verification",
    vargasTableSource: "Source: Shastric Canonical Verification Guidelines",
    vargasTableIntro: "While the primary birth chart (D1) outlines the seed energetic potential and immediate life conditions, Vedic astrology employs high-precision divisional harmonic charts (Vargas) to cross-check, confirm, and determine the structural severity or cancellation of various planetary combinations and Doshas.",
    vargasThDosha: "Dosha / Affliction",
    vargasThPrimary: "Primary Chart",
    vargasThHarmonic: "Additional / Harmonic Charts used for Vetting",
    vargasThProtocol: "Verification Protocol",
  },
  hi: {
    cardsTitle: "ज्योतिषीय लेखापरीक्षा कार्ड",
    cardsSubtitle: "वैदिक नैदानिक ​​डेक",
    vettingEngine: "शास्त्रीय वैदिक सत्यापन इंजन",
    tapToUnveil: "3-परतीय नैदानिक विवरण देखने के लिए टैप करें",
    validationLive: "सत्यापन इंजन सक्रिय है",
    diagnosticEngine: "3-परतीय नैदानिक ​​इंजन",
    astro: "खगोल/ज्योतिष",
    classic: "शास्त्रीय",
    valid: "सत्यापन",
    primaryChart: "प्राथमिक चार्ट फोकस",
    additionalCharts: "अतिरिक्त चार्ट सत्यापन",
    crossCheckedVerdict: "क्रॉस-चेक किया गया निर्णय",
    tapToFlipBack: "वापस पलटने के लिए टैप करें",
    layer1: "परत 1: उच्च-सटीक पंचांग (Ephemeris)",
    layer2: "परत 2: शास्त्रीय प्रामाणिक नियम",
    layer3: "परत 3: क्रॉस-चेक किया गया निर्णय",
    mangalClass: "वर्ग: अग्नि दोष",
    sadesatiClass: "वर्ग: शनि गोचर चक्र",
    rahuketuClass: "वर्ग: कर्मात्मक नोड्स",
    kaalsarpClass: "वर्ग: नभस वेष्टन",
    pitruClass: "वर्ग: पितृ-कारक",
    guruchandalClass: "वर्ग: चांडाल संरेखण",
    kemadrumaClass: "वर्ग: चंद्र एकांत",
    shrapitClass: "वर्ग: कर्मात्मक अवरोध",
    statusPresent: "सक्रिय",
    statusAbsent: "अनुपस्थित",
    statusCancelled: "निरस्त (Cancelled)",
    statusActive: "सक्रिय (Active)",
    statusActiveAxis: "सक्रिय अक्ष",
    statusClear: "मुक्त",
    statusDetected: "पाया गया",
    vargasTitle: "कुण्डली वर्गात्मक चार्ट सत्यापन मार्गदर्शिका",
    vargasSubtitle: "वर्ग प्रणाली सत्यापन",
    vargasTableSource: "स्रोत: शास्त्रीय प्रमाणिक सत्यापन दिशा-निर्देश",
    vargasTableIntro: "जबकि प्राथमिक जन्म कुंडली (D1) बीज ऊर्जा क्षमता और तत्काल जीवन स्थितियों को रेखांकित करती है, वैदिक ज्योतिष विभिन्न ग्रहों के संयोजन और दोषों की संरचनात्मक गंभीरता या निरस्तीकरण को क्रॉस-चेक करने, पुष्टि करने और निर्धारित करने के लिए उच्च-सटीकता वाले विभाजनकारी हार्मोनिक चार्ट (वर्गों) का उपयोग करता है।",
    vargasThDosha: "दोष / पीड़ित",
    vargasThPrimary: "प्राथमिक चार्ट",
    vargasThHarmonic: "सत्यापन के लिए प्रयुक्त अतिरिक्त / वर्ग चार्ट",
    vargasThProtocol: "सत्यापन प्रोटोकॉल",
  },
  bn: {
    cardsTitle: "জ্যোতিষীয় অডিট কার্ড",
    cardsSubtitle: "বৈদিক ডায়াগনস্টিক ডেক",
    vettingEngine: "শাস্ত্রীয় বৈদিক যাচাইকরণ ইঞ্জিন",
    tapToUnveil: "৩-স্তরের ডায়াগনস্টিক উন্মোচন করতে আলতো চাপুন",
    validationLive: "যাচাইকরণ ইঞ্জিন লাইভ",
    diagnosticEngine: "৩-স্তরের ডায়াগনস্টিক ইঞ্জিন",
    astro: "অ্যাস্ট্রো",
    classic: "ক্লাসিক",
    valid: "বৈধতা",
    primaryChart: "প্রাথমিক চার্ট ফোকাস",
    additionalCharts: "অতিরিক্ত চার্ট যাচাইকরণ",
    crossCheckedVerdict: "ক্রস-চেক করা রায়",
    tapToFlipBack: "কার্ড উল্টাতে আলতো চাপুন",
    layer1: "স্তর ১: উচ্চ-নির্ভুল পঞ্জিকা (Ephemeris)",
    layer2: "স্তর ২: শাস্ত্রীয় কানোনিকাল নিয়ম",
    layer3: "স্তর ৩: কড়া ক্রস-চেক রায়",
    mangalClass: "শ্রেণী: অগ্নি দোষ",
    sadesatiClass: "শ্রেণী: শনি গোচর চক্র",
    rahuketuClass: "শ্রেণী: কর্মিক নোড",
    kaalsarpClass: "শ্রেণী: নভস বেষ্টনী",
    pitruClass: "শ্রেণী: পিতৃ-কারক",
    guruchandalClass: "শ্রেণী: চণ্ডাল যোগ",
    kemadrumaClass: "শ্রেণী: মানসিক একাকীত্ব",
    shrapitClass: "শ্রেণী: কর্মিক স্থবিরতা",
    statusPresent: "বিদ্যমান",
    statusAbsent: "অনুপস্থিত",
    statusCancelled: "বাতিল (Cancelled)",
    statusActive: "সक्रिय (Active)",
    statusActiveAxis: "সক্রিয় অক্ষ",
    statusClear: "মুক্ত",
    statusDetected: "শনাক্ত",
    vargasTitle: "কুন্ডলী বিভাগীয় চার্ট যাচাইকরণ নির্দেশিকা",
    vargasSubtitle: "বর্গ সিস্টেম যাচাইকরণ",
    vargasTableSource: "উৎস: শাস্ত্রীয় কানোনিকাল যাচাইকরণ নির্দেশিকা",
    vargasTableIntro: "যদিও প্রাথমিক জন্ম কুণ্ডলী (D1) মূল শক্তি সম্ভাবনা এবং তাত্ক্ষণিক জীবনের পরিস্থিতি রূপরেখা দেয়, বৈদিক জ্যোতিষশাস্ত্র বিভিন্ন গ্রহের সংমিশ্রণ এবং দোষগুলির তীব্রতা বা বাতিলকরণ ক্রস-চেক করতে এবং নির্ধারণ করতে উচ্চ-নির্ভুল বিভাগীয় হারমোনিক চার্ট (বর্গ) ব্যবহার করে।",
    vargasThDosha: "দোষ / পীড়িত",
    vargasThPrimary: "প্রাথমিক চার্ট",
    vargasThHarmonic: "যাচাইকরণের জন্য অতিরিক্ত চার্ট",
    vargasThProtocol: "যাচাইকরণ প্রোটোকল",
  },
  mr: {
    cardsTitle: "ज्योतिषीय लेखापरीक्षण कार्ड",
    cardsSubtitle: "वैदिक निदान डेक",
    vettingEngine: "शास्त्रीय वैदिक पडताळणी इंजिन",
    tapToUnveil: "३-स्तरीय निदान पाहण्यासाठी टॅप करा",
    validationLive: "पडताळणी इंजिन कार्यरत",
    diagnosticEngine: "३-स्तरीय निदान इंजिन",
    astro: "अॅस्ट्रो",
    classic: "क्लासिक",
    valid: "पडताळणी",
    primaryChart: "प्राथमिक चार्ट फोकस",
    additionalCharts: "अतिरिक्त चार्ट पडताळणी",
    crossCheckedVerdict: "क्रॉस-चेक केलेला निर्णय",
    tapToFlipBack: "कार्ड मागे पलटवण्यासाठी टॅप करा",
    layer1: "स्तर १: अचूक पंचांग (Ephemeris)",
    layer2: "स्तर २: शास्त्रीय नियम",
    layer3: "स्तर ३: क्रॉस-चेक केलेला निर्णय",
    mangalClass: "वर्ग: अग्नी दोष",
    sadesatiClass: "वर्ग: शनि गोचर चक्र",
    rahuketuClass: "वर्ग: कर्मात्मक नोड्स",
    kaalsarpClass: "वर्ग: नभस वेढणे",
    pitruClass: "वर्ग: पितृ-कारक",
    guruchandalClass: "वर्ग: चांडाल संरेखन",
    kemadrumaClass: "वर्ग: चंद्र एकाकीपणा",
    shrapitClass: "वर्ग: कर्मात्मक गोठणे",
    statusPresent: "सक्रिय",
    statusAbsent: "अनुपस्थित",
    statusCancelled: "रद्द (Cancelled)",
    statusActive: "सक्रिय (Active)",
    statusActiveAxis: "सक्रिय अक्ष",
    statusClear: "मुक्त",
    statusDetected: "आढळले",
    vargasTitle: "कुंडली विभागीय चार्ट पडताळणी मार्गदर्शिका",
    vargasSubtitle: "वर्ग प्रणाली पडताळणी",
    vargasTableSource: "स्रोत: शास्त्रीय प्रमाणिक पडताळणी मार्गदर्शक तत्त्वे",
    vargasTableIntro: "प्राथमिक जन्म कुंडली (D1) ऊर्जा क्षमता आणि तात्काळ जीवनाची परिस्थिती दर्शवते, तर वैदिक ज्योतिष विविध ग्रहांचे योग आणि दोषांची तीव्रता किंवा रद्दता तपासण्यासाठी उच्च-अचूकतेच्या विभागीय हार्मोनिक चार्टचा (वर्गांचा) वापर करते.",
    vargasThDosha: "दोष / पीडा",
    vargasThPrimary: "प्राथमिक चार्ट",
    vargasThHarmonic: "पडताळणीसाठी वापरलेले अतिरिक्त / वर्ग चार्ट",
    vargasThProtocol: "पडताळणीनियम",
  },
  gu: {
    cardsTitle: "જ્યોતિષીય ઓડિટ કાર્ડ્સ",
    cardsSubtitle: "વૈદિક નિદાન ડેક",
    vettingEngine: "શાસ્ત્રીય વૈદિક ચકાસણી એન્જિન",
    tapToUnveil: "૩-સ્તરીય નિદાન જોવા માટે ટેપ કરો",
    validationLive: "ચકાસણી એન્જિન કાર્યરત",
    diagnosticEngine: "૩-સ્તરીય નિદાન એન્જિન",
    astro: "એસ્ટ્રો",
    classic: "ક્લાસિક",
    valid: "ચકાસણી",
    primaryChart: "પ્રાથમિક ચાર્ટ ફોકસ",
    additionalCharts: "વધારાની ચાર્ટ ચકાસણી",
    crossCheckedVerdict: "ક્રોસ-ચેક કરેલો નિર્ણય",
    tapToFlipBack: "કાર્ડ પાછું વાળવા માટે ટેપ કરો",
    layer1: "સ્તર ૧: ઉચ્ચ-ચોક્કસ પંચાંગ (Ephemeris)",
    layer2: "સ્તર ૨: શાસ્ત્રીય નિયમો",
    layer3: "સ્તર ૩: ક્રોસ-ચેક કરેલો નિર્ણય",
    mangalClass: "વર્ગ: અગ્નિ દોષ",
    sadesatiClass: "વર્ગ: શનિ ગોચર ચક્ર",
    rahuketuClass: "વર્ગ: કર્મિક નોડ્સ",
    kaalsarpClass: "વર્ગ: નભસ ઘેરાવ",
    pitruClass: "વર્ગ: પિતૃ-કારક",
    guruchandalClass: "વર્ગ: ચાંડાલ યુતિ",
    kemadrumaClass: "વર્ગ: ચંદ્ર એકાકીપણું",
    shrapitClass: "વર્ગ: કર્મિક અવરોધ",
    statusPresent: "સક્રિય",
    statusAbsent: "ગેરહાજર",
    statusCancelled: "રદ (Cancelled)",
    statusActive: "સક્રિય (Active)",
    statusActiveAxis: "સક્રિય ધરી",
    statusClear: "મુક્ત",
    statusDetected: "મળી આવ્યું",
    vargasTitle: "કુંડળી વિભાગીય ચાર્ટ ચકાસણી માર્ગદર્શિકા",
    vargasSubtitle: "વર્ગ પ્રણાલી ચકાસણી",
    vargasTableSource: "સ્રોત: શાસ્ત્રીય પ્રમાણિક ચકાસણી માર્ગદર્શિકા",
    vargasTableIntro: "જ્યારે પ્રાથમિક જન્મ કુંડળી (D1) ઉર્જા સંભાવના અને તાત્કાલિક જીવન પરિસ્થિતિઓ દર્શાવે છે, ત્યારે વૈદિક જ્યોતિષ વિવિધ ગ્રહોના યોગ અને દોષોની તીવ્રતા અથવા રદબાતલ ચકાસવા માટે ઉચ્চ-ચોકસાઇવાળા વિભાગીય હાર્મોનિક ચાર્ટ્સ (વર્ગો) નો ઉપયોગ કરે છે.",
    vargasThDosha: "દોષ / પીડા",
    vargasThPrimary: "પ્રાથમિક ચાર્ટ",
    vargasThHarmonic: "ચકાસણી માટે વપરાતા વધારાના ચાર્ટ્સ",
    vargasThProtocol: "ચકાસણી પ્રોટોકોલ",
  }
};

interface VargasRow {
  dosha: string;
  primary: string;
  harmonic: string;
  protocol: string;
}

function getVargasRows(lang: string): VargasRow[] {
  switch (lang) {
    case "hi":
      return [
        { dosha: "मङ्गल (कुज) दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 विवाह और साथी के भाव संरेखण पर वास्तविक शारीरिक और मानसिक प्रभाव की पुष्टि करता है।" },
        { dosha: "काल सर्प दोष", primary: "D1", harmonic: "कोई नहीं", protocol: "D1 की 180° राहु-केतु अर्धगोलाकार सीमाओं के भीतर कड़ाई से सत्यापित किया जाता है।" },
        { dosha: "पितृ दोष", primary: "D1", harmonic: "D9 और D12 (द्वादशांश)", protocol: "D12 (पूर्वज/माता-पिता वंश) अनसुलझे वंश पैटर्न की व्याख्या को मजबूत करता है।" },
        { dosha: "ग्रहण दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 ग्रहण वाले प्रकाशमान ग्रह की अंतर्निहित शक्ति, आध्यात्मिक वजन और लचीलेपन का आकलन करता है।" },
        { dosha: "गुरु चांडाल दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 पुष्टि करता है कि क्या बृहस्पति-नोड संलयन एक छाया के रूप में बना रहता है या हल/उच्च हो गया है।" },
        { dosha: "शापित दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 आत्मा के पथ पर शनि-राहु के संरचनात्मक अवरोध की गंभीरता का मूल्यांकन करता है।" },
        { dosha: "केमद्रुम दोष", primary: "D1", harmonic: "दुर्लभ रूप से D9", protocol: "केंद्रों से विभागीय निरस्तीकरण (भंग) की पुष्टि कभी-कभी D9 में की जा सकती है।" },
        { dosha: "दरिद्र योग / दोष", primary: "D1", harmonic: "D2 (होरा)", protocol: "D2 (होरा) अंतिम भौतिक संसाधनों और धन स्थिरता के लिए प्राथमिक सत्यापन के रूप में कार्य करता है।" },
        { dosha: "विवाह संबंधी दोष", primary: "D1", harmonic: "D9 आवश्यक है", protocol: "D9 विवाह के वास्तविक, दीर्घकालिक सामंजस्य, साथी की गतिशीलता और दीर्घायु का विश्लेषण करने के लिए आवश्यक है।" },
        { dosha: "बच्चों से संबंधित दोष", primary: "D1", harmonic: "D7 (सप्तांश)", protocol: "D7 का विश्लेषण बच्चों के कल्याण, रचनात्मक विरासत और संतान संबंधी आशीर्वाद के लिए किया जाता है।" },
        { dosha: "करियर संबंधी समस्याएं", primary: "D1", harmonic: "D10 (दशांश)", protocol: "D10 व्यावसायिक बाधाओं, करियर बदलाव और सामाजिक प्रभाव को सत्यापित करता है।" },
        { dosha: "स्वास्थ्य संबंधी समस्याएं", primary: "D1", harmonic: "D6 (षष्ठांश)", protocol: "D6 शारीरिक कमजोरियों, दीर्घायु/संकट ट्रिगर्स और उपचार प्रोफाइल की पुष्टि करता है।" },
        { dosha: "आध्यात्मिक/कर्म संबंधी समस्याएं", primary: "D1", harmonic: "उन्नत विश्लेषण में D20 और D60", protocol: "D20 भक्ति की प्रगति को ट्रैक करता है, जबकि D60 में उन्नत, अत्यधिक उच्च-रिज़ॉल्यूशन वाली कर्मात्मक फाइलें होती हैं।" }
      ];
    case "bn":
      return [
        { dosha: "মঙ্গলা (কুজ) দোষ", primary: "D1", harmonic: "D9 (নবাংশ)", protocol: "D9 বিবাহ এবং অংশীদারের ভাব বিন্যাসের ওপর প্রকৃত শারীরিক ও মানসিক প্রভাব নিশ্চিত করে।" },
        { dosha: "কাল সর্প দোষ", primary: "D1", harmonic: "নেই", protocol: "D1 এর ১৮০° রাহু-কেতু অর্ধবৃত্তাকার সীমানার মধ্যে কঠোরভাবে যাচাই করা হয়।" },
        { dosha: "পিতৃ দোষ", primary: "D1", harmonic: "D9 এবং D12 (দ্বাদশাংশ)", protocol: "D12 (পূর্বপুরুষ/পিতা-মাতার বংশধারা) অমীমাংসিত বংশধারার প্যাটার্নের ব্যাখ্যাকে শক্তিশালী করে।" },
        { dosha: "গ্রহণ দোষ", primary: "D1", harmonic: "D9 (নবাংশ)", protocol: "D9 গ্রহিত লুমিনারির অন্তর্নিহিত শক্তি, আধ্যাত্মিক ওজন এবং সহনশীলতা মূল্যায়ন করে।" },
        { dosha: "গুরু চণ্ডাল দোষ", primary: "D1", harmonic: "D9 (নবাংশ)", protocol: "D9 নিশ্চিত করে যে বৃহস্পতি-নোডের সংযোগটি একটি ছায়া হিসাবে অবিরত রয়েছে নাকি এটি সমাধান/তুঙ্গ হয়েছে।" },
        { dosha: "শাপিত দোষ", primary: "D1", harmonic: "D9 (নবাংশ)", protocol: "D9 আত্মার পথে শনি-রাহুর কাঠামোগত স্থবিরতার তীব্রতা মূল্যায়ন করে।" },
        { dosha: "কেমদ্রুম দোষ", primary: "D1", harmonic: "খুব কমই D9", protocol: "কোণ বা কেন্দ্র থেকে বিভাগীয় বাতিলকরণ (ভঙ্গ) মাঝেমধ্যে D9 এ নিশ্চিত করা যেতে পারে।" },
        { dosha: "দারিদ্র্য যোগ / দোষ", primary: "D1", harmonic: "D2 (হোর)", protocol: "D2 (হোর) চূড়ান্ত উপাদান সম্পদ এবং সম্পদের স্থিতিশীলতার জন্য প্রাথমিক বৈধতা হিসাবে কাজ করে।" },
        { dosha: "বিবাহ সংক্রান্ত দোষ", primary: "D1", harmonic: "D9 অপরিহার্য", protocol: "বিবাহের প্রকৃত, দীর্ঘমেয়াদী সম্প্রীতি, অংশীদার গতিশীলতা এবং দীর্ঘায়ু বিশ্লেষণের জন্য D9 অপরিহার্য।" },
        { dosha: "সন্তান সংক্রান্ত দোষ", primary: "D1", harmonic: "D7 (সপ্তাংশ)", protocol: "সন্তানদের কল্যাণ, সৃজনশীল উত্তরাধিকার এবং বংশধর সংক্রান্ত আশীর্বাদের জন্য D7 বিশ্লেষণ করা হয়।" },
        { dosha: "কর্মজীবন সংক্রান্ত বাধা", primary: "D1", harmonic: "D10 (দশমাংশ)", protocol: "D10 পেশাদার বাধা, ক্যারিয়ার পরিবর্তন এবং সামাজিক প্রভাব যাচাই করে।" },
        { dosha: "স্বাস্থ্য সংক্রান্ত পীড়া", primary: "D1", harmonic: "D6 (ষষ্ঠাংশ)", protocol: "D6 শারীরিক দুর্বলতা, দীর্ঘায়ু/সংকট ট্রিগার এবং নিরাময় প্রোফাইল যাচাই করে।" },
        { dosha: "আধ্যাত্মিক/কৰ্মিক পীড়া", primary: "D1", harmonic: "উন্নত বিশ্লেষণে D20 এবং D60", protocol: "D20 ভক্তিমূলক অগ্রগতি ট্র্যাক করে, যখন D60-এ উন্নত, অতি-উচ্চ-রেজোলিউশন কর্মিক ফাইল থাকে।" }
      ];
    case "mr":
      return [
        { dosha: "मंगळ (कुज) दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 लग्नावरील आणि जोडीदाराच्या स्थान संरेखनावरील वास्तविक शारीरिक आणि मानसिक प्रभावाची पडताळणी करते." },
        { dosha: "काल सर्प दोष", primary: "D1", harmonic: "काही नाही", protocol: "D1 च्या १८०° राहु-केतूच्या गोलार्ध सीमांमध्ये कडक पडताळणी केली जाते." },
        { dosha: "पितृ दोष", primary: "D1", harmonic: "D9 आणि D12 (द्वादशांश)", protocol: "D12 (पूर्वज/पालक वंश) न सुटलेल्या वंशावळीच्या नमुन्यांचे स्पष्टीकरण मजबूत करते." },
        { dosha: "ग्रहण दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 ग्रसलेल्या ग्रहाची अंतर्निहित ताकद, आध्यात्मिक वजन आणि लवचिकता तपासते." },
        { dosha: "गुरु चांडाल दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 पडताळणी करते की गुरु-नोड युती एक सावली म्हणून कायम आहे की ती सुटली/उच्च झाली आहे." },
        { dosha: "शापित दोष", primary: "D1", harmonic: "D9 (नवांश)", protocol: "D9 आत्म्याच्या मार्गावर शनि-राहूच्या रचनात्मक गोठण्याची तीव्रता मूल्यमापन करते." },
        { dosha: "केमद्रुम दोष", primary: "D1", harmonic: "क्वचितच D9", protocol: "केंद्रांमधून विभागीय निरसन (भंग) कधीकधी D9 मध्ये निश्चित केले जाऊ शकते." },
        { dosha: "दरिद्र योग / दोष", primary: "D1", harmonic: "D2 (होरा)", protocol: "D2 (होरा) अंतिम भौतिक संसाधने आणि संपत्तीच्या स्थिरतेसाठी प्राथमिक पडताळणी म्हणून काम करते." },
        { dosha: "लग्न संबंधित दोष", primary: "D1", harmonic: "D9 आवश्यक आहे", protocol: "लग्नाचे वास्तविक, दीर्घकालीन सामंजस्य, जोडीदाराची गतिशीलता आणि दीर्घायुष्य विश्लेषणासाठी D9 आवश्यक आहे." },
        { dosha: "मुलांशी संबंधित दोष", primary: "D1", harmonic: "D7 (सप्तांश)", protocol: "मुलांचे कल्याण, सर्जनशील वारसा आणि संततीशी संबंधित आशीर्वादांसाठी D7 चे विश्लेषण केले जाते." },
        { dosha: "करिअर संबंधित अडथळे", primary: "D1", harmonic: "D10 (दशांश)", protocol: "D10 व्यावसायिक अडथळे, करिअरमधील बदल आणि सामाजिक प्रभाव पडताळून पाहते." },
        { dosha: "आरोग्य संबंधित अडथळे", primary: "D1", harmonic: "D6 (षष्ठांश)", protocol: "D6 शारीरिक असुरक्षितता, दीर्घायुष्य/संकट ट्रिगर्स आणि बरे होण्याचे प्रोफाइल पडताळते." },
        { dosha: "आध्यात्मिक/कर्म संबंधित अडथळे", primary: "D1", harmonic: "प्रगत विश्लेषणामध्ये D20 आणि D60", protocol: "D20 भक्तीच्या प्रगतीचा मागोवा घेते, तर D60 मध्ये प्रगत, अति-उच्च-रिझोल्यूशन कर्माच्या फाइल्स असतात." }
      ];
    case "gu":
      return [
        { dosha: "મંગળ (કુજ) દોષ", primary: "D1", harmonic: "D9 (નવાંશ)", protocol: "D9 લગ્ન અને ભાગીદારના ભાવ સંરેખણ પર વાસ્તવિક શારીરિક અને માનસિક પ્રભાવની પુષ્ટિ કરે છે." },
        { dosha: "કાલ સર્પ દોષ", primary: "D1", harmonic: "કોઈ નહીં", protocol: "D1 ની ૧૮૦° રાહુ-કેતુની અર્ધગોળાકાર સીમાઓ વચ્ચે સખત રીતે ચકાસવામાં આવે છે." },
        { dosha: "પિતૃ દોષ", primary: "D1", harmonic: "D9 અને D12 (દ્વાદશાંશ)", protocol: "D12 (પૂર્વજ/માતા-પિતાની વંશાવળી) વણઉકેલાયેલી વંશાવળી પદ્ધતિઓની વ્યાખ્યા મજબૂત કરે છે." },
        { dosha: "ગ્રહણ દોષ", primary: "D1", harmonic: "D9 (નવાંશ)", protocol: "D9 પીડિત ગ્રહની અંતર્ગત શક્તિ, આધ્યાત્મિક વજન અને સ્થિતિસ્થાપકતાનું મૂલ્યાંકન કરે છે." },
        { dosha: "ગુરુ ચાંડાલ દોષ", primary: "D1", harmonic: "D9 (નવાંશ)", protocol: "D9 પુષ્ટિ કરે છે કે ગુરુ-નોડ યુતિ છાયા તરીકે ચાલુ રહે છે કે પછી તે ઉકેલાઈ/ઉચ્ચ થઈ ગઈ છે." },
        { dosha: "શાપિત દોષ", primary: "D1", harmonic: "D9 (નવાંશ)", protocol: "D9 આત્માના માર્ગ પર શનિ-રાહુના માળખાકીય અવરોધની તીવ્રતાનું મૂલ્યાંકન કરે છે." },
        { dosha: "કેમદ્રુમ દોષ", primary: "D1", harmonic: "ભાગ્યે જ D9", protocol: "કેન્દ્રોમાંથી વિભાગીય નિરસન (ભંગ) ક્યારેક D9 માં પુષ્ટિ કરી શકાય છે." },
        { dosha: "દરિદ્ર યોગ / દોષ", primary: "D1", harmonic: "D2 (હોરા)", protocol: "D2 (હોરા) અંતિમ ભૌતિક સંસાધનો અને સંપત્તિની સ્થિરતા માટે પ્રાથમિક ચકાસણી તરીકે કામ કરે છે." },
        { dosha: "લગ્ન સંબંધિત દોષો", primary: "D1", harmonic: "D9 આવશ્યક છે", protocol: "લગ્નની વાસ્તવિક, લાંબા ગાળાની સંવાદિતા, ભાગીદારની ગતિશીલતા અને આયુષ્યના વિશ્લેષણ માટે D9 આવશ્યક છે." },
        { dosha: "બાળકો સંબંધિત દોષો", primary: "D1", harmonic: "D7 (સપ્તાંશ)", protocol: "બાળકોના કલ્યાણ, સર્જનાત્મક વારસો અને પ્રોગતિ સંબંધિત આશીર્વાદો માટે D7 નું વિશ્લેષણ કરવામાં આવે છે." },
        { dosha: "કારકિર્દી સંબંધિત પીડા", primary: "D1", harmonic: "D10 (દશાંશ)", protocol: "D10 વ્યાવસાયિક અવરોધો, કારકિર્દી પરિવર્તન અને સામાજिक પ્રભાવને ચકાસે છે." },
        { dosha: "આરોગ્ય સંબંધિત પીડા", primary: "D1", harmonic: "D6 (ષષ્ઠાંશ)", protocol: "D6 શારીરિક નબળાઈઓ, આયુષ્ય/કટોકટીના ટ્રિગર્સ અને હીલિંગ પ્રોફાઇલ્સની પુષ્ટિ કરે છે." },
        { dosha: "આધ્યાત્મિક/કર્મિક પીડા", primary: "D1", harmonic: "અદ્યતન વિશ્લેષણમાં D20 અને D60", protocol: "D20 ભક્તિની પ્રગતિને ટ્રેક કરે છે, જ્યારે D60 માં અદ્યતન, અલ્ટ્રા-હાઇ-રિઝોલ્યુશન કર્મિક ફાઇલો હોય છે." }
      ];
    default:
      return [
        { dosha: "Mangal (Kuja) Dosha", primary: "D1", harmonic: "D9 (Navamsha)", protocol: "D9 confirms the actual physical and mental impact on marriage and partner house alignment." },
        { dosha: "Kaal Sarp Dosha", primary: "D1", harmonic: "None", protocol: "Strictly verified within the 180° Rahu-Ketu hemispherical boundaries of D1." },
        { dosha: "Pitru Dosha", primary: "D1", harmonic: "D9 & D12 (Dwadasamsa)", protocol: "D12 (ancestor/parent lineage) strengthens interpretation of unresolved lineage patterns." },
        { dosha: "Grahan Dosha", primary: "D1", harmonic: "D9 (Navamsha)", protocol: "D9 assesses the underlying strength, spiritual weight, and resilience of the eclipsed luminary." },
        { dosha: "Guru Chandal Dosha", primary: "D1", harmonic: "D9 (Navamsha)", protocol: "D9 confirms whether the Jupiter-Node fusion persists as a shadow or is resolved/exalted." },
        { dosha: "Shrapit Dosha", primary: "D1", harmonic: "D9 (Navamsha)", protocol: "D9 evaluates the severity of Saturn-Rahu's structural freeze on the soul's path." },
        { dosha: "Kemadruma Dosha", primary: "D1", harmonic: "Rarely D9", protocol: "Divisional cancellation (Bhanga) from angles can occasionally be confirmed in D9." },
        { dosha: "Daridra Yoga / Dosha", primary: "D1", harmonic: "D2 (Hora)", protocol: "D2 (Hora) acts as the primary validation for ultimate material resources and wealth stability." },
        { dosha: "Marriage-related Doshas", primary: "D1", harmonic: "D9 is essential", protocol: "D9 is essential to analyze the real, long-term harmony, partner dynamics, and longevity of marriage." },
        { dosha: "Child-related Doshas", primary: "D1", harmonic: "D7 (Saptamsa)", protocol: "D7 is analysed for children's well-being, creative legacy, and progeny-related blessings." },
        { dosha: "Career-related afflictions", primary: "D1", harmonic: "D10 (Dashamsa)", protocol: "D10 validates professional obstacles, career shifts, and societal impact." },
        { dosha: "Health-related afflictions", primary: "D1", harmonic: "D6 (Shashthamsa)", protocol: "D6 verifies physical vulnerabilities, longevity/crisis triggers, and healing profiles." },
        { dosha: "Spiritual/Karmic afflictions", primary: "D1", harmonic: "D20 and D60 in advanced analysis", protocol: "D20 tracks devotional progress, while D60 contains advanced, ultra-high-resolution karmic files." }
      ];
  }
}

interface CosmicDoshaFlashcardsProps {
  kundaliResult: any;
  name: string;
  t: (key: string) => string;
  language: string;
}

export default function CosmicDoshaFlashcards({
  kundaliResult,
  name,
  t,
  language
}: CosmicDoshaFlashcardsProps) {
  // 1. Core States
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({
    mangal: false,
    sadesati: false,
    rahuketu: false,
    kaalsarp: false,
    pitru: false,
    guruchandal: false,
    kemadruma: false,
    shrapit: false,
  });

  // State to manage active tabs on the back of each flashcard
  const [cardTabs, setCardTabs] = useState<Record<string, "astro" | "classic" | "validation">>({
    mangal: "validation",
    sadesati: "validation",
    rahuketu: "validation",
    kaalsarp: "validation",
    pitru: "validation",
    guruchandal: "validation",
    kemadruma: "validation",
    shrapit: "validation",
  });

  const toggleFlip = (cardId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const setCardTab = (cardId: string, tab: "astro" | "classic" | "validation", e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card flip when clicking tabs
    setCardTabs(prev => ({
      ...prev,
      [cardId]: tab
    }));
  };

  const lex = (key: string) => {
    return t(key) || key;
  };

  // If no result is loaded, do not render
  if (!kundaliResult) return null;

  const bMangalReport = kundaliResult.bMangalReport || {
    status: "Absent",
    severity: "None",
    marsRashi: "Unknown",
    houseD1: 1,
    houseChandra: 1,
    houseShukra: 1,
    isD1Manglik: false,
    isChandraManglik: false,
    isShukraManglik: false,
    cancellations: [],
    reductions: [],
    marsDegreeInSign: 0
  };

  const isMangalAbsent = bMangalReport.status === "Absent";
  const isMangalCancelled = bMangalReport.status === "Cancelled";

  // Traditional Sanskrit and English Bhavas Mapping (Matching traditional Vedic architecture)
  const bhavasData: Record<number, {
    sanskritName: string;
    aspects: string;
    description: string;
    bodyPart: string;
    symbol: React.ReactNode;
  }> = {
    1: {
      sanskritName: "Tanu Bhava",
      aspects: "Body, Physique, Outlook",
      description: "Represents self-identity, physique, life force, ego, temperament, appearance, and physical constitution.",
      bodyPart: "Head, Face",
      symbol: <User className="w-5 h-5 text-amber-400" />
    },
    2: {
      sanskritName: "Dhana Bhava",
      aspects: "Money, Job, Family",
      description: "Represents accumulated wealth, early childhood family, speech, primary education, facial assets, and financial resourcefulness.",
      bodyPart: "Throat, Right Eye",
      symbol: <DollarSign className="w-5 h-5 text-emerald-400" />
    },
    3: {
      sanskritName: "Sahaja Bhava",
      aspects: "Brother, Sister, Adventure",
      description: "Represents younger siblings, courage, communications, short travels, artistic skills, and mental strength.",
      bodyPart: "Arms, Shoulders, Ears",
      symbol: <Compass className="w-5 h-5 text-indigo-400" />
    },
    4: {
      sanskritName: "Bandhu Bhava",
      aspects: "Mother, Home, Vehicle, Property",
      description: "Represents motherly comfort, childhood home, vehicles, land, real estate, domestic peace, and emotional foundation.",
      bodyPart: "Chest, Lungs, Heart",
      symbol: <Home className="w-5 h-5 text-cyan-400" />
    },
    5: {
      sanskritName: "Putra Bhava",
      aspects: "Study, Child, Wisdom",
      description: "Represents higher intelligence, children, creativity, past-life merits (Purvapunya), romance, speculation, and academic depth.",
      bodyPart: "Stomach, Upper Abdomen",
      symbol: <Sparkles className="w-5 h-5 text-pink-400" />
    },
    6: {
      sanskritName: "Ari Bhava",
      aspects: "Enemies, Disease, Debts",
      description: "Represents daily routines, services, competitive battles, legal disputes, debts, and physical health obstacles.",
      bodyPart: "Intestines, Lower Abdomen",
      symbol: <ShieldAlert className="w-5 h-5 text-red-400" />
    },
    7: {
      sanskritName: "Yuvati Bhava",
      aspects: "Spouse, Friends, Partnership",
      description: "Represents marriage, life partner, business partnerships, legal bonds, public interactions, and relational mirrors.",
      bodyPart: "Kidneys, Lower Back",
      symbol: <Heart className="w-5 h-5 text-rose-400" />
    },
    8: {
      sanskritName: "Randhra Bhava",
      aspects: "Age, Longevity, Transformation",
      description: "Represents lifespan, hidden sciences, mysticism, sudden losses or gains, taxes, delays, and spiritual transformations.",
      bodyPart: "Reproductive Organs",
      symbol: <Activity className="w-5 h-5 text-purple-400" />
    },
    9: {
      sanskritName: "Dharma Bhava",
      aspects: "Luck, Religion, Philosophy",
      description: "Represents divine grace, good fortune (Bhagya), gurus, father figure, spiritual journeys, and higher philosophy.",
      bodyPart: "Thighs, Hips",
      symbol: <Award className="w-5 h-5 text-yellow-400" />
    },
    10: {
      sanskritName: "Karma Bhava",
      aspects: "Father, Work, Profession",
      description: "Represents career achievement, social status, reputation, relationship with authority, and professional mission in life.",
      bodyPart: "Knees, Joints",
      symbol: <Briefcase className="w-5 h-5 text-teal-400" />
    },
    11: {
      sanskritName: "Labha Bhava",
      aspects: "Benefits, Cashflow, Friendships",
      description: "Represents financial profits, elder siblings, social networks, realization of desires, and extra income avenues.",
      bodyPart: "Shins, Ankles",
      symbol: <TrendingUp className="w-5 h-5 text-green-400" />
    },
    12: {
      sanskritName: "Vyaya Bhava",
      aspects: "Expenses, Land, Foreign Trips",
      description: "Represents expenses, isolation, foreign land settlement, hospitals, bed comforts, dream realms, and spiritual liberation.",
      bodyPart: "Feet, Left Eye",
      symbol: <Info className="w-5 h-5 text-orange-400" />
    }
  };

  // Helper to extract occupants from the D1 chart generated server-side
  const getHouseOccupants = (houseNum: number) => {
    if (!kundaliResult || !kundaliResult.boyChart || !kundaliResult.boyChart.houses) return [];
    const houseData = kundaliResult.boyChart.houses.find((h: any) => h.houseNumber === houseNum);
    return houseData ? houseData.planets : [];
  };

  // Helper to format planet name with elegant astronomical labels
  const getPlanetSymbol = (pName: string) => {
    const symbolMap: Record<string, string> = {
      Sun: "☉ Su",
      Moon: "☽ Mo",
      Mars: "♂ Ma",
      Mercury: "☿ Me",
      Jupiter: "♃ Ju",
      Venus: "♀ Ve",
      Saturn: "♄ Sa",
      Rahu: "☊ Ra",
      Ketu: "☋ Ke",
      Asc: "Asc"
    };
    return symbolMap[pName] || pName;
  };

  // Check if any cosmic issue / dosha occupies the selected house
  const getHouseAlerts = (houseNum: number) => {
    const alerts: string[] = [];
    const occupants = getHouseOccupants(houseNum);
    const hasMars = occupants.some(o => o.name === "Mars");
    const hasSaturn = occupants.some(o => o.name === "Saturn");
    const hasRahu = occupants.some(o => o.name === "Rahu");
    const hasKetu = occupants.some(o => o.name === "Ketu");

    if (hasMars && [1, 4, 7, 8, 12].includes(houseNum)) {
      alerts.push(`Mangal Dosha Alignment: Mars resides in House ${houseNum}, introducing high-energy heat into relationship sectors.`);
    }
    if (hasMars && houseNum === 2) {
      alerts.push(`Partial Mangal Dosha: Mars placed in the 2nd house (speech and primary family) per regional custom.`);
    }
    if (kundaliResult.bSadeSati && hasSaturn && [12, 1, 2].includes(houseNum)) {
      alerts.push("Shani Sade Sati Transit: Saturn is currently moving within houses immediately adjacent to your Natal Moon.");
    }
    if (hasRahu || hasKetu) {
      if ([1, 7].includes(houseNum)) {
        alerts.push(`Active Nodal Polarity: Rahu/Ketu resides in House ${houseNum}, demanding evolutionary balance between self and partner.`);
      }
    }
    return alerts;
  };

  // Auto-select a house on mount if there's an active dosha, prioritizing House 7 or Mars's house
  useEffect(() => {
    if (bMangalReport && bMangalReport.houseD1) {
      setSelectedHouse(bMangalReport.houseD1);
    } else {
      setSelectedHouse(1);
    }
  }, [kundaliResult]);

  const bSadeSati = kundaliResult.bSadeSati || false;
  const bRahuKetu = kundaliResult.bRahuKetu || false;
  const kaalSarpReport = kundaliResult.kaalSarpReport || { present: false, type: "None", explanation: "" };
  const extraDoshas = kundaliResult.extraDoshas || {
    pitru: { status: "Absent", reasons: [], cancellations: [] },
    guruChandal: { status: "Absent", reasons: [], cancellations: [] },
    kemadruma: { status: "Absent", reasons: [], cancellations: [] },
    shrapit: { status: "Absent", reasons: [], cancellations: [] }
  };

  // Configuration for 8 beautifully animated, high-precision, non-overlapping diagnostic flashcards
  const cardsData = [
    {
      id: "mangal",
      title: "Manglik Audit",
      subtitle: "Mars Fire Formula",
      status: bMangalReport.status,
      isCritical: bMangalReport.status === "Present" || bMangalReport.status === "Partial",
      metaLabel: `Mars House: ${bMangalReport.houseD1 || "Unknown"}`,
      metaClass: "Class: Agni Dosha",
      primaryChart: "D1",
      additionalCharts: "D9 for confirmation and marital impact",
      icon: <Zap className="w-5 h-5" />,
      frontDescription: bMangalReport.status === "Present" 
        ? `Mars resides in House ${bMangalReport.houseD1}, producing intense heat in matrimonial and relational spaces. Classical guidelines recommend finding a partner with similar Mars placement to achieve natural energetic containment.`
        : bMangalReport.status === "Cancelled"
          ? `Mars is in House ${bMangalReport.houseD1} but your Mangal Dosha is fully CANCELLED due to strong neutralizing planetary alignments (e.g., Jupiter's aspect or auspicious zodiac sign placement).`
          : `No significant Mangal Dosha is present in your chart. Mars resides in House ${bMangalReport.houseD1 || "Unknown"}, leaving your marriage and partner houses clear of Martian friction.`,
      astro: {
        content: `Mars high-precision coordinates: Sign index ${bMangalReport.marsRashi} with degree ${bMangalReport.marsDegreeInSign?.toFixed(2) || "0.00"}°. Mars is placed in House ${bMangalReport.houseD1} from Ascendant, House ${bMangalReport.houseChandra} from Moon, and House ${bMangalReport.houseShukra} from Venus.`
      },
      classic: {
        bullets: [
          { title: "Brihat Parashara (Chapter 26)", text: "If Mars is placed in 1st, 2nd, 4th, 7th, 8th, or 12th house from Lagna, Moon, or Venus, it creates Manglik influence." },
          { title: "Phaladeepika (Avastha Doctrine)", text: "An un-aspected Mars in these houses speeds up marital dynamics, requiring conscious adjustment." },
          { title: "Garga Samhita Exceptions", text: "Mars in own signs (Aries, Scorpio) or exaltation (Capricorn) overrides destructive heat, transmuting it to spiritual power." }
        ]
      },
      validation: {
        verdict: bMangalReport.status === "Cancelled" 
          ? `Cross-check confirms cancellation of Martian friction. Mitigating aspects: ${bMangalReport.cancellations?.join(", ") || "Strong Jupiter aspect or own sign placement"}.`
          : bMangalReport.status === "Present"
            ? "Validation engine confirms active Manglik influence. Suggesting matching with a similarly aspected chart to balance cosmic fire elements."
            : "Passed. No active Mangal Dosha is validated in the three-layer check."
      }
    },
    {
      id: "sadesati",
      title: "Shani Sade Sati",
      subtitle: "Saturn Transit Cycle",
      status: bSadeSati ? "Active" : "Absent",
      isCritical: bSadeSati,
      metaLabel: "Saturn Transit: Pisces",
      metaClass: "Class: Shani Mahadasha",
      primaryChart: "D1",
      additionalCharts: "None / Transit Over D1 Moon",
      icon: <Moon className="w-5 h-5" />,
      frontDescription: bSadeSati 
        ? "Saturn is transiting your Moon's adjacent signs, initiating the 7.5-year developmental cycle. This represents a period of structure, maturity, and foundational growth."
        : "Saturn is not currently transiting your Moon's adjacent houses. Your mental and emotional fields remain free from heavy Saturnian transit pressure.",
      astro: {
        content: `Transit Saturn resides at 11th Sign (Pisces). Natal Moon resides at sign index ${kundaliResult.boyRashi || "Unknown"}. Distance is calculated as ${(11 - (kundaliResult.boyRashiIndex || 0) + 12) % 12} signs.`
      },
      classic: {
        bullets: [
          { title: "Phaladeepika (Transit Chapter)", text: "Transit of Saturn over 12th, 1st, and 2nd houses from natal Moon is called Sade Sati." },
          { title: "Saravali (Karma Purification)", text: "Sade Sati purifies karmic debts by enforcing profound realism and structural discipline." }
        ]
      },
      validation: {
        verdict: bSadeSati 
          ? "Validation confirms Sade Sati is active. The native is advised to maintain stable daily routines and embrace patience."
          : "Sade Sati check is negative. Current Saturn transit is supportive."
      }
    },
    {
      id: "rahuketu",
      title: "Rahu-Ketu Axis",
      subtitle: "Lunar Nodal Nodes",
      status: bRahuKetu ? "Active Axis" : "Clear",
      isCritical: bRahuKetu,
      metaLabel: "Axis: 1st / 7th Houses",
      metaClass: "Class: Karmic Nodes",
      primaryChart: "D1",
      additionalCharts: "D9 is essential for marriage-related impact",
      icon: <Compass className="w-5 h-5" />,
      frontDescription: bRahuKetu 
        ? "Rahu and Ketu occupy your 1st and 7th houses, highlighting the axis of self and partner. This requires learning balance in relationship boundaries."
        : "Your lunar nodes occupy non-relational axes, allowing relationships to develop without extreme karmic polarity.",
      astro: {
        content: `Rahu is at ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.degree?.toFixed(2) || "0.00"}° and Ketu is exactly 180° opposite. Resides on the 1/7 Ascendant-Descendant axis.`
      },
      classic: {
        bullets: [
          { title: "Brihat Jataka (Node Placements)", text: "Nodes in 1st/7th houses create intensive focus on personal transformation vs partner expectations." }
        ]
      },
      validation: {
        verdict: bRahuKetu 
          ? "Active Nodal Axis verified. Focus on developing healthy individual boundaries within partnerships."
          : "Nodal Axis check: Safe. Relationships are free from tight nodal alignments."
      }
    },
    {
      id: "kaalsarp",
      title: "Kaal Sarp",
      subtitle: "Planetary Hemming Check",
      status: kaalSarpReport.present ? "Detected" : "Absent",
      isCritical: kaalSarpReport.present,
      metaLabel: "Hemming: Rahu-Ketu",
      metaClass: "Class: Nabhasa Hemming",
      primaryChart: "D1",
      additionalCharts: "None",
      icon: <Activity className="w-5 h-5" />,
      frontDescription: kaalSarpReport.present 
        ? "All major physical planets reside inside the planetary hemisphere hemmed by Rahu and Ketu, creating a Kaal Sarp layout. This channels extreme focus, raw determination, and massive energetic breakthroughs once self-discipline is prioritized."
        : "No Kaal Sarp configuration is present. Your physical planets are distributed harmoniously across both celestial hemispheres, facilitating easy energetic integration, balanced priorities, and stable flow.",
      astro: {
        content: `Rahu and Ketu signs: ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signName || "Unknown"} and ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Ketu")?.signName || "Unknown"}. All other planets reside within this 180-degree boundary.`
      },
      classic: {
        bullets: [
          { title: "Jataka Parijata (Nodal Axis)", text: "All planets hemmed within Rahu-Ketu binds physical energy into highly focused spiritual potential." }
        ]
      },
      validation: {
        verdict: kaalSarpReport.present 
          ? "Cross-check confirms active Kaal Sarp enclosing. No active physical planet lies outside the 180° Rahu-Ketu boundary."
          : "Cross-check verifies that physical planets flow freely outside of the Rahu-Ketu nodal axis."
      }
    },
    {
      id: "pitru",
      title: "Pitru Dosha",
      subtitle: "Ancestral Heritage Alignment",
      status: extraDoshas.pitru.status,
      isCritical: extraDoshas.pitru.status === "Present",
      metaLabel: "Key Planet: Sun",
      metaClass: "Class: Pitru-Karaka",
      primaryChart: "D1",
      additionalCharts: "D9 and D12 can strengthen interpretation",
      icon: <Shield className="w-5 h-5" />,
      frontDescription: extraDoshas.pitru.status === "Present"
        ? "Sun is under strong malefic influence or debilitated, representing unfulfilled ancestral karmic patterns. This invites you to respect your heritage and practice mindful responsibility."
        : extraDoshas.pitru.status === "Cancelled"
          ? "Ancestral lessons are present, but fully resolved/neutralized due to high-vibrational Jupiter aspecting the Sun."
          : "Sun is strong and well-aspected, indicating clear, supportive ancestral blessings and strong personal vitality.",
      astro: {
        content: `Sun is positioned at ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Sun")?.signName || "Unknown"} with degree ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Sun")?.degree?.toFixed(2) || "0.00"}°. Sun's house position is House ${kundaliResult.boyChart?.ascSignIdx !== -1 ? ( (kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Sun")?.signIdx - kundaliResult.boyChart?.ascSignIdx + 12) % 12 + 1 ) : "Unknown"}.`
      },
      classic: {
        bullets: [
          { title: "Brihat Parashara (Heritage)", text: "When Sun (father) is aspected by Rahu/Ketu/Saturn or debilitated in Libra, ancestral energy patterns require conscious balancing." },
          { title: "Phaladeepika (Chapter 20)", text: "Sun in the 9th house under malefic influence restricts smooth fortune flow until lineages are honored." }
        ]
      },
      validation: {
        verdict: extraDoshas.pitru.status === "Cancelled"
          ? `Neutralization confirmed: ${extraDoshas.pitru.cancellations?.join(", ") || "Jupiter aspected Sun, transforming the challenge into wisdom."}`
          : extraDoshas.pitru.status === "Present"
            ? `Active Pitru Dosha confirmed: ${extraDoshas.pitru.reasons?.join(", ") || "Sun represents challenging lineage dynamics."}`
            : "Passed. No active Pitru Dosha detected on the 3-layer validation."
      }
    },
    {
      id: "guruchandal",
      title: "Guru Chandal",
      subtitle: "Jupiter-Node Fusion",
      status: extraDoshas.guruChandal.status,
      isCritical: extraDoshas.guruChandal.status === "Present",
      metaLabel: "Guru conjunct Node",
      metaClass: "Class: Chandal Alignment",
      primaryChart: "D1",
      additionalCharts: "D9 for confirmation",
      icon: <BookOpen className="w-5 h-5" />,
      frontDescription: extraDoshas.guruChandal.status === "Present"
        ? "Jupiter is conjunct Rahu/Ketu in the same sign, which can challenge traditional beliefs and create a highly unconventional approach to life and wisdom."
        : extraDoshas.guruChandal.status === "Cancelled"
          ? "Jupiter and Rahu/Ketu are aligned, but the intellectual friction is fully resolved/exalted, turning it into deep philosophical genius."
          : "Jupiter flows independently of the lunar nodes, supporting stable wisdom, standard intellectual growth, and harmonious values.",
      astro: {
        content: `Jupiter is at sign ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Jupiter")?.signName || "Unknown"}. Node is in the same sign, creating intellectual/philosophical friction.`
      },
      classic: {
        bullets: [
          { title: "Brihat Jataka (Conjunctions)", text: "Jupiter conjunct Rahu creates Guru Chandal Yoga, indicating unconventional thought systems and a search for ultimate truth outside traditional bounds." },
          { title: "Mantreswara (Auspicious Purge)", text: "If Jupiter resides in Sagittarius, Pisces, or Cancer, the toxic shadow is entirely purged, creating a wisdom purifier (Ganga-Snana Yoga)." }
        ]
      },
      validation: {
        verdict: extraDoshas.guruChandal.status === "Cancelled"
          ? `Purification confirmed: ${extraDoshas.guruChandal.cancellations?.join(", ") || "Jupiter's strong dignity neutralizes Rahu's shadow."}`
          : extraDoshas.guruChandal.status === "Present"
            ? `Active Chandal alignment confirmed: ${extraDoshas.guruChandal.reasons?.join(", ")}`
            : "Passed. Jupiter flows harmoniously without nodal interference."
      }
    },
    {
      id: "kemadruma",
      title: "Kemadruma Yoga",
      subtitle: "Isolated Lunar Mind",
      status: extraDoshas.kemadruma.status,
      isCritical: extraDoshas.kemadruma.status === "Present",
      metaLabel: "Isolated Natal Moon",
      metaClass: "Class: Lunar Isolation",
      primaryChart: "D1",
      additionalCharts: "Rarely D9",
      icon: <HelpCircle className="w-5 h-5" />,
      frontDescription: extraDoshas.kemadruma.status === "Present"
        ? "Natal Moon is isolated without any planets in adjacent houses. This can manifest as periodic feelings of mental isolation or deep introspection."
        : extraDoshas.kemadruma.status === "Cancelled"
          ? "Your Moon is adjacent to empty signs, but the isolated state is fully cancelled (Bhanga) by strong angular planets, creating rich self-reliance."
          : "Your Moon is supported by adjacent planets or strong configurations, ensuring comfortable emotional integration and high empathy.",
      astro: {
        content: `Natal Moon is at sign index ${kundaliResult.boyRashiIndex || "Unknown"}. Signs adjacent (2nd/12th) contain no non-luminary planets, leaving the Moon's emotional field un-anchored.`
      },
      classic: {
        bullets: [
          { title: "Saravali (Kemadruma Definition)", text: "If the 2nd and 12th houses from Moon are vacant of planets (excluding Sun, Rahu, Ketu), Kemadruma Yoga is formed." },
          { title: "Brihat Jataka (Bhanga Cancel)", text: "If planets reside in Kendra (angles 1, 4, 7, 10) from Lagna or Moon, Kemadruma is fully cancelled, granting strong self-reliance." }
        ]
      },
      validation: {
        verdict: extraDoshas.kemadruma.status === "Cancelled"
          ? `Bhanga cancellation active: ${extraDoshas.kemadruma.cancellations?.join(", ") || "Planets in Kendra support the Moon."}`
          : extraDoshas.kemadruma.status === "Present"
            ? `Active isolated lunar mind: ${extraDoshas.kemadruma.reasons?.join(", ")}`
            : "Passed. Moon is well supported by adjacent planetary nodes."
      }
    },
    {
      id: "shrapit",
      title: "Shrapit Yoga",
      subtitle: "Saturn-Rahu Conjunction",
      status: extraDoshas.shrapit.status,
      isCritical: extraDoshas.shrapit.status === "Present",
      metaLabel: "Saturn conjunct Rahu",
      metaClass: "Class: Karmic Freeze",
      primaryChart: "D1",
      additionalCharts: "D9 for severity",
      icon: <Cpu className="w-5 h-5" />,
      frontDescription: extraDoshas.shrapit.status === "Present"
        ? "Saturn and Rahu are in the same sign, representing a powerful karmic combination. This requires patience, hard work, and resolving long-term challenges to unlock success."
        : extraDoshas.shrapit.status === "Cancelled"
          ? "Saturn and Rahu align in your chart, but auspicious aspects from Jupiter purify the energy, turning hard challenges into profound authority."
          : "Saturn and Rahu occupy different sectors, ensuring you don't face intense consolidated karmic freezes in any single area.",
      astro: {
        content: `Saturn is at sign index ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Saturn")?.signIdx || 0}. Rahu is at sign index ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signIdx || 0}.`
      },
      classic: {
        bullets: [
          { title: "Jataka Parijata (Conjunction)", text: "Conjunction of Saturn (Karma) and Rahu (Shadow) is named Shrapit (cursed alignment), requiring intense self-discipline." },
          { title: "Phaladeepika (Auspicious Release)", text: "A strong aspect from benefic Jupiter clears the shadow, turning this difficult configuration into high social leadership." }
        ]
      },
      validation: {
        verdict: extraDoshas.shrapit.status === "Cancelled"
          ? `Purification active: ${extraDoshas.shrapit.cancellations?.join(", ") || "Jupiter aspected Saturn-Rahu, converting the challenge into profound duty."}`
          : extraDoshas.shrapit.status === "Present"
            ? `Active karmic freeze validated: ${extraDoshas.shrapit.reasons?.join(", ")}`
            : "Passed. Saturn and Rahu are harmoniously separated."
      }
    }
  ];

  const getLocalizedCardsData = () => {
    if (language === "en") return cardsData;
    
    const dicts: Record<string, Record<string, any>> = {
      hi: {
        mangal: {
          title: "मांगलिक विश्लेषण", subtitle: "मंगल अग्नि सूत्र",
          frontDescription: bMangalReport.status === "Present" ? `मंगल आपके ${bMangalReport.houseD1}वें भाव में है, जिससे वैवाहिक जीवन में घर्षण पैदा हो सकता है।` : bMangalReport.status === "Cancelled" ? "मंगल के कारण उत्पन्न मांगलिक दोष शुभ ग्रहों के प्रभाव से पूर्णतः निरस्त हो गया है।" : "कुंडली में मांगलिक दोष उपस्थित नहीं है। वैवाहिक जीवन अनुकूल है।",
          astro: `मंगल सूचकांक: राशि ${bMangalReport.marsRashi}, अंश ${bMangalReport.marsDegreeInSign?.toFixed(2) || "0.00"}°। लग्न से ${bMangalReport.houseD1}वें भाव में है।`,
          b1t: "वृहत् पाराशर सिद्धांत", b1d: "लग्न से 1, 4, 7, 8 या 12वें भाव में मंगल वैवाहिक जीवन में घर्षण देता है।",
          verdict: bMangalReport.status === "Cancelled" ? `शमन प्रभाव: ${bMangalReport.cancellations?.join(", ") || "बृहस्पति दृष्टि"}` : bMangalReport.status === "Present" ? "सक्रिय मांगलिक प्रभाव।" : "कोई सक्रिय मांगलिक दोष नहीं।"
        },
        sadesati: {
          title: "शनि साढ़े साती", subtitle: "शनि गोचर चक्र",
          frontDescription: bSadeSati ? "शनि आपके चंद्रमा के निकट गोचर कर रहा है, जिससे 7.5 वर्षों का कर्म शुद्धिकरण चक्र सक्रिय है।" : "शनि वर्तमान में आपके चंद्रमा के लगत भावों से गोचर नहीं कर रहा है।",
          astro: `गोचर शनि मीन में है। जन्म चंद्रमा राशि ${kundaliResult.boyRashi || "अज्ञात"} में है। दूरी ${(11 - (kundaliResult.boyRashiIndex || 0) + 12) % 12} राशि है।`,
          b1t: "फलदीपिका गोचर", b1d: "जन्म चंद्रमा से 12वें, प्रथम और द्वितीय भाव में शनि का गोचर साढ़े साती कहलाता है।",
          verdict: bSadeSati ? "सक्रिय साढ़े साती। धैर्य और अनुशासन बनाए रखें।" : "साढ़े साती अनुपस्थित है।"
        },
        rahuketu: {
          title: "राहु-केतु अक्ष", subtitle: "चंद्र नोड्स",
          frontDescription: bRahuKetu ? "राहु और केतु आपके पहले और सातवें भाव में हैं, जो कर्मात्मक रूप से रिश्तों के अक्ष को सक्रिय करते हैं।" : "आपके चंद्र नोड्स अनुकूल अक्षों में स्थित हैं, जिससे रिश्ते सामान्य रूप से विकसित होते हैं।",
          astro: `राहु ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.degree?.toFixed(2) || "0.00"}° पर और केतु 180° विपरीत है।`,
          b1t: "बृहत जातक नियम", b1d: "लग्न/सप्तम भाव में चंद्र नोड्स व्यक्तिगत रूपांतरण बनाम साथी की अपेक्षाओं पर ध्यान केंद्रित करते हैं।"
        },
        kaalsarp: {
          title: "काल सर्प दोष", subtitle: "ग्रह वेष्टन",
          frontDescription: kaalSarpReport.present ? "सभी ग्रह राहु और केतु के भीतर हैं, जिससे काल सर्प योग बनता है जो तीव्र इच्छाशक्ति देता है।" : "कोई काल सर्प दोष उपस्थित नहीं है। ग्रह खगोलीय गोलार्धों में सुसंतुलित वितरित हैं।",
          astro: `राहु-केतु राशियां: ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signName || "अज्ञात"} और ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Ketu")?.signName || "अज्ञात"}।`,
          b1t: "जातक पारिजात नियम", b1d: "राहु-केतु के बीच घिरे सभी ग्रह शारीरिक ऊर्जा को गहन आध्यात्मिक क्षमता में बदलते हैं।"
        },
        pitru: {
          title: "पितृ दोष", subtitle: "पितृ ऋण संरेखण",
          frontDescription: extraDoshas.pitru.status === "Present" ? "सूर्य पापी ग्रहों से प्रभावित या नीच है, जो अधूरे पैतृक कर्मात्मक पैटर्न को दर्शाता है।" : extraDoshas.pitru.status === "Cancelled" ? "पैतृक प्रभाव मौजूद हैं, पर सूर्य पर शुभ बृहस्पति की दृष्टि होने से पूर्णतः शांत हैं।" : "सूर्य मजबूत और शुभ दृष्ट है, जो पितरों के स्पष्ट आशीर्वाद को दर्शाता है।",
          astro: `सूर्य ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Sun")?.signName || "अजगात"} में है।`,
          b1t: "पाराशर विरासत नियम", b1d: "जब सूर्य राहु/केतु/शनि से दृष्ट हो या तुला में नीच हो, तो सचेत संतुलन आवश्यक है।"
        },
        guruchandal: {
          title: "गुरु चांडाल दोष", subtitle: "बृहस्पति-राहु युति",
          frontDescription: extraDoshas.guruChandal.status === "Present" ? "बृहस्पति एक ही राशि में राहु/केतु के साथ है, जो मान्यताओं को चुनौती दे सकता है।" : extraDoshas.guruChandal.status === "Cancelled" ? "बृहस्पति-राहु संरेखित हैं, पर घर्षण पूरी तरह हल होकर दार्शनिक प्रतिभा में बदल गया है।" : "बृहस्पति चंद्र नोड्स से मुक्त है, जो बुद्धि और सामंजस्यपूर्ण मूल्यों को बढ़ावा देता है।",
          astro: `बृहस्पति ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Jupiter")?.signName || "अज्ञात"} में नोड के साथ युति में है।`,
          b1t: "बृहत जातक युति", b1d: "बृहस्पति की राहु के साथ युति गुरु चांडाल योग बनाती है, जो अपरंपरागत सोच को दर्शाती है।"
        },
        kemadruma: {
          title: "केमद्रुम दोष", subtitle: "एकाकी चंद्र मन",
          frontDescription: extraDoshas.kemadruma.status === "Present" ? "जन्म का चंद्रमा आस-पास के भावों में किसी ग्रह के बिना अकेला है, जो मानसिक एकाकीपन दे सकता है।" : extraDoshas.kemadruma.status === "Cancelled" ? "चंद्रमा खाली राशियों के पास है, पर केंद्रों में ग्रहों के होने से निरस्त हो गया है।" : "आपका चंद्रमा अनुकूल ग्रहों से घिरा है, जो भावनात्मक सामंजस्य देता है।",
          astro: `जन्म चंद्रमा राशि सूचकांक ${kundaliResult.boyRashiIndex || "अज्ञात"} में है।`,
          b1t: "सारावली चंद्र सिद्धांत", b1d: "यदि चंद्रमा से दूसरे और बारहवें भाव में सूर्य/नोड्स के अलावा कोई ग्रह न हो, तो केमद्रुम योग बनता है।"
        },
        shrapit: {
          title: "शापित दोष", subtitle: "शनि-राहु युति",
          frontDescription: extraDoshas.shrapit.status === "Present" ? "शनि और राहु एक ही राशि में हैं, जो कर्मात्मक अवरोध को दर्शाते हैं। सफलता के लिए धैर्य आवश्यक है।" : extraDoshas.shrapit.status === "Cancelled" ? "शनि और राहु कुंडली में एक साथ हैं, पर बृहस्पति की शुभ दृष्टि ने इसे निष्प्रभावी कर दिया है।" : "शनि और राहु अलग-अलग भावों में हैं, जिससे आप कर्मात्मक अवरोध से बचे हैं।",
          astro: `शनि सूचकांक ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Saturn")?.signIdx || 0} में और राहु ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signIdx || 0} में है।`,
          b1t: "जातक पारिजात युति", b1d: "शनि और राहु की युति शापित योग बनाती है, जिसके लिए गहन आत्म-अनुशासन आवश्यक है।"
        }
      },
      bn: {
        mangal: {
          title: "মাঙ্গলিক বিশ্লেষণ", subtitle: "মঙ্গল অগ্নি সূত্র",
          frontDescription: bMangalReport.status === "Present" ? `মঙ্গল আপনার ${bMangalReport.houseD1}তম ভাবে রয়েছে, দাম্পত্য জীবনে তীব্র উত্তাপ সৃষ্টি করে।` : bMangalReport.status === "Cancelled" ? "মঙ্গল শুভ গ্রহের প্রভাবে সম্পূর্ণ নিষ্ক্রিয় বা বাতিল হয়েছে।" : "আপনার কুণ্ডলীতে কোনো মাঙ্গলিক দোষ নেই। দাম্পত্য জীবন শুভ ও অনুকূল।",
          astro: `মঙ্গলের স্থানাঙ্ক: রাশি ${bMangalReport.marsRashi}, ডিগ্রি ${bMangalReport.marsDegreeInSign?.toFixed(2) || "0.00"}°। লগ্ন থেকে ${bMangalReport.houseD1}তম ভাবে।`,
          b1t: "বৃহৎ পরাশর সংজ্ঞা", b1d: "লগ্ন থেকে ১, ৪, ৭, ৮ বা ১২তম ভাবে মঙ্গলের অবস্থান দাম্পত্য জীবনে তীব্র উত্তাপ সৃষ্টি করে।",
          verdict: bMangalReport.status === "Cancelled" ? `প্রশমনকারী দিক: ${bMangalReport.cancellations?.join(", ") || "বৃহস্পতির দৃষ্টি"}` : bMangalReport.status === "Present" ? "সক্রিয় মাঙ্গলিক প্রভাব।" : "কোনো সক্রিয় মাঙ্গলিক দোষ পাওয়া যায়নি।"
        },
        sadesati: {
          title: "শনি সাড়ে সাতি", subtitle: "শনি গোচর চক্র",
          frontDescription: bSadeSati ? "শনি আপনার চন্দ্রের সংলগ্ন রাশিতে গোচর করছে, যা ৭.৫ বছরের কড়া কর্ম শোধন চক্র চালু করেছে।" : "শনি বর্তমানে আপনার চন্দ্রের সংলগ্ন ভাবগুলিতে গোচর করছে না।",
          astro: `গোচর শনি মীনে আছে। জন্ম চন্দ্র রাশি ${kundaliResult.boyRashi || "অজ্ঞাত"}। দূরত্ব ${(11 - (kundaliResult.boyRashiIndex || 0) + 12) % 12} রাশি।`,
          b1t: "ফলদীপিকা গোচর", b1d: "জন্ম চন্দ্র থেকে ১২তম, প্রথম এবং দ্বিতীয় ভাবে শনির গোচরকে সাড়ে সাতি বলা হয়।",
          verdict: bSadeSati ? "সক্রিয় সাড়ে সাতি। ধৈর্য ও দৈনিক রুটিন বজায় রাখুন।" : "সাড়ে সাতি অনুপস্থিত।"
        },
        rahuketu: {
          title: "রাহু-কেতু অক্ষ", subtitle: "চন্দ্র নোড",
          frontDescription: bRahuKetu ? "রাহু ও কেতু আপনার প্রথম ও সপ্তম ভাবে অবস্থান করছে, যা সম্পর্কের কড়া কর্ম অক্ষকে সক্রিয় করে।" : "আপনার চন্দ্র নোডগুলি সম্পর্কহীন অক্ষে অবস্থান করছে, ফলে সম্পর্ক বাধা ছাড়াই বিকশিত হতে পারে।",
          astro: `রাহু ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.degree?.toFixed(2) || "0.00"}° তে আছে এবং কেতু ঠিক ১৮০° বিপরীতে।`,
          b1t: "বৃহৎ জাতক সংস্থান", b1d: "প্রথম/সপ্তম ভাবে নোডগুলি ব্যক্তিগত রূপান্তর বনাম অংশীদারের প্রত্যাশার ওপর ফোকাস দেয়।"
        },
        kaalsarp: {
          title: "কাল সর্প দোষ", subtitle: "গ্রহ বেষ্টনী পরীক্ষা",
          frontDescription: kaalSarpReport.present ? "সব গ্রহ রাহু ও কেতুর মধ্যে বেষ্টিত রয়েছে, যা কাল সর্প দোষ তৈরি করে ও চরম মনোযোগ দেয়।" : "আপনার কুণ্ডলীতে কাল সর্প দোষ নেই। গ্রহগুলি মহাকাশে সুষমভাবে বিন্যস্ত রয়েছে।",
          astro: `রাহু ও কেতু রাশি: ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signName || "অজ্ঞাত"} এবং ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Ketu")?.signName || "অজ্ঞাত"}।`,
          b1t: "জাতক পারিজাত নোড", b1d: "রাহু-কেতুর মধ্যে বেষ্টিত সমস্ত গ্রহ শারীরিক শক্তিকে আধ্যাত্মিক সম্ভাবনায় আবদ্ধ করে।"
        },
        pitru: {
          title: "पितृ दोष", subtitle: "पितृ ऋण विन्यास",
          frontDescription: extraDoshas.pitru.status === "Present" ? "সূর্যের ওপর অশুভ প্রভাব রয়েছে অথবা সূর্য নীচস্থ, যা অমীমাংসিত পিতৃপুরুষের ঋণ নির্দেশ করে।" : extraDoshas.pitru.status === "Cancelled" ? "पितृपुरुषের প্রভাব রয়েছে, কিন্তু সূর্যের ওপর শুভ বৃহস্পতির দৃষ্টি থাকার কারণে নিষ্ক্রিয়।" : "সূর্য শক্তিশালী এবং শুভ গ্রহ দ্বারা দৃষ্ট, যা পিতৃপুরুষের স্পষ্ট আশীর্বাদ নির্দেশ করে।",
          astro: `সূর্য ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Sun")?.signName || "অজ্ঞাত"} রাশিতে রয়েছে।`,
          b1t: "পরাশর ঐতিহ্য নিয়ম", b1d: "যখন সূর্য রাহু/কেতু/শনি দ্বারা দৃষ্ট হয় বা তুলা রাশিতে নীচস্থ হয়, তখন শক্তির ভারসাম্য প্রয়োজন হয়।"
        },
        guruchandal: {
          title: "গুরু চণ্ডাল দোষ", subtitle: "বৃহস্পতি-রাহু সংযোগ",
          frontDescription: extraDoshas.guruChandal.status === "Present" ? "বৃহস্পতি একই রাশিতে রাহু/কেতুর সাথে যুক্ত রয়েছে, যা প্রথাগত বিশ্বাসকে চ্যালেঞ্জ করতে পারে।" : extraDoshas.guruChandal.status === "Cancelled" ? "বৃহস্পতি এবং রাহু যুক্ত, কিন্তু শুভ প্রভাবের কারণে এটি গভীর দার্শনিক প্রতিভায় রূপান্তরিত।" : "বৃহস্পতি চন্দ্র নোড থেকে সম্পূর্ণ স্বাধীন, যা স্বাভাবিক বুদ্ধি ও সুরেলা মূল্যবোধ সমর্থন করে।",
          astro: `বৃহস্পতি ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Jupiter")?.signName || "অজ্ঞাত"} রাশিতে নোডের সাথে যুক্ত।`,
          b1t: "বৃহৎ জাতক সংযোগ", b1d: "বৃহস্পতির রাহুর সাথে সংযোগ গুরু চণ্ডাল যোগ তৈরি করে, যা অপ্রচলিত চিন্তাধারা নির্দেশ করে।"
        },
        kemadruma: {
          title: "কেমদ্রুম দোষ", subtitle: "একাকী চন্দ্র মন",
          frontDescription: extraDoshas.kemadruma.status === "Present" ? "জন্মের চন্দ্র সংলগ্ন ভাবগুলিতে কোনো গ্রহ ছাড়াই একা রয়েছে, যা মাঝে মাঝে মানসিক একাকীত্ব দেয়।" : extraDoshas.kemadruma.status === "Cancelled" ? "চন্দ্র ফাঁকা রাশির কাছে রয়েছে, কিন্তু শক্তিশালী কেন্দ্র গ্রহ দ্বারা একাকী অবস্থা বাতিল হয়েছে।" : "আপনার চন্দ্র সংলগ্ন গ্রহ বা শক্তিশালী বিন্যাস দ্বারা সমর্থিত, যা আবেগীয় সামঞ্জস্য দেয়।",
          astro: `জন্ম চন্দ্র রাশি সূচক ${kundaliResult.boyRashiIndex || "অজ্ঞাত"} তে রয়েছে।`,
          b1t: "সারাভালী চন্দ্র নিয়ম", b1d: "যদি চন্দ্র থেকে দ্বিতীয় এবং দ্বাদশ ভাবে সূর্য ও নোড বাদে কোনো গ্রহ না থাকে, তবে কেমদ্রুম যোগ গঠিত হয়।"
        },
        shrapit: {
          title: "শাপিত দোষ", subtitle: "শনি-রাহু সংযোগ",
          frontDescription: extraDoshas.shrapit.status === "Present" ? "শনি এবং রাহু একই রাশিতে রয়েছে, যা কর্মিক বাধা নির্দেশ করে। সাফল্য পেতে এতে ধৈর্য ও কঠোর পরিশ্রম প্রয়োজন।" : extraDoshas.shrapit.status === "Cancelled" ? "শনি ও রাহু একসঙ্গে রয়েছে, কিন্তু শুভ বৃহস্পতির দৃষ্টি এই শক্তিকে বিশুদ্ধ করে কর্তব্যে পরিণত করেছে।" : "শনি এবং রাহু আলাদা রাশিতে রয়েছে, ফলে আপনি কর্মিক স্থবিরতা এড়িয়ে গেছেন।",
          astro: `শনি রাশি সূচক ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Saturn")?.signIdx || 0} তে আছে এবং রাহু ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signIdx || 0} তে আছে।`,
          b1t: "জাতক পারিজাত সংযোগ", b1d: "শনি এবং রাহুর সংযোগ শাপিত যোগ তৈরি করে, যার জন্য গভীর আত্ম-অনুমোদন প্রয়োজন।"
        }
      },
      mr: {
        mangal: {
          title: "मांगलिक विश्लेषण", subtitle: "मंगळ अग्नी सूत्र",
          frontDescription: bMangalReport.status === "Present" ? `मंगळ आपल्या ${bMangalReport.houseD1}व्या स्थानात स्थित आहे, ज्यामुळे वैवाहिक जीवनात घर्षण निर्माण होते.` : bMangalReport.status === "Cancelled" ? "मंगळ शुभ ग्रहांच्या प्रभावामुळे मांगलिक दोष पूर्णपणे रद्द झाला आहे." : "तुमच्या कुंडलीत मांगलिक दोष नाही. वैवाहिक जीवन सुसंवादी राहील.",
          astro: `मंगळाचे स्थान: राशी निर्देशांक ${bMangalReport.marsRashi} आणि अंश ${bMangalReport.marsDegreeInSign?.toFixed(2) || "0.00"}°। लग्न स्थान ${bMangalReport.houseD1} आहे.`,
          b1t: "बृहत पराशर नियम", b1d: "लग्नापासून १, ४, ७, ८ किंवा १२ व्या स्थानात मंगळाचे स्थान वैवाहिक जीवनात घर्षण निर्माण करते.",
          verdict: bMangalReport.status === "Cancelled" ? `शमन करणारे घटक: ${bMangalReport.cancellations?.join(", ") || "गुरुची दृष्टी"}` : bMangalReport.status === "Present" ? "सक्रिय मांगलिक प्रभाव." : "सक्रिय मांगलिक दोष नाही."
        },
        sadesati: {
          title: "शनि साडेसाती", subtitle: "शनि गोचर चक्र",
          frontDescription: bSadeSati ? "शनि तुमच्या चंद्राच्या लगतच्या राशींमधून गोचर करत आहे, ज्यामुळे ७.५ वर्षांचा कर्माचा चक्र सक्रिय आहे." : "शनि सध्या तुमच्या चंद्राच्या लगतच्या स्थानांमधून गोचर करत नाही.",
          astro: `गोचर शनि मीन मध्ये आहे. जन्म चंद्र राशी ${kundaliResult.boyRashi || "अज्ञात"} आहे. अंतर ${(11 - (kundaliResult.boyRashiIndex || 0) + 12) % 12} राशी एवढे आहे.`,
          b1t: "फलदीपिका गोचर", b1d: "जन्म चंद्रापासून १२व्या, पहिल्या आणि दुसऱ्या स्थानात शनीचे गोचर साडेसाती म्हणून ओळखले जाते.",
          verdict: bSadeSati ? "सक्रिय साडेसाती. संयम बाळा आणि दिनचर्या शिस्तबद्ध ठेवा." : "साडेसाती अनुपस्थित आहे."
        },
        rahuketu: {
          title: "राहु-केतू अक्ष", subtitle: "चंद्र नोड्स",
          frontDescription: bRahuKetu ? "राहु आणि केतू पहिल्या आणि सातव्या स्थानात आहेत, जे स्वतःचे आणि जोडीदाराचे स्थान कर्मात्मक रीतीने सक्रिय करतात." : "तुमचे चंद्र नोड्स नातेसंबंध नसलेल्या अक्षांमध्ये आहेत, ज्यामुळे नातेसंबंध सुरळीत राहतात.",
          astro: `राहु ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.degree?.toFixed(2) || "0.00"}° वर आणि केतू १८०° विरुद्ध आहे.`,
          b1t: "बृहत जातक नियम", b1d: "पहिल्या/सातव्या स्थानातील नोड्स वैयक्तिक बदल आणि जोडीदाराच्या अपेक्षांवर लक्ष केंद्रित करतात."
        },
        kaalsarp: {
          title: "काल सर्प दोष", subtitle: "ग्रह वेढणे",
          frontDescription: kaalSarpReport.present ? "सर्व भौतिक ग्रह राहु आणि केतूने वेढलेल्या गोलार्धात आहेत, ज्यामुळे काल सर्प योग तयार होतो." : "तुमच्या कुंडलीत कोणताही काल सर्प दोष नाही. तुमचे ग्रह सुव्यवस्थितपणे पसरलेले आहेत.",
          astro: `राहु आणि केतू राशी: ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signName || "अज्ञात"} आणि ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Ketu")?.signName || "अजगात"}.`,
          b1t: "जातक पारिजात नियम", b1d: "राहु-केतूच्या मर्यादेत असलेले सर्व ग्रह शारीरिक ऊर्जेला आध्यात्मिक क्षमतेमध्ये बांधतात."
        },
        pitru: {
          title: "पितृ दोष", subtitle: "पितृ ऋण संरेखन",
          frontDescription: extraDoshas.pitru.status === "Present" ? "सूर्यावर तीव्र पापी ग्रहांचा प्रभाव आहे किंवा सूर्य नीच राशीत आहे, जे पूर्वजांचे कर्मात्मक नमुने दर्शवते." : extraDoshas.pitru.status === "Cancelled" ? "पूर्वजांचे धडे उपस्थित आहेत, परंतु शुभ गुरुच्या दृष्टीमुळे पूर्णपणे निष्प्रभावी झाले आहेत." : "सूर्य मजबूत आणि शुभ दृष्ट आहे, जे पूर्वजांचे स्पष्ट आशीर्वाद दर्शवते.",
          astro: `सूर्य ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Sun")?.signName || "अज्ञात"} राशीत आहे.`,
          b1t: "पाराशर वारसा नियम", b1d: "जेव्हा सूर्यावर राहु/केतू/शनीची दृष्टी असते किंवा तो तूळ राशीत नीच असतो, तेव्हा संतुलन आवश्यक असते."
        },
        guruchandal: {
          title: "गुरु चांडाल दोष", subtitle: "गुरु-राहु युती",
          frontDescription: extraDoshas.guruChandal.status === "Present" ? "गुरु एकाच राशीत राहु/केतू सोबत युतीमध्ये आहे, जे पारंपारिक समजुतींना आव्हान देऊ शकते." : extraDoshas.guruChandal.status === "Cancelled" ? "गुरु आणि राहु संरेखित आहेत, पण वैचारिक मतभेद पूर्णपणे दूर होऊन याचे रूपांतर दार्शनिक प्रतिभेत झाले आहे." : "गुरु चंद्र नोड्सपासून मुक्त आहे, ज्यामुळे बुद्धिमत्ता आणि सुसंवादी मूल्यांना पाठबळ मिळते.",
          astro: `गुरु ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Jupiter")?.signName || "अजगात"} राशीत नोडसोबत युतीमध्ये आहे.`,
          b1t: "बृहत जातक युती", b1d: "गुरुची राहुसोबत युती गुरु चांडाल योग बनवते, जी अपारंपरिक विचारसरणी दर्शवते."
        },
        kemadruma: {
          title: "केमद्रुम दोष", subtitle: "एकाकी चंद्र मन",
          frontDescription: extraDoshas.kemadruma.status === "Present" ? "जन्माचा चंद्र लगतच्या स्थानांमध्ये कोणत्याही ग्रहाशिवाय एकटा आहे, ज्यामुळे मानसिक अस्वस्थता येऊ शकते." : extraDoshas.kemadruma.status === "Cancelled" ? "तुमचा चंद्र रिक्त राशींच्या लगत आहे, परंतु केंद्र ग्रहांमुळे एकाकी स्थिती पूर्णपणे रद्द झाली आहे." : "तुमचा चंद्र लगतच्या ग्रहांनी समर्थित आहे, ज्यामुळे भावनिक समतोल मिळतो.",
          astro: `जन्म चंद्र राशी निर्देशांक ${kundaliResult.boyRashiIndex || "अज्ञात"} मध्ये आहे.`,
          b1t: "सारावळी चंद्र नियम", b1d: "जर चंद्रापासून दुसऱ्या आणि बाराव्या स्थानात सूर्य/नोड्स वगळता कोणताही ग्रह नसेल तर केमद्रुम योग तयार होतो."
        },
        shrapit: {
          title: "शापित दोष", subtitle: "शनि-राहु युती",
          frontDescription: extraDoshas.shrapit.status === "Present" ? "शनि आणि राहु एकाच राशीत आहेत, जे कर्मात्मक गोठणे दर्शवतात. यश मिळवण्यासाठी संयम आणि कठोर परिश्रम आवश्यक आहेत." : extraDoshas.shrapit.status === "Cancelled" ? "शनि आणि राहु कुंडलीत एकत्र आहेत, पण गुरुच्या शुभ दृष्टीने याचे रूपांतर गंभीर कर्तव्यात केले आहे." : "शनि आणि राहु वेगवेगळ्या राशीत आहेत, ज्यामुळे कर्मात्मक गोठणे टळले आहे.",
          astro: `शनि राशी निर्देशांक ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Saturn")?.signIdx || 0} मध्ये आहे आणि राहु ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signIdx || 0} मध्ये आहे.`,
          b1t: "जातक पारिजात युती", b1d: "शनि आणि राहुची युती शापित योग म्हणून ओळखली जाते, ज्यासाठी आत्म-शिस्तीची आवश्यकता असते."
        }
      },
      gu: {
        mangal: {
          title: "માંગલિક વિશ્લેષણ", subtitle: "મંગળ અગ્નિ સૂત્ર",
          frontDescription: bMangalReport.status === "Present" ? `મંગળ તમારા ${bMangalReport.houseD1}મા ભાવમાં સ્થિત છે, જે લગ્નજીવનમાં ઘર્ષણ પેદા કરી શકે છે.` : bMangalReport.status === "Cancelled" ? "મંગળ શુભ ગ્રહોના પ્રભાવથી તમારો માંગલિક દોષ સંપૂર્ણપણે રદ કરવામાં આવ્યો છે." : "તમારી કુંડળીમાં કોઈ માંગલિક દોષ હાજર નથી. લગ્નજીવન શાંતિપૂર્ણ રહેશે.",
          astro: `મંગળનું સ્થાન: રાશિ ${bMangalReport.marsRashi} અને અંશ ${bMangalReport.marsDegreeInSign?.toFixed(2) || "0.00"}° છે. લગ્નથી ભાવ ${bMangalReport.houseD1} છે.`,
          b1t: "બૃહદ પરાશર નિયમ", b1d: "લગ્નથી ૧, ૪, ૭, ૮ કે ૧૨મા ભાવમાં મંગળનું સ્થાન વૈવાહિક જીવનમાં તીવ્ર ગરમી પેદા કરે છે.",
          verdict: bMangalReport.status === "Cancelled" ? `શમન પરિબળો: ${bMangalReport.cancellations?.join(", ") || "ગુરુની દ્રષ્ટિ"}` : bMangalReport.status === "Present" ? "સક્રિય માંગલિક પ્રભાવ." : "કોઈ સક્રિય માંગલિક દોષ નથી."
        },
        sadesati: {
          title: "શનિ સાડાસાતી", subtitle: "શનિ ગોચર ચક્ર",
          frontDescription: bSadeSati ? "શનિ તમારા ચંદ્રના નજીકના ભાવોમાંથી ગોચર કરી રહ્યો છે, જે સાડા સાત વર્ષનું કર્મ ચક્ર શરૂ કરી રહ્યો છે." : "શનિ હાલમાં તમારા ચંદ્રના નજીકના ભાવોમાંથી ગોચર કરી રહ્યો નથી.",
          astro: `ગોચર શનિ મીનમાં છે. જન્મ ચંદ્ર રાશિ ${kundaliResult.boyRashi || "અજ્ઞાત"} છે. અંતર ${(11 - (kundaliResult.boyRashiIndex || 0) + 12) % 12} રાશિ છે.`,
          b1t: "ફલદીપિકા ગોચર", b1d: "જન્મ ચંદ્રથી ૧૨મા, પ્રથમ અને બીજા ભાવમાં શનિનું ગોચર સાડાસાતી તરીકે ઓળખાય છે.",
          verdict: bSadeSati ? "સક્રિય સાડાસાતી. દૈનિક દિનચર્યા સ્થિર રાખો અને ધૈર્ય રાખો." : "સાડાસાતી ગેરહાજર છે."
        },
        rahuketu: {
          title: "રાહુ-કેતુ ધરી", subtitle: "ચંદ્ર નોડ્સ",
          frontDescription: bRahuKetu ? "રાહુ અને કેતુ તમારા પહેલા અને સાતમા સ્થાનમાં છે, જે કુંડળીમાં સંબંધોની ધરીને સક્રિય કરે છે." : "તમારા ચંદ્ર નોડ્સ બિન-સંબંધિત ધરીમાં છે, જેથી સંબંધો સામાન્ય રીતે વિકસી શકે છે.",
          astro: `રાહુ ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.degree?.toFixed(2) || "0.00"}° પર છે અને કેતુ બરાબર ૧૮૦° વિરુદ્ધ છે.`,
          b1t: "બૃહદ જાતક નિયમ", b1d: "પહેલા/સાતમા ભાવમાં નોડ્સ વ્યક્તિગત પરિવર્તન અને જીવનસાથીની અપેક્ષાઓ પર ધ્યાન કેન્દ્રિત કરે છે."
        },
        kaalsarp: {
          title: "કાલ સર્પ દોષ", subtitle: "ગ્રહ ઘેરાવ",
          frontDescription: kaalSarpReport.present ? "તમામ મુખ્ય ગ્રહો રાહુ અને કેતુથી ઘેરાયેલા અર્ધગોળાર્ધમાં સ્થિત છે, જે કાલ સર્પ દોષ બનાવે છે." : "તમારી કુંડળીમાં કોઈ કાલ સર્પ દોષ નથી. તમામ ગ્રહો સુસંગત રીતે વિતરિત છે.",
          astro: `રાહુ અને કેતુ રાશિ: ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signName || "અજ્ઞાત"} અને ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Ketu")?.signName || "અજ્ઞાત"}.`,
          b1t: "જ્ઞાન પારિજાત નિયમ", b1d: "રાહુ-કેતુની મર્યાદામાં રહેલા તમામ ગ્રહો શારીરિક ઊર્જાને આધ્યાત્મિક ક્ષમતામાં બાંધે છે."
        },
        pitru: {
          title: "પિતૃ દોષ", subtitle: "પિતૃ ઋણ સંરેખણ",
          frontDescription: extraDoshas.pitru.status === "Present" ? "સૂર્ય પર ભારે પાપી ગ્રહોનો પ્રભાવ છે અથવા સૂર્ય નીચ રાશિમાં છે, જે પૂર્વજોના અધૂરા કર્મો દર્શાવે છે." : extraDoshas.pitru.status === "Cancelled" ? "પૂર્વજોના પાઠ હાજર છે, પરંતુ સૂર્ય પર શુભ ગુરુની દ્રષ્ટિ હોવાને કારણે તે સંપૂર્ણપણે નિષ્ક્રિય થઈ ગયા છે." : "સૂર્ય મજબૂત અને શુભ ગ્રહોથી દૃષ્ટ છે, જે પૂર્વજોના આશીર્વાદ દર્શાવે છે.",
          astro: `સૂર્ય ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Sun")?.signName || "અજ્ઞાત"} રાશિમાં છે.`,
          b1t: "પિતૃ વંશ નિયમ", b1d: "જ્યારે સૂર્ય પર રાહુ/કેતુ/શનિની દ્રષ્ટિ હોય અથવા તે તુલા રાશિમાં નીચ હોય, ત્યારે પિતૃ ઊર્જાના સંતુલનની જરૂર રહે છે."
        },
        guruchandal: {
          title: "ગુરુ ચાંડાલ દોષ", subtitle: "ગુરુ-રાહુ યુતિ",
          frontDescription: extraDoshas.guruChandal.status === "Present" ? "ગુરુ એક જ રાશિમાં રાહુ/કેતુ સાથે યુતિમાં છે, જે પરંપરાગત માન્યતાઓને પડકારી શકે છે." : extraDoshas.guruChandal.status === "Cancelled" ? "ગુરુ અને રાહુ એકસાથે છે, પણ વૈચારિક મતભેદો સંપૂર્ણપણે દૂર થઈને તેનું દાર્શનિક પ્રતિભામાં રૂપાંતર થયું છે." : "ગુરુ ચંદ્ર નોડ્સથી મુક્ત રીતે કાર્ય કરે છે, જે સ્થિર બુદ્ધિમત્તા અને સુસંગત મૂલ્યોને ટેકો આપે છે.",
          astro: `ગુરુ ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Jupiter")?.signName || "અજ્ઞાત"} રાશિમાં નોડ સાથે યુતિમાં છે.`,
          b1t: "બૃહદ જાતક યુતિ", b1d: "ગુરુની રાહુ સાથેની યુતિ ગુરુ ચાંડาล યોગ બનાવે છે, જે અપરંપરાગત વિચારસરણી દર્શાવે છે."
        },
        kemadruma: {
          title: "કેમદ્રુમ દોષ", subtitle: "એકાકી ચંદ્ર મન",
          frontDescription: extraDoshas.kemadruma.status === "Present" ? "જન્મનો ચંદ્ર નજીકના ભાવોમાં કોઈપણ ગ્રહ વિના એકલો સ્થિત છે, જે ક્યારેક માનસિક અસ્વસ્થતા આપી શકે છે." : extraDoshas.kemadruma.status === "Cancelled" ? "તમારો ચંદ્ર ખાલી રાશિઓની નજીક છે, પરંતુ મજબૂત કેન્દ્ર ગ્રહો દ્વારા એકાકી સ્થિતિ સંપૂર્ણપણે રદ થઈ ગઈ છે." : "તમારો ચંદ્ર નજીકના ગ્રહોથી સમર્થિત છે, જે ભાવનાત્મક સમતૂલા આપે છે.",
          astro: `જન્મ ચંદ્ર રાશિ સૂચકાંક ${kundaliResult.boyRashiIndex || "અજ્ઞાત"} માં છે.`,
          b1t: "સારાવલી ચંદ્ર નિયમ", b1d: "જો ચંદ્રથી બીજા અને બારમા ભાવમાં સૂર્ય, રાહુ, કેતુ સિવાય કોઈ ગ્રહ ન હોય તો કેમદ્રુમ યોગ બને છે."
        },
        shrapit: {
          title: "શાપિત દોષ", subtitle: "શનિ-રાહુ યુતિ",
          frontDescription: extraDoshas.shrapit.status === "Present" ? "શનિ અને રાહુ એક જ રાશિમાં છે, જે શક્તિશાળી કર્મિક સંરેખણ દર્શાવે છે. આમાં ધૈર્ય અને મહેનત જરૂરી છે." : extraDoshas.shrapit.status === "Cancelled" ? "શનિ અને રાહુ તમારી કુંдળીમાં એકસાથે છે, પરંતુ ગુરુની શુભ દ્રષ્ટિએ તેને ગંભીર ફરજમાં ફેરવ્યો છે." : "શનિ અને રાહુ અલગ-અલગ રાશિમાં છે, જેથી કુંડળીમાં કર્મિક અવરોધ ટળ્યો છે.",
          astro: `શનિ રાશિ સૂચકાંક ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Saturn")?.signIdx || 0} માં અને રાહુ ${kundaliResult.boyChart?.planetsBySign?.find((p: any) => p.name === "Rahu")?.signIdx || 0} માં છે.`,
          b1t: "જ્ઞાન પારિજાત યુતિ", b1d: "શનિ અને રાહુની યુતિ શાપિત યોગ તરીકે ઓળખાય છે, જેના માટે આત્મ-શિસ્તની જરૂર રહે છે."
        }
      }
    };

    const l = dicts[language];
    if (!l) return cardsData;

    return cardsData.map(card => {
      const trans = l[card.id];
      if (!trans) return card;
      const updated = {
        ...card,
        title: trans.title,
        subtitle: trans.subtitle,
        frontDescription: trans.frontDescription,
        astro: {
          ...card.astro,
          content: trans.astro
        },
        classic: {
          ...card.classic,
          bullets: card.classic.bullets.map((bullet, idx) => {
            if (idx === 0) {
              return {
                title: trans.b1t || bullet.title,
                text: trans.b1d || bullet.text
              };
            }
            if (idx === 1 && trans.b2d) {
              return {
                title: trans.b2t || bullet.title,
                text: trans.b2d || bullet.text
              };
            }
            return bullet;
          })
        }
      };
      if (trans.verdict && updated.validation) {
        updated.validation = {
          ...updated.validation,
          verdict: trans.verdict
        };
      }
      return updated;
    });
  };

  const translatedCardsData = getLocalizedCardsData();

  const getLocalizedStatus = (status: string, lang: string) => {
    if (lang === "en") return status;
    const map: Record<string, string> = {
      "Present": localUiTranslations[lang]?.statusPresent || "सक्रिय",
      "Absent": localUiTranslations[lang]?.statusAbsent || "अनुपस्थित",
      "Cancelled": localUiTranslations[lang]?.statusCancelled || "निरस्त (Cancelled)",
      "Active": localUiTranslations[lang]?.statusActive || "सक्रिय",
      "Active Axis": localUiTranslations[lang]?.statusActiveAxis || "सक्रिय अक्ष",
      "Clear": localUiTranslations[lang]?.statusClear || "मुक्त",
      "Detected": localUiTranslations[lang]?.statusDetected || "पाया गया",
    };
    return map[status] || status;
  };

  return (
    <div className="space-y-12">
      
      {/* SECTION A: MASTER INTERACTIVE KUNDALI HOUSE MATRIX */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
        className="bg-gradient-to-b from-[#110f17] to-[#0c0a0f] border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden"
      >
        {/* Decorative background nebula glow */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800/80 pb-5 mb-6 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 flex items-center justify-center bg-amber-500/10 border border-amber-500/30 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Activity className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block">Interactive Vedic Chart Analysis</span>
              <h3 className="text-2xl font-serif font-bold text-white tracking-wider uppercase flex items-center gap-2">
                Vedic Bhava House Map
              </h3>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-500 bg-amber-500/5 border border-amber-500/15 px-4 py-2 rounded-full uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            {name}'s Live Placement Matrix
          </span>
        </div>

        {/* Informational intro */}
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl mb-8 font-sans">
          Vedic Astrology maps your entire life trajectory across <strong className="text-amber-400 font-semibold">12 distinct Bhavas (Houses)</strong>. Clicking or tapping any segment on the traditional North Indian diamond chart below reveals its karmic meaning, your planet occupants, and active planetary warnings instantly.
        </p>

        {/* Interactive Layout Grid: SVG on Left, Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Expanded North Indian Style Interactive SVG Chart */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-[380px] sm:max-w-[450px] aspect-square p-3 bg-gradient-to-b from-[#09080d] to-[#0d0b12] border border-zinc-850 rounded-3xl shadow-[inset_0_0_50px_rgba(0,0,0,0.95),0_15px_45px_rgba(0,0,0,0.7)] flex items-center justify-center overflow-hidden"
            >
              {/* Outer Golden Border Framing */}
              <div className="absolute inset-0 border-2 border-amber-500/15 rounded-[22px] pointer-events-none m-1.5" />
              
              <svg 
                viewBox="0 0 300 300" 
                className="w-full h-full overflow-visible"
              >
                {/* SVG Definitions for gradients and glows */}
                <defs>
                  <radialGradient id="house-glow-active" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#09080d" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="house-glow-critical" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#09080d" stopOpacity="0" />
                  </radialGradient>
                  <filter id="gold-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Interactive House Polygons with dynamic fills based on selection */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
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

                  const isSelected = selectedHouse === houseNum;
                  const hasCriticalIssues = getHouseAlerts(houseNum).length > 0;

                  let fillStyle = "transparent";
                  if (isSelected) {
                    fillStyle = hasCriticalIssues ? "rgba(239, 68, 68, 0.18)" : "rgba(245, 158, 11, 0.16)";
                  }

                  return (
                    <polygon
                      key={`poly-${houseNum}`}
                      points={pointsMap[houseNum]}
                      fill={fillStyle}
                      stroke={isSelected ? "#f59e0b" : "rgba(255, 255, 255, 0.08)"}
                      strokeWidth={isSelected ? "2.5" : "1"}
                      className="transition-all duration-300 cursor-pointer hover:fill-amber-500/5"
                      onClick={() => setSelectedHouse(houseNum)}
                      filter={isSelected ? "url(#gold-neon-glow)" : undefined}
                    />
                  );
                })}

                {/* Classic North Indian Chart Grid Lines with elevated details */}
                <line x1="0" y1="0" x2="300" y2="300" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" className="pointer-events-none" />
                <line x1="300" y1="0" x2="0" y2="300" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" className="pointer-events-none" />
                <line x1="150" y1="0" x2="300" y2="150" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" className="pointer-events-none" />
                <line x1="300" y1="150" x2="150" y2="300" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" className="pointer-events-none" />
                <line x1="150" y1="300" x2="0" y2="150" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" className="pointer-events-none" />
                <line x1="0" y1="150" x2="150" y2="0" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1" className="pointer-events-none" />
                <rect x="0" y="0" width="300" height="300" fill="none" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="2.5" className="pointer-events-none" />

                {/* House Numbers and Occupants Overlay */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((houseNum) => {
                  const textCoordsMap: Record<number, { x: number; y: number }> = {
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

                  const coords = textCoordsMap[houseNum];
                  const occupants = getHouseOccupants(houseNum);
                  const isSelected = selectedHouse === houseNum;
                  const hasAlerts = getHouseAlerts(houseNum).length > 0;

                  return (
                    <g key={`text-g-${houseNum}`} className="pointer-events-none select-none">
                      {/* House Label */}
                      <text
                        x={coords.x}
                        y={coords.y - 12}
                        textAnchor="middle"
                        className={`font-serif font-extrabold text-[13px] ${
                          isSelected 
                            ? "fill-amber-400 font-black scale-110" 
                            : hasAlerts 
                              ? "fill-red-400 font-bold" 
                              : "fill-zinc-500"
                        }`}
                      >
                        {houseNum}
                      </text>

                      {/* Aspects Summary Label */}
                      <text
                        x={coords.x}
                        y={coords.y}
                        textAnchor="middle"
                        className="text-[6.5px] fill-zinc-400 font-sans tracking-tight"
                        opacity={isSelected ? "1" : "0.75"}
                      >
                        {bhavasData[houseNum].aspects.split(",")[0]}
                      </text>

                      {/* Occupant Planet Glyphs inside each house cell */}
                      {occupants.map((o: any, idx: number) => (
                        <text
                          key={`${houseNum}-planet-${idx}`}
                          x={coords.x}
                          y={coords.y + 13 + (idx * 10)}
                          textAnchor="middle"
                          className={`font-mono text-[8px] font-bold tracking-tight ${
                            o.name === "Mars" ? "fill-red-400 animate-pulse font-extrabold" :
                            o.name === "Saturn" ? "fill-amber-300" : "fill-emerald-400"
                          }`}
                        >
                          {getPlanetSymbol(o.name)}
                        </text>
                      ))}
                    </g>
                  );
                })}
              </svg>
            </motion.div>
            
            {/* Legend guide */}
            <div className="mt-5 flex gap-6 text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse" /> Fiery (Dosha Alert)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Selected House
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Planet Occupant
              </span>
            </div>
          </div>

          {/* RIGHT: Dynamic Bhava Decryption Panel */}
          <div className="lg:col-span-6 h-full flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedHouse}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0e0c14] border border-zinc-800/80 p-6 rounded-2xl shadow-xl flex-grow flex flex-col justify-between"
              >
                {/* Title & Core Meta */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800 shadow-inner">
                        {bhavasData[selectedHouse].symbol}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">
                          House {selectedHouse} • {bhavasData[selectedHouse].sanskritName}
                        </span>
                        <h4 className="text-xl font-serif font-bold text-white tracking-wide">
                          {bhavasData[selectedHouse].aspects}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="bg-[#15131f]/50 border border-zinc-800/60 p-4 rounded-xl text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                    {bhavasData[selectedHouse].description}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">Anatomical System</span>
                      <strong className="text-zinc-300 text-xs font-sans mt-0.5 block">{bhavasData[selectedHouse].bodyPart}</strong>
                    </div>
                    <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase block">Sign Lordship</span>
                      <strong className="text-amber-400 text-xs font-sans mt-0.5 block">
                        {kundaliResult.boyChart?.houses?.find((h: any) => h.houseNumber === selectedHouse)?.signName || "Unknown"} (Lord: {lex(kundaliResult.boyChart?.houses?.find((h: any) => h.houseNumber === selectedHouse)?.lord || "None")})
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Planets residing in this House */}
                <div className="mt-5 space-y-3">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block border-b border-zinc-850 pb-1">Occupant Planets in Birth Chart</span>
                  {getHouseOccupants(selectedHouse).length > 0 ? (
                    <div className="space-y-2">
                      {getHouseOccupants(selectedHouse).map((p: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-[#14121d] border border-zinc-850/60 p-2.5 rounded-xl">
                          <span className="text-xs text-zinc-200 font-sans flex items-center gap-2">
                            <span className="text-amber-400 font-semibold">{getPlanetSymbol(p.name)}</span>
                            <span className="text-zinc-400 font-medium">{lex(p.name)}</span>
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">Position: {p.degree.toFixed(2)}° inside Sign</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-zinc-500 italic bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900 text-center">
                      No physical planets occupy this house. Life aspects are projected purely by the house lord's placement and transits.
                    </div>
                  )}
                </div>

                {/* Dynamic Vedic Diagnostics & Warning Analysis */}
                <div className="mt-5">
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block border-b border-zinc-850 pb-1 mb-2">Vedic Diagnostics Log</span>
                  {getHouseAlerts(selectedHouse).length > 0 ? (
                    <div className="space-y-2">
                      {getHouseAlerts(selectedHouse).map((alert, i) => (
                        <div key={i} className="bg-red-500/5 border border-red-900/30 p-3 rounded-xl flex items-start gap-2.5 text-red-300">
                          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
                          <p className="text-[11px] sm:text-xs leading-relaxed font-sans">{alert}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-500/5 border border-emerald-900/20 p-3 rounded-xl flex items-start gap-2.5 text-emerald-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] sm:text-xs leading-relaxed font-sans">
                        This sector carries a harmonious, clear planetary footprint. Your celestial energies align naturally without generating active doshas or structural layout frictions.
                      </p>
                    </div>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </motion.div>

      {/* SECTION B: DETAILED CELESTIAL DOSHA FLASHCARDS */}
      <div className="space-y-6">
        {/* Subtitle */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-purple-500/10 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block">Vedic Diagnostics Deck</span>
            <h3 className="text-lg font-bold font-serif text-white tracking-widest uppercase">
              Astrological Audit Cards
            </h3>
          </div>
        </div>

        {/* CSS GRID ensuring perfect, non-overlapping responsive column alignment with high hover z-index */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-2">
          {translatedCardsData.map((card) => {
            const isAbsent = card.status === "Absent";
            const isCancelled = card.status === "Cancelled";
            const isFlipped = flippedCards[card.id] || false;
            const currentTab = cardTabs[card.id] || "validation";

            return (
              <div 
                key={card.id} 
                id={`card-container-${card.id}`}
                className="w-full h-[520px] perspective-1000 group relative z-10 hover:z-50 focus-within:z-50 transition-all duration-300"
              >
                <motion.div
                  className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
                  whileHover={{ scale: 1.025, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* FRONT */}
                  <div 
                    onClick={() => toggleFlip(card.id)}
                    className={`absolute inset-0 backface-hidden bg-gradient-to-br from-[#121118] to-[#161422] border-2 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
                      isFlipped ? "pointer-events-none opacity-0 invisible" : ""
                    } ${
                      isAbsent ? "border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.06)]" :
                      isCancelled ? "border-sky-500/30 shadow-[0_0_25px_rgba(14,165,233,0.06)]" :
                      "border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.06)]"
                    }`}
                  >
                    {/* Large animated Yantra backing */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 group-hover:opacity-10 group-hover:scale-105 transition-all duration-700">
                      <svg width="280" height="280" viewBox="0 0 200 200" fill="none" className="text-amber-500 animate-pulse" style={{ animationDuration: "25s" }}>
                        <path d="M10,10 L190,190 M190,10 L10,190" stroke="currentColor" strokeWidth="0.5" />
                        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
                        <rect x="50" y="50" width="100" height="100" stroke="currentColor" strokeWidth="0.5" />
                      </svg>
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-zinc-800/60 pb-3.5 relative z-10">
                      <div className="flex items-center gap-3">
                        <span className={`${isAbsent ? "text-emerald-400" : isCancelled ? "text-sky-400" : "text-red-400 animate-pulse"}`}>
                          {card.icon}
                        </span>
                        <div>
                          <span className="text-xs font-mono tracking-widest text-[#fbbf24] uppercase font-black block leading-none">
                            {card.title}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                            {card.subtitle}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        isAbsent ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        isCancelled ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                        "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {getLocalizedStatus(card.status, language)}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="my-auto relative z-10 space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 bg-zinc-950/40 px-3 py-1.5 rounded-lg border border-zinc-900">
                        <span>{card.metaLabel}</span>
                        <span>{card.metaClass}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans bg-[#13121a]/80 border border-zinc-800/50 p-4 rounded-xl shadow-inner font-normal">
                        {card.frontDescription}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center relative z-10 border-t border-zinc-800/60 pt-3">
                      <span className="text-[10px] font-mono text-amber-500/95 uppercase tracking-widest flex items-center gap-1.5 font-bold animate-pulse">
                        <RotateCw className="w-3.5 h-3.5" /> {localUiTranslations[language]?.tapToUnveil || "Tap to Unveil 3-Layer Diagnostics"}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500">{localUiTranslations[language]?.validationLive || "Validation Engine Live"}</span>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-[#0f0e15] border-2 border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl overflow-hidden transition-all duration-300 ${
                    !isFlipped ? "pointer-events-none opacity-0 invisible" : ""
                  }`}>
                    <div className="absolute inset-0 bg-[#08070c]/70 pointer-events-none" />
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      
                      {/* Card Title & Header */}
                      <div className="flex justify-between items-center border-b border-zinc-850 pb-2.5">
                        <span className="text-xs font-mono text-amber-400 uppercase font-black tracking-widest">
                          {localUiTranslations[language]?.diagnosticEngine || "3-Layer Diagnostic Engine"}
                        </span>
                        <div className="flex bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800 shadow-inner">
                          <button
                            type="button"
                            onClick={(e) => setCardTab(card.id, "astro", e)}
                            className={`px-2 py-1 text-[9px] font-mono rounded-md font-bold uppercase transition-all ${
                              currentTab === "astro" 
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md" 
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {localUiTranslations[language]?.astro || "Astro"}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => setCardTab(card.id, "classic", e)}
                            className={`px-2 py-1 text-[9px] font-mono rounded-md font-bold uppercase transition-all ${
                              currentTab === "classic" 
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md" 
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {localUiTranslations[language]?.classic || "Classic"}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => setCardTab(card.id, "validation", e)}
                            className={`px-2 py-1 text-[9px] font-mono rounded-md font-bold uppercase transition-all ${
                              currentTab === "validation" 
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md" 
                                : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {localUiTranslations[language]?.valid || "Valid"}
                          </button>
                        </div>
                      </div>

                      {/* Diagnostic Content Area */}
                      <div className="my-auto overflow-y-auto max-h-[350px] pr-1 py-2 custom-scrollbar">
                        <AnimatePresence mode="wait">
                          {currentTab === "astro" && (
                            <motion.div
                              key="astro-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="space-y-3 text-[11px] leading-relaxed font-sans text-zinc-300"
                            >
                              <div className="bg-[#14121a]/90 p-3 rounded-xl border border-zinc-850/80 space-y-2">
                                <h5 className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <Cpu className="w-3.5 h-3.5 text-amber-400" /> {localUiTranslations[language]?.layer1 || "Layer 1: High-Precision Ephemeris"}
                                </h5>
                                <p className="text-[11px] text-zinc-400">
                                  {card.astro.content}
                                </p>
                              </div>
                            </motion.div>
                          )}

                          {currentTab === "classic" && (
                            <motion.div
                              key="classic-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="space-y-3 text-[11px] leading-relaxed font-sans text-zinc-300"
                            >
                              <div className="bg-[#14121a]/90 p-3 rounded-xl border border-zinc-850/80 space-y-2">
                                <h5 className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5 text-amber-400" /> {localUiTranslations[language]?.layer2 || "Layer 2: Shastric Canonical Rules"}
                                </h5>
                                <p className="text-[11px] text-zinc-400">
                                  {language === "hi" ? `शास्त्रीय वंशों में सत्यापित जो ${card.title} के सटीक मापदंडों को दर्शाता है:` :
                                   language === "bn" ? `শাস্ত্রীয় বংশধারা জুড়ে যাচাই করা হয়েছে যা ${card.title} এর সুনির্দিষ্ট পরামিতিগুলি ম্যাপ করে:` :
                                   language === "mr" ? `शास्त्रीय वंशावळींमध्ये सत्यापित जे ${card.title} च्या अचूक घटकांना दर्शवते:` :
                                   language === "gu" ? `શાસ્ત્રીય વંશાવળીઓમાં ચકાસાયેલ છે જે ${card.title} ના ચોક્કસ પરિમાણો નકશા કરે છે:` :
                                   `Validated across classical lineages mapping the precise parameters of ${card.title}:`}
                                </p>
                              </div>
                              <ul className="space-y-2 pl-1">
                                {card.classic.bullets.map((bullet, bIdx) => (
                                  <li key={bIdx} className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-900">
                                    <strong className="text-amber-400 font-mono text-[9.5px] block">{bullet.title}</strong>
                                    {bullet.text}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          {currentTab === "validation" && (
                            <motion.div
                              key="validation-tab"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="space-y-3 text-[11px]"
                            >
                              <div className="bg-[#14121a]/90 p-3 rounded-xl border border-zinc-850/80 space-y-1 text-zinc-400 font-sans">
                                <h5 className="text-[10px] font-mono text-zinc-300 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> {localUiTranslations[language]?.layer3 || "Layer 3: Independent Cross-Check"}
                                </h5>
                                <p className="text-[11px]">
                                  {language === "hi" ? `यह माध्यमिक ग्रहों के फिल्टर के आधार पर ${card.title} की अंतिम उपस्थिति या निरस्तीकरण को निर्धारित करता है।` :
                                   language === "bn" ? `এটি দ্বিতীয় স্তরের গ্রহের ফিল্টারগুলির উপর ভিত্তি করে ${card.title} এর চূড়ান্ত উপস্থিতি বা বাতিলকরণ নির্ধারণ করে।` :
                                   language === "mr" ? `हे दुय्यम ग्रहांच्या फिल्टरवर आधारित ${card.title} चे अंतिम अस्तित्व किंवा रद्दता ठरवते.` :
                                   language === "gu" ? `આ ગૌણ ગ્રહોના ફિલ્ટર્સના આધારે ${card.title} ની અંતિમ હાજરી અથવા રદબાતલ નક્કી કરે છે.` :
                                   `Determines final presence or cancellation of ${card.title} based on secondary planetary filters.`}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-900 font-mono text-[9.5px] text-zinc-400 space-y-1">
                                  <div className="flex justify-between">
                                    <span>{language === "hi" ? "1. मूल स्थिति:" : language === "bn" ? "১. মূল শর্ত:" : language === "mr" ? "1. मूळ अट:" : language === "gu" ? "1. મૂળ શરત:" : "1. Base Condition:"}</span>
                                    <span className={isAbsent ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                                      {isAbsent 
                                        ? (language === "hi" ? "उत्तीर्ण (कोई दोष नहीं)" : language === "bn" ? "উত্তীর্ণ (কোনো সংগতি নেই)" : language === "mr" ? "उत्तीर्ण (दोष नाही)" : language === "gu" ? "ઉત્તીર્ણ (કોઈ દોષ નથી)" : "PASSED (NO ALIGNMENT)")
                                        : (language === "hi" ? "पाया गया" : language === "bn" ? "শনাক্ত" : language === "mr" ? "आढळले" : language === "gu" ? "મળી આવ્યું" : "DETECTED")
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>{language === "hi" ? "2. शमन अपवाद (Mitigations):" : language === "bn" ? "২. উপশम ব্যতিক্রম:" : language === "mr" ? "2. शमन अपवाद:" : language === "gu" ? "2. શમન અપવાદ:" : "2. Mitigation Exceptions:"}</span>
                                    <span className={isCancelled ? "text-sky-400 font-bold" : "text-zinc-400 font-bold"}>
                                      {isCancelled 
                                        ? (language === "hi" ? "सक्रिय निरस्तीकरण" : language === "bn" ? "সক্রিয় বাতিলকরণ" : language === "mr" ? "सक्रिय रद्द" : language === "gu" ? "સક્રિય રદ" : "ACTIVE CANCEL")
                                        : (language === "hi" ? "कोई नहीं" : language === "bn" ? "প্রযোজ্য নয়" : language === "mr" ? "काहीही नाही" : language === "gu" ? "કંઈ લાગુ નથી" : "NONE APPLIED")
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>{language === "hi" ? "3. सत्यापन जांच:" : language === "bn" ? "৩. যাচাইকরণ পরীক্ষা:" : language === "mr" ? "3. पडताळणी तपासणी:" : language === "gu" ? "3. ચકાસણી તપાસ:" : "3. Validation Check:"}</span>
                                    <span className="text-zinc-300 font-bold">
                                      {language === "hi" ? "सत्यापित" : language === "bn" ? "যাচাইকৃত" : language === "mr" ? "पडताळणीकृत" : language === "gu" ? "ચકાસાયેલ" : "Verified"}
                                    </span>
                                  </div>
                                  <div className="border-t border-zinc-900/60 pt-1.5 mt-1.5 space-y-1 font-mono text-[9px]">
                                    <div className="flex justify-between text-zinc-400">
                                      <span>{localUiTranslations[language]?.primaryChart || "Primary Chart Focus"}:</span>
                                      <span className="text-amber-400 font-bold">{card.primaryChart}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                      <span>{localUiTranslations[language]?.additionalCharts || "Additional Chart Verification"}:</span>
                                      <span className="text-[#fbbf24] font-bold text-right">{card.additionalCharts}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 font-sans text-xs text-zinc-300 leading-relaxed space-y-1">
                                  <strong className="text-amber-400 block text-[10px] font-mono">
                                    {localUiTranslations[language]?.crossCheckedVerdict || "Cross-Checked Verdict"}:
                                  </strong>
                                  <span>{card.validation.verdict}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Back Action Trigger */}
                      <div 
                        onClick={() => toggleFlip(card.id)}
                        className="border-t border-zinc-850 pt-2 flex justify-between items-center text-[9px] font-mono text-zinc-500 cursor-pointer hover:text-amber-400 transition-colors"
                      >
                        <span>{localUiTranslations[language]?.vettingEngine || "CLASSICAL VEDIC VETTING ENGINE"}</span>
                        <span className="text-amber-500 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                          <RotateCw className="w-3 h-3" /> {localUiTranslations[language]?.tapToFlipBack || "Tap Card to Flip Back"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION B: DIVISIONAL CHART (VARGAS) VETTING MATRIX REFERENCE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-[#0f0e15] border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase block font-bold">
                {localUiTranslations[language]?.vargasSubtitle || "Vargas System Verification"}
              </span>
              <h4 className="text-base font-bold font-serif text-white tracking-wide uppercase">
                {localUiTranslations[language]?.vargasTitle || "Kundali Divisional Chart Vetting Guide"}
              </h4>
            </div>
          </div>
          <div className="text-xs text-zinc-500 font-mono">
            {localUiTranslations[language]?.vargasTableSource || "Source: Shastric Canonical Verification Guidelines"}
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl mb-6">
          {localUiTranslations[language]?.vargasTableIntro || "While the primary birth chart (D1) outlines the seed energetic potential and immediate life conditions, Vedic astrology employs high-precision divisional harmonic charts (Vargas) to cross-check, confirm, and determine the structural severity or cancellation of various planetary combinations and Doshas."}
        </p>

        <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/40">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/40 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                <th className="p-4 font-bold text-amber-500">
                  {localUiTranslations[language]?.vargasThDosha || "Dosha / Affliction"}
                </th>
                <th className="p-4 font-bold">
                  {localUiTranslations[language]?.vargasThPrimary || "Primary Chart"}
                </th>
                <th className="p-4 font-bold">
                  {localUiTranslations[language]?.vargasThHarmonic || "Additional / Harmonic Charts used for Vetting"}
                </th>
                <th className="p-4 font-bold text-right">
                  {localUiTranslations[language]?.vargasThProtocol || "Verification Protocol"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              {getVargasRows(language).map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/20 transition-all">
                  <td className="p-4 font-mono font-bold text-[#fbbf24]">{row.dosha}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 font-mono text-[10px] border border-zinc-800">
                      {row.primary}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-400">{row.harmonic}</td>
                  <td className="p-4 text-right text-zinc-400 font-sans text-[11px]">{row.protocol}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
