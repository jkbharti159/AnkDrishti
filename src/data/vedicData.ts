import { NumberMeaning } from "../types";

export interface MulankProfile {
  mulank: number;
  planet: string;
  sanskritName: string;
  glyph: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  favorableDays: string;
  luckyColor: string;
  luckyColorHex: string;
  luckyNumbers: number[];
  neutralNumbers: number[];
  challengingNumbers: number[];
  careerInclinations: string[];
  healthFocus: string;
}

export const mulankProfiles: Record<number, MulankProfile> = {
  1: {
    mulank: 1,
    planet: "Sun",
    sanskritName: "Surya",
    glyph: "☉",
    traits: [
      "Innate survival instincts and highly independent drive.",
      "Highly ambitious, pioneering energy that seeks to lead.",
      "Authoritative persona with a magnetic presence.",
      "Self-determined character that strongly resists micro-management."
    ],
    strengths: [
      "Exceptional executive courage and dynamic focus.",
      "Self-starting initialization of creative movements.",
      "Protective of dependents and highly loyal."
    ],
    weaknesses: [
      "Tendency toward egotistic impatience and rigidity.",
      "Vulnerability to over-inflated pride and flashes of anger."
    ],
    favorableDays: "Sunday",
    luckyColor: "Gold / Deep Yellow",
    luckyColorHex: "#fbbf24",
    luckyNumbers: [1, 3, 5, 9],
    neutralNumbers: [7],
    challengingNumbers: [4, 6, 8],
    careerInclinations: ["Politician", "Chief Executive (CEO)", "Founder", "Military Commander", "Pioneer Administrator"],
    healthFocus: "Heart vitality, spinal column, neural blood circulation, and physical stamina."
  },
  2: {
    mulank: 2,
    planet: "Moon",
    sanskritName: "Chandra",
    glyph: "☽",
    traits: [
      "High emotional intelligence and deep receptive intuition.",
      "Excellent diplomacy, acting as a unifying peacemaker.",
      "Gentle, artistic temperament with a rich inner fantasy world.",
      "Highly collaborative but subject to fluctuating mood cycles."
    ],
    strengths: [
      "Exceptional empathy, patience, and active listening skills.",
      "Highly imaginative and versatile verbal/visual styles.",
      "Soothing, restorative, and supportive presence of love."
    ],
    weaknesses: [
      "Vulnerability to codependency and over-compromising personal boundaries.",
      "Prone to sudden self-criticism, self-doubt, and moody withdrawal."
    ],
    favorableDays: "Monday",
    luckyColor: "Pearl White / Soft Silver",
    luckyColorHex: "#e2e8f0",
    luckyNumbers: [2, 1, 3, 5],
    neutralNumbers: [4, 6, 8],
    challengingNumbers: [7, 9],
    careerInclinations: ["Creative Writer", "Psychologist", "Diplomatic Mediator", "Holistic Healer", "Fine Artist & Curator"],
    healthFocus: "Digestive tract, stomach, lymphatic system, fluid balance, and emotional nervous stability."
  },
  3: {
    mulank: 3,
    planet: "Jupiter",
    sanskritName: "Guru",
    glyph: "♃",
    traits: [
      "Natural wisdom, academic thirst, and high spiritual outlook.",
      "Energetic vibration, radiating optimism and joy to others.",
      "Excellent communication, lecturing, and verbal teaching skills.",
      "Respectable disposition with deep ethical/moral values."
    ],
    strengths: [
      "Prolific intelligence and broad-minded philosophical vision.",
      "Ability to inspire, elevate, and motivate large communities.",
      "Highly lucky, finding positive outcomes during major life trials."
    ],
    weaknesses: [
      "Over-optimistic stagnation or scattered financial focus and energy.",
      "Occasional moral preachiness or self-righteous judgment of peers."
    ],
    favorableDays: "Thursday",
    luckyColor: "Bright Saffron / Amber",
    luckyColorHex: "#f59e0b",
    luckyNumbers: [3, 1, 2, 9],
    neutralNumbers: [4, 5, 7],
    challengingNumbers: [6, 8],
    careerInclinations: ["University Professor", "Counselor / Minister", "Legal Advisor", "Author", "Corporate Philanthropist"],
    healthFocus: "Liver functions, hip joints, arterial pathways, and cellular growth mechanisms."
  },
  4: {
    mulank: 4,
    planet: "Rahu",
    sanskritName: "Rahu",
    glyph: "☊",
    traits: [
      "Highly unconventional thinker that constantly questions dogma.",
      "Strong analytical, mechanical, and system-oriented builder.",
      "Experiences sudden life events, unexpected shifts, or abrupt trials.",
      "Driven to fundamentally re-invent existing frameworks."
    ],
    strengths: [
      "Exceptional concentration under difficult labor conditions.",
      "Brilliant at debugging or diagnosing complex digital/physical systems.",
      "Revolutionary and progressive perspectives on societal patterns."
    ],
    weaknesses: [
      "Persistent internal anxiety and a persistent feeling of being misunderstood.",
      "Stubborn skepticism that can trigger sudden social alienation."
    ],
    favorableDays: "Saturday / Wednesday",
    luckyColor: "Electric Blue / Charcoal",
    luckyColorHex: "#3b82f6",
    luckyNumbers: [4, 5, 6, 8],
    neutralNumbers: [2, 7],
    challengingNumbers: [1, 3, 9],
    careerInclinations: ["Software Architect", "Systems Researcher", "Private Detective", "Financial Speculator", "Civil Engineer"],
    healthFocus: "Nervous coordination, respiratory tract, psychosomatic stress, and sleep patterns."
  },
  5: {
    mulank: 5,
    planet: "Mercury",
    sanskritName: "Budh",
    glyph: "☿",
    traits: [
      "Razor-sharp reflexes and rapid speed of intellectual processing.",
      "Unmatched conversationalist, communicating with magnetic humor.",
      "Extremely versatile, thriving in fast-paced or unstable environments.",
      "Youthful outlook, constantly seeking novel, playful travels."
    ],
    strengths: [
      "Highly strategic commercial intelligence and marketing bargains.",
      "Resilient, rapid bounce-back from emotional or physical setbacks.",
      "Superb writing speed, speechcraft, and logical reasoning."
    ],
    weaknesses: [
      "Severe restlessness leading to mental burn-outs or incomplete tasks.",
      "Occasional inclination to gossip or stretch truth for amusement."
    ],
    favorableDays: "Wednesday",
    luckyColor: "Emerald Green / Jade",
    luckyColorHex: "#10b981",
    luckyNumbers: [5, 1, 4, 6],
    neutralNumbers: [2, 3, 8],
    challengingNumbers: [7, 9],
    careerInclinations: ["Marketing Director", "Foreign Trader", "PR Consultant", "Journalist", "Financial Arbitrageur"],
    healthFocus: "Brain neurons, vocal tract, respiratory lungs, thyroid health, and motor skill nerves."
  },
  6: {
    mulank: 6,
    planet: "Venus",
    sanskritName: "Shukra",
    glyph: "♀",
    traits: [
      "Vedic aesthetic eye, appreciating luxury, comfort, and sensory art.",
      "Devoted family builder, prioritizing domestic harmony and elegance.",
      "High charisma that naturally draws friends and favorable network bonds.",
      "Compassionate, trusted counselor of relationship reconciliations."
    ],
    strengths: [
      "Exquisite creative styling, interior decoration, and visual arts.",
      "Unconditional hospitality and caring protective guardianship.",
      "Magnetic social charm that effortlessly defuses conflicts."
    ],
    weaknesses: [
      "Susceptibility to over-indulging in material luxuries or vanity.",
      "Smothering loved ones with demanding perfectionist domestic rules."
    ],
    favorableDays: "Friday",
    luckyColor: "Rose Pink / Off-White",
    luckyColorHex: "#ec4899",
    luckyNumbers: [6, 5, 8, 9],
    neutralNumbers: [2, 7],
    challengingNumbers: [1, 3],
    careerInclinations: ["Fashion Designer", "Luxury Developer", "Art Director", "Culinary Scientist", "Relationship therapist"],
    healthFocus: "Kidneys, throat glands, dermatological health, and glandular secretions."
  },
  7: {
    mulank: 7,
    planet: "Ketu",
    sanskritName: "Ketu",
    glyph: "☋",
    traits: [
      "Deeply meditative, mystic scholar analyzing occult, hidden truths.",
      "Detached from mundane/material metrics of social success.",
      "Invaluable gut intuition and immediate psychic reads of people.",
      "Quietly observant, avoids loud parties and appreciates solitude."
    ],
    strengths: [
      "Exceptional capacity for profound metaphysical research and debugging.",
      "Innate strength for lucidity, dream journaling, and meditative peace.",
      "Highly original, profound, and mystical literary creations."
    ],
    weaknesses: [
      "Risk of sudden severe social isolation or spiritual escapism.",
      "Frequent feeling of displacement, alienation, or nervous confusion."
    ],
    favorableDays: "Tuesday / Thursday",
    luckyColor: "Mottled Gold / Light Yellow",
    luckyColorHex: "#eab308",
    luckyNumbers: [7, 3, 5, 6],
    neutralNumbers: [1, 4],
    challengingNumbers: [2, 8, 9],
    careerInclinations: ["Metaphysical Researcher", "Intelligence Analyst", "Philosophy Scholar", "Sanskrit Linguist", "Renunciate Teacher"],
    healthFocus: "Intestinal tract, skin sensitivities, psychosomatic health, and pineal gland activity."
  },
  8: {
    mulank: 8,
    planet: "Saturn",
    sanskritName: "Shani",
    glyph: "♄",
    traits: [
      "Unyielding structural discipline and unshakeable sense of duty/Karma.",
      "Life cycle marked by slow, laborious, but highly secure progressive climbs.",
      "Extreme resiliency, navigating heavy structural crises with stoicism.",
      "Quiet, deeply serious, and authoritative demeanor that expects top quality."
    ],
    strengths: [
      "Unmatched work endurance, organization, and persistence.",
      "Superb executive foresight regarding massive, long-term operations.",
      "High integrity and unbreakable, quiet loyalty to family/dependents."
    ],
    weaknesses: [
      "Severe rigidity and highly harsh, critical judgment toward others.",
      "Predisposition to intense workaholism and cold emotional walls."
    ],
    favorableDays: "Saturday",
    luckyColor: "Indigo / Charcoal / Black",
    luckyColorHex: "#6366f1",
    luckyNumbers: [8, 4, 5, 6],
    neutralNumbers: [2, 7],
    challengingNumbers: [1, 3, 9],
    careerInclinations: ["Judge / Legal Officiant", "Infrastructure Architect", "Heavy Industry Operator", "Actuary", "Investment Banker"],
    healthFocus: "Bone skeleton density, knees, joints, dental health, skin protective barrier, and chronic stress loads."
  },
  9: {
    mulank: 9,
    planet: "Mars",
    sanskritName: "Mangal",
    glyph: "♂",
    traits: [
      "Spiritual warrior archetype, always fighting for the underdog.",
      "Primal courage, physical agility, and relentless active dynamism.",
      "Innate global humanitarian compassion, wanting to heal macro ills.",
      "Extremely honest, direct to a fault, and hates passive aggression."
    ],
    strengths: [
      "High physical courage and leading with fearlessness under emergency pressure.",
      "Exquisite, unbounded generosity of resource share and protection.",
      "Strong athletic determination and direct active focus."
    ],
    weaknesses: [
      "Volatile temper and reckless, impulsive reactions to opposition.",
      "Hard time taking feedback, retreating, or surrendering personal control."
    ],
    favorableDays: "Tuesday",
    luckyColor: "Crimson Red / Coral",
    luckyColorHex: "#ef4444",
    luckyNumbers: [9, 1, 3, 6],
    neutralNumbers: [2, 8],
    challengingNumbers: [4, 5, 7],
    careerInclinations: ["Surgeon", "Sports captain", "Emergency Physician", "Social Advocate", "Pioneer Firefighter"],
    healthFocus: "Muscle groups, red blood cell counts, arterial pressure, body heat, and adrenaline glands."
  }
};

