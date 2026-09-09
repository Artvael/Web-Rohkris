import { useState, useEffect, useCallback } from 'react';
import {
  type AppUser,
  type UserRole,
  getStoredUser,
  saveStoredUser,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOutUser,
} from '../lib/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state with storage and Supabase session
  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<AppUser | null>;
      setUser(custom.detail);
    };

    window.addEventListener('rohkris64_auth_change', handleAuthChange);

    // If Supabase is active, listen to Supabase auth state change
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            const meta = session.user.user_metadata || {};
            const appUser: AppUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: meta.name || meta.full_name || session.user.email?.split('@')[0] || 'Member',
              role: (meta.role as UserRole) || 'user',
              avatarUrl: meta.avatar_url || meta.picture,
            };
            setUser(appUser);
            saveStoredUser(appUser);
          } else if (_event === 'SIGNED_OUT') {
            setUser(null);
            saveStoredUser(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
        window.removeEventListener('rohkris64_auth_change', handleAuthChange);
      };
    }

    return () => {
      window.removeEventListener('rohkris64_auth_change', handleAuthChange);
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithEmail(email, pass);
      if (result.error) {
        setError(result.error);
        return false;
      }
      setUser(result.user);
      return true;
    } catch (err: any) {
      setError(err.message || 'Login gagal');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, role: UserRole = 'user') => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signUpWithEmail(email, pass, name, role);
      if (result.error) {
        setError(result.error);
        return false;
      }
      setUser(result.user);
      return true;
    } catch (err: any) {
      setError(err.message || 'Registrasi gagal');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Gagal login Google');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOutUser();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemoAdmin = useCallback(() => {
    const demoAdmin: AppUser = {
      id: 'usr-admin-demo',
      email: 'admin@rohkris64.sch.id',
      name: 'Pengurus Inti Rohkris 64',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isDemo: true,
    };
    setUser(demoAdmin);
    saveStoredUser(demoAdmin);
  }, []);

  const loginAsDemoUser = useCallback(() => {
    const demoUser: AppUser = {
      id: 'usr-member-demo',
      email: 'siswa@rohkris64.sch.id',
      name: 'Siswa Rohkris 64',
      role: 'user',
      isDemo: true,
    };
    setUser(demoUser);
    saveStoredUser(demoUser);
  }, []);

  const promoteToAdmin = useCallback(() => {
    if (!user) return;
    const updated: AppUser = {
      ...user,
      role: 'admin',
    };
    setUser(updated);
    saveStoredUser(updated);
  }, [user]);

  return {
    user,
    role: user?.role,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isLoading,
    error,
    login,
    register,
    loginGoogle,
    logout,
    loginAsDemoAdmin,
    loginAsDemoUser,
    promoteToAdmin,
  };
}
