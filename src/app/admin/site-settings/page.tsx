"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePicker } from "@/components/admin/image-picker";
import { toast } from "sonner";

interface Settings {
  cabinetName: string;
  tagline: string;
  phone: string;
  email: string;
  addressStreet: string;
  addressPostalCode: string;
  addressCity: string;
  openingHoursText: string;
  footerDescription: string;
  contactDestinationEmail: string;
  googleMapsEmbedUrl: string;
  googleSiteVerification: string;
  defaultOgImageUrl: string | null;
  defaultOgImageAlt: string;
  googleBusinessUrl: string;
}

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((r) => r.json())
      .then((data) => setSettings(data || {
        cabinetName: "",
        tagline: "",
        phone: "",
        email: "",
        addressStreet: "",
        addressPostalCode: "",
        addressCity: "",
        openingHoursText: "",
        footerDescription: "",
        contactDestinationEmail: "",
        googleMapsEmbedUrl: "",
        googleSiteVerification: "",
        defaultOgImageUrl: null,
        defaultOgImageAlt: "",
        googleBusinessUrl: "",
      }));
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      toast.success("Parametres enregistres");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <p>Chargement...</p>;

  const field = (key: keyof Settings, label: string, type: "text" | "textarea" = "text") => (
    <div key={key} className="space-y-1">
      <Label>{label}</Label>
      {type === "textarea" ? (
        <Textarea
          value={(settings[key] as string) || ""}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
          rows={3}
        />
      ) : (
        <Input
          value={(settings[key] as string) || ""}
          onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Parametres du site</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-sage hover:bg-sage-dark">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="font-heading text-lg font-bold">Identite</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {field("cabinetName", "Nom du cabinet")}
            {field("tagline", "Slogan")}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold">Coordonnees</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {field("phone", "Telephone")}
            {field("email", "Email")}
            {field("contactDestinationEmail", "Email de destination (formulaire)")}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold">Adresse</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {field("addressStreet", "Rue")}
            {field("addressPostalCode", "NPA")}
            {field("addressCity", "Ville")}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold">Horaires & Footer</h2>
          <div className="mt-4 space-y-4">
            {field("openingHoursText", "Horaires d'ouverture", "textarea")}
            {field("footerDescription", "Description footer", "textarea")}
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-bold">SEO & Maps</h2>
          <div className="mt-4 space-y-4">
            {field("googleMapsEmbedUrl", "URL Google Maps embed")}
            {field("googleSiteVerification", "Google Site Verification")}
            {field("googleBusinessUrl", "URL Google Business")}
            <ImagePicker
              label="Image OG par defaut"
              value={settings.defaultOgImageUrl}
              onChange={(url) => setSettings({ ...settings, defaultOgImageUrl: url })}
            />
            {field("defaultOgImageAlt", "Alt de l'image OG")}
          </div>
        </section>
      </div>
    </div>
  );
}
