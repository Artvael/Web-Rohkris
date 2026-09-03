import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderGlow } from '../reactbits/BorderGlow';
import { usePrayerStore } from '../../hooks/usePrayerStore';
import confetti from 'canvas-confetti';
import { HeartHandshake, Send, Check, Heart, Shield, Sparkles, Tag } from 'lucide-react';
import type { PrayerRequest } from '../../types';

export const PrayerBoxSection: React.FC = () => {
  const { prayers, votedIds, addPrayer, toggleAmen } = usePrayerStore();

  const [name, setName] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [topic, setTopic] = useState<PrayerRequest['topic']>('Pendidikan & Ujian');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topics: PrayerRequest['topic'][] = [
    'Pendidikan & Ujian',
    'Keluarga',
    'Kesehatan',
    'Pertumbuhan Rohani',
    'Pribadi',
    'Lainnya',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addPrayer({
      name: isAnonymous || !name.trim() ? 'Anonim (Siswa SMKN 64)' : name.trim(),
      classGrade: classGrade.trim() || undefined,
      topic,
      content: content.trim(),
    });

    // Trigger celebratory spiritual confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#fbbf24', '#fde68a', '#ffffff'],
    });

    setSubmitted(true);
    setName('');
    setClassGrade('');
    setContent('');
    setIsAnonymous(false);

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <section id="kotak-doa" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Pelayanan Doa & Syafaat</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Kotak Doa Interaktif
          </h2>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            "Sebab di mana dua atau tiga orang berkumpul dalam Nama-Ku, di situ Aku ada di tengah-tengah mereka." — Matius 18:20
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form */}
          <div className="lg:col-span-5">
            <BorderGlow
              glowColor="rgba(244, 63, 94, 0.35)"
              borderRadius="1.5rem"
              className="shadow-2xl shadow-rose-500/10"
            >
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Kirim Pokok Doa
                  </h3>
                  <p className="text-xs text-stone-400">
                    Tim Doa & Pemerhati Rohkris 64 akan mendoakan permohonanmu.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Anonymous Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                    <div className="flex items-center gap-2 text-xs text-stone-300">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Kirim Secara Anonim / Rahasia</span>
                    </div>
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Nama Lengkap / Panggilan
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Misal: Jonathan"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-stone-100 text-xs transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Kelas / Jurusan
                        </label>
                        <input
                          type="text"
                          value={classGrade}
                          onChange={(e) => setClassGrade(e.target.value)}
                          placeholder="Misal: XI PPLG 1"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-stone-100 text-xs transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Topic selection */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-400" />
                      Topik Doa
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {topics.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            topic === t
                              ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                              : 'bg-stone-950/80 text-stone-400 hover:text-stone-200 border border-stone-800'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prayer Content */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Isi Pokok Doa <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Tuliskan permohonan doa, pergumulan studi, keluarga, atau ucapan syukurmu..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-stone-100 text-xs leading-relaxed transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirimkan Pokok Doa</span>
                </motion.button>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Pokok doa berhasil dikirim! Tim Doa Rohkris 64 akan ikut menopangmu.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </BorderGlow>
          </div>

          {/* Live Prayer Wall */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Dinding Doa Persekutuan
              </h3>
              <span className="text-xs text-stone-400">{prayers.length} Pokok Doa Aktif</span>
            </div>

            <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1 no-scrollbar">
              {prayers.map((prayer) => {
                const isAmenVoted = votedIds.includes(prayer.id);

                return (
                  <BorderGlow
                    key={prayer.id}
                    glowColor="rgba(245, 158, 11, 0.25)"
                    borderRadius="1rem"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-bold">
                            {prayer.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {prayer.name}
                            </span>
                            {prayer.classGrade && (
                              <span className="text-[10px] text-stone-400">
                                {prayer.classGrade}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-800 text-amber-300 border border-stone-700">
                          {prayer.topic}
                        </span>
                      </div>

                      <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
                        "{prayer.content}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/70 text-xs">
                        <span className="text-[11px] text-stone-500">{prayer.createdAt}</span>

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.90 }}
                          onClick={() => toggleAmen(prayer.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isAmenVoted
                              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                              : 'bg-stone-800/80 hover:bg-stone-700 text-rose-300 border border-stone-700'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isAmenVoted ? 'fill-white' : 'text-rose-400'
                            }`}
                          />
                          <span>Amen ({prayer.amenCount})</span>
                        </motion.button>
                      </div>
                    </div>
                  </BorderGlow>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
