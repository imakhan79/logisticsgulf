"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

/** Uploads directly to a Supabase Storage bucket at `${companyId}/<uuid>-<filename>`,
 * matching the storage RLS policies (first path segment must be the caller's company_id). */
export function FileUpload({
  bucket,
  companyId,
  accept,
  onUploaded,
  className,
}: {
  bucket: string;
  companyId: string;
  accept?: string;
  onUploaded: (path: string, publicOrSignedUrl: string | null) => void;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    setFileName(file.name);

    const supabase = createClient();
    const path = `${companyId}/${crypto.randomUUID()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);
    let url: string | null = publicData?.publicUrl ?? null;

    if (bucket !== "logos") {
      const { data: signedData } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
      url = signedData?.signedUrl ?? null;
    }

    setUploading(false);
    onUploaded(path, url);
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) upload(file);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver ? "border-teal-500 bg-teal-500/5" : "border-border-subtle hover:border-foreground-muted",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
        {uploading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            <p className="text-xs text-foreground-muted">Uploading {fileName}...</p>
          </>
        ) : fileName && !error ? (
          <>
            <FileText className="h-5 w-5 text-teal-500" />
            <p className="text-xs text-foreground-muted">{fileName} uploaded</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
              }}
              className="flex items-center gap-1 text-xs text-foreground-muted underline"
            >
              <X className="h-3 w-3" /> Replace
            </button>
          </>
        ) : (
          <>
            <UploadCloud className="h-5 w-5 text-foreground-muted" />
            <p className="text-xs text-foreground-muted">Click or drag a file to upload</p>
          </>
        )}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
