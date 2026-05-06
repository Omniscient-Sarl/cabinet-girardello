import Link from "next/link";
import { getAllPractitioners } from "@/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function AdminPractitionersPage() {
  const practitioners = await getAllPractitioners();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Praticiens</h1>
        <Button render={<Link href="/admin/practitioners/new" />} className="bg-sage hover:bg-sage-dark">
          <Plus className="mr-2 h-4 w-4" /> Ajouter
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {practitioners.map((p) => (
          <Link key={p.id} href={`/admin/practitioners/${p.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h2 className="font-medium">{p.fullName}</h2>
                  <p className="text-sm text-muted-foreground">{p.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={p.published ? "default" : "secondary"}>
                    {p.published ? "Publie" : "Brouillon"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    #{p.displayOrder}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
