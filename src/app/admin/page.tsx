export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, Image as ImageIcon, BookOpen } from "lucide-react";

export default async function AdminDashboard() {
  const [pages, practitioners, gallery, posts] = await Promise.all([
    db.select().from(schema.pages),
    db.select().from(schema.practitioners),
    db.select().from(schema.galleryImages),
    db.select().from(schema.blogPosts),
  ]);

  const stats = [
    { label: "Pages", count: pages.length, href: "/admin/pages", icon: FileText },
    { label: "Praticiens", count: practitioners.length, href: "/admin/practitioners", icon: Users },
    { label: "Photos galerie", count: gallery.length, href: "/admin/gallery", icon: ImageIcon },
    { label: "Articles blog", count: posts.length, href: "/admin/blog", icon: BookOpen },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-muted-foreground">
        Administration du Cabinet Girardello
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, count, href, icon: Icon }) => (
          <Link key={href} href={href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sage/10">
                  <Icon className="h-5 w-5 text-sage-dark" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
