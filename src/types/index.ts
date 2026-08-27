export type DivisionCategory = 'bph' | 'xii' | 'xi' | 'x';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: DivisionCategory;
  grade?: string; // e.g. "XII RPL 1"
  photoUrl?: string;
  quote?: string;
  instagram?: string;
}

export interface DivisionInfo {
  id: DivisionCategory;
  name: string;
  shortName: string;
  iconName: string;
  description: string;
  leader: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  date: string; // ISO or human readable
  time: string; // e.g. "11:30 - 13:00 WIB"
  location: string; // e.g. "Ruang Multimedia / Lab 1"
  theme: string;
  preacher: string;
  worshipLeader: string;
  musician: string;
  singer?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  type: 'jumat_rutin' | 'natal' | 'paskah' | 'retreat' | 'baksos' | 'ibadah_pagi';
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Ibadah Rutin' | 'Natal' | 'Paskah' | 'Retreat' | 'Fellowship' | 'Latihan';
  imageUrl: string;
  date: string;
  description: string;
  photographer?: string;
}

export interface PrayerRequest {
  id: string;
  name: string; // or "Anonim"
  classGrade?: string;
  topic: 'Pendidikan & Ujian' | 'Keluarga' | 'Kesehatan' | 'Pertumbuhan Rohani' | 'Pribadi' | 'Lainnya';
  content: string;
  createdAt: string;
  amenCount: number;
  isPrayedFor?: boolean;
}

export interface Verse {
  id: string;
  reference: string; // e.g. "Yeremia 29:11"
  text: string;
  theme: string;
  context?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  tempo: 'Slow Worship' | 'Medium' | 'Upbeat / Praise';
  category: 'Pujian' | 'Penyembahan' | 'Pembuka' | 'Penutup' | 'Persembahan';
  lyrics: string;
  chordsSnippet?: string;
  youtubeUrl?: string;
}

export interface CommunityStats {
  visitors: number;
  members: number;
  servicesHeld: number;
  prayersAnswered: number;
}
