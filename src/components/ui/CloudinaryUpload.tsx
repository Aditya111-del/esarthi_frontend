import React, { useCallback, useState, useRef } from "react";
import { Upload, X, FileText, Image, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "") + "/api";

export type UploadFolder = "employees" | "shops" | "documents" | "misc";

export interface UploadedFile {
  url: string;
  publicId: string;
  mimeType: string;
  folder: string;
}

interface CloudinaryUploadProps {
  label: string;
  folder: UploadFolder;
  accept?: string;
  currentUrl?: string;
  onUploaded: (file: UploadedFile) => void;
  onClear?: () => void;
  className?: string;
  hint?: string;
  /** Show as compact inline badge instead of full dropzone */
  compact?: boolean;
}

export function CloudinaryUpload({
  label,
  folder,
  accept = "image/jpeg,image/png,image/webp",
  currentUrl,
  onUploaded,
  onClear,
  className = "",
  hint,
  compact = false,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPdfMode = accept.includes("pdf");

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      // Local preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_BASE}/upload/single?folder=${folder}`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Upload failed");
        }

        const data: UploadedFile = await res.json();
        onUploaded(data);
        if (data.url && file.type.startsWith("image/")) {
          setPreview(data.url);
        }
      } catch (err: any) {
        setError(err.message || "Upload failed. Please try again.");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [folder, onUploaded]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin text-violet-400" />
          ) : isPdfMode ? (
            <FileText size={14} className="text-blue-400" />
          ) : (
            <Image size={14} className="text-violet-400" />
          )}
          {uploading ? "Uploading…" : label}
        </button>

        {preview && !isPdfMode && (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        )}

        {preview && isPdfMode && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <CheckCircle2 size={12} />
            Uploaded
            <button type="button" onClick={handleClear} className="ml-1 text-white/40 hover:text-white/70">
              <X size={10} />
            </button>
          </span>
        )}

        {error && (
          <span className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle size={12} />
            {error}
          </span>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
        {label}
      </label>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
          cursor-pointer transition-all duration-300 select-none min-h-[120px] p-4
          ${isDragging
            ? "border-violet-500/80 bg-violet-500/10"
            : "border-white/10 bg-white/[0.03] hover:border-violet-500/40 hover:bg-white/[0.06]"
          }
          ${uploading ? "cursor-not-allowed opacity-70" : ""}
        `}
      >
        {/* Image preview */}
        {preview && !isPdfMode && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <img src={preview} alt="preview" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
          {uploading ? (
            <>
              <Loader2 size={28} className="animate-spin text-violet-400" />
              <span className="text-sm text-white/60">Uploading to Cloudinary…</span>
            </>
          ) : preview ? (
            <>
              {!isPdfMode && (
                <CheckCircle2 size={28} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              )}
              {isPdfMode && <FileText size={28} className="text-blue-400" />}
              <span className="text-sm text-white/80 font-medium">
                {isPdfMode ? "Document uploaded ✓" : "Photo uploaded ✓"}
              </span>
              <span className="text-xs text-white/40">Click to replace</span>
            </>
          ) : (
            <>
              {isPdfMode ? (
                <FileText size={28} className="text-white/20" />
              ) : (
                <Upload size={28} className="text-white/20" />
              )}
              <div>
                <p className="text-sm text-white/50">
                  <span className="text-violet-400 font-medium">Click to upload</span> or drag & drop
                </p>
                {hint && <p className="text-xs text-white/30 mt-0.5">{hint}</p>}
              </div>
            </>
          )}
        </div>

        {/* Clear button */}
        {preview && !uploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="absolute top-2 right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white/60 hover:text-white hover:bg-red-500/40 transition-all duration-200"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
