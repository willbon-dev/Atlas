import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const navigationPath = fileURLToPath(new URL("../src/data/navigation.yml", import.meta.url));
const iconDir = fileURLToPath(new URL("../public/assets/nav/icons", import.meta.url));
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const source = await readFile(navigationPath, "utf-8");
const parsed = yaml.load(source);

if (!parsed || !Array.isArray(parsed.categories)) {
  throw new Error("navigation.yml must contain a categories array.");
}

await rm(iconDir, { recursive: true, force: true });
await mkdir(iconDir, { recursive: true });

const byHost = new Map();

function slugifyHost(host) {
  return host.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/\.+/g, "-").replace(/^-|-$/g, "");
}

function sanitizeHtml(html) {
  return html.replace(/\r?\n/g, " ");
}

function parseIconCandidates(html, pageUrl) {
  const normalized = sanitizeHtml(html);
  const candidates = [];
  const linkPattern = /<link\b([^>]*?)>/gi;
  let match;

  while ((match = linkPattern.exec(normalized))) {
    const attrs = match[1] ?? "";
    const rel = /rel\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1]?.toLowerCase() ?? "";
    const href = /href\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1];
    if (!href) continue;
    if (!rel.includes("icon")) continue;

    const sizes = /sizes\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] ?? "";
    const type = /type\s*=\s*["']([^"']+)["']/i.exec(attrs)?.[1] ?? "";

    candidates.push({
      href: new URL(href, pageUrl).toString(),
      rel,
      sizes,
      type
    });
  }

  return candidates;
}

function scoreCandidate(candidate) {
  let score = 0;
  if (candidate.rel.includes("apple-touch-icon")) score += 50;
  if (candidate.rel.includes("shortcut")) score += 10;
  if (candidate.type.includes("svg")) score += 30;
  if (candidate.type.includes("png")) score += 20;
  if (candidate.href.endsWith(".svg")) score += 25;
  if (candidate.href.endsWith(".png")) score += 15;
  if (candidate.href.endsWith(".ico")) score += 5;

  const sizeMatch = candidate.sizes.match(/(\d+)x(\d+)/);
  if (sizeMatch) {
    score += Number(sizeMatch[1]);
  }

  return score;
}

function inferExtension(url, contentType) {
  const pathname = new URL(url).pathname.toLowerCase();
  if (contentType?.includes("svg") || pathname.endsWith(".svg")) return ".svg";
  if (contentType?.includes("png") || pathname.endsWith(".png")) return ".png";
  if (contentType?.includes("jpeg") || pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return ".jpg";
  if (contentType?.includes("webp") || pathname.endsWith(".webp")) return ".webp";
  if (contentType?.includes("x-icon") || contentType?.includes("icon") || pathname.endsWith(".ico")) return ".ico";
  return ".img";
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": userAgent, accept: "text/html,application/xhtml+xml" },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.text();
}

async function fetchBinary(url) {
  const response = await fetch(url, {
    headers: { "user-agent": userAgent, accept: "image/*,*/*;q=0.8" },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`Icon request failed with ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const arrayBuffer = await response.arrayBuffer();
  return { buffer: Buffer.from(arrayBuffer), contentType };
}

async function resolveLocalIcon(linkUrl) {
  const url = new URL(linkUrl);
  const cacheKey = url.hostname;
  if (byHost.has(cacheKey)) {
    return byHost.get(cacheKey);
  }

  const candidateUrls = [];

  try {
    const html = await fetchText(linkUrl);
    const discovered = parseIconCandidates(html, linkUrl)
      .sort((a, b) => scoreCandidate(b) - scoreCandidate(a))
      .map((item) => item.href);
    candidateUrls.push(...discovered);
  } catch {
    // Ignore HTML fetch failures and try favicon fallback below.
  }

  candidateUrls.push(new URL("/favicon.ico", url.origin).toString());

  const deduped = [...new Set(candidateUrls)];
  for (const candidateUrl of deduped) {
    try {
      const { buffer, contentType } = await fetchBinary(candidateUrl);
      const ext = inferExtension(candidateUrl, contentType);
      const fileName = `${slugifyHost(url.hostname)}${ext}`;
      const filePath = path.join(iconDir, fileName);
      await writeFile(filePath, buffer);
      const relativePath = `assets/nav/icons/${fileName}`;
      byHost.set(cacheKey, relativePath);
      return relativePath;
    } catch {
      // Try the next candidate.
    }
  }

  byHost.set(cacheKey, undefined);
  return undefined;
}

for (const category of parsed.categories) {
  for (const link of category.links ?? []) {
    try {
      link.icon = await resolveLocalIcon(link.url);
    } catch {
      link.icon = undefined;
    }
  }
}

for (const category of parsed.categories) {
  for (const link of category.links ?? []) {
    if (!link.icon) {
      delete link.icon;
    }
  }
}

const output = yaml.dump(parsed, {
  lineWidth: -1,
  noRefs: true,
  quotingType: '"'
});

await writeFile(navigationPath, output, "utf-8");

const files = await stat(iconDir).then(() => true).catch(() => false);
if (!files) {
  throw new Error("Failed to create icon cache directory.");
}

console.log("Navigation icons cached to public/assets/nav/icons.");
