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
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#343831]/90 border border-[#c5de9b]/40 text-[#c5de9b] text-xs font-semibold backdrop-blur-md">
              <BookOpen className="w-3.5 h-3.5 text-[#c5de9b]" />
              <span>Kolose 2:6-7</span>
            </div>
          </div>

          {/* Center / Bottom Content */}
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#c5de9b] to-[#8c6a49] shrink-0 shadow-lg">
                <img
                  src="/logo.png"
                  alt="Logo Rohkris 64"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-2xl md:text-4xl font-bold text-white font-['Outfit'] tracking-tight">
                  Satu Hati, Satu Kasih di SMKN 64
                </h3>
                <p className="text-xs md:text-sm text-[#c5de9b] font-medium">
                  Wadah pembinaan karakter Kristus bagi siswa-siswi SMK Negeri 64 Jakarta
                </p>
              </div>
            </div>

            <p className="text-stone-200 text-xs md:text-base leading-relaxed line-clamp-3 md:line-clamp-none drop-shadow">
              "Hendaklah kamu berakar di dalam Dia dan dibangun di atas Dia, hendaklah kamu bertambah teguh dalam iman yang telah diajarkan kepadamu, dan hendaklah hatimu melimpah dengan ucapan syukur."
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#jadwal"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c5de9b] hover:bg-[#b8d488] text-[#282828] font-bold text-xs border border-[#343831] shadow-md transition-all cursor-pointer"
              >
                <span>Lihat Agenda Ibadah</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#kotak-doa"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#fdfdf5]/90 hover:bg-[#fdfdf5] text-[#282828] font-semibold text-xs border border-[#343831] backdrop-blur-md transition-all cursor-pointer shadow-xs"
              >
                <HeartHandshake className="w-4 h-4 text-[#8c6a49]" />
                <span>Kirim Permintaan Doa</span>
              </a>
            </div>
          </div>
        </div>
      </ScrollExpand>
    </section>
  );
};
