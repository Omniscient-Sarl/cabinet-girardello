export interface NormalizeDiff {
  h1Prefixed: number;
  h2Prefixed: number;
  h3Numbered: number;
  h3Faq: number;
  bulletLists: number;
  callouts: number;
  inlineLinks: number;
  boldLabels: number;
  tablesFixed: number;
  authoritativeSourcesEnriched: number;
  falsecitationsStripped: number;
}

const H2_PATTERNS = [
  "Qu'est-ce",
  "Quels sont",
  "Quelles",
  "Comment",
  "Quels traitements",
  "Que puis-je",
  "Que faire",
  "Quand faut-il",
  "Quand consulter",
  "À quoi ressemble",
  "À retenir",
  "FAQ",
  "Sources et références",
  "Prenez rendez-vous",
  "Pourquoi choisir",
  "Pourquoi la physiothérapie",
  "Les causes",
  "Les techniques",
  "Conseils pratiques",
  "Conclusion",
  "Symptômes",
  "Diagnostic",
  "Le rôle",
  "Prévention",
  "Exercices",
  "Traitement",
];

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function fuzzyMatch(a: string, b: string): boolean {
  const na = stripAccents(a.toLowerCase().trim());
  const nb = stripAccents(b.toLowerCase().trim());
  return na === nb || na.includes(nb) || nb.includes(na);
}

