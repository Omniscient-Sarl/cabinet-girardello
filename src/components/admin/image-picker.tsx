"use client";

import { useState } from "react";
import Image from "next/image";
import { generateUploadButton } from "@uploadthing/react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

interface ImagePickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

export function ImagePicker({ value, onChange, label }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Preview"
            width={200}
            height={120}
            className="rounded-md border object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6"
            onClick={() => onChange(null)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="URL de l'image..."
            onChange={(e) => {
              if (e.target.value) onChange(e.target.value);
            }}
          />
          <UploadButton
            endpoint="imageUploader"
            onUploadBegin={() => setUploading(true)}
            onClientUploadComplete={(res) => {
              setUploading(false);
              if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl);
            }}
            onUploadError={() => setUploading(false)}
          />
          {uploading && (
            <p className="text-xs text-muted-foreground">Upload en cours...</p>
          )}
        </div>
      )}
    </div>
  );
}
