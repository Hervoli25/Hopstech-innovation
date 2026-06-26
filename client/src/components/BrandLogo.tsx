import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from "@shared/const";
import { cn } from "@/lib/utils";

type BrandLogoSize = "xs" | "sm" | "md" | "lg" | "xl" | "hero";

type BrandLogoProps = {
  size?: BrandLogoSize;
  showRing?: boolean;
  className?: string;
};

const sizeClasses: Record<BrandLogoSize, string> = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
  hero: "h-24 w-24 md:h-28 md:w-28",
};

export function BrandLogo({
  size = "md",
  showRing = true,
  className,
}: BrandLogoProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={BRAND_LOGO_ALT}
      className={cn(
        sizeClasses[size],
        "rounded-full object-cover",
        showRing &&
          "ring-2 ring-[var(--hopstec-teal)]/50 shadow-lg shadow-[var(--hopstec-teal)]/20",
        className
      )}
    />
  );
}

export default BrandLogo;
