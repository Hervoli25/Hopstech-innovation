import type { ImgHTMLAttributes } from "react";
import { getShowcaseOptimizedSrcSet } from "../lib/showcase-images";

type ResponsiveShowcaseImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  sizes?: string;
};

const ResponsiveShowcaseImage = ({
  src,
  alt,
  sizes = "100vw",
  decoding = "async",
  ...props
}: ResponsiveShowcaseImageProps) => {
  if (typeof src !== "string" || src.length === 0) {
    return null;
  }

  const optimizedSrcSet = getShowcaseOptimizedSrcSet(src);

  if (!optimizedSrcSet) {
    return <img src={src} alt={alt} decoding={decoding} {...props} />;
  }

  return (
    <picture>
      <source type="image/webp" srcSet={optimizedSrcSet} sizes={sizes} />
      <img src={src} alt={alt} decoding={decoding} {...props} />
    </picture>
  );
};

export default ResponsiveShowcaseImage;
