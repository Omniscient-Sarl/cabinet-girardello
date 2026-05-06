import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/db/queries";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { Button } from "@/components/ui/button";
import { SITE_URL } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || undefined,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: "Cabinet Girardello" },
    publisher: { "@type": "Organization", name: "Cabinet Girardello" },
    image: post.coverImageUrl || undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  const faqLd = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-sage-dark">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-sage-dark">Blog</Link>
          <span className="mx-2">/</span>
          <span className="line-clamp-1">{post.title}</span>
        </nav>
      </div>

      <article className="mx-auto max-w-4xl px-4 py-12">
        {/* Cover */}
        {post.coverImageUrl && (
          <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-lg">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          {post.publishedAt && (
            <time dateTime={post.publishedAt.toISOString()}>
              {post.publishedAt.toLocaleDateString("fr-CH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          {post.readingTimeMinutes && (
            <span>{post.readingTimeMinutes} min de lecture</span>
          )}
        </div>

        {/* Body */}
        {post.body && (
          <div className="mt-8">
            <MarkdownRenderer content={post.body} />
          </div>
        )}

        {/* FAQ */}
        {post.faq && post.faq.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold">Questions frequentes</h2>
            <dl className="mt-4 space-y-4">
              {post.faq.map((item, i) => (
                <div key={i}>
                  <dt className="font-semibold">{item.question}</dt>
                  <dd className="mt-1 text-muted-foreground">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-lg bg-cream p-8 text-center">
          <h3 className="font-heading text-xl font-bold">
            Besoin d&apos;un rendez-vous ?
          </h3>
          <p className="mt-2 text-muted-foreground">
            Notre equipe est a votre disposition au Cabinet Girardello a Morges.
          </p>
          <Button render={<Link href="/contact" />} className="mt-4 bg-sage hover:bg-sage-dark">
            Prendre rendez-vous
          </Button>
        </div>
      </article>
    </div>
  );
}
