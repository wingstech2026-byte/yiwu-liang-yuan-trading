// Creates web-optimised copies of the company's source photos in public/images.
// Source folders are never modified. Gold / gemstone / tantalum photos are intentionally NOT used
// (outside the confirmed product scope) — see README.
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("ALL IMAGES 1");
const OUT = path.resolve("public/images");

const groups = [
  { dir: "Cosmetics brand name (Lalla Bella) perfume samples pictures", prefix: "perfume", exts: [".jpg"] },
  { dir: "Image of Copper Cathode", prefix: "copper-cathode", exts: [".jpg"] },
  // Skips "copper (3)" (yellow powder, not copper concentrate) and "copper (5)" (Google results screenshot
  // with third-party watermarks).
  { dir: "Image of Copper concentrate", prefix: "copper-concentrate", exts: [".jpg"], pick: [1, 2, 4] },
];

await mkdir(OUT, { recursive: true });

for (const g of groups) {
  const files = (await readdir(path.join(SRC, g.dir)))
    .filter((f) => g.exts.includes(path.extname(f).toLowerCase()))
    .sort()
    .filter((_, idx) => !g.pick || g.pick.includes(idx + 1));
  let i = 1;
  for (const f of files) {
    const out = path.join(OUT, `${g.prefix}-${i}.jpg`);
    await sharp(path.join(SRC, g.dir, f))
      .rotate()
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);
    console.log(path.basename(out), "<-", f);
    i++;
  }
}

// Logo emblem: circular crop of the round badge (black card background removed).
const emblemSrc = path.join(SRC, "Company logo", "ff2a21e6e49d100194b80cf7bd1d245.jpg");
const meta = await sharp(emblemSrc).metadata();
const size = Math.min(meta.width, meta.height);
const d = 432;
const left = Math.round((meta.width - d) / 2);
const top = 4;
const mask = Buffer.from(`<svg width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="#fff"/></svg>`);
const emblem = await sharp(emblemSrc)
  .extract({ left, top, width: d, height: d })
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();
await sharp(emblem).resize(256).png({ compressionLevel: 9 }).toFile(path.join(OUT, "logo-emblem.png"));
await sharp(emblem).resize(64).png().toFile(path.resolve("src/app/icon.png"));
console.log("logo-emblem.png written", size);
