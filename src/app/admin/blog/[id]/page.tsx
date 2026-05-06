"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePicker } from "@/components/admin/image-picker";
import { toast } from "sonner";
import { Trash2, ExternalLink } from "lucide-react";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  category: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  body: string | null;
  faq: Array<{ question: string; answer: string }> | null;
  readingTimeMinutes: number | null;
  status: string;
}

export default function BlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      toast.success("Article enregistre");
    } catch {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Supprimer cet article ?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    toast.success("Article supprime");
    router.push("/admin/blog");
  }

  if (!data) return <p>Chargement...</p>;

  const metaTitleLen = (data.metaTitle || "").length;
  const metaDescLen = (data.metaDescription || "").length;
  const bodyLen = (data.body || "").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{data.title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" render={<a href={`/blog/${data.slug}`} target="_blank" rel="noopener noreferrer" />}>
            <ExternalLink className="mr-1 h-3 w-3" /> Voir
          </Button>
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
            <Label>Titre</Label>
            <Input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input
              value={data.slug}
              onChange={(e) => setData({ ...data, slug: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Categorie</Label>
            <Input
              value={data.category || ""}
              onChange={(e) => setData({ ...data, category: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Statut</Label>
            <Select
              value={data.status}
              onValueChange={(v) => setData({ ...data, status: v as string })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Publie</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>
            Meta title{" "}
            <span className={metaTitleLen > 60 ? "text-destructive" : "text-muted-foreground"}>
              ({metaTitleLen}/60)
            </span>
          </Label>
          <Input
            value={data.metaTitle || ""}
            onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>
            Meta description{" "}
            <span className={metaDescLen > 160 ? "text-destructive" : "text-muted-foreground"}>
              ({metaDescLen}/160)
            </span>
          </Label>
          <Textarea
            value={data.metaDescription || ""}
            onChange={(e) => setData({ ...data, metaDescription: e.target.value })}
            rows={2}
          />
        </div>

        <ImagePicker
          label="Image de couverture"
          value={data.coverImageUrl}
          onChange={(url) => setData({ ...data, coverImageUrl: url })}
        />
        <div className="space-y-1">
          <Label>Alt image de couverture</Label>
          <Input
            value={data.coverImageAlt || ""}
            onChange={(e) => setData({ ...data, coverImageAlt: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>
            Corps (Markdown){" "}
            <span className="text-muted-foreground">({bodyLen} caracteres)</span>
          </Label>
          <Textarea
            value={data.body || ""}
            onChange={(e) => setData({ ...data, body: e.target.value })}
            rows={20}
            className="font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}
