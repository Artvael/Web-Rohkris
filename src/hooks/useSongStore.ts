import { useState, useEffect, useCallback } from 'react';
import type { Song } from '../types';
import { SONGS_DATA } from '../data/songsData';

const STORAGE_KEY_SONGS = 'rohkris64_songbook_songs';

export function useSongStore() {
  const [songs, setSongs] = useState<Song[]>(() => {
    if (typeof window === 'undefined') return SONGS_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SONGS);
      if (stored) return JSON.parse(stored);
      const legacyCustom = localStorage.getItem('rohkris64_custom_songs');
      if (legacyCustom) {
        return [...JSON.parse(legacyCustom), ...SONGS_DATA];
      }
      return SONGS_DATA;
    } catch {
      return SONGS_DATA;
    }
  });

  const saveSongs = useCallback((newSongs: Song[]) => {
    setSongs(newSongs);
    try {
      localStorage.setItem(STORAGE_KEY_SONGS, JSON.stringify(newSongs));
      window.dispatchEvent(new CustomEvent('rohkris64_songs_change', { detail: newSongs }));
    } catch (e) {
      console.warn('Failed to save songs', e);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Song[]>;
      if (custom.detail) setSongs(custom.detail);
    };
    window.addEventListener('rohkris64_songs_change', handler);
    return () => window.removeEventListener('rohkris64_songs_change', handler);
  }, []);

  const addSong = (song: Omit<Song, 'id'>) => {
    const slug = song.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newSong: Song = {
      ...song,
      id: 's-' + slug + '-' + Date.now().toString().slice(-4),
    };
    const updated = [newSong, ...songs];
    saveSongs(updated);
    return newSong;
  };

  const updateSong = (id: string, fields: Partial<Omit<Song, 'id'>>) => {
    const updated = songs.map((s) => (s.id === id ? { ...s, ...fields } : s));
    saveSongs(updated);
  };

  const deleteSong = (id: string) => {
    const updated = songs.filter((s) => s.id !== id);
    saveSongs(updated);
  };

  const resetToDefault = () => {
    saveSongs(SONGS_DATA);
  };

  return {
    songs,
    addSong,
    updateSong,
    deleteSong,
    resetToDefault,
  };
}