// --- REAL SCIENTIFIC/ASTRONOMICAL EPHEMERIS ENGINE ---
// Calculates geocentric planetary coordinates based on J2000 epoch relative to the input date.
export interface PlanetInfo {
  name: string;
  sanskritName: string;
  glyph: string;
  longitude: number; // 0 - 360
  sign: string;
  retrograde: boolean;
  element: string;
  color: string;
  degreeInSign: number;
}

export function get_planetary_positions(date: Date): PlanetInfo[] {
  // Epoch J2000.0 is January 1, 2000 (12:00 UTC)
  const epoch = Date.UTC(2000, 0, 1, 12, 0, 0);
  const ms = date.getTime() - epoch;
  const d_today = ms / (1000 * 60 * 60 * 24);
  const d_yesterday = d_today - 0.5; // check 12hr rate of change for realistic retrograde movement

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const getPlanetGeocentricLong = (pName: string, d: number): number => {
    // 1. Sun mean longitude (as seen from Earth - acts as Earth longitude)
    const sunLong = (280.46 + 0.9856474 * d) % 360;
    const earthHelio = (sunLong + 180) % 360;

    if (pName === "Sun") {
      let l = sunLong;
      if (l < 0) l += 360;
      return l;
    }

    if (pName === "Moon") {
      let l = (218.316 + 13.176396 * d) % 360;
      if (l < 0) l += 360;
      return l;
    }

    if (pName === "Rahu") {
      // Rahu moves backward (retrograde), period ~ 18.6 years (6793 days)
      let l = (125.12 - 0.0529532 * d) % 360;
      if (l < 0) l += 360;
      return l;
    }

    if (pName === "Ketu") {
      // Ketu is opposite Rahu
      let l = (getPlanetGeocentricLong("Rahu", d) + 180) % 360;
      return l;
    }

    // Heliocentric Mean Longitudes at d
    let planetHelio = 0;
    let r_planet = 1.0;
    const r_earth = 1.0;

    switch (pName) {
      case "Mercury":
        planetHelio = (252.25 + 4.09233 * d) % 360;
        r_planet = 0.387;
        break;
      case "Venus":
        planetHelio = (181.98 + 1.60213 * d) % 360;
        r_planet = 0.723;
        break;
      case "Mars":
        planetHelio = (355.45 + 0.52402 * d) % 360;
        r_planet = 1.524;
        break;
      case "Jupiter":
        planetHelio = (34.40 + 0.08308 * d) % 360;
        r_planet = 5.203;
        break;
      case "Saturn":
        planetHelio = (50.08 + 0.03344 * d) % 360;
        r_planet = 9.582;
        break;
      default:
        planetHelio = (100.0 + 0.1 * d) % 360;
    }

    // Heliocentric coordinates to Geocentric converter via Cartesian coordinates
    const E = (earthHelio * Math.PI) / 180;
    const P = (planetHelio * Math.PI) / 180;

    const x = r_planet * Math.cos(P) - r_earth * Math.cos(E);
    const y = r_planet * Math.sin(P) - r_earth * Math.sin(E);

    let geoLong = (Math.atan2(y, x) * 180) / Math.PI;
    if (geoLong < 0) geoLong += 360;
    return geoLong;
  };

  const planetsConfig = [
    { name: "Sun", sanskrit: "Surya", glyph: "☉", element: "Fire", color: "#fbbf24" },
    { name: "Moon", sanskrit: "Chandra", glyph: "☽", element: "Water", color: "#cbd5e1" },
    { name: "Mercury", sanskrit: "Budh", glyph: "☿", element: "Ether/Air", color: "#10b981" },
    { name: "Venus", sanskrit: "Shukra", glyph: "♀", element: "Water", color: "#f472b6" },
    { name: "Mars", sanskrit: "Mangal", glyph: "♂", element: "Fire", color: "#f87171" },
    { name: "Jupiter", sanskrit: "Guru", glyph: "♃", element: "Ether", color: "#f59e0b" },
    { name: "Saturn", sanskrit: "Shani", glyph: "♄", element: "Earth/Air", color: "#818cf8" },
    { name: "Rahu", sanskrit: "Rahu", glyph: "☊", element: "Shadow", color: "#38bdf8" },
    { name: "Ketu", sanskrit: "Ketu", glyph: "☋", element: "Shadow", color: "#a78bfa" }
  ];

  return planetsConfig.map((cfg) => {
    const longToday = getPlanetGeocentricLong(cfg.name, d_today);
    const longYesterday = getPlanetGeocentricLong(cfg.name, d_yesterday);

    // Compute angular difference (wrap around is checked)
    const diff = ((longToday - longYesterday + 540) % 360) - 180;
    
    // Nodes Rahu & Ketu are always retrograde in Vedic system. Sun & Moon are always Direct.
    let retrograde = diff < 0;
    if (cfg.name === "Sun" || cfg.name === "Moon") retrograde = false;
    if (cfg.name === "Rahu" || cfg.name === "Ketu") retrograde = true;

    const signIdx = Math.floor(longToday / 30);
    const signName = zodiacSigns[signIdx % 12];
    const degreeInSign = Number((longToday % 30).toFixed(2));

    return {
      name: cfg.name,
      sanskritName: cfg.sanskrit,
      glyph: cfg.glyph,
      longitude: Number(longToday.toFixed(2)),
      sign: signName,
      retrograde,
      element: cfg.element,
      color: cfg.color,
      degreeInSign
    };
  });
}

