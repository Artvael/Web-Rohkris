import React from 'react';
import { LogoLoop } from '../reactbits/LogoLoop';
import { Heart, Users, Shield, Sparkles, Globe, Music, Camera } from 'lucide-react';

const PARTNERS = [
  { 
    node: <><Heart className="w-6 h-6 text-amber-500" /><span className="font-bold text-stone-200">Rohkris Peduli</span></>,
    title: "Rohkris Peduli"
  },
  { 
    node: <><Users className="w-6 h-6 text-blue-500" /><span className="font-bold text-stone-200">Komunitas Siswa</span></>,
    title: "Komunitas Siswa"
  },
  { 
    node: <><Shield className="w-6 h-6 text-green-500" /><span className="font-bold text-stone-200">Tim Doa</span></>,
    title: "Tim Doa"
  },
  { 
    node: <><Sparkles className="w-6 h-6 text-yellow-400" /><span className="font-bold text-stone-200">Youth Ministry</span></>,
    title: "Youth Ministry"
  },
  { 
    node: <><Globe className="w-6 h-6 text-indigo-400" /><span className="font-bold text-stone-200">Jaringan Pelajar</span></>,
    title: "Jaringan Pelajar"
  },
  { 
    node: <><Music className="w-6 h-6 text-rose-400" /><span className="font-bold text-stone-200">Praise & Worship</span></>,
    title: "Praise & Worship"
  },
  { 
    node: <><Camera className="w-6 h-6 text-purple-400" /><span className="font-bold text-stone-200">Multimedia</span></>,
    title: "Multimedia"
  }
];

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-12 border-y border-stone-800/50 bg-[#0c0a09]/80 backdrop-blur-sm relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-widest">
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
          fadeOutColor="#0c0a09"
        />
      </div>
    </section>
  );
};
