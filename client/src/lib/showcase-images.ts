const SHOWCASE_PREFIX = "/showcase/";
const SHOWCASE_WIDTHS = [640, 1280] as const;

export function getShowcaseOptimizedSrcSet(src: string) {
  if (!src.startsWith(SHOWCASE_PREFIX)) {
    return null;
  }

  const filename = src.slice(SHOWCASE_PREFIX.length);
  const extensionIndex = filename.lastIndexOf(".");

  if (extensionIndex === -1) {
    return null;
  }

  const basename = filename.slice(0, extensionIndex);

  return SHOWCASE_WIDTHS.map(
    (width) => `/showcase/optimized/${basename}-${width}.webp ${width}w`,
  ).join(", ");
}
