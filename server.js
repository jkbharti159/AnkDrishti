import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Server-side Gemini Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Helper to retry Gemini API call with exponential backoff and model fallback
  async function generateWithRetryAndFallback(ai, modelName, prompt) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("No GEMINI_API_KEY configured");
    }

    const maxRetries = 3;
    let delay = 1000;
    let lastError = null;

    // 1. Try Primary Model (gemini-3.5-flash)
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini API] Primary Model Attempt ${attempt}/${maxRetries} (${modelName})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        if (response && response.text) {
          console.log(`[Gemini API] Primary Model Succeeded!`);
          return response.text;
        }
        throw new Error("Empty response from model");
      } catch (error) {
        lastError = error;
        console.warn(`[Gemini API] Primary Model Attempt ${attempt} failed:`, error.message || error);
        
        // Exponential backoff
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
    }

    // 2. Try Fallback Model (gemini-3.1-flash-lite)
    const fallbackModel = 'gemini-3.1-flash-lite';
    try {
      console.log(`[Gemini API] Primary model failed. Attempting fallback model: ${fallbackModel}...`);
      const response = await ai.models.generateContent({
        model: fallbackModel,
        contents: prompt,
      });
      if (response && response.text) {
        console.log(`[Gemini API] Fallback Model Succeeded!`);
        return response.text;
      }
    } catch (error) {
      console.error(`[Gemini API] Fallback Model ${fallbackModel} failed:`, error.message || error);
    }

    throw lastError || new Error("Gemini generation failed");
  }

  // Offline/Local High-Fidelity Astrological Interpretation Engine (Backup)
  const offlineTranslations = {
    hi: {
      singleTitle: "व्यक्तिगत वैदिक कुंडली रिपोर्ट",
      singleSub: "उच्च-सटीकता वैदिक खगोलीय इंजन के माध्यम से जनरेट किया गया",
      ascendantTitle: "1. लग्न और आत्मा टेम्पलेट (लग्न और राशि)",
      risingSignText: "लग्न राशि",
      moonSignText: "चंद्र राशि",
      moonNakText: "नक्षत्र",
      keyStrengthTitle: "2. मुख्य ग्रहीय ताकतें और जीवन का फोकस",
      doshasTitle: "3. ब्रह्मांडीय बाधाएं और आशीर्वाद (दोष ऑडिट)",
      currentTitle: "4. वर्तमान अध्याय (महादशा और गोचर)",
      runningMahadasha: "सक्रिय महादशा",
      disclaimer: "अस्वीकरण: यह रिपोर्ट आपके सटीक खगोलीय मापदंडों का उपयोग करके जनरेट की गई है। स्वतंत्र इच्छा और सचेत विकल्प ब्रह्मांड में सर्वोच्च शक्तियां बने हुए हैं।",
      matchTitle: "वैदिक गुण मिलान अनुकूलता रिपोर्ट",
      matchFor: "के लिए",
      cosmicResTitle: "1. ब्रह्मांडीय अनुनाद (चंद्र राशि संरेखण)",
      kootasTitle: "2. अष्टकूट विश्लेषण और आध्यात्मिक सद्भाव",
      eightFields: "अनुकूलता के आठ क्षेत्र:",
      coreShastric: "मुख्य शास्त्रीय विश्लेषण",
      highStrengths: "उच्च स्कोरिंग ताकतें",
      frictionPoints: "घर्षण बिंदु (भकूट, गण, या नाड़ी चुनौतियाँ)",
      dailyKarma: "3. दैनिक कर्म और आगे का रास्ता",
      activeSadeSati: "सक्रिय (शनि चंद्र राशि के निकट गोचर कर रहे हैं)",
      notActiveSadeSati: "सक्रिय नहीं",
      activeAxis: "सक्रिय अक्ष (राहु/केतु प्रथम/सप्तम भाव में)",
      clearAxis: "स्पष्ट",
      present: "मौजूद",
      absent: "अनुपस्थित",
      cancelled: "निरस्त",
      active: "सक्रिय",
      detected: "पाया गया",
      mangalCan: "मंगल की अग्नि निष्क्रिय (निरस्त मांगलिक)",
      mangalCanText: "मंगल शारीरिक रूप से एक चुनौतीपूर्ण भाव में स्थित है, लेकिन विशिष्ट खगोलीय स्थितियों ने इसे पूरी तरह से बेअसर कर दिया है। पराशर और फलदीपिका के अनुसार, स्वराशि या उच्च राशि का मंगल दोष को रद्द करता है।",
      mangalAbs: "समानुपातिक संरेखण (कोई मांगलिक दोष नहीं)",
      mangalAbsText: "मंगल किसी भी गतिशील संबंध भाव (1, 2, 4, 7, 8, 12) में नहीं है, इसलिए कोई मांगलिक दोष सक्रिय नहीं है।",
      mangalPre: "सक्रिय मंगल संरेखण (मांगलिक दोष)",
      mangalPreText: "मंगल एक महत्वपूर्ण संबंध भाव में स्थित है, जो वैवाहिक और संबंध क्षेत्रों में ऊर्जावान गर्मी का संचार करता है।",
      sadesatiActiveText: "आप वर्तमान में शनि के साढ़े साती चक्र से गुजर रहे हैं। यह धैर्य, अनुशासन और आध्यात्मिक विकास का एक महत्वपूर्ण चरण है।",
      sadesatiInactiveText: "आप वर्तमान में साढ़े साती के भारी प्रभावों से मुक्त हैं, जो आपके रचनात्मक लक्ष्यों को आसानी से पूरा करने में मदद करता है।",
      rahuketuActiveText: "राहु और केतु आपके पहले और सातवें भाव में हैं, जो आत्म और साथी के बीच संतुलन और गहरे विकास की मांग करते हैं।",
      rahuketuInactiveText: "राहु-केतु अक्ष अन्य भावों में संतुलित है, जिससे आपके संबंध स्वाभाविक रूप से विकसित हो सकते हैं।",
      kaalsarpActiveText: "सभी ग्रह राहु और केतु के बीच घिरे हुए हैं, जो अत्यधिक ध्यान, दृढ़ संकल्प और आध्यात्मिक जागृति के मार्ग को खोलते हैं।",
      kaalsarpInactiveText: "आपके ग्रह ब्रह्मांड में सामंजस्यपूर्ण रूप से वितरित हैं, जो जीवन के विभिन्न क्षेत्रों में ऊर्जा का संतुलित प्रवाह प्रदान करते हैं।"
    },
    bn: {
      singleTitle: "ব্যক্তিগত বৈদিক রাশিফল রিপোর্ট",
      singleSub: "উচ্চ-সরাসরি বৈদিক জ্যোতির্বিদ্যা ইঞ্জিন দ্বারা প্রস্তুত",
      ascendantTitle: "১. লগ্ন এবং আত্মার টেমপ্লেট (লগ্ন ও রাশি)",
      risingSignText: "লগ্ন রাশি",
      moonSignText: "চন্দ্র রাশি",
      moonNakText: "নক্ষত্র",
      keyStrengthTitle: "২. মূল গ্রহের শক্তি এবং জীবন ফোকাস",
      doshasTitle: "৩. মহাজাগতিক বাধা ও আশীর্বাদ (দোষ অডিট)",
      currentTitle: "৪. বর্তমান অধ্যায় (মহাদশা ও গোচর)",
      runningMahadasha: "চলতি মহাদশা",
      disclaimer: "দাবিত্যাগ: এই রিপোর্ট আপনার সুনির্দিষ্ট জ্যোতির্বিদ্যা প্যারামিটার ব্যবহার করে প্রস্তুত করা হয়েছে। মুক্ত ইচ্ছা এবং সচেতন পছন্দ মহাবিশ্বের সর্বোচ্চ শক্তি হিসেবে অব্যাহত থাকে।",
      matchTitle: "বৈদিক গুণ মিলান সামঞ্জস্যপূর্ণ রিপোর্ট",
      matchFor: "এর জন্য",
      cosmicResTitle: "১. মহাজাগতিক অনুরণন (চন্দ্র রাশি বিন্যাস)",
      kootasTitle: "২. অষ্টকূটের বিশ্লেষণ এবং আধ্যাত্মিক সম্প্রীতি",
      eightFields: "সামঞ্জস্যের আটটি ক্ষেত্র:",
      coreShastric: "মূল শাস্ত্রীয় বিশ্লেষণ",
      highStrengths: "উচ্চ স্কোরিং শক্তি",
      frictionPoints: "ঘর্ষণ বিন্দু (ভকূট, গণ, বা নাড়ী চ্যালেঞ্জ)",
      dailyKarma: "৩. দৈনিক কর্ম ও এগিয়ে যাওয়ার পথ",
      activeSadeSati: "সক্রিয় (শনি চন্দ্র রাশির নিকটবর্তী ঘরে গোচর করছে)",
      notActiveSadeSati: "সক্রিয় নয়",
      activeAxis: "সক্রিয় অক্ষ (রাহু/কেতু ১ম/৭ম ঘরে)",
      clearAxis: "স্বচ্ছ",
      present: "উপস্থিত",
      absent: "অনুপস্থিত",
      cancelled: "বাতিল",
      active: "সক্রিয়",
      detected: "শনাক্ত",
      mangalCan: "মঙ্গলের অগ্নি নিষ্ক্রিয় (বাতিল মাঙ্গলিক)",
      mangalCanText: "মঙ্গলের অগ্নি চ্যালেঞ্জিং ঘরে অবস্থান করার পরেও, বিশেষ গ্রহীয় অবস্থানের কারণে মাঙ্গলিক দোষ বাতিল হয়ে গেছে।",
      mangalAbs: "সামঞ্জস্যপূর্ণ অবস্থান (কোনো মাঙ্গলিক দোষ নেই)",
      mangalAbsText: "মঙ্গল কোনো সম্পর্ক বিষয়ক ঘরে (১, ২, ৪, ৭, ৮, ১২) অবস্থান করছে না, তাই কোনো মাঙ্গলিক দোষ নেই।",
      mangalPre: "সক্রিয় মঙ্গল বিন্যাস (মাঙ্গলিক দোষ)",
      mangalPreText: "মঙ্গল একটি গুরুত্বপূর্ণ ঘরে অবস্থান করে সম্পর্কে তীব্র শক্তি ও আবেগ সৃষ্টি করছে, যা সচেতন আলোচনার দাবি রাখে।",
      sadesatiActiveText: "আপনি বর্তমানে শনির সাড়ে সাতি চক্রের মধ্য দিয়ে যাচ্ছেন। এটি ধৈর্য, শৃঙ্খলা এবং আধ্যাত্মিক উন্নতির একটি গুরুত্বপূর্ণ সময়।",
      sadesatiInactiveText: "আপনি বর্তমানে সাড়ে সাতির প্রভাব থেকে মুক্ত রয়েছেন, যা আপনার জীবনকে আরও হালকা ও সহজ করে তোলে।",
      rahuketuActiveText: "রাহু এবং কেতু আপনার ১ম ও ৭ম ঘরে অবস্থান করছে, যা নিজের ও সঙ্গীর মধ্যকার সম্পর্কের ভারসাম্য বজায় রাখার নির্দেশ দেয়।",
      rahuketuInactiveText: "রাহু-কেতু অক্ষ অন্যান্য ঘরে সুষম অবস্থায় রয়েছে, যা সম্পর্ককে স্বাভাবিকভাবে বিকশিত হতে সাহায্য করে।",
      kaalsarpActiveText: "সমস্ত গ্রহ রাহু ও কেতুর মধ্যে সীমাবদ্ধ রয়েছে, যা তীব্র মনোযোগ, সংকল্প এবং আধ্যাত্মিক রূপান্তরের সুযোগ তৈরি করে।",
      kaalsarpInactiveText: "আপনার গ্রহগুলি রাশিচক্রে সুন্দরভাবে ছড়িয়ে রয়েছে, যা জীবনের বিভিন্ন ক্ষেত্রে শক্তির ভারসাম্য বজায় রাখে।"
    },
    mr: {
      singleTitle: "वैयक्तिक वैदिक कुंडली अहवाल",
      singleSub: "उच्च-सत्यता वैदिक खगोलीय इंजिनद्वारे जनरेट केले गेले",
      ascendantTitle: "१. लग्न आणि आत्मा टेम्पलेट (लग्न आणि राशी)",
      risingSignText: "लग्न राशी",
      moonSignText: "चंद्र राशी",
      moonNakText: "नक्षत्र",
      keyStrengthTitle: "२. मुख्य ग्रहांची ताकद आणि जीवनाचे लक्ष",
      doshasTitle: "३. वैश्विक अडथळे आणि आशीर्वाद (कठीण काळ ऑडिट)",
      currentTitle: "४. वर्तमान प्रकरण (महादशा आणि गोचर)",
      runningMahadasha: "सक्रिय महादशा",
      disclaimer: "अस्वीकरण: हा अहवाल तुमच्या अचूक खगोलीय पॅरामीटर्सचा वापर करून जनरेट केला आहे. स्वतंत्र इच्छा आणि जाणीवपूर्वक निवड ही विश्वातील सर्वोच्च शक्ती आहे.",
      matchTitle: "वैदिक गुण मिलान सुसंगतता अहवाल",
      matchFor: "साठी",
      cosmicResTitle: "१. वैश्विक अनुनाद (चंद्र राशी संरेखन)",
      kootasTitle: "२. अष्टकूट विश्लेषण आणि आध्यात्मिक सुसंवाद",
      eightFields: "सुसंगततेचे आठ क्षेत्र:",
      coreShastric: "मुख्य शास्त्रीय विश्लेषण",
      highStrengths: "उच्च-स्कोअरिंग ताकद",
      frictionPoints: "घर्षण बिंदू (भकूट, गण, किंवा नाडी आव्हाने)",
      dailyKarma: "३. दैनिक कर्म आणि पुढे जाण्याचा मार्ग",
      activeSadeSati: "सक्रिय (शनी चंद्र राशीच्या जवळ गोचर करत आहे)",
      notActiveSadeSati: "सक्रिय नाही",
      activeAxis: "सक्रिय अक्ष (राहू/केतू पहिल्या/सातव्या स्थानात)",
      clearAxis: "स्पष्ट",
      present: "उपस्थित",
      absent: "अनुपस्थित",
      cancelled: "निरस्त",
      active: "सक्रिय",
      detected: "आढळले",
      mangalCan: "मंगळ अग्नि निष्प्रभ (निरस्त मांगलिक)",
      mangalCanText: "मंगळ आव्हानात्मक स्थानात असला तरी विशिष्ट खगोलीय योग किंवा गुरूच्या दृष्टीमुळे मांगलिक दोष पूर्णपणे रद्द झाला आहे.",
      mangalAbs: "संतुलित संरेखन (मांगलिक दोष नाही)",
      mangalAbsText: "मंगळ कोणत्याही महत्त्वाच्या संबंध स्थानात (१, २, ४, ७, ८, १२) नसल्यामुळे तुमच्या पत्रिकेत मांगलिक दोष नाही.",
      mangalPre: "सक्रिय मंगळ संरेखन (मांगलिक दोष)",
      mangalPreText: "मंगळ एका महत्त्वाच्या संबंध स्थानात स्थित आहे, ज्यामुळे वैवाहिक जीवनात ऊर्जा आणि उष्णता वाढू शकते.",
      sadesatiActiveText: "तुम्ही सध्या शनीच्या साडेसाती चक्रातून जात आहात. हा संयम, शिस्त आणि भावनिक परिपक्वतेचा काळ आहे.",
      sadesatiInactiveText: "तुम्ही सध्या साडेसातीच्या प्रभावापासून मुक्त आहात, ज्यामुळे तुमचे जीवन अधिक हलके आणि प्रगतीशील राहील.",
      rahuketuActiveText: "राहू आणि केतू पहिल्या आणि सातव्या स्थानात आहेत, जे स्वतःचे अस्तित्व आणि जोडीदार यांच्यात समतोल राखण्याचे आव्हान देतात.",
      rahuketuInactiveText: "राहू-केतू अक्ष इतर घरांमध्ये संतुलित आहे, ज्यामुळे तुमचे संबंध सहज आणि नैसर्गिकरित्या विकसित होतील.",
      kaalsarpActiveText: "सर्व ग्रह राहू आणि केतूच्या दरम्यान स्थित आहेत, जे आयुष्यात अत्यंत लक्ष केंद्रित करण्याची आणि आध्यात्मिक प्रगतीची संधी देतात.",
      kaalsarpInactiveText: "तुमचे ग्रह राशीचक्रात अनुकूलपणे पसरलेले आहेत, ज्यामुळे आयुष्यात ऊर्जेचा समतोल आणि स्थिर प्रवाह राहील।"
    },
    gu: {
      singleTitle: "વ્યક્તિગત વૈદિક કુંડળી અહેવાલ",
      singleSub: "ઉચ્ચ-ચોકસાઈ વૈદિક ખગોળીય એન્જિન દ્વારા જનરેટ કરાયેલ",
      ascendantTitle: "૧. લગ્ન અને આત્મા ટેમ્પલેટ (લગ્ન અને રાશી)",
      risingSignText: "લગ્ન રાશી",
      moonSignText: "ચંદ્ર રાશી",
      moonNakText: "નક્ષત્ર",
      keyStrengthTitle: "૨. મુખ્ય ગ્રહીય શક્તિઓ અને જીવનનું કેન્દ્રબિંદુ",
      doshasTitle: "૩. બ્રહ્માંડિય અવરોધો અને આશીર્વાદ (દોષ ઓડિટ)",
      currentTitle: "૪. વર્તમાન પ્રકરણ (મહાદશા અને ગોચર)",
      runningMahadasha: "સક્રિય મહાદશા",
      disclaimer: "ડિસ્ક્લેમર: આ અહેવાલ તમારા સચોટ ખગોળીય પરિમાણોનો ઉપયોગ કરીને જનરેટ કરવામાં આવ્યો છે. મુક્ત ઇચ્છા અને સભાન પસંદગી બ્રહ્માંડમાં સર્વોચ્ચ શક્તિઓ તરીકે ચાલુ રહે છે.",
      matchTitle: "વૈદિક ગુણ મિલન સુસંગતતા અહેવાલ",
      matchFor: "માટે",
      cosmicResTitle: "૧. બ્રહ્માંડિય પ્રતિધ્વનિ (ચંદ્ર રાશી સંરેખણ)",
      kootasTitle: "૨. અષ્ટકૂટ વિશ્લેષણ અને આધ્યાત્મિક સુમેળ",
      eightFields: "સુસંગતતાના આઠ ક્ષેત્રો:",
      coreShastric: "મુખ્ય શાસ્ત્રીય વિશ્લેષણ",
      highStrengths: "ઉચ્ચ સ્કોરિંગ શક્તિઓ",
      frictionPoints: "ઘર્ષણ બિંદુઓ (ભકૂટ, ગણ, અથવા નાડી પડકારો)",
      dailyKarma: "૩. દૈનિક કર્મ અને આગળનો માર્ગ",
      activeSadeSati: "સક્રિય (શનિ ચંદ્ર રાશીના નજીકના ભવનમાં ગોચર કરી રહ્યો છે)",
      notActiveSadeSati: "સક્રિય નથી",
      activeAxis: "સક્રિય અક્ષ (રાહુ/કેતુ પ્રથમ/સાતમા ભાવમાં)",
      clearAxis: "સ્પષ્ટ",
      present: "હાજર",
      absent: "ગેરહાજર",
      cancelled: "રદ",
      active: "સક્રિય",
      detected: "શોધાયેલ",
      mangalCan: "મંગળ અગ્નિ નિષ્ક્રિય (રદ થયેલ માંગલિક)",
      mangalCanText: "મંગળ પડકારજનક ભાવમાં હોવા છતાં, ચોક્કસ શુભ ગ્રહોની દ્રષ્ટિ અથવા નક્ષત્ર ગોઠવણીને લીધે માંગલિક દોષ સંપૂર્ણપણે રદ થયો છે.",
      mangalAbs: "સમપ્રમાણ ગોઠવણી (માંગલિક દોષ નથી)",
      mangalAbsText: "મંગળ કોઈ પણ લગ્ન કે સંબંધના ભાવ (૧, ૨, ૪, ૧૨) માં નથી, તેથી માંગલિક દોષ ગેરહાજર છે.",
      mangalPre: "સક્રિય મંગળ ગોઠવણી (માંગલિક દોષ હાજર)",
      mangalPreText: "મંગળ એક મહત્વપૂર્ણ સંબંધ ભાવમાં સ્થિત છે, જે લગ્ન અને સંબંધોમાં ઉર્જા અને ગરમી લાવે છે.",
      sadesatiActiveText: "તમે હાલમાં શનિના સાડાસાતી ચક્રમાંથી પસાર થઈ રહ્યા છો. આ ધીરજ, શિસ્ત અને આધ્યાત્મિક પરિપક્વતાનો સમયગાળો છે.",
      sadesatiInactiveText: "તમે હાલમાં સાડાસાતીના ભારે પ્રભાવથી મુક્ત છો, જે તમારા લક્ષ્યોને સરળતાથી પ્રાપ્ત કરવામાં મદદ કરે છે.",
      rahuketuActiveText: "રાહુ અને કેતુ તમારા પ્રથમ અને સાતમા ભાવમાં છે, જે વ્યક્તિગત ઓળખ અને ભાગીદારી વચ્ચે સંતુલન જાળવવાનું સૂચવે છે.",
      rahuketuInactiveText: "રાહુ-કેતુ ધરી અન્ય ભાવોમાં સંતુલિત છે, જેથી તમારા સંબંધો કુદરતી રીતે વિકસી શકે.",
      kaalsarpActiveText: "તમામ ગ્રહો રાહુ અને કેતુ વચ્ચે ઘેરાયેલા છે, જે જીવનમાં ભારે ધ્યાન, સંકલ્પ અને આધ્યાત્મિક જાગૃતિ તરફ દોરી જાય છે.",
      kaalsarpInactiveText: "તમારા ગ્રહો બ્રહ્માંડમાં સુમેળભર્યા રીતે વહેંચાયેલા છે, જે જીવનના વિવિધ ક્ષેત્રોમાં સંતુલિત પ્રવાહ આપે છે."
    },
    en: {
      singleTitle: "Personalized Vedic Kundali Report",
      singleSub: "Generated via High-Fidelity Vedic Astronomical Engine",
      ascendantTitle: "1. The Ascendant & Soul Template (Lagna & Rashi)",
      risingSignText: "Rising Sign (Lagna Ascendant)",
      moonSignText: "Moon Sign (Rashi)",
      moonNakText: "Moon Nakshatra",
      keyStrengthTitle: "2. Key Planetary Strengths & Life Focus",
      doshasTitle: "3. Cosmic Hurdles & Blessings (Dosha Audit)",
      currentTitle: "4. The Current Chapter (Mahadasha & Transits)",
      runningMahadasha: "Running Mahadasha",
      disclaimer: "Disclaimer: This report was generated using your precise astronomical parameters with our high-fidelity local Vedic processing engine. Free will and conscious choice remain the supreme forces in the cosmos.",
      matchTitle: "Vedic Guna Milan Compatibility Report",
      matchFor: "For",
      cosmicResTitle: "1. Cosmic Resonance (Moon Sign Alignment)",
      kootasTitle: "2. Koota-by-Koota Breakdown & Spiritual Harmony",
      eightFields: "The Eight Fields of Compatibility:",
      coreShastric: "Core Shastric Analysis",
      highStrengths: "High-Scoring Strengths",
      frictionPoints: "Friction Points (Bhakoot, Gana, or Nadi challenges)",
      dailyKarma: "3. Daily Karma & Path Forward",
      activeSadeSati: "Active (Saturn transiting trans-natal Moon sectors)",
      notActiveSadeSati: "Not Active",
      activeAxis: "Active Axis",
      clearAxis: "Clear",
      present: "Present",
      absent: "Absent",
      cancelled: "Cancelled",
      active: "Active",
      detected: "Detected",
      mangalCan: "Mars Fire Neutralized (Cancelled Manglik)",
      mangalCanText: "Mars is physically placed in a challenging house, but specific astronomical triggers have fully neutralized the negative field.",
      mangalAbs: "Symmetrical Alignment (No Mangal Dosha)",
      mangalAbsText: "Mars does not occupy any of the dynamic relational bhava houses (1, 2, 4, 7, 8, 12). Relationships remain clear.",
      mangalPre: "Active Mars Alignment (Mangal Dosha)",
      mangalPreText: "Mars resides in a crucial relationship house, directing fiery energy directly into your interactive template.",
      sadesatiActiveText: "You are currently navigating the sacred 7.5-year cycle of Saturn (Sade Sati). This represents a major epoch of emotional refinement, encouraging discipline, patience, and profound humility.",
      sadesatiInactiveText: "You are currently free from the heavy transits of Sade Sati. This allows for lighter movement, outward expansion, and rapid consolidation of your creative goals.",
      rahuketuActiveText: "The evolutionary nodal axis lies directly on your personal identity versus relational mirror template. This indicates a deep soul contract to balance individual independence with relationship cooperation.",
      rahuketuInactiveText: "The nodal axis is balanced across other sectors of your chart, allowing your relationships to develop naturally without major structural lessons.",
      kaalsarpActiveText: "All natal planets are hemmed within the Rahu-Ketu nodal axis, creating a Kaal Sarp layout. This channels extreme focus, raw determination, and massive energetic breakthroughs.",
      kaalsarpInactiveText: "Your planets are distributed harmoniously across the zodiac, creating a balanced flow of life energies across multiple areas without major systemic blocks."
    }
  };

  function generateOfflineSingleReport(data) {
    const { 
      name, dob, time, place,
      rashi, nakshatra, nakPada,
      ascSignName, ascDegree,
      mangalStatus, mangalSeverity,
      sadeSati, rahuKetu, kaalSarp,
      currentDasha, planetsBySign,
      language
    } = data;

    const lang = offlineTranslations[language] ? language : "en";
    const dict = offlineTranslations[lang];

    const planetSummaries = planetsBySign ? planetsBySign.map(p => {
      return `- **${p.name}** in **${p.sign || 'Unknown'}** (${p.degree ? p.degree.toFixed(2) : 0}°), Dignity: *${p.dignity || 'Neutral'}*`;
    }).join('\n') : 'No planet placements loaded.';

    // Detailed explanation of Manglik status based on user's exact parameters
    let mangalReportText = "";
    if (mangalStatus === "Cancelled") {
      mangalReportText = `
**${dict.mangalCan}**
- ${dict.mangalCanText}`;
    } else if (mangalStatus === "Absent") {
      mangalReportText = `
**${dict.mangalAbs}**
- ${dict.mangalAbsText}`;
    } else {
      mangalReportText = `
**${dict.mangalPre} (${mangalSeverity})**
- ${dict.mangalPreText}`;
    }

    const localMangalStatus = dict[mangalStatus.toLowerCase()] || mangalStatus;
    const localMangalSeverity = dict[mangalSeverity.toLowerCase()] || mangalSeverity;
    const localSadeSatiStatus = sadeSati ? dict.active : dict.absent;
    const localRahuKetuStatus = rahuKetu ? dict.active : dict.clearAxis;
    const localKaalSarpStatus = kaalSarp ? dict.detected : dict.absent;

    return `
# ${dict.singleTitle} (${name})
*${dict.singleSub}*

---

### ${dict.ascendantTitle}
- **${dict.risingSignText}**: **${ascSignName || 'Unknown'}** (${ascDegree ? ascDegree.toFixed(2) : 0}°)
- **${dict.moonSignText}**: **${rashi || 'Unknown'}**
- **${dict.moonNakText}**: **${nakshatra || 'Unknown'}** (Pada **${nakPada || 1}**)

---

### ${dict.keyStrengthTitle}
${planetSummaries}

---

### ${dict.doshasTitle}
- **Manglik Dosha**: **${localMangalStatus}** (Severity: **${localMangalSeverity}**)
${mangalReportText}

- **Shani Sade Sati**: **${localSadeSatiStatus}**
  *Insight*: ${sadeSati ? dict.sadesatiActiveText : dict.sadesatiInactiveText}

- **Rahu-Ketu Axis**: **${localRahuKetuStatus}**
  *Insight*: ${rahuKetu ? dict.rahuketuActiveText : dict.rahuketuInactiveText}

- **Kaal Sarp Configuration**: **${localKaalSarpStatus}**
  *Insight*: ${kaalSarp ? dict.kaalsarpActiveText : dict.kaalsarpInactiveText}

---

### ${dict.currentTitle}
- **${dict.runningMahadasha}**: **${currentDasha || 'Unknown'}**

---
*${dict.disclaimer}*
`;
  }

  function generateOfflineMatchReport(data) {
    const { 
      partnerAName, partnerBName,
      partnerADob, partnerBDob,
      partnerATime, partnerBTime,
      partnerARashi, partnerBRashi,
      partnerANakshatra, partnerBNakshatra,
      partnerANakPada, partnerBNakPada,
      score, maxScore,
      kootaBreakdown,
      language
    } = data;

    const lang = offlineTranslations[language] ? language : "en";
    const dict = offlineTranslations[lang];

    const kootaRows = kootaBreakdown ? kootaBreakdown.map(k => {
      return `- **${k.category}** (Score: ${k.score}/${k.max}): *${k.significance}*`;
    }).join('\n') : 'No Koota breakdown available.';

    return `
# ${dict.matchTitle}
### ${dict.matchFor} ${partnerAName} & ${partnerBName}

---

### ${dict.cosmicResTitle}
- **${partnerAName} ${dict.moonSignText}**: **${partnerARashi}** (Nakshatra: *${partnerANakshatra}*, Pada ${partnerANakPada})
- **${partnerBName} ${dict.moonSignText}**: **${partnerBRashi}** (Nakshatra: *${partnerBNakshatra}*, Pada ${partnerBNakPada})

---

### ${dict.kootasTitle}
${dict.eightFields} **${score}/${maxScore}**

${kootaRows}

#### **${dict.coreShastric}**:
- **${dict.highStrengths}**: Areas with full scores indicate sectors where your energies flow together effortlessly.
- **${dict.frictionPoints}**: Low scores in specific kootas are pointers, not barriers. A Nadi challenge suggests balancing biological rhythms; a Bhakoot challenge points to balancing mutual growth speeds; a Gana challenge invites you to respect each other's temperament style.

---

### ${dict.dailyKarma}
Vedic astrology teaches that the stars impel, but never compel. Your Guna score of **${score}/36** is a map of the default baseline energies, but your **free will, conscious choice, and loving commitment** are the ultimate co-creators of your future.

---
*${dict.disclaimer}*
`;
  }

  // API endpoint for Kundali calculations interpret and match
  app.post('/api/kundali-interpret', async (req, res) => {
    try {
      const { 
        partnerAName, partnerBName,
        partnerADob, partnerBDob,
        partnerATime, partnerBTime,
        partnerARashi, partnerBRashi,
        partnerANakshatra, partnerBNakshatra,
        partnerANakPada, partnerBNakPada,
        score, maxScore,
        kootaBreakdown,
        language
      } = req.body;

      // Select model
      const modelName = 'gemini-3.5-flash';

      const langNames = {
        en: "English",
        hi: "Hindi (हिंदी)",
        bn: "Bengali (বাংলা)",
        mr: "Marathi (मराठी)",
        gu: "Gujarati (ગુજરાતી)"
      };
      const languageName = langNames[language] || "English";

      const prompt = `
You are a master Vedic Astrologer providing Kundali Matching (Guna Milan) interpretation for a couple.
We have already computed the mathematically exact astronomical positions of the Moon (Lahiri Sidereal Ayanamsha) and solved the core matching algorithms:

Partner A:
- Name: ${partnerAName}
- Birth Date:  ${partnerADob} (Time: ${partnerATime || 'Not Specified'})
- Moon Sign (Rashi): ${partnerARashi}
- Nakshatra: ${partnerANakshatra} (Pada ${partnerANakPada})

Partner B:
- Name: ${partnerBName}
- Birth Date: ${partnerBDob} (Time: ${partnerBTime || 'Not Specified'})
- Moon Sign (Rashi): ${partnerBRashi}
- Nakshatra: ${partnerBNakshatra} (Pada ${partnerBNakPada})

Match Result Summary:
- Guna Milan compatibility score: ${score} out of ${maxScore} points.

We have evaluated the traditional 8 Kootas (Ashtakoot) as follows:
${JSON.stringify(kootaBreakdown, null, 2)}

Provide a deeply encouraging, wise, and highly detailed professional astrological analysis of this match.
Adhere strictly to a three-layer validation system in your analysis:
1. Astronomical Layer (Swiss Ephemeris, Lahiri Ayanamsa, precise planetary longitudes)
2. Classical Rule Layer (Brihat Parashara Hora Shastra, Phaladeepika, Saravali, Jataka Parijata, Brihat Jataka, Mantreswara's principles, region-specific exception rules where appropriate)
3. Validation Layer (Cross-check every Dosha against at least three independent rule sets, apply every recognized cancellation rule before declaring a Dosha, show the user why the Dosha exists or is cancelled, including exact planet, house, sign, aspect, and classical rule)

Structure your report with beautiful markdown headings, containing:
1. **Cosmic Resonance (Moon Sign Alignment)**: Interpret their Rashi compatibility (Moon Signs being ${partnerARashi} and ${partnerBRashi}).
2. **Koota-by-Koota Breakdown & Spiritual Harmony**: Briefly highlight the strengths of their highest-scoring areas and explain any frictions, especially focus areas from Bhakoot, Gana or Nadi Kootas.
3. **Daily Karma & Path Forward**: Provide practical, actionable relationship advice based on this energy alignment. Explain that free will and conscious, loving commitment always transcend deterministic positions.

Keep the advice highly human, constructive, full of authentic Vedic terms (like Nakshatra, Graha, Rashi), and deeply personalized. Format as raw markdown (omit top-level JSON or wrappers).

CRITICAL REQUIREMENT: Since the user has selected the language "${languageName}", you MUST write the entire report, headings, list points, explanations, and summaries in "${languageName}" instead of English. Do not include any English translations, write solely in "${languageName}".
`;

      let reportText;
      if (process.env.GEMINI_API_KEY) {
        try {
          reportText = await generateWithRetryAndFallback(ai, modelName, prompt);
        } catch (apiError) {
          console.error("Gemini API Error, falling back to local engine:", apiError);
          reportText = generateOfflineMatchReport(req.body);
        }
      } else {
        console.log("No GEMINI_API_KEY configured, falling back to local engine immediately.");
        reportText = generateOfflineMatchReport(req.body);
      }

      res.json({ text: reportText });
    } catch (error) {
      console.error("Gemini Interpretation Endpoint Error:", error);
      // Even in final failure, return the offline report as standard status 200 so the user gets a working app
      try {
        const fallbackText = generateOfflineMatchReport(req.body);
        res.json({ text: fallbackText });
      } catch (fallbackError) {
        res.status(500).json({ error: error.message || "Failed to generate Vedic interpretation" });
      }
    }
  });

  // API endpoint for Single Person Kundali analysis and interpretation
  app.post('/api/kundali-single-interpret', async (req, res) => {
    try {
      const { 
        name, dob, time, place,
        rashi, nakshatra, nakPada,
        ascSignName, ascDegree,
        mangalStatus, mangalSeverity,
        sadeSati, rahuKetu, kaalSarp,
        currentDasha, planetsBySign,
        language
      } = req.body;

      // Select model
      const modelName = 'gemini-3.5-flash';

      const langNames = {
        en: "English",
        hi: "Hindi (हिंदी)",
        bn: "Bengali (বাংলা)",
        mr: "Marathi (मराठी)",
        gu: "Gujarati (ગુજરાતી)"
      };
      const languageName = langNames[language] || "English";

      const prompt = `
You are a master Vedic Astrologer providing a comprehensive Single Person Kundali Analysis & Astrological Report.
We have computed the mathematically exact astronomical positions of the planets (Lahiri Sidereal Ayanamsha) and solved the core Vedic algorithms:

Personal Birth Details:
- Name: ${name}
- Birth Date & Time: ${dob} (Time: ${time || 'Not Specified'})
- Birth Place: ${place}

Astro-Physical Signatures:
- Rising Sign (Lagna Ascendant): ${ascSignName} (${ascDegree}°)
- Moon Sign (Rashi): ${rashi}
- Moon Nakshatra: ${nakshatra} (Pada ${nakPada})
- Running Mahadasha: ${currentDasha}

Critical Doshas & Cosmic Alignments:
- Manglik Dosha Status: ${mangalStatus} (Severity: ${mangalSeverity})
- Shani Sade Sati Transit Status: ${sadeSati ? 'Active (Saturn is transiting trans-natal houses)' : 'Not Active'}
- Rahu-Ketu Relationship Axis (1/7 House): ${rahuKetu ? 'Active Placement (Node in 1st/7th houses)' : 'Clear / Not Present'}
- Kaal Sarp Configuration Check: ${kaalSarp ? 'Present (All planets hemmed between Rahu & Ketu)' : 'Absent (Balanced celestial distribution)'}

Sidereal Planet Placements:
${JSON.stringify(planetsBySign, null, 2)}

Provide a beautiful, deeply wise, encouraging, and detailed professional Vedic Astrological Analysis report.
Adhere strictly to a three-layer validation system in your analysis:
1. Astronomical Layer (Swiss Ephemeris, Lahiri Ayanamsa, precise planetary longitudes)
2. Classical Rule Layer (Brihat Parashara Hora Shastra, Phaladeepika, Saravali, Jataka Parijata, Brihat Jataka, Mantreswara's principles, region-specific exception rules where appropriate)
3. Validation Layer (Cross-check every Dosha against at least three independent rule sets, apply every recognized cancellation rule before declaring a Dosha, show the user why the Dosha exists or is cancelled, including exact planet, house, sign, aspect, and classical rule)

Structure your report with beautiful markdown headings, containing:
1. **The Ascendant & Soul Template (Lagna & Rashi)**: Interpret their Rising Sign (${ascSignName}) and Moon Sign (${rashi}) and Nakshatra (${nakshatra}). Describe their fundamental personality template, temperament, and soul's primary urge.
2. **Key Planetary Strengths & Life Focus**: Analyze their planet placements and their houses. Highlight exceptional positions (Exalted, Own Sign, or Friendly placements) and explain how these shape their career, wealth, and health.
3. **Cosmic Hurdles & Blessings (Dosha Audit)**: Provide a deep, insightful explanation of their Doshas (Manglik: ${mangalStatus}, Sade Sati: ${sadeSati ? 'Yes' : 'No'}, Rahu-Ketu: ${rahuKetu ? 'Yes' : 'No'}, Kaal Sarp: ${kaalSarp ? 'Yes' : 'No'}). Explain that Doshas are not curses, but developmental friction designed to stretch and evolve the consciousness. Recommend practical, modern spiritual or lifestyle remedies (like mindfulness, charitable actions, or grounding practices).
4. **The Current Chapter (Mahadasha & Transits)**: Interpret their running ${currentDasha} and how they can best navigate their current developmental era.

Keep the advice highly positive, constructive, and filled with authentic Vedic terminology. Format as raw markdown (omit top-level JSON or wrappers).

CRITICAL REQUIREMENT: Since the user has selected the language "${languageName}", you MUST write the entire report, headings, list points, explanations, and summaries in "${languageName}" instead of English. Do not include any English translations, write solely in "${languageName}".
`;

      let reportText;
      if (process.env.GEMINI_API_KEY) {
        try {
          reportText = await generateWithRetryAndFallback(ai, modelName, prompt);
        } catch (apiError) {
          console.error("Gemini Single API Error, falling back to local engine:", apiError);
          reportText = generateOfflineSingleReport(req.body);
        }
      } else {
        console.log("No GEMINI_API_KEY configured, falling back to local engine immediately.");
        reportText = generateOfflineSingleReport(req.body);
      }

      res.json({ text: reportText });
    } catch (error) {
      console.error("Gemini Single Interpretation Endpoint Error:", error);
      // Even in final failure, return the offline report as standard status 200 so the user gets a working app
      try {
        const fallbackText = generateOfflineSingleReport(req.body);
        res.json({ text: fallbackText });
      } catch (fallbackError) {
        res.status(500).json({ error: error.message || "Failed to generate Vedic single interpretation" });
      }
    }
  });

  // Serve static/compiled assets or mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    console.log("Starting in Development mode with Vite Middleware...");
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in Production mode serving built static files...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AnkDrishti Server running successfully on port ${PORT}`);
  });
}

startServer();
