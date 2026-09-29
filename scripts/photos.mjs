// Builds the web versions of the photo section from the originals.
//   node scripts/photos.mjs            (npm run photos)
//   node scripts/photos.mjs --force    rebuild everything
//   PHOTOS_SRC=/path/to/originals      default ~/Pictures/Portfolio
// For every photo listed in content/photos.ts it writes, under public/photos/<city>/,
// AVIF + JPEG at 2400 and 1200 px long edge (auto-oriented, converted to sRGB,
// every EXIF/GPS/XMP/ICC field dropped), plus content/photos.generated.ts with the
// sizes and a blur placeholder. Re-running after the originals change is enough:
// a file is rebuilt only when its source is newer.
import sharp from "sharp";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { cities } from "../content/photos.ts";

const SRC = process.env.PHOTOS_SRC || path.join(os.homedir(), "Pictures", "Portfolio");
const OUT = path.resolve("public/photos");
const MANIFEST = path.resolve("content/photos.generated.ts");
const FORCE = process.argv.includes("--force");
const SIZES = [2400, 1200];
/** Width / height of the cover crop used by the desktop band. */
const BAND = 2;
// AVIF for every current browser, JPEG for the rest and for the "open the photo" links.
// WebP was measured at the weight of the mozjpeg JPEG (105 KB vs 108 KB on average at
// 1200 px), so it only added 27 MB to the repo: add a line here to bring it back.
const FORMATS = {
  avif: (img) => img.avif({ quality: 55, effort: 3 }),
  jpg: (img) => img.jpeg({ quality: 80, mozjpeg: true, progressive: true }),
};

const codeOf = (stem) => stem.replace(/-\d+$/, "");
async function sourceOf(stem) {
  const dir = path.join(SRC, codeOf(stem));
  const files = await readdir(dir).catch(() => []);
  const hit = files.find((f) => f.startsWith(stem + "_"));
  if (!hit) throw new Error(`No original for ${stem} in ${dir}`);
  return path.join(dir, hit);
}
const newer = async (a, b) => {
  try {
    const [sa, sb] = await Promise.all([stat(a), stat(b)]);
    return sa.mtimeMs > sb.mtimeMs;
  } catch {
    return true;
  }
};

const meta = {};
const wanted = new Set();
let built = 0;
let bytes = 0;
for (const city of cities) {
  const dir = path.join(OUT, city.id);
  await mkdir(dir, { recursive: true });
  for (const stem of [city.cover, ...city.photos]) {
    for (const size of SIZES)
      for (const ext of Object.keys(FORMATS)) {
        wanted.add(path.join(dir, `${stem}-${size}.${ext}`));
        if (stem === city.cover) wanted.add(path.join(dir, `${stem}-band-${size}.${ext}`));
      }
    const src = await sourceOf(stem);
    // Auto-orient, then drop the EXIF (incl. GPS) and convert to sRGB: sharp strips
    // every metadata field unless withMetadata() is asked for, which it never is here.
    const base = sharp(src).rotate();
    const info = await base.clone().resize(SIZES[0], SIZES[0], { fit: "inside", withoutEnlargement: true }).toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info.info;
    for (const size of SIZES) {
      for (const [ext, encode] of Object.entries(FORMATS)) {
        const file = path.join(dir, `${stem}-${size}.${ext}`);
        if (!FORCE && !(await newer(src, file))) continue;
        const out = await encode(base.clone().resize(size, size, { fit: "inside", withoutEnlargement: true })).toFile(file);
        // Belt and braces: fail loudly if any metadata survived.
        const check = await sharp(file).metadata();
        if (check.exif || check.xmp || check.iptc || check.icc) throw new Error(`Metadata left in ${file}`);
        built++;
        bytes += out.size;
      }
    }
    // 16 px and heavily compressed: the placeholders travel with the page.
    const blur = await base.clone().resize(16, 16, { fit: "inside" }).webp({ quality: 30 }).toBuffer();
    meta[stem] = { w, h, blur: `data:image/webp;base64,${blur.toString("base64")}` };
    if (stem === city.cover) {
      // The desktop band is wide (BAND:1) and full-bleed: crop it from the original at the
      // cover focus, so a portrait cover keeps the width the band needs.
      const m = await sharp(src).metadata();
      const swap = (m.orientation || 1) >= 5;
      const W = swap ? m.height : m.width;
      const H = swap ? m.width : m.height;
      const [fx, fy] = (city.coverFocus || "50% 50%").split(" ").map((v) => parseFloat(v) / 100);
      const cw = Math.min(W, Math.round(H * BAND));
      const ch = Math.round(cw / BAND);
      const region = { left: Math.round((W - cw) * fx), top: Math.round((H - ch) * fy), width: cw, height: ch };
      let bw = 0;
      for (const size of SIZES) {
        for (const [ext, encode] of Object.entries(FORMATS)) {
          const file = path.join(dir, `${stem}-band-${size}.${ext}`);
          const img = sharp(src).rotate().extract(region).resize(size, null, { withoutEnlargement: true });
          // Always rebuilt: the crop depends on coverFocus, not only on the original.
          {
            const out = await encode(img).toFile(file);
            const check = await sharp(file).metadata();
            if (check.exif || check.xmp || check.iptc || check.icc) throw new Error(`Metadata left in ${file}`);
            built++;
            bytes += out.size;
          }
          if (size === SIZES[0] && ext === "jpg") bw = (await sharp(file).metadata()).width;
        }
      }
      meta[`${stem}-band`] = { w: bw, h: Math.round(bw / BAND), blur: meta[stem].blur };
    }
    process.stdout.write(`${city.id}/${stem} ${w}×${h}\n`);
  }
}
// Drop the generated files of photos (or formats, or cities) that are no longer selected.
let pruned = 0;
for (const entry of await readdir(OUT, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = path.join(OUT, entry.name);
  for (const f of await readdir(dir)) {
    const file = path.join(dir, f);
    if (/-(band-)?(2400|1200)\.(avif|webp|jpg)$/.test(f) && !wanted.has(file)) {
      await rm(file);
      pruned++;
    }
  }
  if (!(await readdir(dir)).length) await rm(dir, { recursive: true });
}

const body = Object.entries(meta)
  .map(([k, v]) => `  "${k}": { w: ${v.w}, h: ${v.h}, blur: "${v.blur}" },`)
  .join("\n");
await writeFile(
  MANIFEST,
  `// Generated by scripts/photos.mjs from the originals: do not edit by hand.\nimport type { PhotoMeta } from "./types";\n\nexport const photoMeta: Record<string, PhotoMeta> = {\n${body}\n};\n`,
);
console.log(`${built} files written (${(bytes / 1e6).toFixed(1)} MB), ${pruned} pruned, manifest: ${path.relative(process.cwd(), MANIFEST)}`);
