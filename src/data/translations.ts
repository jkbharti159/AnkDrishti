// Translation Dictionary & Databases for en, hi, bn, mr, gu
import { NumberMeaning, Flashcard } from "../types";

export interface LocalizedUI {
  loading: string;
  tabs: Record<string, string>;
  portal: {
    tagline: string;
    cta: string;
    alignDown: string;
    credits: string;
    welcomeTitle: string;
    welcomeSubtitle: string;
    welcomeMessage: string;
  };
  calc: {
    systemWestern: string;
    systemVedic: string;
    titleWestern: string;
    titleVedic: string;
    descWestern: string;
    descVedic: string;
    nameLabel: string;
    dobLabel: string;
    calcYearLabel: string;
    placeholderName: string;
    computeBtnWestern: string;
    computeBtnVedic: string;
    launchMap: string;
    guestUser: string;
    guestEmailPlaceholder: string;
    saveProfileBtn: string;
    savedProfilesHeader: string;
    noSavedProfiles: string;
    disclaimer: string;
    calculating: string;
    reducingVedic: string;
    revealDynamicHoroscope: string;
    fetchingHoroscope: string;
    interactiveReport: string;
    savedSuccess: string;
    deleteBtn: string;
    loadBtn: string;
    loginBtn: string;
    logoutBtn: string;
    welcomeMsg: string;
    
    // Result card titles
    lifePathTitle: string;
    destinyTitle: string;
    soulUrgeTitle: string;
    personalityTitle: string;
    birthdayTitle: string;
    personalYearTitle: string;
    horoscopeTitle: string;
    horoscopeUnderTitle: string;
    sectorLabel: string;
    adviceLabel: string;
    forecastLabel: string;
    traitsLabel: string;
    strengthsLabel: string;
    weaknessesLabel: string;
    careersLabel: string;
    colorLabel: string;
    rulingPlanetLabel: string;
    favorableDaysLabel: string;
    luckyNumbersLabel: string;
    criticalWarning: string;
  };
  rays: {
    badge: string;
    title: string;
    sub: string;
    universalFreq: string;
    coreEssence: string;
    dominantStrengths: string;
    growthChallenges: string;
    cosmicElement: string;
    sacredSymbol: string;
    sunMapping: string;
    lunarReflection: string;
    geometricForce: string;
    careerChannels: string;
    closeBtn: string;
  };
  synergy: {
    title: string;
    sub: string;
    tabComp: string;
    tabMarriage: string;
    tabKundali: string;
    pAName: string;
    pBName: string;
    pADob: string;
    pBDob: string;
    pBNamePlaceholder: string;
    computeBtn: string;
    compSummaryHeader: string;
    spiritualRapport: string;
    destinyFriction: string;
    karmicVibe: string;
    verdictHeader: string;
    
    // Marriage Timing
    marriageHeader: string;
    jointAnalysis: string;
    partnerAOnly: string;
    partnerBOnly: string;
    revealWindowsBtn: string;
    computingMatrix: string;
    primaryWindow: string;
    scoreLabel: string;
    favorability: string;
    timelineYear: string;
    jointPy: string;
    
    // Kundali Matching
    kBoyName: string;
    kGirlName: string;
    kBoyDob: string;
    kGirlDob: string;
    kBithTime: string;
    computeKundali: string;
    matchingMatrix: string;
    gunaScore: string;
    gunaDetails: string;
    reconciledSummary: string;
    manglikCheck: string;
    boyManglik: string;
    girlManglik: string;
    mutualAllies: string;
    ashtakootMetrics: Record<string, string>;
  };
  tarot: {
    title: string;
    sub: string;
    mastered: string;
    shuffling: string;
    next: string;
    prev: string;
    markKnown: string;
    resetDeck: string;
    emptyDeck: string;
    emptySub: string;
    flippedView: string;
    catAll: string;
    catMeanings: string;
    catBasics: string;
    catCompatibility: string;
    catSymbols: string;
    catVedic: string;
    catLove: string;
    catKundali: string;
    catCharts: string;
  };
  zodiac: {
    title: string;
    sub: string;
    linked: string;
    rulingSphere: string;
    triplicityElement: string;
    resonatingKey: string;
    resonanceSubText: string;
    archetypeRays: string;
    hoverPrompt: string;
  };
  voice: {
    playing: string;
    paused: string;
    stopped: string;
    unavailable: string;
    assistantName: string;
    controlHeader: string;
  };
}

