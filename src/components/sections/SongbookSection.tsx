import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectionBox } from '../common/SelectionBox';
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

    const normTerm = term
      .replace(/tangan\s*ku/gi, 'tanganku')
      .replace(/kasih\s*mu/gi, 'kasihmu')
      .replace(/hati\s*ku/gi, 'hatiku')
      .replace(/roh\s*kudus/gi, 'roh kudus')
      .replace(/janji\s*mu/gi, 'janjimu')
      .replace(/ku/gi, '')
      .replace(/mu/gi, '')
      .replace(/nya/gi, '');

    const normTitle = song.title
      .toLowerCase()
      .replace(/tangan\s*ku/gi, 'tanganku')
      .replace(/kasih\s*mu/gi, 'kasihmu')
      .replace(/hati\s*ku/gi, 'hatiku')
      .replace(/roh\s*kudus/gi, 'roh kudus')
      .replace(/janji\s*mu/gi, 'janjimu')
      .replace(/ku/gi, '')
      .replace(/mu/gi, '')
      .replace(/nya/gi, '');

    const matchesSearch =
      song.title.toLowerCase().includes(term) ||
      song.artist.toLowerCase().includes(term) ||
      song.lyrics.toLowerCase().includes(term) ||
      normTitle.includes(normTerm);

    const matchesCategory =
      selectedCategory === 'Semua' || song.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const filteredOnlineSongs = onlineSongs.filter((song) => {
    if (selectedCategory === 'Semua') return true;
    return song.category === selectedCategory;
  });

  const handleCopyLyrics = (song: Song) => {
    const textToCopy = `${song.title} - ${song.artist}\nKey: ${song.key}\n\n${
      song.chordsSnippet ? `Chords: ${song.chordsSnippet}\n\n` : ''
    }${song.lyrics}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedSongId(song.id);
    setTimeout(() => setCopiedSongId(null), 2500);
  };

  return (
    <section id="lagu" className="py-16 md:py-24 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#efeedc] text-[#343831] border border-[#343831]">
            <Music className="w-3.5 h-3.5 text-[#8c6a49]" />
            <span>Pujian & Penyembahan</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#282828] font-['Outfit'] tracking-tight">
            Bank Lagu & Lirik Rohani
          </h2>
          <p className="text-[#575a53] text-sm md:text-base leading-relaxed">
            Kumpulan lagu pujian, penyembahan, dan akord kunci untuk tim worship dan jemaat Rohkris SMKN 64 Jakarta. Dilengkapi fitur pencarian lirik online otomatis!
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c6a49]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleManualSearchOnline();
              }}
              placeholder="Cari judul lagu (contoh: Give Thanks, Way Maker)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#ffffff] border border-[#e6e3d1] focus:border-[#343831] text-[#282828] text-xs transition-all outline-none shadow-xs"
            />
            {isSearchingOnline && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c6a49] animate-spin" />
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#62665a] font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#8c6a49]" />
              Kategori:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  whileTap={{ scale: 0.94 }}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected ? 'text-[#282828] font-bold' : 'text-[#62665a] hover:text-[#282828]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeSongCategoryPill"
                      className="absolute inset-0 bg-[#c5de9b] rounded-full border border-[#343831] shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-[#efeedc] rounded-full border border-[#e6e3d1] -z-20" />
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
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#efeedc] border border-[#e6e3d1] text-xs text-[#282828] max-w-3xl mx-auto shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8c6a49] flex-shrink-0" />
              <span>
                Mencari: <strong className="text-[#282828]">"{searchTerm}"</strong>{' '}
                {isSearchingOnline ? (
                  <span className="text-[#8c6a49] font-medium">(Sedang mencari lirik online...)</span>
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
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#c5de9b] hover:bg-[#b8d488] text-[#282828] font-bold border border-[#343831] transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#343831]" />
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
                  whileHover={{ y: -3 }}
                  className="h-full"
                >
                  <SelectionBox className="h-full rounded-2xl">
                    <div
                      onClick={() => setActiveSongModal(song)}
                      className="p-6 rounded-2xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-xs flex flex-col justify-between h-full space-y-4 cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#efeedc] text-[#343831] border border-[#e6e3d1]">
                            {song.category}
                          </span>
                          <span className="text-xs text-[#8c6a49] font-mono bg-[#ffffff] px-2 py-0.5 rounded border border-[#e6e3d1]">
                            Key: {song.key}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-[#282828] font-['Outfit'] group-hover:text-[#8c6a49] transition-colors">
                            {song.title}
                          </h4>
                          <p className="text-xs text-[#62665a] flex items-center gap-1.5 mt-0.5">
                            <Disc className="w-3 h-3 text-[#8c6a49]" />
                            <span>{song.artist}</span>
                            <span>•</span>
                            <span>{song.tempo}</span>
                          </p>
                        </div>

                        <p className="text-[#575a53] text-xs italic line-clamp-3 leading-relaxed whitespace-pre-line bg-[#ffffff] p-3 rounded-xl border border-[#e6e3d1]">
                          {song.lyrics}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#e6e3d1] flex items-center justify-between text-xs">
                        <span className="text-[#3e502c] font-semibold hover:underline">
                          Lihat Lirik Lengkap & Chords →
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLyrics(song);
                          }}
                          className="p-1.5 rounded-full bg-[#efeedc] hover:bg-[#c5de9b] text-[#282828] border border-[#343831] transition-colors cursor-pointer shadow-xs"
                          title="Salin Lirik"
                        >
                          {copiedSongId === song.id ? (
                            <Check className="w-3.5 h-3.5 text-[#3e502c]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </SelectionBox>
                </motion.div>
              ))}
            </div>
          )}

          {/* Online Songs Results */}
          {filteredOnlineSongs.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#e6e3d1]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8c6a49]" />
                <h3 className="text-sm font-bold text-[#282828] uppercase tracking-wider">
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
                    whileHover={{ y: -3 }}
                    className="h-full"
                  >
                    <SelectionBox className="h-full rounded-2xl">
                      <div
                        onClick={() => setActiveSongModal(song)}
                        className="p-6 rounded-2xl bg-[#f7f6ec] border border-[#e6e3d1] shadow-xs flex flex-col justify-between h-full space-y-4 cursor-pointer"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#efeedc] text-[#343831] border border-[#e6e3d1]">
                              <Sparkles className="w-3 h-3 text-[#8c6a49]" />
                              {song.category} • Online
                            </span>
                            <span className="text-xs text-[#8c6a49] font-mono bg-[#ffffff] px-2 py-0.5 rounded border border-[#e6e3d1]">
                              Key: {song.key}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold text-[#282828] font-['Outfit'] group-hover:text-[#8c6a49] transition-colors">
                              {song.title}
                            </h4>
                            <p className="text-xs text-[#62665a] flex items-center gap-1.5 mt-0.5">
                              <Disc className="w-3 h-3 text-[#8c6a49]" />
                              <span>{song.artist}</span>
                              <span>•</span>
                              <span>{song.tempo}</span>
                            </p>
                          </div>

                          <p className="text-[#575a53] text-xs italic line-clamp-3 leading-relaxed whitespace-pre-line bg-[#ffffff] p-3 rounded-xl border border-[#e6e3d1]">
                            {song.lyrics}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-[#e6e3d1] flex items-center justify-between text-xs">
                          <span className="text-[#3e502c] font-semibold hover:underline">
                            Buka Lirik & Chords →
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveToBank(song);
                              }}
                              className="p-1.5 rounded-full bg-[#efeedc] hover:bg-[#c5de9b] text-[#282828] border border-[#343831] transition-colors cursor-pointer shadow-xs"
                              title="Simpan ke Bank Lagu"
                            >
                              {savedSongIds.includes(song.id) ||
                              localSongs.some((s) => s.title === song.title) ? (
                                <BookmarkCheck className="w-3.5 h-3.5 text-[#3e502c]" />
                              ) : (
                                <BookmarkPlus className="w-3.5 h-3.5 text-[#8c6a49]" />
                              )}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyLyrics(song);
                              }}
                              className="p-1.5 rounded-full bg-[#efeedc] hover:bg-[#c5de9b] text-[#282828] border border-[#343831] transition-colors cursor-pointer shadow-xs"
                              title="Salin Lirik"
                            >
                              {copiedSongId === song.id ? (
                                <Check className="w-3.5 h-3.5 text-[#3e502c]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </SelectionBox>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredLocalSongs.length === 0 &&
            filteredOnlineSongs.length === 0 &&
            !isSearchingOnline && (
              <div className="text-center py-12 px-4 rounded-3xl bg-[#f7f6ec] border border-[#e6e3d1] space-y-4 max-w-md mx-auto shadow-xs">
                <Music className="w-10 h-10 text-[#8c6a49] mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#282828] font-['Outfit']">
                    Lagu belum ditemukan di bank lokal
                  </h4>
                  <p className="text-xs text-[#575a53]">
                    Ketik judul lagu yang ingin dicari, sistem akan otomatis mencarikan liriknya dari database online!
                  </p>
                </div>
                {searchTerm.trim().length >= 2 && (
                  <button
                    onClick={handleManualSearchOnline}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c5de9b] hover:bg-[#b8d488] text-[#282828] font-bold text-xs border border-[#343831] shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#343831]" />
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#282828]/85 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-2xl w-full bg-[#f7f6ec] rounded-3xl overflow-hidden border border-[#e6e3d1] p-6 md:p-8 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#efeedc] text-[#343831] border border-[#343831]">
                      {activeSongModal.category} • {activeSongModal.tempo}
                    </span>
                    <h3 className="text-2xl font-bold text-[#282828] font-['Outfit'] mt-2">
                      {activeSongModal.title}
                    </h3>
                    <p className="text-xs text-[#575a53] font-medium">
                      Oleh: {activeSongModal.artist} • Kunci Nada: {activeSongModal.key}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveSongModal(null)}
                    className="p-2 rounded-full bg-[#efeedc] hover:bg-[#c5de9b] text-[#282828] border border-[#343831] transition-colors cursor-pointer shadow-xs"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activeSongModal.chordsSnippet && (
                  <div className="p-3.5 rounded-2xl bg-[#efeedc] border border-[#e6e3d1] text-[#8c6a49] text-xs font-mono">
                    <span className="font-bold">Panduan Akord:</span> {activeSongModal.chordsSnippet}
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#62665a] uppercase tracking-wider">Lirik Lagu:</h4>
                  <div className="p-5 rounded-2xl bg-[#ffffff] border border-[#e6e3d1] text-[#282828] text-sm leading-relaxed whitespace-pre-line font-mono select-text shadow-xs">
                    {activeSongModal.lyrics}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e6e3d1]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLyrics(activeSongModal)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#c5de9b] hover:bg-[#b8d488] text-[#282828] font-bold text-xs border border-[#343831] shadow-xs transition-all cursor-pointer"
                    >
                      {copiedSongId === activeSongModal.id ? (
                        <>
                          <Check className="w-4 h-4 text-[#3e502c]" />
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
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#efeedc] hover:bg-[#c5de9b] text-[#282828] text-xs font-semibold border border-[#343831] shadow-xs transition-all cursor-pointer"
                      title="Simpan ke Bank Lagu Lokal"
                    >
                      {savedSongIds.includes(activeSongModal.id) ||
                      localSongs.some((s) => s.title === activeSongModal.title) ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-[#3e502c]" />
                          <span>Tersimpan di Bank</span>
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="w-4 h-4 text-[#8c6a49]" />
                          <span>Simpan ke Bank</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveSongModal(null)}
                    className="px-4 py-2 rounded-full bg-[#efeedc] hover:bg-[#e6e3d1] text-[#282828] border border-[#e6e3d1] text-xs font-semibold cursor-pointer shadow-xs"
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

