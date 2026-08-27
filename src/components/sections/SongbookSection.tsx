import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BorderGlow } from '../reactbits/BorderGlow';
import { SONGS_DATA } from '../../data/songsData';
import type { Song } from '../../types';
import { Music, Search, Disc, Copy, Check, X, Filter } from 'lucide-react';

export const SongbookSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeSongModal, setActiveSongModal] = useState<Song | null>(null);
  const [copiedSongId, setCopiedSongId] = useState<string | null>(null);

  const categories = ['Semua', 'Penyembahan', 'Pujian'];

  const filteredSongs = SONGS_DATA.filter((song) => {
    const matchSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.lyrics.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCategory === 'Semua' || song.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const handleCopyLyrics = (song: Song) => {
    const text = `${song.title} - ${song.artist}\nKey: ${song.key} | ${song.tempo}\n\n${song.chordsSnippet ? `[Chords]: ${song.chordsSnippet}\n\n` : ''}${song.lyrics}\n\n— Rohkris SMKN 64 Jakarta`;
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
            Kumpulan lagu pujian, penyembahan, dan akord kunci untuk tim worship dan jemaat Rohkris SMKN 64 Jakarta.
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
              placeholder="Cari judul lagu, artis, atau lirik..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-stone-100 text-xs transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-semibold flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-stone-900/80 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSongs.map((song) => (
            <BorderGlow
              key={song.id}
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
          ))}
        </div>

        {/* Song Details Lightbox Modal */}
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
                    className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
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
                  <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-sm leading-relaxed whitespace-pre-line font-mono">
                    {activeSongModal.lyrics}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
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
                    onClick={() => setActiveSongModal(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
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
