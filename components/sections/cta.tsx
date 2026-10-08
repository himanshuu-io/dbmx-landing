import { InstallCommand, InstallNote } from "@/components/install-command";

const outer = ["SQL", "PG", "SSH", "CSV", "SSL", "JSON"];
const inner = ["AI", "DB", "FK", "⌘P"];

function Orbit({
  items,
  radius,
  className,
  counter,
}: {
  items: string[];
  radius: number;
  className: string;
  counter: string;
}) {
  return (
    <div
      className={`absolute top-1/2 left-1/2 rounded-full border border-neutral-800 ${className}`}
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
    >
      {items.map((label, i) => {
        const angle = (360 / items.length) * i;
        return (
          <span
            key={label}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ transform: `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)` }}
          >
            <span
              className={`flex size-10 items-center justify-center rounded-xl bg-neutral-900 font-mono text-[11px] text-neutral-400 ${counter}`}
            >
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export function Cta() {
  return (
    <div id="download" className="relative mx-auto flex min-h-[420px] scroll-mt-24 max-w-7xl flex-col items-center justify-center overflow-hidden border-x border-divide px-4 py-24 md:min-h-[480px]">
      {/* Signature gradient, kept faint: atmosphere, not a surface. */}
      <div
        aria-hidden
        className="bg-brand-gradient pointer-events-none absolute top-1/2 left-1/2 h-64 w-[36rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(circle,#000_30%,transparent_70%)]">
        <Orbit items={outer} radius={300} className="animate-orbit" counter="animate-orbit-counter" />
        <Orbit items={inner} radius={190} className="animate-orbit-reverse" counter="animate-orbit-counter-reverse" />
      </div>
      <h2 className="relative text-center text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-neutral-50 md:text-6xl">
        <span className="block">Bring your database.</span>
        <span className="block text-cream">Stardust brings the SQL.</span>
      </h2>
      <p className="relative mt-5 max-w-md text-center text-neutral-400">
        Available now for macOS. Windows and Linux are on the way.
      </p>
      <InstallCommand className="relative mt-8" />
      <InstallNote className="relative mt-4" />
    </div>
  );
}
