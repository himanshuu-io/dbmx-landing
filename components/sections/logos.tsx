import { cn } from "@/lib/utils";

/** Fictional customer wordmarks, drawn in code so no third-party logos ship with the site. */
export const wordmarks = [
  { name: "Northwind", mark: "circle", className: "font-semibold tracking-tight" },
  { name: "lumen", mark: null, className: "font-bold lowercase tracking-tighter text-xl" },
  { name: "QUARRY", mark: null, className: "font-medium tracking-[0.3em] text-sm" },
  { name: "Helio Labs", mark: "sun", className: "font-medium" },
  { name: "parcel", mark: "square", className: "font-semibold lowercase" },
  { name: "Vantage", mark: null, className: "font-serif italic text-xl" },
] as const;

function Mark({ type }: { type: string | null }) {
  if (type === "circle") return <span className="size-4 rounded-full border-[3px] border-current" />;
  if (type === "square") return <span className="size-4 rotate-45 rounded-[3px] bg-current" />;
  if (type === "sun")
    return (
      <svg viewBox="0 0 20 20" className="size-4" fill="currentColor" aria-hidden>
        <circle cx="10" cy="10" r="4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x="9.25" y="0.5" width="1.5" height="3.5" rx="0.75" transform={`rotate(${i * 45} 10 10)`} />
        ))}
      </svg>
    );
  return null;
}

export function Wordmark({ index, className }: { index: number; className?: string }) {
  const w = wordmarks[index % wordmarks.length];
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Mark type={w.mark} />
      <span className={w.className}>{w.name}</span>
    </span>
  );
}

export function Logos() {
  return (
    <div className="mx-auto max-w-7xl border-x border-divide px-6 py-12 md:px-10">
      <p className="text-center font-mono text-xs tracking-[0.14em] text-neutral-500 uppercase">
        Powering agent teams at
      </p>
      <div className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {wordmarks.map((_, i) => (
          <div key={i} className="group flex h-10 items-center justify-center">
            <Wordmark index={i} className="text-neutral-500 transition-colors group-hover:text-neutral-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
