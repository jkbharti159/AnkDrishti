import { NumberMeaning, Flashcard } from "../types";

export const numberMeanings: Record<string | number, NumberMeaning> = {
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
    title: "The Cosmic Humanitarian",
    essence: "Completed spiritual cycles, global altruistic love, sacrificial service, and graceful release of temporary ego states.",
    strengths: ["Vast universal empathy", "Altruistic generosity", "Prolific artistic vision", "Noble spiritual wisdom"],
    challenges: ["Spiritual pride", "Melancholic past obsession", "Struggles with material reality"],
    careers: ["Global NGO Strategist", "Fine Art Sculptor", "Environmental Lawyer", "Interfaith Counselor"],
    element: "Fire",
    color: "#f43f5e",
    symbol: "♂"
  },
  "11": {
    number: 11,
    title: "The Channeling Visionary",
    essence: "Master Number. Cosmic lighting-rod of intuition, receiving sudden spiritual pulses, and inspiring others with highly elevated insights.",
    strengths: ["Electrified psychic aura", "Supernatural premonitions", "Inspirational charisma", "Spiritual attunement"],
    challenges: ["Crippling nervous anxiety", "Severe emotional vulnerability", "Disconnection from physical body"],
    careers: ["Metaphysical Teacher", "Inspirational Author", "Avant-Garde Innovator", "Intuitive Counseling Practitioner"],
    element: "Air",
    color: "#a855f7",
    symbol: "⚡"
  },
  "22": {
    number: 22,
    title: "The Master Builder",
    essence: "Master Number. Transmuting grand celestial structures and metaphysical plans into concrete physical realities benefiting all of human existence.",
    strengths: ["Unrivaled material capability", "Grand architectural scope", "Systemic execution", "Pragmatic foresight"],
    challenges: ["Paralyzing self-pressure", "Demoralizing fear of ruin", "Indomitable control complex"],
    careers: ["International Developer", "Global Infrastructure Planner", "Environmental Architect", "Industrial Innovator"],
    element: "Earth",
    color: "#d97706",
    symbol: "🏰"
  },
  "33": {
    number: 33,
    title: "The Master Spiritual Teacher",
    essence: "Master Number. The ultimate manifestation of compassion, guiding collective consciousness evolution through unconditional loving action.",
    strengths: ["Exemplary healing frequencies", "Infinite selflessness", "Emotional anchors", "Spiritual mastery"],
    challenges: ["Suffocating savior complex", "Physical exhaustion from service", "Sorrow for cosmic suffering"],
    careers: ["Humanitarian pioneer", "Global Interfaith Guide", "Holistic Medicine Founder", "Ethical Philosopher"],
    element: "Water",
    color: "#f472b6",
    symbol: "🕊️"
  }
};

