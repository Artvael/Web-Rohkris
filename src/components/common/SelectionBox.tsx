import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SelectionBoxProps {
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
  maxTilt?: number;
}

/**
 * SelectionBox Component (Antigravity & Active Theory Style)
 * Renders an interactive 3D spatial tilt card with 8 tactile vector handles
 * and a floating gradient selection boundary on the Z-axis.
 */
export const SelectionBox: React.FC<SelectionBoxProps> = ({
  children,
  className = '',
  enabled = true,
  maxTilt = 6,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalized mouse coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physics spring for organic, buttery-smooth movement
  const springConfig = { damping: 22, stiffness: 220, mass: 0.4 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // RotateX & RotateY for 3D card tilt
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <div
      style={{ perspective: 1200 }}
      className={`selection-box-perspective ${className}`}
    >
      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="selection-box-container group relative w-full h-full will-change-transform"
      >
        {/* Card Content with 3D plane anchor */}
        <div style={{ transform: 'translateZ(0px)' }} className="w-full h-full">
          {children}
        </div>

        {/* Floating 3D Vector Selection Overlay */}
        <div
          style={{ transform: 'translateZ(16px)' }}
          className="selection-overlay pointer-events-none"
        />

        {/* 4 Corner Handles floating in 3D Space on Z-axis */}
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-tl" />
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-tr" />
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-bl" />
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-br" />

        {/* 4 Mid-edge Handles floating in 3D Space on Z-axis */}
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-tm" />
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-bm" />
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-ml" />
        <span style={{ transform: 'translateZ(22px)' }} className="selection-handle selection-handle-mr" />
      </motion.div>
    </div>
  );
};
