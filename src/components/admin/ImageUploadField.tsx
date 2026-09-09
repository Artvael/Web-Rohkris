import React, { useState, useRef } from 'react';
import {
  Upload,
  Link2,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { processAndCompressImage, formatFileSize, type ProcessedImage } from '../../lib/imageProcessor';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label = 'Foto Dokumentasi / Gambar',
  value,
  onChange,
  required = false,
}) => {
  // Mode: 'file' (upload file dari perangkat) atau 'url' (masukkan link online)
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<ProcessedImage | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);
    try {
      const processed = await processAndCompressImage(file);
      setImageMeta(processed);
      onChange(processed.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memproses gambar');
    } finally {
      setIsProcessing(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // reset input so selecting the same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleClear = () => {
    onChange('');
    setImageMeta(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-2">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-xs font-black text-[#181d18]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <div className="inline-flex p-0.5 bg-[#f4f0e6] rounded-xl border-2 border-[#181d18]">
          <button
            type="button"
            onClick={() => setInputMode('file')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
              inputMode === 'file'
                ? 'bg-[#ffd269] text-[#181d18] border border-[#181d18] shadow-[1px_1px_0px_#181d18]'
                : 'text-[#181d18]/70 hover:text-[#181d18]'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File (HP/Laptop)</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
              inputMode === 'url'
                ? 'bg-[#ffd269] text-[#181d18] border border-[#181d18] shadow-[1px_1px_0px_#181d18]'
                : 'text-[#181d18]/70 hover:text-[#181d18]'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Link URL Web</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-100 border-2 border-red-500 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mode 1: File Upload (HP/Laptop) */}
      {inputMode === 'file' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={onFileInputChange}
            className="hidden"
          />

          {value ? (
            /* Selected / Uploaded Image Card */
            <div className="p-3 bg-[#fdfdf5] rounded-2xl border-2 border-[#181d18] shadow-[3px_3px_0px_#181d18] space-y-2.5">
              <div className="relative h-44 rounded-xl overflow-hidden border-2 border-[#181d18] bg-[#f4f0e6]">
                <img
                  src={value}
                  alt="Preview Foto"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80';
                  }}
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 text-[#c5de9b]" />
                  <span>Foto Terpilih & Siap Disimpan</span>
                </div>
              </div>

              {/* File details badge */}
              {imageMeta && (
                <div className="flex flex-wrap items-center justify-between text-[11px] font-bold bg-[#c5de9b]/30 p-2 rounded-xl border border-[#181d18]/20">
                  <span className="truncate max-w-[200px]">📄 {imageMeta.originalName}</span>
                  <span className="text-[#2d5016]">
                    ✨ {formatFileSize(imageMeta.compressedSize)} (Optimal)
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#181d18] text-xs font-bold border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:bg-[#f4f0e6] flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Ganti Foto</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-[#fee2e2] text-[#991b1b] text-xs font-bold border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] hover:bg-[#fecaca] flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Upload Zone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-2.5 ${
                isDragging
                  ? 'border-[#181d18] bg-[#ffd269]/30 scale-[1.01]'
                  : 'border-[#181d18]/40 bg-[#fdfdf5] hover:border-[#181d18] hover:bg-[#fff9e6]'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#ffd269] border-2 border-[#181d18] shadow-[2.5px_2.5px_0px_#181d18] flex items-center justify-center">
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 text-[#181d18] animate-spin" />
                ) : (
                  <Upload className="w-6 h-6 text-[#181d18]" />
                )}
              </div>

              <div>
                <p className="text-xs font-black text-[#181d18]">
                  {isProcessing
                    ? 'Sedang Mengompresi & Memproses Foto...'
                    : isDragging
                    ? 'Lepaskan Foto Di Sini!'
                    : 'Pilih Foto dari Galeri HP / Laptop'}
                </p>
                <p className="text-[10px] text-[#555] mt-0.5 font-medium">
                  Klik untuk jelajahi file atau seret foto ke kotak ini (JPG, PNG, WebP)
                </p>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border-2 border-[#181d18] shadow-[2px_2px_0px_#181d18] text-xs font-black text-[#181d18] hover:bg-[#ffd269] transition-all">
                <Sparkles className="w-3 h-3 text-[#181d18]" />
                <span>Pilih Foto dari Perangkat</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Link URL */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              required={required && !value}
              placeholder="https://images.unsplash.com/... atau link gambar online"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fdfdf5] border-2 border-[#181d18] text-xs font-bold text-[#181d18] focus:outline-none focus:bg-white"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#666] hover:text-red-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {value && (
            <div className="relative h-36 rounded-xl overflow-hidden border-2 border-[#181d18] bg-[#f4f0e6]">
              <img
                src={value}
                alt="Preview URL"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80';
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
