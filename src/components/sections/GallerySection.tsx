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
          // Map sanity images to normal URLs
          const mappedItems = data.map((item: any) => ({
            id: item._id,
            imageUrl: item.image ? urlFor(item.image).url() : item.imageUrl || '',
            title: item.title,
            description: item.description || '',
            date: item.date || '',
            category: item.category || 'Lainnya',
            photographer: item.photographer || 'Dokumentasi Rohkris 64',
          }));
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Image className="w-3.5 h-3.5" />
              <span>Dokumentasi & Kenangan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
              Galeri Kegiatan Rohkris 64
            </h2>
            <p className="text-stone-300 text-sm md:text-base leading-relaxed">
              Setiap momen persekutuan, pujian, dan kasih persaudaraan siswa-siswi Kristen SMKN 64 Jakarta.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs text-stone-400 font-semibold flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion Gallery Component */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <AccordionGallery items={filteredItems} />
        </motion.div>

        <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Klik salah satu foto untuk memperluas tampilan atau melihat foto penuh.</span>
        </div>
      </div>
    </section>
  );
};
