"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, KeyRound, Plug, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

const DURATION = 6000;

const steps = [
  {
    icon: Plug,
    title: "Connect in seconds",
    body: "Point DBMX at your database, over SSL or through an SSH tunnel. Tag it by environment so prod never looks like dev.",
  },
  {
    icon: Sparkles,
    title: "Write it, or ask for it",
    body: "Type SQL with schema-aware autocomplete, or describe what you need and let Stardust draft the query from your real tables.",
  },
  {
    icon: Download,
    title: "Edit, then take it with you",
    body: "Fix rows straight in the grid, follow foreign keys to related records and export results to CSV or JSON.",
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % steps.length), DURATION);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <div id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 border-x border-divide">
      <SectionHeading
        className="py-16 md:py-20"
        title="From connection string to answer"
        description="Three steps between a question about your data and a result you can act on."
      />

      <div className="grid border-t border-divide lg:grid-cols-2">
        <div className="flex flex-col gap-1 border-divide p-3 md:p-4 lg:border-r">
          {steps.map((s, i) => {
            const isActive = i === active;
            return (
              <button
                key={s.title}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => isActive && setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                className={cn(
                  "relative flex flex-col items-start overflow-hidden rounded-xl px-5 py-6 text-left transition-colors md:px-7",
                  isActive ? "bg-neutral-900" : "hover:bg-neutral-900/50",
                )}
              >
                <span className={cn("flex items-center gap-2 text-base font-medium", isActive ? "text-neutral-50" : "text-neutral-300")}>
                  <s.icon className={cn("size-4", isActive ? "text-coral" : "text-neutral-500")} />
                  {s.title}
                </span>
                <span className="mt-2 max-w-md text-sm text-neutral-400">{s.body}</span>
                {isActive && (
                  <motion.span
                    key={`${active}-${paused}`}
                    className="absolute bottom-0 left-0 h-0.5 bg-coral"
                    initial={{ width: paused ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: paused ? 0 : DURATION / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-dots relative min-h-[360px] overflow-hidden border-t border-divide lg:border-t-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              {active === 0 && <CanvasVisual />}
              {active === 1 && <ToolsVisual />}
              {active === 2 && <ShipVisual />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-[11px] text-neutral-500">{label}</p>
      <p className={cn("mt-1 rounded-lg bg-neutral-950 px-3 py-2 text-xs text-neutral-200", mono && "font-mono")}>{value}</p>
    </div>
  );
}

function CanvasVisual() {
  return (
    <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-4 shadow-[0_24px_60px_-24px_rgb(10_10_10/0.9)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-50">New connection</p>
        <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">PostgreSQL</span>
      </div>
      <div className="mt-4 grid grid-cols-[2fr_1fr] gap-2">
        <Field label="Host" value="db.internal.acme.io" mono />
        <Field label="Port" value="5432" mono />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Field label="SSL mode" value="verify-full" />
        <Field label="Environment" value="production" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-950 px-3 py-2 text-xs text-neutral-300"
      >
        <KeyRound className="size-3.5 text-neutral-500" />
        SSH tunnel via <span className="font-mono text-neutral-200">bastion:22</span>
        <span className="ml-auto flex items-center gap-1.5 text-neutral-50">
          <span className="size-1.5 rounded-full bg-coral" /> Connected
        </span>
      </motion.div>
    </div>
  );
}

function ToolsVisual() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="ml-auto w-fit max-w-[85%] rounded-xl bg-neutral-800 px-3 py-2 text-xs text-neutral-200">
        Top 5 customers by revenue this quarter
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl bg-neutral-900 p-3 shadow-[0_24px_60px_-24px_rgb(10_10_10/0.9)]"
      >
        <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <Sparkles className="size-3 text-coral" /> Stardust
        </p>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-950 p-3 font-mono text-[11px] leading-5 text-neutral-300">
          <span className="text-coral">select</span> c.name, <span className="text-cream">sum</span>(i.total) <span className="text-coral">as</span> revenue{"\n"}
          <span className="text-coral">from</span> invoices i <span className="text-coral">join</span> customers c{"\n"}
          {"  "}<span className="text-coral">on</span> c.id = i.customer_id{"\n"}
          <span className="text-coral">where</span> i.paid_at {">"}= <span className="text-cream">date_trunc</span>(&apos;quarter&apos;, <span className="text-cream">now</span>()){"\n"}
          <span className="text-coral">group by</span> c.name <span className="text-coral">order by</span> revenue <span className="text-coral">desc</span>{"\n"}
          <span className="text-coral">limit</span> 5;
        </pre>
      </motion.div>
    </div>
  );
}

function ShipVisual() {
  const exports = [
    { name: "late_orders.csv", status: "1,284 rows", tone: "text-neutral-400" },
    { name: "orders (filtered).json", status: "Whole table", tone: "text-neutral-400" },
    { name: "orders · id 48227", status: "Saved · 1 cell", tone: "text-neutral-50" },
  ];
  return (
    <div className="w-full max-w-sm space-y-2">
      {exports.map((e, i) => (
        <motion.div
          key={e.name}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 * i }}
          className="flex items-center justify-between rounded-xl bg-neutral-900 px-4 py-3"
        >
          <span className="flex items-center gap-2 font-mono text-xs text-neutral-200">
            <Download className="size-3.5 text-neutral-500" />
            {e.name}
          </span>
          <span className={cn("text-xs", e.tone)}>{e.status}</span>
        </motion.div>
      ))}
    </div>
  );
}
