import type { Song } from '../types';

function normalizeCompact(str: string): string {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Curated Indonesian Christian Rohani Song Repository for online / instant search.
 * Ensures fellowship and youth worship songs like "Ku Rasa Bahagia" are always found
 * with accurate lyrics and chord sheets even if third-party APIs have no data.
 */
const EXTENDED_ROHANI_CATALOG: Omit<Song, 'id'>[] = [
  {
    title: 'Ku Rasa Bahagia (Hari Ini Kurasa Bahagia)',
    artist: 'Lagu Persekutuan / Fellowship Rohkris',
    key: 'D / C',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Hari ini kurasa bahagia
Berkumpul bersama saudara seiman
Tuhan Yesus t'lah satukan kita
Tanpa memandang di antara kita

Bergandengan tangan dalam kasih
Dalam satu hati
Berjalan dalam terang kasih Tuhan

Reff:
Kau sahabatku, kau saudaraku
Tiada yang dapat memisahkan kita
Kau sahabatku, kau saudaraku
Tiada yang dapat memisahkan kita`,
    chordsSnippet: 'Intro: D - A/C# - Bm - A - G - D/F# - Em - A - D',
  },
  {
    title: 'Dalam Yesus Kita Bersaudara',
    artist: 'Lagu Persekutuan Rohkris',
    key: 'C / D',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Dalam Yesus kita bersaudara
Dalam Yesus kita bersaudara
Dalam Yesus kita bersaudara
Sekarang dan selamanya
Dalam Yesus kita bersaudara!`,
    chordsSnippet: 'Intro: C - G - C - G - C',
  },
  {
    title: 'Kasih Pasti Lemah Lembut',
    artist: 'Lagu Rohani / Pdt. Ir. Niko Njotorahardjo',
    key: 'D / E',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Kasih pasti lemah lembut
Kasih pasti memaafkan
Kasih pasti murah hati
Kasih-Mu kasih-Mu Tuhan

Reff:
Ajarilah kami ini saling mengasihi
Ajarilah kami ini saling memaafkan
Ajarilah kami ini kasih-Mu ya Tuhan
Kasih-Mu kudus tiada batasnya`,
    chordsSnippet: 'Intro: D - F#m - G - A - D',
  },
  {
    title: 'Bagi Tuhan Tak Ada Yang Mustahil',
    artist: 'Sari Simorangkir',
    key: 'G / A',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Ku yakin saat Kau berfirman
Ku menang saat Kau bertindak
Hidupku hanya ditentukan oleh perkataan-Mu

Ku aman kar'na Kau menjaga
Ku kuat kar'na Kau menopang
Hidupku hanya ditentukan oleh kuasa-Mu

Reff:
Bagi Tuhan tak ada yang mustahil
Bagi Tuhan tak ada yang tak mungkin
Mukjizat-Nya disediakan bagiku
Ku diangkat dan dipulihkan-Nya`,
    chordsSnippet: 'Intro: G - Em - C - D - G',
  },
  {
    title: 'Allah Peduli',
    artist: 'Jonathan Prawira',
    key: 'C / D',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Banyak perkara yang tak dapat ku mengerti
Mengapakah harus terjadi di dalam hidup ini
Satu perkara yang kusimpan dalam hati
Tiada satu pun 'kan terjadi tanpa Allah peduli

Reff:
Allah mengerti, Allah peduli
Segala persoalan yang kita hadapi
Tak akan pernah dibiarkan-Nya
Kubergumul sendiri s'bab Allah mengerti`,
    chordsSnippet: 'Intro: C - Em - F - Dm - G',
  },
  {
    title: 'Mujizat Itu Nyata',
    artist: 'Maria Shandi',
    key: 'G / A',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Tak terbatas kuasa-Mu Tuhan
Semua dapat Kau lakukan
Apa yang kelihatan mustahil bagiku
Itu sangat mungkin bagi-Mu

Reff:
Mujizat itu nyata disaat kupercaya
Mujizat itu nyata saat kuharap pada-Mu
Bagi Tuhan tak ada yang mustahil
Mujizat itu nyata bagiku`,
    chordsSnippet: 'Intro: G - D/F# - Em - C - Am - D',
  },
  {
    title: "Hati S'bagai Hamba",
    artist: 'Jacqlien Celosse',
    key: 'C / D',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Ku tak membawa apapun juga
Saat ku datang ke dunia
Ku tinggal semua pada akhirnya
Saat ku kembali ke surga

Reff:
Inilah yang kupunya
Hati s'bagai hamba
Yang mau taat dan setia
Pada-Mu Bapa
Kemanapun kubawa hati yang menyembah
Dalam roh dan kebenaran
Sampai s'lama-lamanya`,
    chordsSnippet: 'Intro: C - Em - F - G - C',
  },
  {
    title: 'Kudaki-daki Gunung Yang Tinggi',
    artist: 'Lagu Sekolah Minggu / Pujian Ceria',
    key: 'G / A',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Kudaki-daki daki-daki gunung yang tinggi
Kuturun-turun turun-turun lembah yang dalam
Kumelintasi padang rumput hijau membentang
Yesus besertaku

Reff:
Di kanan Kau ada, di kiri Kau ada
Di atas dan di bawah Kau ada
Di suka Kau ada, di duka pun Kau ada
Kar'na Engkau Yesusku!`,
    chordsSnippet: 'Intro: G - C - D - G (Ceria & Upbeat)',
  },
  {
    title: 'Bila Roh Allah Ada Di Dalam Hatiku',
    artist: 'Lagu Pujian Rohkris',
    key: 'Em / Am',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Bila Roh Allah ada di dalam hatiku
'Ku 'kan menari s'perti Daud menari
Bila Roh Allah ada di dalam hatiku
'Ku 'kan menari s'perti Daud menari

Reff:
'Ku 'kan menari, 'ku 'kan menari
'Ku 'kan menari s'perti Daud menari
'Ku 'kan menari, 'ku 'kan menari
'Ku 'kan menari s'perti Daud menari`,
    chordsSnippet: 'Intro: Em - B7 - Em (Tepuk Tangan & Riang)',
  },
  {
    title: 'Yesus Pokok dan Kitalah Carangnya',
    artist: 'Lagu Persekutuan / Sekolah Minggu',
    key: 'F / G',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Yesus pokok dan kitalah carangnya
Tinggalah di dalam-Nya
Yesus pokok dan kitalah carangnya
Tinggalah di dalam-Nya

Reff:
Pastilah kau berbuah
Pastilah kau berbuah
Tinggalah di dalam-Nya
Yesus pokok dan kitalah carangnya!`,
    chordsSnippet: 'Intro: F - Bb - C - F',
  },
  {
    title: 'Tuhan Pasti Sanggup',
    artist: 'Mike Mohede',
    key: 'D / E',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Kuatkanlah hatimu, lewati setiap persoalan
Tuhan Yesus selalu menopangmu
Jangan pernah menyerah, jangan berputus asa
Mukjizat Tuhan ada bagimu

Reff:
Tuhan pasti sanggup tangan-Nya takkan terlambat
Tuhan pasti sanggup 'tuk menolong hidupmu
Bagi Dia tiada perkara yang mustahil
Tuhan pasti sanggup!`,
    chordsSnippet: 'Intro: D - A/C# - Bm - G - Em - A',
  },
  {
    title: 'Waktu Tuhan Pasti Yang Terbaik',
    artist: 'NDC Worship',
    key: 'C / D',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Bila Kau ijinkan sesuatu terjadi
Kuprecaya semua untuk kebaikanku
Bila nanti telah tiba waktu-Mu
Kuprecaya kuasa-Mu memulihkanku

Reff:
Waktu Tuhan pasti yang terbaik
Walau kadang tak mudah kumengerti
Lewati cobaan, tetap percaya
Janji-Mu murni bagai emas perak`,
    chordsSnippet: 'Intro: C - G/B - Am - F - Dm - G',
  },
  {
    title: 'Sungguh Ku Bangga Bapa',
    artist: 'Lagu Rohani',
    key: 'D / E',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Sungguh ku bangga Bapa punya Allah seperti Engkau
Sungguh ku bangga Yesus atas s'gala pengorbanan-Mu
Tak ingin aku berpaling dari kasih-Mu
S'bab ku tahu Kau segalanya bagiku

Reff:
Pujian hormat kemuliaan
Kupersembahkan bagi-Mu Tuhan
Kekudusan dan keagungan
Hanya milik-Mu selamanya`,
    chordsSnippet: 'Intro: D - A/C# - Bm - G - A',
  },
  {
    title: "Jangan Lelah Bekerja di Ladang-Nya Tuhan",
    artist: 'Franky Sihombing',
    key: 'C / D',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Jangan lelah bekerja di ladang-Nya Tuhan
Roh Kudus yang b'ri kekuatan
Yang mengajar dan menopang
Tiada lelah bekerja bersama-Mu Tuhan
Yang selalu mencukupkan atas segalanya

Reff:
Ratakan tanah bergelombang
Timbunlah tanah yang berlubang
Menjadi siap dibangun di atas dasar iman`,
    chordsSnippet: 'Intro: C - F - G - C - Am - Dm - G - C',
  },
  {
    title: 'Kecaplah dan Lihatlah',
    artist: 'True Worshippers',
    key: 'G / A',
    tempo: 'Medium',
    category: 'Pujian',
    lyrics: `Kecaplah dan lihatlah betapa baiknya Tuhan itu
Rasakan dan nikmati kasih setia Tuhan

Reff:
Syukur bagi-Mu Tuhan atas segala berkat-Mu
Nama-Mu kutinggikan, Kau Allah yang setia
Syukur bagi-Mu Tuhan atas anugerah-Mu
Kupuji Kau s'lamanya`,
    chordsSnippet: 'Intro: G - C - G - D',
  },
  {
    title: 'Indah Rencana-Mu Tuhan',
    artist: 'Margaritha Zakhary',
    key: 'C / D',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Indah rencana-Mu Tuhan di dalam hidupku
Walau ku tak tahu dan ku tak mengerti semua jalan-Mu
Dulu ku tak tahu Tuhan, berat ku rasakan
Hati menderita dan ku tak berdaya menghadapi semua

Reff:
Tapi ku mengerti s'karang, Kau tolong padaku
Kini ku melihat dan ku merasakan indah rencana-Mu`,
    chordsSnippet: 'Intro: C - Em - F - Fm - C - G - C',
  },
  {
    title: 'Bapa Kupersembahkan Tubuhku',
    artist: 'Symphony Music',
    key: 'D / E',
    tempo: 'Slow Worship',
    category: 'Penyembahan',
    lyrics: `Bapa kupersembahkan tubuhku
S'bagai persembahan yang hidup
Kudus dan yang berkenan pada-Mu
S'bagai ibadah yang sejati

Reff:
Kusembah Kau Tuhan, kusembah Kau Tuhan
Kuserahkan hidupku kepada-Mu
Untuk kemuliaan nama-Mu`,
    chordsSnippet: 'Intro: D - G - A - D - Bm - Em - A - D',
  },
  {
    title: 'Yesus Sahabatku',
    artist: 'Franky Sihombing',
    key: 'E / F',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Yesus sahabatku, Kau mati bagiku
Besarlah kasih-Mu, sahabat yang setia
Kau angkat hidupku, Kau b'ri pengharapan
Tak pernah Kau tinggalkan diriku sendiri

Reff:
Kau Yesus sahabatku yang sejati
Kasih-Mu melampaui s'galanya
Kau Yesus sahabatku yang abadi
Kupuji Kau selama hidupku`,
    chordsSnippet: 'Intro: E - A - B - C#m - A - B - E',
  },
  {
    title: 'Kasih Yesus Manis dan Indah',
    artist: 'Lagu Sekolah Minggu / Ceria',
    key: 'D / E',
    tempo: 'Upbeat / Praise',
    category: 'Pujian',
    lyrics: `Kasih Yesus manis dan indah
Kasih Yesus manis dan indah
Kasih Yesus manis dan indah
Oh amat manis

Reff:
Lebih tinggi dari langit
Lebih dalam dari lautan
Lebih luas dari samud'ra
Oh amat manis!`,
    chordsSnippet: 'Intro: D - A - G - A - D',
  },
];

export async function searchOnlineSongs(query: string): Promise<Song[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const clean = query.trim().replace(/\s+/g, ' ');
    const compactQuery = normalizeCompact(clean);
    const queryWords = clean.toLowerCase().split(/\s+/).filter((w) => w.length >= 2);

    const matches: Song[] = [];
    const seenTitles = new Set<string>();

    // 1. Search in curated Christian Rohani Catalog first
    for (const item of EXTENDED_ROHANI_CATALOG) {
      const compactTitle = normalizeCompact(item.title);
      const compactLyrics = normalizeCompact(item.lyrics);
      const compactArtist = normalizeCompact(item.artist);

      const allWordsMatch =
        queryWords.length > 1 &&
        queryWords.every((w) => {
          const cw = normalizeCompact(w);
          return compactTitle.includes(cw) || compactLyrics.includes(cw) || compactArtist.includes(cw);
        });

      const isMatch =
        compactTitle.includes(compactQuery) ||
        compactLyrics.includes(compactQuery) ||
        compactArtist.includes(compactQuery) ||
        item.title.toLowerCase().includes(clean.toLowerCase()) ||
        item.lyrics.toLowerCase().includes(clean.toLowerCase()) ||
        allWordsMatch;

      if (isMatch) {
        const titleKey = item.title.toLowerCase().trim();
        if (!seenTitles.has(titleKey)) {
          seenTitles.add(titleKey);
          matches.push({
            ...item,
            id: `rohani-cat-${normalizeCompact(item.title).slice(0, 16)}-${Date.now()}`,
          });
        }
      }
    }

    // 2. Query external lyrics database (lrclib) for additional or international praise/worship songs
    // Only search lrclib if we haven't found sufficient exact Christian catalog matches
    if (matches.length < 6) {
      try {
        const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            for (const item of data) {
              const hasLyric = Boolean(item.plainLyrics || item.syncedLyrics);
              const trackName = (item.trackName || '').trim();
              const artistName = (item.artistName || '').trim();
              const plainLyrics = (item.plainLyrics || item.syncedLyrics || '').trim();

              if (!hasLyric || !trackName) continue;

              const compactTrack = normalizeCompact(trackName);
              const compactTrackLyrics = normalizeCompact(plainLyrics);

              // STRICT RELEVANCE CHECK:
              // Reject results that don't match the user's search query terms!
              // Prevents secular pop like "Yang Kurasa" when searching for "kurasa bahagia"
              let isRelevant = false;

              if (queryWords.length > 1) {
                // For multi-word queries (e.g. "kurasa bahagia"), all words with length >= 3
                // or the compact query phrase must be present in the song
                const majorWords = queryWords.filter((w) => w.length >= 3);
                const allMajorPresent = majorWords.length > 0 && majorWords.every((w) => {
                  const cw = normalizeCompact(w);
                  return compactTrack.includes(cw) || compactTrackLyrics.includes(cw);
                });
                isRelevant = compactTrack.includes(compactQuery) || allMajorPresent;
              } else {
                // Single word search: track name must contain or start with the query
                isRelevant = compactTrack.includes(compactQuery);
              }

              if (!isRelevant) continue;

              const titleKey = trackName.toLowerCase().trim();
              if (seenTitles.has(titleKey)) continue;

              seenTitles.add(titleKey);

              let rawLyrics = item.plainLyrics || '';
              if (!rawLyrics && item.syncedLyrics) {
                rawLyrics = item.syncedLyrics.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, '').trim();
              }

              // Detect praise vs worship
              const lower = (rawLyrics + ' ' + trackName).toLowerCase();
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

              matches.push({
                id: `online-${item.id || matches.length}-${Date.now()}`,
                title: trackName,
                artist: artistName || 'Lagu Rohani',
                key: 'G / C',
                tempo,
                category,
                lyrics: rawLyrics.trim(),
                chordsSnippet: 'Intro: G - C - D - Em / C - F - G - Am',
              });

              if (matches.length >= 8) break;
            }
          }
        }
      } catch (err) {
        console.warn('LRCLIB search skipped/failed:', err);
      }
    }

    return matches.slice(0, 8);
  } catch (err) {
    console.error('Failed to search online songs:', err);
    return [];
  }
}
