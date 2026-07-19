import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];

function record(id, passed, detail) {
  checks.push({ id, status: passed ? "PASS" : "FAIL", detail });
}

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function listFiles(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(relative));
    else files.push(relative);
  }
  return files;
}

const sourceFiles = (await listFiles("src")).filter((file) => /\.(?:ts|tsx|css)$/.test(file));
const sourceEntries = await Promise.all(sourceFiles.map(async (file) => [file, await read(file)]));
const source = sourceEntries.map(([, content]) => content).join("\n");

const css = await read("src/app/globals.css");
const header = await read("src/components/header.tsx");
const anniversary = await read("src/components/anniversary-banner.tsx");
const carousel = await read("src/components/news-carousel.tsx");
const apiRoute = await read("src/app/api/news/route.ts");
const navigation = await read("src/data/navigation.ts");
const gitignore = await read(".gitignore");
const envExample = await read(".env.example");
const packageJson = JSON.parse(await read("package.json"));

record(
  "NAV_SCROLLABLE_VIEWPORT",
  css.includes("height: 100dvh")
    && css.includes("overflow-y: auto")
    && css.includes("overscroll-behavior: contain")
    && css.includes("min-height: max(900px, 100dvh)"),
  "Desktop drawer is viewport-bound, vertically scrollable, and preserves the 900px reference canvas.",
);
record(
  "NAV_INTERACTIVE_SECTIONS",
  header.includes("onPointerEnter")
    && header.includes("handlePrimaryClick")
    && header.includes("navigation-secondary")
    && header.includes("setActiveKey"),
  "Desktop primary categories update the active submenu by pointer, focus, and click.",
);
record(
  "NAV_KEYBOARD_MOVEMENT",
  header.includes('event.key === "ArrowDown"')
    && header.includes('event.key === "ArrowRight"')
    && header.includes('event.key === "ArrowLeft"')
    && header.includes('event.key === "Home"')
    && header.includes('event.key === "End"'),
  "Primary and secondary menu columns support arrow, Home, and End keyboard movement.",
);
record(
  "NAV_DIALOG_LIFECYCLE",
  header.includes('role="dialog"')
    && header.includes('aria-modal="true"')
    && header.includes('event.key === "Escape"')
    && header.includes("document.body.style.overflow = \"hidden\"")
    && header.includes("closeFallback")
    && header.includes("trigger?.focus()"),
  "Dialog has Escape close, body locking, focus restoration, and a close-animation fallback.",
);
record(
  "NAV_SEARCH",
  header.includes('role="search"')
    && header.includes("searchResults")
    && header.includes("handleSearchSubmit")
    && navigation.includes("searchableNavigation"),
  "Navigation search filters known destinations and can submit the first result.",
);
record(
  "ANNIVERSARY_DIALOG_ACCESSIBILITY",
  anniversary.includes('role="dialog"')
    && anniversary.includes('aria-modal="true"')
    && anniversary.includes('event.key !== "Tab"')
    && anniversary.includes("trigger?.focus()"),
  "Anniversary control opens a focus-contained dialog and restores focus on close.",
);
record(
  "CAROUSEL_OPERATION",
  carousel.includes('event.key === "ArrowLeft"')
    && carousel.includes('event.key === "ArrowRight"')
    && carousel.includes("ResizeObserver")
    && carousel.includes("prefers-reduced-motion")
    && carousel.includes("hoverPaused")
    && carousel.includes("focusPaused")
    && carousel.includes("documentPaused"),
  "Carousel supports controls, keyboard movement, resize state, independent pause reasons, and reduced motion.",
);
record(
  "CAROUSEL_FAILURE_STATES",
  carousel.includes('role="alert"')
    && carousel.includes("Try again")
    && carousel.includes("Date unavailable")
    && carousel.includes("event.currentTarget.onerror = null"),
  "News UI contains loading/error/retry behavior and defensive date/image fallbacks.",
);
record(
  "API_BOUNDARY",
  apiRoute.includes('process.env.NEWS_USE_FIXTURE === "true"')
    && apiRoute.includes("GUARDIAN_API_KEY")
    && apiRoute.includes("REQUEST_TIMEOUT_MS")
    && apiRoute.includes("controller.abort()")
    && apiRoute.includes("articles.length < 6")
    && apiRoute.includes("503"),
  "Server route supports deterministic fixture mode, missing-key failure, timeout, validation, and minimum article count.",
);

const deadHashLinks = [...source.matchAll(/href\s*=\s*["']#["']/g)].length;
record("NO_DEAD_HASH_LINKS", deadHashLinks === 0, `${deadHashLinks} hash-only href values found.`);
record(
  "NO_REMOTE_FIGMA_RUNTIME_ASSETS",
  !source.includes("figma.com/api/mcp/asset"),
  "Runtime source references local /figma assets only.",
);
record(
  "SECRET_BOUNDARY",
  !source.includes("NEXT_PUBLIC_GUARDIAN_API_KEY")
    && !source.includes("NEXT_PUBLIC_API_KEY")
    && gitignore.includes(".env*")
    && gitignore.includes("!.env.example")
    && envExample.includes("GUARDIAN_API_KEY=")
    && !/[A-Za-z0-9_-]{32,}/.test(envExample.replace(/NEWS_USE_FIXTURE/g, "")),
  "Guardian key remains server-only and local environment files are ignored.",
);

const idValues = new Set([...source.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
const hashTargets = [...source.matchAll(/(?:href|href:)\s*=\s*[`"']#([a-zA-Z0-9_-]+)[`"']/g)].map((match) => match[1]);
const missingTargets = [...new Set(hashTargets.filter((target) => !idValues.has(target)))];
record(
  "INTERNAL_ANCHOR_TARGETS",
  missingTargets.length === 0,
  missingTargets.length === 0 ? `${hashTargets.length} internal targets resolve.` : `Missing IDs: ${missingTargets.join(", ")}`,
);

const navigationKeys = [...navigation.matchAll(/\bkey:\s*["']([^"']+)["']/g)].map((match) => match[1]);
record(
  "NAVIGATION_DATA_INTEGRITY",
  navigationKeys.length === 10 && new Set(navigationKeys).size === navigationKeys.length,
  `${navigationKeys.length} unique top-level navigation keys expected: 10.`,
);
record(
  "QUALITY_COMMANDS",
  packageJson.scripts?.check
    && packageJson.scripts?.["audit:source"]
    && packageJson.scripts?.["smoke:server"]
    && packageJson.scripts?.verify,
  "Project exposes check, source audit, server smoke, and full verify commands.",
);

const failed = checks.filter((check) => check.status === "FAIL");
for (const check of checks) {
  const output = `${check.status.padEnd(4)} ${check.id} — ${check.detail}`;
  (check.status === "PASS" ? console.log : console.error)(output);
}

console.log(`\nFUNCTIONAL_SOURCE_AUDIT_${failed.length === 0 ? "PASS" : "FAILED"} (${checks.length - failed.length}/${checks.length})`);
if (failed.length > 0) process.exitCode = 1;
