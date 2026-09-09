import { supabase } from './supabase';

export interface ProcessedImage {
  url: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

/**
 * Compresses an image file in the browser using HTML Canvas.
 * Reduces 5MB-10MB mobile phone photos to ~100-200KB crisp web-ready images.
 */
export async function processAndCompressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<ProcessedImage> {
  const { maxWidth = 1440, maxHeight = 1440, quality = 0.84 } = options;

  return new Promise((resolve, reject) => {
    // Basic file type check
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan gambar (gunakan JPG, PNG, WebP)'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));

    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak didukung atau rusak'));

      img.onload = async () => {
        let { width, height } = img;

        // Calculate aspect ratio scale
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve({
            url: reader.result as string,
            originalName: file.name,
            originalSize: file.size,
            compressedSize: file.size,
            width: img.width,
            height: img.height,
          });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Export as optimized JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        const approxCompressedSize = Math.round((compressedDataUrl.length * 3) / 4);

        let finalUrl = compressedDataUrl;

        // If Supabase is active, optionally upload to Supabase Storage
        if (supabase) {
          try {
            const res = await fetch(compressedDataUrl);
            const blob = await res.blob();
            const ext = 'jpg';
            const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
            const storagePath = `gallery/${Date.now()}_${cleanName}.${ext}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('gallery')
              .upload(storagePath, blob, {
                contentType: 'image/jpeg',
                upsert: true,
              });

            if (!uploadError && uploadData) {
              const { data: publicUrlData } = supabase.storage
                .from('gallery')
                .getPublicUrl(uploadData.path);

              if (publicUrlData?.publicUrl) {
                finalUrl = publicUrlData.publicUrl;
              }
            }
          } catch {
            // Silently use compressedDataUrl
          }
        }

        resolve({
          url: finalUrl,
          originalName: file.name,
          originalSize: file.size,
          compressedSize: approxCompressedSize,
          width,
          height,
        });
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
