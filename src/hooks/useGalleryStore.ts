import { useState, useEffect } from 'react';
import type { GalleryItem } from '../types';
import { INITIAL_GALLERY_DATA } from '../data/galleryData';

const STORAGE_KEY_GALLERY = 'rohkris64_gallery_items';

export function useGalleryStore() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY_DATA);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GALLERY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load gallery from storage', e);
    }
  }, []);

  const saveItems = (newItems: GalleryItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(newItems));
    } catch (e) {
      console.warn('Failed to save gallery to storage', e);
    }
  };

  const addItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    const updated = [newItem, ...items];
    saveItems(updated);
    return newItem;
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
    deleteItem,
    resetToDefault,
  };
}
