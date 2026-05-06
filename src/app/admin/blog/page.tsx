import Link from "next/link";
import { getAllBlogPosts } from "@/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Blog</h1>
        <Button render={<Link href="/admin/blog/new" />} className="bg-sage hover:bg-sage-dark">
          <Plus className="mr-2 h-4 w-4" /> Nouvel article
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {posts.length === 0 && (
          <p className="text-muted-foreground">Aucun article.</p>
        )}
        {posts.map((post) => (
          <Link key={post.id} href={`/admin/blog/${post.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h2 className="font-medium">{post.title}</h2>
                  <p className="text-sm text-muted-foreground">/{post.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                  {post.readingTimeMinutes && (
                    <span className="text-xs text-muted-foreground">
                      {post.readingTimeMinutes} min
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
