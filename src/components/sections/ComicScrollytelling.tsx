import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowDown, ArrowRight, Heart, BookOpen, Sun } from 'lucide-react';

interface ComicChapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  narrativeText: string;
  verseCitation: string;
  verseText: string;
  badgeLabel: string;
  stickerText: string;
  imageOrVideoSrc: string;
  isVideo?: boolean;
}

const CHAPTERS: ComicChapter[] = [
  {
    id: 'ch1',
    chapterNumber: 'BABAK 01',
    title: 'Panggilan di SMKN 64',
    subtitle: 'Mencari Ketenangan di Tengah Hiruk Pikuk',
    narrativeText:
      'Di sela kesibukan belajar, tugas praktik kejuruan, dan lorong sekolah yang riuh, ada saat di mana seorang siswa merindukan tempat untuk rehat dan diteguhkan.',
    verseCitation: 'Matius 11:28',
    verseText: '"Marilah kepada-Ku, semua yang letih lesu dan berbeban berat, Aku akan memberi kelegaan kepadamu."',
    badgeLabel: 'PANGGILAN JIWA',
    stickerText: '✦ DAMAI SEJAHTERA',
    imageOrVideoSrc: 'https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/nature_peace.mp4',
    isVideo: true,
  },
  {
    id: 'ch2',
    chapterNumber: 'BABAK 02',
    title: 'Berakar dalam Kasih',
    subtitle: 'Keluarga yang Berdoa & Bertumbuh Bersama',
    narrativeText:
      'Pintu persekutuan terbuka lebar. Di sini tidak ada yang berjalan sendirian. Pujian dinyanyikan, tangan saling bergandengan dalam doa, dan Firman Tuhan menjadi penuntun langkah.',
    verseCitation: 'Kolose 2:6-7',
    verseText: '"Hendaklah kamu berakar di dalam Dia dan dibangun di atas Dia, bertambah teguh dalam iman."',
    badgeLabel: 'SEHATI SEPIKIR',
    stickerText: '★ DOA & PUJIAN',
    imageOrVideoSrc: '/rohkris64-group.jpg',
    isVideo: false,
  },
  {
    id: 'ch3',
    chapterNumber: 'BABAK 03',
    title: 'Berbuah bagi Sesama',
    subtitle: 'Menjadi Garam & Terang di Sekolah',
    narrativeText:
      'Iman yang berakar melahirkan buah nyata: integritas dalam kelas, kepedulian antarteman, dan teladan kasih Kristus yang terpancar di SMK Negeri 64 Jakarta.',
    verseCitation: 'Matius 5:16',
    verseText: '"Demikianlah hendaknya terangmu bercahaya di depan orang, supaya mereka melihat perbuatanmu yang baik."',
    badgeLabel: 'MISI PELAYANAN',
    stickerText: '✦ KASIH KRISTUS',
    imageOrVideoSrc: '/natal-rohkris64.jpg',
    isVideo: false,
  },
];

