import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderGlow } from '../reactbits/BorderGlow';
import { SONGS_DATA } from '../../data/songsData';
import { searchOnlineSongs } from '../../services/songSearchService';
import type { Song } from '../../types';
import {
  Music,
  Search,
  Disc,
  Copy,
  Check,
  X,
  Filter,
  Sparkles,
  Globe,
  Loader2,
  BookmarkPlus,
  BookmarkCheck,
} from 'lucide-react';

export const SongbookSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeSongModal, setActiveSongModal] = useState<Song | null>(null);
  const [copiedSongId, setCopiedSongId] = useState<string | null>(null);

  // Online search state
  const [onlineSongs, setOnlineSongs] = useState<Song[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [savedSongIds, setSavedSongIds] = useState<string[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categories = ['Semua', 'Penyembahan', 'Pujian'];

  // Load custom saved songs from localStorage on mount
  const [localSongs, setLocalSongs] = useState<Song[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rohkris64_custom_songs');
        if (saved) return [...JSON.parse(saved), ...SONGS_DATA];
      } catch (e) {
        console.error(e);
      }
    }
    return SONGS_DATA;
  });

  const handleSaveToBank = (song: Song) => {
    if (localSongs.some((s) => s.title.toLowerCase() === song.title.toLowerCase())) {
      return;
    }
    const updated = [song, ...localSongs];
    setLocalSongs(updated);
    setSavedSongIds((prev) => [...prev, song.id]);
    try {
      const customOnly = updated.filter(
        (s) => !SONGS_DATA.some((def) => def.id === s.id)
      );
      localStorage.setItem('rohkris64_custom_songs', JSON.stringify(customOnly));
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger online search automatically when typing with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim().length >= 3) {
      setIsSearchingOnline(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchOnlineSongs(searchTerm);
        // Exclude songs already in localSongs
        const newResults = results.filter(
          (online) =>
            !localSongs.some(
              (loc) => loc.title.toLowerCase() === online.title.toLowerCase()
            )
        );
        setOnlineSongs(newResults);
        setIsSearchingOnline(false);
      }, 500);
    } else {
      setOnlineSongs([]);
      setIsSearchingOnline(false);
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, localSongs]);

  const handleManualSearchOnline = async () => {
    if (!searchTerm.trim()) return;
    setIsSearchingOnline(true);
    const results = await searchOnlineSongs(searchTerm);
    const newResults = results.filter(
      (online) =>
        !localSongs.some(
          (loc) => loc.title.toLowerCase() === online.title.toLowerCase()
        )
    );
    setOnlineSongs(newResults);
    setIsSearchingOnline(false);
  };

  const filteredLocalSongs = localSongs.filter((song) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return selectedCategory === 'Semua' || song.category === selectedCategory;

    // Normalizations for matching
    const normTerm = term
      .replace(/tangan\s*ku/gi, 'tanganku')
      .replace(/kasih\s*mu/gi, 'kasihmu')
      .replace(/hati\s*ku/gi, 'hatiku')
      .replace(/roh\s*kudus/gi, 'roh kudus')
      .replace(/janji\s*mu/gi, 'janjimu')
      .replace(/hidup\s*ku/gi, 'hidupku');

    const songText = `${song.title} ${song.artist} ${song.lyrics}`.toLowerCase();

    // 1. Direct or normalized match
    const directMatch = songText.includes(term) || songText.includes(normTerm);

    // 2. Multi-word match: every word (>= 3 chars) is in song text
    const words = normTerm.split(/\s+/).filter((w) => w.length >= 3);
    const wordsMatch = words.length > 1 && words.every((w) => songText.includes(w));

    const matchSearch = directMatch || wordsMatch;
    const matchCategory =
      selectedCategory === 'Semua' || song.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const filteredOnlineSongs = onlineSongs.filter((song) => {
    if (selectedCategory === 'Semua') return true;
    return song.category === selectedCategory;
  });

  const handleCopyLyrics = (song: Song) => {
    const text = `${song.title} - ${song.artist}\nKey: ${song.key} | ${song.tempo}\n\n${
      song.chordsSnippet ? `[Chords]: ${song.chordsSnippet}\n\n` : ''
    }${song.lyrics}\n\n— Rohkris SMKN 64 Jakarta`;
    navigator.clipboard.writeText(text);
    setCopiedSongId(song.id);
    setTimeout(() => setCopiedSongId(null), 2500);
  };

  return (
    <section id="lagu" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Music className="w-3.5 h-3.5" />
            <span>Pujian & Penyembahan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Bank Lagu & Lirik Rohani
          </h2>
          <p className="text-stone-300 text-sm md:text-base leading-relaxed">
            Kumpulan lagu pujian, penyembahan, dan akord kunci untuk tim worship dan jemaat Rohkris SMKN 64 Jakarta. Dilengkapi fitur pencarian lirik online otomatis!
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualSearchOnline();
              }}
              placeholder="Cari judul lagu (contoh: Give Thanks, Way Maker)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-stone-100 text-xs transition-all outline-none"
            />
            {isSearchingOnline && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 animate-spin" />
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-stone-400 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              Kategori:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  whileTap={{ scale: 0.94 }}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected ? 'text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeSongCategoryPill"
                      className="absolute inset-0 bg-amber-500 rounded-xl shadow-md shadow-amber-500/25 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-stone-900/80 rounded-xl border border-stone-800 -z-20" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Online Search Status Banner */}
        {searchTerm.trim().length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 max-w-3xl mx-auto shadow-lg shadow-amber-500/5"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Mencari: <strong className="text-white">"{searchTerm}"</strong>{' '}
                {isSearchingOnline ? (
                  <span className="text-amber-400 font-medium">(Sedang mencari lirik online...)</span>
                ) : (
                  <span>
                    • Ditemukan {filteredLocalSongs.length} di bank lokal, {filteredOnlineSongs.length} dari web.
                  </span>
                )}
              </span>
            </div>

            {!isSearchingOnline && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleManualSearchOnline}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Cari Ulang</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Songs Grid: Local Songs */}
        <div className="space-y-4">
          {filteredLocalSongs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLocalSongs.map((song, idx) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <BorderGlow
                    glowColor="rgba(245, 158, 11, 0.3)"
                    borderRadius="1.25rem"
                    className="h-full group cursor-pointer"
                  >
                    <div
                      onClick={() => setActiveSongModal(song)}
                      className="p-6 flex flex-col justify-between h-full space-y-4"
                    >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          {song.category}
                        </span>
                        <span className="text-xs text-stone-400 font-mono bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                          Key: {song.key}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-amber-300 transition-colors">
                          {song.title}
                        </h4>
                        <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <Disc className="w-3 h-3 text-amber-400" />
                          <span>{song.artist}</span>
                          <span>•</span>
                          <span>{song.tempo}</span>
                        </p>
                      </div>

                      <p className="text-stone-300 text-xs italic line-clamp-3 leading-relaxed whitespace-pre-line bg-stone-950/50 p-3 rounded-xl border border-stone-850">
                        {song.lyrics}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-semibold group-hover:underline">
                        Lihat Lirik Lengkap & Chords →
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLyrics(song);
                        }}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-500 text-stone-300 hover:text-stone-950 transition-colors"
                        title="Salin Lirik"
                      >
                        {copiedSongId === song.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </BorderGlow>
                </motion.div>
              ))}
            </div>
          )}

          {/* Online Songs Results */}
          {filteredOnlineSongs.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-stone-800/80">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hasil Pencarian Lirik Online ({filteredOnlineSongs.length} Lagu Ditemukan)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredOnlineSongs.map((song, idx) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    whileHover={{ y: -5 }}
                    className="h-full"
                  >
                  <BorderGlow
                    glowColor="rgba(56, 189, 248, 0.3)"
                    borderRadius="1.25rem"
                    className="h-full group cursor-pointer border-amber-500/30"
                  >
                    <div
                      onClick={() => setActiveSongModal(song)}
                      className="p-6 flex flex-col justify-between h-full space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Sparkles className="w-3 h-3" />
                            {song.category} • Online
                          </span>
                          <span className="text-xs text-stone-400 font-mono bg-stone-950 px-2 py-0.5 rounded border border-stone-800">
                            Key: {song.key}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-amber-300 transition-colors">
                            {song.title}
                          </h4>
                          <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                            <Disc className="w-3 h-3 text-amber-400" />
                            <span>{song.artist}</span>
                            <span>•</span>
                            <span>{song.tempo}</span>
                          </p>
                        </div>

                        <p className="text-stone-300 text-xs italic line-clamp-3 leading-relaxed whitespace-pre-line bg-stone-950/50 p-3 rounded-xl border border-stone-850">
                          {song.lyrics}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-semibold group-hover:underline">
                          Buka Lirik & Chords →
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveToBank(song);
                            }}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-500 text-stone-300 hover:text-stone-950 transition-colors"
                            title="Simpan ke Bank Lagu"
                          >
                            {savedSongIds.includes(song.id) ||
                            localSongs.some((s) => s.title === song.title) ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <BookmarkPlus className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLyrics(song);
                            }}
                            className="p-1.5 rounded-lg bg-stone-800 hover:bg-amber-500 text-stone-300 hover:text-stone-950 transition-colors"
                            title="Salin Lirik"
                          >
                            {copiedSongId === song.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </BorderGlow>
                </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredLocalSongs.length === 0 &&
            filteredOnlineSongs.length === 0 &&
            !isSearchingOnline && (
              <div className="text-center py-12 px-4 rounded-2xl bg-stone-900/40 border border-stone-800 space-y-4 max-w-md mx-auto">
                <Music className="w-10 h-10 text-stone-500 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white font-['Outfit']">
                    Lagu belum ditemukan di bank lokal
                  </h4>
                  <p className="text-xs text-stone-400">
                    Ketik judul lagu yang ingin dicari, sistem akan otomatis mencarikan liriknya dari database online!
                  </p>
                </div>
                {searchTerm.trim().length >= 2 && (
                  <button
                    onClick={handleManualSearchOnline}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Cari "{searchTerm}" di Web Sekarang</span>
                  </button>
                )}
              </div>
            )}
        </div>

        {/* Song Details Lightbox Modal (Exact design match) */}
        <AnimatePresence>
          {activeSongModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSongModal(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-2xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-amber-500/30 p-6 md:p-8 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {activeSongModal.category} • {activeSongModal.tempo}
                    </span>
                    <h3 className="text-2xl font-black text-white font-['Outfit'] mt-2">
                      {activeSongModal.title}
                    </h3>
                    <p className="text-xs text-stone-400 font-medium">
                      Oleh: {activeSongModal.artist} • Kunci Nada: {activeSongModal.key}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveSongModal(null)}
                    className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activeSongModal.chordsSnippet && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono">
                    <span className="font-bold">Panduan Akord:</span> {activeSongModal.chordsSnippet}
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Lirik Lagu:</h4>
                  <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-sm leading-relaxed whitespace-pre-line font-mono select-text">
                    {activeSongModal.lyrics}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLyrics(activeSongModal)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      {copiedSongId === activeSongModal.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-950" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin Lirik & Chord</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleSaveToBank(activeSongModal)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
                      title="Simpan ke Bank Lagu Lokal"
                    >
                      {savedSongIds.includes(activeSongModal.id) ||
                      localSongs.some((s) => s.title === activeSongModal.title) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                          <span>Tersimpan di Bank</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-4 h-4 text-amber-400" />
                          <span>Simpan ke Bank</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveSongModal(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