export const flashcards: Flashcard[] = [
  // --- NUMBER MEANINGS (13 CARDS) ---
  {
    id: "fc-0",
    question: "What represents the primordial source and infinite potential in numerology?",
    answer: "Number 0 represents the unmanifested universe, infinite flow, and absolute freedom. It elevates the spiritual resonance of any number it accompanies.",
    category: "Number Meanings",
    emoji: "∞"
  },
  {
    id: "fc-1",
    question: "What is the core spiritual vibration of the Number 1?",
    answer: "Number 1 symbolizes the origin, independence, pioneer spirit, and leadership. It represents the spark of creation, drive, ambition, and establishing healthy individualism.",
    category: "Number Meanings",
    emoji: "☉"
  },
  {
    id: "fc-2",
    question: "How does Number 2 express its energy in personal relationships?",
    answer: "Number 2 vibrates with harmony, emotional sensitivity, and diplomacy. It excels at mediation, listening, nurturing connection, and bringing dual forces into balance.",
    category: "Number Meanings",
    emoji: "☽"
  },
  {
    id: "fc-3",
    question: "What does Number 3 represent in terms of creative output?",
    answer: "Number 3 is the catalyst of expression, joy, communication, and social charm. It is governed by expansive Jupiter, channeling cosmic artistic inspiration into voice, prose, and performance.",
    category: "Number Meanings",
    emoji: "♃"
  },
  {
    id: "fc-4",
    question: "What is the primary foundation of the Number 4?",
    answer: "Number 4 constitutes structure, systematic efforts, discipline, and building secure physical foundations. It represents order, loyalty, practical logic, and grounded hard work.",
    category: "Number Meanings",
    emoji: "♅"
  },
  {
    id: "fc-5",
    question: "What is the driving force behind the Number 5?",
    answer: "Number 5 is driven by the quest for absolute personal freedom, adaptability, and sensual exploration. It thrives on constant change, travel, and learning from diverse bodily experiences.",
    category: "Number Meanings",
    emoji: "☿"
  },
  {
    id: "fc-6",
    question: "What makes Number 6 the 'Nurturer' of numerology?",
    answer: "Number 6 represents universal responsibility, healing energy, and home coordination. It expresses deep devotion, artistic beauty, domestic harmony, and selfless parental guidance.",
    category: "Number Meanings",
    emoji: "♀"
  },
  {
    id: "fc-7",
    question: "Why is Number 7 associated with deep introspective research?",
    answer: "Number 7 is the mystic investigator, seeking inner spiritual truth and intellectual depth. It is highly analytical, intuitive, quiet, and values solitude to decalcify illusions.",
    category: "Number Meanings",
    emoji: "♆"
  },
  {
    id: "fc-8",
    question: "How does Number 8 balance material power and spiritual laws?",
    answer: "Number 8 represents material abundance, financial mastery, and authoritative leadership. Its spiritual test is to use physical power ethically, recognizing that energy flows in balancing infinite loop formats.",
    category: "Number Meanings",
    emoji: "♄"
  },
  {
    id: "fc-9",
    question: "What does Number 9 symbolize about closing cycles?",
    answer: "Number 9 is the final single digit, representing graduation, cosmic completion, humanitarian wisdom, and selfless release. It holds the combined elements of all preceding numbers.",
    category: "Number Meanings",
    emoji: "♂"
  },
  {
    id: "fc-11",
    question: "What elevates Master Number 11 above standard numbers?",
    answer: "As the 'Illumined Messenger', 11 is a double-active 1 carrying a spiritual channel of high-voltage intuition. It bridges the gap between material reality and the subtle psychic grids.",
    category: "Number Meanings",
    emoji: "⚡"
  },
  {
    id: "fc-22",
    question: "What represents the ultimate physical manifestation power of Master Number 22?",
    answer: "Master Number 22, the 'Master Builder', merges the spiritual visions of 11 with the physical structure of 4. It builds tangible institutions, systems, and monuments that benefit global humanity.",
    category: "Number Meanings",
    emoji: "🏰"
  },
  {
    id: "fc-33",
    question: "What is the ultimate spiritual expression of Master Number 33?",
    answer: "Master Number 33 is the 'Master Teacher' or 'Healer of Souls'. It vibrates with the perfect unconditional love and pure devotion of 6, selflessly elevating the spiritual and emotional frequencies of the globe.",
    category: "Number Meanings",
    emoji: "🕊️"
  },

  // --- NUMEROLOGY BASICS (10 CARDS) ---
  {
    id: "fc-bas-1",
    question: "What is a Master Number and why is it special?",
    answer: "Master Numbers are the double integers 11, 22, and 33. They hold highly charged spiritual potentials and are never reduced during intermediate stages of calculations.",
    category: "Numerology Basics",
    emoji: "📜"
  },
  {
    id: "fc-bas-2",
    question: "How is the Life Path Number calculated?",
    answer: "The Life Path Number is computed by summing all digits of your full date of birth (DD-MM-YYYY) and reducing the sum repeatedly to a single digit, unless it results in 11, 22, or 33.",
    category: "Numerology Basics",
    emoji: "🎂"
  },
  {
    id: "fc-bas-3",
    question: "What aspect of our identity does the Expression or Destiny Number reveal?",
    answer: "The Expression Number, calculated from your full birth name, represents your innate talents, natural capabilities, and the ultimate destiny or goal you are wired to accomplish.",
    category: "Numerology Basics",
    emoji: "🗣️"
  },
  {
    id: "fc-bas-4",
    question: "What is the difference between Soul Urge and Personality numbers?",
    answer: "The Soul Urge represents your innermost desires (calculated from vowels), while the Personality number shows the outer persona you project to the public (calculated from consonants).",
    category: "Numerology Basics",
    emoji: "🎭"
  },
  {
    id: "fc-bas-5",
    question: "How does the Birthday Number influence your core personality?",
    answer: "Your Birthday Number is the day you were born, reduced to a single digit or master number. It reveals specific natural talents brought into this life, acting as a sub-modifier to your main Life Path.",
    category: "Numerology Basics",
    emoji: "📅"
  },
  {
    id: "fc-bas-6",
    question: "What is the significance of the Personal Year cycle?",
    answer: "The Personal Year cycle is a 9-year evolutionary loop calculated from your birth day, month, and current calendar year. It maps the overall spiritual theme and energetic currents for that 12-month period.",
    category: "Numerology Basics",
    emoji: "🔄"
  },
  {
    id: "fc-bas-7",
    question: "What does repeating numbers (like 111 or 777) in daily life mean?",
    answer: "Repeating numerical patterns, known as Angel Numbers, act as synchronistic nudges from the universe, alerting you to align your thoughts with your current Life Path.",
    category: "Numerology Basics",
    emoji: "✨"
  },
  {
    id: "fc-bas-8",
    question: "What is the Pythagorean numerology chart structure?",
    answer: "The Pythagorean system maps letters of the alphabet from A to Z to values 1 through 9. It is the most popular, scientifically aligned method of Western alphabetical numerology.",
    category: "Numerology Basics",
    emoji: "📐"
  },
  {
    id: "fc-bas-9",
    question: "Do negative numbers exist in traditional numerology?",
    answer: "In traditional numerology, numbers are always positive, representing variations of cosmic frequencies. However, 'Core Challenges' are calculated using subtractions between core digits to find blocks.",
    category: "Numerology Basics",
    emoji: "➖"
  },
  {
    id: "fc-bas-10",
    question: "What is a Karmic Debt Number?",
    answer: "Karmic Debt Numbers (13, 14, 16, 19) represent specific spiritual lessons carried over from past cycles. They manifest as consistent opportunities to transmute obstacles into wisdom.",
    category: "Numerology Basics",
    emoji: "⏳"
  },

  // --- COMPATIBILITY (9 CARDS) ---
  {
    id: "fc-comp-1",
    question: "How is compatibility calculated between two individuals?",
    answer: "Numerological compatibility compares Life Path, Expression, and Birthday numbers. True compatibility arises from harmonious elements (e.g., Fire/Air, Earth/Water) or complementary number vibrations.",
    category: "Compatibility",
    emoji: "💘"
  },
  {
    id: "fc-comp-2",
    question: "Which numbers are generally compatible with the independent Number 1?",
    answer: "Number 1 couples beautifully with the explorer 5 (who shares their independent drive) and the creative 3 (who provides joyful inspiration and verbal catalytic chemistry).",
    category: "Compatibility",
    emoji: "🤝"
  },
  {
    id: "fc-comp-3",
    question: "What is the ultimate match for the harmonious Number 2?",
    answer: "The cooperative 2 partners exceptionally well with the stable, secure 4 (giving foundation to 2's sensitivity) and the universal caretaker 6 (sharing deep values of love and family).",
    category: "Compatibility",
    emoji: "💞"
  },
  {
    id: "fc-comp-4",
    question: "Why is the pairing of 3 and 7 considered highly intellectual?",
    answer: "The artistic 3 and scholarly 7 represent a balancing of outward expression and deep introversive research, combining spark with deep analytical integrity.",
    category: "Compatibility",
    emoji: "🧠"
  },
  {
    id: "fc-comp-5",
    question: "What are the common compatibility traits of Master Number 11?",
    answer: "Master Number 11 is highly open to matching with sensitive 2 (their base vibration) or intuitive 7, as they both value depth, spiritual philosophies, and emotional honesty.",
    category: "Compatibility",
    emoji: "🪐"
  },
  {
    id: "fc-comp-6",
    question: "Can two people with the same Life Path number have a successful partnership?",
    answer: "Yes, identical Life Paths share intense mutual comprehension, but may also reinforce common blindspots (e.g. two 1s clashing over control, or two 5s neglecting stability).",
    category: "Compatibility",
    emoji: "👥"
  },
  {
    id: "fc-comp-7",
    question: "Which numbers should the material-oriented Number 8 look for in dynamic collaborations?",
    answer: "The ambitious 8 partners perfectly with the organized and practical 4, and is highly stimulated by the analytical research of a master 7.",
    category: "Compatibility",
    emoji: "💼"
  },
  {
    id: "fc-comp-8",
    question: "Why do Numbers 5 and 9 share a strong humanitarian wanderlust connection?",
    answer: "The freedom-seeking 5 and worldly humanitarian 9 are both open-minded explorers of cultures, philosophies, and global experiences, making them powerful agents of change.",
    category: "Compatibility",
    emoji: "🌎"
  },
  {
    id: "fc-comp-9",
    question: "What creates friction between Numbers 4 and 5?",
    answer: "Friction occurs because 4 represents meticulous stability, routines, and physical security, whereas 5 is governed by extreme impulse, wild freedom, and rapid transitions.",
    category: "Compatibility",
    emoji: "⚡"
  },

  // --- ASTROLOGY (9 CARDS) ---
  {
    id: "fc-ast-1",
    question: "What planetary body rules Number 1 and how does it affect its energy?",
    answer: "Number 1 is ruled by the Sun (☉), reflecting raw personal authority, creative spark, self-reliance, willpower, and shining bright as a primary focal element.",
    category: "Symbols & Astrology Links",
    emoji: "☀️"
  },
  {
    id: "fc-ast-2",
    question: "What is the astrological correspondence for the deep Number 2?",
    answer: "Number 2 corresponds to the Moon (☽), bringing sub-conscious emotional tides, intuitive insight, reflective receptivity, nurturing traits, and diplomatic patience.",
    category: "Symbols & Astrology Links",
    emoji: "🌙"
  },
  {
    id: "fc-ast-3",
    question: "Which astrology sign directly aligns with the structure of Number 4?",
    answer: "Number 4 aligns with Aquarius (ruled by Uranus ♅) and Taurus, combining the structural Earth foundation with progressive, systematic, and revolutionary design principles.",
    category: "Symbols & Astrology Links",
    emoji: "♒"
  },
  {
    id: "fc-ast-4",
    question: "What elements are represented by Numbers 1, 5, and 8?",
    answer: "Number 1 is Fire (dynamic action), 5 is Ether/Air (movement, sudden change, communication), and 8 is Earth (authoritative grounding and material mastery).",
    category: "Symbols & Astrology Links",
    emoji: "🔥"
  },
  {
    id: "fc-ast-5",
    question: "Why is Number 7 mapped to Neptune in cosmic astrology?",
    answer: "Number 7 maps to Neptune (♆), the planet of spiritual dreams, meditation, psychic structures, secrets, and dissolving the boundaries of the physical plane.",
    category: "Symbols & Astrology Links",
    emoji: "🔱"
  },
  {
    id: "fc-ast-6",
    question: "What sacred geometry symbol sits as the heart of all numeric frequencies?",
    answer: "Metatron's Cube is the ultimate sacred geometry template, containing all 5 Platonic Solids which form the mathematical and digital grids of creation.",
    category: "Symbols & Astrology Links",
    emoji: "💠"
  },
  {
    id: "fc-ast-7",
    question: "How does the number 9 relate to Mars and cosmic fire?",
    answer: "Number 9 correlates to Mars (♂) and the element of Fire. It represents the ultimate spiritual warrior, transmuting anger into selfless humanitarian compassions.",
    category: "Symbols & Astrology Links",
    emoji: "☄️"
  },
  {
    id: "fc-ast-8",
    question: "What is the connection between Number 3 and planetary luck?",
    answer: "Number 3 is governed by Jupiter (♃), the largest planet of wisdom, expansion, good fortune, jovial socialization, and vibrant creative self-expression.",
    category: "Symbols & Astrology Links",
    emoji: "🍀"
  },
  {
    id: "fc-ast-9",
    question: "How does the symbol of the Ouroboros relate to the Number 0?",
    answer: "The Ouroboros (snake eating its own tail) mirrors Number 0. It signifies infinite recurrence, the cosmic void, complete self-containment, and the primordial field preceding all physical counts.",
    category: "Symbols & Astrology Links",
    emoji: "🐉"
  },

  // --- VEDIC MULANK (9 CARDS, BRINGS TOTAL TO 50) ---
  {
    id: "fc-ved-1",
    question: "What is Vedic Mulank 1's ruling planet and core design?",
    answer: "Mulank 1 is ruled by the Sun (Surya). It represents pioneer independent drive, high ambition, and a protective leading persona. A fun fact: they have an immediate structural affinity with Mulank 5 for initiating entrepreneurial ideas.",
    category: "Vedic Mulank",
    emoji: "☉"
  },
  {
    id: "fc-ved-2",
    question: "What governs Vedic Mulank 2 and how does its intuition manifest?",
    answer: "Mulank 2 is governved by Chandra (Moon), emphasizing empathy, gentle diplomatic reconciliation, and a rich inner fantasy world. A fun fact: they are highly synced to the lunar tides, making full moon periods excellent for creative outputs.",
    category: "Vedic Mulank",
    emoji: "☽"
  },
  {
    id: "fc-ved-3",
    question: "What is the cosmic nature and fun fact of Vedic Mulank 3?",
    answer: "Mulank 3 is ruled by Guru (Jupiter), highlighting philosophical wisdom, speechcraft, and spiritual joy. A fun fact: they are natural counselors who absorb high cosmic protection, resolving most life setbacks with jovial optimism.",
    category: "Vedic Mulank",
    emoji: "♃"
  },
  {
    id: "fc-ved-4",
    question: "Why does Vedic Mulank 4 represent unconventional systems?",
    answer: "Mulank 4 is ruled by Rahu, bringing rapid life shifts, unconventional innovation, and stellar concentration. A fun fact: they excel as software engineers or systems debuggers due to their out-of-the-box analytical minds.",
    category: "Vedic Mulank",
    emoji: "☊"
  },
  {
    id: "fc-ved-5",
    question: "What is Vedic Mulank 5's ruling force and adaptative nature?",
    answer: "Mulank 5 is ruled by Budh (Mercury), giving rise to speed of thought, commercial intelligence, and playful travel. A fun fact: they adapt instantly to new cultures and bounce back from financial crises faster than any other number.",
    category: "Vedic Mulank",
    emoji: "☿"
  },
  {
    id: "fc-ved-6",
    question: "What is Vedic Mulank 6's sensory alignment and charisma?",
    answer: "Mulank 6 is governed by Shukra (Venus), focusing on refined aesthetic curation, maternal/paternal domestic care, and luxurious comfort. A fun fact: they hold immense conversational charm, easily defusing workplace tension.",
    category: "Vedic Mulank",
    emoji: "♀"
  },
  {
    id: "fc-ved-7",
    question: "Why is Vedic Mulank 7 called the detached mystic?",
    answer: "Mulank 7 is ruled by Ketu, highlighting spiritual introspection, a lack of interest in material status, and exceptional dream logging. A fun fact: they have instant psychic-level reads on people's underlying motives.",
    category: "Vedic Mulank",
    emoji: "☋"
  },
  {
    id: "fc-ved-8",
    question: "What governs the slow, authoritative climb of Vedic Mulank 8?",
    answer: "Mulank 8 is ruled by Shani (Saturn), representing systematic discipline, heavy karmic duties, and unyielding resilience. A fun fact: they navigate complex structural roadblocks with absolute stoicism, peaking in power after age 36.",
    category: "Vedic Mulank",
    emoji: "♄"
  },
  {
    id: "fc-ved-9",
    question: "What represents the heroic, fearless nature of Vedic Mulank 9?",
    answer: "Mulank 9 is ruled by Mangal (Mars), focusing on warrior courage, humanitarian advocacy, and raw physical endurance. A fun fact: they are direct to a fault and act as emergency protectors for vulnerable groups.",
    category: "Vedic Mulank",
    emoji: "♂"
  },
  // --- LOVE & MARRIAGE (8 CARDS) ---
  {
    id: "fc-love-1",
    question: "How is numerology compatibility calculated between partners?",
    answer: "It is computed by comparing the Life Path Numbers (core journey alignment), Mulanks (inner temperament), Soul Urge Numbers (deepest emotional desires), and Expression Numbers (communication styles), weighting their synastry to determine a harmonious score.",
    category: "Love & Marriage",
    emoji: "💖"
  },
  {
    id: "fc-love-2",
    question: "What do Personal Years 2, 6, and 9 signify for relationship developments?",
    answer: "Personal Year 2 brings collaboration, empathy, and pairing. Personal Year 6 focuses on domestic bliss, family duties, and marriage commitments. Personal Year 9 triggers closure of old cycles, often serving as a prelude to a significant new relationship phase.",
    category: "Love & Marriage",
    emoji: "⏳"
  },
  {
    id: "fc-love-3",
    question: "What is the role of Venus in romantic and commitment timing?",
    answer: "Venus represents emotional attraction, sensual beauty, and marriage harmony. Transits where Venus is direct support new beginnings, while Venus Retrograde cycles indicate a period for re-evaluating past values rather than starting unions.",
    category: "Love & Marriage",
    emoji: "♀"
  },
  {
    id: "fc-love-4",
    question: "What is the importance of Jupiter in marriage timing?",
    answer: "In Vedic traditions, Jupiter represents divine grace, expansion, and protection. Jovial transits favorably activating a partner's ruling planet or Moon sign serve as strong celestial windows for legal commitments and marriages.",
    category: "Love & Marriage",
    emoji: "♃"
  },
  {
    id: "fc-love-5",
    question: "What does a high vs low compatibility score actually mean?",
    answer: "High scores indicate natural resonance and flowing communications, but can lead to stagnation. Low scores signal differences in frequency, representing constructive growth areas that build ultimate relational resilience if met with mutual respect.",
    category: "Love & Marriage",
    emoji: "📊"
  },
  {
    id: "fc-love-6",
    question: "What are some common myths about numerology and relationships?",
    answer: "A common myth is that challenging numbers guarantee relationship failure. Numerology suggests tendencies and behavioral styles, showing the growth homework needed rather than prescribing deterministic fates.",
    category: "Love & Marriage",
    emoji: "🔮"
  },
  {
    id: "fc-love-7",
    question: "What is the significance of the Life Path alignment in relationships?",
    answer: "Life Path alignment compares the overarching directions of both partners. Matching digits share strong mutual goals, whereas opposing Paths introduce unique perspectives that expand each partner's worldview.",
    category: "Love & Marriage",
    emoji: "🌈"
  },
  {
    id: "fc-love-8",
    question: "How do Soul Urge numbers influence romantic harmony?",
    answer: "Soul Urge numbers, calculated from name vowels, express your deepest private cravings and secrets. Harmony here indicates that partners can satisfy each other's emotional needs on a profound, subconscious level.",
    category: "Love & Marriage",
    emoji: "❤️"
  },
  // --- KUNDALI MATCHING (8 CARDS) ---
  {
    id: "fc-kundali-1",
    question: "What is traditional Ashtakoot Guna Milan in Kundali Matching?",
    answer: "It is an 8-fold astrological check comparing the Moon's nakshatra and signs of both partners. Scoring covers Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi, yielding a total score out of 36.",
    category: "Kundali Matching",
    emoji: "🕉️"
  },
  {
    id: "fc-kundali-2",
    question: "What is Nadi Dosha and why is it considered highly significant?",
    answer: "Nadi represents genetic harmony, life force, and the health of future children. If both partners have the same Nadi (Aadi, Madhya, or Antya), Nadi Dosha is flagged, advising caution or remedies to balance physical vitalities.",
    category: "Kundali Matching",
    emoji: "🧬"
  },
  {
    id: "fc-kundali-3",
    question: "What is Mangal Dosha (Manglik) and how is it resolved?",
    answer: "It occurs when Mars rests in houses 1, 2, 4, 7, 8, or 12, reflecting high passionate drive. If only one partner is Manglik, it indicates traditional friction. If BOTH share it, the Dosha is considered beautifully cancelled.",
    category: "Kundali Matching",
    emoji: "♂"
  },
  {
    id: "fc-kundali-4",
    question: "What does an Ashtakoot Guna Milan score out of 36 points represent?",
    answer: "Under 18 points is generally not recommended, 18-23 is an average baseline, 24-32 indicates a very good match, and 33-36 represents exceptional spiritual harmony. However, Guna Milan is only one tier of overall relationship health.",
    category: "Kundali Matching",
    emoji: "📜"
  },
  {
    id: "fc-kundali-5",
    question: "What is the difference between Western Numerology Compatibility and Vedic Kundali Matching?",
    answer: "Numerology analyzes name vibrations and birthdate digits to evaluate personality alignment. Kundali Matching analyzes exact astronomical grids and Moon nakshatras, matching deep familial, metabolic, and karmic metrics.",
    category: "Kundali Matching",
    emoji: "⚖️"
  },
  {
    id: "fc-kundali-6",
    question: "What do the three Ganas (Deva, Manushya, Rakshasa) represent in Vedic astrology?",
    answer: "Ganas indicate temperament. Deva signifies divine/generous; Manushya represents human/practical; Rakshasa denotes fierce/strong-willed. Matching Ganas supports harmonious temperament flows.",
    category: "Kundali Matching",
    emoji: "🦁"
  },
  {
    id: "fc-kundali-7",
    question: "What is Bhakoot Dosha in Kundali Matching and how does it manifest?",
    answer: "Bhakoot analyzes the relative positions of the partners' Moon signs. Specific relationships (like 6-8 or 2-12 house distances) trigger Bhakoot Dosha, reflecting potential imbalances in mutual finances or family coordination.",
    category: "Kundali Matching",
    emoji: "🌘"
  },
  {
    id: "fc-kundali-8",
    question: "Why is the Moon nakshatra used for Vedic matching instead of the Sun sign?",
    answer: "Vedic astrology prioritizes the Moon because it governs the subconscious mind, emotions, and receptive field of the soul. The Nakshatra represents a refined 13°20' sector that is highly distinct compared to a broad Sun sign.",
    category: "Kundali Matching",
    emoji: "🌙"
  },
  {
    id: "fc-chart-1",
    question: "What is a Birth Chart (D1 / Rashi Chart) in Vedic Astrology?",
    answer: "The Birth Chart (D1) is the fundamental astronomical map of the sky at the exact second of birth. It depicts the astronomical positions of the 9 celestial bodies across 12 zodiac houses, acting as the foundational blueprint of your physical existence, character of life, and general destiny path.",
    category: "Birth Charts",
    emoji: "☸️"
  },
  {
    id: "fc-chart-2",
    question: "What is the Navamsa Chart (D9) and why is it so critical for marriage?",
    answer: "The Navamsa Chart (D9) is a divisional sub-chart created by dividing each zodiac sign into 9 equal parts. It acts as the magnifying lens for the 9th house, revealing your inner spiritual alignment, the true quality of your married life, and the general temperament and soul-compatibility of your life partner.",
    category: "Birth Charts",
    emoji: "💍"
  },
  {
    id: "fc-chart-3",
    question: "What does the 7th House represent in a Vedic Birth Chart?",
    answer: "The 7th House represents partnerships, marriage, legal bindings, and business associations. Bounding the western horizon opposite the first house (of self), it directly mirrors how you relate to 'the other', indicating the stability, romance, and shared communication of your marriage.",
    category: "Birth Charts",
    emoji: "🤝"
  },
  {
    id: "fc-chart-4",
    question: "Why is exact birth time necessary for accurate chart readings?",
    answer: "While planetary signs (like Sun or Moon) change over days or weeks, the Ascendant (Lagna) sign shifts roughly every 2 hours as the Earth rotates. Having an exact birth time determines the precise Ascendant and the accurate alignment of all 12 houses. Without it, house indices cannot be generated.",
    category: "Birth Charts",
    emoji: "⏰"
  },
  {
    id: "fc-chart-5",
    question: "What is the difference between North Indian and South Indian chart styles?",
    answer: "In the North Indian style (diamond format), house positions are completely fixed (House 1 is always the top middle diamond), and the numbers written represent the changing Zodiac Signs. In the South Indian style (square block format), the signs are fixed in space, and the houses rotate based on where the Lagna is placed.",
    category: "Birth Charts",
    emoji: "🎨"
  },
  {
    id: "fc-chart-6",
    question: "How do Venus and Jupiter placements affect marriage in a birth chart?",
    answer: "Venus is the natural Karaka (significator) of romantic love, harmony, and material joy. Jupiter represents divine wisdom, growth, and the husband figure in a woman's chart. Strong, well-placed Jupiter and Venus aspects ensure respect, long-standing devotion, mutual forgiveness, and prosperity in relationships.",
    category: "Birth Charts",
    emoji: "⭐"
  }
];

