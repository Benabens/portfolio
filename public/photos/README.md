# Photos

Everything here is generated: do not edit by hand.

```bash
npm run photos            # only what changed
npm run photos -- --force # everything
PHOTOS_SRC=/path/to/originals npm run photos   # default: ~/Pictures/Portfolio
```

`scripts/photos.mjs` reads the selection in `content/photos.ts` (one entry per city:
cover, photos, alt texts) and, for every photo, finds the original
`<PHOTOS_SRC>/<CODE>/<CODE>-NN_*.jpg` and writes here, under `<city>/`:

- `<CODE>-NN-2400.avif|jpg` and `<CODE>-NN-1200.avif|jpg` (long edge), quality 55 / 80;
- for a cover, `<CODE>-NN-band-2400|1200.avif|jpg`, the 2:1 crop used by the desktop band,
  taken at the city's `coverFocus`;
- sizes and a blur placeholder in `content/photos.generated.ts`.

Every file is auto-oriented, converted to sRGB and stripped of all metadata (EXIF, GPS,
XMP, ICC); the script fails if anything is left. Files of photos that are no longer
selected are removed. After the originals are graded, running the script again is enough.
