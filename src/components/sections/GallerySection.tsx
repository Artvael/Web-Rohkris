import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AccordionGallery } from '../reactbits/AccordionGallery';
import type { GalleryItem } from '../../types';
import { Image, Sparkles, Filter } from 'lucide-react';
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

  return (
    <section id="galeri" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18]">
              <Image className="w-3.5 h-3.5 text-[#181d18]" />
              <span>Dokumentasi & Kenangan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#181d18] font-['Outfit'] tracking-tight">
              Galeri Kegiatan Rohkris 64
            </h2>
            <p className="text-[#343831] text-sm md:text-base leading-relaxed font-medium">
              Setiap momen persekutuan, pujian, dan kasih persaudaraan siswa-siswi Kristen SMKN 64 Jakarta.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
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

        {/* Accordion Gallery Component with Toon Frame */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="p-3 md:p-4 rounded-3xl bg-[#ffffff] border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18]"
        >
          <AccordionGallery items={filteredItems} />
        </motion.div>

        <div className="text-center text-xs text-[#343831] font-bold flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#181d18]" />
          <span>Klik salah satu foto untuk memperluas tampilan atau melihat foto penuh.</span>
        </div>
      </div>
    </section>
  );
};
