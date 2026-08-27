import type { ImgHTMLAttributes } from "react";
import {
  RESPONSIVE_MEDIA,
  responsiveVariant,
  type ResponsiveMediaSource,
} from "@/lib/responsiveMedia";

type ResponsiveImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet" | "sizes" | "width" | "height" | "loading"
> & {
  src: ResponsiveMediaSource;
  sizes: string;
  priority?: boolean;
};

export default function ResponsiveImage({
  src,
  sizes,
  priority = false,
  decoding = "async",
  ...props
}: ResponsiveImageProps) {
  const metadata = RESPONSIVE_MEDIA[src];
  const largestWidth = metadata.variants[metadata.variants.length - 1];

  return (
    <img
      {...props}
      src={responsiveVariant(src, largestWidth)}
      srcSet={metadata.variants
        .map((width) => `${responsiveVariant(src, width)} ${width}w`)
        .join(", ")}
      sizes={sizes}
      width={metadata.width}
      height={metadata.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding={decoding}
    />
  );
}
