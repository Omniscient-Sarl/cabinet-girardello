"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImagePicker } from "@/components/admin/image-picker";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Practitioner {
  id: number;
  slug: string;
  displayOrder: number;
  fullName: string;
  title: string | null;
  photoUrl: string | null;
  photoAlt: string | null;
  bioShort: string | null;
  bioLong: string | null;
  qualifications: string[];
  specialties: string[];
  rcc: string | null;
  formations: string[];
  externalSiteUrl: string | null;
  externalSiteLabel: string | null;
  published: boolean;
}

export default function PractitionerEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<Practitioner | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/practitioners/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/practitioners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Praticien enregistre");
    } catch {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce praticien ?")) return;
    await fetch(`/api/admin/practitioners/${id}`, { method: "DELETE" });
    toast.success("Praticien supprime");
    router.push("/admin/practitioners");
  }

  if (!data) return <p>Chargement...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{data.fullName}</h1>
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-sage hover:bg-sage-dark">
            {saving ? "..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Nom complet</Label>
            <Input
              value={data.fullName}
              onChange={(e) => setData({ ...data, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Titre / Fonction</Label>
            <Input
              value={data.title || ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Ordre d&apos;affichage</Label>
            <Input
              type="number"
              value={data.displayOrder}
              onChange={(e) =>
                setData({ ...data, displayOrder: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <ImagePicker
          label="Photo"
          value={data.photoUrl}
          onChange={(url) => setData({ ...data, photoUrl: url })}
        />
        <div className="space-y-1">
          <Label>Alt photo</Label>
          <Input
            value={data.photoAlt || ""}
            onChange={(e) => setData({ ...data, photoAlt: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>Bio courte</Label>
          <Textarea
            value={data.bioShort || ""}
            onChange={(e) => setData({ ...data, bioShort: e.target.value })}
            rows={2}
          />
        </div>
        <div className="space-y-1">
          <Label>Bio longue (Markdown)</Label>
          <Textarea
            value={data.bioLong || ""}
            onChange={(e) => setData({ ...data, bioLong: e.target.value })}
            rows={8}
          />
        </div>

        <div className="space-y-1">
          <Label>Specialites (separees par des virgules)</Label>
          <Input
            value={(data.specialties || []).join(", ")}
            onChange={(e) =>
              setData({
                ...data,
                specialties: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        </div>
        <div className="space-y-1">
          <Label>Qualifications (separees par des virgules)</Label>
          <Textarea
            value={(data.qualifications || []).join("\n")}
            onChange={(e) =>
              setData({
                ...data,
                qualifications: e.target.value.split("\n").filter(Boolean),
              })
            }
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>URL site externe</Label>
            <Input
              value={data.externalSiteUrl || ""}
              onChange={(e) =>
                setData({ ...data, externalSiteUrl: e.target.value })
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Label lien externe</Label>
            <Input
              value={data.externalSiteLabel || ""}
              onChange={(e) =>
                setData({ ...data, externalSiteLabel: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label>RCC</Label>
          <Input
            value={data.rcc || ""}
            onChange={(e) => setData({ ...data, rcc: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={data.published}
            onCheckedChange={(v) => setData({ ...data, published: v })}
          />
          <Label>Publie</Label>
        </div>
      </div>
    </div>
  );
}
