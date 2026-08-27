import React from 'react';
import { Heart, MessageCircle, ArrowUp } from 'lucide-react';

interface FooterProps {}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

export const Footer: React.FC<FooterProps> = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-stone-850 bg-stone-950/90 pt-16 pb-12 px-4 z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 via-sky-400 to-amber-500 shadow-lg shrink-0">
                <img
                  src="/logo.png"
                  alt="Logo Rohkris SMKN 64 Jakarta"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg font-['Outfit']">ROHKRIS SMKN 64</h3>
                <p className="text-xs text-stone-400">Persekutuan Rohani Kristen SMKN 64 Jakarta</p>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              "Hendaklah kamu berakar di dalam Dia dan dibangun di atas Dia, hendaklah kamu bertambah teguh dalam iman." (Kolose 2:7)
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/rohkris_smkn64?igsi=M25xZXF4MDh5cWIz"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-stone-900 hover:bg-amber-500 text-stone-300 hover:text-stone-950 border border-stone-800 transition-colors"
                title="Instagram @rohkris_smkn64"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-stone-900 hover:bg-amber-500 text-stone-300 hover:text-stone-950 border border-stone-800 transition-colors"
                title="YouTube Channel"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-stone-900 hover:bg-amber-500 text-stone-300 hover:text-stone-950 border border-stone-800 transition-colors"
                title="WhatsApp Hubungan Pengurus"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Navigasi Cepat</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-400">
              <a href="#beranda" className="hover:text-amber-300 transition-colors">Beranda</a>
              <a href="#jadwal" className="hover:text-amber-300 transition-colors">Jadwal Ibadah</a>
              <a href="#galeri" className="hover:text-amber-300 transition-colors">Galeri Foto</a>
              <a href="#pengurus" className="hover:text-amber-300 transition-colors">Struktur Pengurus</a>
              <a href="#kotak-doa" className="hover:text-amber-300 transition-colors">Kotak Doa</a>
              <a href="#lagu" className="hover:text-amber-300 transition-colors">Bank Lagu & Chord</a>
              <a href="#tentang" className="hover:text-amber-300 transition-colors">Tentang Kami</a>
            </div>
          </div>

          {/* Scroll Top & Info */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Rohkris 64</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bertumbuh dalam iman, berakar dalam kasih Kristus, dan berbuah bagi sesama.
            </p>

            <button
              onClick={scrollToTop}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
            >
              <ArrowUp className="w-4 h-4 text-amber-400" />
              <span>Kembali ke Atas</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Rohkris SMKN 64 Jakarta. Dibuat dengan kasih & dedikasi pelayanan.</p>
          <div className="flex items-center gap-1">
            <span>Soli Deo Gloria</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
