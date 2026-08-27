import React, { useState } from 'react';
import { motion } from 'framer-motion';

import {
  X,
  Upload,
  Image,
  Calendar,
  HeartHandshake,
  Trash2,
  Plus,
  Download,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

import type { GalleryItem, ScheduleEvent, PrayerRequest } from '../../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItems: GalleryItem[];
  onAddGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  onDeleteGalleryItem: (id: string) => void;
  onResetGallery: () => void;
  scheduleEvents: ScheduleEvent[];
  onAddScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  onDeleteScheduleEvent: (id: string) => void;
  prayerRequests: PrayerRequest[];
  onDeletePrayer: (id: string) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  galleryItems,
  onAddGalleryItem,
  onDeleteGalleryItem,
  onResetGallery,
  scheduleEvents,
  onAddScheduleEvent,
  onDeleteScheduleEvent,
  prayerRequests,
  onDeletePrayer,
}) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'gallery' | 'schedule' | 'prayers' | 'backup'>('gallery');

  // New Gallery Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GalleryItem['category']>('Ibadah Rutin');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPhotographer, setNewPhotographer] = useState('');
  const [gallerySuccess, setGallerySuccess] = useState(false);

  // New Schedule Form State
  const [newSchTitle, setNewSchTitle] = useState('');
  const [newSchDate, setNewSchDate] = useState('');
  const [newSchTime, setNewSchTime] = useState('11:30 - 13:00 WIB');
  const [newSchLocation, setNewSchLocation] = useState('Ruang Multimedia SMKN 64');
  const [newSchTheme, setNewSchTheme] = useState('');
  const [newSchPreacher, setNewSchPreacher] = useState('');
  const [newSchWorshipLeader, setNewSchWorshipLeader] = useState('');
  const [newSchType, setNewSchType] = useState<ScheduleEvent['type']>('jumat_rutin');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '6464' || pin === 'admin64') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Image file upload handler (converts to base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) return;

    onAddGalleryItem({
      title: newTitle,
      category: newCategory,
      imageUrl: newImageUrl,
      date: newDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: newDesc || 'Dokumentasi kegiatan Rohkris SMKN 64 Jakarta.',
      photographer: newPhotographer || 'Tim Media 64',
    });

    setGallerySuccess(true);
    setNewTitle('');
    setNewImageUrl('');
    setNewDesc('');
    setNewPhotographer('');
    setTimeout(() => setGallerySuccess(false), 3000);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchTitle || !newSchDate) return;

    onAddScheduleEvent({
      title: newSchTitle,
      date: newSchDate,
      time: newSchTime,
      location: newSchLocation,
      theme: newSchTheme || 'Tema Ibadah Rohkris 64',
      preacher: newSchPreacher || 'Pelayan Firman',
      worshipLeader: newSchWorshipLeader || 'Tim Worship',
      musician: 'Tim Musik Rohkris 64',
      status: 'upcoming',
      type: newSchType,
    });

    setScheduleSuccess(true);
    setNewSchTitle('');
    setNewSchDate('');
    setNewSchTheme('');
    setNewSchPreacher('');
    setNewSchWorshipLeader('');
    setTimeout(() => setScheduleSuccess(false), 3000);
  };

  // 1-Click Export Backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      gallery: galleryItems,
      schedules: scheduleEvents,
      prayers: prayerRequests,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rohkris64_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-stone-900 rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-amber-400 to-sky-400 shadow-md shrink-0">
              <img
                src="/logo.png"
                alt="Logo Rohkris SMKN 64"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Panel Admin Media & Konten Rohkris 64
              </h3>
              <p className="text-xs text-stone-400">
                Khusus Divisi Media, Dokumentasi & Pengurus Rohkris SMKN 64
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div className="p-8 text-center space-y-6 max-w-sm mx-auto my-auto">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-sky-400 to-amber-500 mx-auto shadow-xl">
              <img
                src="/logo.png"
                alt="Logo Rohkris SMKN 64"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">Masukkan PIN Admin</h4>
              <p className="text-xs text-stone-400">
                Gunakan PIN default: <code className="text-amber-300 font-bold">6464</code>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ketik PIN (6464)..."
                autoFocus
                className="w-full text-center tracking-widest text-lg font-mono px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white outline-none"
              />

              {pinError && (
                <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  PIN salah! Coba ketik 6464.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Masuk ke Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex items-center gap-2 p-3 bg-stone-950 border-b border-stone-800 overflow-x-auto no-scrollbar">
              {[
                { id: 'gallery', label: 'Upload Foto Galeri', icon: <Image className="w-4 h-4" /> },
                { id: 'schedule', label: 'Kelola Jadwal', icon: <Calendar className="w-4 h-4" /> },
                { id: 'prayers', label: 'Moderasi Doa', icon: <HeartHandshake className="w-4 h-4" /> },
                { id: 'backup', label: 'Backup / Export', icon: <Download className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'text-stone-400 hover:text-white hover:bg-stone-850'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: GALLERY MANAGER */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <form onSubmit={handleCreateGallery} className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-400" />
                      Tambah Foto Kegiatan Baru
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Judul Kegiatan / Foto *
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Misal: Ibadah Padang Rohkris"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Kategori
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        >
                          <option value="Ibadah Rutin">Ibadah Rutin</option>
                          <option value="Natal">Natal</option>
                          <option value="Paskah">Paskah</option>
                          <option value="Retreat">Retreat</option>
                          <option value="Fellowship">Fellowship</option>
                          <option value="Latihan">Latihan</option>
                        </select>
                      </div>
                    </div>

                    {/* Image URL or File Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs text-stone-300 font-semibold">
                        Sumber Gambar (Pilih File atau Masukkan URL) *
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/... atau paste link foto"
                          className="flex-1 px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />

                        <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 cursor-pointer border border-stone-700">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {newImageUrl && (
                        <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-amber-500/40 mt-2">
                          <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Tanggal Kegiatan
                        </label>
                        <input
                          type="text"
                          value={newDate}
                          onChange={(e) => setNewDate(e.target.value)}
                          placeholder="Misal: 20 Agustus 2026"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Dokumentasi Oleh
                        </label>
                        <input
                          type="text"
                          value={newPhotographer}
                          onChange={(e) => setNewPhotographer(e.target.value)}
                          placeholder="Misal: Revalina & Tim Media"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-stone-300 font-semibold mb-1">
                        Deskripsi Kegiatan
                      </label>
                      <textarea
                        rows={2}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Deskripsi singkat momen..."
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none resize-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      + Publikasikan ke Galeri
                    </button>

                    {gallerySuccess && (
                      <p className="text-xs text-emerald-400 font-semibold text-center flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Foto berhasil ditambahkan ke Galeri!
                      </p>
                    )}
                  </form>

                  {/* Existing Gallery List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                        Daftar Foto Galeri ({galleryItems.length})
                      </h4>
                      <button
                        onClick={onResetGallery}
                        className="text-[11px] text-stone-500 hover:text-amber-400 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset ke Default
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center gap-3"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-14 h-14 rounded-lg object-cover border border-stone-800"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                            <span className="text-[10px] text-amber-400 block">{item.category} • {item.date}</span>
                          </div>
                          <button
                            onClick={() => onDeleteGalleryItem(item.id)}
                            className="p-2 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                            title="Hapus Foto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCHEDULE MANAGER */}
              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <form onSubmit={handleCreateSchedule} className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-400" />
                      Tambah Jadwal Ibadah / Event
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Judul Ibadah / Acara *
                        </label>
                        <input
                          type="text"
                          required
                          value={newSchTitle}
                          onChange={(e) => setNewSchTitle(e.target.value)}
                          placeholder="Misal: Ibadah Rutin Jumat"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Hari & Tanggal *
                        </label>
                        <input
                          type="text"
                          required
                          value={newSchDate}
                          onChange={(e) => setNewSchDate(e.target.value)}
                          placeholder="Misal: Jumat, 28 Agustus 2026"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Waktu
                        </label>
                        <input
                          type="text"
                          value={newSchTime}
                          onChange={(e) => setNewSchTime(e.target.value)}
                          placeholder="11:30 - 13:00 WIB"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Ruangan / Lokasi
                        </label>
                        <input
                          type="text"
                          value={newSchLocation}
                          onChange={(e) => setNewSchLocation(e.target.value)}
                          placeholder="Ruang Multimedia SMKN 64"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Pelayan Firman / Pembicara
                        </label>
                        <input
                          type="text"
                          value={newSchPreacher}
                          onChange={(e) => setNewSchPreacher(e.target.value)}
                          placeholder="Misal: Pdt. Andreas Wicaksono"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Worship Leader
                        </label>
                        <input
                          type="text"
                          value={newSchWorshipLeader}
                          onChange={(e) => setNewSchWorshipLeader(e.target.value)}
                          placeholder="Misal: Grace Natalia"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Tema Firman / Ayat
                        </label>
                        <input
                          type="text"
                          value={newSchTheme}
                          onChange={(e) => setNewSchTheme(e.target.value)}
                          placeholder="Misal: Kolose 2:6-7 — Berakar Kuat di dalam Kristus"
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-300 font-semibold mb-1">
                          Tipe Kegiatan
                        </label>
                        <select
                          value={newSchType}
                          onChange={(e) => setNewSchType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white outline-none focus:border-amber-400"
                        >
                          <option value="jumat_rutin">Ibadah Jumat Rutin</option>
                          <option value="retreat">Retreat / Camp</option>
                          <option value="baksos">Bakti Sosial</option>
                          <option value="natal">Perayaan Natal</option>
                          <option value="paskah">Perayaan Paskah</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      + Tambah Jadwal Ibadah
                    </button>

                    {scheduleSuccess && (
                      <p className="text-xs text-emerald-400 font-semibold text-center flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Jadwal berhasil ditambahkan!
                      </p>
                    )}
                  </form>

                  {/* Existing Schedule List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Daftar Jadwal Aktif ({scheduleEvents.length})
                    </h4>
                    <div className="space-y-2">
                      {scheduleEvents.map((sch) => (
                        <div
                          key={sch.id}
                          className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-3"
                        >
                          <div>
                            <h5 className="text-xs font-bold text-white">{sch.title}</h5>
                            <span className="text-[11px] text-amber-400">{sch.date} • {sch.time}</span>
                          </div>
                          <button
                            onClick={() => onDeleteScheduleEvent(sch.id)}
                            className="p-2 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                            title="Hapus Jadwal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRAYER MODERATOR */}
              {activeTab === 'prayers' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Daftar Permintaan Doa Masuk ({prayerRequests.length})
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {prayerRequests.map((pr) => (
                      <div
                        key={pr.id}
                        className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{pr.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-stone-850 text-amber-300">
                              {pr.topic}
                            </span>
                          </div>
                          <p className="text-xs text-stone-300">{pr.content}</p>
                          <span className="text-[10px] text-stone-500">
                            {pr.createdAt} • {pr.amenCount} Amen
                          </span>
                        </div>

                        <button
                          onClick={() => onDeletePrayer(pr.id)}
                          className="p-2 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-900 transition-colors shrink-0"
                          title="Hapus Doa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: BACKUP & EXPORT */}
              {activeTab === 'backup' && (
                <div className="space-y-6 text-center py-6">
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                      <Download className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Ekspor & Cadangkan Data</h4>
                      <p className="text-xs text-stone-400">
                        Unduh seluruh foto galeri, jadwal ibadah, dan pokok doa dalam format file JSON untuk disimpan sebagai cadangan.
                      </p>
                    </div>

                    <button
                      onClick={handleExportBackup}
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Unduh File Backup JSON</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
