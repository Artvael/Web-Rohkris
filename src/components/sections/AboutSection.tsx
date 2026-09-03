import React from 'react';
import { motion } from 'framer-motion';
import { SelectionBox } from '../common/SelectionBox';
import { HalftoneReveal } from '../reactbits/HalftoneReveal';
import { Shield, Target, Compass, Heart, Award, MapPin, ExternalLink, School } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const values = [
    {
      title: 'Kasih (Love)',
      desc: 'Mengasihi Tuhan dengan segenap hati dan mengasihi sesama seperti diri sendiri di lingkungan SMKN 64.',
      icon: <Heart className="w-5 h-5 text-[#b94a48]" />,
    },
    {
      title: 'Integritas (Integrity)',
      desc: 'Menjaga kekudusan hidup, kejujuran dalam belajar, dan kesetiaan dalam perkara-perkara kecil.',
      icon: <Shield className="w-5 h-5 text-[#8c6a49]" />,
    },
    {
      title: 'Pelayanan (Servanthood)',
      desc: 'Melayani dengan kerendahan hati tanpa memandang pamrih, meneladani teladan Tuhan Yesus Kristus.',
      icon: <Award className="w-5 h-5 text-[#343831]" />,
    },
    {
      title: 'Kesehatian (Unity)',
      desc: 'Membangun persekutuan yang rukun dan harmonis antar tingkatan kelas X, XI, dan XII.',
      icon: <Compass className="w-5 h-5 text-[#3e502c]" />,
    },
  ];

  return (
    <section id="tentang" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#efeedc] text-[#343831] border border-[#343831]">
            <School className="w-3.5 h-3.5 text-[#8c6a49]" />
            <span>Visi & Profil Persekutuan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#282828] font-['Outfit'] tracking-tight">
            Tentang Rohkris SMKN 64
          </h2>
          <p className="text-[#575a53] text-sm md:text-base leading-relaxed">
            Wadah pembinaan rohani dan persekutuan siswa-siswi beragama Kristen di SMK Negeri 64 Jakarta.
          </p>
        </motion.div>

        {/* Vision & Mission Grid with Staggered Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SelectionBox className="h-full rounded-3xl">
              <div className="p-8 space-y-4 h-full rounded-3xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-md">
                <div className="inline-flex p-3 rounded-2xl bg-[#efeedc] text-[#8c6a49] border border-[#d6d2bd]">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#282828] font-['Outfit']">Visi Pelayanan</h3>
                <p className="text-[#575a53] text-sm leading-relaxed">
                  Mewujudkan generasi muda Kristen SMKN 64 Jakarta yang <strong className="text-[#282828]">berakar kuat di dalam firman Tuhan</strong>, <strong className="text-[#282828]">bertumbuh dalam karakter Kristus</strong>, dan <strong className="text-[#282828]">berbuah lebat</strong> menjadi terang dan garam di sekolah, keluarga, dan masyarakat.
                </p>
              </div>
            </SelectionBox>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SelectionBox className="h-full rounded-3xl">
              <div className="p-8 space-y-4 h-full rounded-3xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-md">
                <div className="inline-flex p-3 rounded-2xl bg-[#efeedc] text-[#8c6a49] border border-[#d6d2bd]">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[#282828] font-['Outfit']">Misi Pelayanan</h3>
                <ul className="text-[#575a53] text-sm space-y-2.5 leading-relaxed list-disc list-inside">
                  <li>Menyelenggarakan ibadah rutin Jumat yang membangun dan penuh hadirat Tuhan.</li>
                  <li>Menumbuhkan kecintaan membaca firman Tuhan melalui renungan harian dan saat teduh.</li>
                  <li>Mempererat tali persaudaraan melalui persekutuan kasih, ibadah padang, dan retreat.</li>
                  <li>Mengembangkan talenta musik, vokal, multimedia, dan kepemimpinan siswa.</li>
                </ul>
              </div>
            </SelectionBox>
          </motion.div>
        </div>

        {/* Core Values with Staggered Cards & Micro-interactions */}
        <div className="space-y-6">
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl font-bold text-[#282828] text-center font-['Outfit']"
          >
            Nilai-Nilai Utama (Core Values)
          </motion.h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="h-full"
              >
                <SelectionBox className="h-full rounded-2xl">
                  <div className="p-5 rounded-2xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-xs space-y-2.5 h-full">
                    <div className="p-2.5 rounded-xl bg-[#ffffff] w-fit border border-[#e6e3d1] shadow-xs">
                      {v.icon}
                    </div>
                    <h4 className="text-base font-bold text-[#282828]">{v.title}</h4>
                    <p className="text-xs text-[#575a53] leading-relaxed">{v.desc}</p>
                  </div>
                </SelectionBox>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real Photo Showcase with HalftoneReveal Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-6 space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#efeedc] text-[#343831] border border-[#343831]">
              📸 Momen Kebersamaan
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#282828] font-['Outfit']">
              Generasi Emas SMKN 64 Jakarta
            </h3>
            <p className="text-[#575a53] text-sm leading-relaxed">
              Rohkris SMKN 64 Jakarta bukan sekadar perkumpulan ekstrakurikuler, melainkan sebuah keluarga di mana setiap siswa saling menopang, bertumbuh dalam iman kepada Kristus, dan bersama-sama menorehkan prestasi terbaik bagi kemuliaan Tuhan.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-[#efeedc] border border-[#d6d2bd] shrink-0 shadow-xs">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#282828]">Persekutuan Rohkris 64</h5>
                <span className="text-[11px] text-[#62665a]">SMKN 64 Jakarta • Bersatu dalam Kasih</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HalftoneReveal
              imageSrc="/rohkris64-group.jpg"
              alt="Keluarga Besar Rohkris SMKN 64 Jakarta"
              className="h-[340px] md:h-[400px] border border-[#e6e3d1] shadow-xl rounded-2xl overflow-hidden"
              dotColor="rgba(52, 56, 49, 0.35)"
              dotSize={3.5}
              gap={14}
            />
          </div>
        </motion.div>

        {/* Location & School Connection Banner with Micro-interactions */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 md:p-8 rounded-3xl bg-[#f7f6ec] border border-[#e6e3d1] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md"
        >
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-[#8c6a49] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              Lokasi Sekolah
            </div>
            <h4 className="text-xl font-bold text-[#282828] font-['Outfit']">SMK Negeri 64 Jakarta</h4>
            <p className="text-xs text-[#575a53] leading-relaxed">
              Jl. Mpo Nori RT 09 RW 03<br />
              Kel. Bambu Apus, Kec. Cipayung, Kota Jakarta Timur<br />
              DKI Jakarta
            </p>
          </div>

          <motion.a
            href="https://maps.google.com/?q=SMKN+64+Jakarta"
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#c5de9b] hover:bg-[#b8d488] text-[#282828] font-bold text-xs border border-[#343831] shadow-xs whitespace-nowrap transition-colors cursor-pointer"
          >
            <span>Buka di Google Maps</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
