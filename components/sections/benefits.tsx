"use client";

import { motion } from "motion/react";
import { BarChart3, Bell, Recycle, Repeat, Rocket, ShieldAlert, Zap } from "lucide-react";
import { SectionHeading } from "@/components/ui";

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
      className="rounded-xl border border-white/5 bg-neutral-900 p-5"
    >
      <Icon className="size-5 text-brand" />
      <h3 className="mt-4 font-medium text-white">{title}</h3>
      <p className="mt-2 text-sm text-neutral-500">{body}</p>
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

      <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="grid gap-4 lg:gap-6">
          {left.map((b, i) => (
            <Tile key={b.title} {...b} i={i} />
          ))}
        </div>

        <CenterVisual />

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
    { label: "Runs today", value: "18,204", pct: 82 },
    { label: "Pass rate", value: "99.2%", pct: 99 },
    { label: "Human hand-offs", value: "37", pct: 12 },
  ];

  return (
    <div className="bg-dots relative flex min-h-[420px] flex-col items-center overflow-hidden rounded-xl border border-white/5 bg-neutral-950 px-5 pt-10">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-neutral-900 text-xs">PG</span>
        <span className="h-px w-8 bg-white/15" />
        <span className="flex size-12 items-center justify-center rounded-xl border border-brand/40 bg-neutral-900">
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <rect x="2" y="2" width="9" height="9" rx="2.5" fill="white" />
            <rect x="13" y="13" width="9" height="9" rx="2.5" fill="white" />
            <rect x="13" y="2" width="9" height="9" rx="4.5" fill="var(--color-brand)" />
          </svg>
        </span>
        <span className="h-px w-8 bg-white/15" />
        <span className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-neutral-900 text-xs">GH</span>
      </div>
      <span className="h-8 w-px bg-white/15" />
      <span className="rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[11px] text-sky-300">Synced</span>
      <span className="h-6 w-px bg-white/15" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full flex-1 rounded-t-xl border border-b-0 border-white/10 bg-neutral-900 p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-red-400" />
            <span className="size-2 rounded-full bg-amber-400" />
            <span className="size-2 rounded-full bg-emerald-400" />
          </div>
          <span className="flex items-center gap-1 rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] text-neutral-400">
            <Bell className="size-3" /> 3 alerts muted
          </span>
        </div>
        <p className="mt-4 text-sm font-medium">Pipeline health</p>
        <div className="mt-3 space-y-3">
          {metrics.map((m, i) => (
            <div key={m.label}>
              <div className="flex justify-between text-xs text-neutral-400">
                <span>{m.label}</span>
                <span className="text-white">{m.value}</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-brand"
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
