import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedBlogPosts } from "@/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles et conseils en physiotherapie par l'equipe du Cabinet Girardello a Morges.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-sage-dark">
            Accueil
          </Link>
          <span className="mx-2">/</span>
          <span>Blog</span>
        </nav>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h1 className="font-heading text-4xl font-bold text-foreground">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Conseils et articles sur la physiotherapie et le bien-etre.
          </p>

          {posts.length === 0 ? (
            <p className="mt-8 text-muted-foreground">
              Aucun article pour le moment. Revenez bientot !
            </p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
                    {post.coverImageUrl ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.coverImageUrl}
                          alt={post.coverImageAlt || post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-sage/10">
                        <span className="font-heading text-2xl text-sage">G</span>
                      </div>
                    )}
                    <CardContent className="p-4">
                      {post.category && (
                        <Badge variant="secondary" className="mb-2 bg-sage/10 text-sage-dark">
                          {post.category}
                        </Badge>
                      )}
                      <h2 className="font-heading text-lg font-bold line-clamp-2">
                        {post.title}
                      </h2>
                      {post.metaDescription && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                          {post.metaDescription}
                        </p>
                      )}
                      {post.readingTimeMinutes && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {post.readingTimeMinutes} min de lecture
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
