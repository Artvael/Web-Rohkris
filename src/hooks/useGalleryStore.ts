import { useState, useEffect, useCallback } from 'react';
import type { GalleryItem } from '../types';
import { INITIAL_GALLERY_DATA } from '../data/galleryData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY_GALLERY = 'rohkris64_gallery_items';

function mapDbToGallery(row: any): GalleryItem {
  return {
    id: String(row.id),
    title: row.title,
    category: row.category as GalleryItem['category'],
    imageUrl: row.image_url,
    date: row.date,
    description: row.description || '',
    photographer: row.photographer || '',
  };
}

function mapGalleryToDb(item: Partial<GalleryItem>) {
  const db: any = {};
  if (item.id !== undefined) db.id = item.id;
  if (item.title !== undefined) db.title = item.title;
  if (item.category !== undefined) db.category = item.category;
  if (item.imageUrl !== undefined) db.image_url = item.imageUrl;
  if (item.date !== undefined) db.date = item.date;
  if (item.description !== undefined) db.description = item.description;
  if (item.photographer !== undefined) db.photographer = item.photographer;
  return db;
}

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

  const [isLoading, setIsLoading] = useState(false);

  const saveLocalBackup = useCallback((newItems: GalleryItem[]) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY_GALLERY, JSON.stringify(newItems));
      window.dispatchEvent(new CustomEvent('rohkris64_gallery_change', { detail: newItems }));
    } catch (e) {
      console.warn('Failed to save gallery to local storage', e);
    }
  }, []);

  // Fetch from Supabase
  const fetchGallery = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbToGallery);
        saveLocalBackup(mapped);
      }
    } catch (err) {
      console.warn('Error fetching gallery from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [saveLocalBackup]);

  useEffect(() => {
    fetchGallery();

    const handler = (e: Event) => {
      const custom = e as CustomEvent<GalleryItem[]>;
      if (custom.detail) setItems(custom.detail);
    };
    window.addEventListener('rohkris64_gallery_change', handler);

    // Supabase Realtime channel
    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('public:gallery_items')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'gallery_items' },
          () => {
            fetchGallery();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('rohkris64_gallery_change', handler);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchGallery]);

  const addItem = async (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    const updated = [newItem, ...items];
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_items').insert([mapGalleryToDb(newItem)]);
      } catch (err) {
        console.warn('Failed to insert gallery to Supabase:', err);
      }
    }
    return newItem;
  };

  const updateItem = async (id: string, fields: Partial<Omit<GalleryItem, 'id'>>) => {
    const updated = items.map((i) => (i.id === id ? { ...i, ...fields } : i));
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_items').update(mapGalleryToDb(fields)).eq('id', id);
      } catch (err) {
        console.warn('Failed to update gallery in Supabase:', err);
      }
    }
  };

  const deleteItem = async (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    saveLocalBackup(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_items').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete gallery from Supabase:', err);
      }
    }
  };

  const resetToDefault = async () => {
    saveLocalBackup(INITIAL_GALLERY_DATA);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('gallery_items').delete().neq('id', 'keep_all');
        const rows = INITIAL_GALLERY_DATA.map((i) => mapGalleryToDb(i));
        await supabase.from('gallery_items').upsert(rows);
      } catch (err) {
        console.warn('Failed to reset gallery in Supabase:', err);
      }
    }
  };

  return {
    items,
    isLoading,
    addItem,
    updateItem,
    deleteItem,
    resetToDefault,
    refresh: fetchGallery,
  };
}
