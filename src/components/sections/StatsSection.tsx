import React from 'react';
import { motion } from 'framer-motion';
import { Counter } from '../reactbits/Counter';
import { useVisitorCounter } from '../../hooks/useVisitorCounter';
import { Eye, Users, Church, Heart } from 'lucide-react';

import { SelectionBox } from '../common/SelectionBox';

interface StatsSectionProps {
  prayerCount?: number;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ prayerCount = 95 }) => {
  const visitorCount = useVisitorCounter(1420);

  const stats = [
    {
      id: 'visitors',
      label: 'Pengunjung Website',
      sublabel: 'Otomatis terhitung aktif',
      value: visitorCount,
      prefix: '',
      suffix: '',
      icon: <Eye className="w-4 h-4 text-[#8c6a49]" />,
    },
    {
      id: 'members',
      label: 'Keluarga Rohkris 64',
      sublabel: 'Siswa, Guru & Alumni',
      value: 128,
      prefix: '',
      suffix: '+',
      icon: <Users className="w-4 h-4 text-[#3e502c]" />,
    },
    {
      id: 'services',
      label: 'Ibadah & Persekutuan',
      sublabel: 'Sesi persekutuan per tahun',
      value: 48,
      prefix: '',
      suffix: '+ Sesi',
      icon: <Church className="w-4 h-4 text-[#8c6a49]" />,
    },
    {
      id: 'prayers',
      label: 'Pokok Doa Terdukung',
      sublabel: 'Saling mendoakan dalam kasih',
      value: prayerCount,
      prefix: '',
      suffix: '+ Doa',
      icon: <Heart className="w-4 h-4 text-[#b94a48]" />,
    },
  ];

  const statColors = [
    'bg-[#fef9c3]', // Toon Yellow
    'bg-[#dcfce7]', // Toon Green
    'bg-[#e0f2fe]', // Toon Sky Blue
    'bg-[#ffedd5]', // Toon Peach
  ];

  return (
    <section className="py-8 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <SelectionBox className="h-full rounded-2xl">
                <div className={`p-5 rounded-2xl ${statColors[idx % statColors.length]} border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] flex flex-col justify-between h-full transition-transform hover:-translate-y-1`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#ffffff] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]">
                      {stat.icon}
                    </div>
                    {stat.id === 'visitors' && (
                      <span className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#181d18] text-[#ffd269] border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                        LIVE
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-2xl md:text-3xl font-black text-[#181d18] font-['Outfit'] tracking-tight mb-0.5">
                      <Counter
                        value={stat.value}
                        duration={2.2}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        digitClassName="text-[#181d18]"
                      />
                    </div>
                    <h4 className="text-xs md:text-sm font-extrabold text-[#181d18]">{stat.label}</h4>
                    <p className="text-[10px] md:text-xs text-[#52525b] font-medium mt-0.5">{stat.sublabel}</p>
                  </div>
                </div>
              </SelectionBox>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
