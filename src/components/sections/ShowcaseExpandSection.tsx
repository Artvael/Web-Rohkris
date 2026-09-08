import React from 'react';
import { ScrollExpand } from '../reactbits/ScrollExpand';
import { HeartHandshake, ArrowRight, BookOpen } from 'lucide-react';

export const ShowcaseExpandSection: React.FC = () => {
  return (
    <section className="relative z-10 py-6">
      <ScrollExpand
        mediaSrc="/rohkris64-group.jpg"
      >
        <div className="flex flex-col justify-between h-full space-y-6">
          {/* Top content */}
          <div className="flex items-center justify-end">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffd269] border-2 border-[#181d18] text-[#181d18] text-xs font-black shadow-[2px_2px_0px_#181d18]">
              <BookOpen className="w-3.5 h-3.5 text-[#181d18]" />
              <span>Kolose 2:6-7</span>
            </div>
          </div>

          {/* Center / Bottom Content */}
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0.5 bg-[#ffffff] border-2 border-[#181d18] shrink-0 shadow-[3px_3px_0px_#181d18]">
                <img
                  src="/logo.png"
                  alt="Logo Rohkris 64"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-2xl md:text-4xl font-black text-white font-['Outfit'] tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Satu Hati, Satu Kasih di SMKN 64
                </h3>
                <p className="text-xs md:text-sm text-[#ffd269] font-black tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Wadah pembinaan karakter Kristus bagi siswa-siswi SMK Negeri 64 Jakarta
                </p>
              </div>
            </div>

            <p className="text-white text-xs md:text-base font-bold leading-relaxed line-clamp-3 md:line-clamp-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
              "Hendaklah kamu berakar di dalam Dia dan dibangun di atas Dia, hendaklah kamu bertambah teguh dalam iman yang telah diajarkan kepadamu, dan hendaklah hatimu melimpah dengan ucapan syukur."
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#jadwal"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffd269] hover:bg-[#fde047] text-[#181d18] font-black text-xs border-2 border-[#181d18] shadow-[4px_4px_0px_#181d18] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <span>Lihat Agenda Ibadah</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#kotak-doa"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ffffff] hover:bg-[#c5de9b] text-[#181d18] font-black text-xs border-2 border-[#181d18] shadow-[4px_4px_0px_#181d18] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <HeartHandshake className="w-4 h-4 text-[#181d18]" />
                <span>Kirim Permintaan Doa</span>
              </a>
            </div>
          </div>
        </div>
      </ScrollExpand>
    </section>
  );
};
