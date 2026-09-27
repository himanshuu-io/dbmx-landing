import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui";

const badges = [
  { label: "SOC 2", sub: "Type II" },
  { label: "GDPR", sub: "EU data residency" },
  { label: "ISO", sub: "27001" },
];

export function Security() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 border-x border-divide bg-neutral-900/70 px-6 py-12 md:grid-cols-2 md:px-8">
      <div>
        <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-300 uppercase">
          <Lock className="size-3.5" /> Security by default
        </p>
        <h2 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">Enterprise controls from day one</h2>
        <p className="mt-3 max-w-md text-neutral-400">
          Secrets stay encrypted, every tool call is logged, and you choose where your data lives.
        </p>
        <Button href="#" className="mt-6">
          Read the security overview
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-4 md:justify-end">
        {badges.map((b) => (
          <div
            key={b.label}
            className="flex size-28 flex-col items-center justify-center rounded-full border border-white/10 bg-black text-center shadow-[inset_0_0_0_6px_rgb(255_255_255/0.03)]"
          >
            <ShieldCheck className="size-5 text-brand" />
            <span className="mt-1.5 text-sm font-medium">{b.label}</span>
            <span className="text-[10px] text-neutral-500">{b.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
