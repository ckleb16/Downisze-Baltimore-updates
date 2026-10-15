import type { ImgHTMLAttributes } from "react";
import {
  responsiveImageAttributes,
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
  return (
    <img
      {...props}
      {...responsiveImageAttributes(src, sizes)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding={decoding}
    />
  );
}
