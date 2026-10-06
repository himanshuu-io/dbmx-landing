"use client";

import { motion } from "motion/react";
import { BarChart3, Bell, Recycle, Repeat, Rocket, ShieldAlert, Zap } from "lucide-react";
import { BrandAsset, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

const left = [
  { icon: Rocket, title: "Ship in days", body: "Go from sketch to a monitored pipeline without a platform rewrite." },
  { icon: Repeat, title: "Tight feedback loops", body: "Replay yesterday's traffic against today's prompt before you merge." },
  { icon: BarChart3, title: "Spend with intent", body: "Per-step cost tracking shows exactly where tokens go." },
];

const right = [
  { icon: Recycle, title: "Reusable building blocks", body: "Publish a tuned agent once and share it across every team." },
  { icon: ShieldAlert, title: "Fail safely", body: "Budgets, retries and human checkpoints stop runaway runs." },
  { icon: Zap, title: "Less toil", body: "Hand off the repetitive glue work and keep humans on judgement calls." },
];

function Tile({ icon: Icon, title, body, i }: { icon: typeof Rocket; title: string; body: string; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: i * 0.08 }}
      className="rounded-xl bg-neutral-900 p-6"
    >
      <Icon className="size-5 text-neutral-400" />
      <h3 className="mt-5 font-medium text-neutral-50">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{body}</p>
    </motion.div>
  );
}

export function Benefits() {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden border-x border-divide px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="Why DBMX"
        title="Your team, with leverage"
        description="Agents take the busywork. Engineers keep the context, the controls and the credit."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        <div className="grid gap-4 lg:gap-6">
          {left.map((b, i) => (
            <Tile key={b.title} {...b} i={i} />
          ))}
        </div>

        <div className="md:order-last md:col-span-2 lg:order-none lg:col-span-1">
          <CenterVisual />
        </div>

        <div className="grid gap-4 lg:gap-6">
          {right.map((b, i) => (
            <Tile key={b.title} {...b} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CenterVisual() {
  const metrics = [
    { label: "Runs today", value: "18,204", pct: 82, key: false },
    { label: "Pass rate", value: "99.2%", pct: 99, key: true },
    { label: "Human hand-offs", value: "37", pct: 12, key: false },
  ];

  return (
    <div className="relative flex h-full min-h-[420px] flex-col items-center overflow-hidden rounded-xl bg-neutral-900 px-5 pt-10">
      {/* Signature gradient as quiet atmosphere behind the hub. */}
      <div aria-hidden className="bg-brand-gradient pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl" />
      <div className="relative flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-800 text-xs text-neutral-300">PG</span>
        <span className="h-px w-8 bg-neutral-700" />
        <span className="flex size-12 items-center justify-center rounded-xl bg-neutral-800">
          <BrandAsset variant="mark-cream" height={24} />
        </span>
        <span className="h-px w-8 bg-neutral-700" />
        <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-800 text-xs text-neutral-300">GH</span>
      </div>
      <span className="relative h-8 w-px bg-neutral-700" />
      <span className="relative rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">Synced</span>
      <span className="relative h-6 w-px bg-neutral-700" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full flex-1 rounded-t-xl bg-neutral-950 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-neutral-700" />
            <span className="size-2 rounded-full bg-neutral-700" />
            <span className="size-2 rounded-full bg-neutral-700" />
          </div>
          <span className="flex items-center gap-1 rounded-md bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-400">
            <Bell className="size-3" /> 3 alerts muted
          </span>
        </div>
        <p className="mt-4 text-sm font-medium text-neutral-50">Pipeline health</p>
        <div className="mt-3 space-y-3">
          {metrics.map((m, i) => (
            <div key={m.label}>
              <div className="flex justify-between text-xs text-neutral-400">
                <span>{m.label}</span>
                <span className={m.key ? "text-neutral-50" : "text-neutral-300"}>{m.value}</span>
              </div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-neutral-800">
                <motion.div
                  className={cn("h-full rounded-full", m.key ? "bg-coral" : "bg-neutral-500")}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
