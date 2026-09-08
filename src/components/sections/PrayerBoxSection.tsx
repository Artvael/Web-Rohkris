import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectionBox } from '../common/SelectionBox';
import { usePrayerStore } from '../../hooks/usePrayerStore';
import confetti from 'canvas-confetti';
import { HeartHandshake, Send, Check, Heart, Shield, Sparkles, Tag, Trash2 } from 'lucide-react';
import type { PrayerRequest } from '../../types';

type PrayerTopic = PrayerRequest['topic'];

interface PrayerBoxSectionProps {}

export const PrayerBoxSection: React.FC<PrayerBoxSectionProps> = () => {
  const { prayers, addPrayer, toggleAmen, votedIds, deletePrayer } = usePrayerStore();
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

  const handleDeletePrayer = (id: string, authorName: string) => {
    if (window.confirm(`Hapus pokok doa dari "${authorName}"?`)) {
      deletePrayer(id);
    }
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18]">
            <HeartHandshake className="w-3.5 h-3.5 text-[#181d18]" />
            <span>Pelayanan Doa & Syafaat</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#181d18] font-['Outfit'] tracking-tight">
            Kotak Doa Interaktif
          </h2>
          <p className="text-[#343831] text-sm md:text-base leading-relaxed font-medium">
            "Sebab di mana dua atau tiga orang berkumpul dalam Nama-Ku, di situ Aku ada di tengah-tengah mereka." — Matius 18:20
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <SelectionBox className="rounded-3xl">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5 rounded-3xl bg-[#ffffff] border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18]">
                <div className="space-y-1 border-b-2 border-[#181d18]/10 pb-3">
                  <h3 className="text-xl font-black text-[#181d18] font-['Outfit'] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#181d18]" />
                    Kirim Pokok Doa
                  </h3>
                  <p className="text-xs text-[#343831] font-medium">
                    Tim Doa & Pemerhati Rohkris 64 akan mendoakan permohonanmu.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fef9c3] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]">
                    <div className="flex items-center gap-2 text-xs text-[#181d18] font-bold">
                      <Shield className="w-4 h-4 text-[#181d18]" />
                      <span>Kirim Secara Anonim / Rahasia</span>
                    </div>
                    <input
                      type="checkbox"
                      id="anonCheck"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 accent-[#181d18] rounded cursor-pointer"
                    />
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black text-[#181d18] mb-1">
                          Nama Lengkap / Panggilan
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Misal: Jonathan"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border-2 border-[#181d18] focus:shadow-[3px_3px_0px_#181d18] text-[#181d18] font-bold text-xs transition-all outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-[#181d18] mb-1">
                          Kelas / Jurusan
                        </label>
                        <input
                          type="text"
                          value={classGrade}
                          onChange={(e) => setClassGrade(e.target.value)}
                          placeholder="Misal: XI PPLG 1"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border-2 border-[#181d18] focus:shadow-[3px_3px_0px_#181d18] text-[#181d18] font-bold text-xs transition-all outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-black text-[#181d18] mb-1.5 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-[#181d18]" />
                      Topik Doa
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {topics.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTopic(t)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            topic === t
                              ? 'bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]'
                              : 'bg-[#ffffff] text-[#181d18]/70 hover:text-[#181d18] border border-[#181d18] hover:bg-[#fef9c3]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#181d18] mb-1">
                      Isi Pokok Doa <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Tuliskan permohonan doa, pergumulan studi, keluarga, atau ucapan syukurmu..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border-2 border-[#181d18] focus:shadow-[3px_3px_0px_#181d18] text-[#181d18] font-medium text-xs leading-relaxed transition-all outline-none resize-none"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-full bg-[#c5de9b] hover:bg-[#b8d488] text-[#181d18] font-black text-sm border-2 border-[#181d18] shadow-[4px_4px_0px_#181d18] flex items-center justify-center gap-2 transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
                      className="p-3 rounded-2xl bg-[#c5de9b] border-2 border-[#181d18] text-[#181d18] text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_#181d18]"
                    >
                      <Check className="w-4 h-4 shrink-0 text-[#181d18]" />
                      <span>Pokok doa berhasil dikirim! Tim Doa Rohkris 64 akan ikut menopangmu.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </SelectionBox>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#181d18] font-['Outfit'] flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                Dinding Doa Persekutuan
              </h3>
              <span className="text-xs font-black bg-[#fed7aa] text-[#181d18] px-2.5 py-1 rounded-full border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18]">
                {prayers.length} Pokok Doa Aktif
              </span>
            </div>

            <div className="space-y-3.5 max-h-[560px] overflow-y-auto pr-1 no-scrollbar">
              {prayers.map((prayer) => {
                const isAmenVoted = votedIds.includes(prayer.id);

                return (
                  <SelectionBox key={prayer.id} className="rounded-2xl">
                    <div className="p-5 space-y-3 rounded-2xl bg-[#ffffff] border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] hover:shadow-[6px_6px_0px_#181d18] transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] flex items-center justify-center text-xs font-black shadow-[1px_1px_0px_#181d18]">
                            {prayer.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-black text-[#181d18] block">
                              {prayer.name}
                            </span>
                            {prayer.classGrade && (
                              <span className="text-[10px] text-[#343831] font-bold">
                                {prayer.classGrade}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#fef9c3] text-[#181d18] border border-[#181d18]">
                            {prayer.topic}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeletePrayer(prayer.id, prayer.name)}
                            title="Hapus pokok doa ini"
                            className="p-1 rounded-md text-[#181d18]/50 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[#181d18] text-xs md:text-sm leading-relaxed font-medium">
                        "{prayer.content}"
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t-2 border-[#181d18]/10 text-xs">
                        <span className="text-[11px] text-[#343831] font-bold">{prayer.createdAt}</span>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => toggleAmen(prayer.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                            isAmenVoted
                              ? 'bg-[#181d18] text-[#ffd269] border-2 border-[#181d18] shadow-[2px_2px_0px_#ffd269]'
                              : 'bg-[#ffd269] hover:bg-[#fde047] text-[#181d18] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]'
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isAmenVoted ? 'fill-[#ffd269] text-[#ffd269]' : 'fill-red-500 text-red-500'
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