export const ComicScrollytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Camera Push-in and cinematic zoom across the scrollytelling timeline
  const cameraScale = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [1, 1.04, 1.02, 1.06]);
  const cameraRotate = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, -0.6, 0.6, 0]);

  // Chapter 1 Opacity & Transforms (0.00 - 0.38)
  const ch1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.28, 0.36], [1, 1, 1, 0]);
  const ch1Y = useTransform(scrollYProgress, [0, 0.28, 0.36], [0, 0, -40]);
  const ch1Scale = useTransform(scrollYProgress, [0, 0.28, 0.36], [1, 1, 0.94]);

  // Chapter 2 Opacity & Transforms (0.32 - 0.72)
  const ch2Opacity = useTransform(scrollYProgress, [0.32, 0.4, 0.62, 0.7], [0, 1, 1, 0]);
  const ch2Y = useTransform(scrollYProgress, [0.32, 0.4, 0.62, 0.7], [50, 0, 0, -40]);
  const ch2Scale = useTransform(scrollYProgress, [0.32, 0.4, 0.62, 0.7], [0.94, 1, 1, 0.94]);

  // Chapter 3 Opacity & Transforms (0.66 - 1.00)
  const ch3Opacity = useTransform(scrollYProgress, [0.66, 0.74, 0.95, 1], [0, 1, 1, 1]);
  const ch3Y = useTransform(scrollYProgress, [0.66, 0.74, 1], [50, 0, 0]);
  const ch3Scale = useTransform(scrollYProgress, [0.66, 0.74, 1], [0.94, 1, 1]);

  // Overall scroll progress percentage (0 - 100)
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      ref={containerRef}
      id="kisah-iman"
      className="relative h-[320vh] bg-[#ebe6d8] text-[#282828] border-b border-[#ddd7c7]"
    >
      {/* Sticky Fullscreen Scrollytelling Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-6 md:px-12 z-20">
        
        {/* Top Control Bar: Brand / Title + Skip Button + Progress */}
        <div className="relative z-30 max-w-6xl w-full mx-auto flex items-center justify-between gap-4 pt-12 md:pt-14">
          <div className="flex items-center gap-2.5">
            <div className="px-3 py-1 rounded-full bg-[#181d18] text-[#c5de9b] border border-[#343831] text-xs font-bold tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#c5de9b]" />
              <span>THE FAITH JOURNEY</span>
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-[#62665a]">
              • Komik Interaktif Kisah Rohkris 64
            </span>
          </div>

          {/* Quick Jump / Skip Button for Accessibility */}
          <div className="flex items-center gap-3">
            <a
              href="#jadwal"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-[#282828] bg-[#fbf8f1] hover:bg-[#c5de9b] border border-[#282828] shadow-[2px_2px_0px_#282828] transition-all duration-200 cursor-pointer"
            >
              <span>Lewati Cerita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Dynamic Graphic Novel Camera Stage */}
        <motion.div
          style={{ scale: cameraScale, rotate: cameraRotate }}
          className="relative max-w-5xl w-full mx-auto my-auto flex items-center justify-center will-change-transform z-10"
        >
          {/* ================= CHAPTER 1 PANEL ================= */}
          <motion.div
            style={{
              opacity: ch1Opacity,
              y: ch1Y,
              scale: ch1Scale,
              pointerEvents: scrollYProgress.get() < 0.35 ? 'auto' : 'none',
            }}
            className="absolute inset-0 flex items-center justify-center p-2"
          >
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center bg-[#fbf8f1] p-5 sm:p-7 md:p-8 rounded-3xl border-2 border-[#282828] shadow-[6px_6px_0px_#282828] relative">
              {/* Corner Comic Bounding Handles */}
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#282828]" />

              {/* Media Visual Column (Video Loop) */}
              <div className="md:col-span-6 relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#282828] shadow-[4px_4px_0px_#282828] bg-[#181d18]">
                <video
                  src={CHAPTERS[0].imageOrVideoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Comic Sticker Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#c5de9b] text-[#181d18] border border-[#282828] text-[11px] font-black tracking-wider shadow-[2px_2px_0px_#282828]">
                  {CHAPTERS[0].badgeLabel}
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#fbf8f1] text-[#282828] border border-[#282828] text-[10px] font-bold shadow-[2px_2px_0px_#282828]">
                  {CHAPTERS[0].stickerText}
                </div>
              </div>

              {/* Comic Text Story Column */}
              <div className="md:col-span-6 space-y-4 text-left">
                <div className="inline-block px-3 py-1 rounded-md bg-[#e6ded0] border border-[#282828] text-[11px] font-bold text-[#282828] tracking-widest uppercase">
                  {CHAPTERS[0].chapterNumber}
                </div>

                <h3
                  className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-[#282828]"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  {CHAPTERS[0].title}
                </h3>

                <p className="text-xs sm:text-sm text-[#575a53] leading-relaxed">
                  {CHAPTERS[0].narrativeText}
                </p>

                {/* Comic Speech / Scripture Box */}
                <div className="p-4 rounded-xl bg-[#ebe6d8] border border-[#282828] shadow-[3px_3px_0px_#282828] relative">
                  <div className="flex items-center gap-2 mb-1.5 text-[#8c6a49]">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{CHAPTERS[0].verseCitation}</span>
                  </div>
                  <p className="text-xs italic text-[#282828] font-medium leading-relaxed">
                    {CHAPTERS[0].verseText}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= CHAPTER 2 PANEL ================= */}
          <motion.div
            style={{
              opacity: ch2Opacity,
              y: ch2Y,
              scale: ch2Scale,
              pointerEvents: scrollYProgress.get() >= 0.35 && scrollYProgress.get() < 0.7 ? 'auto' : 'none',
            }}
            className="absolute inset-0 flex items-center justify-center p-2"
          >
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center bg-[#fbf8f1] p-5 sm:p-7 md:p-8 rounded-3xl border-2 border-[#282828] shadow-[6px_6px_0px_#282828] relative">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#282828]" />

              {/* Comic Text Story Column (Left on Chapter 2 for dynamic rhythm) */}
              <div className="order-2 md:order-1 md:col-span-6 space-y-4 text-left">
                <div className="inline-block px-3 py-1 rounded-md bg-[#e6ded0] border border-[#282828] text-[11px] font-bold text-[#282828] tracking-widest uppercase">
                  {CHAPTERS[1].chapterNumber}
                </div>

                <h3
                  className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-[#282828]"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  {CHAPTERS[1].title}
                </h3>

                <p className="text-xs sm:text-sm text-[#575a53] leading-relaxed">
                  {CHAPTERS[1].narrativeText}
                </p>

                {/* Comic Speech / Scripture Box */}
                <div className="p-4 rounded-xl bg-[#ebe6d8] border border-[#282828] shadow-[3px_3px_0px_#282828] relative">
                  <div className="flex items-center gap-2 mb-1.5 text-[#3e502c]">
                    <Heart className="w-4 h-4 text-[#8c6a49]" />
                    <span className="text-xs font-bold uppercase tracking-wider">{CHAPTERS[1].verseCitation}</span>
                  </div>
                  <p className="text-xs italic text-[#282828] font-medium leading-relaxed">
                    {CHAPTERS[1].verseText}
                  </p>
                </div>
              </div>

              {/* Media Visual Column (Photo with Comic Halftone Frame) */}
              <div className="order-1 md:order-2 md:col-span-6 relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#282828] shadow-[4px_4px_0px_#282828] bg-[#181d18]">
                <img
                  src={CHAPTERS[1].imageOrVideoSrc}
                  alt="Persekutuan Rohkris 64"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#c5de9b] text-[#181d18] border border-[#282828] text-[11px] font-black tracking-wider shadow-[2px_2px_0px_#282828]">
                  {CHAPTERS[1].badgeLabel}
                </div>

                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#fbf8f1] text-[#282828] border border-[#282828] text-[10px] font-bold shadow-[2px_2px_0px_#282828]">
                  {CHAPTERS[1].stickerText}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= CHAPTER 3 PANEL ================= */}
          <motion.div
            style={{
              opacity: ch3Opacity,
              y: ch3Y,
              scale: ch3Scale,
              pointerEvents: scrollYProgress.get() >= 0.7 ? 'auto' : 'none',
            }}
            className="absolute inset-0 flex items-center justify-center p-2"
          >
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 items-center bg-[#fbf8f1] p-5 sm:p-7 md:p-8 rounded-3xl border-2 border-[#282828] shadow-[6px_6px_0px_#282828] relative">
              <span className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#282828]" />
              <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#282828]" />

              {/* Media Visual Column */}
              <div className="md:col-span-6 relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border-2 border-[#282828] shadow-[4px_4px_0px_#282828] bg-[#181d18]">
                <img
                  src={CHAPTERS[2].imageOrVideoSrc}
                  alt="Pelayanan Rohkris 64"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#c5de9b] text-[#181d18] border border-[#282828] text-[11px] font-black tracking-wider shadow-[2px_2px_0px_#282828]">
                  {CHAPTERS[2].badgeLabel}
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#fbf8f1] text-[#282828] border border-[#282828] text-[10px] font-bold shadow-[2px_2px_0px_#282828]">
                  {CHAPTERS[2].stickerText}
                </div>
              </div>

              {/* Comic Text Story Column */}
              <div className="md:col-span-6 space-y-4 text-left">
                <div className="inline-block px-3 py-1 rounded-md bg-[#e6ded0] border border-[#282828] text-[11px] font-bold text-[#282828] tracking-widest uppercase">
                  {CHAPTERS[2].chapterNumber}
                </div>

                <h3
                  className="font-serif text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-[#282828]"
                  style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                >
                  {CHAPTERS[2].title}
                </h3>

                <p className="text-xs sm:text-sm text-[#575a53] leading-relaxed">
                  {CHAPTERS[2].narrativeText}
                </p>

                {/* Comic Speech / Scripture Box */}
                <div className="p-4 rounded-xl bg-[#ebe6d8] border border-[#282828] shadow-[3px_3px_0px_#282828] relative">
                  <div className="flex items-center gap-2 mb-1.5 text-[#8c6a49]">
                    <Sun className="w-4 h-4 text-[#8c6a49]" />
                    <span className="text-xs font-bold uppercase tracking-wider">{CHAPTERS[2].verseCitation}</span>
                  </div>
                  <p className="text-xs italic text-[#282828] font-medium leading-relaxed">
                    {CHAPTERS[2].verseText}
                  </p>
                </div>

                {/* Action CTA Button to Continue to Fellowship Schedule */}
                <div className="pt-2">
                  <a
                    href="#jadwal"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-[#181d18] bg-[#c5de9b] hover:bg-[#b8d488] border-2 border-[#282828] shadow-[3px_3px_0px_#282828] transition-all cursor-pointer"
                  >
                    <span>Lanjut ke Agenda & Jadwal</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Interactive Progress Stepper & Scroll Cue */}
        <div className="relative z-30 max-w-6xl w-full mx-auto pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Stepper Dots / Labels */}
          <div className="flex items-center gap-3">
            {CHAPTERS.map((ch, idx) => (
              <div
                key={ch.id}
                className="flex items-center gap-2 text-[11px] font-bold tracking-wider uppercase"
              >
                <span className="px-2.5 py-1 rounded-full border border-[#282828] bg-[#fbf8f1] shadow-[2px_2px_0px_#282828] text-[#282828]">
                  {ch.chapterNumber}
                </span>
                {idx < CHAPTERS.length - 1 && (
                  <span className="text-[#8c6a49] font-bold">→</span>
                )}
              </div>
            ))}
          </div>

          {/* Scrolly Progress Bar Line */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <div className="flex-1 h-2 bg-[#d6cfbe] rounded-full border border-[#282828] overflow-hidden p-0.5">
              <motion.div
                style={{ width: progressBarWidth }}
                className="h-full bg-[#282828] rounded-full"
              />
            </div>
            <span className="text-[10px] font-bold text-[#62665a] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span>Scroll</span>
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
