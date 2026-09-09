import { useState, useEffect, useCallback } from 'react';
import type { TeamMember, DivisionCategory } from '../types';
import { TEAM_MEMBERS_DATA, DIVISIONS_DATA } from '../data/teamData';

const STORAGE_KEY_TEAM = 'rohkris64_team_members';

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

  const saveMembers = useCallback((newMembers: TeamMember[]) => {
    setMembers(newMembers);
    try {
      localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(newMembers));
      window.dispatchEvent(new CustomEvent('rohkris64_team_change', { detail: newMembers }));
    } catch (e) {
      console.warn('Failed to save team members', e);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<TeamMember[]>;
      if (custom.detail) setMembers(custom.detail);
    };
    window.addEventListener('rohkris64_team_change', handler);
    return () => window.removeEventListener('rohkris64_team_change', handler);
  }, []);

  const addMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...member,
      id: 'team-' + Date.now(),
    };
    const updated = [newMember, ...members];
    saveMembers(updated);
    return newMember;
  };

  const updateMember = (id: string, fields: Partial<Omit<TeamMember, 'id'>>) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...fields } : m));
    saveMembers(updated);
  };

  const deleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    saveMembers(updated);
  };

  const resetToDefault = () => {
    saveMembers(TEAM_MEMBERS_DATA);
  };

  const getMembersByDivision = (division: DivisionCategory) => {
    return members.filter((m) => m.division === division);
  };

  return {
    members,
    divisions: DIVISIONS_DATA,
    addMember,
    updateMember,
    deleteMember,
    resetToDefault,
    getMembersByDivision,
  };
}