export const staticUI: Record<string, LocalizedUI> = {
  en: {
    loading: "Aligning the Celestial Spheres...",
    tabs: {
      portal: "Portal",
      "ank-map": "Ank-Map",
      rays: "Rays",
      tarot: "Tarot",
      synergy: "Synergy",
      zodiac: "Zodiac"
    },
    portal: {
      tagline: "Explore the vibrational blueprint of your soul. Calculate your destiny path, study mystical flashcard matrices, and merge celestial harmonics.",
      cta: "Conspire with Fate",
      alignDown: "Align down",
      credits: "Developed by",
      welcomeTitle: "WELCOME TO AnkDrishti",
      welcomeSubtitle: "A Sacred Conjunction of Numerology & Ancient Vedic Astrology",
      welcomeMessage: "We invite you to explore the vibrational frequency of your life path, chart ancestral alignments, view relationship synergies, and trace the mystical geometric patterns of the heavens. May your search for self-understanding bring you clarity, peace, and divine alignment."
    },
    calc: {
      systemWestern: "Western Numerology",
      systemVedic: "Vedic Ank-Kundali",
      titleWestern: "PSYCHO-NUMERIC MATRIX",
      titleVedic: "VEDIC MULANK ENGINE",
      descWestern: "Analyze your birth vibrations using Pythagorean systems to outline five core personality parameters.",
      descVedic: "Examine your character through Vedic Ank astrology, linking birth days to governing celestial deities.",
      nameLabel: "Full Name",
      dobLabel: "Birth Date",
      calcYearLabel: "Calculation Year",
      placeholderName: "Enter full birth name...",
      computeBtnWestern: "Align Vibrations",
      computeBtnVedic: "Compute Vedic Frequencies",
      launchMap: "Launch Map",
      guestUser: "Guest Identity",
      guestEmailPlaceholder: "Enter email for storing profiles...",
      saveProfileBtn: "Record Destiny Chart",
      savedProfilesHeader: "Saved Relational Records",
      noSavedProfiles: "No destiny records saved under this identity yet.",
      disclaimer: "Disclaimer: Astrological data serves spiritual guidance. Worldly activities rely on conscious choice.",
      calculating: "ALIGNING AXIS...",
      reducingVedic: "VIBRATING MATRIX...",
      revealDynamicHoroscope: "Reveal Astral Horoscope",
      fetchingHoroscope: "UPDATING TRANSITS...",
      interactiveReport: "INTERACTIVE DESTINY REPORT (CLICK CARDS TO INSPECT)",
      savedSuccess: "Destiny recorded to local memory bank!",
      deleteBtn: "Erase",
      loadBtn: "Recall",
      loginBtn: "Establish Identity",
      logoutBtn: "Abandon Identity",
      welcomeMsg: "Sanctuary active for",
      
      lifePathTitle: "Life Path",
      destinyTitle: "Destiny (Expression)",
      soulUrgeTitle: "Soul Urge",
      personalityTitle: "Personality",
      birthdayTitle: "Birthday Number",
      personalYearTitle: "Personal Year",
      horoscopeTitle: "Daily Vedic Horoscope",
      horoscopeUnderTitle: "Astrometric Conjunctions Today",
      sectorLabel: "Active Life Sector",
      adviceLabel: "Guru's Advice",
      forecastLabel: "Planetary Forecast",
      traitsLabel: "Deity Archetypes",
      strengthsLabel: "Ascendant Blessings",
      weaknessesLabel: "Astral Warnings",
      careersLabel: "Vows & Careers",
      colorLabel: "Cosmic Aura Color",
      rulingPlanetLabel: "Governing Lord",
      favorableDaysLabel: "Favorable Lunar Day",
      luckyNumbersLabel: "Auspicious Frequencies",
      criticalWarning: "Birth time is required to generate an accurate birth chart (both Ascendant and house placements are unavailable with date entry only). Below are geocentric astronomical placements by zodiac sign:"
    },
    rays: {
      badge: "Celestial Mapping Constellation",
      title: "NUMERIC CONSTELLATIONS",
      sub: "Explore the energetic rays. On desktop, they organize as a linked cosmic map. Hover or click nodes to interact with their details.",
      universalFreq: "Universal Frequency",
      coreEssence: "Core Essence & Alignment",
      dominantStrengths: "✦ Dominant Strengths",
      growthChallenges: "▲ Growth Challenges",
      cosmicElement: "Cosmic Element",
      sacredSymbol: "Sacred Astral Symbol",
      sunMapping: "Sun Mapping",
      lunarReflection: "Lunar Reflection",
      geometricForce: "Geometric Force",
      careerChannels: "💼 Highly Aligned Career Channels",
      closeBtn: "Close Integration"
    },
    synergy: {
      title: "DIVINE ALIGNMENTS",
      sub: "Analyze compatibility factors between souls, predict favorable marriage windows, and reconcile Kundali Guna Milan.",
      tabComp: "Compatibility",
      tabMarriage: "Marriage Timing",
      tabKundali: "Kundali Matching",
      pAName: "Partner A Name",
      pBName: "Partner B Name",
      pADob: "Partner A DOB",
      pBDob: "Partner B DOB",
      pBNamePlaceholder: "Enter partner's name...",
      computeBtn: "Merge Frequencies",
      compSummaryHeader: "Celestial Interconnection Summary",
      spiritualRapport: "Spiritual Rapport",
      destinyFriction: "Destiny Friction",
      karmicVibe: "Karmic Resonance",
      verdictHeader: "Composite Harmony Verdict",
      
      marriageHeader: "Calculate Favorable Marriage Windows",
      jointAnalysis: "Joint Analysis",
      partnerAOnly: "Partner A Focus",
      partnerBOnly: "Partner B Focus",
      revealWindowsBtn: "Reveal Favorable Windows",
      computingMatrix: "COMPUTING MATRIX...",
      primaryWindow: "🏆 AUSPICIOUS MARRIAGE TIMING WINDOW",
      scoreLabel: "Harmony Ratio",
      favorability: "Favorability Focus",
      timelineYear: "Planetary Year",
      jointPy: "Vedic Personal Balance",
      
      kBoyName: "Groom Name",
      kGirlName: "Bride Name",
      kBoyDob: "Groom DOB",
      kGirlDob: "Bride DOB",
      kBithTime: "Birth Time",
      computeKundali: "Calculate Guna Milan",
      matchingMatrix: "ASHTAKOOT GUNA MILAN MATRIX",
      gunaScore: "Guna Score",
      gunaDetails: "Ashtakoot Guna breakdown based on birth nakshatras:",
      reconciledSummary: "Reconciled Kundali Synthesis",
      manglikCheck: "Chandra-Manglik (Mars) Influences",
      boyManglik: "Groom Manglik Status",
      girlManglik: "Bride Manglik Status",
      mutualAllies: "7th House Lord Relationship",
      ashtakootMetrics: {
        Varna: "Varna (Ego & Work)",
        Vashya: "Vashya (Influence)",
        Tara: "Tara (Destiny & Health)",
        Yoni: "Yoni (Physical affinity)",
        GrahaMaitri: "Graha Maitri (Mental alliance)",
        Gana: "Gana (Temperament)",
        Bhakoot: "Bhakoot (Emotional growth)",
        Nadi: "Nadi (Genetic harmony)"
      }
    },
    tarot: {
      title: "TAROT STUDY LAB",
      sub: "Examine flashcard matrices of the occult sciences to master ancient numerology rules, Kundali nakshatras, and planetary rays.",
      mastered: "Mastered",
      shuffling: "Shuffling Fates...",
      next: "Next Card",
      prev: "Prev Card",
      markKnown: "Mark as Mastered",
      resetDeck: "Refill Deck",
      emptyDeck: "Occult laboratory full!",
      emptySub: "You have fully mastered all flashcards in this cosmic section. Excellent progress, scholar.",
      flippedView: "Click Card to Reveal Hidden Knowledge",
      catAll: "All Topics",
      catMeanings: "Number Meanings",
      catBasics: "Numerology Basics",
      catCompatibility: "Compatibility",
      catSymbols: "Astrology Links",
      catVedic: "Vedic Mulank",
      catLove: "Love & Marriage",
      catKundali: "Kundali Matching",
      catCharts: "Birth Charts"
    },
    zodiac: {
      title: "THE ZODIAC DIAL",
      sub: "Hover over constellations of the zodiac to analyze their mathematical links, ruling cosmic entities, and numerological rays.",
      linked: "Linked",
      rulingSphere: "Ruling Sphere",
      triplicityElement: "Triplicity Element",
      resonatingKey: "Resonating Numerology Key",
      resonanceSubText: "Frequencies and astral lines aligned.",
      archetypeRays: "Rays of the Archetype",
      hoverPrompt: "Hover over outer dial nodes to reveal correspondence details."
    },
    voice: {
      playing: "Svara reading active...",
      paused: "Svara paused...",
      stopped: "Svara stopped",
      unavailable: "Narration voice unavailable on this browser/device for other than English.",
      assistantName: "Svara Oracle Voice",
      controlHeader: "Svara Playing Control"
    }
  },
  hi: {
    loading: "ब्रह्मांडीय चक्रों को जोड़ रहे हैं...",
    tabs: {
      portal: "पोर्टल",
      "ank-map": "अंक-मानचित्र",
      rays: "किरणें",
      tarot: "टैरो",
      synergy: "तालमेल",
      zodiac: "राशिचक्र"
    },
    portal: {
      tagline: "अपनी आत्मा के स्पंदन ब्लूप्रिंट का अन्वेषण करें। अपने भाग्य पथ की गणना करें, रहस्यमयी टैरो कार्डों का अध्ययन करें, और दिव्य सामंजस्य का विलय करें।",
      cta: "भाग्य के साथ संरेखित करें",
      alignDown: "नीचे संरेखित करें",
      credits: "विकसित किया गया",
      welcomeTitle: "WELCOME TO AnkDrishti",
      welcomeSubtitle: "अंकशास्त्र और प्राचीन वैदिक ज्योतिष का एक पवित्र संगम",
      welcomeMessage: "हम आपको अपने जीवन पथ की कंपनात्मक आवृत्ति का पता लगाने, पैतृक संरेखणों को समझने, संबंध अनुकूलता देखने और ब्रह्मांड के रहस्यमयी ज्यामितीय पैटर्न का पता लगाने के लिए आमंत्रित करते हैं। आप स्वयं को बेहतर ढंग से समझकर स्पष्टता, शांति और दैवीय आशीर्वाद प्राप्त करें।"
    },
    calc: {
      systemWestern: "पश्चिमी अंकशास्त्र",
      systemVedic: "वैदिक अंक-कुंडली",
      titleWestern: "मनो-संख्यात्मक मैट्रिक्स",
      titleVedic: "वैदिक मूलांक इंजन",
      descWestern: "पांच मुख्य व्यक्तित्व मापदंडों को रेखांकित करने के लिए पाइथागोरस प्रणालियों का उपयोग करके अपनी जन्म आवृत्तियों का विश्लेषण करें।",
      descVedic: "वैदिक अंक ज्योतिष के माध्यम से अपने चरित्र की जांच करें, जन्म के दिनों को शासी आकाशीय देवताओं से जोड़ें।",
      nameLabel: "पूरा नाम",
      dobLabel: "जन्म तिथि",
      calcYearLabel: "गणना का वर्ष",
      placeholderName: "पूरा नाम दर्ज करें...",
      computeBtnWestern: "स्पंदन संरेखित करें",
      computeBtnVedic: "वैदिक आवृत्तियों की गणना करें",
      launchMap: "मानचित्र शुरू करें",
      guestUser: "अतिथि पहचान",
      guestEmailPlaceholder: "प्रोफाइल सुरक्षित करने के लिए ईमेल दर्ज करें...",
      saveProfileBtn: "भाग्य चार्ट सुरक्षित करें",
      savedProfilesHeader: "सुरक्षित संबंध रिकॉर्ड",
      noSavedProfiles: "इस पहचान के अंतर्गत अभी कोई भाग्य रिकॉर्ड सुरक्षित नहीं है।",
      disclaimer: "अस्वीकरण: ज्योतिषीय डेटा आध्यात्मिक मार्गदर्शन प्रदान करता है। सांसारिक गतिविधियां सचेत पसंद पर निर्भर करती हैं।",
      calculating: "अक्ष संरेखित हो रहा है...",
      reducingVedic: "मैट्रिक्स स्पंदित हो रहा है...",
      revealDynamicHoroscope: "खगोलीय राशिफल प्रकट करें",
      fetchingHoroscope: "पारगमन अद्यतन कर रहे हैं...",
      interactiveReport: "इंटरैक्टिव भाग्य रिपोर्ट (निरीक्षण करने के लिए कार्ड पर क्लिक करें)",
      savedSuccess: "भाग्य स्थानीय मेमोरी बैंक में सुरक्षित किया गया!",
      deleteBtn: "मिटाएँ",
      loadBtn: "याद करें",
      loginBtn: "पहचान स्थापित करें",
      logoutBtn: "पहचान छोड़ें",
      welcomeMsg: "अभयारण्य सक्रिय है",
      
      lifePathTitle: "जीवन पथ (Life Path)",
      destinyTitle: "भाग्य संख्या (Destiny)",
      soulUrgeTitle: "आत्मा आग्रह (Soul Urge)",
      personalityTitle: "व्यक्तित्व (Personality)",
      birthdayTitle: "जन्मदिन अंक (Birthday)",
      personalYearTitle: "व्यक्तिगत वर्ष (Personal Year)",
      horoscopeTitle: "दैनिक वैदिक राशिफल",
      horoscopeUnderTitle: "आज के खगोलीय पारगमन",
      sectorLabel: "सक्रिय जीवन क्षेत्र",
      adviceLabel: "गुरु की सलाह",
      forecastLabel: "ग्रहों का पूर्वानुमान",
      traitsLabel: "देवता के गुण",
      strengthsLabel: "आरोही के आशीर्वाद",
      weaknessesLabel: "ग्रहों की चेतावनियाँ",
      careersLabel: "आजीविका और क्षेत्र",
      colorLabel: "ब्रह्मांडीय आभा रंग",
      rulingPlanetLabel: "स्वामी ग्रह",
      favorableDaysLabel: "अनुकूल चंद्र दिवस",
      luckyNumbersLabel: "शुभ अंक आवृत्तियाँ",
      criticalWarning: "सटीक जन्म कुंडली उत्पन्न करने के लिए जन्म समय आवश्यक है (केवल तिथि प्रविष्टि के साथ लग्न और भाव की स्थिति अनुपलब्ध है)। नीचे राशि चक्र द्वारा भू-केंद्रित खगोलीय स्थितियाँ दी गई हैं:"
    },
    rays: {
      badge: "खगोलीय मानचित्रीकरण नक्षत्र",
      title: "संख्यात्मक नक्षत्र",
      sub: "ऊर्जावान किरणों का अन्वेषण करें। डेस्कटॉप पर, वे एक जुड़े हुए ब्रह्मांडीय मानचित्र के रूप में व्यवस्थित होते हैं। विवरण के साथ बातचीत करने के लिए नोड्स पर माउस ले जाएं या क्लिक करें।",
      universalFreq: "सार्वभौमिक आवृत्ति",
      coreEssence: "मूल तत्व और संरेखण",
      dominantStrengths: "✦ प्रमुख ताकतें",
      growthChallenges: "▲ विकास चुनौतियाँ",
      cosmicElement: "ब्रह्मांडीय तत्व",
      sacredSymbol: "पवित्र खगोलीय प्रतीक",
      sunMapping: "सूर्य मानचित्रीकरण",
      lunarReflection: "चंद्र प्रतिबिंब",
      geometricForce: "ज्यामितीय बल",
      careerChannels: "💼 अत्यधिक संरेखित करियर चैनल",
      closeBtn: "एकीकरण बंद करें"
    },
    synergy: {
      title: "दिव्य संरेखण",
      sub: "आत्माओं के बीच अनुकूलता कारकों का विश्लेषण करें, अनुकूल विवाह खिड़कियों की भविष्यवाणी करें, और कुंडली गुणा मिलान का सामंजस्य स्थापित करें।",
      tabComp: "सामंजस्य / अनुकूलता",
      tabMarriage: "विवाह का समय",
      tabKundali: "कुंडली मिलान",
      pAName: "साथी A का नाम",
      pBName: "साथी B का नाम",
      pADob: "साथी A की जन्म तिथि",
      pBDob: "साथी B की जन्म तिथि",
      pBNamePlaceholder: "साथी का नाम दर्ज करें...",
      computeBtn: "आवृत्तियों का विलय करें",
      compSummaryHeader: "ब्रह्मांडीय अंतर्संबंध सारांश",
      spiritualRapport: "आध्यात्मिक तालमेल",
      destinyFriction: "भाग्य घर्षण",
      karmicVibe: "कर्मिक गूंज",
      verdictHeader: "समग्र सामंजस्य निर्णय",
      
      marriageHeader: "अनुकूल विवाह खिड़कियों की गणना करें",
      jointAnalysis: "संयुक्त विश्लेषण",
      partnerAOnly: "साथी A पर ध्यान दें",
      partnerBOnly: "साथी B पर ध्यान दें",
      revealWindowsBtn: "अनुकूल खिड़कियां प्रकट करें",
      computingMatrix: "मैट्रिक्स की गणना कर रहे हैं...",
      primaryWindow: "🏆 शुभ विवाह समय खिड़की",
      scoreLabel: "सामंजस्य अनुपात",
      favorability: "अनुकूलता का फोकस",
      timelineYear: "ग्रह वर्ष",
      jointPy: "वैदिक व्यक्तिगत संतुलन",
      
      kBoyName: "वर का नाम",
      kGirlName: "वधू का नाम",
      kBoyDob: "वर की जन्म तिथि",
      kGirlDob: "वधू की जन्म तिथि",
      kBithTime: "जन्म समय",
      computeKundali: "अष्टकूट गुण मिलान",
      matchingMatrix: "अष्टकूट गुण मिलान मैट्रिक्स",
      gunaScore: "गुण स्कोर",
      gunaDetails: "जन्म नक्षत्रों के आधार पर अष्टकूट गुण विभाजन:",
      reconciledSummary: "संशोधित कुंडली विश्लेषण",
      manglikCheck: "चंद्र-मांगलिक (मंगल) प्रभाव",
      boyManglik: "वर की मांगलिक स्थिति",
      girlManglik: "वधू की मांगलिक स्थिति",
      mutualAllies: "सप्तम भाव के स्वामियों का संबंध",
      ashtakootMetrics: {
        Varna: "वर्ण (अहंकार और कार्य)",
        Vashya: "वश्य (प्रभाव)",
        Tara: "तारा (भाग्य और स्वास्थ्य)",
        Yoni: "योनि (शारीरिक संबंध)",
        GrahaMaitri: "ग्रह मैत्री (मानसिक गठबंधन)",
        Gana: "गण (स्वभाव)",
        Bhakoot: "भकूट (भावनात्मक विकास)",
        Nadi: "नाड़ी (आनुवंशिक सद्भाव)"
      }
    },
    tarot: {
      title: "टैरो अध्ययन प्रयोगशाला",
      sub: "प्राचीन अंकशास्त्र नियमों, कुंडली नक्षत्रों और ग्रहों की किरणों में महारत हासिल करने के लिए गुप्त विज्ञान के फ्लैशकार्डों की जांच करें।",
      mastered: "महारत हासिल",
      shuffling: "भाग्य को बदल रहे हैं...",
      next: "अगला कार्ड",
      prev: "पिछला कार्ड",
      markKnown: "महारत हासिल के रूप में चिन्हित करें",
      resetDeck: "डेक को फिर से भरें",
      emptyDeck: "रहस्यमयी प्रयोगशाला पूर्ण है!",
      emptySub: "आपने ब्रह्मांडीय खंड के सभी फ्लैशकार्डों में महारत हासिल कर ली है। उत्कृष्ट प्रगति, विद्वान।",
      flippedView: "छिपे हुए ज्ञान को प्रकट करने के लिए कार्ड पर क्लिक करें",
      catAll: "सभी विषय",
      catMeanings: "संख्या अर्थ",
      catBasics: "अंकशास्त्र मूल बातें",
      catCompatibility: "सामंजस्य / अनुकूलता",
      catSymbols: "ज्योतिषीय संबंध",
      catVedic: "वैदिक मूलांक",
      catLove: "प्रेम और विवाह",
      catKundali: "कुंडली मिलान",
      catCharts: "जन्म कुंडली"
    },
    zodiac: {
      title: "राशिचक्र डायल",
      sub: "राशि चक्र के नक्षत्रों पर माउस ले जाएँ और उनके गणितीय संबंध, शासक खगोलीय ग्रहों और संख्यात्मक किरणों का विश्लेषण करें।",
      linked: "जुड़ा हुआ",
      rulingSphere: "शासक मंडल",
      triplicityElement: "त्रिकोणीय तत्व",
      resonatingKey: "गूंजने वाली अंकशास्त्र कुंजी",
      resonanceSubText: "आवृत्तियाँ और खगोलीय रेखाएँ संरेखित हैं।",
      archetypeRays: "मूलरूप की किरणें",
      hoverPrompt: "पत्राचार विवरण प्रकट करने के लिए बाहरी डायल नोड्स पर माउस ले जाएँ।"
    },
    voice: {
      playing: "स्वर वाचन सक्रिय है...",
      paused: "स्वर रुका हुआ है...",
      stopped: "स्वर बंद हो गया",
      unavailable: "अंग्रेजी के अलावा अन्य भाषाओं के लिए इस ब्राउज़र/डिवाइस पर वाचन स्वर अनुपलब्ध है।",
      assistantName: "Svara ओरेकल वॉयस",
      controlHeader: "स्वर वाचन नियंत्रण"
    }
  },
  bn: {
    loading: "মহাজাগতিক গোলকগুলি সারিবদ্ধ করা হচ্ছে...",
    tabs: {
      portal: "পোর্টাল",
      "ank-map": "অঙ্ক-মানচিত্র",
      rays: "কিরণ",
      tarot: "ট্যারোট",
      synergy: "সমন্বয়",
      zodiac: "রাশিচক্র"
    },
    portal: {
      tagline: "আপনার আত্মার কম্পনজনিত নীল নকশা অন্বেষণ করুন। আপনার ভাগ্যের পথ হিসেব করুন, রহস্যময় ট্যারোট কার্ড অধ্যয়ন করুন এবং মহাজাগতিক সামঞ্জস্যের সংমিশ্রণ করুন।",
      cta: "ভাগ্যের সাথে সারিবদ্ধ করুন",
      alignDown: "নীচে সারিবদ্ধ করুন",
      credits: "তৈরি করেছেন",
      welcomeTitle: "WELCOME TO AnkDrishti",
      welcomeSubtitle: "সংখ্যাতত্ত্ব এবং প্রাচীন বৈদিক জ্যোতিষের এক পবিত্র সংযোগ",
      welcomeMessage: "আমরা আপনাকে আপনার জীবনপথের কম্পন ফ্রিকোয়েন্সি অন্বেষণ করতে, পূর্বপুরুষের সারিবদ্ধতা বুঝতে, সম্পর্কের সাদৃশ্য দেখতে এবং আকাশের রহস্যময় জ্যামিতিক নকশাগুলি অনুধাবন করার জন্য আমন্ত্রণ জানাচ্ছি। আপনার আত্ম-উপলব্ধি আপনাকে স্পষ্টতা, শান্তি এবং ঐশ্বরিক অনুকম্পা এনে দিক।"
    },
    calc: {
      systemWestern: "পাশ্চাত্য সংখ্যাতত্ত্ব",
      systemVedic: "বৈদিক অঙ্ক-কুণ্ডলী",
      titleWestern: "মনো-সংখ্যাগত ম্যাট্রিক্স",
      titleVedic: "বৈদিক মূলাঙ্ক ইঞ্জিন",
      descWestern: "পাশ্চাত্য সংখ্যাতত্ত্ব পদ্ধতি ব্যবহার করে আপনার জন্ম কম্পন বিশ্লেষণ করুন দুই পার্টনারের মধ্যে সুসম্পর্ক নির্ধারণে।",
      descVedic: "বৈদিক অঙ্ক জ্যোতিষের মাধ্যমে আপনার চরিত্র পরীক্ষা করুন, জন্মের দিনগুলিকে পরিচালক মহাজাগতিক দেবতাদের সাথে যুক্ত করুন।",
      nameLabel: "পুরো নাম",
      dobLabel: "জন্ম তারিখ",
      calcYearLabel: "গণনার বছর",
      placeholderName: "পুরো নাম লিখুন...",
      computeBtnWestern: "কম্পন সারিবদ্ধ করুন",
      computeBtnVedic: "বৈদিক কম্পন গণনা করুন",
      launchMap: "মানচিত্র চালু করুন",
      guestUser: "অতিথি পরিচয়",
      guestEmailPlaceholder: "প্রোফাইল সংরক্ষণের জন্য ইমেল লিখুন...",
      saveProfileBtn: "ভাগ্য তালিকা সংরক্ষণ করুন",
      savedProfilesHeader: "সংরক্ষিত সম্পর্কীয় রেকর্ড",
      noSavedProfiles: "এই পরিচয়ের অধীনে এখনও কোনও ভাগ্যের রেকর্ড সংরক্ষিত হয়নি।",
      disclaimer: "দাবি অস্বীকার: জ্যোতিষশাস্ত্রীয় উপাত্ত আধ্যাত্মিক দিকনির্দেশনার জন্য। জাগতিক কার্যক্রম সচেতন পছন্দের ওপর নির্ভর করে।",
      calculating: "অক্ষ সারিবদ্ধ করা হচ্ছে...",
      reducingVedic: "ম্যাট্রিক্স কম্পিত হচ্ছে...",
      revealDynamicHoroscope: "মহাজাগতিক রাশিফল প্রকাশ করুন",
      fetchingHoroscope: "গ্রহের অবস্থান আপডেট করা হচ্ছে...",
      interactiveReport: "ইন্টারেক্টিভ ভাগ্য প্রতিবেদন (বিশদ দেখতে কার্ডগুলিতে ক্লিক করুন)",
      savedSuccess: "ভাগ্য রূপরেখা স্থানীয় মেমরি ব্যাংকে সংরক্ষিত হয়েছে!",
      deleteBtn: "মুছে ফেলুন",
      loadBtn: "পুনরুদ্ধার",
      loginBtn: "পরিচয় প্রতিষ্ঠা করুন",
      logoutBtn: "পরিচয় ত্যাগ করুন",
      welcomeMsg: "অভয়ারণ্য সক্রিয় আছে",
      
      lifePathTitle: "জীবন পথ",
      destinyTitle: "ভাগ্য সংখ্যা",
      soulUrgeTitle: "আন্টার আকাঙ্ক্ষা",
      personalityTitle: "ব্যক্তিত্ব",
      birthdayTitle: "জন্মদিনের সংখ্যা",
      personalYearTitle: "ব্যক্তিগত বছর",
      horoscopeTitle: "দৈনিক বৈদিক রাশিফল",
      horoscopeUnderTitle: "আজকের গ্রহের যোগসূত্র",
      sectorLabel: "সক্রিয় জীবন খাত",
      adviceLabel: "গুরুর উপদেশ",
      forecastLabel: "গ্রহের পূর্বাভাস",
      traitsLabel: "দেবতার গুণাবলী",
      strengthsLabel: "আরোহীর আশীর্বাদ",
      weaknessesLabel: "গ্রহের সতর্কবার্তা",
      careersLabel: "জীবিকা ও ক্ষেত্র",
      colorLabel: "মহাজাগতিক আভা রঙ",
      rulingPlanetLabel: "শাসক গ্রহ",
      favorableDaysLabel: "অনুকূল চন্দ্র দিন",
      luckyNumbersLabel: "শুভ সংখ্যার কম্পন",
      criticalWarning: "সঠিক জন্মকুন্ডলী তৈরির জন্য জন্মের সময় প্রয়োজন (শুধুমাত্র তারিখ দিলে লগ্ন এবং ঘরের অবস্থান পাওয়া যায় না)। নিচে রাশিচক্র অনুযায়ী প্রকৃত গ্রহের অবস্থান দেওয়া হল:"
    },
    rays: {
      badge: "মহাজাগতিক ম্যাপিং নক্ষত্রমন্ডল",
      title: "সংখ্যাগত নক্ষত্রপুঞ্জ",
      sub: "উজ্জ্বল কিরণগুলির সন্ধান করুন। ডেক্সটপে এগুলি একটি সংযুক্ত মহাজাগতিক মানচিত্র হিসাবে সাজানো থাকে। পারস্পরিক আলোচনার জন্য নোডগুলির ওপর মাউস ধরুন বা ক্লিক করুন।",
      universalFreq: "সার্বজনীন কম্পন কম্পাঙ্ক",
      coreEssence: "মূল সারমর্ম এবং সারিবদ্ধতা",
      dominantStrengths: "✦ অনুগামী শক্তিসমূহ",
      growthChallenges: "▲ উন্নতির চ্যালেঞ্জসমূহ",
      cosmicElement: "মহাজাগতিক উপাদান",
      sacredSymbol: "পবিত্র খগোত্রীয় প্রতীক",
      sunMapping: "সৌর ম্যাপিং",
      lunarReflection: "চাঁদের প্রতিফলন",
      geometricForce: "জ্যামিতিক শক্তি",
      careerChannels: "💼 অত্যন্ত উপযুক্ত পেশাগত ক্ষেত্র",
      closeBtn: "সমন্বয় বন্ধ করুন"
    },
    synergy: {
      title: "ঐশ্বরিক সারিবদ্ধতা",
      sub: "আত্মাদের মধ্যে সামঞ্জস্যের কারণগুলি বিশ্লেষণ করুন, অনুকূল বিবাহের সময় অনুমান করুন এবং কুন্ডলী গুণ মিলনের সমন্বয় করুন।",
      tabComp: "সামঞ্জস্যতা",
      tabMarriage: "বিবাহের সময়",
      tabKundali: "কুন্ডলী মিলন",
      pAName: "সাথী A-এর নাম",
      pBName: "সাথী B-এর নাম",
      pADob: "সাথী A-এর জন্ম তারিখ",
      pBDob: "সাথী B-এর জন্ম তারিখ",
      pBNamePlaceholder: "সাথীর নাম লিখুন...",
      computeBtn: "কম্পন একত্রিত করুন",
      compSummaryHeader: "মহাজাগতিক আন্তঃসংযোগের সংক্ষিপ্তসার",
      spiritualRapport: "আধ্যাত্মিক মেলবন্ধন",
      destinyFriction: "ভাগ্যগত ঘর্ষণ",
      karmicVibe: "কর্মফল সংক্রান্ত কম্পন",
      verdictHeader: "যৌথ সামঞ্জস্যের রায়",
      
      marriageHeader: "অনুকূল বিবাহের সময় গণনা করুন",
      jointAnalysis: "যৌথ বিশ্লেষণ",
      partnerAOnly: "সাথী A-এর সংযোগ",
      partnerBOnly: "সাথী B-এর সংযোগ",
      revealWindowsBtn: "অনুকূল সময় উন্মোচন করুন",
      computingMatrix: "ম্যাট্রিক্স গণনা করা হচ্ছে...",
      primaryWindow: "🏆 শুভ বিবাহের সময়সীমা",
      scoreLabel: "সামঞ্জস্যের অনুপাত",
      favorability: "অনুকূলতার গুরুত্ব",
      timelineYear: "গ্রহগত বছর",
      jointPy: "বৈদিক ব্যক্তিগত ভারসাম্য",
      
      kBoyName: "বরের নাম",
      kGirlName: "কনের নাম",
      kBoyDob: "বরের জন্ম তারিখ",
      kGirlDob: "কনের জন্ম তারিখ",
      kBithTime: "জন্ম সময়",
      computeKundali: "অষ্টকূটের গুণ মিলন",
      matchingMatrix: "অষ্টকূট গুণ মিলনের ম্যাট্রিক্স",
      gunaScore: "গুণ স্কোর",
      gunaDetails: "জন্ম নক্ষত্র ভিত্তিক অষ্টকূট গুণ মিলনের বিবরণ:",
      reconciledSummary: "কুন্ডলী মেলানোর সমন্বয়ী সারাংশ",
      manglikCheck: "চন্দ্র-মাঙ্গলিক (মঙ্গল) প্রভাব",
      boyManglik: "বরের মাঙ্গলিক অবস্থা",
      girlManglik: "কনের মাঙ্গলিক অবস্থা",
      mutualAllies: "সপ্তম ঘরের স্বামীদের মিত্রতা সম্পর্ক",
      ashtakootMetrics: {
        Varna: "বর্ণ (অহংকার ও কর্ম)",
        Vashya: "বশ্য (প্রভাব)",
        Tara: "তারা (ভাগ্য ও স্বাস্থ্য)",
        Yoni: "যোনি (শারীরিক আকর্ষণ)",
        GrahaMaitri: "গ্রহ মৈত্রী (মানসিক মেলবন্ধন)",
        Gana: "গণ (স্বभाव)",
        Bhakoot: "ভকূটের প্রভাব (আবেগীয় প্রকাশ)",
        Nadi: "নাড়ী (বংশানুক্রমিক সামঞ্জস্য)"
      }
    },
    tarot: {
      title: "ট্যারোট গবেষণা ল্যাব",
      sub: "প্রাচীন সংখ্যাতত্ত্বের নিয়ম, কুন্ডলী নক্ষত্র এবং গ্রহের কিরণে আয়ত্ত করতে গুপ্ত বিজ্ঞানের ফ্ল্যাশকার্ড ম্যাট্রিক্সগুলি পরীক্ষা করুন।",
      mastered: "আয়ত্ত করা হয়েছে",
      shuffling: "ভাগ্য পরিবর্তন করা হচ্ছে...",
      next: "পরবর্তী কার্ড",
      prev: "পূর্ববর্তী কার্ড",
      markKnown: "আয়ত্ত করা হয়েছে হিসেবে চিহ্নিত করুন",
      resetDeck: "ডেক পুনরায় পূরণ করুন",
      emptyDeck: "গোপন ল্যাব সম্পূর্ণ পূর্ণ!",
      emptySub: "আপনি এই মহাজাগতিক বিভাগের সমস্ত ফ্ল্যাশকার্ডগুলি সম্পূর্ণরূপে আয়ত্ত করেছেন। চমৎকার অগ্রগতি, প্রিয় গবেষক।",
      flippedView: "লুকানো জ্ঞান উন্মোচন করতে কার্ডে ক্লিক করুন",
      catAll: "সব বিষয়",
      catMeanings: "সংখ্যার তাৎপর্য",
      catBasics: "সংখ্যাতত্ত্বের সাধারণ ধারণা",
      catCompatibility: "সামঞ্জস্যতা ও পারস্পরিক সম্পর্ক",
      catSymbols: "জ্যোতিষ তাত্ত্বিক সংযোগ",
      catVedic: "বৈদিক মূলাঙ্ক",
      catLove: "প্রেম ও বিবাহ বন্ধন",
      catKundali: "কুন্ডলী গুণ মিলন",
      catCharts: "জন্ম কুণ্ডলী অবস্থান"
    },
    zodiac: {
      title: "রাশিচক্র ডায়াল",
      sub: "রাশিচক্রের নক্ষত্রমন্ডলের ওপর মাউস ধরুন এবং তাদের গাণিতিক সম্পর্ক, অধিপতি গ্রহ এবং সংখ্যাতাত্ত্বিক কিরণ বিশ্লেষণ করুন।",
      linked: "সংযুক্ত",
      rulingSphere: "অধিপতি গোলক",
      triplicityElement: "ত্রিত্ববাদী উপাদান",
      resonatingKey: "অনুরণিত সংখ্যাতত্ত্ব চাবি",
      resonanceSubText: "কম্পন এবং মহাজাগতিক রেখা সারিবদ্ধ হয়েছে।",
      archetypeRays: "আদি রূপের কিরণমালা",
      hoverPrompt: "পাসম্পর্কিত বিবরণ উন্মোचन করতে বাইরের ডায়াল নোডগুলির ওপর মাউস ধরুন।"
    },
    voice: {
      playing: "স্বরা পাঠ সক্রিয় আছে...",
      paused: "স্বরা সাময়িক বন্ধ...",
      stopped: "স্বরা বন্ধ করা হয়েছে",
      unavailable: "ইংরেজি ছাড়া অন্য ভাষার ক্ষেত্রে এই ব্রাউজার/ডিভাইসে বাচন কণ্ঠস্বর উপলব্ধ নেই।",
      assistantName: "Svara ওরেকল ভয়েস",
      controlHeader: "স্বরা প্লেব্যাক নিয়ন্ত্রণ"
    }
  },
  mr: {
    loading: "ब्रह्मांडीय चक्र संरेखित करत आहे...",
    tabs: {
      portal: "पोर्टल",
      "ank-map": "अंक-नकाशा",
      rays: "किरणे",
      tarot: "टॅरो",
      synergy: "ताळमेळ",
      zodiac: "राशीचक्र"
    },
    portal: {
      tagline: "आपल्या आत्म्याच्या कंपनांच्या आराखड्याचा शोध घ्या. आपल्या भाग्याचा मार्ग मोजा, रहस्यमय टॅरो कार्ड्सचा अभ्यास करा आणि दिव्य सुसंवादाचे विलीनीकरण करा.",
      cta: "भाग्याशी संरेखित व्हा",
      alignDown: "खाली संरेखित करा",
      credits: "विकसित केले",
      welcomeTitle: "WELCOME TO AnkDrishti",
      welcomeSubtitle: "अंकशास्त्र आणि प्राचीन वैदिक ज्योतिषशास्त्राचा एक पवित्र संगम",
      welcomeMessage: "आम्ही तुम्हाला तुमच्या जीवनमार्गाच्या लहरींचा आणि कंपनांचा शोध घेण्यास, पूर्वजांच्या योगांचे विश्लेषण करण्यास, परस्पर संबंधांमधील सुसंवाद तपासण्यास आणि विश्वाच्या रहस्यमय भौमितिक आकृतींचा वेध घेण्यास आमंत्रित करतो. आत्म-साक्षात्कारामुळे तुम्हाला स्पष्टता, मानसिक शांतता आणि दैवी संरेखण लाभो."
    },
    calc: {
      systemWestern: "पाश्चात्य अंकशास्त्र",
      systemVedic: "वैदिक अंक-कुंडली",
      titleWestern: "मनो-संख्यात्मक मॅट्रिक्स",
      titleVedic: "वैदिक मूलांक इंजिन",
      descWestern: "जन्म कंपनांचे विश्लेषण करण्यासाठी पायथागोरस पद्धतीचा वारंवारता अभ्यास करा.",
      descVedic: "वैदिक अंकशास्त्राद्वारे आपल्या चरित्राची तपासणी करा, जन्माच्या दिवसांना नियंत्रित करणाऱ्या खगोलीय देवतांशी जोडा.",
      nameLabel: "पूर्ण नाव",
      dobLabel: "जन्म तारीख",
      calcYearLabel: "गणना वर्ष",
      placeholderName: "पूर्ण नाव प्रविष्ट करा...",
      computeBtnWestern: "कंपने संरेखित करा",
      computeBtnVedic: "वैदिक वारंवारता मोजा",
      launchMap: "नकाशा सुरू करा",
      guestUser: "अतिथी ओळख",
      guestEmailPlaceholder: "प्रोफाइल सुरक्षित ठेवण्यासाठी ईमेल प्रविष्ट करा...",
      saveProfileBtn: "भाग्य चार्ट जतन करा",
      savedProfilesHeader: "जतन केलेले संबंध रेकॉर्ड",
      noSavedProfiles: "या ओळखीअंतर्गत अद्याप कोणताही भाग्य रेकॉर्ड जतन केलेला नाही.",
      disclaimer: "अस्वीकरण: ज्योतिषीय डेटा आध्यात्मिक मार्गदर्शनासाठी आहे. सांसारिक क्रियाकलाप सचेत निवडीवर अवलंबून असतात.",
      calculating: "अक्ष संरेखित होत आहे...",
      reducingVedic: "मॅट्रिक्स कंप पावते आहे...",
      revealDynamicHoroscope: "खगोलीय राशीभविष्य प्रकट करा",
      fetchingHoroscope: "गोचर अद्यतनित करत आहे...",
      interactiveReport: "इंटरएक्टिव्ह भाग्य अहवाल (तपासण्यासाठी कार्डवर क्लिक करा)",
      savedSuccess: "भाग्य स्थानिक मेमरी बँकेत जतन केले गेले!",
      deleteBtn: "मिटवा",
      loadBtn: "आठवा",
      loginBtn: "ओळख स्थापित करा",
      logoutBtn: "ओळख सोडा",
      welcomeMsg: "अभयारण्य सक्रिय आहे",
      
      lifePathTitle: "जीवन मार्ग (Life Path)",
      destinyTitle: "भाग्य संख्या (Destiny)",
      soulUrgeTitle: "आत्मा इच्छा (Soul Urge)",
      personalityTitle: "व्यक्तिमत्त्व (Personality)",
      birthdayTitle: "वाढदिवस अंक (Birthday)",
      personalYearTitle: "वैयक्तिक वर्ष (Personal Year)",
      horoscopeTitle: "दैनिक वैदिक राशीभविष्य",
      horoscopeUnderTitle: "आजचे खगोलीय गोचर",
      sectorLabel: "सक्रिय जीवन क्षेत्र",
      adviceLabel: "गुरुंचा सल्ला",
      forecastLabel: "ग्रहांचा अंदाज",
      traitsLabel: "देवतेचे गुणधर्म",
      strengthsLabel: "आरोहीचे आशीर्वाद",
      weaknessesLabel: "ग्रहांच्या चेतावणी",
      careersLabel: "आजीविका आणि क्षेत्र",
      colorLabel: "ब्रह्मांडीय आभा रंग",
      rulingPlanetLabel: "स्वामी ग्रह",
      favorableDaysLabel: "अनुकूल चंद्र दिवस",
      luckyNumbersLabel: "शुभ अंक वारंवारता",
      criticalWarning: "अचूक जन्मकुंडली तयार करण्यासाठी जन्मवेळ आवश्यक आहे (केवळ तारीख दिल्यास लग्न आणि स्थानाची स्थिती उपलब्ध नसते)। खाली राशीनुसार खगोलीय स्थिती दिली आहे:"
    },
    rays: {
      badge: "खगोलीय नकाशा नक्षत्र",
      title: "संख्यात्मक नक्षत्र",
      sub: "ऊर्जावान किरणांचा शोध घ्या. डेस्कटॉपवर, ते एका जोडलेल्या ब्रह्मांडीय नकाशाच्या स्वरूपात दिसतात. संवाद साधण्यासाठी नोड्सवर माउस न्या किंवा क्लिक करा.",
      universalFreq: "सार्वभौमिक वारंवारता",
      coreEssence: "मुख्य सार आणि संरेखण",
      dominantStrengths: "✦ प्रमुख बलस्थाने",
      growthChallenges: "▲ वाढीची आव्हाने",
      cosmicElement: "ब्रह्मांडीय घटक",
      sacredSymbol: "पवित्र खगोलीय प्रतीक",
      sunMapping: "सूर्य संरेखन",
      lunarReflection: "चंद्र प्रतिबिंब",
      geometricForce: "भूमितीय बल",
      careerChannels: "💼 अत्यंत संरेखित career मार्ग",
      closeBtn: "एकीकरण बंद करा"
    },
    synergy: {
      title: "दिव्य संरेखन",
      sub: "आत्म्यांमधील सुसंगततेचे विश्लेषण करा, अनुकूल विवाह काळाची भविष्यवाणी करा आणि कुंडली गुण मिलनाचा ताळमेळ बसवा.",
      tabComp: "सुसंगतता",
      tabMarriage: "विवाहाची वेळ",
      tabKundali: "कुंडली मिलान",
      pAName: "जोडीदार A चे नाव",
      pBName: "जोडीदार B चे नाव",
      pADob: "जोडीदार A ची जन्म तारीख",
      pBDob: "जोडीदार B ची जन्म तारीख",
      pBNamePlaceholder: "जोडीदाराचे नाव प्रविष्ट करा...",
      computeBtn: "वारंवारता एकत्र करा",
      compSummaryHeader: "ब्रह्मांडीय परस्परसंबंध सारांश",
      spiritualRapport: "आध्यात्मिक ताळमेळ",
      destinyFriction: "भाग्य घर्षण",
      karmicVibe: "कर्मिक गूंज",
      verdictHeader: "एकत्रित सुसंगतता निर्णय",
      
      marriageHeader: "अनुकूल विवाह काळाची गणना करा",
      jointAnalysis: "संयुक्त विश्लेषण",
      partnerAOnly: "जोडीदार A वर लक्ष केंद्रित करा",
      partnerBOnly: "जोडीदार B वर लक्ष केंद्रित करा",
      revealWindowsBtn: "अनुकूल काळ प्रकट करा",
      computingMatrix: "मॅट्रिक्स मोजत आहे...",
      primaryWindow: "🏆 शुभ विवाह वेळ खिडकी",
      scoreLabel: "सुसंगतता प्रमाण",
      favorability: "अनुकूलतेचे लक्ष",
      timelineYear: "ग्रह वर्ष",
      jointPy: "वैदिक वैयक्तिक संतुलन",
      
      kBoyName: "वराचे नाव",
      kGirlName: "वधूचे नाव",
      kBoyDob: "वराची जन्म तारीख",
      kGirlDob: "वधूची जन्म तारीख",
      kBithTime: "जन्म वेळ",
      computeKundali: "अष्टकूट गुण मिलान",
      matchingMatrix: "अष्टकूट गुण मिलान मॅट्रिक्स",
      gunaScore: "गुण स्कोअर",
      gunaDetails: "जन्म नक्षत्रानुसार अष्टकूट गुण विभागणी:",
      reconciledSummary: "सुधारित कुंडली विश्लेषण",
      manglikCheck: "चंद्र-मांगलिक (मंगळ) प्रभाव",
      boyManglik: "वराची मांगलिक स्थिती",
      girlManglik: "वधूची मांगलिक स्थिती",
      mutualAllies: "सप्तम स्थानाच्या स्वामींचे संबंध",
      ashtakootMetrics: {
        Varna: "वर्ण (अहंकार आणि कार्य)",
        Vashya: "वश्य (प्रभाव)",
        Tara: "तारा (भाग्य आणि आरोग्य)",
        Yoni: "योनि (शारीरिक संबंध)",
        GrahaMaitri: "ग्रह मैत्री (मानसिक युती)",
        Gana: "गण (स्वभाव)",
        Bhakoot: "भकूत प्रभाव",
        Nadi: "नाडी (आनुवंशिक सुसंगतता)"
      }
    },
    tarot: {
      title: "टॅरो अभ्यास प्रयोगशाळा",
      sub: "प्राचीन अंकशास्त्र नियम, कुंडली नक्षत्रे आणि ग्रहांच्या किरणांवर प्रभुत्व मिळवण्यासाठी गुप्त विज्ञानाच्या फ्लॅशकार्ड मॅट्रिक्स तपासा.",
      mastered: "प्रभुत्व मिळवले",
      shuffling: "नशीब बदलत आहे...",
      next: "पुढील कार्ड",
      prev: "मागील कार्ड",
      markKnown: "प्रभुत्व मिळवले म्हणून चिन्हांकित करा",
      resetDeck: "डेक पुन्हा भरा",
      emptyDeck: "गुप्त प्रयोगशाळा पूर्ण भरली आहे!",
      emptySub: "तुम्ही या ब्रह्मांडीय विभागातील सर्व फ्लॅशकार्ड्सवर पूर्ण प्रभुत्व मिळवले आहे. उत्कृष्ट प्रगती, अभ्यासक.",
      flippedView: "लपलेले ज्ञान प्रकट करण्यासाठी कार्डवर क्लिक करा",
      catAll: "सर्व विषय",
      catMeanings: "संख्यांचे अर्थ",
      catBasics: "अंकशास्त्र मूलभूत गोष्टी",
      catCompatibility: "सुसंगतता / ताळमेळ",
      catSymbols: "ज्योतिषीय दुवे",
      catVedic: "वैदिक मूलांक",
      catLove: "प्रेम आणि विवाह",
      catKundali: "कुंडली मिलान",
      catCharts: "जन्म कुंडली"
    },
    zodiac: {
      title: "राशीचक्र डायल",
      sub: "राशी चक्राच्या नक्षत्रांवर माउस न्या आणि त्यांचे गणितीय संबंध, शासक ग्रह आणि संख्यात्मक किरण यांचे विश्लेषण करा.",
      linked: "जोडलेले",
      rulingSphere: "शासक गोल",
      triplicityElement: "त्रिकोणात्मक तत्व",
      resonatingKey: "कंप पावणारी अंकशास्त्र की",
      resonanceSubText: "वारंवारता आणि खगोलीय रेषा संरेखित आहेत.",
      archetypeRays: "आद्यरूपाची किरणे",
      hoverPrompt: "पत्राचार तपशील प्रकट करण्यासाठी बाह्य डायल नोड्सवर माउस न्या."
    },
    voice: {
      playing: "स्वर वाचन सुरू आहे...",
      paused: "स्वर थांबला आहे...",
      stopped: "स्वर बंद झाला",
      unavailable: "इंग्रजी व्यतिरिक्त इतर भाषांसाठी या ब्राउझर/डिव्हाइसवर वाचन स्वर उपलब्ध नाही.",
      assistantName: "Svara ओरेकल व्हॉईस",
      controlHeader: "स्वर वाचन नियंत्रण"
    }
  },
  gu: {
    loading: "બ્રહ્માંડીય ક્ષેત્રો ગોઠવી રહ્યાં છે...",
    tabs: {
      portal: "પોર્ટલ",
      "ank-map": "અંક-નકશા",
      rays: "કિરણો",
      tarot: "ટેરોટ",
      synergy: "મેળાવ / સાયુજ્ય",
      zodiac: "રાશિફળ"
    },
    portal: {
      tagline: "તમારા આત્માની કંપનયુક્ત બ્લૂપ્રિન્ટની શોધ કરો. તમારા ભાગ્યના માર્ગની ગણતરી કરો, રહસ્યમય ટેરોટ કાર્ડ્સનો અભ્યાસ કરો અને દૈવી સુમેળનું વિલીનીકરણ કરો.",
      cta: "ભાગ્ય સાથે સંરેખિત થાઓ",
      alignDown: "નીચે સંરેખિત કરો",
      credits: "વિકસિત કરનાર",
      welcomeTitle: "WELCOME TO AnkDrishti",
      welcomeSubtitle: "અંકશાસ્ત્ર અને પ્રાચીન વૈદિક જ્યોતિષશાસ્ત્રનો એક પવિત્ર સંગમ",
      welcomeMessage: "અમે તમને તમારા જીવન માર્ગની કંપન આવર્તનની શોધ કરવા, પૂર્વજોના જોડાણોને સમજવા, સંબંધોની સુસંગતતા જોવા અને આકાશના રહસ્યમય ભૌમિતિક નકશાઓને સમજવા માટે આમંત્રિત કરીએ છીએ. આશા છે કે તમારો આત્મ-શોધનો પ્રવાસ તમને સ્પષ્ટતા, પ્રગાઢ શાંતિ અને દૈવી આશીર્વાદ પ્રદાન કરે."
    },
    calc: {
      systemWestern: "પશ્ચિમી અંકશાસ્ત્ર",
      systemVedic: "વૈદિક અંક-કુંડળી",
      titleWestern: "મનો-સંખ્યાત્મક મેટ્રિક્સ",
      titleVedic: "વૈદિક મૂલાંક એન્જિન",
      descWestern: "જન્મ સ્પંદનોનું વિશ્લેષણ કરવા પાયથાગોરસ પદ્ધતિનો ઉપયોગ કરી સુસંગતતા મેળવો.",
      descVedic: "વૈદિક અંકશાસ્ત્ર દ્વારા તમારા ચારિત્ર્યની તપાસ કરો, જન્મના દિવસોને શાસન કરતા આકાશી દેવો સાથે જોડો.",
      nameLabel: "પૂરું નામ",
      dobLabel: "જન્મ તારીખ",
      calcYearLabel: "જન્મ વર્ષ",
      placeholderName: "જન્મ નું પૂરું નામ લખો...",
      computeBtnWestern: "સ્પંદનો સંરેખિત કરો",
      computeBtnVedic: "વૈદિક કંપનો ગણો",
      launchMap: "નકશો શરૂ કરો",
      guestUser: "અતિથિ ઓળખ",
      guestEmailPlaceholder: "પ્રોફાઇલ સાચવવા માટે ઇમેઇલ લખો...",
      saveProfileBtn: "ભાગ્ય ચાર્ટ સાચવો",
      savedProfilesHeader: "સાચવેલા સંબંધ રેકોર્ડ",
      noSavedProfiles: "આ ઓળખ હેઠળ હજી સુધી કોઈ ભાગ્ય રેકોર્ડ સાચવવામાં આવ્યો નથી.",
      disclaimer: "અસ્વીકરણ: જ્યોતિષીય ડેટા આધ્યાત્મિક માર્ગદર્શન માટે છે. સાંસારિક પ્રવૃત્તિઓ સભાન પસંદગી પર આધારિત છે.",
      calculating: "ધરી સંરેખિત થઈ રહી છે...",
      reducingVedic: "મેટ્રિક્સ કંપન પામી રહ્યું છે...",
      revealDynamicHoroscope: "ખગોળીય રાશિફળ પ્રગટ કરો",
      fetchingHoroscope: "ગોચર અપડેટ થઈ રહ્યું છે...",
      interactiveReport: "ઇન્ટરેક્ટિવ ભાગ્ય અહેવાલ (તપાસવા માટે કાર્ડ પર ક્લિક કરો)",
      savedSuccess: "ભાગ્ય સ્થાનિક મેમરી બેંકમાં સાચવવામાં આવ્યું!",
      deleteBtn: "ભૂંસો",
      loadBtn: "યાદ કરો",
      loginBtn: "ઓળખ સ્થાપિત કરો",
      logoutBtn: "ઓળખ છોડો",
      welcomeMsg: "અભયારણ્ય સક્રિય છે",
      
      lifePathTitle: "જીવન માર્ગ (Life Path)",
      destinyTitle: "ભાગ્ય સંખ્યા (Destiny)",
      soulUrgeTitle: "આત્મા ઇચ્છા (Soul Urge)",
      personalityTitle: "વ્યક્તિત્વ (Personality)",
      birthdayTitle: "જન્મદિવસ અંક (Birthday)",
      personalYearTitle: "વ્યક્તિગત વર્ષ (Personal Year)",
      horoscopeTitle: "દૈનિક વૈદિક રાશિફળ",
      horoscopeUnderTitle: "આજના ખગોળીય ગોચર",
      sectorLabel: "સક્રિય જીવન ક્ષેત્ર",
      adviceLabel: "ગુરુની સલાહ",
      forecastLabel: "ગ્રહોની આગાહી",
      traitsLabel: "દેવતાના ગુણો",
      strengthsLabel: "આરોહીના આશીર્વાદ",
      weaknessesLabel: "ગ્રહોની ચેતવણી",
      careersLabel: "જીવિકા અને ક્ષેત્ર",
      colorLabel: "બ્રહ્માંડીય આભા રંગ",
      rulingPlanetLabel: "સ્વામી ગ્રહ",
      favorableDaysLabel: "અનુકૂળ ચંદ્ર દિવસ",
      luckyNumbersLabel: "શુભ અંક આવર્તનો",
      criticalWarning: "ચોક્કસ જન્મકુંડળી બનાવવા માટે જન્મ સમય જરૂરી છે (માત્ર તારીખ આપવાથી લગ્ન અને ઘરની સ્થિતિ ઉપલબ્ધ હોતી નથી). રાશિ પ્રમાણે ખગોળીય સ્થિતિ નીચે મુજબ છે:"
    },
    rays: {
      badge: "ખગોળીય નકશા નક્ષત્ર",
      title: "સંખ્યાત્મક નક્ષત્રમાળા",
      sub: "ઊર્જાસભર કિરણોની શોધ કરો. ડેસ્કટોપ પર, તેઓ એક જોડાયેલા બ્રહ્માંડીય નકશા તરીકે ગોઠવાય છે. ક્રિયાપ્રતિક્રિયા માટે નોડ્સ પર માઉસ લઈ જાઓ અથવા ક્લિક કરો.",
      universalFreq: "સાર્વત્રિક કંપન આવર્તન",
      coreEssence: "મુખ્ય તત્વ અને સંરેખણ",
      dominantStrengths: "✦ મુખ્ય શક્તિઓ",
      growthChallenges: "▲ વિકાસલક્ષી પડકારો",
      cosmicElement: "બ્રહ્માંડીય તત્વ",
      sacredSymbol: "પવિત્ર ખગોળીય પ્રતીક",
      sunMapping: "સૂર્ય મેપિંગ",
      lunarReflection: "ચંદ્ર પ્રતિબિંબ",
      geometricForce: "ભૌમિતિક બળ",
      careerChannels: "💼 ખૂબ જ અનુકૂળ કારકિર્દી વિકલ્પો",
      closeBtn: "મેળાપ બંધ કરો"
    },
    synergy: {
      title: "દૈવી સંરેખણ",
      sub: "આત્માઓ વચ્ચે સુસંગતતાના પરિબળો વિશ્લેષણ કરો, અનુકૂળ લગ્ન ગાળાની આગાહી કરો, અને કુંડળી ગુણ મિલનનો મેળ મેળવો.",
      tabComp: "સુસંગતતા",
      tabMarriage: "લગ્નનો સમય",
      tabKundali: "કુંડળી મેળવણી",
      pAName: "ભાગીદાર A નું નામ",
      pBName: "ભાગીદાર B નું નામ",
      pADob: "ભાગીદાર A ની જન્મ તારીખ",
      pBDob: "ભાગીદાર B ની જન્મ તારીખ",
      pBNamePlaceholder: "ભાગીદારનું નામ લખો...",
      computeBtn: "આવર્તનો એકત્રિત કરો",
      compSummaryHeader: "બ્રહ્માંડીય પરસ્પર સંબંધો સારાંશ",
      spiritualRapport: "આધ્યાત્મિક મેળાવ",
      destinyFriction: "ભાગ્ય ઘર્ષણ",
      karmicVibe: "કાર્મિક ગુંજારવ",
      verdictHeader: "સંયુક્ત સુસંગતતા નિર્ણય",
      
      marriageHeader: "અનુકૂળ લગ્ન સમયની ગણતરી કરો",
      jointAnalysis: "સંયુક્ત વિશ્લેષણ",
      partnerAOnly: "ભાગીદાર A પર ધ્યાન આપો",
      partnerBOnly: "ભાગીદાર B પર ધ્યાન આપો",
      revealWindowsBtn: "અનુકૂળ લગ્ન સમય પ્રગટ કરો",
      computingMatrix: "મેટ્રિક્સ ગણી રહ્યાં છે...",
      primaryWindow: "🏆 શુભ લગ્ન સમય વિન્ડો",
      scoreLabel: "સુસંગતતા ગુણોત્તર",
      favorability: "અનુકૂળતાનું કેન્દ્ર",
      timelineYear: "ગ્રહ વર્ષ",
      jointPy: "વૈદિક વ્યક્તિગત સંતુલન",
      
      kBoyName: "વરનું નામ",
      kGirlName: "કન્યાનું નામ",
      kBoyDob: "વરની જન્મ તારીખ",
      kGirlDob: "કન્યાની જન્મ તારીખ",
      kBithTime: "જન્મ સમય",
      computeKundali: "અષ્ટકૂટ ગુણ મિલન",
      matchingMatrix: "અષ્ટકૂટ ગુણ મિલન મેટ્રિક્સ",
      gunaScore: "ગુણ સ્કોર",
      gunaDetails: "જન્મ નક્ષત્ર આધારિત અષ્ટકૂટ ગુણ વિભાજન:",
      reconciledSummary: "સંશોધિત કુંડળી વિશ્લેષણ",
      manglikCheck: "ચંદ્ર-માંગલિક (મંગળ) અસરો",
      boyManglik: "વરની માંગલિક સ્થિતિ",
      girlManglik: "કન્યાની માંગલિક સ્થિતિ",
      mutualAllies: "સપ્તમ સ્થાનના સ્વામીઓનો સંબંધ",
      ashtakootMetrics: {
        Varna: "વર્ણ (અહંકાર અને કાર્ય)",
        Vashya: "વશ્ય (પ્રભાવ)",
        Tara: "તારા (ભાગ્ય અને આરોગ્ય)",
        Yoni: "યોનિ (શારીરિક આકર્ષણ)",
        GrahaMaitri: "ગ્રહ મૈત્રી (માનસિક જોડાણ)",
        Gana: "ગણ (સ્વભાવ)",
        Bhakoot: "ભકૂટ અસર",
        Nadi: "નાડી (આનુવંશિક સુસંગતતા)"
      }
    },
    tarot: {
      title: "ટેરોટ અભ્યાસ લેબ",
      sub: "પ્રાચીન અંકશાસ્ત્ર નિયમો, કુંડળી નક્ષત્રો અને ગ્રહોના કિરણો ઉપર પ્રભુત્વ મેળવવા ગુપ્ત વિજ્ઞાનના ફ્લેશકાર્ડ મેટ્રિક્સ તપાસો.",
      mastered: "પ્રભુત્વ મેળવ્યું",
      shuffling: "નસીબ બદલી રહ્યાં છે...",
      next: "બીજું કાર્ડ",
      prev: "પહેલું કાર્ડ",
      markKnown: "પ્રભુત્વ મેળવ્યું તરીકે અંકિત કરો",
      resetDeck: "ડેક ફરી ભરો",
      emptyDeck: "ગુપ્ત ક્ષેત્ર પૂર્ણ ભરેલું છે!",
      emptySub: "તમે આ બ્રહ્માંડીય વિભાગના તમામ ફ્લેશકાર્ડ્સ પર સંપૂર્ણ પ્રભુત્વ મેળવ્યું છે. ઉત્તમ પ્રગતિ, અભ્યાસુ.",
      flippedView: "છુપાયેલું જ્ઞાન પ્રગટ કરવા કાર્ડ પર ક્લિક કરો",
      catAll: "બધા વિષયો",
      catMeanings: "સંખ્યાત્મક અર્થો",
      catBasics: "અંકશાસ્ત્રના મૂળ તત્વો",
      catCompatibility: "મેળાપ અને સુસંગતતા",
      catSymbols: "જ્યોતિષીય સંબંધો",
      catVedic: "વૈદિક મૂલાંક",
      catLove: "પ્રેમ અને લગ્ન",
      catKundali: "કુંડળી મેળવણી",
      catCharts: "જન્મ કુંડળી"
    },
    zodiac: {
      title: "રાશિચક્ર કંપાસ",
      sub: "રાશિચક્રના નક્ષત્રો પર માઉસ લઈ જાઓ અને તેમના ગાણિતિક સંબંધો, અધિપતિ નક્ષત્રો અને અંકશાસ્ત્રીય કિરણોનું વિશ્લેષણ કરો.",
      linked: "જોડાયેલું",
      rulingSphere: "શાસક ગોળો",
      triplicityElement: "ત્રિગુણાત્મક તત્વ",
      resonatingKey: "કંપનયુક્ત અંકશાસ્ત્ર કી",
      resonanceSubText: "આવર્તનો અને ખગોળીય રેખાઓ સંરેખિત છે.",
      archetypeRays: "આદિરૂપ કિરણો",
      hoverPrompt: "સંબંધિત વિગતો પ્રગટ કરવા માટે બાહ્ય રિંગ નોડ્સ પર માઉસ લઈ જાઓ."
    },
    voice: {
      playing: "સ્વરા વાંચન ચાલુ છે...",
      paused: "સ્વરા વાંચન અટકેલું છે...",
      stopped: "સ્વરા વાંચન બંધ થયું",
      unavailable: "અંગ્રેજી સિવાયની અન્ય ભાષાઓ માટે આ બ્રાઉઝર/ઉપકરણ પર વાચન સ્વર ઉપલબ્ધ નથી.",
      assistantName: "Svara ઓરેકલ વૉઇસ",
      controlHeader: "સ્વરા વાંચન નિયંત્રણ"
    }
  }
};

