"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { generateUploadButton } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Copy } from "lucide-react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadButton = generateUploadButton<OurFileRouter>();

interface MediaItem {
  id: number;
  uploadthingUrl: string;
  uploadthingKey: string;
  altText: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function deleteItem(id: number) {
    if (!confirm("Supprimer ce media ?")) return;
    await fetch("/api/admin/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter((i) => i.id !== id));
    toast.success("Media supprime");
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    toast.success("URL copiee");
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Medias</h1>
      <p className="mt-1 text-muted-foreground">
        Bibliotheque d&apos;images UploadThing
      </p>

      <div className="mt-6">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={async (res) => {
            if (!res?.[0]) return;
            const file = res[0];
            const resp = await fetch("/api/admin/media", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                uploadthingUrl: file.ufsUrl,
                uploadthingKey: file.key,
                altText: file.name,
              }),
            });
            const item = await resp.json();
            setItems([item, ...items]);
            toast.success("Upload termine");
          }}
          onUploadError={() => { toast.error("Erreur d'upload"); }}
        />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={item.uploadthingUrl}
                alt={item.altText}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex items-center justify-between p-2">
              <p className="truncate text-xs text-muted-foreground">
                {item.altText}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => copyUrl(item.uploadthingUrl)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => deleteItem(item.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