export const pythagoreanMap: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

export const zodiacNumberData = [
  { sign: "Aries", number: 1, rulingPlanet: "Mars", element: "Fire", glyph: "♈" },
  { sign: "Taurus", number: 4, rulingPlanet: "Venus", element: "Earth", glyph: "♉" },
  { sign: "Gemini", number: 5, rulingPlanet: "Mercury", element: "Air", glyph: "♊" },
  { sign: "Cancer", number: 2, rulingPlanet: "Moon", element: "Water", glyph: "♋" },
  { sign: "Leo", number: 1, rulingPlanet: "Sun", element: "Fire", glyph: "♌" },
  { sign: "Virgo", number: 6, rulingPlanet: "Mercury", element: "Earth", glyph: "♍" },
  { sign: "Libra", number: 2, rulingPlanet: "Venus", element: "Air", glyph: "♎" },
  { sign: "Scorpio", number: 9, rulingPlanet: "Pluto/Mars", element: "Water", glyph: "♏" },
  { sign: "Sagittarius", number: 3, rulingPlanet: "Jupiter", element: "Fire", glyph: "♐" },
  { sign: "Capricorn", number: 8, rulingPlanet: "Saturn", element: "Earth", glyph: "♑" },
  { sign: "Aquarius", number: 11, rulingPlanet: "Uranus", element: "Air", glyph: "♒" },
  { sign: "Pisces", number: 7, rulingPlanet: "Neptune", element: "Water", glyph: "♓" }
];

