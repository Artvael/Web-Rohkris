import React from 'react';
import { LogoLoop } from '../reactbits/LogoLoop';
import { Heart, Users, Shield, Sparkles, Globe, Music, Camera } from 'lucide-react';

const PARTNERS = [
  { 
    node: <><Heart className="w-5 h-5 text-[#8c6a49]" /><span className="font-semibold text-[#282828]">Rohkris Peduli</span></>,
    title: "Rohkris Peduli"
  },
  { 
    node: <><Users className="w-5 h-5 text-[#3e502c]" /><span className="font-semibold text-[#282828]">Komunitas Siswa</span></>,
    title: "Komunitas Siswa"
  },
  { 
    node: <><Shield className="w-5 h-5 text-[#8c6a49]" /><span className="font-semibold text-[#282828]">Tim Doa</span></>,
    title: "Tim Doa"
  },
  { 
    node: <><Sparkles className="w-5 h-5 text-[#8c6a49]" /><span className="font-semibold text-[#282828]">Youth Ministry</span></>,
    title: "Youth Ministry"
  },
  { 
    node: <><Globe className="w-5 h-5 text-[#3e502c]" /><span className="font-semibold text-[#282828]">Jaringan Pelajar</span></>,
    title: "Jaringan Pelajar"
  },
  { 
    node: <><Music className="w-5 h-5 text-[#8c6a49]" /><span className="font-semibold text-[#282828]">Praise & Worship</span></>,
    title: "Praise & Worship"
  },
  { 
    node: <><Camera className="w-5 h-5 text-[#3e502c]" /><span className="font-semibold text-[#282828]">Multimedia</span></>,
    title: "Multimedia"
  }
];

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-10 border-y border-[#ddd7c7] bg-[#ebe6d8] relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-6 text-center">
        <p className="text-xs font-semibold text-[#62665a] uppercase tracking-widest">
          Pelayanan & Komunitas Terkait
        </p>
      </div>

      <div className="w-full relative h-[60px]">
        <LogoLoop
          logos={PARTNERS}
          speed={60}
          direction="left"
          logoHeight={32}
          gap={64}
          pauseOnHover={true}
          hoverSpeed={0}
          scaleOnHover={true}
          fadeOut={true}
          fadeOutColor="#f4f0e6"
        />
      </div>
    </section>
  );
};
