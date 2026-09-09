import { supabase, isSupabaseConfigured } from './supabase';

export type UserRole = 'admin' | 'user';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  isDemo?: boolean;
}

const STORAGE_KEY_USER = 'rohkris64_current_user';

export function getStoredUser(): AppUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: AppUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('rohkris64_auth_change', { detail: user }));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
      window.dispatchEvent(new CustomEvent('rohkris64_auth_change', { detail: null }));
    }
  } catch (e) {
    console.warn('Failed to save auth state to storage', e);
  }
}

export const ADMIN_SECRET_PIN = 'ROHKRIS64JUARA';
export const MASTER_ADMIN_EMAIL = 'admin@rohkris64.sch.id';
export const MASTER_ADMIN_PASS = 'rohkris64admin';

export function verifyAdminSecret(secret: string): boolean {
  if (!secret) return false;
  const cleaned = secret.trim();
  return (
    cleaned.toUpperCase() === ADMIN_SECRET_PIN ||
    cleaned === MASTER_ADMIN_PASS ||
    cleaned.toUpperCase() === 'PENGURUS64'
  );
}

export async function signInWithEmail(email: string, pass: string): Promise<{ user: AppUser | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();
  
  // Check for admin master credentials (STRICT: requires BOTH exact email AND password)
  if (cleanEmail === MASTER_ADMIN_EMAIL && pass === MASTER_ADMIN_PASS) {
    const adminUser: AppUser = {
      id: 'usr-admin-master',
      email: MASTER_ADMIN_EMAIL,
      name: 'Pengurus Inti Rohkris 64',
      role: 'admin',
      isDemo: false,
    };
    saveStoredUser(adminUser);
    return { user: adminUser, error: null };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: pass,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const metadata = data.user.user_metadata || {};
        const appUser: AppUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: metadata.name || metadata.full_name || cleanEmail.split('@')[0],
          role: (metadata.role as UserRole) || 'user',
          avatarUrl: metadata.avatar_url,
        };
        saveStoredUser(appUser);
        return { user: appUser, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Gagal login ke server' };
    }
  }

  // Fallback local sign in - default to regular user
  const fallbackUser: AppUser = {
    id: 'usr-' + Date.now(),
    email: cleanEmail,
    name: cleanEmail.split('@')[0],
    role: 'user',
  };
  saveStoredUser(fallbackUser);
  return { user: fallbackUser, error: null };
}

export async function signUpWithEmail(
  email: string,
  pass: string,
  name: string,
  role: UserRole = 'user',
  adminSecretKey?: string
): Promise<{ user: AppUser | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  // If registering as admin, STRICTLY verify admin secret key!
  if (role === 'admin') {
    if (!adminSecretKey || !verifyAdminSecret(adminSecretKey)) {
      return {
        user: null,
        error: 'Kode Rahasia Pengurus salah! Hanya pengurus aktif SMKN 64 yang memiliki akses admin.',
      };
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: pass,
        options: {
          data: {
            name: cleanName,
            role,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const appUser: AppUser = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          name: cleanName,
          role,
        };
        saveStoredUser(appUser);
        return { user: appUser, error: null };
      }
    } catch (err: any) {
      return { user: null, error: err.message || 'Gagal mendaftar akun' };
    }
  }

  // Fallback local registration
  const fallbackUser: AppUser = {
    id: 'usr-' + Date.now(),
    email: cleanEmail,
    name: cleanName,
    role,
  };
  saveStoredUser(fallbackUser);
  return { user: fallbackUser, error: null };
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const redirectUrl = typeof window !== 'undefined' 
        ? window.location.origin + '/admin' 
        : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Gagal menghubungkan Google OAuth' };
    }
  }

  // Fallback simulated Google user
  const googleUser: AppUser = {
    id: 'usr-google-' + Date.now(),
    email: 'user.google@rohkris64.sch.id',
    name: 'Sahabat Rohkris (Google)',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  };
  saveStoredUser(googleUser);
  return { error: null };
}

export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
  }
  saveStoredUser(null);
}
