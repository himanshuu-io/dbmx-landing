import { ShieldCheck } from "lucide-react";
import { Button, Eyebrow } from "@/components/ui";

const badges = [
  { label: "SOC 2", sub: "Type II" },
  { label: "GDPR", sub: "EU data residency" },
  { label: "ISO", sub: "27001" },
];

export function Security() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 border-x border-divide bg-neutral-900 px-6 py-14 md:grid-cols-2 md:px-10">
      <div>
        <Eyebrow>Security by default</Eyebrow>
        <h2 className="mt-5 text-2xl font-medium tracking-[-0.025em] text-neutral-50 md:text-3xl">
          Enterprise controls from day one
        </h2>
        <p className="mt-3 max-w-md text-neutral-400">
          Secrets stay encrypted, every tool call is logged, and you choose where your data lives.
        </p>
        <Button href="#" variant="secondary" className="mt-7">
          Read the security overview
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-4 md:justify-end">
        {badges.map((b) => (
          <div
            key={b.label}
            className="flex size-28 flex-col items-center justify-center rounded-full bg-neutral-950 text-center"
          >
            <ShieldCheck className="size-5 text-neutral-400" />
            <span className="mt-1.5 text-sm font-medium text-neutral-50">{b.label}</span>
            <span className="text-[11px] text-neutral-500">{b.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
