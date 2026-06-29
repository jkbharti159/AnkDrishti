export interface NumberMeaning {
  number: number | string;
  title: string;
  essence: string;
  strengths: string[];
  challenges: string[];
  careers: string[];
  element: string;
  color: string; // hex color code
  symbol: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: "Number Meanings" | "Numerology Basics" | "Compatibility" | "Symbols & Astrology Links" | "Vedic Mulank" | "Love & Marriage" | "Kundali Matching" | "Birth Charts";
  emoji: string;
}

export interface CalculationResult {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  personalYear: number;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL: string;
  provider: string;
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
  subscription: "free" | "premium";
  role: "user" | "admin";
}

