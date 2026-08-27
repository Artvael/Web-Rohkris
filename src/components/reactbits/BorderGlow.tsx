import React, { useRef, useState } from 'react';

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderWidth?: number;
  borderRadius?: string;
  interactive?: boolean;
}

export const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = '',
  glowColor = 'rgba(245, 158, 11, 0.4)',
  borderWidth = 1.5,
  borderRadius = '1.25rem',
  interactive = true,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; isHovered: boolean }>({
    x: 0,
    y: 0,
    isHovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ borderRadius }}
      className={`relative group p-[1px] overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Background glow tracker */}
      {interactive && mousePos.isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Ambient static / resting border glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-80 transition-opacity duration-500 z-0"
        style={{
          border: `${borderWidth}px solid transparent`,
          borderRadius,
          background: `linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.1) 50%, rgba(251, 191, 36, 0.3) 100%) border-box`,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Content wrapper */}
      <div
        className="relative z-10 w-full h-full bg-stone-900/85 backdrop-blur-xl transition-colors duration-300"
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
      >
        {children}
      </div>
    </div>
  );
};
