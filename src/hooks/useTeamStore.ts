import { useState, useEffect, useCallback } from 'react';
import type { TeamMember, DivisionCategory } from '../types';
import { TEAM_MEMBERS_DATA, DIVISIONS_DATA } from '../data/teamData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY_TEAM = 'rohkris64_team_members';

function mapDbToTeam(row: any): TeamMember {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role,
    division: row.division as DivisionCategory,
    grade: row.grade || undefined,
    instagram: row.instagram || undefined,
    quote: row.quote || undefined,
  };
}

function mapTeamToDb(item: Partial<TeamMember>) {
  const db: any = {};
  if (item.id !== undefined) db.id = item.id;
  if (item.name !== undefined) db.name = item.name;
  if (item.role !== undefined) db.role = item.role;
  if (item.division !== undefined) db.division = item.division;
  if (item.grade !== undefined) db.grade = item.grade;
  if (item.instagram !== undefined) db.instagram = item.instagram;
  if (item.quote !== undefined) db.quote = item.quote;
  return db;
}

export function useTeamStore() {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    if (typeof window === 'undefined') return TEAM_MEMBERS_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TEAM);
      return stored ? JSON.parse(stored) : TEAM_MEMBERS_DATA;
    } catch {
      return TEAM_MEMBERS_DATA;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const saveLocalBackup = useCallback((newMembers: TeamMember[]) => {
    setMembers(newMembers);
    try {
      localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(newMembers));
      window.dispatchEvent(new CustomEvent('rohkris64_team_change', { detail: newMembers }));
    } catch (e) {
      console.warn('Failed to save team members locally', e);
    }
  }, []);

  const fetchTeam = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbToTeam);
        saveLocalBackup(mapped);
      }
    } catch (err) {
      console.warn('Error fetching team members from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [saveLocalBackup]);

  useEffect(() => {
    fetchTeam();

    const handler = (e: Event) => {
      const custom = e as CustomEvent<TeamMember[]>;
      if (custom.detail) setMembers(custom.detail);
    };
    window.addEventListener('rohkris64_team_change', handler);

    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('public:team_members')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'team_members' },
          () => {
            fetchTeam();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('rohkris64_team_change', handler);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchTeam]);

  const addMember = async (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: 'team-' + Date.now(),
    };
    const updated = [newMember, ...members];
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('team_members').insert([mapTeamToDb(newMember)]);
      } catch (err) {
        console.warn('Failed to insert team member to Supabase:', err);
      }
    }
    return newMember;
  };

  const updateMember = async (id: string, fields: Partial<Omit<TeamMember, 'id'>>) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...fields } : m));
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('team_members').update(mapTeamToDb(fields)).eq('id', id);
      } catch (err) {
        console.warn('Failed to update team member in Supabase:', err);
      }
    }
  };

  const deleteMember = async (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('team_members').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete team member from Supabase:', err);
      }
    }
  };

  const resetToDefault = async () => {
    saveLocalBackup(TEAM_MEMBERS_DATA);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('team_members').delete().neq('id', 'keep_all');
        const rows = TEAM_MEMBERS_DATA.map((t) => mapTeamToDb(t));
        await supabase.from('team_members').upsert(rows);
      } catch (err) {
        console.warn('Failed to reset team members in Supabase:', err);
      }
    }
  };

  const getMembersByDivision = (division: DivisionCategory) => {
    return members.filter((m) => m.division === division);
  };

  return {
    members,
    divisions: DIVISIONS_DATA,
    isLoading,
    addMember,
    updateMember,
    deleteMember,
    resetToDefault,
    getMembersByDivision,
    refresh: fetchTeam,
  };
}
