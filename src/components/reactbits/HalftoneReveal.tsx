import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HalftoneRevealProps {
  imageSrc: string;
  alt?: string;
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
  initialRevealed?: boolean;
}

/**
 * HalftoneReveal Component (ReactBits Animation)
 * Renders an image with an artistic halftone dot grid mask that smoothly reveals
 * the full-color, sharp photograph upon mouse hover or scroll interaction.
 */
export const HalftoneReveal: React.FC<HalftoneRevealProps> = ({
  imageSrc,
  alt = 'Halftone Reveal Image',
  className = '',
  dotColor = 'rgba(245, 158, 11, 0.4)',
  dotSize = 3,
  gap = 12,
  initialRevealed = false,
}) => {
  const [isHovered, setIsHovered] = useState(initialRevealed);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl cursor-pointer group select-none ${className}`}
    >
      {/* Underlying Crisp High-Res Image */}
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      />

      {/* Halftone Dot Grid Overlay */}
      <motion.div
        initial={false}
        animate={{
          opacity: isHovered ? 0 : 0.85,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundColor: 'rgba(52, 56, 49, 0.2)',
          backgroundImage: `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
          backgroundSize: `${gap}px ${gap}px`,
        }}
      />

      {/* Ambient Warm Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#282828]/50 via-transparent to-transparent pointer-events-none z-10 transition-opacity duration-300 group-hover:opacity-60" />

      {/* Reveal Hint Badge */}
      <div className="absolute bottom-4 right-4 z-20">
        <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#efeedc] text-[#343831] border border-[#343831] shadow-xs transition-opacity duration-300 group-hover:opacity-0">
          Arahkan kursor untuk melihat foto asli ✨
        </span>
      </div>
    </div>
  );
};
