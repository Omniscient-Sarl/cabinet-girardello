import type { MetadataRoute } from "next";
import { getPublishedBlogPosts } from "@/db/queries";
import { SITE_URL } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedBlogPosts();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/equipe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/politique-de-confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...blogPages];
}
