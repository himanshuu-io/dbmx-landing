import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-white", className)} aria-label="DBMX home">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="2" width="9" height="9" rx="2.5" fill="currentColor" />
        <rect x="13" y="13" width="9" height="9" rx="2.5" fill="currentColor" />
        <rect x="13" y="2" width="9" height="9" rx="4.5" fill="var(--color-brand)" />
      </svg>
      <span className="text-lg font-semibold tracking-tight">DBMX</span>
    </Link>
  );
}

type ButtonProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "brand";
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-medium transition duration-200 active:scale-[0.98]",
        variant === "primary" && "bg-white text-black shadow-[0_1px_0_0_rgb(255_255_255/0.3)_inset] hover:bg-neutral-200",
        variant === "secondary" &&
          "border border-white/10 bg-neutral-900 text-white hover:border-white/20 hover:bg-neutral-800",
        variant === "brand" && "bg-brand text-white hover:brightness-110",
        className,
      )}
      {...props}
    />
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

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-brand", className)}>{children}</p>;
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
      <h2 className="mt-4 text-3xl font-medium tracking-[-0.025em] text-white md:text-4xl">{title}</h2>
      {description && <p className="mt-4 max-w-lg text-base text-neutral-300">{description}</p>}
    </div>
  );
}

/** Small corner squares that mark grid intersections. */
export function CornerMarks() {
  return (
    <>
      <span className="pointer-events-none absolute -top-[3px] -left-[3px] z-10 size-[6px] bg-white" />
      <span className="pointer-events-none absolute -top-[3px] -right-[3px] z-10 size-[6px] bg-white" />
      <span className="pointer-events-none absolute -bottom-[3px] -left-[3px] z-10 size-[6px] bg-white" />
      <span className="pointer-events-none absolute -right-[3px] -bottom-[3px] z-10 size-[6px] bg-white" />
    </>
  );
}

export function IconTile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex size-11 items-center justify-center rounded-xl border border-white/10 bg-neutral-900 shadow-[0_0_0_4px_rgb(255_255_255/0.03)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
