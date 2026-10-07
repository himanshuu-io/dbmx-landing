import { cn } from "@/lib/utils";

/** Database engines, set as plain type so no third-party logos ship with the site. */
const engines = [
  { name: "PostgreSQL", status: "Available now", live: true },
  { name: "MySQL", status: "Coming soon", live: false },
  { name: "MongoDB", status: "Coming soon", live: false },
];

export function Logos() {
  return (
    <div className="mx-auto max-w-7xl border-x border-divide px-6 py-12 md:px-10">
      <p className="text-center font-mono text-xs tracking-[0.14em] text-neutral-500 uppercase">
        One client for the databases you run
      </p>
      <ul className="mx-auto mt-8 grid max-w-3xl gap-y-8 sm:grid-cols-3">
        {engines.map((e) => (
          <li key={e.name} className="flex flex-col items-center gap-2">
            <span className={cn("text-xl font-medium tracking-tight", e.live ? "text-neutral-50" : "text-neutral-500")}>
              {e.name}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className={cn("size-1.5 rounded-full", e.live ? "bg-coral" : "bg-neutral-600")} />
              {e.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
