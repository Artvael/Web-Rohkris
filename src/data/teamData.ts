import type { TeamMember, DivisionInfo } from '../types';

export const DIVISIONS_DATA: DivisionInfo[] = [
  {
    id: 'bph',
    name: 'Pembina & BPH',
    shortName: 'Pembina & BPH',
    iconName: 'Crown',
    description: 'Dewan Guru Pembina dan Badan Pengurus Harian yang memimpin serta mengoordinasi seluruh pelayanan Rohkris.',
    leader: 'Junaedy Benares Valentino',
  },
  {
    id: 'xii',
    name: 'Pengurus Kelas XII',
    shortName: 'Angkatan XII',
    iconName: 'Crown',
    description: 'Siswa-siswi kelas XII yang menjadi teladan dan pilar pelayanan di tahun terakhir mereka.',
    leader: 'Siswa/i Kelas XII',
  },
  {
    id: 'xi',
    name: 'Pengurus Kelas XI',
    shortName: 'Angkatan XI',
    iconName: 'Crown',
    description: 'Siswa-siswi kelas XI yang aktif melayani dan menjalankan program-program utama Rohkris.',
    leader: 'Siswa/i Kelas XI',
  },
  {
    id: 'x',
    name: 'Pengurus Kelas X',
    shortName: 'Angkatan X',
    iconName: 'Crown',
    description: 'Generasi penerus dari kelas X yang mulai bertumbuh dan mengambil bagian dalam pelayanan.',
    leader: 'Siswa/i Kelas X',
  },
];

export const TEAM_MEMBERS_DATA: TeamMember[] = [
  // BPH & Pembina
  {
    id: 'pembina',
    name: 'Bu Linda Situmorang',
    role: 'Guru Pembina',
    division: 'bph',
    grade: 'Dewan Guru',
  },
  {
    id: 'bph-1',
    name: 'Junaedy Benares Valentino',
    role: 'Ketua',
    division: 'bph',
    grade: 'XII RPL 1',
  },
  {
    id: 'bph-2',
    name: 'Artvael Victor Sahetapy',
    role: 'Wakil Ketua',
    division: 'bph',
    grade: 'XII RPL 1',
  },
  {
    id: 'bph-3',
    name: 'Talita Abigail Dias',
    role: 'Bendahara',
    division: 'bph',
    grade: 'XI DKV 1',
  },

  // Kelas XII
  {
    id: 'xii-1',
    name: 'Madison Dipatulus',
    role: 'Anggota',
    division: 'xii',
    grade: 'XII RPL 1',
  },
  {
    id: 'xii-2',
    name: 'Tadashi Bahagia Martua Situmeang',
    role: 'Anggota',
    division: 'xii',
    grade: 'XII RPL 1',
  },
  {
    id: 'xii-3',
    name: 'Eugenia Adine Theola',
    role: 'Anggota',
    division: 'xii',
    grade: 'XII DKV',
  },
  {
    id: 'xii-4',
    name: 'Gabriela Cindy Iliana',
    role: 'Anggota',
    division: 'xii',
    grade: 'XII DKV',
  },

  // Kelas XI
  {
    id: 'xi-1',
    name: 'Alvaro Daniest Ferson Sitanggang',
    role: 'Anggota',
    division: 'xi',
    grade: 'XI RPL 2',
  },
  {
    id: 'xi-2',
    name: 'Bryan Jonathan Samosir',
    role: 'Anggota',
    division: 'xi',
    grade: 'XI RPL 2',
  },
  {
    id: 'xi-3',
    name: 'Daniel Daviano Mari Dollu',
    role: 'Anggota',
    division: 'xi',
    grade: 'XI RPL 2',
  },
  {
    id: 'xi-4',
    name: 'Karen Aurelia Balapadang',
    role: 'Pemegang Sosmed',
    division: 'xi',
    grade: 'XI RPL 2',
  },
  {
    id: 'xi-5',
    name: 'Moses Kevin Samuel Siregar',
    role: 'Anggota',
    division: 'xi',
    grade: 'XI RPL 2',
  },
  {
    id: 'xi-6',
    name: 'Samuel Pratama Avyus Djumarto',
    role: 'Pemusik',
    division: 'xi',
    grade: 'XI RPL 2',
  },
  {
    id: 'xi-7',
    name: 'Yehezkiel Lovtiandta Stephanus Ginting',
    role: 'Anggota',
    division: 'xi',
    grade: 'XI DKV 1',
  },
  {
    id: 'xi-8',
    name: 'Zico Octavian Sumacher Simanjorang',
    role: 'Anggota',
    division: 'xi',
    grade: 'XI DKV 1',
  },
  {
    id: 'xi-9',
    name: 'Felicia Tabitha Silitonga',
    role: 'Anggota',
    division: 'xi',
    grade: 'XI RPL 1',
  },

  // Kelas X
  {
    id: 'x-1',
    name: 'Alicia Grace',
    role: 'Anggota',
    division: 'x',
    grade: 'X RPL 1',
  },
  {
    id: 'x-2',
    name: 'Gabriel Refalino',
    role: 'Anggota',
    division: 'x',
    grade: 'X RPL 1',
  },
  {
    id: 'x-3',
    name: 'Gabriel Yespin Aritonang',
    role: 'Anggota',
    division: 'x',
    grade: 'X RPL 1',
  },
  {
    id: 'x-4',
    name: 'Christian Timoty Rafael',
    role: 'Anggota',
    division: 'x',
    grade: 'X DKV',
  },
  {
    id: 'x-5',
    name: 'Keyla Klarissa Tambunan',
    role: 'Anggota',
    division: 'x',
    grade: 'X DKV',
  },
  {
    id: 'x-6',
    name: 'Ruth Aurelia Manurung',
    role: 'Anggota',
    division: 'x',
    grade: 'X DKV',
  }
];
