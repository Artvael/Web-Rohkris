import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Image as ImageIcon,
  Calendar,
  Users,
  Music,
  HeartHandshake,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  LogOut,
  Sparkles,
  RotateCcw,
  Search,
  ShieldCheck,
  X,
  AlertTriangle,
  Radio,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import { useGalleryStore } from '../hooks/useGalleryStore';
import { useScheduleStore } from '../hooks/useScheduleStore';
import { useTeamStore } from '../hooks/useTeamStore';
import { useSongStore } from '../hooks/useSongStore';
import { usePrayerStore } from '../hooks/usePrayerStore';
import type { DivisionCategory, GalleryItem, ScheduleEvent, TeamMember, Song } from '../types';

type TabType = 'overview' | 'gallery' | 'schedule' | 'team' | 'songs' | 'prayers';

export const AdminDashboard: React.FC = () => {
  const { user, role, isAdmin, logout, loginAsDemoAdmin, promoteToAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notification, setNotification] = useState<string | null>(null);

  // Stores
  const {
    items: galleryItems,
    addItem: addGalleryItem,
    updateItem: updateGalleryItem,
    deleteItem: deleteGalleryItem,
    resetToDefault: resetGallery,
  } = useGalleryStore();

  const {
    events: scheduleEvents,
    addEvent: addScheduleEvent,
    updateEvent: updateScheduleEvent,
    deleteEvent: deleteScheduleEvent,
    resetToDefault: resetSchedule,
  } = useScheduleStore();

  const {
    members: teamMembers,
    divisions,
    addMember: addTeamMember,
    updateMember: updateTeamMember,
    deleteMember: deleteTeamMember,
    resetToDefault: resetTeam,
  } = useTeamStore();

  const {
    songs,
    addSong,
    updateSong,
    deleteSong,
    resetToDefault: resetSongs,
  } = useSongStore();

  const {
    prayers,
    deletePrayer,
    isLive: isPrayerLive,
  } = usePrayerStore();

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // ================= MODAL STATES =================
  // Gallery
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState<{
    title: string;
    category: GalleryItem['category'];
    imageUrl: string;
    date: string;
    description: string;
    photographer?: string;
  }>({
    title: '',
    category: 'Ibadah Rutin',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    photographer: '',
  });

  // Schedule
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleEvent | null>(null);
  const [scheduleForm, setScheduleForm] = useState<{
    title: string;
    theme: string;
    date: string;
    time: string;
    location: string;
    preacher: string;
    worshipLeader: string;
    musician: string;
    type: ScheduleEvent['type'];
    status: ScheduleEvent['status'];
    notes: string;
  }>({
    title: '',
    theme: '',
    date: 'Jumat, 15 Okt 2026',
    time: '12:00 - 13:30 WIB',
    location: 'Ruang Aula SMKN 64 Jakarta',
    preacher: '',
    worshipLeader: '',
    musician: '',
    type: 'jumat_rutin',
    status: 'upcoming',
    notes: '',
  });

  // Team
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState<{
    name: string;
    role: string;
    division: DivisionCategory;
    grade: string;
    instagram: string;
    quote: string;
  }>({
    name: '',
    role: 'Anggota',
    division: 'bph',
    grade: 'XI PPLG',
    instagram: '',
    quote: '',
  });

  // Song
  const [isSongModalOpen, setIsSongModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [songForm, setSongForm] = useState<{
    title: string;
    artist: string;
    key: string;
    tempo: Song['tempo'];
    category: Song['category'];
    lyrics: string;
  }>({
    title: '',
    artist: '',
    key: 'C',
    tempo: 'Medium',
    category: 'Penyembahan',
    lyrics: '',
  });

  // Filters & Search
  const [gallerySearch, setGallerySearch] = useState('');
  const [teamDivisionFilter, setTeamDivisionFilter] = useState<string>('all');
  const [songSearch, setSongSearch] = useState('');
  const [prayerFilterTopic, setPrayerFilterTopic] = useState<string>('all');

  // ================= NOT AUTHORIZED VIEW =================
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#f4f0e6] text-[#181d18] flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-md bg-[#ffffff] rounded-3xl border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18] p-6 md:p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#ffd269] border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-[#181d18]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black font-['Outfit'] text-[#181d18]">
              Akses Admin Terproteksi
            </h1>
            <p className="text-sm text-[#555] font-medium leading-relaxed">
              Halaman ini dikhususkan bagi Pengurus Rohkris SMKN 64 untuk mengelola data website. Silakan masuk terlebih dahulu.
            </p>
          </div>

          {user && !isAdmin && (
            <div className="space-y-3">
              <div className="p-3 bg-[#ffe8a3] rounded-xl border border-[#181d18] text-xs text-[#181d18] font-bold flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#b45309]" />
                <span>Anda masuk sebagai <strong>{user.email}</strong> dengan peran <strong>{role}</strong>.</span>
              </div>
              <button
                onClick={() => {
                  promoteToAdmin();
                  notify('Selamat! Akun Anda kini memiliki hak Administrator.');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#ffd269] text-[#181d18] font-black text-xs border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#181d18]" />
                <span>👑 Aktifkan Hak Admin untuk Akun Ini</span>
              </button>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              to="/login"
              className="w-full py-3 px-4 rounded-xl bg-[#c5de9b] text-[#181d18] font-black border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#181d18] transition-all flex items-center justify-center gap-2"
            >
              <span>Masuk dengan Email / Google</span>
            </Link>

            <button
              onClick={() => {
                loginAsDemoAdmin();
                notify('Berhasil masuk sebagai Admin Rohkris 64!');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#ffd269] text-[#181d18] font-black text-sm border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_#181d18] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>1-Klik Masuk sebagai Demo Admin</span>
            </button>

            <Link
              to="/"
              className="inline-block text-xs font-black text-[#555] hover:text-[#181d18] underline pt-2"
            >
              ← Kembali ke Halaman Utama
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-[#f4f0e6] text-[#181d18] font-['Plus_Jakarta_Sans',sans-serif] pb-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 bg-[#ffd269] text-[#181d18] px-4 py-2.5 rounded-2xl border-2 border-[#181d18] shadow-[4px_4px_0px_#181d18] font-black text-sm flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#181d18]" />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#ffffff] border-b-[2.5px] border-[#181d18] shadow-[0px_4px_0px_#181d18]">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-[#ffd269] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] flex items-center justify-center group-hover:rotate-6 transition-transform">
                <ShieldCheck className="w-6 h-6 text-[#181d18]" />
              </div>
              <div>
                <span className="font-['Outfit'] font-black text-lg tracking-tight block text-[#181d18] leading-none">
                  Rohkris 64 Admin
                </span>
                <span className="text-[10px] font-bold text-[#888] tracking-wide uppercase">
                  Kontrol Konten Website
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f0e6] border border-[#181d18]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#181d18]">{user.name || user.email}</span>
              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-[#ffd269] text-[#181d18] border border-[#181d18]">
                Admin
              </span>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#c5de9b] text-[#181d18] text-xs font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <span>Lihat Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => {
                logout();
                notify('Berhasil keluar');
              }}
              title="Keluar dari Admin"
              className="p-1.5 rounded-xl bg-[#ff7b72]/20 text-[#181d18] hover:bg-[#ff7b72] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 border-t border-[#eee]">
          {[
            { id: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
            { id: 'gallery', label: 'Galeri Foto', count: galleryItems.length, icon: ImageIcon },
            { id: 'schedule', label: 'Jadwal Ibadah', count: scheduleEvents.length, icon: Calendar },
            { id: 'team', label: 'Pengurus & Divisi', count: teamMembers.length, icon: Users },
            { id: 'songs', label: 'Bank Lagu & Chords', count: songs.length, icon: Music },
            { id: 'prayers', label: 'Moderasi Doa', count: prayers.length, icon: HeartHandshake },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black border-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#ffd269] text-[#181d18] border-[#181d18] shadow-[2px_2px_0px_#181d18]'
                    : 'bg-transparent text-[#555] border-transparent hover:bg-black/5 hover:text-[#181d18]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full border ${
                      isActive
                        ? 'bg-[#ffffff] text-[#181d18] border-[#181d18]'
                        : 'bg-[#181d18]/10 text-[#555] border-transparent'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 pt-8">
        {/* ================= TAB: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Banner Greeting */}
            <div className="bg-[#ffd269] rounded-3xl border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#181d18] text-xs font-black border border-[#181d18]">
                  <Sparkles className="w-3.5 h-3.5 text-[#181d18]" />
                  <span>Panel Manajemen Rohkris 64</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black font-['Outfit'] text-[#181d18]">
                  Selamat Datang, {user.name || 'Admin'}! 👋
                </h1>
                <p className="text-sm text-[#181d18] font-semibold max-w-xl leading-relaxed">
                  Di sini Anda dapat menambah, menyunting, dan menghapus konten website Rohkris SMKN 64 Jakarta secara langsung. Semua perubahan tersimpan dan tampil seketika di website.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 relative z-10">
                <button
                  onClick={() => {
                    setEditingGalleryItem(null);
                    setGalleryForm({
                      title: '',
                      category: 'Ibadah Rutin',
                      imageUrl: '',
                      date: new Date().toISOString().split('T')[0],
                      description: '',
                      photographer: '',
                    });
                    setIsGalleryModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white text-[#181d18] text-xs font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Foto Galeri</span>
                </button>

                <button
                  onClick={() => {
                    setEditingScheduleItem(null);
                    setScheduleForm({
                      title: '',
                      theme: '',
                      date: 'Jumat, 15 Okt 2026',
                      time: '12:00 - 13:30 WIB',
                      location: 'Ruang Aula SMKN 64 Jakarta',
                      preacher: '',
                      worshipLeader: '',
                      musician: '',
                      type: 'jumat_rutin',
                      status: 'upcoming',
                      notes: '',
                    });
                    setIsScheduleModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#c5de9b] text-[#181d18] text-xs font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Jadwal Ibadah</span>
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: 'Foto Galeri', count: galleryItems.length, tab: 'gallery', color: '#ffd269', icon: ImageIcon },
                { label: 'Jadwal Acara', count: scheduleEvents.length, tab: 'schedule', color: '#c5de9b', icon: Calendar },
                { label: 'Pengurus / Pelayan', count: teamMembers.length, tab: 'team', color: '#bae6fd', icon: Users },
                { label: 'Koleksi Lagu', count: songs.length, tab: 'songs', color: '#fbcfe8', icon: Music },
                { label: 'Pokok Doa Siswa', count: prayers.length, tab: 'prayers', color: '#fed7aa', icon: HeartHandshake },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.tab}
                    onClick={() => setActiveTab(stat.tab as TabType)}
                    className="bg-[#ffffff] rounded-2xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] p-4 cursor-pointer hover:-translate-y-1 transition-transform space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-9 h-9 rounded-xl border border-[#181d18] flex items-center justify-center"
                        style={{ backgroundColor: stat.color }}
                      >
                        <Icon className="w-4 h-4 text-[#181d18]" />
                      </div>
                      <span className="text-2xl font-black font-['Outfit'] text-[#181d18]">
                        {stat.count}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#181d18] block">{stat.label}</span>
                      <span className="text-[10px] text-[#777] font-semibold">Klik untuk kelola →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Live Preview: Prayers & Upcoming Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Prayers */}
              <div className="bg-white rounded-3xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-5 h-5 text-[#181d18]" />
                    <h3 className="font-['Outfit'] font-black text-lg text-[#181d18]">
                      Permohonan Doa Terbaru
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('prayers')}
                    className="text-xs font-black text-[#181d18] hover:underline"
                  >
                    Semua ({prayers.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {prayers.slice(0, 3).map((prayer) => (
                    <div
                      key={prayer.id}
                      className="p-3.5 rounded-2xl bg-[#fdfdf5] border border-[#181d18] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-black text-[#181d18]">{prayer.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#ffd269] text-[10px] font-bold border border-[#181d18]">
                          {prayer.topic}
                        </span>
                      </div>
                      <p className="text-xs text-[#444] line-clamp-2 italic leading-relaxed">
                        "{prayer.content}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[#888] pt-1">
                        <span>{prayer.createdAt}</span>
                        <span className="font-bold text-[#181d18]">🙏 {prayer.amenCount} Amin</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Schedules */}
              <div className="bg-white rounded-3xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#181d18]" />
                    <h3 className="font-['Outfit'] font-black text-lg text-[#181d18]">
                      Jadwal Ibadah Terdekat
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="text-xs font-black text-[#181d18] hover:underline"
                  >
                    Kelola ({scheduleEvents.length}) →
                  </button>
                </div>

                <div className="space-y-3">
                  {scheduleEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="p-3.5 rounded-2xl bg-[#fdfdf5] border border-[#181d18] flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#181d18]">{event.title}</span>
                          {event.status === 'upcoming' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#c5de9b] text-[#181d18] border border-[#181d18]">
                              Mendatang
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#666]">
                          📅 {event.date} • ⏰ {event.time}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setEditingScheduleItem(event);
                          setScheduleForm({
                            title: event.title,
                            theme: event.theme,
                            date: event.date,
                            time: event.time,
                            location: event.location,
                            preacher: event.preacher,
                            worshipLeader: event.worshipLeader,
                            musician: event.musician,
                            type: event.type,
                            status: event.status,
                            notes: event.notes || '',
                          });
                          setIsScheduleModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-[#ffd269] border border-[#181d18] text-[#181d18] hover:scale-105 transition-transform"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB: GALLERY ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-['Outfit'] text-[#181d18]">
                  Galeri Foto & Dokumentasi
                </h2>
                <p className="text-xs text-[#666] font-medium">
                  Kelola foto kegiatan persekutuan, retreat, dan ibadah Jumat di SMKN 64.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm('Reset galeri foto ke data awal?')) {
                      resetGallery();
                      notify('Galeri foto telah direset ke bawaan');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-white text-[#181d18] text-xs font-bold border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bawaan</span>
                </button>

                <button
                  onClick={() => {
                    setEditingGalleryItem(null);
                    setGalleryForm({
                      title: '',
                      category: 'Ibadah Rutin',
                      imageUrl: '',
                      date: new Date().toISOString().split('T')[0],
                      description: '',
                      photographer: '',
                    });
                    setIsGalleryModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#ffd269] text-[#181d18] text-xs font-black border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Foto Baru</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari foto berdasarkan judul / kategori..."
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border-2 border-[#181d18] text-xs font-bold text-[#181d18] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#ffd269]"
              />
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems
                .filter(
                  (item) =>
                    item.title.toLowerCase().includes(gallerySearch.toLowerCase()) ||
                    item.category.toLowerCase().includes(gallerySearch.toLowerCase())
                )
                .map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-44 bg-[#e2dec9] overflow-hidden border-b-2 border-[#181d18]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80';
                          }}
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#ffd269] text-[#181d18] text-[10px] font-black border border-[#181d18] shadow-[1px_1px_0px_#181d18]">
                          {item.category}
                        </span>
                      </div>

                      <div className="p-4 space-y-1.5">
                        <span className="text-[10px] text-[#888] font-bold">📅 {item.date}</span>
                        <h4 className="font-['Outfit'] font-black text-[#181d18] text-base leading-snug">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingGalleryItem(item);
                          setGalleryForm({
                            title: item.title,
                            category: item.category,
                            imageUrl: item.imageUrl,
                            date: item.date,
                            description: item.description || '',
                            photographer: item.photographer || '',
                          });
                          setIsGalleryModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#c5de9b] text-[#181d18] text-xs font-bold border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18] flex items-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus foto "${item.title}"?`)) {
                            deleteGalleryItem(item.id);
                            notify('Foto berhasil dihapus');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#ff7b72]/20 hover:bg-[#ff7b72] text-[#181d18] text-xs font-bold border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18] flex items-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SCHEDULE ================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-['Outfit'] text-[#181d18]">
                  Jadwal Ibadah & Kegiatan
                </h2>
                <p className="text-xs text-[#666] font-medium">
                  Atur agenda ibadah Jumat, persekutuan doa, latihan musik, dan retreat tahunan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm('Reset jadwal ke data bawaan?')) {
                      resetSchedule();
                      notify('Jadwal ibadah telah direset ke bawaan');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-white text-[#181d18] text-xs font-bold border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bawaan</span>
                </button>

                <button
                  onClick={() => {
                    setEditingScheduleItem(null);
                    setScheduleForm({
                      title: '',
                      theme: '',
                      date: 'Jumat, 15 Okt 2026',
                      time: '12:00 - 13:30 WIB',
                      location: 'Ruang Aula SMKN 64 Jakarta',
                      preacher: '',
                      worshipLeader: '',
                      musician: '',
                      type: 'jumat_rutin',
                      status: 'upcoming',
                      notes: '',
                    });
                    setIsScheduleModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#c5de9b] text-[#181d18] text-xs font-black border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Jadwal Baru</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {scheduleEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-['Outfit'] font-black text-lg text-[#181d18]">
                        {event.title}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-[#181d18] ${
                          event.status === 'upcoming'
                            ? 'bg-[#c5de9b] text-[#181d18]'
                            : 'bg-[#eee] text-[#666]'
                        }`}
                      >
                        {event.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffd269] text-[#181d18] border border-[#181d18]">
                        {event.type}
                      </span>
                    </div>

                    <div className="text-xs text-[#555] font-semibold space-y-1">
                      <p>
                        <strong>Tema:</strong> "{event.theme}"
                      </p>
                      <p>
                        📅 {event.date} • ⏰ {event.time} • 📍 {event.location}
                      </p>
                      {event.preacher && (
                        <p>
                          <strong>Pembawa Firman / Pengkhotbah:</strong> {event.preacher}
                        </p>
                      )}
                      {(event.worshipLeader || event.musician) && (
                        <p>
                          <strong>Pelayan:</strong> WL: {event.worshipLeader || '-'} • Pemain Musik: {event.musician || '-'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => {
                        setEditingScheduleItem(event);
                        setScheduleForm({
                          title: event.title,
                          theme: event.theme,
                          date: event.date,
                          time: event.time,
                          location: event.location,
                          preacher: event.preacher,
                          worshipLeader: event.worshipLeader,
                          musician: event.musician,
                          type: event.type,
                          status: event.status,
                          notes: event.notes || '',
                        });
                        setIsScheduleModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#ffd269] text-[#181d18] text-xs font-bold border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18] flex items-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Hapus jadwal "${event.title}"?`)) {
                          deleteScheduleEvent(event.id);
                          notify('Jadwal berhasil dihapus');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#ff7b72]/20 hover:bg-[#ff7b72] text-[#181d18] text-xs font-bold border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18] flex items-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB: TEAM ================= */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-['Outfit'] text-[#181d18]">
                  Struktur Pengurus & Divisi Pelayanan
                </h2>
                <p className="text-xs text-[#666] font-medium">
                  Kelola nama, jabatan, divisi, kelas, dan kontak pengurus Rohkris SMKN 64 Jakarta.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm('Reset data pengurus ke bawaan?')) {
                      resetTeam();
                      notify('Struktur pengurus telah direset ke bawaan');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-white text-[#181d18] text-xs font-bold border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bawaan</span>
                </button>

                <button
                  onClick={() => {
                    setEditingTeamMember(null);
                    setTeamForm({
                      name: '',
                      role: 'Anggota',
                      division: 'bph',
                      grade: 'XI PPLG',
                      instagram: '',
                      quote: '',
                    });
                    setIsTeamModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#ffd269] text-[#181d18] text-xs font-black border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengurus</span>
                </button>
              </div>
            </div>

            {/* Division Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setTeamDivisionFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  teamDivisionFilter === 'all'
                    ? 'bg-[#181d18] text-white border-[#181d18]'
                    : 'bg-white text-[#181d18] border-[#181d18]'
                }`}
              >
                Semua Divisi ({teamMembers.length})
              </button>
              {divisions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setTeamDivisionFilter(d.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    teamDivisionFilter === d.id
                      ? 'bg-[#ffd269] text-[#181d18] border-[#181d18] font-black'
                      : 'bg-white text-[#555] border-[#ccc]'
                  }`}
                >
                  {d.name} ({teamMembers.filter((m) => m.division === d.id).length})
                </button>
              ))}
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {teamMembers
                .filter(
                  (m) => teamDivisionFilter === 'all' || m.division === teamDivisionFilter
                )
                .map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-['Outfit'] font-black text-base text-[#181d18]">
                            {member.name}
                          </h4>
                          <span className="text-xs font-bold text-[#c27803] block">
                            {member.role}
                          </span>
                        </div>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ffd269] text-[#181d18] border border-[#181d18] uppercase">
                          {member.division}
                        </span>
                      </div>

                      {member.grade && (
                        <p className="text-xs text-[#777] font-semibold">
                          Kelas: {member.grade}
                        </p>
                      )}

                      {member.quote && (
                        <p className="text-xs text-[#555] italic bg-[#fdfdf5] p-2 rounded-xl border border-[#eee]">
                          "{member.quote}"
                        </p>
                      )}

                      {member.instagram && (
                        <a
                          href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-sky-600 hover:underline inline-block"
                        >
                          @{member.instagram.replace('@', '')}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eee]">
                      <button
                        onClick={() => {
                          setEditingTeamMember(member);
                          setTeamForm({
                            name: member.name,
                            role: member.role,
                            division: member.division,
                            grade: member.grade || '',
                            instagram: member.instagram || '',
                            quote: member.quote || '',
                          });
                          setIsTeamModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#ffd269] text-xs font-bold border border-[#181d18] text-[#181d18] flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus pengurus "${member.name}"?`)) {
                            deleteTeamMember(member.id);
                            notify('Pengurus berhasil dihapus');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#ff7b72]/20 hover:bg-[#ff7b72] text-xs font-bold border border-[#181d18] text-[#181d18] flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: SONGS ================= */}
        {activeTab === 'songs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-['Outfit'] text-[#181d18]">
                  Bank Lagu Pujian, Penyembahan & Chords
                </h2>
                <p className="text-xs text-[#666] font-medium">
                  Kelola daftar lagu ibadah, chord nada dasar, tempo, dan lirik lengkap.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm('Reset bank lagu ke koleksi bawaan?')) {
                      resetSongs();
                      notify('Bank lagu telah direset ke bawaan');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-white text-[#181d18] text-xs font-bold border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Bawaan</span>
                </button>

                <button
                  onClick={() => {
                    setEditingSong(null);
                    setSongForm({
                      title: '',
                      artist: '',
                      key: 'C',
                      tempo: 'Medium',
                      category: 'Penyembahan',
                      lyrics: '',
                    });
                    setIsSongModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#c5de9b] text-[#181d18] text-xs font-black border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Lagu Baru</span>
                </button>
              </div>
            </div>

            {/* Song Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari judul lagu / artis..."
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border-2 border-[#181d18] text-xs font-bold text-[#181d18] placeholder:text-[#999] focus:outline-none focus:ring-2 focus:ring-[#c5de9b]"
              />
            </div>

            {/* Songs List */}
            <div className="space-y-3">
              {songs
                .filter(
                  (s) =>
                    s.title.toLowerCase().includes(songSearch.toLowerCase()) ||
                    s.artist.toLowerCase().includes(songSearch.toLowerCase())
                )
                .map((song) => (
                  <div
                    key={song.id}
                    className="bg-white rounded-2xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-['Outfit'] font-black text-base text-[#181d18]">
                          {song.title}
                        </span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#ffd269] text-[#181d18] border border-[#181d18]">
                          {song.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#eee] text-[#555] border border-[#181d18]">
                          Key: {song.key}
                        </span>
                      </div>
                      <p className="text-xs text-[#666] font-semibold">
                        Artis / Penyanyi: {song.artist} • Tempo: {song.tempo}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setEditingSong(song);
                          setSongForm({
                            title: song.title,
                            artist: song.artist,
                            key: song.key,
                            tempo: song.tempo,
                            category: song.category,
                            lyrics: song.lyrics,
                          });
                          setIsSongModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#ffd269] text-xs font-bold border border-[#181d18] text-[#181d18] flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus lagu "${song.title}"?`)) {
                            deleteSong(song.id);
                            notify('Lagu berhasil dihapus');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#ff7b72]/20 hover:bg-[#ff7b72] text-xs font-bold border border-[#181d18] text-[#181d18] flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= TAB: PRAYERS ================= */}
        {activeTab === 'prayers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black font-['Outfit'] text-[#181d18]">
                    Moderasi Kotak Permohonan Doa
                  </h2>
                  {isPrayerLive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-600">
                      <Radio className="w-3 h-3 animate-pulse" />
                      Supabase Cloud Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black border border-amber-600">
                      Local Offline Mode
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#666] font-medium">
                  Tinjau dan moderasi pokok doa yang dikirimkan oleh siswa/siswi SMKN 64 Jakarta.
                </p>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'Pendidikan & Ujian', 'Keluarga', 'Pertumbuhan Rohani', 'Kesehatan', 'Lainnya'].map(
                (topic) => (
                  <button
                    key={topic}
                    onClick={() => setPrayerFilterTopic(topic)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      prayerFilterTopic === topic
                        ? 'bg-[#181d18] text-white border-[#181d18]'
                        : 'bg-white text-[#181d18] border-[#181d18]'
                    }`}
                  >
                    {topic === 'all' ? 'Semua Topik' : topic}
                  </button>
                )
              )}
            </div>

            {/* Prayers List */}
            <div className="space-y-4">
              {prayers
                .filter(
                  (p) => prayerFilterTopic === 'all' || p.topic === prayerFilterTopic
                )
                .map((prayer) => (
                  <div
                    key={prayer.id}
                    className="bg-white rounded-2xl border-[2.5px] border-[#181d18] shadow-[4px_4px_0px_#181d18] p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-['Outfit'] font-black text-base text-[#181d18]">
                            {prayer.name}
                          </h4>
                          {prayer.classGrade && (
                            <span className="text-xs font-bold px-2 py-0.2 rounded-full bg-[#f4f0e6] border border-[#181d18] text-[#555]">
                              {prayer.classGrade}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#888]">Dikirim: {prayer.createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#ffd269] text-[#181d18] border border-[#181d18]">
                          {prayer.topic}
                        </span>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-[#c5de9b] text-[#181d18] border border-[#181d18]">
                          🙏 {prayer.amenCount} Dukungan
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-[#333] font-medium leading-relaxed bg-[#fdfdf5] p-3.5 rounded-xl border border-[#eee]">
                      "{prayer.content}"
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eee]">
                      <button
                        onClick={() => {
                          if (window.confirm('Hapus pokok doa ini?')) {
                            deletePrayer(prayer.id);
                            notify('Pokok doa berhasil dihapus');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#ff7b72]/20 hover:bg-[#ff7b72] text-xs font-bold border border-[#181d18] text-[#181d18] flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Doa</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: GALLERY ================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-['Outfit'] font-black text-xl text-[#181d18]">
                {editingGalleryItem ? 'Edit Foto Galeri' : 'Tambah Foto Galeri Baru'}
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 rounded-lg border border-[#181d18] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingGalleryItem) {
                  updateGalleryItem(editingGalleryItem.id, galleryForm);
                  notify('Foto galeri berhasil diperbarui');
                } else {
                  addGalleryItem(galleryForm);
                  notify('Foto baru berhasil ditambahkan');
                }
                setIsGalleryModalOpen(false);
              }}
              className="space-y-4 text-xs font-bold text-[#181d18]"
            >
              <div>
                <label className="block mb-1">Judul Foto / Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibadah Awal Tahun Rohkris 64"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Kategori</label>
                  <select
                    value={galleryForm.category}
                    onChange={(e) =>
                      setGalleryForm({
                        ...galleryForm,
                        category: e.target.value as GalleryItem['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  >
                    <option value="Ibadah Rutin">Ibadah Rutin</option>
                    <option value="Natal">Natal</option>
                    <option value="Paskah">Paskah</option>
                    <option value="Retreat">Retreat</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Latihan">Latihan</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Tanggal Kegiatan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 12 Jan 2026"
                    value={galleryForm.date}
                    onChange={(e) => setGalleryForm({ ...galleryForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">URL Foto (Link Gambar Online)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/... atau link gambar"
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                />
              </div>

              {galleryForm.imageUrl && (
                <div className="h-32 rounded-xl overflow-hidden border border-[#181d18] bg-[#f4f0e6]">
                  <img
                    src={galleryForm.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80';
                    }}
                  />
                </div>
              )}

              <div>
                <label className="block mb-1">Deskripsi Singkat (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Momen kebersamaan seluruh siswa saat ibadah..."
                  value={galleryForm.description}
                  onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#181d18] text-[#181d18]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ffd269] text-[#181d18] font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]"
                >
                  Simpan Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SCHEDULE ================= */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-['Outfit'] font-black text-xl text-[#181d18]">
                {editingScheduleItem ? 'Edit Jadwal Acara' : 'Tambah Jadwal Ibadah Baru'}
              </h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-lg border border-[#181d18] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingScheduleItem) {
                  updateScheduleEvent(editingScheduleItem.id, scheduleForm);
                  notify('Jadwal berhasil diperbarui');
                } else {
                  addScheduleEvent(scheduleForm);
                  notify('Jadwal baru berhasil ditambahkan');
                }
                setIsScheduleModalOpen(false);
              }}
              className="space-y-4 text-xs font-bold text-[#181d18]"
            >
              <div>
                <label className="block mb-1">Nama Acara / Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ibadah Jumat Rutin Rohkris"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1">Tema Ibadah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Menjadi Terang di Tengah Dunia Sekolah"
                  value={scheduleForm.theme}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, theme: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Hari & Tanggal</label>
                  <input
                    type="text"
                    required
                    placeholder="Jumat, 24 Okt 2026"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Waktu / Jam</label>
                  <input
                    type="text"
                    required
                    placeholder="12:00 - 13:30 WIB"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Tempat / Ruangan</label>
                  <input
                    type="text"
                    required
                    placeholder="Ruang Aula SMKN 64"
                    value={scheduleForm.location}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Pembawa Firman</label>
                  <input
                    type="text"
                    required
                    placeholder="Pdt. / Kakak Pembina"
                    value={scheduleForm.preacher}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, preacher: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Worship Leader (WL)</label>
                  <input
                    type="text"
                    placeholder="Nama WL"
                    value={scheduleForm.worshipLeader}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, worshipLeader: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Pemain Musik</label>
                  <input
                    type="text"
                    placeholder="Gitar / Keyboard"
                    value={scheduleForm.musician}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, musician: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Tipe Acara</label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        type: e.target.value as ScheduleEvent['type'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  >
                    <option value="jumat_rutin">Jumat Rutin</option>
                    <option value="natal">Natal</option>
                    <option value="paskah">Paskah</option>
                    <option value="retreat">Retreat</option>
                    <option value="ibadah_pagi">Ibadah Pagi</option>
                    <option value="baksos">Bakti Sosial</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Status Acara</label>
                  <select
                    value={scheduleForm.status}
                    onChange={(e) =>
                      setScheduleForm({
                        ...scheduleForm,
                        status: e.target.value as ScheduleEvent['status'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  >
                    <option value="upcoming">Akan Datang (Upcoming)</option>
                    <option value="ongoing">Sedang Berlangsung (Ongoing)</option>
                    <option value="completed">Selesai (Completed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan dress code atau perlengkapan..."
                  value={scheduleForm.notes}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#181d18] text-[#181d18]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c5de9b] text-[#181d18] font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: TEAM ================= */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-['Outfit'] font-black text-xl text-[#181d18]">
                {editingTeamMember ? 'Edit Anggota Pengurus' : 'Tambah Pengurus Baru'}
              </h3>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1 rounded-lg border border-[#181d18] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingTeamMember) {
                  updateTeamMember(editingTeamMember.id, teamForm);
                  notify('Data pengurus berhasil diperbarui');
                } else {
                  addTeamMember(teamForm);
                  notify('Pengurus baru berhasil ditambahkan');
                }
                setIsTeamModalOpen(false);
              }}
              className="space-y-4 text-xs font-bold text-[#181d18]"
            >
              <div>
                <label className="block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Siswa / Pengurus"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Jabatan / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="Ketua / Koordinator Musik"
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Divisi</label>
                  <select
                    value={teamForm.division}
                    onChange={(e) =>
                      setTeamForm({
                        ...teamForm,
                        division: e.target.value as DivisionCategory,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  >
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Kelas (Jurusan)</label>
                  <input
                    type="text"
                    placeholder="XII PPLG / XI DKV 1"
                    value={teamForm.grade}
                    onChange={(e) => setTeamForm({ ...teamForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Instagram (@username)</label>
                  <input
                    type="text"
                    placeholder="@rohkris64"
                    value={teamForm.instagram}
                    onChange={(e) => setTeamForm({ ...teamForm, instagram: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Ayat Alkitab / Motto Hidup</label>
                <textarea
                  rows={2}
                  placeholder="Filipi 4:13 - Segala perkara dapat kutanggung..."
                  value={teamForm.quote}
                  onChange={(e) => setTeamForm({ ...teamForm, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#181d18] text-[#181d18]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ffd269] text-[#181d18] font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]"
                >
                  Simpan Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SONG ================= */}
      {isSongModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border-[2.5px] border-[#181d18] shadow-[6px_6px_0px_#181d18] p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-['Outfit'] font-black text-xl text-[#181d18]">
                {editingSong ? 'Edit Lagu & Chord' : 'Tambah Lagu Baru ke Bank Lagu'}
              </h3>
              <button
                onClick={() => setIsSongModalOpen(false)}
                className="p-1 rounded-lg border border-[#181d18] hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingSong) {
                  updateSong(editingSong.id, songForm);
                  notify('Lagu berhasil diperbarui');
                } else {
                  addSong(songForm);
                  notify('Lagu baru berhasil ditambahkan');
                }
                setIsSongModalOpen(false);
              }}
              className="space-y-4 text-xs font-bold text-[#181d18]"
            >
              <div>
                <label className="block mb-1">Judul Lagu</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sentuh Hatiku"
                  value={songForm.title}
                  onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Artis / Pencipta</label>
                  <input
                    type="text"
                    required
                    placeholder="Symphony Worship / NDC"
                    value={songForm.artist}
                    onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Kategori Lagu</label>
                  <select
                    value={songForm.category}
                    onChange={(e) =>
                      setSongForm({
                        ...songForm,
                        category: e.target.value as Song['category'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  >
                    <option value="Penyembahan">Penyembahan</option>
                    <option value="Pujian">Pujian</option>
                    <option value="Pembuka">Pembuka</option>
                    <option value="Persembahan">Persembahan</option>
                    <option value="Penutup">Penutup</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Nada Dasar (Key)</label>
                  <input
                    type="text"
                    required
                    placeholder="C / D / G"
                    value={songForm.key}
                    onChange={(e) => setSongForm({ ...songForm, key: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1">Tempo</label>
                  <select
                    value={songForm.tempo}
                    onChange={(e) =>
                      setSongForm({
                        ...songForm,
                        tempo: e.target.value as Song['tempo'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none"
                  >
                    <option value="Slow Worship">Slow Worship</option>
                    <option value="Medium">Medium</option>
                    <option value="Upbeat / Praise">Upbeat / Praise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Lirik & Chords (Format [Chord] Lirik)</label>
                <textarea
                  rows={6}
                  placeholder="[C]Betapa kumencintai[Am]Mu Tuhan...&#10;[F]Dengan segenap hati[G]ku"
                  value={songForm.lyrics}
                  onChange={(e) =>
                    setSongForm({ ...songForm, lyrics: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] focus:outline-none font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsSongModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#181d18] text-[#181d18]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c5de9b] text-[#181d18] font-black border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]"
                >
                  Simpan Lagu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
