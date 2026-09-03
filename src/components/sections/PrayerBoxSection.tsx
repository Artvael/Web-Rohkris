import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectionBox } from '../common/SelectionBox';
import { usePrayerStore } from '../../hooks/usePrayerStore';
import confetti from 'canvas-confetti';
import { HeartHandshake, Send, Check, Heart, Shield, Sparkles, Tag } from 'lucide-react';
import type { PrayerRequest } from '../../types';

type PrayerTopic = PrayerRequest['topic'];

interface PrayerBoxSectionProps {}

export const PrayerBoxSection: React.FC<PrayerBoxSectionProps> = () => {
  const { prayers, addPrayer, toggleAmen, votedIds } = usePrayerStore();
  const [name, setName] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [topic, setTopic] = useState<PrayerTopic>('Pendidikan & Ujian');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topics: PrayerTopic[] = [
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
      name: isAnonymous ? 'Anonim' : (name.trim() || 'Sahabat Rohkris'),
      classGrade: isAnonymous ? undefined : classGrade.trim(),
      topic,
      content: content.trim(),
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#c5de9b', '#8c6a49', '#efeedc'],
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
    <section id="kotak-doa" className="py-16 md:py-24 px-4 relative z-10 bg-[#fdfdf5]">
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#efeedc] text-[#343831] border border-[#343831]">
            <HeartHandshake className="w-3.5 h-3.5 text-[#8c6a49]" />
            <span>Pelayanan Doa & Syafaat</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#282828] font-['Outfit'] tracking-tight">
            Kotak Doa Interaktif
          </h2>
          <p className="text-[#575a53] text-sm md:text-base leading-relaxed">
            "Sebab di mana dua atau tiga orang berkumpul dalam Nama-Ku, di situ Aku ada di tengah-tengah mereka." — Matius 18:20
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <SelectionBox className="rounded-3xl">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 rounded-3xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-md">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#282828] font-['Outfit'] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8c6a49]" />
                    Kirim Pokok Doa
                  </h3>
                  <p className="text-xs text-[#575a53]">
                    Tim Doa & Pemerhati Rohkris 64 akan mendoakan permohonanmu.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#efeedc] border border-[#e6e3d1]">
                    <div className="flex items-center gap-2 text-xs text-[#282828] font-medium">
                      <Shield className="w-4 h-4 text-[#8c6a49]" />
                      <span>Kirim Secara Anonim / Rahasia</span>
                    </div>
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 accent-[#343831] rounded cursor-pointer"
                    />
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#282828] mb-1">
                          Nama Lengkap / Panggilan
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Misal: Jonathan"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border border-[#e6e3d1] focus:border-[#343831] text-[#282828] text-xs transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#282828] mb-1">
                          Kelas / Jurusan
                        </label>
                        <input
                          type="text"
                          value={classGrade}
                          onChange={(e) => setClassGrade(e.target.value)}
                          placeholder="Misal: XI PPLG 1"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border border-[#e6e3d1] focus:border-[#343831] text-[#282828] text-xs transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#282828] mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#8c6a49]" />
                      Topik Doa
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {topics.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            topic === t
                              ? 'bg-[#c5de9b] text-[#282828] font-bold border border-[#343831] shadow-xs'
                              : 'bg-[#ffffff] text-[#575a53] hover:text-[#282828] border border-[#e6e3d1]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#282828] mb-1">
                      Isi Pokok Doa <span className="text-[#8c6a49]">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Tuliskan permohonan doa, pergumulan studi, keluarga, atau ucapan syukurmu..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border border-[#e6e3d1] focus:border-[#343831] text-[#282828] text-xs leading-relaxed transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-full bg-[#c5de9b] hover:bg-[#b8d488] text-[#282828] font-bold text-sm border border-[#343831] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                      className="p-3 rounded-2xl bg-[#c5de9b]/40 border border-[#3e502c]/30 text-[#3e502c] text-xs font-semibold flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 shrink-0 text-[#3e502c]" />
                      <span>Pokok doa berhasil dikirim! Tim Doa Rohkris 64 akan ikut menopangmu.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </SelectionBox>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#282828] font-['Outfit'] flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#8c6a49]" />
                Dinding Doa Persekutuan
              </h3>
              <span className="text-xs text-[#62665a]">{prayers.length} Pokok Doa Aktif</span>
            </div>

            <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1 no-scrollbar">
              {prayers.map((prayer) => {
                const isAmenVoted = votedIds.includes(prayer.id);

                return (
                  <SelectionBox key={prayer.id} className="rounded-2xl">
                    <div className="p-5 space-y-3 rounded-2xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#efeedc] text-[#8c6a49] border border-[#d6d2bd] flex items-center justify-center text-xs font-bold">
                            {prayer.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#282828] block">
                              {prayer.name}
                            </span>
                            {prayer.classGrade && (
                              <span className="text-[10px] text-[#62665a]">
                                {prayer.classGrade}
                              </span>
                            )}
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#efeedc] text-[#343831] border border-[#e6e3d1]">
                          {prayer.topic}
                        </span>
                      </div>

                      <p className="text-[#3e423a] text-xs md:text-sm leading-relaxed">
                        "{prayer.content}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-[#e6e3d1] text-xs">
                        <span className="text-[11px] text-[#62665a]">{prayer.createdAt}</span>

                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.90 }}
                          onClick={() => toggleAmen(prayer.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isAmenVoted
                              ? 'bg-[#343831] text-[#fdfdf5] shadow-xs'
                              : 'bg-[#efeedc] hover:bg-[#c5de9b] text-[#282828] border border-[#343831]'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isAmenVoted ? 'fill-white text-white' : 'text-[#8c6a49]'
                            }`}
                          />
                          <span>Amen ({prayer.amenCount})</span>
                        </motion.button>
                      </div>
                    </div>
                  </SelectionBox>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
