import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface ScrollExpandProps {
  children?: React.ReactNode;
  mediaSrc?: string;
  mediaType?: 'image' | 'video';
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  containerClassName?: string;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  children,
  mediaSrc,
  mediaType = 'image',
  title,
  subtitle,
  badge,
  className = '',
  containerClassName = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'center 0.45'],
  });

  // Smooth scroll transformations
  const scale: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const width: MotionValue<string> = useTransform(scrollYProgress, [0, 1], ['86%', '100%']);
  const borderRadius: MotionValue<string> = useTransform(scrollYProgress, [0, 1], ['2.5rem', '1.25rem']);
  const opacity: MotionValue<number> = useTransform(scrollYProgress, [0, 0.4, 1], [0.6, 0.9, 1]);
  const overlayOpacity: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [0.65, 0.35]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center justify-center py-12 md:py-20 px-4 overflow-hidden ${containerClassName}`}
    >
      <motion.div
        style={{
          scale,
          width,
          borderRadius,
          opacity,
        }}
        className={`relative overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/10 transition-shadow duration-500 max-w-6xl mx-auto h-[380px] md:h-[500px] ${className}`}
      >
        {/* Background Media */}
        {mediaSrc && mediaType === 'image' && (
          <img
            src={mediaSrc}
            alt={title || 'Showcase'}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Ambient Dark/Warm Overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-900/40 z-10"
        />

        {/* Content Container */}
        <div className="relative z-20 w-full h-full p-6 md:p-12 flex flex-col justify-between">
          {/* Top Badge */}
          {badge && (
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg">
                {badge}
              </span>
            </div>
          )}

          {/* Children or Default Content */}
          {children ? (
            children
          ) : (
            <div className="space-y-3 max-w-2xl">
              {title && (
                <h3 className="text-2xl md:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight drop-shadow-md">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-stone-200 text-xs md:text-base leading-relaxed drop-shadow">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
