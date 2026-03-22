import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const showcaseDir = path.resolve(__dirname, "../client/public/showcase");
const outputDir = path.join(showcaseDir, "optimized");
const widths = [640, 1280];

async function generateShowcaseImages() {
  await fs.mkdir(outputDir, { recursive: true });

  const entries = await fs.readdir(showcaseDir, { withFileTypes: true });
  const sourceImages = entries.filter(
    (entry) => entry.isFile() && /\.(png|jpe?g)$/i.test(entry.name),
  );

  let generatedCount = 0;

  for (const entry of sourceImages) {
    const sourcePath = path.join(showcaseDir, entry.name);
    const baseName = path.parse(entry.name).name;

    for (const width of widths) {
      const outputPath = path.join(outputDir, `${baseName}-${width}.webp`);

      await sharp(sourcePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outputPath);

      generatedCount += 1;
    }
  }

  console.log(
    `Generated ${generatedCount} optimized showcase images from ${sourceImages.length} source files.`,
  );
}

generateShowcaseImages().catch((error) => {
  console.error("Failed to generate showcase images:", error);
  process.exit(1);
});
