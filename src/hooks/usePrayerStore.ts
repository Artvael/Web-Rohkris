import { useState, useEffect } from 'react';
import type { PrayerRequest } from '../types';

const INITIAL_PRAYERS: PrayerRequest[] = [
  {
    id: 'pr-1',
    name: 'Anonim (Siswa Kelas XII)',
    classGrade: 'XII PPLG',
    topic: 'Pendidikan & Ujian',
    content: 'Mohon dukungan doa untuk persiapan Ujian Sekolah & kelanjutan studi ke perguruan tinggi negeri / universitas impian. Kiranya Tuhan beri hikmat dan ketenangan.',
    createdAt: 'Kemarin, 14:20 WIB',
    amenCount: 28,
    isPrayedFor: true,
  },
  {
    id: 'pr-2',
    name: 'Angelica',
    classGrade: 'XI DKV 1',
    topic: 'Keluarga',
    content: 'Doakan untuk pemulihan kesehatan Mama yang sedang dirawat dan damai sejahtera dalam keluarga kami.',
    createdAt: '2 hari yang lalu',
    amenCount: 42,
    isPrayedFor: true,
  },
  {
    id: 'pr-3',
    name: 'Samuel',
    classGrade: 'X AKL 2',
    topic: 'Pertumbuhan Rohani',
    content: 'Doakan supaya saya bisa lebih setia saat teduh setiap pagi dan berani menjadi teladan bagi teman-teman sekelas.',
    createdAt: '3 hari yang lalu',
    amenCount: 19,
    isPrayedFor: true,
  },
];

const STORAGE_KEY_PRAYERS = 'rohkris64_prayer_requests';
const STORAGE_KEY_VOTED_AMENS = 'rohkris64_voted_amens';

export function usePrayerStore() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>(INITIAL_PRAYERS);
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRAYERS);
      if (stored) {
        setPrayers(JSON.parse(stored));
      }
      const voted = localStorage.getItem(STORAGE_KEY_VOTED_AMENS);
      if (voted) {
        setVotedIds(JSON.parse(voted));
      }
    } catch (e) {
      console.warn('Failed to load prayers from storage', e);
    }
  }, []);

  const savePrayers = (newPrayers: PrayerRequest[]) => {
    setPrayers(newPrayers);
    try {
      localStorage.setItem(STORAGE_KEY_PRAYERS, JSON.stringify(newPrayers));
    } catch (e) {
      console.warn('Failed to save prayers to storage', e);
    }
  };

  const addPrayer = (prayer: Omit<PrayerRequest, 'id' | 'createdAt' | 'amenCount' | 'isPrayedFor'>) => {
    const newPrayer: PrayerRequest = {
      ...prayer,
      id: 'pr-' + Date.now(),
      createdAt: 'Baru saja',
      amenCount: 1,
      isPrayedFor: true,
    };
    const updated = [newPrayer, ...prayers];
    savePrayers(updated);
    return newPrayer;
  };

  const toggleAmen = (id: string) => {
    const hasVoted = votedIds.includes(id);
    const updatedPrayers = prayers.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          amenCount: hasVoted ? Math.max(0, p.amenCount - 1) : p.amenCount + 1,
        };
      }
      return p;
    });

    const updatedVoted = hasVoted
      ? votedIds.filter((vId) => vId !== id)
      : [...votedIds, id];

    savePrayers(updatedPrayers);
    setVotedIds(updatedVoted);
    try {
      localStorage.setItem(STORAGE_KEY_VOTED_AMENS, JSON.stringify(updatedVoted));
    } catch (e) {
      console.warn('Failed to save voted amens to storage', e);
    }
  };

  const deletePrayer = (id: string) => {
    const updated = prayers.filter((p) => p.id !== id);
    savePrayers(updated);
  };

  return {
    prayers,
    votedIds,
    addPrayer,
    toggleAmen,
    deletePrayer,
  };
}
