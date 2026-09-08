import { useState, useEffect, useCallback } from 'react';
import type { PrayerRequest } from '../types';
import { supabase, isSupabaseConfigured, type DbPrayerRequest } from '../lib/supabase';

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

function formatCreatedAt(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 2) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function mapDbToPrayer(row: DbPrayerRequest): PrayerRequest {
  return {
    id: String(row.id),
    name: row.name,
    classGrade: row.class_grade || undefined,
    topic: row.topic as PrayerRequest['topic'],
    content: row.content,
    createdAt: formatCreatedAt(row.created_at),
    amenCount: Number(row.amen_count) || 0,
    isPrayedFor: true,
  };
}

export function usePrayerStore() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PRAYERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRAYERS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Initial storage read error', e);
    }
    return INITIAL_PRAYERS;
  });

  const [votedIds, setVotedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const voted = localStorage.getItem(STORAGE_KEY_VOTED_AMENS);
      return voted ? JSON.parse(voted) : [];
    } catch {
      return [];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const saveLocalBackup = useCallback((newPrayers: PrayerRequest[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_PRAYERS, JSON.stringify(newPrayers));
    } catch (e) {
      console.warn('Failed to save prayers to local backup', e);
    }
  }, []);

  // Fetch initial prayers from Supabase
  const fetchPrayers = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, using local fallback:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const mapped = data.map(mapDbToPrayer);
        setPrayers(mapped);
        saveLocalBackup(mapped);
      }
    } catch (err) {
      console.warn('Failed to fetch from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [saveLocalBackup]);

  // Real-time subscription
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    fetchPrayers();

    const channelName = 'prayers_' + Math.random().toString(36).substring(2, 9);
    let channel: any = null;

    try {
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'prayer_requests' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newPrayer = mapDbToPrayer(payload.new as DbPrayerRequest);
              setPrayers((prev) => {
                if (prev.some((p) => p.id === newPrayer.id)) return prev;
                const updated = [newPrayer, ...prev];
                saveLocalBackup(updated);
                return updated;
              });
            } else if (payload.eventType === 'UPDATE') {
              const updated = mapDbToPrayer(payload.new as DbPrayerRequest);
              setPrayers((prev) => {
                const next = prev.map((p) =>
                  p.id === updated.id
                    ? { ...p, amenCount: updated.amenCount, content: updated.content }
                    : p
                );
                saveLocalBackup(next);
                return next;
              });
            } else if (payload.eventType === 'DELETE') {
              const deletedId = String(payload.old?.id);
              setPrayers((prev) => {
                const next = prev.filter((p) => p.id !== deletedId);
                saveLocalBackup(next);
                return next;
              });
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription error:', e);
    }

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchPrayers, saveLocalBackup]);

  const addPrayer = async (
    prayer: Omit<PrayerRequest, 'id' | 'createdAt' | 'amenCount' | 'isPrayedFor'>
  ) => {
    const tempId = 'pr-' + Date.now();
    const optimisticPrayer: PrayerRequest = {
      ...prayer,
      id: tempId,
      createdAt: 'Baru saja',
      amenCount: 1,
      isPrayedFor: true,
    };

    // Optimistic UI update
    setPrayers((prev) => {
      const updated = [optimisticPrayer, ...prev];
      saveLocalBackup(updated);
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('prayer_requests')
          .insert([
            {
              name: prayer.name,
              class_grade: prayer.classGrade || null,
              topic: prayer.topic,
              content: prayer.content,
              amen_count: 1,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          const saved = mapDbToPrayer(data as DbPrayerRequest);
          setPrayers((prev) => {
            const next = prev.map((p) => (p.id === tempId ? saved : p));
            saveLocalBackup(next);
            return next;
          });
          return saved;
        } else if (error) {
          console.warn('Supabase insert error:', error.message);
        }
      } catch (e) {
        console.warn('Failed to insert into Supabase, retained in local storage', e);
      }
    }

    return optimisticPrayer;
  };

  const toggleAmen = async (id: string) => {
    const hasVoted = votedIds.includes(id);
    const targetPrayer = prayers.find((p) => p.id === id);
    const newCount = targetPrayer
      ? hasVoted
        ? Math.max(0, targetPrayer.amenCount - 1)
        : targetPrayer.amenCount + 1
      : 0;

    // Optimistic UI update
    setPrayers((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, amenCount: newCount } : p));
      saveLocalBackup(next);
      return next;
    });

    const updatedVoted = hasVoted
      ? votedIds.filter((vId) => vId !== id)
      : [...votedIds, id];
    setVotedIds(updatedVoted);
    try {
      localStorage.setItem(STORAGE_KEY_VOTED_AMENS, JSON.stringify(updatedVoted));
    } catch (e) {
      console.warn('Failed to persist voted amens', e);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('prayer_requests')
          .update({ amen_count: newCount })
          .eq('id', id);
      } catch (e) {
        console.warn('Failed to update amen count on Supabase', e);
      }
    }
  };

  const deletePrayer = async (id: string) => {
    setPrayers((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveLocalBackup(next);
      return next;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('prayer_requests').delete().eq('id', id);
      } catch (e) {
        console.warn('Failed to delete prayer from Supabase', e);
      }
    }
  };

  return {
    prayers,
    votedIds,
    isLoading,
    isLive: isSupabaseConfigured,
    addPrayer,
    toggleAmen,
    deletePrayer,
    refreshPrayers: fetchPrayers,
  };
}
