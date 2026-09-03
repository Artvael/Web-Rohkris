import React from 'react';
import { DriftWall, type DriftWallItem } from '../reactbits/DriftWall';
import { BookOpen } from 'lucide-react';

const VERSES: DriftWallItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=600&auto=format&fit=crop',
    verse: 'Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.',
    reference: 'Filipi 4:13'
  },
  {
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=600&auto=format&fit=crop',
    verse: 'Karena begitu besar kasih Allah akan dunia ini...',
    reference: 'Yohanes 3:16'
  },
  {
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=600&auto=format&fit=crop',
    verse: 'Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri.',
    reference: 'Amsal 3:5'
  },
  {
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=600&auto=format&fit=crop',
    verse: 'Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu...',
    reference: 'Yeremia 29:11'
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop',
    verse: 'Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah...',
    reference: 'Filipi 4:6'
  },
  {
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop',
    verse: 'Tetapi carilah dahulu Kerajaan Allah dan kebenarannya, maka semuanya itu akan ditambahkan kepadamu.',
    reference: 'Matius 6:33'
  },
  {
    image: 'https://images.unsplash.com/photo-1444464666168-49b626f111d5?q=80&w=600&auto=format&fit=crop',
    verse: 'Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong.',
    reference: '1 Korintus 13:4'
  },
  {
    image: 'https://images.unsplash.com/photo-1455218873509-8097305ee378?q=80&w=600&auto=format&fit=crop',
    verse: 'Tuhan adalah gembalaku, takkan kekurangan aku. Ia membaringkan aku di padang yang berumput hijau...',
    reference: 'Mazmur 23:1-2'
  },
  {
    image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=600&auto=format&fit=crop',
    verse: 'Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah.',
    reference: 'Efesus 2:8'
  },
  {
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=600&auto=format&fit=crop',
    verse: 'Bersukacitalah senantiasa. Tetaplah berdoa. Mengucap syukurlah dalam segala hal...',
    reference: '1 Tesalonika 5:16-18'
  },
  {
    image: 'https://images.unsplash.com/photo-1470071131384-001b85755b36?q=80&w=600&auto=format&fit=crop',
    verse: 'Pencobaan-pencobaan yang kamu alami ialah pencobaan-pencobaan biasa, yang tidak melebihi kekuatan manusia.',
    reference: '1 Korintus 10:13'
  },
  {
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop',
    verse: 'Jawab Yesus kepadanya: "Akulah jalan dan kebenaran dan hidup. Tidak ada seorangpun yang datang kepada Bapa, kalau tidak melalui Aku."',
    reference: 'Yohanes 14:6'
  }
];

export const VersesSection: React.FC = () => {
  return (
    <section id="firman" className="py-16 md:py-24 px-4 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#efeedc] text-[#343831] border border-[#343831]">
              <BookOpen className="w-3.5 h-3.5 text-[#8c6a49]" />
              <span>Firman Tuhan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#282828] font-['Outfit'] tracking-tight">
              Kekuatan dari Sabda-Nya
            </h2>
            <p className="text-[#575a53] text-sm md:text-base leading-relaxed">
              Biarlah Firman Tuhan menjadi pelita bagi kaki kita dan terang bagi jalan kita. Temukan kekuatan baru melalui ayat-ayat Alkitab pilihan ini.
            </p>
          </div>
        </div>

        {/* DriftWall Container */}
        <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-[#e6e3d1] shadow-xl bg-[#f7f6ec]">
          {/* Subtle gradient overlay to blend edges */}
          <div className="absolute inset-0 z-10 pointer-events-none rounded-3xl ring-1 ring-inset ring-[#e6e3d1]" />
          
          <DriftWall
            items={VERSES}
            columns={4}
            tileWidth={220}
            tileHeight={140}
            gap={20}
            tilt={15}
            turn={-10}
            overlayColor="#282828"
            perspective={1000}
            depth={100}
            speed={35}
            direction="up"
            variance={0.5}
            parallax={0.8}
            lift={50}
            fade={0.6}
            dim={0.6}
          />
        </div>
      </div>
    </section>
  );
};
