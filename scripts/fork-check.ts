/**
 * Scan tracked files for Example University-specific strings a fork must replace.
 *
 * On upstream (campus-tools/room-tba) this reports many hits — that is expected,
 * this is the Example University app. Run it on YOUR fork after you think you have replaced
 * everything. A clean run means you caught it all; remaining hits are things
 * you forgot.
 *
 * Usage:
 *   bun run fork:check            # report hits, exit 1 if any
 *   bun run fork:check --silent   # exit code only (for your fork's CI)
 *
 * Wire it into your fork's CI after the upstream files are replaced.
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

type Marker = { pattern: RegExp; hint: string };

const markers: Marker[] = [
  { pattern: /\buplb\b/gi, hint: "Example University name — rebrand to your campus." },
  { pattern: /campus-tools/gi, hint: "campus-tools org/domain — your org/domain." },
  {
    pattern: /room-tba\.campus\.tools/gi,
    hint: "Production URL — set to your domain (also astro.config.mjs `site:`).",
  },
  {
    pattern: /discord\.gg\/SrVDgfcrVt/gi,
    hint: "Example University Discord invite — your community link, or delete.",
  },
  {
    pattern: /m\.me\/j\/[A-Za-z0-9_-]+/gi,
    hint: "Example University Messenger group invite — your community link, or delete.",
  },
  {
    pattern: /\bSummit\b/g,
    hint: "the campus summit terrain — your terrain source, or disable 3D.",
  },
  {
    pattern: /\bAMIS\b/g,
    hint: "Example University course system. You do not have the portal — write your own class importer.",
  },
  {
    pattern: /\bRegistrar\b/g,
    hint: "Example University student system reference — repoint to your registrar.",
  },
  {
    pattern: /\bHALL\b/g,
    hint: "Example University building code (Physical Sciences Lecture Hall).",
  },
  { pattern: /\bSciHall\b/g, hint: "Example University building alias (Physical Sciences)." },
  {
    pattern: /\bMain\b|\bMain Hall\b/g,
    hint: "Example University landmark — your campus landmark, or remove copy.",
  },
  {
    pattern: /Los Ba[ñn]os/g,
    hint: "Example University campus locale — your campus location.",
  },
  {
    pattern: /r\/peyups/gi,
    hint: "Example University subreddit source credit — remove or replace.",
  },
  {
    pattern: /121\.24125948460573|14\.16323736946326/g,
    hint: "Example University default map center — set your campus center in src/campus.config.ts.",
  },
];

/**
 * Surfaces campus.config.ts owns. A hit here is a wiring regression even on
 * upstream: the value must come from the config, not a hardcoded literal.
 */
const configOwned: (Marker & { file: RegExp })[] = [
  {
    file: /^src\/constants\/map-terrain\.ts$/,
    pattern: /summit|\b1[24]\d*\.\d{2,}/i,
    hint: "map-terrain.ts must read terrain params from campusTerrain in src/campus.config.ts.",
  },
  {
    file: /^src\/components\/svelte\/navigation\/Sidebar\.svelte$/,
    pattern: /["'`]Jeepney/,
    hint: "The transit menu label must come from campusTransit.label in src/campus.config.ts.",
  },
  {
    file: /^src\/components\/svelte\/controls\/CampusBrowseList\.svelte$/,
    pattern: /["'`]Jeepney|["'`]Search jeepney/,
    hint: "Transit browse labels must derive from campusTransit.label in src/campus.config.ts.",
  },
  {
    file: /^scripts\/e2e-reset-db\.ts$/,
    pattern: /\b1[24]\d*\.\d{3,}/,
    hint: "E2E fixture coordinates must come from campusTestFixtures in src/campus.config.ts.",
  },
];

// Files that mention Example University by design (this scanner, the fork guide that tells
// you to replace Example University strings). Everything else is a real "you forgot this".
const allowList = [
  /scripts\/fork-check\.ts$/,
  /src\/pages\/wiki\/fork-for-your-campus\.astro$/,
  /docs\/fork-data-guide\.md$/,
];

type Hit = { file: string; line: number; text: string; hint: string };

function isBinary(buf: Buffer): boolean {
  return buf.includes(0, 0, Math.min(buf.length, 8000));
}

function scan(): Hit[] {
  const files = execSync("git ls-files", { encoding: "utf8" })
    .trim()
    .split("\n");
  const hits: Hit[] = [];
  for (const file of files) {
    if (allowList.some((re) => re.test(file))) continue;
    let buf: Buffer;
    try {
      buf = readFileSync(file);
    } catch {
      continue;
    }
    if (isBinary(buf)) continue;
    const text = buf.toString("utf8");
    const fileMarkers = [
      ...markers,
      ...configOwned.filter((marker) => marker.file.test(file)),
    ];
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const { pattern, hint } of fileMarkers) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          hits.push({
            file,
            line: i + 1,
            text: line.trim().slice(0, 160),
            hint,
          });
        }
      }
    }
  }
  return hits;
}

const silent = process.argv.includes("--silent");
const hits = scan();

if (hits.length === 0) {
  if (!silent)
    console.log("fork:check passed — no Example University-specific strings found.");
  process.exit(0);
}

if (!silent) {
  const byFile = new Map<string, Hit[]>();
  for (const h of hits) {
    const arr = byFile.get(h.file) ?? [];
    arr.push(h);
    byFile.set(h.file, arr);
  }
  console.error(
    `fork:check found ${hits.length} Example University-specific hit(s) across ${byFile.size} file(s).\n`,
  );
  for (const [file, fileHits] of byFile) {
    console.error(`  ${file}  (${fileHits.length})`);
    for (const h of fileHits.slice(0, 5)) {
      console.error(`    :${h.line}  ${h.hint}`);
    }
    if (fileHits.length > 5) {
      console.error(`    … and ${fileHits.length - 5} more in this file.`);
    }
  }
  console.error(
    "\nReplace or delete these before deploying your fork. See /wiki/fork-for-your-campus.",
  );
}
process.exit(1);
