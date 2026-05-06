import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/db/schema";
import fs from "node:fs";
import matter from "gray-matter";
import "dotenv/config";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npm run db:import-post -- <path-to-markdown-file> [--dry-run]");
    process.exit(1);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content: body } = matter(raw);

  const slug =
    frontmatter.slug ||
    frontmatter.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const wordCount = body.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const firstParagraph = body
    .split("\n\n")
    .find((p: string) => p.trim() && !p.startsWith("#") && !p.startsWith("!"));
  const excerpt = firstParagraph
    ? firstParagraph.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").slice(0, 300)
    : null;

  const post = {
    slug,
    title: frontmatter.title,
    metaTitle: frontmatter.metaTitle || frontmatter.title,
    metaDescription: frontmatter.metaDescription || excerpt,
    category: frontmatter.category || null,
    coverImageUrl: frontmatter.coverImage || null,
    coverImageAlt: frontmatter.coverImageAlt || null,
    body,
    faq: frontmatter.faq || null,
    readingTimeMinutes: readingTime,
    status: frontmatter.status || "draft",
    publishedAt: frontmatter.publishedAt
      ? new Date(frontmatter.publishedAt)
      : new Date(),
  };

  console.log("\n--- Import summary ---");
  console.log(`Title:    ${post.title}`);
  console.log(`Slug:     ${post.slug}`);
  console.log(`Status:   ${post.status}`);
  console.log(`Reading:  ${post.readingTimeMinutes} min`);
  console.log(`Words:    ${wordCount}`);

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Would insert the above. Body preview:\n");
    console.log(body.slice(0, 500));
    return;
  }

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const [row] = await db
    .insert(schema.blogPosts)
    .values(post)
    .returning({ id: schema.blogPosts.id });

  console.log(`\nInserted blog post with id=${row.id}`);
}

main().catch(console.error);
