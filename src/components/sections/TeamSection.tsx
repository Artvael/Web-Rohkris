import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptionWheel } from '../reactbits/OptionWheel';
import { SelectionBox } from '../common/SelectionBox';
import { DIVISIONS_DATA, TEAM_MEMBERS_DATA } from '../../data/teamData';
import type { DivisionCategory, TeamMember } from '../../types';
import { Crown, Quote } from 'lucide-react';
import { sanityClient } from '../../sanity/client';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const TeamSection: React.FC = () => {
  const [selectedDivision, setSelectedDivision] = useState<DivisionCategory>('bph');
  const [sanityMembers, setSanityMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "teamMember"] | order(order asc)')
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((m: any) => ({
            id: m._id || m.id,
            name: m.name,
            role: m.role || 'Anggota',
            division: m.division,
            grade: m.grade || '',
            instagram: m.instagram,
            quote: m.quote,
          }));
          setSanityMembers(formatted);
        }
      })
      .catch(console.error);
  }, []);

  const activeDivisionInfo = DIVISIONS_DATA.find((d) => d.id === selectedDivision) || DIVISIONS_DATA[0];
  
  // Use Sanity data if available, otherwise use fallback hardcoded data
  const dataSource = sanityMembers.length > 0 ? sanityMembers : TEAM_MEMBERS_DATA;
  const members = dataSource.filter((m) => m.division === selectedDivision);

  return (
    <section id="pengurus" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#efeedc] text-[#343831] border border-[#343831]">
            <Crown className="w-3.5 h-3.5 text-[#8c6a49]" />
            <span>Pelayan & Kepengurusan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#282828] font-['Outfit'] tracking-tight">
            Struktur Pengurus Rohkris 64
          </h2>
          <p className="text-[#575a53] text-sm md:text-base leading-relaxed">
            Siswa-siswi yang terpanggil untuk melayani dan menjadi saluran berkat bagi seluruh keluarga besar SMKN 64 Jakarta.
          </p>
        </div>

        {/* OptionWheel Component from ReactBits for Switching Divisions */}
        <div className="max-w-xl mx-auto w-full">
          <div className="relative h-44 md:h-52 rounded-3xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-md overflow-hidden p-2">
            <div className="absolute left-4 top-3 text-[10px] uppercase font-bold text-[#8c6a49] tracking-widest pointer-events-none z-20 flex items-center gap-1.5">
              <span>↕ Gulir / Geser untuk Memilih Divisi</span>
            </div>

            {/* Glowing active indicator background in center */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-14 bg-[#c5de9b]/35 border-y border-[#343831]/20 pointer-events-none z-0" />

            <OptionWheel
              items={DIVISIONS_DATA.map((d) => d.name)}
              defaultSelected={0}
              onChange={(index) => {
                if (DIVISIONS_DATA[index]) {
                  setSelectedDivision(DIVISIONS_DATA[index].id as DivisionCategory);
                }
              }}
              textColor="#78716c"
              activeColor="#282828"
              fontSize={1.3}
              spacing={1.6}
              curve={0.9}
              tilt={5}
              inset={50}
              side="left"
              draggable={true}
              className="z-10 font-['Outfit']"
            />
          </div>
        </div>

        {/* Division Details Banner */}
        <motion.div
          key={activeDivisionInfo.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 rounded-2xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-xs max-w-3xl mx-auto text-center space-y-2"
        >
          <h3 className="text-lg font-bold text-[#282828] font-['Outfit']">
            {activeDivisionInfo.name}
          </h3>
          <p className="text-[#575a53] text-xs md:text-sm leading-relaxed max-w-xl mx-auto">
            {activeDivisionInfo.description}
          </p>
        </motion.div>

        {/* Members Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDivision}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {members.map((member) => (
              <SelectionBox key={member.id} className="h-full rounded-2xl">
                <div className="p-6 rounded-2xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-xs flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-4">
                    {/* Member Details */}
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[11px] font-bold text-[#8c6a49] uppercase tracking-wider block">
                          {member.role}
                        </span>
                        <h4 className="text-base font-bold text-[#282828] font-['Outfit'] leading-tight">
                          {member.name}
                        </h4>
                        {member.grade && (
                          <span className="text-xs text-[#62665a] font-medium">
                            {member.grade}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Quote */}
                    {member.quote && (
                      <div className="relative p-3.5 rounded-xl bg-[#ffffff] border border-[#e6e3d1] text-xs text-[#575a53] italic leading-relaxed shadow-xs">
                        <Quote className="w-3.5 h-3.5 text-[#8c6a49]/60 mb-1" />
                        <span>{member.quote}</span>
                      </div>
                    )}
                  </div>

                  {/* Social links */}
                  {member.instagram && (
                    <div className="pt-2 border-t border-[#e6e3d1] flex items-center justify-between text-xs text-[#62665a]">
                      <a
                        href={`https://instagram.com/${member.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[#3e502c] hover:text-[#282828] font-semibold transition-colors"
                      >
                        <InstagramIcon className="w-3.5 h-3.5" />
                        <span>@{member.instagram}</span>
                      </a>
                      <span className="text-[11px] text-[#8c6a49]">Rohkris 64</span>
                    </div>
                  )}
                </div>
              </SelectionBox>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
