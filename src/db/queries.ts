import { cache } from "react";
import { eq, asc, desc } from "drizzle-orm";
import { db } from ".";
import * as schema from "./schema";

// --- Site Settings ---

export const getSiteSettings = cache(async () => {
  const rows = await db.select().from(schema.siteSettings).limit(1);
  return rows[0] ?? null;
});

// --- Pages & Sections ---

export const getPageBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export const getPageSections = cache(async (pageId: number) => {
  return db
    .select()
    .from(schema.pageSections)
    .where(eq(schema.pageSections.pageId, pageId))
    .orderBy(asc(schema.pageSections.order));
});

export const getPageContent = cache(async (slug: string) => {
  const page = await getPageBySlug(slug);
  if (!page) return null;
  const sections = await getPageSections(page.id);
  const map = new Map<string, Record<string, unknown>>();
  for (const s of sections) {
    map.set(s.type, s.content);
  }
  return map;
});

export const getAllPages = cache(async () => {
  return db.select().from(schema.pages).orderBy(asc(schema.pages.slug));
});

// --- Practitioners ---

export const getPublishedPractitioners = cache(async () => {
  return db
    .select()
    .from(schema.practitioners)
    .where(eq(schema.practitioners.published, true))
    .orderBy(asc(schema.practitioners.displayOrder));
});

export const getPractitionerBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(schema.practitioners)
    .where(eq(schema.practitioners.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export const getAllPractitioners = cache(async () => {
  return db
    .select()
    .from(schema.practitioners)
    .orderBy(asc(schema.practitioners.displayOrder));
});

// --- Gallery ---

export const getPublishedGalleryImages = cache(async () => {
  return db
    .select()
    .from(schema.galleryImages)
    .where(eq(schema.galleryImages.published, true))
    .orderBy(asc(schema.galleryImages.displayOrder));
});

export const getAllGalleryImages = cache(async () => {
  return db
    .select()
    .from(schema.galleryImages)
    .orderBy(asc(schema.galleryImages.displayOrder));
});

// --- Blog ---

export const getPublishedBlogPosts = cache(async () => {
  return db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.status, "published"))
    .orderBy(desc(schema.blogPosts.publishedAt));
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export const getAllBlogPosts = cache(async () => {
  return db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.publishedAt));
});

// --- Media ---

export const getAllMedia = cache(async () => {
  return db
    .select()
    .from(schema.media)
    .orderBy(desc(schema.media.uploadedAt));
});
