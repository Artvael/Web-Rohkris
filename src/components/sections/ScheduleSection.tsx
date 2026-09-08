import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SelectionBox } from '../common/SelectionBox';
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18]">
            <Calendar className="w-3.5 h-3.5 text-[#181d18]" />
            <span>Ibadah & Kegiatan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#181d18] font-['Outfit'] tracking-tight">
            Jadwal Ibadah Rohkris 64
          </h2>
          <p className="text-[#343831] text-sm md:text-base leading-relaxed font-medium">
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
            <SelectionBox className="rounded-3xl">
              <div className="p-6 md:p-8 rounded-3xl bg-[#ffffff] border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18] space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#181d18]/15 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#181d18] text-[#ffd269] border border-[#181d18] flex items-center gap-1.5 shadow-[2px_2px_0px_#ffd269]">
                      <Sparkles className="w-3.5 h-3.5 text-[#ffd269]" />
                      IBADAH MENDATANG
                    </span>
                    <span className="text-xs text-[#181d18] font-bold bg-[#fef9c3] px-2.5 py-1 rounded-full border border-[#181d18]">{nextEvent.date}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReminder}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black bg-[#ffd269] hover:bg-[#fde047] text-[#181d18] border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                  >
                    {reminded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#181d18]" />
                        <span>Pengingat Disetel!</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-[#181d18]" />
                        <span>Ingatkan Saya</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-[#181d18] font-['Outfit'] tracking-tight">
                    {nextEvent.title}
                  </h3>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-[#fef9c3] border-2 border-[#181d18] flex items-start gap-3 shadow-[3px_3px_0px_#181d18]">
                    <div className="p-2 rounded-xl bg-[#ffffff] border border-[#181d18] text-[#181d18]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#181d18]/70 font-black uppercase tracking-wider">Waktu</div>
                      <div className="text-xs md:text-sm font-black text-[#181d18] mt-0.5">{nextEvent.time}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#dcfce7] border-2 border-[#181d18] flex items-start gap-3 shadow-[3px_3px_0px_#181d18]">
                    <div className="p-2 rounded-xl bg-[#ffffff] border border-[#181d18] text-[#181d18]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] text-[#181d18]/70 font-black uppercase tracking-wider">Tempat</div>
                      <div className="text-xs md:text-sm font-black text-[#181d18] mt-0.5">{nextEvent.location}</div>
                    </div>
                  </div>
                </div>

                {nextEvent.notes && (
                  <div className="text-xs text-[#343831] border-t-2 border-[#181d18]/15 pt-3 flex items-center gap-2 font-medium">
                    <span className="font-bold text-[#181d18] bg-[#fed7aa] px-2 py-0.5 rounded border border-[#181d18]">Catatan:</span>
                    <span>{nextEvent.notes}</span>
                  </div>
                )}
              </div>
            </SelectionBox>
          </motion.div>
        )}

        {/* Schedule Filter & List */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#181d18] uppercase tracking-wider">Filter:</span>
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#ffffff] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18]">
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
                    className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedFilter === tab.id
                        ? 'bg-[#c5de9b] text-[#181d18] border-2 border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18]'
                        : 'text-[#181d18]/70 hover:text-[#181d18]'
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
                whileHover={{ y: -3 }}
                className="h-full"
              >
                <SelectionBox className="h-full rounded-2xl">
                  <div className="p-5 rounded-2xl bg-[#ffffff] border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] hover:shadow-[6px_6px_0px_#181d18] flex flex-col justify-between h-full space-y-3 transition-all">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-[#181d18] bg-[#ffd269] px-2.5 py-0.5 rounded-full border border-[#181d18]">
                          {event.date}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#bae6fd] text-[#181d18] border border-[#181d18] text-[10px] font-bold">
                          {event.time}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-[#181d18] font-['Outfit'] mt-2">{event.title}</h4>
                    </div>

                    <div className="pt-3 border-t-2 border-[#181d18]/10 text-xs text-[#343831] space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <MapPin className="w-3.5 h-3.5 text-[#181d18]" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </SelectionBox>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
