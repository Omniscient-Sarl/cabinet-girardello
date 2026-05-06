"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePicker } from "@/components/admin/image-picker";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface GalleryImage {
  id: number;
  imageUrl: string;
  altText: string;
  caption: string | null;
  displayOrder: number;
  published: boolean;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [newUrl, setNewUrl] = useState<string | null>(null);
  const [newAlt, setNewAlt] = useState("");

  useEffect(() => {
    fetch("/api/admin/gallery")
      .then((r) => r.json())
      .then(setImages);
  }, []);

  async function addImage() {
    if (!newUrl || !newAlt) {
      toast.error("Image et texte alternatif requis");
      return;
    }
    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: newUrl,
        altText: newAlt,
        displayOrder: images.length,
      }),
    });
    const img = await res.json();
    setImages([...images, img]);
    setNewUrl(null);
    setNewAlt("");
    toast.success("Image ajoutee");
  }

  async function deleteImage(id: number) {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    setImages(images.filter((i) => i.id !== id));
    toast.success("Image supprimee");
  }

  async function updateImage(img: GalleryImage) {
    await fetch(`/api/admin/gallery/${img.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(img),
    });
    toast.success("Image mise a jour");
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Galerie</h1>

      {/* Add */}
      <Card className="mt-6">
        <CardContent className="space-y-4 p-4">
          <h2 className="font-medium">Ajouter une image</h2>
          <ImagePicker value={newUrl} onChange={setNewUrl} />
          <div className="space-y-1">
            <Label>Texte alternatif</Label>
            <Input value={newAlt} onChange={(e) => setNewAlt(e.target.value)} />
          </div>
          <Button onClick={addImage} className="bg-sage hover:bg-sage-dark">
            <Plus className="mr-2 h-4 w-4" /> Ajouter
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img) => (
          <Card key={img.id} className="overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image
                src={img.imageUrl}
                alt={img.altText}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="space-y-2 p-3">
              <Input
                value={img.altText}
                onChange={(e) =>
                  setImages(
                    images.map((i) =>
                      i.id === img.id ? { ...i, altText: e.target.value } : i
                    )
                  )
                }
                onBlur={() => updateImage(img)}
                placeholder="Texte alternatif"
              />
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteImage(img.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
