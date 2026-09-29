import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { DepthLayer } from "@/lib/motion";
import { DEFAULT_SIZES, webpSrcSet } from "@/lib/media";

export type Ratio = "16/10" | "4/5" | "1/1" | "21/9" | "3/4" | "fill";

const RATIO: Record<Ratio, string> = {
  "16/10": "aspect-[16/10]",
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "21/9": "aspect-[21/9]",
  "3/4": "aspect-[3/4]",
  fill: "h-full",
};

interface FrameProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** One of the sanctioned ratios. See DESIGN_SYSTEM.md. */
  ratio?: Ratio;
  /** Which depth layer a parallax should drive this frame's media on. */
  depth?: DepthLayer;
  priority?: boolean;
  /** Slot width, for picking a source. Narrow slots should override this. */
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Overlays — captions, scrims, arrows. Rendered above the media. */
  children?: ReactNode;
}

/**
 * The one image treatment on the site.
 *
 * Three layers, each with one job:
 *  - the frame clips and holds the ratio (`revealImage` wipes this open),
 *  - `.media-inner` carries the 10% overscan a parallax travels inside, so the
 *    frame never sees an edge,
 *  - the `img` is what scales back from its over-scale as the frame opens.
 *
 * Keeping scale and translation on separate elements is what stops the reveal
 * and the parallax overwriting each other's transform.
 */
export function Frame({
  src,
  alt,
  width,
  height,
  ratio = "16/10",
  depth,
  priority = false,
  sizes = DEFAULT_SIZES,
  className,
  imgClassName,
  children,
}: FrameProps) {
  const srcSet = webpSrcSet(src);
  const loading = priority
    ? ({ fetchPriority: "high" as const })
    : ({ loading: "lazy" as const });

  return (
    <div data-reveal-image className={cn("media-frame", RATIO[ratio], className)}>
      <div className="media-inner" {...(depth ? { "data-parallax": depth } : {})}>
        <picture className="block size-full">
          {srcSet ? <source type="image/webp" srcSet={srcSet} sizes={sizes} /> : null}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            decoding="async"
            {...loading}
            className={cn("size-full object-cover", imgClassName)}
          />
        </picture>
      </div>
      {children}
    </div>
  );
}

interface ResponsiveImgProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Decorative backdrops pass this through to the img. */
  ariaHidden?: boolean;
  /**
   * Marks the `img` with `data-media` so motion utilities can select it.
   * A bare `data-media` attribute on this component would type-check (JSX skips
   * excess-property checks on hyphenated names) and then be silently dropped.
   */
  dataMedia?: boolean;
}

/**
 * A bare responsive image for backdrops and plates — the parts of the page that
 * are not framed media but still should not ship a full-resolution JPEG to a
 * phone.
 */
export function ResponsiveImg({
  src,
  alt,
  width,
  height,
  className,
  sizes = "100vw",
  priority = false,
  ariaHidden = false,
  dataMedia = false,
}: ResponsiveImgProps) {
  const srcSet = webpSrcSet(src);
  const loading = priority
    ? ({ fetchPriority: "high" as const })
    : ({ loading: "lazy" as const });

  return (
    <picture className="block size-full">
      {srcSet ? <source type="image/webp" srcSet={srcSet} sizes={sizes} /> : null}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        {...(ariaHidden ? { "aria-hidden": true } : {})}
        {...(dataMedia ? { "data-media": "" } : {})}
        {...loading}
        className={cn("size-full object-cover", className)}
      />
    </picture>
  );
}
