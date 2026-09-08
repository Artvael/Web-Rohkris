import React, { useState, useEffect } from 'react';
import { PillNav } from '../reactbits/PillNav';
import { StaggeredMenu } from '../reactbits/StaggeredMenu';
import { Sparkles, Edit3 } from 'lucide-react';
import { useUserCursorName } from '../../hooks/useUserCursorName';

interface NavbarProps {}

const MENU_ITEMS = [
  { label: 'Beranda', link: '#beranda', ariaLabel: 'Menuju Beranda' },
  { label: 'Jadwal', link: '#jadwal', ariaLabel: 'Jadwal Ibadah Rohkris 64' },
  { label: 'Galeri', link: '#galeri', ariaLabel: 'Galeri Foto & Momen' },
  { label: 'Lagu & Chords', link: '#bank-lagu', ariaLabel: 'Kumpulan Lagu Pujian' },
  { label: 'Pengurus', link: '#pengurus', ariaLabel: 'Struktur Kepengurusan' },
  { label: 'Kotak Doa', link: '#kotak-doa', ariaLabel: 'Kirimkan Permohonan Doa' },
  { label: 'Tentang', link: '#tentang', ariaLabel: 'Visi Misi SMKN 64' },
];

const SOCIAL_ITEMS = [
  { label: '✦ Instagram', link: 'https://instagram.com/rohkris_smkn64' },
  { label: '★ YouTube', link: 'https://youtube.com' },
  { label: '✦ Kotak Doa', link: '#kotak-doa' },
];

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const { name: cursorName, setName: setCursorName } = useUserCursorName();

  const handleEditCursorName = (e: React.MouseEvent) => {
    e.stopPropagation();
    const promptValue = window.prompt('Ubah nama pada kursor Anda:', cursorName);
    if (promptValue !== null) {
      setCursorName(promptValue);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavScroll = (href: string) => {
    if (href === '#beranda' || href === '#hero' || href === '#top' || href === '/') {
      if ((window as any).__lenis) {
        (window as any).__lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const el = document.querySelector(href);
      if ((window as any).__lenis && el) {
        (window as any).__lenis.scrollTo(href);
      } else if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'Beranda', href: '#beranda', onClick: () => handleNavScroll('#beranda') },
    { label: 'Jadwal', href: '#jadwal', onClick: () => handleNavScroll('#jadwal') },
    { label: 'Galeri', href: '#galeri', onClick: () => handleNavScroll('#galeri') },
    { label: 'Lagu', href: '#bank-lagu', onClick: () => handleNavScroll('#bank-lagu') },
    { label: 'Divisi', href: '#pengurus', onClick: () => handleNavScroll('#pengurus') },
    { label: 'Kotak Doa', href: '#kotak-doa', onClick: () => handleNavScroll('#kotak-doa') },
  ];

  return (
    <>
      {/* StaggeredMenu Drawer (Doodle & Toon Figma Edition) */}
      <StaggeredMenu
        position="right"
        items={MENU_ITEMS}
        socialItems={SOCIAL_ITEMS}
        displaySocials={true}
        displayItemNumbering={true}
        colors={['#ffd269', '#c5de9b', '#343831']}
        accentColor="#c5de9b"
        menuButtonColor="#181d18"
        openMenuButtonColor="#181d18"
        changeMenuColorOnOpen={false}
        isFixed={true}
      />

      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
        {/* Top Announcement Banner (Toon Neobrutalist Ticker) */}
        <div className="bg-[#ffd269] text-[#181d18] text-center py-1.5 px-4 text-xs font-black tracking-wider flex items-center justify-center gap-2 border-b-2.5 border-[#181d18] shadow-[0px_2px_0px_#181d18] pointer-events-auto select-none">
          <Sparkles className="w-3.5 h-3.5 text-[#181d18] animate-spin" style={{ animationDuration: '6s' }} />
          <span className="truncate">✦ PERSEKUTUAN ROHANI KRISTEN SMKN 64 JAKARTA • BERTUMBUH, BERAKAR, & BERBUAH ✦</span>
          <Sparkles className="w-3.5 h-3.5 text-[#181d18] animate-spin" style={{ animationDuration: '6s' }} />

          <button
            onClick={handleEditCursorName}
            title="Klik untuk mengubah nama di label kursor Anda"
            className="hidden md:inline-flex items-center gap-1.5 ml-2.5 px-2.5 py-0.5 rounded-full bg-[#F39C2A] text-white text-[11px] font-bold border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <span>🏷️ {cursorName}</span>
            <Edit3 className="w-2.5 h-2.5 text-white opacity-90" />
          </button>
        </div>

        {/* Floating Toon Figma Toolbar Container */}
        <div 
          className={`flex justify-center py-3 px-4 transition-all duration-300 ${
            scrolled ? 'backdrop-blur-md bg-[#f4f0e6]/80' : ''
          }`}
        >
          <div className="relative border-[2.5px] border-[#181d18] rounded-full shadow-[4px_4px_0px_#181d18] bg-[#ffffff] p-1 pointer-events-auto transition-transform hover:scale-[1.01]">
            {/* Figma Selection Handles on Toolbar */}
            <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#181d18] rounded-xs shadow-[1px_1px_0px_#181d18]" />
            <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border border-[#181d18] rounded-xs shadow-[1px_1px_0px_#181d18]" />
            <span className="absolute left-1/2 -top-1.5 -translate-x-1/2 w-2.5 h-2.5 bg-white border border-[#181d18] rounded-xs shadow-[1px_1px_0px_#181d18]" />
            <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-2.5 h-2.5 bg-white border border-[#181d18] rounded-xs shadow-[1px_1px_0px_#181d18]" />

            <PillNav
              logo="/logo.png"
              logoAlt="Rohkris 64"
              items={navItems}
              baseColor="#ffffff"
              pillColor="#ffd269"
              pillTextColor="#181d18"
              hoveredPillTextColor="#181d18"
            />
          </div>
        </div>
      </header>
    </>
  );
};
