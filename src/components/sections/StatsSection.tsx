import React from 'react';
import { motion } from 'framer-motion';
import { Counter } from '../reactbits/Counter';
import { useVisitorCounter } from '../../hooks/useVisitorCounter';
import { Eye, Users, Church, Heart } from 'lucide-react';

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
      icon: <Eye className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'members',
      label: 'Keluarga Rohkris 64',
      sublabel: 'Siswa, Guru & Alumni',
      value: 128,
      prefix: '',
      suffix: '+',
      icon: <Users className="w-5 h-5 text-amber-300" />,
      color: 'from-amber-400/20 to-amber-500/10',
      borderColor: 'border-amber-400/30',
    },
    {
      id: 'services',
      label: 'Ibadah & Persekutuan',
      sublabel: 'Sesi persekutuan per tahun',
      value: 48,
      prefix: '',
      suffix: '+ Sesi',
      icon: <Church className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-600/10',
      borderColor: 'border-amber-500/30',
    },
    {
      id: 'prayers',
      label: 'Pokok Doa Terdukung',
      sublabel: 'Saling mendoakan dalam kasih',
      value: prayerCount,
      prefix: '',
      suffix: '+ Doa',
      icon: <Heart className="w-5 h-5 text-rose-400" />,
      color: 'from-rose-500/20 to-rose-600/10',
      borderColor: 'border-rose-500/30',
    },
  ];

  return (
    <section className="py-12 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-5 rounded-2xl bg-gradient-to-b ${stat.color} backdrop-blur-xl border ${stat.borderColor} flex flex-col justify-between hover:border-amber-400/50 transition-all group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 shadow-md group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                {stat.id === 'visitors' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live
                  </span>
                )}
              </div>

              <div>
                <div className="text-2xl md:text-3xl font-black text-white font-['Outfit'] tracking-tight mb-0.5">
                  <Counter
                    value={stat.value}
                    duration={2.2}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    digitClassName="text-white"
                  />
                </div>
                <h4 className="text-xs md:text-sm font-bold text-stone-200">{stat.label}</h4>
                <p className="text-[10px] md:text-xs text-stone-400 mt-0.5">{stat.sublabel}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
