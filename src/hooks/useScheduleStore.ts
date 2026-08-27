import { useState, useEffect } from 'react';
import type { ScheduleEvent } from '../types';
import { SCHEDULE_DATA } from '../data/scheduleData';
const STORAGE_KEY_SCHEDULE = 'rohkris64_schedule_events_v2';

export function useScheduleStore() {
  const [events, setEvents] = useState<ScheduleEvent[]>(SCHEDULE_DATA);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCHEDULE);
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load schedule from storage', e);
    }
  }, []);

  const saveEvents = (newEvents: ScheduleEvent[]) => {
    setEvents(newEvents);
    try {
      localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(newEvents));
    } catch (e) {
      console.warn('Failed to save schedule to storage', e);
    }
  };

  const addEvent = (event: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...event,
      id: 'sch-' + Date.now(),
    };
    const updated = [newEvent, ...events];
    saveEvents(updated);
    return newEvent;
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
    deleteEvent,
    resetToDefault,
  };
}
