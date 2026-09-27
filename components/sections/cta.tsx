import { Button } from "@/components/ui";

const outer = ["GH", "PG", "S3", "LN", "SL", "ST"];
const inner = ["AI", "DB", "API", "WH"];

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
      className={`absolute top-1/2 left-1/2 rounded-full border border-white/10 bg-white/[0.015] ${className}`}
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
              className={`flex size-10 items-center justify-center rounded-xl border border-white/10 bg-neutral-900 font-mono text-[11px] text-neutral-300 ${counter}`}
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
    <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col items-center justify-center overflow-hidden border-x border-divide px-4 py-24 md:min-h-[480px]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle,#000_30%,transparent_70%)]">
        <Orbit items={outer} radius={300} className="animate-orbit" counter="animate-orbit-counter" />
        <Orbit items={inner} radius={190} className="animate-orbit-reverse" counter="animate-orbit-counter-reverse" />
      </div>
      <h2 className="relative text-center text-4xl leading-[1.05] font-medium tracking-[-0.03em] md:text-6xl">
        Bring your stack.
        <br />
        Let the agents do the rest.
      </h2>
      <Button href="#pricing" className="relative mt-8">
        Start for free
      </Button>
    </div>
  );
}