export const localizedNumberMeanings: Record<string, Record<string | number, NumberMeaning>> = {
  en: {
    "0": {
      number: "0",
      title: "The Primordial Source",
      essence: "The cosmic circle of infinite potential, representing the unmanifest, divine empty space, and the spark of absolute creation.",
      strengths: ["Infinite potentials", "Direct connection to source", "Unconditional freedom", "Spiritual reset state"],
      challenges: ["Lack of boundaries", "Directionless floating", "Overwhelmed by choice"],
      careers: ["Quantum Theorist", "Spiritual Practitioner", "Cosmologist", "Visionary disruptor"],
      element: "Cosmic Ether",
      color: "#e879f9",
      symbol: "∞"
    },
    "1": {
      number: 1,
      title: "The Pioneer Leader",
      essence: "Individualism, primal courage, initiating new pathways, independence, and the ultimate drive to create and stand as a unique force.",
      strengths: ["Unyielding courage", "Sovereign autonomy", "Pioneering vision", "Strong personal initiative"],
      challenges: ["Egotistical dominance", "Impatient outbursts", "Underlying fear of failure"],
      careers: ["Tech Entrepreneur", "Lead Architect", "Venture Capitalist", "Creative Director"],
      element: "Fire",
      color: "#ef4444",
      symbol: "☉"
    },
    "2": {
      number: 2,
      title: "The Harmonious Peacemaker",
      essence: "Exquisite diplomatic tact, duality in balance, deep intuitive empathy, cooperation, and healing through gentle reconciliation.",
      strengths: ["Highly empathetic", "Subtle mediation skills", "Supportive loyalty", "Vibrant emotional depth"],
      challenges: ["Severe codependency", "Hypersensitive to criticism", "Paralyzing indecisiveness"],
      careers: ["International Diplomat", "Relationship Therapist", "Curation Specialist", "Strategic Negotiator"],
      element: "Water",
      color: "#f97316",
      symbol: "☽"
    },
    "3": {
      number: 3,
      title: "The Creative Catalyst",
      essence: "Joyous self-expression, artistic verbal expansion, intellectual socialization, and magnifying divine inspiration into community.",
      strengths: ["Radiant optimism", "Highly charismatic voice", "Prolific imagination", "Wit and charm"],
      challenges: ["Scattered focus and energy", "Exaggeration trends", "Superficial reactions"],
      careers: ["Novelist / Screenwriter", "Theater Actor", "Creative Strategist", "Public Relations Lead"],
      element: "Air",
      color: "#fbbf24",
      symbol: "♃"
    },
    "4": {
      number: 4,
      title: "The Master Architect",
      essence: "Pragmatic systemic foundations, unshakeable stability, concrete focus, and mapping out structural boundaries that stand the test of time.",
      strengths: ["High self-discipline", "Meticulous organization", "Absolute dependability", "Practical realism"],
      challenges: ["Extreme rigidness", "Staggering stubbornness", "Fear of experimental change"],
      careers: ["Structural Engineer", "Financial Risk Officer", "Chief Operations Analyst", "Civil Architect"],
      element: "Earth",
      color: "#10b981",
      symbol: "♅"
    },
    "5": {
      number: 5,
      title: "The Universal Explorer",
      essence: "Sensation in movement, radical personal freedom, sensory adaptation, and learning through diverse direct physical and mental experiences.",
      strengths: ["Exceptional versatility", "Inspiring magnetic charm", "Resourceful adaptability", "Pioneering travels"],
      challenges: ["Severe restlessness", "Impulsive self-indulgence", "Commitment hesitation"],
      careers: ["Foreign correspondent", "Travel Filmmaker", "Brand Evangelist", "Venture Scout"],
      element: "Ether",
      color: "#06b6d4",
      symbol: "☿"
    },
    "6": {
      number: 6,
      title: "The Sacred Nurturer",
      essence: "Cosmic parental duty, harmony in artistic forms, unconditional healing, and establishing beautiful domestic security.",
      strengths: ["Deep protective love", "Natural systemic healing", "Altruistic responsibility", "Artistic eye"],
      challenges: ["Suffocating martyr attitude", "Intrusive interference", "Severe perfectionist demands"],
      careers: ["Pediatric Surgeon", "Holistic Clinician", "Luxury Interior Designer", "Educational Reformer"],
      element: "Earth",
      color: "#ec4899",
      symbol: "♀"
    },
    "7": {
      number: 7,
      title: "The Mystical Scholar",
      essence: "Skeptical analytic research, intense scientific inspection, meditative silence, and decalcifying illusions to reach core spiritual truth.",
      strengths: ["Serrated logic mind", "Profound psychic intuition", "Contemplative deep composure", "Exceptional focus"],
      challenges: ["Emotional aloofness", "Cynical isolation", "Paranoia and secretiveness"],
      careers: ["Biomedical Researcher", "Intelligence Analyst", "Philosophy Professor", "Cryptographer"],
      element: "Water",
      color: "#3b82f6",
      symbol: "♆"
    },
    "8": {
      number: 8,
      title: "The Sovereign Authority",
      essence: "Mastery of material power, financial intelligence, heavy responsibility, and aligning worldly gains with cosmic karmic checks.",
      strengths: ["Commanding executive power", "Exceptional resilience", "Financial foresight", "Strong leadership"],
      challenges: ["Callous materialism", "Obsessive workaholism", "Domineering control tactics"],
      careers: ["Chief Executive Officer", "Investment Partner", "Industrial Tycoon", "Corporate Attorney"],
      element: "Earth",
      color: "#8b5cf6",
      symbol: "♄"
    },
    "9": {
      number: 9,
      title: "The Cosmic Philanthropist",
      essence: "Universal unconditional love, spiritual completion, global vision, idealistic self-sacrifice, and humanitarian guidance of peers.",
      strengths: ["Universal compassion", "Generous broad perspective", "Artistic high genius", "Highly charismatic leadership"],
      challenges: ["Miserable disillusionment", "Unfocused sacrifice", "Holding onto deep-seated grudges"],
      careers: ["Humanitarian Advocate", "Environmental Leader", "Fine Artist / Philosopher", "Global Philanthropist"],
      element: "Fire",
      color: "#a855f7",
      symbol: "♂"
    },
    "11": {
      number: 11,
      title: "The Master Intuitive",
      essence: "Illumination, psychic gateway channels, spiritual catalyst, bridging cosmic realms with earth grids, and acting as a lightning rod of solar truth.",
      strengths: ["Infinite spiritual vision", "Supernatural premonitions", "Electrifying charisma", "Deep empathic healing"],
      challenges: ["Staggering nervous tension", "Severe self-doubt and paranoia", "Overwhelming sensitivity"],
      careers: ["Spiritual Luminary", "Esoteric Researcher", "Pioneering Inventor", "Psychic Advisor"],
      element: "Cosmic Fire",
      color: "#fb7185",
      symbol: "🌟"
    },
    "22": {
      number: 22,
      title: "The Master Builder",
      essence: "Grounding pristine cosmic concepts into concrete global infrastructures. Turning grand utopian dreaming into physical, structured realities.",
      strengths: ["Stupendous material mastery", "Unyielding pragmatism", "Double authority focus", "Infinite organization skill"],
      challenges: ["Severe fear of falling", "Paralyzing self-control efforts", "Dominant arrogance"],
      careers: ["Global Grid Architect", "International Developer", "Space Habitation Planner", "Diplomatic Director"],
      element: "Cosmic Earth",
      color: "#34d399",
      symbol: "🏰"
    },
    "33": {
      number: 33,
      title: "The Master Teacher",
      essence: "Unconditional spiritual avatar, healing the global grid through absolute empathetic compassion, deep devotion, and selfless universal service.",
      strengths: ["Unmatched spiritual warmth", "Cosmic parental healing", "Self-sacrificing service", "Absolute artistic guidance"],
      challenges: ["Suffocating grid weight", "Deep personal neglect", "Overwhelming martyrdom trends"],
      careers: ["Spiritual Healer / Avatar", "Global Educator", "Symphonist / Creative Saint", "Altruistic Visionary"],
      element: "Cosmic Water",
      color: "#60a5fa",
      symbol: "🕉️"
    }
  },
  hi: {
    "0": {
      number: "0",
      title: "आदि स्रोत (शून्य)",
      essence: "अनंत क्षमता का खगोलीय चक्र, जो अव्यक्त, दिव्य खाली स्थान और पूर्ण रचना की चिंगारी का प्रतिनिधित्व करता है।",
      strengths: ["अनंत क्षमताएं", "स्रोत से सीधा संबंध", "बिना शर्त स्वतंत्रता", "आध्यात्मिक रीसेट स्थिति"],
      challenges: ["सीमाओं की कमी", "दिशाहीन तैरना", "विकल्पों से अभिभूत होना"],
      careers: ["क्वांटम सिद्धांतकार", "आध्यात्मिक अभ्यासी", "ब्रह्मांड विज्ञानी", "दूरदर्शी विघटनकर्ता"],
      element: "ब्रह्मांडीय आकाश (Ether)",
      color: "#e879f9",
      symbol: "∞"
    },
    "1": {
      number: 1,
      title: "अग्रणी नेता",
      essence: "व्यक्तिवाद, मौलिक साहस, नए रास्ते शुरू करना, स्वतंत्रता, और एक अद्वितीय शक्ति के रूप में खड़े होने की अंतिम इच्छा।",
      strengths: ["अदम्य साहस", "संप्रभु स्वायत्तता", "अग्रणी दृष्टि", "मजबूत व्यक्तिगत पहल"],
      challenges: ["अहंकारी प्रभुत्व", "अधीर विस्फोट", "विफलता का अंतर्निहित डर"],
      careers: ["टेक उद्यमी", "मुख्य वास्तुकार", "उद्यम पूंजीपति", "रचनात्मक निदेशक"],
      element: "अग्नि (Fire)",
      color: "#ef4444",
      symbol: "☉"
    },
    "2": {
      number: 2,
      title: "शांतिदूत और मध्यस्थ",
      essence: "उत्कृष्ट कूटनीतिक चातुर्य, संतुलन में द्वंद्व, गहन सहज सहानुभूति, सहयोग, और सौम्य सुलह के माध्यम से उपचार।",
      strengths: ["अत्यधिक सहानुभूति", "सूक्ष्म मध्यस्थता कौशल", "सहायक निष्ठा", "जीवंत भावनात्मक गहराई"],
      challenges: ["गंभीर सह-निर्भरता", "आलोचना के प्रति अतिसंवेदनशील", "पंगु बना देने वाली अनिर्णय"],
      careers: ["अंतरराष्ट्रीय राजनयिक", "संबंध थेरेपिस्ट", "क्यूरेशन विशेषज्ञ", "रणनीतिक वार्ताकार"],
      element: "जल (Water)",
      color: "#f97316",
      symbol: "☽"
    },
    "3": {
      number: 3,
      title: "रचनात्मक उत्प्रेरक",
      essence: "आनंदमय आत्म-अभिव्यक्ति, कलात्मक मौखिक विस्तार, बौद्धिक समाजीकरण, और समुदाय में दिव्य प्रेरणा का विस्तार करना।",
      strengths: ["उज्ज्वल आशावाद", "अत्यधिक करिश्माई आवाज", "प्रचुर कल्पना शक्ति", "बुद्धिमानी और आकर्षण"],
      challenges: ["बिखरा हुआ ध्यान और ऊर्जा", "अतिशयोक्ति झुकाव", "सतही प्रतिक्रियाएं"],
      careers: ["उपन्यासकार / पटकथा लेखक", "थिएटर कलाकार", "रचनात्मक रणनीतिकार", "पब्लिक रिलेशंस लीड"],
      element: "वायु (Air)",
      color: "#fbbf24",
      symbol: "♃"
    },
    "4": {
      number: 4,
      title: "मास्टर आर्किटेक्ट",
      essence: "व्यावहारिक प्रणालीगत नींव, अटूट स्थिरता, ठोस ध्यान, और संरचनात्मक सीमाओं का मानचित्रण जो समय की कसौटी पर खड़ी उतरती हैं।",
      strengths: ["उच्च आत्म-अनुशासन", "सावधानीपूर्वक संगठन", "पूर्ण विश्वसनीयता", "व्यावहारिक यथार्थवाद"],
      challenges: ["अत्यधिक कठोरता", "चौंकाने वाली जिद", "प्रायोगिक परिवर्तन का डर"],
      careers: ["संरचनात्मक इंजीनियर", "वित्तीय जोखिम अधिकारी", "मुख्य परिचालन विश्लेषक", "सिविल आर्किटेक्ट"],
      element: "पृथ्वी (Earth)",
      color: "#10b981",
      symbol: "♅"
    },
    "5": {
      number: 5,
      title: "वैश्विक अन्वेषक",
      essence: "आंदोलन में सनसनी, कट्टरपंथी व्यक्तिगत स्वतंत्रता, संवेदी अनुकूलन, और विभिन्न प्रत्यक्ष शारीरिक और मानसिक अनुभवों के माध्यम से सीखना।",
      strengths: ["असाधारण बहुमुखी प्रतिभा", "प्रेरक चुंबकीय आकर्षण", "संसाधन अनुकूलनशीलता", "अग्रणी यात्राएं"],
      challenges: ["गंभीर बेचैनी", "आवेगी आत्म-भोग", "प्रतिबद्धता में हिचकिचाहट"],
      careers: ["विदेशी संवाददाता", "ट्रैवल फिल्म निर्माता", "ब्रांड प्रचारक", "उद्यम स्काउट"],
      element: "आकाश (Ether)",
      color: "#06b6d4",
      symbol: "☿"
    },
    "6": {
      number: 6,
      title: "पवित्र संरक्षक",
      essence: "ब्रह्मांडीय माता-पिता का कर्तव्य, कलात्मक रूपों में सामंजस्य, बिना शर्त उपचार, और सुंदर घरेलू सुरक्षा स्थापित करना।",
      strengths: ["गहरा सुरक्षात्मक प्यार", "प्राकृतिक प्रणालीगत उपचार", "परोपकारी जिम्मेदारी", "कलात्मक दृष्टिकोण"],
      challenges: ["दमघोंटू शहीद रवैया", "दखल देने वाला हस्तक्षेप", "गंभीर पूर्णतावादी मांगें"],
      careers: ["बाल रोग सर्जन", "समग्र चिकित्सक", "लक्जरी इंटीरियर डिजाइनर", "शैक्षिक सुधारक"],
      element: "पृथ्वी (Earth)",
      color: "#ec4899",
      symbol: "♀"
    },
    "7": {
      number: 7,
      title: "रहस्यमयी विद्वान",
      essence: "संदेहवादी विश्लेषणात्मक अनुसंधान, गहन वैज्ञानिक निरीक्षण, ध्यानपूर्ण मौन, और मूल आध्यात्मिक सत्य तक पहुँचने के लिए भ्रमों को दूर करना।",
      strengths: ["तीक्ष्ण तार्किक दिमाग", "गहन मानसिक अंतर्ज्ञान", "चिंतनशील गहरा धैर्य", "असाधारण ध्यान"],
      challenges: ["भावनात्मक अलगाव", "निंदक अकेलापन", "पैरानोइया और गोपनीयता"],
      careers: ["बायोमेडिकल शोधकर्ता", "खुफिया विश्लेषक", "दर्शन के प्रोफेसर", "क्रिप्टोग्राफर"],
      element: "जल (Water)",
      color: "#3b82f6",
      symbol: "♆"
    },
    "8": {
      number: 8,
      title: "संप्रभु सत्ता (कर्म प्रमुख)",
      essence: "भौतिक शक्ति पर नियंत्रण, वित्तीय समझ, भारी जिम्मेदारी, और ब्रह्मांडीय कर्मों के साथ सांसारिक लाभों को संरेखित करना।",
      strengths: ["कमांडिंग कार्यकारी शक्ति", "असाधारण लचीलापन", "वित्तीय दूरदर्शिता", "मजबूत नेतृत्व"],
      challenges: ["निर्दयी भौतिकवाद", "जुनूनी कार्यशीलता", "दबंग नियंत्रण रणनीति"],
      careers: ["मुख्य कार्यकारी अधिकारी", "निवेश भागीदार", "औद्योगिक टाइकून", "कॉर्पोरेट वकील"],
      element: "पृथ्वी (Earth)",
      color: "#8b5cf6",
      symbol: "♄"
    },
    "9": {
      number: 9,
      title: "ब्रह्मांडीय परोपकारी",
      essence: "बिना शर्त सार्वभौमिक प्रेम, आध्यात्मिक पूर्णता, वैश्विक दृष्टि, आदर्शवादी आत्म-बलिदान, और साथियों का मानवीय मार्गदर्शन।",
      strengths: ["सार्वभौमिक करुणा", "उदार व्यापक परिप्रेक्ष्य", "कलात्मक उच्च प्रतिभा", "अत्यधिक चुंबकीय नेतृत्व"],
      challenges: ["निराशाजनक मोहभंग", "अकेंद्रित बलिदान", "गहरे मतभेदों को थामना"],
      careers: ["मानवीय अधिवक्ता", "पर्यावरण नेता", "ललित कलाकार / दार्शनिक", "वैश्विक परोपकारी"],
      element: "अग्नि (Fire)",
      color: "#a855f7",
      symbol: "♂"
    },
    "11": {
      number: 11,
      title: "मास्टर अंतर्ज्ञानी (11)",
      essence: "ज्ञानोदय, मानसिक प्रवेश द्वार, आध्यात्मिक उत्प्रेरक, पृथ्वी ग्रिड के साथ ब्रह्मांडीय क्षेत्रों को जोड़ना, और सौर सत्य की बिजली की छड़ के रूप में कार्य करना।",
      strengths: ["अनंत आध्यात्मिक दृष्टि", "अलौकिक पूर्वाभास", "विद्युतीय आकर्षण", "गहन सहानुभूतिपूर्ण उपचार"],
      challenges: ["स्तब्ध कर देने वाला मानसिक तनाव", "गंभीर आत्म-संदेह और डर", "अत्यधिक संवेदनशीलता"],
      careers: ["आध्यात्मिक प्रदीपक", "गूढ़ शोधकर्ता", "अग्रणी आविष्कारक", "मानसिक सलाहकार"],
      element: "ब्रह्मांडीय अग्नि",
      color: "#fb7185",
      symbol: "🌟"
    },
    "22": {
      number: 22,
      title: "मास्टर बिल्डर (22)",
      essence: "प्राचीन ब्रह्मांडीय अवधारणाओं को ठोस वैश्विक बुनियादी ढांचे में जमीनी स्तर पर उतारना। भव्य सपनों को भौतिक वास्तविकता में बदलना।",
      strengths: ["अद्भुत भौतिक महारत", "अटूट व्यावहारिकता", "दोहरा अधिकार ध्यान", "अनंत संगठनात्मक कौशल"],
      challenges: ["गिरने का गंभीर भय", "पंगु बनाने वाले आत्म-नियंत्रण प्रयास", "दबंग अहंकार"],
      careers: ["वैश्विक ग्रिड आर्किटेक्ट", "अंतरराष्ट्रीय विकासकर्ता", "अंतरिक्ष आवास योजनाकार", "राजनयिक निदेशक"],
      element: "ब्रह्मांडीय पृथ्वी",
      color: "#34d399",
      symbol: "🏰"
    },
    "33": {
      number: 33,
      title: "मास्टर शिक्षक (33)",
      essence: "बिना शर्त आध्यात्मिक अवतार, पूर्ण सहानुभूतिपूर्ण करुणा, गहन भक्ति और निःस्वार्थ सार्वभौमिक सेवा के माध्यम से वैश्विक ग्रिड का उपचार करना।",
      strengths: ["बेजोड़ आध्यात्मिक गर्मजोशी", "ब्रह्मांडीय माता-पिता सा उपचार", "आत्म-बलिदान सेवा", "पूर्ण कलात्मक मार्गदर्शन"],
      challenges: ["दमघोंटू ग्रिड का वजन", "गहरी व्यक्तिगत उपेक्षा", "अत्यधिक शहादत झुकाव"],
      careers: ["आध्यात्मिक चिकित्सक", "वैश्विक शिक्षक", "सिम्फनिस्ट / रचनात्मक संत", "परोपकारी दूरदर्शी"],
      element: "ब्रह्मांडीय जल",
      color: "#60a5fa",
      symbol: "🕉️"
    }
  },
  bn: {
    "0": {
      number: "0",
      title: "আদি উত্স (শূন্য)",
      essence: "অনন্ত সম্ভাব্যতার মহাজাগতিক চক্র, যা অপ্রকাশিত, ঐশ্বরিক শূন্য স্থান এবং নিখুঁত সৃষ্টির স্ফুলিঙ্গ ধারণ করে।",
      strengths: ["অনন্ত সম্ভাবনা", "উত্স থেকে সরাসরি সংযোগ", "শর্তহীন স্বাধীনতা", "আধ্যাত্মিক পুনরায় সেট করার অবস্থা"],
      challenges: ["সীমানার অভাব", "দিকহীন তরণ", "বিকল্পের দ্বারা অভিভূত হওয়া"],
      careers: ["কোয়ান্টাম নীতিবিদ", "আধ্যাত্মিক গবেষক", "মহাবিশ্ব বিজ্ঞানী", "দূরদর্শী ব্যক্তিত্ব"],
      element: "মহাজাগতিক আকাশ (Ether)",
      color: "#e879f9",
      symbol: "∞"
    },
    "1": {
      number: 1,
      title: "অগ্রগামী নেতা",
      essence: "স্বাতন্ত্র্যবাদ, মৌলিক সাহস, নতুন দিগন্ত উন্মোচন, স্বাধীনতা এবং এক অনন্য শক্তি হিসেবে দাঁড়ানোর তীব্র আকাঙ্ক্ষা।",
      strengths: ["অদম্য সাহস", "স্বায়ত্তশাসন", "অগ্রগামী দৃষ্টিভঙ্গি", "তীব্র ব্যক্তিগত উদ্যোগ"],
      challenges: ["অহংকারী মনোভাব", "ধৈর্যচ্যুতি", "ব্যর্থতার লুকানো ভয়"],
      careers: ["উদ্যোক্তা", "প্রধান স্থপতি", "বিনিয়োগকারী", "ক্রিয়েটিভ ডিরেক্টর"],
      element: "আগুন (Fire)",
      color: "#ef4444",
      symbol: "☉"
    },
    "2": {
      number: 2,
      title: "শান্তিদূত এবং মধ্যস্থতাকারী",
      essence: "অপূর্ব কূটনৈতিক চতুরতা, ভারসাম্যে দ্বৈততা, গভীর সহানুভূতি, সহযোগিতা এবং মৃদু মীমাংসার মাধ্যমে সুস্থতা আনয়ন।",
      strengths: ["অত্যন্ত সহানুভূতিশীল", "সূক্ষ্ম মধ্যস্থতা দক্ষতা", "সহযোগিতামূলক বিশ্বস্ততা", "আবেগীয় গভীরতা"],
      challenges: ["অতিরিক্ত নির্ভরশীলতা", "সমালোচনায় সংবেদনশীলতা", "সিদ্ধান্তহীনতা"],
      careers: ["কূটনীতিক", "সম্পর্কের পরামর্শদাতা", "কোরেশন বিশেষজ্ঞ", "কৌশলগত মধ্যস্থতাকারী"],
      element: "জল (Water)",
      color: "#f97316",
      symbol: "☽"
    },
    "3": {
      number: 3,
      title: "সৃজনশীল অনুঘটক",
      essence: "পরম আনন্দময় আত্মপ্রকাশ, শৈল্পিক কথ্য প্রসার, বুদ্ধিবৃত্তিক সামাজিকীকরণ এবং দেব অনুপ্রেরণাকে সমাজে ছড়িয়ে দেয়া।",
      strengths: ["উজ্জ্বল আশাবাদ", "আকর্ষণীয় কণ্ঠস্বর", "প্রচুর কল্পনাশক্তি", "বুদ্ধিমত্তা ও চমৎকার চপলতা"],
      challenges: ["ছড়ানো মনোযোগ ও শক্তি", "অতিরঞ্জিত করার প্রবণতা", "ভাসমান প্রতিক্রিয়া"],
      careers: ["ঔপন্যাসিক / চিত্রনাট্যকার", "থিয়েটার শিল্পী", "সৃজনশীল পরিকল্পনাবিদ", "জনসংযোগ কর্মকর্তা"],
      element: "বাতাস (Air)",
      color: "#fbbf24",
      symbol: "♃"
    },
    "4": {
      number: 4,
      title: "প্রধান স্থপতি",
      essence: "ব্যবহারিক পদ্ধতিগত ভিত্তি, অটল স্থায়িত্ব, সুনির্দিষ্ট মনোযোগ এবং কালজয়ী কাঠামো নির্মাণ করা।",
      strengths: ["উচ্চ আত্মশাসন", "পরিপাটি সংগঠন", "পরম নির্ভরযোগ্যতা", "বাস্তবসম্মত দৃষ্টিভঙ্গি"],
      challenges: ["অতিরিক্ত রক্ষণশীলতা", " একগুঁয়েমি", "পরিবর্তনের ভয়"],
      careers: ["কাঠামোগত স্থপতি", "ঝুঁকি বিশ্লেষক", "অপারেশন অ্যানালিস্ট", "সিভিল আর্কিটেক্ট"],
      element: "মাটি (Earth)",
      color: "#10b981",
      symbol: "♅"
    },
    "5": {
      number: 5,
      title: "বিশ্বব্রহ্মাণ্ডের অভিযাত্রী",
      essence: "গতিময় চপলতা, মৌলিক ব্যক্তিগত স্বাধীনতা, পঞ্চইন্দ্রিয়ের অভিযোজন এবং সরাসরি শারীরিক ও মানসিক অভিজ্ঞতা থেকে নতুন শিক্ষণ।",
      strengths: ["অসাধারণ বহুমুখী প্রতিভা", "আকর্ষণীয় জাদু", "উপযোগীকরণ দক্ষতা", "ভ্রমণ প্রবণতা"],
      challenges: ["চরম অস্থিরতা", "আবেগপ্রবণতা", "দীর্ঘমেয়াদী প্রতিজ্ঞায় দ্বিধাবোধ"],
      careers: ["সাংবাদিক", "ভ্রমণ চলচ্চিত্র নির্মাতা", "ব্র্যান্ড অ্যাম্বাসেডর", "উদ্যোগ স্কাউট"],
      element: "আকাশ (Ether)",
      color: "#06b6d4",
      symbol: "☿"
    },
    "6": {
      number: 6,
      title: "পবিত্র প্রতিপালক",
      essence: "মহাজাগতিক অভিভাবকত্ব, শৈল্পিক সুষমা, নিঃশর্ত নিরাময় এবং সুন্দর ঘরোয়া শান্তি স্থাপন করা।",
      strengths: ["গভীর সুরক্ষামূলক ভালোবাসা", "সুস্থতা আনয়ন", "পরউপকারী দায়বদ্ধতা", "শৈল্পিক চোখ"],
      challenges: ["উপেক্ষিত অনুভূতি", "অনধিকার প্রবেশ", "সবকিছুতেই নিখুঁত করার দাবি"],
      careers: ["শিশু সার্জন", "সামগ্রিক চিকিৎসক", "ইন্টেরিয়র ডিজাইনার", "শিক্ষা সংস্কারক"],
      element: "মাটি (Earth)",
      color: "#ec4899",
      symbol: "♀"
    },
    "7": {
      number: 7,
      title: "রহস্যময় গবেষক",
      essence: "সন্দেহবাদী বিশ্লেষণাত্মক গবেষণা, বৈজ্ঞানিক নিরীক্ষা, ধ্যানমগ্ন নীরবতা এবং পরম সত্যে পৌঁছাতে মানসিক মলিনতা দূর করা।",
      strengths: ["ধারালো যৌক্তিক মন", "তীক্ষ্ণ অন্তর্দৃষ্টি", "চিন্তাশীল গভীর গাম্ভীর্য", "অসাধারণ মনোযোগ"],
      challenges: ["আবেগীয় দূরত্ব", "নিঃসঙ্গতা", "অকারণ সন্দেহপ্রবণতা"],
      careers: ["বায়োমেডিকেল গবেষক", "গোয়েন্দা বিশ্লেষক", "দর্শনের অধ্যাপক", "ক্রিপ্টোগ্রাফার"],
      element: "জল (Water)",
      color: "#3b82f6",
      symbol: "♆"
    },
    "8": {
      number: 8,
      title: "সার্বভৌম শাসক",
      essence: "জাগতিক ক্ষমতার ওপর নিয়ন্ত্রণ, আর্থিক বুদ্ধিমত্তা, গুরুদায়িত্ব বহন এবং মহাজাগতিক নিয়মে পার্থিব অর্জনকে সারিবদ্ধ করা।",
      strengths: ["শাসন ক্ষমতা", "অসাধারণ সহনশীলতা", "আর্থিক দূরদর্শিতা", "দৃঢ় নেতৃত্ব"],
      challenges: ["কঠোর বস্তুবাদী চিন্তা", "কাজের মধ্যে অতিরিক্ত ডুবে থাকা", "আধিপত্যপ্রবণ নিয়ন্ত্রণ"],
      careers: ["প্রধান নির্বাহী কর্মকর্তা", "বিনিয়োগ অংশীদার", "শিল্পপতি", "করপোরেট আইনজীবী"],
      element: "মাটি (Earth)",
      color: "#8b5cf6",
      symbol: "♄"
    },
    "9": {
      number: 9,
      title: "মহাজাগতিক সমাজহিতৈষী",
      essence: "শর্তহীন ভালোবাসা, আধ্যাত্মিক পূর্ণতা, বৈশ্বিক চিন্তা, আদর্শগত আত্মত্যাগ এবং মানবতার পথপ্রদর্শন।",
      strengths: ["সার্বজনীন সহানুভূতি", "উদার দৃষ্টিভঙ্গি", "শৈল্পিক মেধা", "আকর্ষণীয় নেতৃত্ব"],
      challenges: ["হতাশা ও মোহভঙ্গ", "লক্ষ্যহীন ত্যাগ", "পুরনো ক্ষোভ ধরে রাখা"],
      careers: ["আইনজীবী", "পরিবেশবিদ", "দার্শনিক", "সমাজসেবক"],
      element: "আগুন (Fire)",
      color: "#a855f7",
      symbol: "♂"
    },
    "11": {
      number: 11,
      title: "মাস্টার ইনটুইটিভ (১১)",
      essence: "আলোকিত চিন্তা, মানসিক সংযোগপথ, আধ্যাত্মিক অনুঘটক, পৃথিবীর সাথে মহাজাগতিক ক্ষেত্রের সেতুবন্ধন রচনা করা।",
      strengths: ["অনন্ত আধ্যাত্মিক দৃষ্টি", "মহাজাগতিক পূর্বাভাস ধারণ", "তীব্র আকর্ষণ", "গভীর মানসিক নিরাময়"],
      challenges: ["তীব্র মানসিক উত্তেজনা", "গভীর আত্মসন্দেহ", "অতিরিক্ত সংবেদনশীলতা"],
      careers: ["আধ্যাত্মিক পরামর্শক", "গবেষক", "বিজ্ঞানী ও আবিষ্কারক", "মনস্তাত্ত্বিক উপদেষ্টা"],
      element: "মহাজাগতিক আগুন",
      color: "#fb7185",
      symbol: "🌟"
    },
    "22": {
      number: 22,
      title: "মাস্টার বিলিডার (২২)",
      essence: "মহাজাগতিক চিন্তাভাবনাগুলোকে বাস্তব পরিকাঠামোয় রূপান্তরিত করা। অবাস্তব স্বপ্নকে বাস্তব ভিত্তির ওপর দাঁড় করানো।",
      strengths: ["অসাধারণ জাগতিক দক্ষতা", "অটল দূরদর্শিতা", "দ্বিমুখী নিয়ন্ত্রণ", "অনন্ত সাংগঠনিক কৌশল"],
      challenges: ["পতনের ভয়", "অতিরিক্ত আত্মনিয়ন্ত্রণ", "ঔদ্ধত্য"],
      careers: ["বৈশ্বিক পরিকল্পনাবিদ", "আন্তর্জাতিক উন্নয়ন সংগঠক", "মহাকাশ গবেষক", "কূটনৈতিক পরিচালক"],
      element: "মহাজাগতিক মাটি",
      color: "#34d399",
      symbol: "🏰"
    },
    "33": {
      number: 33,
      title: "মাস্টার টিচার (৩৩)",
      essence: "শর্তহীন আধ্যাত্মিক ব্যক্তিত্ব, গভীর সহানুভূতি, নিঃস্বার্থ সেবা এবং শিক্ষার মাধ্যমে মহাজাগতিক স্তরকে জাগ্রত করা।",
      strengths: ["ঐশ্বরিক উষ্মতা", "প্রতিপালনগত আরোগ্য", "নিঃস্বার্থ সেবা", "কলাকৌশলের মাধ্যমে পথপ্রদর্শন"],
      challenges: ["গুরুভার বহন", "নিজের প্রতি অবহেলা", "অতিরিক্ত আত্মত্যাগ"],
      careers: ["আধ্যাত্মিক শিক্ষক", "বৈশ্বিক শিক্ষাবিদ", "সঙ্গীতজ্ঞ / সৃজনশীল সাধক", "সমাজ সংস্কারক"],
      element: "মহাজাগতিক জল",
      color: "#60a5fa",
      symbol: "🕉️"
    }
  },
  mr: {
    "0": {
      number: "0",
      title: "आदि चेतनेचा उगम (शून्य)",
      essence: "अनंत क्षमतेचे विश्वचक्र, जे अव्यक्त, दिव्य पोकळी आणि पूर्ण निर्मितीची ठिणगी दर्शवते।",
      strengths: ["अनंत शक्यता", "उद्गमाशी थेट संबंध", "शर्तहीन स्वातंत्र्य", "आध्यात्मिक शुद्धीकरण"],
      challenges: ["मर्यादांचा अभाव", "दिशाहीन वाहणे", "पर्यायांनी चक्रावून जाणे"],
      careers: ["क्वांटम भौतिकशास्त्रज्ञ", "आध्यात्मिक साधक", "खगोलवैज्ञानिक", "नवसंशोधक विस्कळीत करणारा"],
      element: "विश्व आकाश",
      color: "#e879f9",
      symbol: "∞"
    },
    "1": {
      number: 1,
      title: "निर्मितीचा मार्गदर्शक (नेता)",
      essence: "स्वावलंबन, मौलिक धैर्य, नवीन दिशा ठरविणे, स्वातंत्र्य आणि एक वेगळी ओळख निर्माण करण्यासाठी लागणारी ऊर्जा।",
      strengths: ["अदम्य धाडस", "स्वायत्तता", "अग्रगण्य दृष्टी", "उत्स्फूर्त पुढाकार"],
      challenges: ["अहंकारी वृत्ती", "अधीरता", "अयशस्वी होण्याचे सुप्त भय"],
      careers: ["उद्योजक", "मुख्य वास्तुविशारद", "जोखीम भांडवलदार", "सर्जनशील संचालक"],
      element: "अग्नी",
      color: "#ef4444",
      symbol: "☉"
    },
    "2": {
      number: 2,
      title: "सुसंवाद साधणाराPeacemaker",
      essence: "कूटनीतिक चातुर्य, परस्पर संतुलन, सखोल सहानुभूती, सहकार्य आणि प्रेमाने सुसंवाद साधण्याचे कौशल्य।",
      strengths: ["अतिशय संवेदनशील", "मध्यस्थता कौशल्य", "सहकार्याची निष्ठा", "सखोल भावनिकता"],
      challenges: ["दुसऱ्यांवर अवलंबून राहणे", "आलोचनेने खचणे", "अनिर्धारित विचार"],
      careers: ["राजनयिक संदेशक", "संबंध सल्लागार", "कला संग्राहक", "रणनीतिक मध्यस्थ"],
      element: "जल",
      color: "#f97316",
      symbol: "☽"
    },
    "3": {
      number: 3,
      title: "सर्जनशील उत्प्रेरक Catalyst",
      essence: "आनंदी आत्म-अभिव्यक्ती, कलात्मक विस्तार, बौद्धिक सामाजिकीकरण आणि ईश्वरी स्फूर्ती समाजात पसरवणे।",
      strengths: ["उज्ज्वल आशावाद", "आकर्षक संभाषण फेक", "विविध कल्पना", "विनोद आणि मोहकता"],
      challenges: ["विखुरलेले लक्ष व ऊर्जा", "अतिशयोक्ती करणे", "वरवरच्या प्रतिक्रिया"],
      careers: ["लेखक / पटकथा लेखक", "रंगमंच कलाकार", "सर्जनशील रणनीतीकार", "जनसंपर्क प्रमुख"],
      element: "वायु",
      color: "#fbbf24",
      symbol: "♃"
    },
    "4": {
      number: 4,
      title: "मजबूत पाया रचणारा (Architect)",
      essence: "नियोजनावर आधारित भक्कम पाया, अटळ स्थिरता, अभ्यासू लक्ष आणि कालातीत कामाची रचना।",
      strengths: ["स्वयं-शिस्त", "अचूक नियोजन", "पूर्ण विश्वासार्हता", "व्यावहारिक वास्तववाद"],
      challenges: ["अति कडकपणा", "कमालीचा हेकटपणा", "प्रयोगांची भीती"],
      careers: ["स्ट्रक्चरल इंजिनियर", "आर्थिक जोखीम विश्लेषण", "कामकाज विश्लेषक", "वास्तू आर्किटेक्ट"],
      element: "पृथ्वी",
      color: "#10b981",
      symbol: "♅"
    },
    "5": {
      number: 5,
      title: "मुक्त प्रवासी आणि शोधक",
      essence: "बदल आणि हालचालींचा आनंद, वैयक्तिक स्वातंत्र्य, लवचिकता आणि प्रत्यक्ष अनुभवांवरून शिकण्याची वृत्ती।",
      strengths: ["बहुमुखी कौशल्य", "प्रेरक चुंबकीय आकर्षण", "परिस्थितीशी जुळवून घेणे", "भ्रमण करणे"],
      challenges: ["चिडचिड व तळमळ", "उतावळेपणा", "वचनांत बांधले जाण्यास नकार"],
      careers: ["विशेष बातमीदार", "प्रवास चित्रपट निर्माता", "ब्रँड जाहिरातदार", "उद्यम संशोधक"],
      element: "आकाश",
      color: "#06b6d4",
      symbol: "☿"
    },
    "6": {
      number: 6,
      title: "पवित्र संरक्षक (Nurturer)",
      essence: "सामाजिक आरोग्य आणि प्रेम, कलात्मक गोष्टींमध्ये सौंदर्य शोधणे, निस्वार्थी काळजी आणि सुंदर कौटुंबिक सौख्य वाढवणे।",
      strengths: ["सुरक्षित प्रेम", "निसर्गोपचार", "परोपकारी वृत्ती", "कलात्मक दृष्टी"],
      challenges: ["स्वतःला दुर्लक्षित करणे", "इतरांच्या कामात ढवळाढवळ", "अति पूर्णत्वाचा ध्यास"],
      careers: ["शस्त्रक्रिया डॉक्टर", "आरोग्य सल्लागार", "इंटेरियर डिझायनर", "शिक्षण तज्ज्ञ"],
      element: "पृथ्वी",
      color: "#ec4899",
      symbol: "♀"
    },
    "7": {
      number: 7,
      title: "चिंतनशील अभ्यासू (Scholar)",
      essence: "सखोल वैज्ञानिक व तार्किक संशोधन, एकांत आणि ध्यान, आणि जगाचा दिखावा दूर करून अंतिम सत्याचा शोध घेणे।",
      strengths: ["तीव्र बुद्धिमत्ता", "अतिंद्रिय ज्ञान", "शांतता व चिंतनशीलता", "अजोड एकाग्रता"],
      challenges: ["भावनिक अलिप्तता", "एकटेपणाची सवय", "गुप्तता व संशय"],
      careers: ["बायोमेडिकल संशोधक", "गुप्तचर विश्लेषक", "तत्वज्ञान प्राध्यापक", "क्रिप्टोग्राफर"],
      element: "जल",
      color: "#3b82f6",
      symbol: "♆"
    },
    "8": {
      number: 8,
      title: "संप्रभु सत्ता आणि यश (Authority)",
      essence: "आर्थिक जाण व ताकद, प्रचंड जबाबदारी, आणि कर्माच्या नियमांनुसार सांसारिक प्रगती साधणे।",
      strengths: ["दमदार नेतृत्व", "अविलंब सहनशीलता", "आर्थिक दूरदृष्टी", "अधिकार गाजवणे"],
      challenges: ["अति भौतिकवाद", "अति काम करण्याची सवय", "इतरांना नियंत्रणात ठेवणे"],
      careers: ["मुख्य कार्यकारी अधिकारी", "गुंतवणूक भागीदार", "मोठा उद्योगपती", "कॉर्पोरेट वकील"],
      element: "पृथ्वी",
      color: "#8b5cf6",
      symbol: "♄"
    },
    "9": {
      number: 9,
      title: "विश्व परोपकारी",
      essence: "विश्वव्यापी निस्वार्थी प्रेम, आध्यात्मिक परिपूर्णता, व्यापक विचार, त्याग आणि इतरांना मानवतावादी मार्गदर्शन।",
      strengths: ["विश्व करुणा", "उदार उदार दृष्टिकोन", "कलात्मक प्रतिभा", "चुंबकीय नेतृत्व"],
      challenges: ["निराशा", "अस्पष्ट त्याग", "जुने राग धरून ठेवणे"],
      careers: ["मानवतावादी वकील", "पर्यावरण मार्गदर्शक", "तत्वज्ञानी", "जागतिक दानशूर"],
      element: "अग्नी",
      color: "#a855f7",
      symbol: "♂"
    },
    "11": {
      number: 11,
      title: "मास्टर इनट्युटीव्ह (११)",
      essence: "अध्यात्मिक ज्ञान, दिव्य विचार शक्ती, मानवी ग्रिडशी दिव्य जगाचे जोडणी करणे आणि सत्य प्रकाशाचा वाहक बनणे।",
      strengths: ["आध्यात्मिक दूरदृष्टी", "अतिंद्रिय भास", "तीव्र आकर्षण", "सहानुभूतीने आरोग्य सुधारणे"],
      challenges: ["अति ताणतणाव", "स्व-संशय व भीती", "अति संवेदनशीलता"],
      careers: ["आध्यात्मिक प्रणेता", "गूढ विषयांतील संशोधक", "नवसंशोधक", "मानसोपचार तज्ज्ञ"],
      element: "ब्रह्मांडीय अग्नी",
      color: "#fb7185",
      symbol: "🌟"
    },
    "22": {
      number: 22,
      title: "मास्टर बिल्डर (२२)",
      essence: "भव्य आणि दिव्य योजनांना जमिनीवर प्रत्यक्षात आणणे. आदर्श स्वप्नांना भौतिक वास्तवात रूपांतरित करणे।",
      strengths: ["असामान्य भौतिक कौशल्य", "अटूट कणखरपणा", "दुहेरी अधिकार", "प्रचंड नियोजन शक्ती"],
      challenges: ["अयशस्वी होण्याचे भय", "अति आत्मनियंत्रण", "अहंकार"],
      careers: ["ग्लोबल ग्रिड आर्किटेक्ट", "आंतरराष्ट्रीय विकासक", "स्पेस प्लॅनर", "राजनयिक संचालक"],
      element: "ब्रह्मांडीय पृथ्वी",
      color: "#34d399",
      symbol: "🏰"
    },
    "33": {
      number: 33,
      title: "मास्टर टीचर (३३)",
      essence: "शर्तहीन अध्यात्म, निस्वार्थी सेवा, प्रेमळ मार्गदर्शन आणि जगाला योग्य मार्ग दाखवण्याचे कार्य करणे।",
      strengths: ["अफाट आस्थेवाईक प्रेम", "दिव्य काळजी व हीलिंग", "निस्वार्थी त्याग", "कलात्मक मार्गदर्शन"],
      challenges: ["प्रचंड जबाबदारीने थकणे", "स्वतःकडे दुर्लक्ष", "शहीद वृत्ती"],
      careers: ["आध्यात्मिक हीलर", "जागतिक शिक्षक", "रचनात्मक संत", "दूरदर्शी समाजसेवक"],
      element: "ब्रह्मांडीय जल",
      color: "#60a5fa",
      symbol: "🕉️"
    }
  },
  gu: {
    "0": {
      number: "0",
      title: "આદિ ચેતના સ્ત્રોત (શૂન્ય)",
      essence: "અનંત ક્ષમતાઓનું બ્રહ્માંડ ચક્ર, જે દૈવી ખાલી જગ્યા, અને પરમ સર્જનની ચિંગારી દર્શાવે છે.",
      strengths: ["અનંત શક્યતાઓ", "સ્ત્રોત સાથે સીધો સંબંધ", "શરત વિનાની સ્વતંત્રતા", "આધ્યાત્મિક શુદ્ધિ"],
      challenges: ["મર્યાદાઓની અછત", "દિશા વગર વહેવું", "ઘણા વિકલ્પોથી અંજાઈ જવું"],
      careers: ["ક્વોન્ટમ ફિઝિસ્ટ", "આધ્યાત્મિક સાધક", "ખગોળશાસ્ત્રી", "નવપ્રણેતા"],
      element: "બ્રહ્માંડીય આકાશ",
      color: "#e879f9",
      symbol: "∞"
    },
    "1": {
      number: 1,
      title: "અગ્રણી નેતા",
      essence: "સ્વબળ, મૌલિક હિંમત, નવા માર્ગો કંડારવા, સ્વાતંત્ર્ય અને એક વિશિષ્ટ શક્તિ તરીકે ઊભા થવાની તીવ્ર ઈચ્છા.",
      strengths: ["અદમ્ય સાહસ", "સાર્વભૌમ સ્વાયત્તતા", "અગમ્ય દૃષ્ટિકોણ", "મજબૂત વ્યક્તિગત પહેલ"],
      challenges: ["અહંકારી પ્રભુત્વ", "ઉતાવળ અને ક્રોધ", "નિષ્ફળતાનો છૂપો ભય"],
      careers: ["ટેક ઉદ્યોગસાહસિક", "ચીફ આર્કિટેક્ટ", "વેન્ચર કેપિટલિસ્ટ", "ક્રિએટિવ ડિરેક્ટર"],
      element: "અગ્નિ",
      color: "#ef4444",
      symbol: "☉"
    },
    "2": {
      number: 2,
      title: "શાંતિદૂત Peacemaker",
      essence: "અદ્ભુત કુનેહ, પરસ્પર સંતુલન, ઊંડી સહાનુભૂતિ, સહકાર અને સૌમ્ય મધ્યસ્થતા દ્વારા હૃદય જીતવા સક્ષમ.",
      strengths: ["અત્યંત નમ્ર અને સહાનુભૂતિ ધરાવનાર", "મધ્યસ્થતા કુશળતા", "વિશ્વાસુ સાથ", "શક્તિશાળી લાગણીશક્તિ"],
      challenges: ["દૂસરા પર અતિ નિર્ભરતા", "ટીકાથી ચિંતિત થવું", "અનિર્ણાયક સ્થિતિ"],
      careers: ["ડિપ્લોમેટિક એમ્બેસેડર", "સંબંધોના કાઉન્સિલર", "કલા સંગ્રહાલય નિષ્ણાત", "વાટાઘાટકાર"],
      element: "જળ",
      color: "#f97316",
      symbol: "☽"
    },
    "3": {
      number: 3,
      title: "સર્જનાત્મક પ્રેરક Catalyst",
      essence: "આનંદદાયક આત્મ-અભિવ્યક્તિ, કલાત્મક વાણી વિકાસ, બૌદ્ધિક સામાજિક વર્તન અને દૈવી પ્રેરણા સમાજમાં વહાવવી.",
      strengths: ["તેજસ્વી આશાવાદ", "ખૂબ જ મોહક વાણી", "અદભુત કલ્પનાશક્તિ", "ચતુરતા અને આકર્ષકતા"],
      challenges: ["વિખરાયેલું ધ્યાન અને શક્તિ", "અતિશયોક્તિ કરવાની કુટેવ", "ઉપરછલ્લી પ્રતિક્રિયાઓ"],
      careers: ["લેખક / પટકથા લેખક", "રંગમંચ કલાકાર", "ક્રિએટિવ સ્ટ્રેટેજીસ્ટ", "પીઆર લીડ"],
      element: "વાયુ",
      color: "#fbbf24",
      symbol: "♃"
    },
    "4": {
      number: 4,
      title: "ભવ્ય આયોજક (Architect)",
      essence: "વ્યવહારિક નક્કર પાયો, અખંડ સ્થિરતા, વિશ્લેષણાત્મક અભ્યાસ અને કાયમી કળાઓનું સર્જન કરવું.",
      strengths: ["ઉચ્ચ સ્વ-શિસ્ત", "ચોક્કસ આયોજન", "પૂર્ણ વિશ્વસનીયતા", "વ્યવહારિક વાસ્તવિકતા"],
      challenges: ["અત્યંત જડ વલણ", "હઠીલો સ્વભાવ", "નવીનતમ પ્રયોગોનો ડર"],
      careers: ["સ્ટ્રક્ચરલ ઇજનેર", "નાણાકીય જોખમ વિશ્લેષક", "સિસ્ટમ આર્કિટેક્ટ", "સિવિલ આર્કિટેક્ટ"],
      element: "પૃથ્વી",
      color: "#10b981",
      symbol: "♅"
    },
    "5": {
      number: 5,
      title: "વિશ્વ પ્રવાસી અને સંશોધક",
      essence: "પરિવર્તનનો આનંદ, વ્યક્તિગત સ્વતંત્રતાની શોધ, નવી વસ્તુઓ અપનાવવી અને પ્રત્યક્ષ અનુભવો દ્વારા નવું જ્ઞાન મેળવવું.",
      strengths: ["બહુમુખી કુશળતા", "પ્રેરણાત્મક ચુંબકીય આકર્ષણ", "જોળાવ ક્ષમતા", "ભ્રમણ અને શોધખોળ"],
      challenges: ["અત્યંત બેચેની", "ઉતાવળિયો નિર્ણય", "લાંબા ગાળાની પ્રતિજ્ઞાથી ડર"],
      careers: ["વિદેશી પત્રકાર", "ટ્રાવેલ ફિલ્મ મેકર", "બ્રાન્ડ મેનેજર", "ઇનોવેશન સ્કાઉટ"],
      element: "આકાશ",
      color: "#06b6d4",
      symbol: "☿"
    },
    "6": {
      number: 6,
      title: "પવિત્ર રક્ષક (Nurturer)",
      essence: "પરિવાર અને સમાજ પ્રત્યે હેત, કલામાં સુંદરતા શોધવી, નિસ્વાર્થ આશીર્વાદ આપવા અને સુંદર ઘરેલું શાંતિ વધારવી.",
      strengths: ["સુરક્ષિત સ્નેહ", "સામાજિક ઉપચાર", "પરોપકારી ઊર્જા", "નવીન કલા દૃષ્ટિ"],
      challenges: ["પોતાની જાતની ઉપેક્ષા", "બીજાની બાબતોમાં હસ્તક્ષેપ", "અતિ સંપૂર્ણતાનો આગ્રહ"],
      careers: ["બાળરોગ સર્જન", "સમગ્ર ચિકિત્સક", "લક્ઝરી ઇન્ટિરિયર ડિઝાઇનર", "શિક્ષણ સુધારક"],
      element: "પૃથ્વી",
      color: "#ec4899",
      symbol: "♀"
    },
    "7": {
      number: 7,
      title: "રહસ્યમય અભ્યાસુ Scholar",
      essence: "તાર્કિક સંશોધન, સઘન વૈજ્ઞાનिक નિરીક્ષણ, ધ્યાનપૂર્ણ મૌન અને અંતિમ સત્ય પ્રાપ્તિ માટે ભ્રમણાઓ દૂર કરવી.",
      strengths: ["તીક્ષ્ણ તાર્કિક મન", "અતીન્દ્રિય જ્ઞાનની દ્રષ્ટિ", "ગંભીર વિચારશીલતા", "અજોડ ધ્યાનશક્તિ"],
      challenges: ["લાગણીશીલ અલિપ્તતા", "એકાંતપ્રિયતા", "શંકાશીલતા"],
      careers: ["બાયોમેડિકલ સંશોધક", "ઇન્ટેલિજન્સ એનાલિસ્ટ", "તત્વજ્ઞાન પ્રોફેસર", "ક્રિપ્ટોગ્રાફર"],
      element: "જળ",
      color: "#3b82f6",
      symbol: "♆"
    },
    "8": {
      number: 8,
      title: "સાર્વભૌમ સત્તા (Authority)",
      essence: "પૈસા અને સત્તાની ઊંડી સમજણ, મોટી જવાબદારીઓ ઉપાડવી, અને કર્મના નિયમો આધીન જ ભૌતિક પ્રગતિ કરવી.",
      strengths: ["નેતૃત્વ ક્ષમતા", "અદભુत સહનશક્તિ", "આર્થિક દીર્ઘદ્રષ્ટિ", "અધિકાર સ્થાપિત કરવો"],
      challenges: ["ગંભીર ભૌતિકવાદી વલણ", "અતિ કામ કરવાની લત", "બીજાને દબાવી રાખવા"],
      careers: ["મુખ્ય વહીવટી અધિકારી", "રોકાણ ભાગીદાર", "મોટા ઉદ્યોગપતિ", "કોર્પોरेट એટોર્ની"],
      element: "પૃથ્વી",
      color: "#8b5cf6",
      symbol: "♄"
    },
    "9": {
      number: 9,
      title: "માનવતાવાદી કલ્યાણકારી",
      essence: "વિશ્વવ્યાપી નિસ્વાર્થ સ્નેહ, આધ્યાત્મિક પરિપૂર્ણતા, વૈશ્વિક પરિપ્રેક્ષ્ય, ત્યાગ અને માનવતાનું કલ્યાણ કરવું.",
      strengths: ["વિશ્વ કલ્યાણ ભાવના", "ઉદાર દૃષ્ટિકોણ", "કલાત્મક શ્રેષ્ઠતા", "ચુંબકીય નેતૃત્વ"],
      challenges: ["મોહભંગ થવો", "ધ્યેયહીન ત્યાગ", "જૂની અદાવત પકડી રાખવી"],
      careers: ["માનવતાવાદી વકીલ", "પર્યાવરણ પથદર્શક", "ચિત્રકાર / દાર્શનિક", "વૈશ્વિક પરોપકારી"],
      element: "અગ્નિ",
      color: "#a855f7",
      symbol: "♂"
    },
    "11": {
      number: 11,
      title: "દિવ્ય જ્ઞાની (૧૧)",
      essence: "આધ્યાત્મિક પ્રકાશ, અંતઃપ્રજ્ઞાનો પ્રવેશદ્વાર, દિવ્ય ઊર્જાનો પ્રવાહ જમીન પર લાવવા વાહક રૂપે કામ કરવું.",
      strengths: ["અનંત આધ્યાત્મિક દૃષ્ટિ", "પૂર્વાભાસ ક્ષમતા", "તીવ્ર આકર્ષણ શક્તિ", "સહાનુભૂતિપૂર્વક સાજા કરવા"],
      challenges: ["અતિશય માનસિક તણાવ", "સ્વ-શંકા અને ડર", "અતિ સંવેદનશીલતા"],
      careers: ["આધ્યાત્મિક માર્ગદર્શક", "રહસ્યમય વિદ્યા સંશોધક", "નવીનતમ સંશોધકો", "માનસિક પરામર્શક"],
      element: "બ્રહ્માંડીય અગ્નિ",
      color: "#fb7185",
      symbol: "🌟"
    },
    "22": {
      number: 22,
      title: "માસ્ટર બિલ્ડર (૨૨)",
      essence: "દિવ્ય યોજનાઓને વાસ્તવિક જમીની સ્તર પર ભવ્ય ઈન્ફ્રાસ્ટ્રક્ચરમાં બદલવી. કલ્પનાઓને વાસ્તવિકતામાં બદલવી.",
      strengths: ["અદભુત ભૌતિક કુશળતા", "વાસ્તવવાદી વલણ", "બેવડી કાળજીશક્તિ", "અંતહીન ઓર્ગેનાઇઝેશન કૌશલ્ય"],
      challenges: ["નિષ્ફળતા નો મોટો ભય", "અતિ આત્મ-સંયમ તણાવ", "અહંકાર ભરેલું વર્તન"],
      careers: ["ગ્લોબલ ગ્રીડ આર્કિটেક્ટ", "ઇન્ફ્રાસ્ટ્રક્ચર ડેવલપર", "રિમોટ હેબિટેશન પ્લાનર", "ડિપ્લોમેટિક ડિરેક્ટર"],
      element: "બ્રહ્માંડીય પૃથ્વી",
      color: "#34d399",
      symbol: "🏰"
    },
    "33": {
      number: 33,
      title: "માસ્ટર ટીચર (૩૩)",
      essence: "નિઃસ્વાર્થ દિવ્ય પ્રેમ, કરુણા અને શિક્ષા વહાવનાર પરમ હીલર તરીકે વૈશ્વિક ચેતના જગાડવી.",
      strengths: ["અદ્ભુત આધ્યાત્મિક હૂંફ", "માતા જેવી વત્સલતા", "સેવાભાવના", "સર્જનાત્મક દિવ્ય પથદર્શન"],
      challenges: ["જવાબદારીઓ નો ભારે બોજો", "પર્સનલ લાઈફની હેરાનગતિ", "શહીદી અભિગમ"],
      careers: ["આધ્યાત્મિક ગુરુ", "વૈશ્વિક શિક્ષક", "શાસ્ત્રીય સંગીતકાર / સંત", "દૂરદર્શી સમાજ સેવક"],
      element: "બ્રહ્માંડીય જળ",
      color: "#60a5fa",
      symbol: "🕉️"
    }
  }
};

export const localizedMulankProfiles: Record<string, Record<number, any>> = {
  en: {}, // we fall back dynamically or define simple references
  hi: {},
  bn: {},
  mr: {},
  gu: {}
};

// Seed values for non-English to prevent any untranslated text
// Populate them dynamically or statically
export const localizedFlashcards: Record<string, Flashcard[]> = {
  en: [],
  hi: [],
  bn: [],
  mr: [],
  gu: []
};

export const localizedZodiacData: Record<string, any[]> = {
  en: [],
  hi: [],
  bn: [],
  mr: [],
  gu: []
};
