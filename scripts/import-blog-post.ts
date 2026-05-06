import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import fs from "node:fs";
import path from "node:path";
import "dotenv/config";
import { normalizeGrokMarkdown } from "./lib/normalize-grok-markdown";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const filePath = args.find((a) => !a.startsWith("--"));

if (!filePath) {
  console.error(
    "Usage: npm run db:import-post -- <path-to-markdown-file> [--dry-run]"
  );
  process.exit(1);
}

const absolutePath = path.resolve(filePath);
if (!fs.existsSync(absolutePath)) {
  console.error(`File not found: ${absolutePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(absolutePath, "utf-8");

// --- Parse META INFORMATION block at the end ---
// Split on the last "---" followed by "META INFORMATION"
const metaSeparator = /\n---\s*\n\s*META INFORMATION[^\n]*/;
const metaMatch = raw.match(metaSeparator);

let articleBody: string;
let metaBlock: string;

if (metaMatch && metaMatch.index !== undefined) {
  articleBody = raw.slice(0, metaMatch.index).trimEnd();
  metaBlock = raw.slice(metaMatch.index + metaMatch[0].length);
} else {
  console.error("ERROR: Could not find META INFORMATION block at end of file.");
  process.exit(1);
}

// Parse meta fields from the block
function parseMetaField(block: string, field: string): string | null {
  const regex = new RegExp(`^${field}:\\s*(.+)$`, "m");
  const match = block.match(regex);
  return match ? match[1].trim() : null;
}

const slug = parseMetaField(metaBlock, "slug");
if (!slug) {
  console.error("ERROR: slug not found in META INFORMATION block.");
  process.exit(1);
}

const metaTitle = parseMetaField(metaBlock, "meta_title");
const metaDescription = parseMetaField(metaBlock, "meta_description");
const category = parseMetaField(metaBlock, "category");

const readingTimeRaw = parseMetaField(metaBlock, "reading_time_estimate");
const readingTimeMinutes = readingTimeRaw
  ? parseInt(readingTimeRaw.replace(/\D/g, ""), 10) || null
  : null;

// Parse FAQ array from meta block
interface FaqItem {
  question: string;
  answer: string;
}
function parseFaq(block: string): FaqItem[] {
  const items: FaqItem[] = [];
  const faqSection = block.match(
    /faq_for_jsonld:\s*\n([\s\S]*?)(?=\n[a-z_]+:|$)/
  );
  if (!faqSection) return items;

  const faqText = faqSection[1];
  const entryRegex =
    /-\s*question:\s*"([^"]+)"\s*\n\s*answer:\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(faqText)) !== null) {
    items.push({ question: m[1], answer: m[2] });
  }
  return items;
}

const faqItems = parseFaq(metaBlock);

// --- Extract H1 as title, strip from body ---
const h1Match = articleBody.match(/^# (.+)$/m);
const title = h1Match ? h1Match[1].trim() : slug;

// Strip the H1 line from the body (page renders it separately)
let body = articleBody.replace(/^# .+\n*/m, "").trim();

// Normalize markdown
const { normalized, diff } = normalizeGrokMarkdown(body, {
  title,
  faq: faqItems,
});
body = normalized;

// Compute word count and reading time fallback
const wordCount = body.split(/\s+/).filter(Boolean).length;
const finalReadingTime =
  readingTimeMinutes || Math.max(1, Math.ceil(wordCount / 200));

// Print summary
console.log("\n--- Normalizer Diff ---");
console.log(`  H1 prefixed:          ${diff.h1Prefixed}`);
console.log(`  H2 prefixed:          ${diff.h2Prefixed}`);
console.log(`  H3 numbered:          ${diff.h3Numbered}`);
console.log(`  H3 FAQ questions:     ${diff.h3Faq}`);
console.log(`  Bullet lists:         ${diff.bulletLists}`);
console.log(`  Callouts:             ${diff.callouts}`);
console.log(`  Inline links:         ${diff.inlineLinks}`);
console.log(`  Bold labels:          ${diff.boldLabels}`);
console.log(`  Tables fixed:         ${diff.tablesFixed}`);
console.log(`  Sources enriched:     ${diff.authoritativeSourcesEnriched}`);
console.log(`  False citations:      ${diff.falsecitationsStripped}`);

console.log("\n--- Import Preview ---");
console.log(`  Title:             ${title}`);
console.log(`  Slug:              ${slug}`);
console.log(`  Meta title:        ${metaTitle}`);
console.log(`  Meta description:  ${metaDescription}`);
console.log(`  Category:          ${category}`);
console.log(`  Reading time:      ${finalReadingTime} min`);
console.log(`  FAQ items:         ${faqItems.length}`);
console.log(`  Body length:       ${body.length} chars`);
console.log(`  Word count:        ${wordCount}`);

if (dryRun) {
  console.log("\n[DRY RUN] No database write. Preview of body (first 500 chars):\n");
  console.log(body.slice(0, 500));
  console.log("\n--- End of dry run ---");
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function run() {
  const existing = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, slug!))
    .limit(1);

  const values = {
    slug: slug!,
    title,
    metaTitle,
    metaDescription,
    category,
    body,
    faq: faqItems.length > 0 ? faqItems : null,
    readingTimeMinutes: finalReadingTime,
    status: "published" as const,
    publishedAt: new Date(),
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(schema.blogPosts)
      .set(values)
      .where(eq(schema.blogPosts.slug, slug!));
    console.log(`\nUpdated existing post: ${slug}`);
  } else {
    await db.insert(schema.blogPosts).values(values);
    console.log(`\nInserted new post: ${slug}`);
  }

  console.log("Article imported successfully.");
}

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
