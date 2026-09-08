import React, { useState, useEffect } from 'react';
import { PillNav } from '../reactbits/PillNav';
import { StaggeredMenu } from '../reactbits/StaggeredMenu';
import { Sparkles } from 'lucide-react';

interface NavbarProps {}

const MENU_ITEMS = [
  { label: 'Beranda', link: '#hero', ariaLabel: 'Menuju Beranda' },
  { label: 'Jadwal', link: '#jadwal', ariaLabel: 'Jadwal Ibadah Rohkris 64' },
  { label: 'Galeri', link: '#galeri', ariaLabel: 'Galeri Foto & Momen' },
  { label: 'Lagu & Chords', link: '#bank-lagu', ariaLabel: 'Kumpulan Lagu Pujian' },
  { label: 'Pengurus', link: '#pengurus', ariaLabel: 'Struktur Kepengurusan' },
  { label: 'Kotak Doa', link: '#kotak-doa', ariaLabel: 'Kirimkan Permohonan Doa' },
  { label: 'Tentang', link: '#tentang-kami', ariaLabel: 'Visi Misi SMKN 64' },
];

const SOCIAL_ITEMS = [
  { label: '✦ Instagram', link: 'https://instagram.com/rohkris64' },
  { label: '★ YouTube', link: 'https://youtube.com' },
  { label: '✦ Kotak Doa', link: '#kotak-doa' },
];

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Jadwal', href: '#jadwal' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Lagu', href: '#bank-lagu' },
    { label: 'Divisi', href: '#pengurus' },
    { label: 'Kotak Doa', href: '#kotak-doa' },
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
        menuButtonColor="#282828"
        openMenuButtonColor="#282828"
        changeMenuColorOnOpen={false}
        isFixed={true}
      />

      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
        {/* Top Announcement Banner (Vauliys Style) */}
        <div className="bg-[#343831] text-[#fdfdf5] text-center py-2 px-4 text-xs tracking-wider flex items-center justify-center gap-2 border-b border-[#282828] pointer-events-auto">
          <Sparkles className="w-3 h-3 text-[#c5de9b] animate-pulse" />
          <span className="font-medium">Persekutuan Rohani Kristen SMKN 64 Jakarta • Bertumbuh, Berakar, & Berbuah</span>
          <Sparkles className="w-3 h-3 text-[#c5de9b] animate-pulse" />
        </div>

        {/* Floating Warm Paper PillNav Container */}
        <div 
          className={`flex justify-center py-3 px-4 transition-all duration-300 ${
            scrolled ? 'backdrop-blur-md bg-[#f4f0e6]/90 shadow-md border-b border-[#ddd7c7]' : ''
          }`}
        >
          <div className="border border-[#ddd7c7] rounded-full shadow-sm bg-[#fbf8f1]/95 backdrop-blur-sm p-1 pointer-events-auto">
            <PillNav
              logo="/logo.png"
              logoAlt="Rohkris 64"
              items={navItems}
              baseColor="#fbf8f1"
              pillColor="#c5de9b"
              pillTextColor="#282828"
              hoveredPillTextColor="#282828"
            />
          </div>
        </div>
      </header>
    </>
  );
};
