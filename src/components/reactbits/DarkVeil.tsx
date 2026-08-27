import React, { useEffect, useRef } from 'react';

interface DarkVeilProps {
  className?: string;
  intensity?: number;
  speed?: number;
}

/**
 * DarkVeil Component (Customized for Warm & Radiant Spiritual Glow)
 * Renders smooth ambient fluid mesh waves in warm gold, glowing amber, and soft dawn hues.
 */
export const DarkVeil: React.FC<DarkVeilProps> = ({
  className = '',
  intensity = 1.0,
  speed = 0.0015,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Warm luminous color palette
    // Golden amber, sunrise gold, warm peach, deep spiritual charcoal
    const colors = [
      { r: 245, g: 158, b: 11, a: 0.18 * intensity }, // Amber 500
      { r: 251, g: 191, b: 36, a: 0.15 * intensity }, // Amber 400
      { r: 217, g: 119, b: 6, a: 0.12 * intensity },  // Amber 600
      { r: 244, g: 63, b: 94, a: 0.08 * intensity },  // Rose gold
      { r: 180, g: 83, b: 9, a: 0.2 * intensity },    // Golden brown
    ];

    let t = 0;

    const render = () => {
      t += speed;
      ctx.clearRect(0, 0, width, height);

      // Deep rich base
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, width, height);

      // Draw multi-layered warm light veils
      for (let i = 0; i < 4; i++) {
        const col = colors[i % colors.length];
        const cx = width * (0.5 + 0.3 * Math.sin(t * (0.8 + i * 0.2) + i * 1.5));
        const cy = height * (0.4 + 0.25 * Math.cos(t * (0.6 + i * 0.3) + i * 2.0));
        const radius = Math.max(width, height) * (0.45 + 0.1 * Math.sin(t + i));

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a})`);
        gradient.addColorStop(0.5, `rgba(${col.r}, ${col.g}, ${col.b}, ${col.a * 0.4})`);
        gradient.addColorStop(1, 'rgba(12, 10, 9, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add gentle luminous wave grid
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.03 * intensity})`;
      ctx.lineWidth = 1;
      const step = 80;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 20) {
          const wave = Math.sin(x * 0.005 + t + y * 0.003) * 15;
          if (y === 0) ctx.moveTo(x + wave, y);
          else ctx.lineTo(x + wave, y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
