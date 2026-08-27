import { useState } from 'react';
import { VERSES_DATA } from '../data/versesData';
import type { Verse } from '../types';

export function useDailyVerse() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentVerse: Verse = VERSES_DATA[currentIndex] || VERSES_DATA[0];

  const nextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % VERSES_DATA.length);
    setCopied(false);
  };

  const copyVerse = async () => {
    const textToCopy = `"${currentVerse.text}" — ${currentVerse.reference} (Rohkris SMKN 64 Jakarta)`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy verse:', err);
    }
  };

  return {
    currentVerse,
    nextVerse,
    copyVerse,
    copied,
    totalVerses: VERSES_DATA.length,
    currentIndex,
  };
}
