import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BorderGlow } from '../reactbits/BorderGlow';
import type { ScheduleEvent } from '../../types';
import { Calendar, Clock, MapPin, Sparkles, Bell, CheckCircle2 } from 'lucide-react';

interface ScheduleSectionProps {
  events: ScheduleEvent[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ events }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'jumat_rutin' | 'ibadah_pagi'>('all');
  const [reminded, setReminded] = useState(false);

  const filteredEvents = events.filter((e) => {
    if (selectedFilter === 'all') return true;
    return e.type === selectedFilter;
  });

  const nextEvent = events.find((e) => e.status === 'upcoming') || events[0];

  const handleReminder = () => {
    setReminded(true);
    setTimeout(() => setReminded(false), 3000);
  };

  return (
    <section id="jadwal" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ibadah & Kegiatan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Jadwal Ibadah Rohkris 64
          </h2>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            Mari bersekutu dan bertumbuh bersama setiap hari Jumat dan ikuti kegiatan rohani lainnya di SMKN 64 Jakarta.
          </p>
        </motion.div>

        {/* Featured Upcoming Service Banner */}
        {nextEvent && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -3 }}
          >
            <BorderGlow
              glowColor="rgba(251, 191, 36, 0.45)"
              borderRadius="1.5rem"
              className="shadow-2xl shadow-amber-500/10"
            >
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 flex items-center gap-1.5 shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      IBADAH MENDATANG
                    </span>
                    <span className="text-xs text-amber-300/90 font-semibold">{nextEvent.date}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReminder}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
                  >
                    {reminded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Pengingat Disetel!</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ingatkan Saya</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-white font-['Outfit'] tracking-tight">
                    {nextEvent.title}
                  </h3>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-stone-400 font-semibold uppercase">Waktu</div>
                      <div className="text-xs md:text-sm font-bold text-white mt-0.5">{nextEvent.time}</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-stone-400 font-semibold uppercase">Tempat</div>
                      <div className="text-xs md:text-sm font-bold text-white mt-0.5">{nextEvent.location}</div>
                    </div>
                  </div>
                </div>

                {nextEvent.notes && (
                  <div className="text-xs text-stone-400 border-t border-stone-800/80 pt-3 flex items-center gap-2">
                    <span className="font-semibold text-amber-400">Catatan:</span>
                    <span>{nextEvent.notes}</span>
                  </div>
                )}
              </div>
            </BorderGlow>
          </motion.div>
        )}

        {/* Schedule Filter & List */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-400">Filter Jadwal:</span>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800">
                {[
                  { id: 'all', label: 'Semua' },
                  { id: 'ibadah_pagi', label: 'Ibadah Pagi (Selasa-Kamis)' },
                  { id: 'jumat_rutin', label: 'Kebaktian Bulanan (Jumat)' },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedFilter(tab.id as any)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedFilter === tab.id
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="h-full"
              >
                <BorderGlow
                  glowColor="rgba(245, 158, 11, 0.3)"
                  borderRadius="1rem"
                  className="h-full"
                >
                  <div className="p-5 flex flex-col justify-between h-full space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
                        <span>{event.date}</span>
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px]">
                          {event.time}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white font-['Outfit'] mt-1">{event.title}</h4>
                    </div>

                    <div className="pt-3 border-t border-stone-800/80 text-xs text-stone-400 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
