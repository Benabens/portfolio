import type { CSSProperties } from "react";
import { photoMeta } from "@/content";

type Props = {
  /** Folder under /photos/. */
  city: string;
  /** Source stem, e.g. "TLV-04". */
  stem: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Also offer the wide cover crop ("<stem>-band") from 700px up. */
  band?: boolean;
  style?: CSSProperties;
};

const FORMATS = [
  ["avif", "image/avif"],
  ["jpg", undefined],
] as const;

/** `srcset` of the two generated widths (one entry when the original is small). */
const srcSet = (base: string, ext: string, small: number, large: number) =>
  small === large ? `${base}-2400.${ext} ${large}w` : `${base}-1200.${ext} ${small}w, ${base}-2400.${ext} ${large}w`;

/**
 * A photo from the pipeline (scripts/photos.mjs): AVIF, then JPEG,
 * lazy, with reserved dimensions and the blurred placeholder behind it.
 */
export default function Pic({ city, stem, alt, sizes, className, band, style }: Props) {
  const meta = photoMeta[stem];
  if (!meta) return null;
  const base = `/photos/${city}/${stem}`;
  const long = Math.max(meta.w, meta.h);
  const small = long > 1200 ? Math.round((meta.w * 1200) / long) : meta.w;
  const wide = band ? photoMeta[`${stem}-band`] : undefined;

  return (
    <picture>
      {wide &&
        FORMATS.map(([ext, type]) => (
          <source
            key={`band-${ext}`}
            media="(min-width: 700px)"
            type={type}
            srcSet={srcSet(`${base}-band`, ext, Math.min(1200, wide.w), wide.w)}
            sizes={sizes}
          />
        ))}
      <source type="image/avif" srcSet={srcSet(base, "avif", small, meta.w)} sizes={sizes} />
      <img
        className={className}
        src={`${base}-1200.jpg`}
        srcSet={srcSet(base, "jpg", small, meta.w)}
        sizes={sizes}
        alt={alt}
        width={meta.w}
        height={meta.h}
        loading="lazy"
        decoding="async"
        style={{ backgroundImage: `url(${meta.blur})`, backgroundSize: "cover", backgroundPosition: "center", ...style }}
      />
    </picture>
  );
}
