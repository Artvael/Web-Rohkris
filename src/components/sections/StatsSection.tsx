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
                <div className="p-5 rounded-2xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-xs flex flex-col justify-between h-full transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-[#efeedc] border border-[#d6d2bd]">
                      {stat.icon}
                    </div>
                    {stat.id === 'visitors' && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#c5de9b]/50 text-[#3e502c] border border-[#3e502c]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3e502c] animate-ping" />
                        Live
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-[#282828] font-['Outfit'] tracking-tight mb-0.5">
                      <Counter
                        value={stat.value}
                        duration={2.2}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        digitClassName="text-[#282828]"
                      />
                    </div>
                    <h4 className="text-xs md:text-sm font-semibold text-[#282828]">{stat.label}</h4>
                    <p className="text-[10px] md:text-xs text-[#62665a] mt-0.5">{stat.sublabel}</p>
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
