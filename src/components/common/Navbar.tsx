import React, { useState, useEffect } from 'react';
import { PillNav } from '../reactbits/PillNav';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Jadwal', href: '#jadwal' },
    { label: 'Galeri', href: '#galeri' },
    { label: 'Divisi', href: '#pengurus' },
    { label: 'Kotak Doa', href: '#kotak-doa' },
  ];

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center py-4 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-stone-950/40 shadow-2xl py-3 border-b border-white/5' : ''
      }`}
    >
      <PillNav
        logo="/logo.png"
        logoAlt="Rohkris 64"
        items={navItems}
        baseColor="#1c1917" /* stone-900 */
        pillColor="#292524" /* stone-800 */
        pillTextColor="#d6d3d1" /* stone-300 */
        hoveredPillTextColor="#fcd34d" /* amber-300 */
      />
    </div>
  );
};
