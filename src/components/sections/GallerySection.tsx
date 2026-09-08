import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { InfiniteGallery } from '../ui/infinite-gallery';
import type { GalleryItem } from '../../types';
import { Image, Sparkles, Filter, Move, Compass, Eye } from 'lucide-react';
import { sanityClient, urlFor } from '../../sanity/client';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sanityItems, setSanityItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "galleryItem"] | order(_createdAt desc)')
      .then((data) => {
        if (data && data.length > 0) {
          // Map sanity images to normal URLs with local fallbacks
          const mappedItems = data.map((item: any) => {
            let imgUrl = '';
            const titleLower = (item.title || '').toLowerCase();
            const catLower = (item.category || '').toLowerCase();

            // 1. Prefer rock-solid local assets for official events
            if (catLower === 'natal' || titleLower.includes('natal')) {
              imgUrl = '/natal-rohkris64.jpg';
            } else if (catLower === 'paskah' || titleLower.includes('paskah')) {
              imgUrl = '/paskah-rohkris64.jpg';
            } else {
              try {
                if (item.image) {
                  imgUrl = urlFor(item.image).url();
                }
              } catch (e) {
                console.warn('Error resolving sanity image', e);
              }
              if (!imgUrl) {
                imgUrl = item.imageUrl || '/rohkris64-group.jpg';
              }
            }

            return {
              id: item._id,
              imageUrl: imgUrl,
              title: item.title,
              description: item.description || '',
              date: item.date || '',
              category: item.category || 'Lainnya',
              photographer: item.photographer || 'Dokumentasi Rohkris 64',
            };
          });
          setSanityItems(mappedItems);
        }
      })
      .catch(console.error);
  }, []);

  const [autoDrift, setAutoDrift] = useState<boolean>(false);

  const categories = ['Semua', 'Paskah', 'Natal', 'Ibadah Rutin', 'Retreat', 'Fellowship', 'Latihan', 'Lainnya'];

  // Combine Sanity items with default gallery items (avoiding duplicates by title)
  const combinedItems = [
    ...sanityItems,
    ...items.filter((defaultItem) => !sanityItems.some((s) => s.title === defaultItem.title)),
  ];

  const dataSource = combinedItems.length > 0 ? combinedItems : items;

  const filteredItems = dataSource.filter((item) => {
    if (selectedCategory === 'Semua') return true;
    return item.category === selectedCategory;
  });

  const galleryImages = useMemo(() => {
    return filteredItems.map((item) => ({
      url: item.imageUrl,
      width: 600,
      height: 400,
      title: item.title,
      description: item.description,
    }));
  }, [filteredItems]);

  return (
    <section id="galeri" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18]">
              <Image className="w-3.5 h-3.5 text-[#181d18]" />
              <span>3D Infinite Gallery • Rohkris 64</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#181d18] font-['Outfit'] tracking-tight">
              Galeri Kegiatan Rohkris 64
            </h2>
            <p className="text-[#343831] text-sm md:text-base leading-relaxed font-medium">
              Setiap momen persekutuan, pujian, dan kasih persaudaraan siswa-siswi Kristen SMKN 64 Jakarta dalam visual 3D interaktif.
            </p>
          </div>
        </div>

        {/* Category Filters & 3D Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs text-[#181d18] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-[#181d18]" />
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#ffd269] text-[#181d18] font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]'
                    : 'bg-[#ffffff] text-[#181d18]/70 hover:text-[#181d18] border border-[#181d18] hover:bg-[#fef9c3]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setAutoDrift(!autoDrift)}
              className={`px-3 py-1.5 rounded-full text-xs font-black border-2 border-[#181d18] transition-all flex items-center gap-1.5 cursor-pointer ${
                autoDrift
                  ? 'bg-[#98e297] text-[#181d18] shadow-[2px_2px_0px_#181d18]'
                  : 'bg-[#ffffff] text-[#181d18]/80 hover:bg-[#f2f1e6] shadow-[1.5px_1.5px_0px_#181d18]'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 ${autoDrift ? 'animate-spin' : ''}`} />
              <span>Auto Drift: {autoDrift ? 'Aktif' : 'Nonaktif'}</span>
            </button>
          </div>
        </div>

        {/* 3D Infinite Gallery Component with Toon Neobrutalist Frame */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl bg-[#141a14] border-[3px] border-[#181d18] shadow-[6px_6px_0px_#181d18] overflow-hidden group"
        >
          {/* Top Info Bar inside frame */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fdfdf5]/90 backdrop-blur-md border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] text-[11px] font-black text-[#181d18]">
              <Move className="w-3 h-3 text-[#181d18]" />
              <span>Geser untuk Melayang 3D • Scroll / Cubit untuk Zoom</span>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffd269]/95 backdrop-blur-md border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] text-[11px] font-black text-[#181d18]">
              <Eye className="w-3 h-3 text-[#181d18]" />
              <span>{galleryImages.length} Foto ({selectedCategory})</span>
            </div>
          </div>

          {/* 3D Canvas Viewport */}
          <div className="w-full h-[480px] sm:h-[540px] md:h-[620px]">
            <InfiniteGallery
              images={galleryImages}
              density={6}
              imageSize={16}
              cellSize={110}
              viewRange={2}
              fogNear={100}
              fogFar={300}
              dragSpeed={1.2}
              driftAmount={8}
              friction={0.88}
              autoZoom={autoDrift}
              autoZoomSpeed={0.4}
              imageRadius={0.06}
              allowImageFocusOnClick={true}
              backgroundColor="#141a14"
              fogColor="#141a14"
            />
          </div>
        </motion.div>

        <div className="text-center text-xs text-[#343831] font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#181d18]" />
          <span>Klik salah satu foto untuk zoom & fokus langsung, atau klik latar belakang untuk kembali menjelajah.</span>
        </div>
      </div>
    </section>
  );
};
