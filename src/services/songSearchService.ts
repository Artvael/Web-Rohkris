import type { Song } from '../types';

export async function searchOnlineSongs(query: string): Promise<Song[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const clean = query.trim().replace(/\s+/g, ' ');
    
    // Normalize common Indonesian Christian song split words
    const norm = clean
      .replace(/tangan\s*ku/gi, 'tanganku')
      .replace(/kasih\s*mu/gi, 'kasihmu')
      .replace(/hati\s*ku/gi, 'hatiku')
      .replace(/roh\s*kudus/gi, 'roh kudus')
      .replace(/janji\s*mu/gi, 'janjimu')
      .replace(/hidup\s*ku/gi, 'hidupku')
      .replace(/bapa\s*ku/gi, 'bapaku')
      .replace(/salib\s*mu/gi, 'salibmu')
      .replace(/allah\s*ku/gi, 'allahku');

    const words = norm.split(' ');
    
    // Build candidate search queries from most specific to broader keywords
    const candidateQueries = [
      clean,
      norm,
      words.length > 2 ? words.slice(0, 2).join(' ') : null,
      words.length > 2 ? words.slice(0, 3).join(' ') : null,
      words.length > 2 ? words.slice(-2).join(' ') : null,
      words[0].length >= 4 ? words[0] : null,
    ].filter(Boolean) as string[];

    const uniqueCandidates = [...new Set(candidateQueries)];

    const allMatches: any[] = [];
    const seenTitles = new Set<string>();

    for (const q of uniqueCandidates) {
      try {
        const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) continue;

        const data = await res.json();
        if (Array.isArray(data)) {
          for (const item of data) {
            const hasLyric = Boolean(item.plainLyrics || item.syncedLyrics);
            const titleKey = (item.trackName || '').toLowerCase().trim();
            if (hasLyric && titleKey && !seenTitles.has(titleKey)) {
              seenTitles.add(titleKey);
              allMatches.push(item);
            }
          }
        }
        if (allMatches.length >= 6) break;
      } catch (e) {
        // continue trying next query
      }
    }

    if (allMatches.length === 0) return [];

    return allMatches.slice(0, 8).map((item: any, idx: number) => {
      let rawLyrics = item.plainLyrics || '';

      // If only synced lyrics, strip timestamps
      if (!rawLyrics && item.syncedLyrics) {
        rawLyrics = item.syncedLyrics.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim();
      }

      // Detect praise vs worship
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
        chordsSnippet: 'Intro: G - C - D - Em / C - F - G - Am',
      };
    });
  } catch (err) {
    console.error('Failed to search online songs:', err);
    return [];
  }
}
