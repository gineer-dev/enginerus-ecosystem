"use client";

import { useRef, useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const allowedTypes = ["image/", "video/", "application/pdf"];
const maxBytes = 25 * 1024 * 1024;

export function FileUpload({ bucket = "vendora-media", pathPrefix = "uploads" }: { bucket?: string; pathPrefix?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<{ name: string; path: string }[]>([]);
  const [isUploading, setUploading] = useState(false);

  async function upload(fileList: FileList | null) {
    if (!fileList?.length) return;
    const supabase = createClient();
    setUploading(true);

    try {
      for (const file of Array.from(fileList)) {
        const validType = allowedTypes.some((type) => file.type.startsWith(type) || file.type === type);
        if (!validType || file.size > maxBytes) {
          toast.error(`${file.name} is not an allowed file or exceeds 25MB.`);
          continue;
        }
        const path = `${pathPrefix}/${crypto.randomUUID()}-${file.name}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false });
        if (error) throw error;
        setFiles((current) => [...current, { name: file.name, path }]);
      }
      toast.success("Upload complete");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(path: string) {
    const supabase = createClient();
    await supabase.storage.from(bucket).remove([path]);
    setFiles((current) => current.filter((file) => file.path !== path));
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <input ref={inputRef} type="file" multiple className="hidden" accept="image/*,video/*,application/pdf" onChange={(event) => upload(event.target.files)} />
      <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading}>
        <UploadCloud className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Upload files"}
      </Button>
      {files.length ? (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.path} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span className="truncate">{file.name}</span>
              <Button type="button" variant="ghost" className="px-2" onClick={() => remove(file.path)} aria-label={`Delete ${file.name}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
