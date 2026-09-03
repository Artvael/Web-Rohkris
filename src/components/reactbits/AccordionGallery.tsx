import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, Maximize2, X } from 'lucide-react';
import type { GalleryItem } from '../../types';

interface AccordionGalleryProps {
  items: GalleryItem[];
  className?: string;
  defaultActiveIndex?: number;
}

export const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items,
  className = '',
  defaultActiveIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(defaultActiveIndex);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-[#62665a] bg-[#f7f6ec] rounded-2xl border border-[#e6e3d1] shadow-xs">
        Belum ada foto galeri kegiatan yang diunggah.
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Accordion Container */}
      <div className="flex flex-col lg:flex-row gap-3 h-[520px] w-full select-none">
        {items.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={item.id || index}
              onClick={() => setActiveIndex(index)}
              layout
              transition={{ type: 'spring', stiffness: 220, damping: 28 }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group border transition-all duration-300 ${
                isActive
                  ? 'lg:flex-[4] flex-[3] border-[#343831] shadow-xl shadow-[#343831]/10'
                  : 'lg:flex-[1] flex-[1] border-[#e6e3d1] hover:border-[#343831] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Background Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  const title = (item.title || '').toLowerCase();
                  const cat = (item.category || '').toLowerCase();
                  if (cat === 'natal' || title.includes('natal')) {
                    target.src = '/natal-rohkris64.jpg';
                  } else if (cat === 'paskah' || title.includes('paskah')) {
                    target.src = '/paskah-rohkris64.jpg';
                  } else {
                    target.src = '/rohkris64-group.jpg';
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                decoding="async"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive
                    ? 'bg-gradient-to-t from-[#282828] via-[#282828]/40 to-transparent'
                    : 'bg-[#282828]/30 group-hover:bg-[#282828]/15'
                }`}
              />

              {/* Collapsed Vertical Title (Desktop) */}
              {!isActive && (
                <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none p-4">
                  <span className="transform -rotate-90 whitespace-nowrap font-bold text-white text-sm tracking-wider uppercase font-['Outfit'] drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              )}

              {/* Collapsed Horizontal Title (Mobile) */}
              {!isActive && (
                <div className="lg:hidden absolute bottom-3 left-4 right-4 pointer-events-none">
                  <span className="font-semibold text-white text-sm drop-shadow-md truncate block">
                    {item.title}
                  </span>
                </div>
              )}

              {/* Active Expanded Details */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="absolute inset-0 flex flex-col justify-between p-6 z-10"
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#343831] text-[#fdfdf5] border border-[#343831] shadow-xs">
                        <Tag className="w-3 h-3 text-[#c5de9b]" />
                        {item.category}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxItem(item);
                        }}
                        className="p-2 rounded-full bg-[#fdfdf5]/90 hover:bg-[#c5de9b] text-[#282828] border border-[#343831] transition-all shadow-xs cursor-pointer"
                        title="Lihat Foto Penuh"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2 text-xs text-[#c5de9b] font-medium drop-shadow-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                        {item.photographer && <span>• Dok. {item.photographer}</span>}
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-white font-['Outfit'] tracking-tight">
                        {item.title}
                      </h3>

                      <p className="text-stone-100 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed drop-shadow-xs">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxItem(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-[#f7f6ec] rounded-3xl overflow-hidden border border-[#e6e3d1] shadow-2xl"
              >
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#efeedc] hover:bg-[#c5de9b] text-[#282828] border border-[#343831] transition-colors cursor-pointer shadow-xs"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    const title = (lightboxItem.title || '').toLowerCase();
                    const cat = (lightboxItem.category || '').toLowerCase();
                    if (cat === 'natal' || title.includes('natal')) {
                      target.src = '/natal-rohkris64.jpg';
                    } else if (cat === 'paskah' || title.includes('paskah')) {
                      target.src = '/paskah-rohkris64.jpg';
                    } else {
                      target.src = '/rohkris64-group.jpg';
                    }
                  }}
                  className="w-full max-h-[70vh] object-contain bg-[#282828]"
                />
                <div className="p-6 bg-[#f7f6ec] border-t border-[#e6e3d1]">
                  <div className="flex items-center gap-2 text-xs text-[#8c6a49] font-semibold mb-1">
                    <span>{lightboxItem.category}</span>
                    <span>•</span>
                    <span>{lightboxItem.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#282828] mb-2 font-['Outfit']">{lightboxItem.title}</h3>
                  <p className="text-[#575a53] text-sm leading-relaxed">{lightboxItem.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
