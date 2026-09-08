import { useState, useEffect } from 'react';

const STORAGE_KEY = 'rohkris64_cursor_name';
const DEFAULT_NAME = 'Sophie';

export function useUserCursorName() {
  const [name, setName] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_NAME;
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_NAME;
  });

  const updateName = (newName: string) => {
    const trimmed = newName.trim() || DEFAULT_NAME;
    setName(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
      window.dispatchEvent(new CustomEvent('rohkris64_cursor_name_change', { detail: trimmed }));
    } catch (e) {
      console.warn('Failed to persist cursor name', e);
    }
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setName(custom.detail);
      }
    };
    window.addEventListener('rohkris64_cursor_name_change', handler);
    return () => window.removeEventListener('rohkris64_cursor_name_change', handler);
  }, []);

  return { name, setName: updateName };
}
