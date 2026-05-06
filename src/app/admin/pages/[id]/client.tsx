"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePicker } from "@/components/admin/image-picker";
import { SECTION_REGISTRY } from "@/lib/section-registry";
import { toast } from "sonner";
import { GripVertical, Trash2, ChevronDown, ChevronRight, Plus } from "lucide-react";

interface Page {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  status: string;
}

interface Section {
  id: number;
  pageId: number;
  order: number;
  type: string;
  content: Record<string, unknown>;
  imageUrl: string | null;
}

export function PageEditorClient({
  page,
  initialSections,
}: {
  page: Page;
  initialSections: Section[];
}) {
  const router = useRouter();
  const [pageData, setPageData] = useState(page);
  const [sections, setSections] = useState(initialSections);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);

  const toggleExpand = (id: number) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  async function savePage() {
    setSaving(true);
    try {
      await fetch(`/api/admin/pages/${page.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pageData.title,
          metaTitle: pageData.metaTitle,
          metaDescription: pageData.metaDescription,
          ogImageUrl: pageData.ogImageUrl,
          status: pageData.status,
        }),
      });
      toast.success("Page enregistree");
    } catch {
      toast.error("Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function saveSection(section: Section) {
    try {
      await fetch(`/api/admin/pages/${page.id}/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: section.content,
          imageUrl: section.imageUrl,
        }),
      });
      toast.success("Section enregistree");
    } catch {
      toast.error("Erreur");
    }
  }

  async function addSection(type: string) {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          order: sections.length,
          content: {},
        }),
      });
      const newSection = await res.json();
      setSections([...sections, newSection]);
      setExpanded(new Set([...expanded, newSection.id]));
      toast.success("Section ajoutee");
    } catch {
      toast.error("Erreur");
    }
  }

  async function deleteSection(sectionId: number) {
    if (!confirm("Supprimer cette section ?")) return;
    try {
      await fetch(`/api/admin/pages/${page.id}/sections/${sectionId}`, {
        method: "DELETE",
      });
      setSections(sections.filter((s) => s.id !== sectionId));
      toast.success("Section supprimee");
    } catch {
      toast.error("Erreur");
    }
  }

  function updateSectionContent(sectionId: number, key: string, value: unknown) {
    setSections(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, content: { ...s.content, [key]: value } }
          : s
      )
    );
  }

  const metaTitleLen = (pageData.metaTitle || "").length;
  const metaDescLen = (pageData.metaDescription || "").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">{page.title}</h1>
          <p className="text-sm text-muted-foreground">/{page.slug}</p>
        </div>
        <Button onClick={savePage} disabled={saving} className="bg-sage hover:bg-sage-dark">
          {saving ? "..." : "Enregistrer la page"}
        </Button>
      </div>

      {/* Page metadata */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Metadonnees de la page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Titre</Label>
              <Input
                value={pageData.title}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Statut</Label>
              <Select
                value={pageData.status}
                onValueChange={(v) => setPageData({ ...pageData, status: v as string })}
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
              value={pageData.metaTitle || ""}
              onChange={(e) => setPageData({ ...pageData, metaTitle: e.target.value })}
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
              value={pageData.metaDescription || ""}
              onChange={(e) => setPageData({ ...pageData, metaDescription: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold">Sections</h2>
        <div className="mt-4 space-y-3">
          {sections.map((section) => {
            const def = SECTION_REGISTRY[section.type];
            const isOpen = expanded.has(section.id);

            return (
              <Card key={section.id}>
                <div
                  className="flex cursor-pointer items-center justify-between p-4"
                  onClick={() => toggleExpand(section.id)}
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {def?.label || section.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(section.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {isOpen && def && (
                  <CardContent className="border-t pt-4">
                    <div className="space-y-4">
                      {def.fields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <Label>
                            {field.label}
                            {field.help && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                — {field.help}
                              </span>
                            )}
                          </Label>
                          {field.type === "image" ? (
                            <ImagePicker
                              value={(section.content[field.key] as string) || null}
                              onChange={(url) =>
                                updateSectionContent(section.id, field.key, url)
                              }
                            />
                          ) : field.type === "textarea" || field.type === "markdown" ? (
                            <Textarea
                              value={(section.content[field.key] as string) || ""}
                              onChange={(e) =>
                                updateSectionContent(section.id, field.key, e.target.value)
                              }
                              rows={field.rows || 4}
                            />
                          ) : (
                            <Input
                              value={(section.content[field.key] as string) || ""}
                              onChange={(e) =>
                                updateSectionContent(section.id, field.key, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
                      <Button
                        onClick={() => saveSection(section)}
                        className="bg-sage hover:bg-sage-dark"
                      >
                        Enregistrer la section
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* Add section */}
        <div className="mt-4">
          <Select onValueChange={(v: unknown) => { if (v && typeof v === "string") addSection(v); }}>
            <SelectTrigger className="w-64">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <SelectValue placeholder="Ajouter une section..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SECTION_REGISTRY).map(([key, def]) => (
                <SelectItem key={key} value={key}>
                  {def.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
