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
      <div className="text-center py-12 text-stone-400 bg-stone-900/40 rounded-2xl border border-stone-800">
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
                  ? 'lg:flex-[4] flex-[3] border-amber-500/50 shadow-2xl shadow-amber-500/10'
                  : 'lg:flex-[1] flex-[1] border-stone-800/80 hover:border-stone-700 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Background Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Overlay */}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isActive
                    ? 'bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent'
                    : 'bg-stone-950/60 group-hover:bg-stone-950/40'
                }`}
              />

              {/* Collapsed Vertical Title (Desktop) */}
              {!isActive && (
                <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none p-4">
                  <span className="transform -rotate-90 whitespace-nowrap font-bold text-stone-300 text-sm tracking-wider uppercase font-['Outfit'] drop-shadow-md">
                    {item.title}
                  </span>
                </div>
              )}

              {/* Collapsed Horizontal Title (Mobile) */}
              {!isActive && (
                <div className="lg:hidden absolute bottom-3 left-4 right-4 pointer-events-none">
                  <span className="font-semibold text-stone-200 text-sm drop-shadow-md truncate block">
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
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        <Tag className="w-3 h-3" />
                        {item.category}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxItem(item);
                        }}
                        className="p-2 rounded-xl bg-stone-900/70 hover:bg-amber-500 text-stone-300 hover:text-stone-950 border border-stone-700/60 transition-all backdrop-blur-md"
                        title="Lihat Foto Penuh"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Info */}
                    <div className="space-y-2 max-w-xl">
                      <div className="flex items-center gap-2 text-xs text-amber-300/80 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                        {item.photographer && <span>• Dok. {item.photographer}</span>}
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-white font-['Outfit'] tracking-tight">
                        {item.title}
                      </h3>

                      <p className="text-stone-300 text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
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
                className="relative max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl"
              >
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={lightboxItem.imageUrl}
                  alt={lightboxItem.title}
                  className="w-full max-h-[70vh] object-contain bg-black"
                />
                <div className="p-6 bg-stone-900">
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
                    <span>{lightboxItem.category}</span>
                    <span>•</span>
                    <span>{lightboxItem.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{lightboxItem.title}</h3>
                  <p className="text-stone-300 text-sm leading-relaxed">{lightboxItem.description}</p>
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