// Generate an individualized Vedic prediction based on real planetary positions
export function getMulankPrediction(mulankVal: number, date: Date): {
  rulingPlanet: string;
  sanskritName: string;
  glyph: string;
  color: string;
  transitSign: string;
  degree: number;
  retrograde: boolean;
  impactScore: number; // 1-100 indicating planetary auspiciousness today
  favorableStatus: "highly favorable" | "productive" | "cautious" | "meditative";
  forecast: string;
  actionAdvice: string;
  activeLifeSector: string;
} {
  const profile = mulankProfiles[mulankVal];
  const planets = get_planetary_positions(date);
  const currentTransit = planets.find((p) => p.name.toLowerCase() === profile.planet.toLowerCase()) || planets[0];
  const currentMoon = planets.find((p) => p.name === "Moon") || planets[1];

  let impactScore = 70;
  let sector = "Self & Expression";
  let forecast = "";
  let status: "highly favorable" | "productive" | "cautious" | "meditative" = "productive";
  let actionAdvice = "";

  // Dynamic analysis based on astronomical configurations
  const planetName = currentTransit.name;
  const isRetro = currentTransit.retrograde;
  const transitSign = currentTransit.sign;

  // 1. Sector activated based on ruling planet's current sign mapping
  const sectorsMap: Record<string, string> = {
    Aries: "Initiative & Health Ventures",
    Taurus: "Finances & Family Security",
    Gemini: "Contracts & Creative Ventures",
    Cancer: "Home, Rest & Intuition",
    Leo: "Sovereign Fame & Public Authority",
    Virgo: "Meticulous Planning & Research",
    Libra: "Harmonious Unions & Romance",
    Scorpio: "Meta-Transformation & Secrets",
    Sagittarius: "Higher Truth & Academic Journeys",
    Capricorn: "Strategic Corporate Legacy",
    Aquarius: "Universal Humanitarian Networks",
    Pisces: "Ethereal Dreams & Meditation"
  };
  sector = sectorsMap[transitSign] || "General Core Alignment";

  // 2. Score and alignment status based on planetary status (Retrograde vs Moon friendly signs)
  if (isRetro) {
    impactScore -= 20;
    status = "cautious";
  }

  // Check element compatibility between Moon element and ruling planet element
  if (currentMoon.element === currentTransit.element) {
    impactScore += 15;
    if (status !== "cautious") status = "highly favorable";
  } else if (currentTransit.element === "Shadow") {
    status = "meditative";
    impactScore = 65;
  }

  // Adjust bounds
  impactScore = Math.max(15, Math.min(98, impactScore));

  // 3. Generate detailed predictive text utilizing real planetary configurations
  if (planetName === "Sun") {
    if (status === "highly favorable") {
      forecast = `Today, your ruling Sun flows in a sparkling conjunction in the celestial coordinates of ${transitSign} (${currentTransit.degreeInSign}°). Deeply amplified by the Moon in ${currentMoon.sign}, your vital energy radiates unshakeable authoritative focus.`;
      actionAdvice = "Launch public projects, speak with leaders, or command of control points. Sovereign victory is supported.";
    } else {
      forecast = `The Sun governs your life core from the sign of ${transitSign}. With today's lunar coordinates hovering in heavy aspect, you may feel an underlying battle between public expectations and inner ego requirements.`;
      actionAdvice = "Avoid pushy encounters. Use this phase to outline personal visions quietly without demanding external approvals.";
    }
  } else if (planetName === "Moon") {
    forecast = `Governed by Chandra, you are highly tuned to the Moon's coordinates in ${currentMoon.sign} (${currentMoon.degreeInSign}°). Today's transit of your ruler Moon reveals a deep activation of emotional and receptive energies.`;
    actionAdvice = "Refine artistic mockups, engage in restorative conversations, and hydrate thoroughly. Your intuition is at peak strength.";
  } else if (planetName === "Mercury") {
    if (isRetro) {
      forecast = `Your ruling planet Mercury (Budh) is currently in Retrograde transit through the sign of ${transitSign} (${currentTransit.degreeInSign}°). This temporal backward path activates cosmic static over communications, commerce, and logical systems.`;
      actionAdvice = "Postpone signing permanent contracts or initiating heavy tech launches. Read all communications twice and allow patience.";
    } else {
      forecast = `Mercury moves smoothly in Direct motion through ${transitSign}, aligned with your rational intellect. Quick ideas, dynamic commerce opportunities, and smart verbal interactions are highlighted.`;
      actionAdvice = "Finalize contracts, write important content, clear emails, or close trading bargains immediately.";
    }
  } else if (planetName === "Venus") {
    forecast = `Governed by Shukra, Venus transits ${transitSign} at ${currentTransit.degreeInSign}°, radiating elegant beauty. This transit brings a magnetic flow to your relationships, aesthetic eye, and monetary alignment.`;
    actionAdvice = "Beautify your close quarters, invest in luxurious or artistic pieces, and resolve romantic conflicts with charm.";
  } else if (planetName === "Mars") {
    forecast = `Mangal (Mars) brings a strong fiery drive as it advances in the sign of ${transitSign}. Today's numeric matrix indicates high muscle energy, primal courage, and a urge to defend your positions.`;
    actionAdvice = "Tackle heavy roadblocks requiring physical or moral endurance. Chonnel frustration into energetic martial arts or systematic debugging.";
  } else if (planetName === "Jupiter") {
    forecast = `The benevolent Guru (Jupiter) transits peacefully through ${transitSign} (${currentTransit.degreeInSign}°), providing philosophical wisdom, spiritual expansion, and cosmic protection.`;
    actionAdvice = "Absorb higher wisdom, consult mentors, or write philosophical treatises. This is a brilliant day for philanthropic giving.";
  } else if (planetName === "Saturn") {
    forecast = `Ruling Saturn (Shani) resides in deep transit through the serious sign of ${transitSign}. This slow movement demands uncompromised administrative discipline, systematic structural labor, and karmic checks.`;
    actionAdvice = "Accept complex duties without complaint. Slow builds are being verified; map out financial or structural frameworks diligently.";
  } else {
    // Rahu or Ketu shadow planets
    forecast = `Today's cosmic shadow node ${planetName} activates mysterious variables in the sky, passing retrogradely through the coordinate bounds of ${transitSign}. Deeply spiritual or unconventional dimensions are opened.`;
    actionAdvice = "Engage in esoteric tarot research, introspective dream logging, or deep meditation. Postpone standard material speculation.";
  }

  return {
    rulingPlanet: profile.planet,
    sanskritName: profile.sanskritName,
    glyph: profile.glyph,
    color: profile.luckyColorHex,
    transitSign,
    degree: currentTransit.degreeInSign,
    retrograde: isRetro,
    impactScore,
    favorableStatus: status,
    forecast,
    actionAdvice,
    activeLifeSector: sector
  };
}
