import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceLogo = path.resolve('public/assets/aistudio/logo_escuela_png_e439e66e.png');
const publicDir = path.resolve('public');

async function generate() {
  console.log('Generating PWA icons from:', sourceLogo);
  
  // 192x192
  await sharp(sourceLogo)
    .resize(192, 192, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512
  await sharp(sourceLogo)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 512x512 maskable (with 15% inner padding for Android adaptive icon safe zone)
  const innerSize = Math.round(512 * 0.78);
  const innerBuffer = await sharp(sourceLogo)
    .resize(innerSize, innerSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // apple-touch-icon (180x180)
  await sharp(sourceLogo)
    .resize(180, 180, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // favicon.png (64x64)
  await sharp(sourceLogo)
    .resize(64, 64, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All PWA icons generated successfully.');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
