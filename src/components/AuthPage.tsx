import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../services/firebase";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  Compass, 
  RefreshCw,
  Clock,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";

export default function AuthPage() {
  const { 
    user, 
    profile, 
    signUpWithEmail, 
    signInWithEmail, 
    signInWithGoogle, 
    sendVerification, 
    sendPasswordReset, 
    reloadUser,
    logout
  } = useAuth();
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "verify">("signin");
  
  // Form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  // Email Verification countdown
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Password requirements state
  const [passReqs, setPassReqs] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  // Calculate password strength
  const getPasswordStrength = () => {
    let score = 0;
    if (passReqs.length) score++;
    if (passReqs.uppercase) score++;
    if (passReqs.lowercase) score++;
    if (passReqs.number) score++;
    if (passReqs.special) score++;
    
    if (password.length === 0) return { label: "", color: "bg-zinc-800", percentage: "0%", score };
    if (score <= 2) return { label: "Weak", color: "bg-red-500", percentage: "33%", score };
    if (score <= 4) return { label: "Medium", color: "bg-amber-500", percentage: "66%", score };
    return { label: "Strong", color: "bg-emerald-500", percentage: "100%", score };
  };

  // Validate password on change
  useEffect(() => {
    setPassReqs({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const renderError = (errText: string) => {
    if (errText.includes("auth/unauthorized-domain") || errText.includes("unauthorized-domain")) {
      return (
        <div className="space-y-1.5 text-left text-[11px] leading-relaxed w-full">
          <p className="font-bold text-amber-400">Firebase Error: Unauthorized Domain</p>
          <p className="text-zinc-300">
            This domain is not authorized. Fix this in 3 quick steps:
          </p>
          <ol className="list-decimal pl-4 text-zinc-300 space-y-1">
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline">Firebase Console</a>.</li>
            <li>Select your project (<code className="bg-black/40 px-1 rounded text-amber-200">ankdrishti-a95b0</code>).</li>
            <li>Go to <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized Domains</strong> &rarr; add <code className="bg-black/40 px-1 rounded text-amber-200">{window.location.hostname}</code>.</li>
          </ol>
        </div>
      );
    }
    if (errText.includes("auth/configuration-not-found") || errText.includes("configuration-not-found")) {
      return (
        <div className="space-y-1.5 text-left text-[11px] leading-relaxed w-full">
          <p className="font-bold text-amber-400">Firebase Error: Configuration Not Found</p>
          <p className="text-zinc-300">
            Sign-in methods are not enabled. Fix this in 3 steps:
          </p>
          <ol className="list-decimal pl-4 text-zinc-300 space-y-1">
            <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-300 hover:underline">Firebase Console</a>.</li>
            <li>Select your project (<code className="bg-black/40 px-1 rounded text-amber-200">ankdrishti-a95b0</code>).</li>
            <li>Go to <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong> &rarr; enable <strong>Email/Password</strong> and <strong>Google</strong>.</li>
          </ol>
        </div>
      );
    }
    return <span className="w-full text-left">{errText}</span>;
  };

  // Handle mode transitions
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [mode]);

  // Preload heavy background image for instant page responsiveness
  useEffect(() => {
    const img = new Image();
    img.src = "https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(24).jpeg";
    img.onload = () => {
      setBgImageLoaded(true);
    };
  }, []);

  // If user is logged in but not verified, show verification page
  useEffect(() => {
    if (user && !user.emailVerified) {
      setMode("verify");
      startCountdown();
    }
  }, [user]);

  // Countdown timer for resending email verification
  const startCountdown = () => {
    setResendTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups and try again.");
      } else {
        setError(err.message || "An error occurred during Google sign in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Connection problem detected. Please try again.");
      } else {
        setError(err.message || "Failed to sign in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const strength = getPasswordStrength();
    if (strength.score < 5) {
      setError("Please create a stronger password meeting all criteria.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await signUpWithEmail(email, password, fullName);
      setSuccess("Account created successfully!");
      setMode("verify");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account already exists with this email.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Connection problem detected. Please try again.");
      } else {
        setError(err.message || "Failed to register.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await sendPasswordReset(email);
      setSuccess("A verification / password reset link has been sent to your email address.");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else {
        setError(err.message || "Failed to send reset email.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendTimer > 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await sendVerification();
      setSuccess("Verification email has been resent successfully.");
      startCountdown();
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckVerification = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await reloadUser();
      if (auth.currentUser?.emailVerified) {
        setSuccess("Email verified successfully! Opening your dashboard...");
      } else {
        setError("Email is not verified yet. Please check your inbox and click the link.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to check verification status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col md:flex-row relative overflow-hidden font-sans select-none">
      
      {/* Animated Background Image */}
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url("https://raw.githubusercontent.com/jkbharti159/Patriotic-images/main/_%20(7)%20(24).jpeg")`
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: bgImageLoaded ? 1 : 0,
          scale: [1, 1.08, 1],
          x: [0, 4, -4, 0],
          y: [0, -3, 3, 0]
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" },
          scale: { duration: 35, repeat: Infinity, ease: "easeInOut" },
          x: { duration: 35, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 35, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      
      {/* Visual background gradient tint for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06050a]/60 via-[#0B1026]/40 to-[#0B1026]/75 z-0 backdrop-blur-[0.5px]" />
      
      {/* Cosmic background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
      
      {/* Light zodiac overlay alignment wheel */}
      <div className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] opacity-[0.03] pointer-events-none z-0 rotate-180 animate-spin" style={{ animationDuration: "180s" }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.1" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 50 + 35 * Math.cos(angle);
            const y1 = 50 + 35 * Math.sin(angle);
            const x2 = 50 + 45 * Math.cos(angle);
            const y2 = 50 + 45 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.15" />;
          })}
        </svg>
      </div>

      {/* Floating Lightweight Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-white opacity-40 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      {/* LEFT SECTION (DESKTOP) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 lg:p-20 z-10 relative border-r border-amber-500/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 p-[1.5px] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center animate-spin" style={{ animationDuration: "15s" }}>
            <div className="w-full h-full bg-[#0B1026] rounded-full flex items-center justify-center">
              <Compass className="w-5 h-5 text-[#D4AF37]" />
            </div>
          </div>
          <span className="font-serif font-black tracking-[0.2em] text-[#FFFFFF] text-xl uppercase shadow-glow-title">
            AnkDrishti
          </span>
        </div>

        {/* Dynamic Brand/Vedic Astrology Showcase */}
        <div className="my-auto space-y-8 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-[10px] font-mono tracking-widest uppercase text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Vedic Astrology & Numerology
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            Discover Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-[#D4AF37] to-amber-500">
              Cosmic Blueprint
            </span>
          </h1>
          
          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            AnkDrishti blends ancient Indian Vedic wisdom, sacred numerology calculations, compatibility indexes, and temporal mapping algorithms with state-of-the-art AI to reveal your unique celestial vibration.
          </p>

          {/* Staggered features preview list */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { title: "Vedic Mulank", desc: "Root vibration & traits" },
              { title: "Zodiac Alignments", desc: "Planetary positions" },
              { title: "Synergy Index", desc: "Deep connection mapping" },
              { title: "Obstacle Analyst", desc: "Vedic remedy guide" }
            ].map((f, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 hover:border-amber-500/20 transition-all group">
                <span className="text-xs font-serif font-bold text-[#D4AF37] group-hover:text-yellow-400 block transition-colors">{f.title}</span>
                <span className="text-[10px] text-zinc-400 mt-0.5 block">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          © {new Date().getFullYear()} AnkDrishti. Secure SSL Authenticated session.
        </div>
      </div>

      {/* RIGHT SECTION - AUTH CARD */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 z-10 relative min-h-screen">
        
        {/* Mobile Header */}
        <div className="md:hidden flex flex-col items-center gap-2 mb-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-amber-700 p-[1.5px] shadow-[0_0_20px_rgba(212,175,55,0.45)] flex items-center justify-center animate-spin" style={{ animationDuration: "12s" }}>
            <div className="w-full h-full bg-[#0B1026] rounded-full flex items-center justify-center">
              <Compass className="w-6 h-6 text-[#D4AF37]" />
            </div>
          </div>
          <h2 className="font-serif font-black tracking-[0.2em] text-[#FFFFFF] text-2xl uppercase">
            AnkDrishti
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
            AI-Powered Vedic Astrology & Numerology
          </p>
        </div>

        {/* Responsive Glassmorphism Card */}
        <div className="w-full max-w-md bg-[#000000]/15 backdrop-blur-[1px] border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.35)] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {/* 1. SIGN IN MODE */}
            {mode === "signin" && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-serif font-bold tracking-wide">Welcome Back</h3>
                  <p className="text-xs text-zinc-400 font-sans">Align with your sacred birth parameters.</p>
                </div>

                {/* Google Sign In option */}
                <div>
                  <button
                    onClick={handleGoogleAuth}
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#1A1F4B] hover:bg-[#252b6b] border border-white/10 hover:border-[#D4AF37]/40 rounded-xl flex items-center justify-center gap-3 transition-all text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-sm active:scale-98"
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">or email access</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 w-full"
                  >
                    <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                    {renderError(error)}
                  </motion.div>
                )}

                {/* Sign In Form */}
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Mail className="w-4 h-4 text-zinc-400" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="astroguru@ankdrishti.com"
                        className="w-full h-11 pl-10 pr-4 bg-white/[0.03] focus:bg-white/[0.05] border border-white/10 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl text-sm transition-all placeholder:text-zinc-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Password</label>
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-[10px] font-mono text-zinc-400 hover:text-[#D4AF37] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Lock className="w-4 h-4 text-zinc-400" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 pl-10 pr-10 bg-white/[0.03] focus:bg-white/[0.05] border border-white/10 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl text-sm transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-[#D4AF37]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-400 hover:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 text-[#D4AF37] focus:ring-[#D4AF37]/30 bg-transparent cursor-pointer"
                      />
                      <span>Remember me</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-amber-600 to-[#D4AF37] hover:from-amber-500 hover:to-yellow-400 text-white font-serif tracking-widest font-bold uppercase text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </form>

                {/* Mode toggle */}
                <div className="text-center text-xs text-zinc-400">
                  New to AnkDrishti?{" "}
                  <button
                    onClick={() => setMode("signup")}
                    className="text-[#D4AF37] hover:text-yellow-400 font-bold hover:underline"
                  >
                    Create an Account
                  </button>
                </div>
              </motion.div>
            )}

            {/* 2. SIGN UP MODE */}
            {mode === "signup" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-serif font-bold tracking-wide">Cosmic Registration</h3>
                  <p className="text-xs text-zinc-400 font-sans">Begin your self-discovery journey.</p>
                </div>

                {/* Google Sign In option */}
                <div>
                  <button
                    onClick={handleGoogleAuth}
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#1A1F4B] hover:bg-[#252b6b] border border-white/10 hover:border-[#D4AF37]/40 rounded-xl flex items-center justify-center gap-3 transition-all text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="h-[1px] flex-1 bg-white/5" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">or register email</span>
                  <div className="h-[1px] flex-1 bg-white/5" />
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 animate-bounce-short w-full"
                  >
                    <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                    {renderError(error)}
                  </motion.div>
                )}

                {/* Sign Up Form */}
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <User className="w-4 h-4 text-zinc-400" />
                      </span>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jitendra Bharti"
                        className="w-full h-11 pl-10 pr-4 bg-white/[0.03] focus:bg-white/[0.05] border border-white/10 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl text-sm transition-all placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Mail className="w-4 h-4 text-zinc-400" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="guru@ankdrishti.com"
                        className="w-full h-11 pl-10 pr-4 bg-white/[0.03] focus:bg-white/[0.05] border border-white/10 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl text-sm transition-all placeholder:text-zinc-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Lock className="w-4 h-4 text-zinc-400" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 pl-10 pr-4 bg-white/[0.03] focus:bg-white/[0.05] border border-white/10 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl text-sm transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Confirm Password</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Lock className="w-4 h-4 text-zinc-400" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 pl-10 pr-4 bg-white/[0.03] focus:bg-white/[0.05] border border-white/10 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl text-sm transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Meter & Real-time Live Requirements */}
                  {password.length > 0 && (
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-400 uppercase tracking-wider">Password Strength:</span>
                        <span className={`font-black uppercase ${
                          getPasswordStrength().label === "Strong" ? "text-emerald-400" :
                          getPasswordStrength().label === "Medium" ? "text-amber-400" : "text-red-400"
                        }`}>
                          {getPasswordStrength().label}
                        </span>
                      </div>
                      
                      {/* Visual Progress Bar */}
                      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getPasswordStrength().color}`} 
                          style={{ width: getPasswordStrength().percentage }}
                        />
                      </div>

                      {/* Requirement Indicators Grid */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[9px] font-mono">
                        {[
                          { key: "length", label: "8+ characters" },
                          { key: "uppercase", label: "1 Uppercase letter" },
                          { key: "lowercase", label: "1 Lowercase letter" },
                          { key: "number", label: "1 Number" },
                          { key: "special", label: "1 Special character" }
                        ].map((req) => {
                          const met = passReqs[req.key as keyof typeof passReqs];
                          return (
                            <div key={req.key} className="flex items-center gap-1">
                              {met ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <X className="w-3 h-3 text-zinc-600" />
                              )}
                              <span className={met ? "text-zinc-300" : "text-zinc-500"}>{req.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Agree to terms */}
                  <div className="flex items-start">
                    <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-zinc-400 hover:text-zinc-200">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-white/10 text-[#D4AF37] focus:ring-[#D4AF37]/30 bg-transparent cursor-pointer"
                      />
                      <span className="leading-tight">I agree to the <span className="text-[#D4AF37] hover:underline">Terms of Service</span> & <span className="text-[#D4AF37] hover:underline">Privacy Policy</span></span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-amber-600 to-[#D4AF37] hover:from-amber-500 hover:to-yellow-400 text-white font-serif tracking-widest font-bold uppercase text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <Sparkles className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </form>

                {/* Mode toggle */}
                <div className="text-center text-xs text-zinc-400">
                  Already have an account?{" "}
                  <button
                    onClick={() => setMode("signin")}
                    className="text-[#D4AF37] hover:text-yellow-400 font-bold hover:underline"
                  >
                    Sign In instead
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. FORGOT PASSWORD MODE */}
            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl md:text-2xl font-serif font-bold tracking-wide">Cosmic Alignment</h3>
                  <p className="text-xs text-zinc-400 font-sans">Enter email to restore account frequency.</p>
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 w-full">
                    <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                    {renderError(error)}
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5">
                    <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Forgot Form */}
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Registered Email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                        <Mail className="w-4 h-4 text-zinc-400" />
                      </span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="guru@ankdrishti.com"
                        className="w-full h-11 pl-10 pr-4 bg-white/[0.03] focus:bg-white/[0.05] border border-white/10 focus:border-[#D4AF37]/50 focus:outline-none rounded-xl text-sm transition-all placeholder:text-zinc-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-amber-600 to-[#D4AF37] hover:from-amber-500 hover:to-yellow-400 text-white font-serif tracking-widest font-bold uppercase text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      "Send Recovery Email"
                    )}
                  </button>
                </form>

                {/* Back to sign in */}
                <div className="text-center">
                  <button
                    onClick={() => setMode("signin")}
                    className="text-xs font-mono text-zinc-400 hover:text-[#D4AF37] hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </motion.div>
            )}

            {/* 4. EMAIL VERIFICATION MODE */}
            {mode === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <ShieldAlert className="w-8 h-8 animate-pulse" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-serif font-bold tracking-wide">Verify Your Email</h3>
                  
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans px-4">
                    We have sent a verification link to your email address: <br />
                    <span className="font-mono font-bold text-[#D4AF37] mt-1 block">{user?.email}</span>
                  </p>
                </div>

                {/* Feedback Alerts */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5 w-full">
                    <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                    {renderError(error)}
                  </div>
                )}

                {success && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5">
                    <Check className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Verify Actions */}
                <div className="space-y-3.5">
                  {/* Manual trigger verify check */}
                  <button
                    onClick={handleCheckVerification}
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-amber-600 to-[#D4AF37] hover:from-amber-500 hover:to-yellow-400 text-white font-serif tracking-widest font-bold uppercase text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4.5 h-4.5" />
                        Check Verification Status
                      </>
                    )}
                  </button>

                  {/* Resend option with timer */}
                  <button
                    onClick={handleResendVerification}
                    disabled={resendTimer > 0 || isSubmitting}
                    className={`w-full h-11 border rounded-xl font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      resendTimer > 0 
                        ? "bg-white/[0.01] border-white/5 text-zinc-500 cursor-not-allowed"
                        : "bg-[#1A1F4B] hover:bg-[#252b6b] border-white/10 text-white cursor-pointer"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {resendTimer > 0 ? `Resend link (${resendTimer}s)` : "Resend verification link"}
                  </button>
                </div>

                {/* Logout out of invalid session */}
                <div className="text-center pt-2">
                  <button
                    onClick={async () => {
                      await logout();
                      setMode("signin");
                    }}
                    className="text-xs font-mono text-zinc-400 hover:text-red-400 hover:underline cursor-pointer"
                  >
                    Logout & Use Another Email
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
      
    </div>
  );
}
