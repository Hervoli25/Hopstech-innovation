/**
 * PWA Icon & Favicon Generator
 * Creates properly sized PWA icons and favicons from the HOPSTECH logo
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../client/public');
const logoPath = path.join(publicDir, 'logo.png');

// Icon sizes for PWA and various devices
const iconSizes = [
  // PWA Icons
  { size: 192, name: 'pwa-icon-192.png', description: 'PWA Icon 192x192' },
  { size: 512, name: 'pwa-icon-512.png', description: 'PWA Icon 512x512' },

  // Favicons
  { size: 16, name: 'favicon-16x16.png', description: 'Favicon 16x16' },
  { size: 32, name: 'favicon-32x32.png', description: 'Favicon 32x32' },
  { size: 48, name: 'favicon-48x48.png', description: 'Favicon 48x48' },

  // Apple Touch Icons
  { size: 180, name: 'apple-touch-icon.png', description: 'Apple Touch Icon 180x180' },
  { size: 152, name: 'apple-touch-icon-152x152.png', description: 'Apple Touch Icon 152x152' },
  { size: 120, name: 'apple-touch-icon-120x120.png', description: 'Apple Touch Icon 120x120' },
  { size: 76, name: 'apple-touch-icon-76x76.png', description: 'Apple Touch Icon 76x76' },

  // Android Chrome Icons
  { size: 144, name: 'android-chrome-144x144.png', description: 'Android Chrome 144x144' },
  { size: 96, name: 'android-chrome-96x96.png', description: 'Android Chrome 96x96' },
  { size: 72, name: 'android-chrome-72x72.png', description: 'Android Chrome 72x72' },
];

console.log('🎨 HOPSTECH Icon & Favicon Generator');
console.log('=====================================\n');

// Check if logo exists
if (!fs.existsSync(logoPath)) {
  console.error('❌ Error: logo.png not found in client/public/');
  process.exit(1);
}

console.log(`📂 Source: ${path.basename(logoPath)}`);
console.log(`📁 Output: client/public/\n`);

// Create rounded mask SVG
function createRoundedMask(size) {
  const radius = size / 2;
  return Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="white"/>
    </svg>
  `);
}

// Generate all icon sizes
async function generateIcons() {
  let successCount = 0;
  let errorCount = 0;

  for (const { size, name, description } of iconSizes) {
    const targetPath = path.join(publicDir, name);
    const isFavicon = name.startsWith('favicon-') || name === 'favicon.ico';

    try {
      let pipeline = sharp(logoPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        });

      // Apply rounded mask to favicons for circular appearance
      if (isFavicon) {
        const mask = createRoundedMask(size);
        pipeline = pipeline.composite([{
          input: mask,
          blend: 'dest-in'
        }]);
      }

      await pipeline
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(targetPath);

      const stats = fs.statSync(targetPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      const roundedIndicator = isFavicon ? '🔵' : '  ';
      console.log(`✅ ${roundedIndicator} ${description.padEnd(35)} → ${name.padEnd(30)} (${sizeKB} KB)`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create ${name}:`, error.message);
      errorCount++;
    }
  }

  // Generate favicon.ico (multi-size ICO file)
  console.log('\n🔧 Generating favicon.ico...');
  try {
    // Create a 32x32 PNG first, then convert to ICO
    const faviconPath = path.join(publicDir, 'favicon.ico');
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
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
  console.log('\n💡 Next steps:');
  console.log('   1. Restart your dev server to see the new icons');
  console.log('   2. Clear browser cache and reload');
  console.log('   3. Reinstall PWA to see updated app icon');
}

generateIcons().catch(console.error);