export const getCompatibility = (num1: number, num2: number): { percent: number; summary: string } => {
  const composite = (num1 + num2) % 9 || 9;
  
  // Specific checks
  if ((num1 === 1 && num2 === 5) || (num1 === 5 && num2 === 1)) {
    return { percent: 96, summary: "Pioneering Freedom. Both numbers feed off each other's passion for autonomy, speed of thought, and mutual inspiration. A highly adventurous spark!" };
  }
  if ((num1 === 2 && num2 === 4) || (num1 === 4 && num2 === 2)) {
    return { percent: 92, summary: "Stable Haven. The meticulous structure of 4 gives deep psychological protection to the sensitive, cooperative nature of 2 structure. Utterly peaceful." };
  }
  if ((num1 === 2 && num2 === 6) || (num1 === 6 && num2 === 2)) {
    return { percent: 95, summary: "Sacred Caretaker. Both numbers value intimate emotional safety, parenting, and absolute fidelity. Exceptionally warm, loving, and long-lasting." };
  }
  if ((num1 === 3 && num2 === 7) || (num1 === 7 && num2 === 3)) {
    return { percent: 89, summary: "Mind and Soul. The creative child (3) triggers the introspective scholar (7) into laughing, while the 7 teaches 3 how to ground their scattered brilliant ideas." };
  }
  if ((num1 === 4 && num2 === 5) || (num1 === 5 && num2 === 4)) {
    return { percent: 45, summary: "Instability Friction. Absolute routines and structured security (4) crash directly with the rapid change and restless explorer impulses of 5. Requires immense work." };
  }
  if ((num1 === 1 && num2 === 1) || (num1 === 8 && num2 === 8)) {
    return { percent: 55, summary: "Sovereign Collision. Two dominant leaders create a heavy clash of sovereign wills. Requires designated zones of control to function without war." };
  }
  if (num1 === num2) {
    return { percent: 85, summary: "Mirrored Destiny. Shared life path means instant, intense understanding of goals and inner struggles, but you must actively monitor shared blindspots." };
  }
  
  // Element-based algorithm
  const evenCount = (num1 % 2 === 0 ? 1 : 0) + (num2 % 2 === 0 ? 1 : 0);
  if (evenCount === 2) {
    // Both receptive (Earth/Water)
    return { percent: 88, summary: "Harmonious Grounds. Both numbers walk on secure, receptive paths. Realism, emotional support, and shared longevity form a highly stable, soothing anchor." };
  } else if (evenCount === 0) {
    // Both active (Fire/Air)
    return { percent: 86, summary: "Enthusiastic Sparks. Two active, expressive frequencies. High intellectual conversation, drive, and social dynamics. Can sometimes lack grounding constraints." };
  } else {
    // One active, one receptive
    return { percent: 68, summary: "Complementary Growth. This union requires conscious compromise. One is driven to act and express outwardly (Air/Fire), while the other desires deep internal processing or structure (Water/Earth)." };
  }
};
