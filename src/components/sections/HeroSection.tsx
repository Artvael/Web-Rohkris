import React, { useEffect, useRef } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2,
    },
  },
};

const badgeVariant: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: -12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const headlineVariant: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const lineVariant: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const textVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const buttonVariant: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

export const HeroSection: React.FC = () => {
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    if (!v1 || !v2) return;

    let currentVideo = v1;
    let nextVideo = v2;
    let isTransitioning = false;
    let animationFrameId: number;

    v1.playbackRate = 0.5;
    v2.playbackRate = 0.5;

    v1.play().catch((e) => console.log('Autoplay prevented', e));

    const loopEngine = () => {
      if (!currentVideo.duration || isTransitioning) {
        animationFrameId = requestAnimationFrame(loopEngine);
        return;
      }

      const remainingRealTime =
        (currentVideo.duration - currentVideo.currentTime) /
        currentVideo.playbackRate;

      if (remainingRealTime <= 2.0 && currentVideo.currentTime > 0) {
        isTransitioning = true;
        nextVideo.currentTime = 0;
        nextVideo.playbackRate = 0.5;
        nextVideo.play()
          .then(() => {
            nextVideo.style.opacity = '1';
            currentVideo.style.opacity = '0';

            setTimeout(() => {
              currentVideo.pause();
              currentVideo.currentTime = 0;
              const temp = currentVideo;
              currentVideo = nextVideo;
              nextVideo = temp;
              isTransitioning = false;
            }, 2000);
          })
          .catch((e) => {
            console.log('Play failed on crossfade', e);
            isTransitioning = false;
          });
      }

      animationFrameId = requestAnimationFrame(loopEngine);
    };

    v1.addEventListener('loadedmetadata', () => {
      animationFrameId = requestAnimationFrame(loopEngine);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      id="beranda"
      className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden text-emerald-950 font-sans"
    >
      {/* Dual Video Background Engine */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-stone-100 pointer-events-none">
        <video
          ref={v1Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          muted
          playsInline
          loop
          preload="auto"
          style={{ opacity: 1 }}
        >
          <source
            src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/nature_peace.mp4"
            type="video/mp4"
          />
        </video>
        <video
          ref={v2Ref}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
          muted
          playsInline
          loop
          preload="auto"
          style={{ opacity: 0 }}
        >
          <source
            src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/nature_peace.mp4"
            type="video/mp4"
          />
        </video>
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-transparent mix-blend-screen" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Main Hero Content with Staggered Entrance */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 my-auto py-12 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto space-y-6 flex flex-col items-center"
        >
          {/* Sub-tagline badge with spring reveal */}
          <motion.div
            variants={badgeVariant}
            className="flex items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-emerald-950/10 backdrop-blur-md border border-emerald-900/20 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-700 animate-ping"></div>
            <span className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-emerald-900">
              Bertumbuh • Berakar • Berbuah
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={headlineVariant}
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight text-emerald-950 text-center"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            Rohkris <br />
            <span className="italic font-normal">SMKN 64 Jakarta</span>
          </motion.h1>

          {/* Accent Line & Subtitle */}
          <div className="pt-2 flex flex-col items-center w-full">
            <motion.div
              variants={lineVariant}
              className="w-20 h-[2px] bg-gradient-to-r from-transparent via-emerald-800/50 to-transparent mb-6 mx-auto origin-center"
            ></motion.div>
            <motion.p
              variants={textVariant}
              className="text-base sm:text-lg text-emerald-900/90 font-medium leading-relaxed max-w-xl text-center"
            >
              Membangun generasi muda yang takut akan Tuhan, bertumbuh bersama dalam
              iman, pengharapan, dan kasih di lingkungan SMK Negeri 64 Jakarta.
            </motion.p>
          </div>

          {/* Action Buttons with Micro-interactions */}
          <motion.div
            variants={buttonVariant}
            className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {/* Primary CTA */}
            <motion.a
              href="#jadwal"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-semibold text-white bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/50 shadow-xl shadow-emerald-950/20 transition-colors group cursor-pointer"
            >
              <span>Jadwal Ibadah</span>
              <ArrowRight className="w-4 h-4 text-teal-300 transition-transform duration-300 group-hover:translate-x-1.5" />
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#lagu"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full text-sm font-semibold text-emerald-950 bg-white/80 hover:bg-white border border-emerald-900/20 backdrop-blur-md shadow-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Bank Lagu & Chords</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator with soft floating animation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-8 pt-4 flex flex-col items-center justify-center mt-auto"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-emerald-900">
          SCROLL TO EXPLORE
        </span>
        <div className="w-[1px] h-4 bg-emerald-900/30 my-2"></div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-4 h-6 rounded-full border border-emerald-950/60 flex justify-center pt-1"
        >
          <div className="w-[2px] h-1.5 bg-emerald-950 rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};
