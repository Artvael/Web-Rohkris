import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CounterProps {
  value: number;
  duration?: number; // in seconds
  prefix?: string;
  suffix?: string;
  className?: string;
  digitClassName?: string;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  digitClassName = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const easeOutQuart = (x: number): number => {
      return 1 - Math.pow(1 - x, 4);
    };

    const timer = setInterval(() => {
      frame++;
      const progress = easeOutQuart(frame / totalFrames);
      const current = Math.round(start + (end - start) * progress);
      setDisplayValue(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setDisplayValue(end);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={`inline-flex items-center font-bold tracking-tight ${className}`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className={digitClassName}
      >
        {displayValue.toLocaleString('id-ID')}
      </motion.span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