export function normalizeGrokMarkdown(
  body: string,
  frontmatter: Record<string, unknown>
): { normalized: string; diff: NormalizeDiff } {
  const diff: NormalizeDiff = {
    h1Prefixed: 0,
    h2Prefixed: 0,
    h3Numbered: 0,
    h3Faq: 0,
    bulletLists: 0,
    callouts: 0,
    inlineLinks: 0,
    boldLabels: 0,
    tablesFixed: 0,
    authoritativeSourcesEnriched: 0,
    falsecitationsStripped: 0,
  };

  const lines = body.split("\n");
  const title = (frontmatter.title as string) ?? "";
  const faqItems =
    (frontmatter.faq as Array<{ question: string; answer: string }>) ?? [];

  // === Transform 1: H1 detection ===
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith("# ")) break; // already has H1
    if (fuzzyMatch(line, title)) {
      lines[i] = `# ${line}`;
      diff.h1Prefixed++;
      break;
    }
    break; // only check first non-empty line
  }

  // === Transform 2: H2 detection ===
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith("## ") || line.startsWith("# ")) continue;
    if (line.length === 0 || line.length >= 100 || line.endsWith(".")) continue;
    if (
      line.endsWith("?") &&
      faqItems.some((fq) => fuzzyMatch(line, fq.question))
    )
      continue;

    const prevBlank = i === 0 || lines[i - 1].trim() === "";
    const nextBlank = i === lines.length - 1 || lines[i + 1].trim() === "";
    if (!prevBlank || !nextBlank) continue;

    const matchesH2 = H2_PATTERNS.some((p) =>
      stripAccents(line.toLowerCase()).startsWith(stripAccents(p.toLowerCase()))
    );
    if (matchesH2) {
      lines[i] = `## ${line}`;
      diff.h2Prefixed++;
    }
  }

  // === Transform 8: Pipe table normalization ===
  // Fix tables where separator row is missing or malformed
  let text = lines.join("\n");

  // === Transform 3: H3 numbered items ===
  text = text.replace(
    /(## .*(?:\d+\s+(?:signes?|exercices?|conseils?|raisons?|astuces?|techniques?)).*\n)([\s\S]*?)(?=\n## |\n$|$)/gi,
    (match, h2Line: string, sectionBody: string) => {
      const fixed = sectionBody.replace(
        /^(\d+)\. (.{3,100})$/gm,
        (m: string, num: string, rest: string) => {
          if (m.startsWith("### ")) return m;
          if (rest.endsWith(".")) return m;
          diff.h3Numbered++;
          return `### ${num}. ${rest}`;
        }
      );
      return h2Line + fixed;
    }
  );

  // === Transform 4: H3 FAQ questions ===
  text = text.replace(
    /(## FAQ\n)([\s\S]*?)(?=\n## |\n$|$)/i,
    (match, h2Line: string, faqBody: string) => {
      const faqLines = faqBody.split("\n");
      for (let i = 0; i < faqLines.length; i++) {
        const line = faqLines[i].trim();
        if (!line.endsWith("?")) continue;
        if (line.startsWith("### ")) continue;
        const isFaqQ = faqItems.some((fq) => fuzzyMatch(line, fq.question));
        if (isFaqQ) {
          faqLines[i] = `### ${line}`;
          diff.h3Faq++;
        }
      }
      return h2Line + faqLines.join("\n");
    }
  );

  // === Transform 10: Bold inline labels ===
  text = text.replace(
    /^((?:Fréquence|Précaution|Durée|Intensité|Progression|Variante)\s*:\s*)(.+)$/gm,
    (match, label: string, rest: string) => {
      if (match.startsWith("**")) return match;
      diff.boldLabels++;
      return `**${label.trim()}** ${rest}`;
    }
  );

  // === Transform 5: Bullet lists ===
  const allLines = text.split("\n");
  let i = 0;
  while (i < allLines.length) {
    const line = allLines[i].trim();
    if (line.endsWith(":") || line.endsWith(" :")) {
      let j = i + 1;
      if (j < allLines.length && allLines[j].trim() === "") j++;
      const start = j;
      while (
        j < allLines.length &&
        allLines[j].trim() !== "" &&
        allLines[j].trim().length < 200 &&
        !allLines[j].trim().startsWith("#")
      ) {
        j++;
      }
      const count = j - start;
      if (count >= 2) {
        for (let k = start; k < j; k++) {
          const trimmed = allLines[k].trim();
          if (
            /^[-*+]/.test(trimmed) ||
            /^\d+\./.test(trimmed) ||
            trimmed.startsWith("|")
          )
            continue;
          if (
            trimmed.startsWith("### ") ||
            trimmed.startsWith("## ")
          )
            continue;
          allLines[k] = `- ${trimmed}`;
          diff.bulletLists++;
        }
      }
      i = j;
    } else {
      i++;
    }
  }
  text = allLines.join("\n");

  // === Transform 6: Callout CTAs ===
  // Handle 💡 and ⚠️ callouts that aren't already blockquotes
  text = text.replace(
    /^([\u{1F4A1}]\s*)(.+)$/gmu,
    (match, emoji: string, rest: string) => {
      if (match.startsWith(">")) return match;
      const periodIdx = rest.indexOf(".");
      if (periodIdx > 0) {
        const lead = rest.slice(0, periodIdx + 1);
        const tail = rest.slice(periodIdx + 1).trim();
        diff.callouts++;
        return `> ${emoji.trim()} **${lead}** ${tail}`;
      }
      diff.callouts++;
      return `> ${emoji.trim()} ${rest}`;
    }
  );
  text = text.replace(
    /^([\u{26A0}\u{FE0F}]+\s*)(.+)$/gmu,
    (match, emoji: string, rest: string) => {
      if (match.startsWith(">")) return match;
      const periodIdx = rest.indexOf(".");
      if (periodIdx > 0) {
        const lead = rest.slice(0, periodIdx + 1);
        const tail = rest.slice(periodIdx + 1).trim();
        diff.callouts++;
        return `> ${emoji.trim()} **${lead}** ${tail}`;
      }
      diff.callouts++;
      return `> ${emoji.trim()} ${rest}`;
    }
  );

  // === Transform 7: Inline link injection (FIRST occurrence only per phrase) ===
  const linkReplacements: [string, string][] = [
    ["Prendre rendez-vous", "[Prendre rendez-vous](/contact)"],
    ["Prenez rendez-vous", "[Prenez rendez-vous](/contact)"],
    ["notre page contact", "[notre page contact](/contact)"],
    ["notre équipe", "[notre équipe](/equipe)"],
  ];
  linkReplacements.sort((a, b) => b[0].length - a[0].length);
  for (const [phrase, replacement] of linkReplacements) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<!\\[)${escaped}(?!\\]|\\()`, "");
    if (regex.test(text)) {
      text = text.replace(regex, replacement);
      diff.inlineLinks++;
    }
  }

  // === Transform 9: Authoritative source enrichment + false citation stripping ===
  const AUTHORITATIVE_SOURCES: Record<string, string> = {
    physioswiss: "https://www.physioswiss.ch",
    hug: "https://www.hug.ch",
    chuv: "https://www.chuv.ch",
    cochrane: "https://www.cochranelibrary.com",
    "ligue suisse contre le rhumatisme": "https://www.rheumaliga.ch",
    rheumaliga: "https://www.rheumaliga.ch",
    insep: "https://www.insep.fr",
    sgsm: "https://www.sgsm.ch",
    ssms: "https://www.sgsm.ch",
    "societe suisse de medecine du sport": "https://www.sgsm.ch",
    swissorthopaedics: "https://www.swissorthopaedics.ch",
    ssot: "https://www.swissorthopaedics.ch",
    "societe suisse de chirurgie orthopedique":
      "https://www.swissorthopaedics.ch",
  };

  // Track which authoritative sources have already been linked (first mention only)
  const linkedSources = new Set<string>();

  const sourcesLines = text.split("\n");
  let inSources = false;
  const filtered: string[] = [];
  for (const line of sourcesLines) {
    if (/^## Sources/.test(line)) inSources = true;
    if (inSources && /^## /.test(line) && !/^## Sources/.test(line))
      inSources = false;

    if (inSources) {
      const trimmed = line.trim();
      if (trimmed === "" || trimmed.startsWith("#")) {
        filtered.push(line);
        continue;
      }
      if (trimmed.includes("[") || /https?:\/\//.test(trimmed)) {
        filtered.push(line);
        continue;
      }
      const normalizedLine = stripAccents(
        trimmed.replace(/^-\s*/, "").toLowerCase()
      );
      let enriched = false;
      for (const [key, url] of Object.entries(AUTHORITATIVE_SOURCES)) {
        const normalizedKey = stripAccents(key.toLowerCase());
        if (normalizedLine.includes(normalizedKey)) {
          if (linkedSources.has(url)) {
            // Already linked this source — strip as duplicate
            console.log(
              `[normalizer] Stripped duplicate source: "${trimmed}"`
            );
            diff.falsecitationsStripped++;
            enriched = true;
            break;
          }
          const anchorText = trimmed.replace(/^-\s*/, "").trim();
          filtered.push(`- [${anchorText}](${url})`);
          linkedSources.add(url);
          console.log(`[normalizer] Enriched source: "${trimmed}" → ${url}`);
          diff.authoritativeSourcesEnriched++;
          enriched = true;
          break;
        }
      }
      if (enriched) continue;

      // Unrecognized bare text source — strip as false citation
      console.log(`[normalizer] Stripped false citation: "${trimmed}"`);
      diff.falsecitationsStripped++;
    } else {
      filtered.push(line);
    }
  }
  text = filtered.join("\n");

  // Clean up excessive blank lines
  text = text.replace(/\n{4,}/g, "\n\n\n");

  return { normalized: text.trim(), diff };
}
