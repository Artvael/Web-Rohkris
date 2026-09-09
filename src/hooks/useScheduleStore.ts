import { useState, useEffect, useCallback } from 'react';
import type { ScheduleEvent } from '../types';
import { SCHEDULE_DATA } from '../data/scheduleData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY_SCHEDULE = 'rohkris64_schedule_events_v2';

function mapDbToSchedule(row: any): ScheduleEvent {
  return {
    id: String(row.id),
    title: row.title,
    date: row.date,
    time: row.time,
    location: row.location,
    theme: row.theme || '',
    preacher: row.preacher || '',
    worshipLeader: row.worship_leader || '',
    musician: row.musician || '',
    type: (row.type as ScheduleEvent['type']) || 'jumat_rutin',
    status: (row.status as ScheduleEvent['status']) || 'upcoming',
    notes: row.notes || '',
  };
}

function mapScheduleToDb(item: Partial<ScheduleEvent>) {
  const db: any = {};
  if (item.id !== undefined) db.id = item.id;
  if (item.title !== undefined) db.title = item.title;
  if (item.date !== undefined) db.date = item.date;
  if (item.time !== undefined) db.time = item.time;
  if (item.location !== undefined) db.location = item.location;
  if (item.theme !== undefined) db.theme = item.theme;
  if (item.preacher !== undefined) db.preacher = item.preacher;
  if (item.worshipLeader !== undefined) db.worship_leader = item.worshipLeader;
  if (item.musician !== undefined) db.musician = item.musician;
  if (item.type !== undefined) db.type = item.type;
  if (item.status !== undefined) db.status = item.status;
  if (item.notes !== undefined) db.notes = item.notes;
  return db;
}

export function useScheduleStore() {
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    if (typeof window === 'undefined') return SCHEDULE_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCHEDULE);
      return stored ? JSON.parse(stored) : SCHEDULE_DATA;
    } catch {
      return SCHEDULE_DATA;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const saveLocalBackup = useCallback((newEvents: ScheduleEvent[]) => {
    setEvents(newEvents);
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(newEvents));
      window.dispatchEvent(new CustomEvent('rohkris64_schedule_change', { detail: newEvents }));
    } catch (e) {
      console.warn('Failed to save schedule to local storage', e);
    }
  }, []);

  const fetchSchedule = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbToSchedule);
        saveLocalBackup(mapped);
      }
    } catch (err) {
      console.warn('Error fetching schedule from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [saveLocalBackup]);

  useEffect(() => {
    fetchSchedule();

    const handler = (e: Event) => {
      const custom = e as CustomEvent<ScheduleEvent[]>;
      if (custom.detail) setEvents(custom.detail);
    };
    window.addEventListener('rohkris64_schedule_change', handler);

    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('public:schedule_events')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'schedule_events' },
          () => {
            fetchSchedule();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('rohkris64_schedule_change', handler);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchSchedule]);

  const addEvent = async (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: 'sch-' + Date.now(),
    };
    const updated = [newEvent, ...events];
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('schedule_events').insert([mapScheduleToDb(newEvent)]);
      } catch (err) {
        console.warn('Failed to insert schedule to Supabase:', err);
      }
    }
    return newEvent;
  };

  const updateEvent = async (id: string, fields: Partial<Omit<ScheduleEvent, 'id'>>) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...fields } : e));
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('schedule_events').update(mapScheduleToDb(fields)).eq('id', id);
      } catch (err) {
        console.warn('Failed to update schedule in Supabase:', err);
      }
    }
  };

  const deleteEvent = async (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('schedule_events').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete schedule from Supabase:', err);
      }
    }
  };

  const resetToDefault = async () => {
    saveLocalBackup(SCHEDULE_DATA);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('schedule_events').delete().neq('id', 'keep_all');
        const rows = SCHEDULE_DATA.map((s) => mapScheduleToDb(s));
        await supabase.from('schedule_events').upsert(rows);
      } catch (err) {
        console.warn('Failed to reset schedule in Supabase:', err);
      }
    }
  };

  return {
    events,
    nextEvent: events.find((e) => e.status === 'upcoming') || events[0],
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    resetToDefault,
    refresh: fetchSchedule,
  };
}
