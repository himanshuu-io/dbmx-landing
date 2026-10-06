"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GitBranch, MousePointerClick, Plug, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

const DURATION = 6000;

const steps = [
  {
    icon: MousePointerClick,
    title: "Sketch the pipeline",
    body: "Drop agents onto the canvas, draw the hand-offs between them and set guardrails per step.",
  },
  {
    icon: Plug,
    title: "Plug in your stack",
    body: "Give each agent the tools it needs — repos, inboxes, databases — with scoped credentials.",
  },
  {
    icon: Rocket,
    title: "Replay, then ship",
    body: "Rehearse runs against recorded traffic, compare outcomes, and promote to production in one click.",
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
        eyebrow="How it works"
        title="From whiteboard to production"
        description="Three steps between an idea for an agent and a pipeline your team can trust."
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

function Node({ title, subtitle, className }: { title: string; subtitle: string; className?: string }) {
  return (
    <div className={cn("w-40 rounded-xl bg-neutral-900 p-3 shadow-[0_16px_40px_-16px_rgb(10_10_10/0.9)]", className)}>
      <p className="text-xs text-neutral-500">{subtitle}</p>
      <p className="mt-1 text-sm font-medium text-neutral-50">{title}</p>
    </div>
  );
}

function CanvasVisual() {
  return (
    <div className="relative h-72 w-full max-w-md">
      <svg className="absolute inset-0 size-full" viewBox="0 0 400 288" fill="none" preserveAspectRatio="none">
        <path d="M100 60 C 200 60, 200 144, 300 144" stroke="var(--color-neutral-700)" strokeDasharray="4 4" />
        <path d="M100 228 C 200 228, 200 144, 300 144" stroke="var(--color-neutral-700)" strokeDasharray="4 4" />
        <motion.circle
          r="3"
          fill="var(--color-coral)"
          animate={{ offsetDistance: ["0%", "100%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ offsetPath: "path('M100 60 C 200 60, 200 144, 300 144')" }}
        />
      </svg>
      <Node className="absolute top-2 left-0" subtitle="Trigger" title="New support ticket" />
      <Node className="absolute bottom-2 left-0" subtitle="Agent · Haiku 4.5" title="Classify intent" />
      <Node className="absolute top-1/2 right-0 -translate-y-1/2 bg-neutral-800" subtitle="Agent · Sonnet 5" title="Draft reply" />
    </div>
  );
}

function ToolsVisual() {
  const tools = ["GitHub", "Postgres", "Gmail", "Linear", "S3", "Stripe"];
  return (
    <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-4 shadow-[0_24px_60px_-24px_rgb(10_10_10/0.9)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-50">Tool access · draft-reply</p>
        <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-300">Scoped</span>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {tools.map((t, i) => (
          <motion.li
            key={t}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center justify-between rounded-lg bg-neutral-950 px-3 py-2 text-xs text-neutral-300"
          >
            {t}
            <span className={cn("size-1.5 rounded-full", i < 4 ? "bg-neutral-50" : "bg-neutral-700")} />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function ShipVisual() {
  const envs = [
    { name: "replay/ticket-set-42", status: "Passed 118/120", tone: "text-neutral-400" },
    { name: "staging", status: "Healthy", tone: "text-neutral-400" },
    { name: "production", status: "Promoting…", tone: "text-neutral-50" },
  ];
  return (
    <div className="w-full max-w-sm space-y-2">
      {envs.map((e, i) => (
        <motion.div
          key={e.name}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 * i }}
          className="flex items-center justify-between rounded-xl bg-neutral-900 px-4 py-3"
        >
          <span className="flex items-center gap-2 font-mono text-xs text-neutral-200">
            <GitBranch className="size-3.5 text-neutral-500" />
            {e.name}
          </span>
          <span className={cn("text-xs", e.tone)}>{e.status}</span>
        </motion.div>
      ))}
    </div>
  );
}
