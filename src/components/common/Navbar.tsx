import React, { useState, useEffect } from 'react';
import { PillNav } from '../reactbits/PillNav';
import { Sparkles } from 'lucide-react';

interface NavbarProps {}

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
    { label: 'Kisah', href: '#kisah-iman' },
    { label: 'Jadwal', href: '#jadwal' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Lagu', href: '#bank-lagu' },
    { label: 'Divisi', href: '#pengurus' },
    { label: 'Kotak Doa', href: '#kotak-doa' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Announcement Banner (Vauliys Style) */}
      <div className="bg-[#343831] text-[#fdfdf5] text-center py-2 px-4 text-xs tracking-wider flex items-center justify-center gap-2 border-b border-[#282828]">
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
        <div className="border border-[#ddd7c7] rounded-full shadow-sm bg-[#fbf8f1]/95 backdrop-blur-sm p-1">
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
  );
};
