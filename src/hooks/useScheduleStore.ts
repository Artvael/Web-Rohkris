import { useState, useEffect, useCallback } from 'react';
import type { ScheduleEvent } from '../types';
import { SCHEDULE_DATA } from '../data/scheduleData';

const STORAGE_KEY_SCHEDULE = 'rohkris64_schedule_events_v2';

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

  const saveEvents = useCallback((newEvents: ScheduleEvent[]) => {
    setEvents(newEvents);
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(newEvents));
      window.dispatchEvent(new CustomEvent('rohkris64_schedule_change', { detail: newEvents }));
    } catch (e) {
      console.warn('Failed to save schedule to storage', e);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<ScheduleEvent[]>;
      if (custom.detail) setEvents(custom.detail);
    };
    window.addEventListener('rohkris64_schedule_change', handler);
    return () => window.removeEventListener('rohkris64_schedule_change', handler);
  }, []);

  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: 'sch-' + Date.now(),
    };
    const updated = [newEvent, ...events];
    saveEvents(updated);
    return newEvent;
  };

  const updateEvent = (id: string, fields: Partial<Omit<ScheduleEvent, 'id'>>) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...fields } : e));
    saveEvents(updated);
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    saveEvents(updated);
  };

  const resetToDefault = () => {
    saveEvents(SCHEDULE_DATA);
  };

  return {
    events,
    nextEvent: events.find((e) => e.status === 'upcoming') || events[0],
    addEvent,
    updateEvent,
    deleteEvent,
    resetToDefault,
  };
}
