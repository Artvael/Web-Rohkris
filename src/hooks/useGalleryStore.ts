import { useState, useEffect, useCallback } from 'react';
import type { GalleryItem } from '../types';
import { INITIAL_GALLERY_DATA } from '../data/galleryData';

const STORAGE_KEY_GALLERY = 'rohkris64_gallery_items';

export function useGalleryStore() {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_GALLERY_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GALLERY);
      return stored ? JSON.parse(stored) : INITIAL_GALLERY_DATA;
    } catch {
      return INITIAL_GALLERY_DATA;
    }
  });

  const saveItems = useCallback((newItems: GalleryItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(newItems));
      window.dispatchEvent(new CustomEvent('rohkris64_gallery_change', { detail: newItems }));
    } catch (e) {
      console.warn('Failed to save gallery to storage', e);
    }
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<GalleryItem[]>;
      if (custom.detail) setItems(custom.detail);
    };
    window.addEventListener('rohkris64_gallery_change', handler);
    return () => window.removeEventListener('rohkris64_gallery_change', handler);
  }, []);

  const addItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    const updated = [newItem, ...items];
    saveItems(updated);
    return newItem;
  };

  const updateItem = (id: string, fields: Partial<Omit<GalleryItem, 'id'>>) => {
    const updated = items.map((i) => (i.id === id ? { ...i, ...fields } : i));
    saveItems(updated);
  };

  const deleteItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveItems(updated);
  };

  const resetToDefault = () => {
    saveItems(INITIAL_GALLERY_DATA);
  };

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    resetToDefault,
  };
}
