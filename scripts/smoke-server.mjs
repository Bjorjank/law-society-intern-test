import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

const root = process.cwd();
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Unable to allocate a local test port."));
        return;
      }
      const port = address.port;
      server.close((error) => error ? reject(error) : resolve(port));
    });
  });
}

async function stop(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  const exited = new Promise((resolve) => child.once("exit", resolve));
  await Promise.race([exited, delay(2500)]);
  if (child.exitCode === null) child.kill("SIGKILL");
}

async function waitUntilReady(baseUrl, child, logs) {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js exited before readiness.\n${logs.join("")}`);
    }
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      if (response.status >= 200 && response.status < 500) return;
    } catch {
      // Server is still starting.
    }
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${baseUrl}.\n${logs.join("")}`);
}

async function withServer(environment, test) {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const logs = [];
  const child = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: root,
    env: { ...process.env, ...environment },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  child.stdout.on("data", (chunk) => logs.push(String(chunk)));
  child.stderr.on("data", (chunk) => logs.push(String(chunk)));

  try {
    await waitUntilReady(baseUrl, child, logs);
    await test(baseUrl);
  } finally {
    await stop(child);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await withServer(
  { NEWS_USE_FIXTURE: "true", GUARDIAN_API_KEY: "" },
  async (baseUrl) => {
    const page = await fetch(baseUrl);
    const html = await page.text();
    assert(page.status === 200, `Homepage returned ${page.status}.`);
    assert(html.includes("Become an"), "Homepage smoke response is missing hero content.");
    assert(html.includes('id="functions"'), "Homepage smoke response is missing the functions section.");
    assert(html.includes('id="news"'), "Homepage smoke response is missing the news section.");

    const api = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
    const payload = await api.json();
    assert(api.status === 200, `Fixture API returned ${api.status}.`);
    assert(payload.source === "fixture", "Fixture API did not report source=fixture.");
    assert(Array.isArray(payload.articles) && payload.articles.length >= 6, "Fixture API returned fewer than six articles.");
  },
);
console.log("PASS SERVER_FIXTURE_SMOKE");

await withServer(
  { NEWS_USE_FIXTURE: "false", GUARDIAN_API_KEY: "" },
  async (baseUrl) => {
    const api = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
    const payload = await api.json();
    assert(api.status === 503, `Missing-key API returned ${api.status}; expected 503.`);
    assert(typeof payload.message === "string" && payload.message.includes("GUARDIAN_API_KEY"), "Missing-key API response is not actionable.");
  },
);
console.log("PASS SERVER_MISSING_KEY_SMOKE");
console.log("FUNCTIONAL_SERVER_SMOKE_PASS (2/2)");
