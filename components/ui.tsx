import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Brand assets exported from Figma. Each SVG carries transparent padding around the artwork
 * (room for its glow), so sizes below are for the visible artwork and the padding is
 * cancelled with a negative margin.
 */
const brandAssets = {
  "lockup-coral": { src: "/brand/lockup-coral.svg", w: 769.93, h: 220, pad: 30 },
  "lockup-cream": { src: "/brand/lockup-cream.svg", w: 769.93, h: 220, pad: 30 },
  "wordmark-coral": { src: "/brand/wordmark-coral.svg", w: 504.186, h: 160, pad: 30 },
  "wordmark-cream": { src: "/brand/wordmark-cream.svg", w: 504.186, h: 160, pad: 30 },
  "mark-coral": { src: "/brand/mark-coral.svg", w: 174.477, h: 174.478, pad: 7.24 },
  "mark-cream": { src: "/brand/mark-cream.svg", w: 174.477, h: 174.478, pad: 7.24 },
} as const;

export type BrandVariant = keyof typeof brandAssets;

/** Renders a brand asset so that its visible artwork is `height` px tall. */
export function BrandAsset({
  variant,
  height,
  className,
  style,
  priority,
}: {
  variant: BrandVariant;
  height: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  const a = brandAssets[variant];
  const scale = height / (a.h - a.pad * 2);
  const h = a.h * scale;
  const w = a.w * scale;
  const m = -a.pad * scale;
  return (
    <Image
      src={a.src}
      alt=""
      aria-hidden
      width={a.w}
      height={a.h}
      priority={priority}
      className={cn("pointer-events-none max-w-none shrink-0 select-none", className)}
      style={{ width: w, height: h, margin: m, ...style }}
    />
  );
}

/**
 * The wordmark is drawn as horizontal scanlines. Sizes are chosen so each scanline lands on
 * whole pixels (wordmark: 18.5px tall = 1px line pitch; lockup: 26.2px tall = 1px pitch for
 * its letters). Arbitrary sizes make the lines fall between pixels and the logo looks soft.
 */
export const LOGO_CRISP = { wordmark: 18.5, lockup: 26.2 } as const;

export function Logo({
  className,
  variant = "wordmark-cream",
  height = variant.startsWith("lockup") ? LOGO_CRISP.lockup : LOGO_CRISP.wordmark,
}: {
  className?: string;
  variant?: "wordmark-cream" | "wordmark-coral" | "lockup-coral" | "lockup-cream";
  height?: number;
}) {
  // Whole-pixel box with the artwork pinned to its top edge, so the scanlines start on a pixel
  // boundary instead of wherever flex centering would put them.
  return (
    <Link
      href="/"
      className={cn("flex items-start", className)}
      // Even height so centering it in the nav also lands on a whole pixel.
      style={{ height: Math.ceil(height / 2) * 2 }}
      aria-label="DBMX home"
    >
      <BrandAsset variant={variant} height={height} priority />
    </Link>
  );
}

type ButtonVariant = "primary" | "secondary" | "quiet";

type ButtonProps = ComponentProps<"a"> & {
  variant?: ButtonVariant;
};

function buttonClass(variant: ButtonVariant, className?: string) {
  return cn(
    "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium transition duration-200 active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral",
    // Primary: the one coral action in view.
    variant === "primary" && "bg-coral text-neutral-50 hover:bg-coral/85",
    // Secondary: outlined neutral, per the CTA rules.
    variant === "secondary" && "border border-neutral-700 text-neutral-50 hover:bg-neutral-800",
    // Quiet: a filled neutral control for places where an outline would add noise.
    variant === "quiet" && "bg-neutral-800 text-neutral-50 hover:bg-neutral-700",
    className,
  );
}

// A plain <a>, not next/link: every button here is an in-page anchor or a mailto link, and
// next/link ignores a click on the URL you are already on (a second "#features" did nothing).
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <a className={buttonClass(variant, className)} {...props} />;
}

/** Jumps to the install command in the #download section (the app is installed from Terminal). */
export function DownloadButton({
  variant = "primary",
  className,
  ...props
}: Omit<ComponentProps<"a">, "href" | "children"> & { variant?: ButtonVariant }) {
  return (
    <a href="#download" className={buttonClass(variant, cn("gap-2", className))} {...props}>
      <Download className="size-4" />
      Install for macOS
    </a>
  );
}

/** Horizontal full-bleed rule placed between every section. */
export function Rule() {
  return <div className="h-px w-full bg-divide" />;
}

/** Bordered 7xl column that every section sits inside. */
export function Shell({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <div id={id} className={cn("relative mx-auto max-w-7xl scroll-mt-24 border-x border-divide", className)}>
      {children}
    </div>
  );
}

/** Section marker: quiet mono label with a small coral tick. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-neutral-400 uppercase",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-[1px] bg-coral" />
      <span className="text-balance">{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-4 text-center", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-medium tracking-[-0.03em] text-neutral-50 md:text-4xl">{title}</h2>
      {description && <p className="mt-4 max-w-lg text-base text-neutral-400">{description}</p>}
    </div>
  );
}

/** Small corner squares that mark grid intersections. */
export function CornerMarks() {
  return (
    <>
      <span className="pointer-events-none absolute -top-[3px] -left-[3px] z-10 size-[5px] bg-neutral-600" />
      <span className="pointer-events-none absolute -top-[3px] -right-[3px] z-10 size-[5px] bg-neutral-600" />
      <span className="pointer-events-none absolute -bottom-[3px] -left-[3px] z-10 size-[5px] bg-neutral-600" />
      <span className="pointer-events-none absolute -right-[3px] -bottom-[3px] z-10 size-[5px] bg-neutral-600" />
    </>
  );
}
