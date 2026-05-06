"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function NewPractitionerPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!fullName || !slug) {
      toast.error("Nom et slug requis");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/practitioners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, slug, title: "Physiotherapeute" }),
      });
      const data = await res.json();
      toast.success("Praticien cree");
      router.push(`/admin/practitioners/${data.id}`);
    } catch {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Nouveau praticien</h1>
      <div className="mt-8 max-w-md space-y-4">
        <div className="space-y-1">
          <Label>Nom complet</Label>
          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setSlug(
                e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")
              );
            }}
          />
        </div>
        <div className="space-y-1">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <Button onClick={handleCreate} disabled={saving} className="bg-sage hover:bg-sage-dark">
          {saving ? "Creation..." : "Creer"}
        </Button>
      </div>
    </div>
  );
}
