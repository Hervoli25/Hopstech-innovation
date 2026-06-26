/**
 * PWA Icon & Favicon Generator
 * Creates properly sized PWA icons and favicons from the Hopstec logo
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../client/public');
const sourceCandidates = [
  path.join(publicDir, 'new_logo.jpeg'),
  path.join(publicDir, 'new_logo.jpg'),
  path.join(publicDir, 'logo.png'),
];
const logoPath = path.join(publicDir, 'logo.png');

const iconSizes = [
  { size: 192, name: 'pwa-icon-192.png', description: 'PWA Icon 192x192' },
  { size: 512, name: 'pwa-icon-512.png', description: 'PWA Icon 512x512' },
  { size: 16, name: 'favicon-16x16.png', description: 'Favicon 16x16' },
  { size: 32, name: 'favicon-32x32.png', description: 'Favicon 32x32' },
  { size: 48, name: 'favicon-48x48.png', description: 'Favicon 48x48' },
  { size: 180, name: 'apple-touch-icon.png', description: 'Apple Touch Icon 180x180' },
  { size: 152, name: 'apple-touch-icon-152x152.png', description: 'Apple Touch Icon 152x152' },
  { size: 120, name: 'apple-touch-icon-120x120.png', description: 'Apple Touch Icon 120x120' },
  { size: 76, name: 'apple-touch-icon-76x76.png', description: 'Apple Touch Icon 76x76' },
  { size: 144, name: 'android-chrome-144x144.png', description: 'Android Chrome 144x144' },
  { size: 96, name: 'android-chrome-96x96.png', description: 'Android Chrome 96x96' },
  { size: 72, name: 'android-chrome-72x72.png', description: 'Android Chrome 72x72' },
];

console.log('🎨 Hopstec Icon & Favicon Generator');
console.log('=====================================\n');

const sourcePath = sourceCandidates.find((candidate) => fs.existsSync(candidate));

if (!sourcePath) {
  console.error('❌ Error: no logo source found in client/public/');
  process.exit(1);
}

function createRoundedMask(size) {
  const radius = size / 2;
  return Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="white"/>
    </svg>
  `);
}

async function prepareLogoSource(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  const { width, height, channels } = info;

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Remove the square black background so the logo blends on dark UI.
    if (r < 35 && g < 35 && b < 35) {
      pixels[i + 3] = 0;
    }
  }

  await sharp(pixels, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(outputPath);
}

async function generateIcons() {
  console.log(`📂 Source: ${path.basename(sourcePath)}`);
  console.log('🧹 Removing black background from logo...\n');

  await prepareLogoSource(sourcePath, logoPath);
  console.log(`✅ Prepared ${path.basename(logoPath)} with transparent background\n`);
  console.log(`📁 Output: client/public/\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const { size, name, description } of iconSizes) {
    const targetPath = path.join(publicDir, name);
    const isFavicon = name.startsWith('favicon-') || name === 'favicon.ico';

    try {
      let pipeline = sharp(logoPath).resize(size, size, {
        fit: 'contain',
        background: { r: 15, g: 23, b: 42, alpha: 0 },
      });

      if (isFavicon) {
        pipeline = pipeline.composite([
          {
            input: createRoundedMask(size),
            blend: 'dest-in',
          },
        ]);
      }

      await pipeline
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(targetPath);

      const stats = fs.statSync(targetPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      const roundedIndicator = isFavicon ? '🔵' : '  ';
      console.log(
        `✅ ${roundedIndicator} ${description.padEnd(35)} → ${name.padEnd(30)} (${sizeKB} KB)`
      );
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create ${name}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n🔧 Generating favicon.ico...');
  try {
    const faviconPath = path.join(publicDir, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 15, g: 23, b: 42, alpha: 0 },
      })
      .png()
      .toFile(faviconPath);

    console.log('✅ favicon.ico created (32x32)');
    successCount++;
  } catch (error) {
    console.error('❌ Failed to create favicon.ico:', error.message);
    errorCount++;
  }

  console.log('\n=====================================');
  console.log(`✨ Generation complete!`);
  console.log(`   ✅ Success: ${successCount} files`);
  if (errorCount > 0) {
    console.log(`   ❌ Errors: ${errorCount} files`);
  }
}

generateIcons().catch(console.error);
