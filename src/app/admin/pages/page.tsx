export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllPages } from "@/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminPagesPage() {
  const pages = await getAllPages();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Pages & Sections</h1>
      <p className="mt-1 text-muted-foreground">
        Editez le contenu de chaque page du site.
      </p>

      <div className="mt-8 space-y-3">
        {pages.map((page) => (
          <Link key={page.id} href={`/admin/pages/${page.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h2 className="font-medium">{page.title}</h2>
                  <p className="text-sm text-muted-foreground">/{page.slug}</p>
                </div>
                <Badge variant={page.status === "published" ? "default" : "secondary"}>
                  {page.status}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
