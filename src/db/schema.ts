import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  varchar,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  cabinetName: text("cabinet_name").notNull().default("Cabinet Girardello"),
  tagline: text("tagline"),
  phone: text("phone"),
  email: text("email"),
  addressStreet: text("address_street"),
  addressPostalCode: text("address_postal_code"),
  addressCity: text("address_city"),
  openingHoursText: text("opening_hours_text"),
  footerDescription: text("footer_description"),
  contactDestinationEmail: text("contact_destination_email"),
  googleMapsEmbedUrl: text("google_maps_embed_url"),
  googleSiteVerification: text("google_site_verification"),
  defaultOgImageUrl: text("default_og_image_url"),
  defaultOgImageAlt: text("default_og_image_alt"),
  googleBusinessUrl: text("google_business_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const practitioners = pgTable(
  "practitioners",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    fullName: text("full_name").notNull(),
    title: text("title"),
    photoUrl: text("photo_url"),
    photoAlt: text("photo_alt"),
    bioShort: text("bio_short"),
    bioLong: text("bio_long"),
    qualifications: jsonb("qualifications").$type<string[]>().default([]),
    specialties: jsonb("specialties").$type<string[]>().default([]),
    rcc: text("rcc"),
    formations: jsonb("formations").$type<string[]>().default([]),
    externalSiteUrl: text("external_site_url"),
    externalSiteLabel: text("external_site_label"),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("practitioners_slug_idx").on(table.slug)]
);

export const pages = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: text("title").notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogImageUrl: text("og_image_url"),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("pages_slug_idx").on(table.slug)]
);

export const pageSections = pgTable("page_sections", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  order: integer("order").notNull().default(0),
  type: varchar("type", { length: 50 }).notNull(),
  content: jsonb("content").$type<Record<string, unknown>>().notNull(),
  imageUrl: text("image_url"),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text").notNull(),
  caption: text("caption"),
  displayOrder: integer("display_order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: text("title").notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    category: varchar("category", { length: 100 }),
    authorPractitionerId: integer("author_practitioner_id").references(
      () => practitioners.id,
      { onDelete: "set null" }
    ),
    coverImageUrl: text("cover_image_url"),
    coverImageAlt: text("cover_image_alt"),
    body: text("body"),
    faq: jsonb("faq").$type<Array<{ question: string; answer: string }>>(),
    readingTimeMinutes: integer("reading_time_minutes"),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("blog_posts_slug_idx").on(table.slug)]
);

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  uploadthingUrl: text("uploadthing_url").notNull(),
  uploadthingKey: text("uploadthing_key").notNull(),
  altText: text("alt_text").notNull(),
  width: integer("width"),
  height: integer("height"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});
