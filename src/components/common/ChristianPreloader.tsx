import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ChristianPreloaderProps {
  onComplete?: () => void;
  minDuration?: number; // minimum display duration in ms
}

const BLESSING_STAGES = [
  { progress: 20, label: 'Mempersiapkan Bait & Hati...' },
  { progress: 48, label: 'Menyalakan Pelita & Terang Kasih...' },
  { progress: 78, label: 'Mempersiapkan Persekutuan Rohkris 64...' },
  { progress: 100, label: 'Kasih Karunia dan Damai Sejahtera Menyertai Kamu ✦' },
];

const BIBLE_VERSES = [
  {
    verse: 'Akulah terang dunia; barangsiapa mengikut Aku, ia tidak akan berjalan dalam kegelapan, melainkan ia akan mempunyai terang hidup.',
    ref: 'Yohanes 8:12',
  },
  {
    verse: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',
    ref: 'Filipi 4:13',
  },
  {
    verse: 'Sebab di mana dua atau tiga orang berkumpul dalam Nama-Ku, di situ Aku ada di tengah-tengah mereka.',
    ref: 'Matius 18:20',
  },
  {
    verse: 'Tuhan adalah gembalaku, takkan kekurangan aku.',
    ref: 'Mazmur 23:1',
  },
];

export const ChristianPreloader: React.FC<ChristianPreloaderProps> = ({
  onComplete,
  minDuration = 2200,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [verseIndex] = useState(() => Math.floor(Math.random() * BIBLE_VERSES.length));

  useEffect(() => {
    // Disable scroll while preloader is active
    document.body.style.overflow = 'hidden';

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFinished(true);
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 350);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [minDuration, onComplete]);

  // Current stage description
  const currentStage =
    BLESSING_STAGES.find((s) => progress <= s.progress)?.label ||
    BLESSING_STAGES[BLESSING_STAGES.length - 1].label;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="christian-preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: '-100%',
            opacity: 0.95,
            transition: {
              duration: 0.85,
              ease: [0.77, 0, 0.175, 1],
            },
          }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#f4f0e6] text-[#181d18] px-4 select-none overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]"
        >
          {/* 1. Divine Background Glow & Rotating Sunrays */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Soft Ambient Golden Halo */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.45, 0.75, 0.45],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full bg-gradient-to-tr from-[#ffd269]/40 via-[#fde047]/30 to-amber-200/40 blur-3xl"
            />

            {/* Subtle Sunray Beams */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] opacity-25"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <g fill="#d97706" opacity="0.4">
                  {[...Array(12)].map((_, i) => (
                    <polygon
                      key={i}
                      points="100,100 96,0 104,0"
                      transform={`rotate(${i * 30} 100 100)`}
                    />
                  ))}
                </g>
              </svg>
            </motion.div>
          </div>

          {/* 2. Floating Holy Sparkles Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
                  y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  y: -50,
                  opacity: [0, 0.8, 0],
                  scale: [0.6, 1.2, 0.4],
                  x: `+=${(i % 2 === 0 ? 1 : -1) * 35}`,
                }}
                transition={{
                  duration: 3.5 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.35,
                  ease: 'easeOut',
                }}
                className="absolute text-amber-500/60"
              >
                ✦
              </motion.div>
            ))}
          </div>

          {/* 3. Main Centerpiece: The Sacred Cross & Holy Dove */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full space-y-6">
            {/* Top Emblem Pill */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-[2.5px] border-[#181d18] shadow-[3px_3px_0px_#181d18] text-[11px] font-black tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
              <span>Rohkris SMKN 64 Jakarta</span>
              <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
            </motion.div>

            {/* Sacred Cross Artwork with Hover & Glow */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -6, 0],
              }}
              transition={{
                scale: { duration: 0.6, ease: 'easeOut' },
                opacity: { duration: 0.6 },
                y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative my-2"
            >
              {/* Golden Outer Glow Aura */}
              <div className="absolute inset-0 rounded-full bg-[#ffd269] filter blur-xl opacity-60 scale-125 pointer-events-none" />

              {/* The SVG Cross */}
              <svg
                width="140"
                height="180"
                viewBox="0 0 140 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 drop-shadow-[5px_5px_0px_#181d18]"
              >
                <defs>
                  {/* Radiant Gold Linear Gradient */}
                  <linearGradient id="crossGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff3b0" />
                    <stop offset="35%" stopColor="#ffd269" />
                    <stop offset="70%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  {/* Shimmer Overlay */}
                  <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Cross Shadow & Background Frame */}
                {/* Vertical Bar */}
                <rect
                  x="52"
                  y="12"
                  width="36"
                  height="156"
                  rx="10"
                  fill="url(#crossGold)"
                  stroke="#181d18"
                  strokeWidth="3.5"
                />

                {/* Horizontal Bar */}
                <rect
                  x="12"
                  y="48"
                  width="116"
                  height="36"
                  rx="10"
                  fill="url(#crossGold)"
                  stroke="#181d18"
                  strokeWidth="3.5"
                />

                {/* Inner Cross Inset Carving */}
                <rect
                  x="58"
                  y="18"
                  width="24"
                  height="144"
                  rx="6"
                  fill="#ffffff"
                  fillOpacity="0.3"
                />
                <rect
                  x="18"
                  y="54"
                  width="104"
                  height="24"
                  rx="6"
                  fill="#ffffff"
                  fillOpacity="0.3"
                />

                {/* Center Sacred Heart / Star of Bethlehem Embellishment */}
                <circle
                  cx="70"
                  cy="66"
                  r="16"
                  fill="#ffffff"
                  stroke="#181d18"
                  strokeWidth="3"
                />
                <circle
                  cx="70"
                  cy="66"
                  r="11"
                  fill="#ffd269"
                />
                {/* 8-Point Holy Sparkle Star */}
                <path
                  d="M70 57 L72.5 63.5 L79 66 L72.5 68.5 L70 75 L67.5 68.5 L61 66 L67.5 63.5 Z"
                  fill="#181d18"
                />

                {/* Descending Holy Dove Silhouette at the top */}
                <g transform="translate(48, -4)">
                  {/* Dove Body */}
                  <path
                    d="M22 6 C28 2, 38 4, 42 10 C36 12, 30 14, 26 12 C24 16, 20 22, 14 24 C16 19, 15 15, 12 13 C6 14, 1 12, 0 8 C6 9, 12 9, 16 8 C18 4, 19 2, 22 6 Z"
                    fill="#ffffff"
                    stroke="#181d18"
                    strokeWidth="2.5"
                  />
                  {/* Olive leaf in beak */}
                  <circle cx="43" cy="11" r="2" fill="#84cc16" />
                </g>
              </svg>
            </motion.div>

            {/* Motto & Theme */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] tracking-tight text-[#181d18]">
                Bertumbuh, Berakar, & Berbuah
              </h2>
              <p className="text-xs text-[#555] font-semibold tracking-wide">
                Persekutuan Siswa-Siswi Kristen SMKN 64 Jakarta
              </p>
            </div>

            {/* 4. Progress Bar & Real-time Indicator */}
            <div className="w-full max-w-xs space-y-2 pt-2">
              <div className="relative h-6 rounded-full bg-white border-[2.5px] border-[#181d18] shadow-[3px_3px_0px_#181d18] p-1 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#ffd269] via-[#fde047] to-[#c5de9b] border border-[#181d18]/20"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>

              {/* Progress percentage & dynamic Christian stage note */}
              <div className="flex items-center justify-between text-[11px] font-black text-[#181d18] px-1">
                <span className="truncate pr-2 font-bold text-[#444] text-[10.5px]">
                  {currentStage}
                </span>
                <span className="shrink-0 bg-[#ffd269] px-2 py-0.5 rounded-md border border-[#181d18] shadow-[1px_1px_0px_#181d18]">
                  {progress}%
                </span>
              </div>
            </div>

            {/* 5. Bible Verse Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="p-3.5 rounded-2xl bg-white/90 border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] text-center space-y-1 mt-1 max-w-sm"
            >
              <p className="text-xs italic text-[#282828] font-medium leading-relaxed font-['Cormorant_Garamond',serif]">
                "{BIBLE_VERSES[verseIndex].verse}"
              </p>
              <p className="text-[10px] font-black text-[#d97706] tracking-wider uppercase font-['Outfit']">
                — {BIBLE_VERSES[verseIndex].ref}
              </p>
            </motion.div>

            {/* Skip Button (Bypass for quick access) */}
            <button
              onClick={() => {
                setIsFinished(true);
                document.body.style.overflow = '';
                if (onComplete) onComplete();
              }}
              className="text-[11px] font-black text-[#666] hover:text-[#181d18] underline cursor-pointer pt-1 transition-colors"
            >
              Lewati & Masuk Langsung →
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
