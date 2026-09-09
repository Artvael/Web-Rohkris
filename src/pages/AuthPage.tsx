import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  Shield,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Crown,
  Heart,
  LogIn,
  UserPlus
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const { user, login, register, loginGoogle, loginAsDemoAdmin, loginAsDemoUser, isLoading, error: authError } = useAuth();

  useEffect(() => {
    if (user) {
      navigate(redirectTarget);
    }
  }, [user, navigate, redirectTarget]);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setLocalError('Email dan password wajib diisi');
      return;
    }

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) {
        setSuccessMsg('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          navigate(redirectTarget);
        }, 600);
      }
    } else {
      if (!name) {
        setLocalError('Nama lengkap wajib diisi untuk pendaftaran');
        return;
      }
      const ok = await register(email, password, name, role);
      if (ok) {
        setSuccessMsg('Pendaftaran berhasil! Mengalihkan ke dashboard...');
        setTimeout(() => {
          navigate(redirectTarget);
        }, 800);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError(null);
    await loginGoogle();
  };

  const handleQuickAdmin = () => {
    loginAsDemoAdmin();
    setSuccessMsg('Masuk sebagai Pengurus Inti (Admin)! Mengalihkan...');
    setTimeout(() => {
      navigate('/admin');
    }, 500);
  };

  const handleQuickUser = () => {
    loginAsDemoUser();
    setSuccessMsg('Masuk sebagai Siswa Rohkris! Mengalihkan...');
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f4f0e6] text-[#181d18] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Toon Shapes */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-[#ffd269]/40 border-2 border-[#181d18]/20 blur-sm pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-32 h-32 rounded-3xl bg-[#c5de9b]/40 border-2 border-[#181d18]/20 rotate-12 blur-sm pointer-events-none" />
      <div className="absolute top-1/3 right-8 w-16 h-16 rounded-full bg-[#fed7aa]/50 pointer-events-none" />

      {/* Back to Home Button */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] text-xs font-black hover:bg-[#ffd269] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Web</span>
        </Link>
        <span className="text-xs font-black bg-[#ffd269] px-2.5 py-1 rounded-full border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18]">
          ✦ Portal Rohkris 64 ✦
        </span>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl border-[3px] border-[#181d18] shadow-[6px_6px_0px_#181d18] p-6 sm:p-8 relative z-10 space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ffd269] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18] mx-auto mb-2">
            <Crown className="w-6 h-6 text-[#181d18]" />
          </div>
          <h1 className="text-2xl font-black text-[#181d18] font-['Outfit'] tracking-tight">
            {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Rohkris 64'}
          </h1>
          <p className="text-xs text-[#343831] font-medium">
            {mode === 'login'
              ? 'Kelola web sebagai Admin atau jelajahi fitur sebagai Anggota.'
              : 'Daftarkan diri Anda untuk berpartisipasi dan mengelola konten.'}
          </p>
        </div>

        {/* Mode Toggle (Login vs Register) */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#f4f0e6] rounded-2xl border-2 border-[#181d18]">
          <button
            type="button"
            onClick={() => { setMode('login'); setLocalError(null); }}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]'
                : 'text-[#181d18]/70 hover:text-[#181d18]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk (Login)</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setLocalError(null); }}
            className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-[#ffd269] text-[#181d18] border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18]'
                : 'text-[#181d18]/70 hover:text-[#181d18]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun</span>
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {(localError || authError) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-2xl bg-[#fee2e2] border-2 border-[#ef4444] text-[#991b1b] text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localError || authError}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 rounded-2xl bg-[#dcfce7] border-2 border-[#22c55e] text-[#166534] text-xs font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#fafafa] border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] text-xs font-black flex items-center justify-center gap-2.5 transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
        >
          {/* Google G Logo SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t-2 border-[#181d18]/15 w-full" />
          <span className="bg-white px-3 text-[11px] font-black text-[#181d18]/50 uppercase tracking-wider relative">
            atau dengan email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-black text-[#181d18] mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#181d18]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Jonathan Doe"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#ffffff] border-2 border-[#181d18] focus:shadow-[3px_3px_0px_#181d18] text-xs font-bold outline-none transition-all"
                  required={mode === 'register'}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-[#181d18] mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#181d18]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#ffffff] border-2 border-[#181d18] focus:shadow-[3px_3px_0px_#181d18] text-xs font-bold outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#181d18] mb-1">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#181d18]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#ffffff] border-2 border-[#181d18] focus:shadow-[3px_3px_0px_#181d18] text-xs font-bold outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Role selection when registering */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-black text-[#181d18] mb-1.5">
                Daftar Sebagai Peran:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-2.5 rounded-2xl text-left border-2 border-[#181d18] transition-all cursor-pointer ${
                    role === 'admin'
                      ? 'bg-[#c5de9b] shadow-[2.5px_2.5px_0px_#181d18]'
                      : 'bg-white hover:bg-[#f4f0e6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-[#181d18]">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Pengurus (Admin)</span>
                  </div>
                  <p className="text-[10px] text-[#343831] mt-0.5 font-medium">
                    Bisa edit foto, jadwal, lagu & kelola web.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`p-2.5 rounded-2xl text-left border-2 border-[#181d18] transition-all cursor-pointer ${
                    role === 'user'
                      ? 'bg-[#ffd269] shadow-[2.5px_2.5px_0px_#181d18]'
                      : 'bg-white hover:bg-[#f4f0e6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-black text-xs text-[#181d18]">
                    <Heart className="w-3.5 h-3.5" />
                    <span>User Biasa</span>
                  </div>
                  <p className="text-[10px] text-[#343831] mt-0.5 font-medium">
                    Kirim doa & jelajahi semua konten.
                  </p>
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-full bg-[#c5de9b] hover:bg-[#b5d483] border-2 border-[#181d18] shadow-[3.5px_3.5px_0px_#181d18] text-xs font-black text-[#181d18] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru'}</span>
          </button>
        </form>

        {/* Quick Access Box for Testing & Fast Admin Login */}
        <div className="p-3.5 rounded-2xl bg-[#fef9c3] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18] space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-[#181d18]">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#181d18]" />
              Akses Cepat Pengurus:
            </span>
            <span className="text-[10px] bg-[#ffd269] px-2 py-0.5 rounded-full border border-[#181d18]">
              Instant Admin
            </span>
          </div>
          <p className="text-[11px] text-[#4b5563] leading-relaxed">
            Ingin langsung masuk dan mengedit website tanpa mengisi form?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="flex-1 py-1.5 px-3 rounded-xl bg-[#181d18] text-white text-xs font-black shadow-[1.5px_1.5px_0px_#854d0e] hover:bg-[#283228] transition-all cursor-pointer"
            >
              👑 Masuk Sebagai Admin
            </button>
            <button
              type="button"
              onClick={handleQuickUser}
              className="py-1.5 px-3 rounded-xl bg-white text-[#181d18] text-xs font-bold border border-[#181d18] shadow-[1.5px_1.5px_0px_#181d18] hover:bg-[#f4f0e6] transition-all cursor-pointer"
            >
              Siswa
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
