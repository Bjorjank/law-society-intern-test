import { stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const requiredAssets = [
  "law-society-logo.png",
  "hero-city.jpg",
  "lady-justice.png",
  "hero-maroon-shape.svg",
  "torn-top.png",
  "torn-bottom.png",
  "torn-section.png",
  "paper-texture.png",
  "paper-texture-2.png",
  "function-closure.jpg",
  "function-pro-bono.jpg",
  "function-library.jpg",
  "function-directory.jpg",
  "anniversary-group.jpg",
  "road-to-2027.jpg",
  "press-1.jpg",
  "press-2.jpg",
  "press-3.jpg",
  "career-background.jpg",
  "career-person.png",
  "career-phone.png",
  "nav-scales.png",
];

const assetDirectory = path.join(process.cwd(), "public", "figma");
const missing = [];

for (const fileName of requiredAssets) {
  try {
    const metadata = await stat(path.join(assetDirectory, fileName));
    if (!metadata.isFile() || metadata.size < 100) missing.push(fileName);
  } catch {
    missing.push(fileName);
  }
}

if (missing.length > 0) {
  console.error("FIGMA_ASSETS_VERIFY_FAILED");
  for (const fileName of missing) console.error(` - ${fileName}`);
  process.exitCode = 1;
} else {
  console.log(`FIGMA_ASSETS_VERIFY_PASS (${requiredAssets.length} files)`);
}
