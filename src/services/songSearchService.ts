import type { Song } from '../types';

export async function searchOnlineSongs(query: string): Promise<Song[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const trimmed = query.trim();
    // Search lrclib (free public lyrics API, CORS supported)
    const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(trimmed)}`);
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    // Filter items that have lyrics
    const withLyrics = data.filter((item: any) => item.plainLyrics || item.syncedLyrics);

    return withLyrics.slice(0, 6).map((item: any, idx: number) => {
      let rawLyrics = item.plainLyrics || '';
      
      // If only synced lyrics, clean the [00:12.34] timestamps
      if (!rawLyrics && item.syncedLyrics) {
        rawLyrics = item.syncedLyrics.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim();
      }

      // Detect category based on lyrics keywords
      const lower = (rawLyrics + ' ' + (item.trackName || '')).toLowerCase();
      const isPraise =
        lower.includes('puji') ||
        lower.includes('sorak') ||
        lower.includes('bersuka') ||
        lower.includes('praise') ||
        lower.includes('dance') ||
        lower.includes('joy') ||
        lower.includes('clap') ||
        lower.includes('sing') ||
        lower.includes('haleluya') ||
        lower.includes('tari');

      const category: Song['category'] = isPraise ? 'Pujian' : 'Penyembahan';
      const tempo: Song['tempo'] = isPraise ? 'Upbeat / Praise' : 'Slow Worship';

      return {
        id: `online-${item.id || idx}-${Date.now()}`,
        title: item.trackName,
        artist: item.artistName || 'Lagu Rohani',
        key: 'G / C',
        tempo,
        category,
        lyrics: rawLyrics.trim(),
        chordsSnippet: 'Intro: G - C - D - Em (Akord Standar)',
      };
    });
  } catch (err) {
    console.error('Failed to search online songs:', err);
    return [];
  }
}
