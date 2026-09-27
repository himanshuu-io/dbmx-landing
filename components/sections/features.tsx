"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Brain, Cable, Code2, FileText, KeyRound, Phone, RefreshCw, Sparkles, Wand2 } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

export function Features() {
  return (
    <div id="features" className="mx-auto max-w-7xl scroll-mt-24 border-x border-divide">
      <SectionHeading
        className="py-16 md:py-20"
        eyebrow="Features"
        title="Everything an agent team needs"
        description="One workspace to pick models, describe pipelines in plain language and connect the tools your agents rely on."
      />

      <div className="grid border-t border-divide md:grid-cols-2">
        <Card
          icon={Brain}
          title="Model routing"
          body="Pin a model per step or let DBMX route by cost and latency. Swap providers without touching the pipeline."
          className="border-b border-divide md:border-r"
        >
          <ModelRouter />
        </Card>
        <Card
          icon={Wand2}
          title="Prompt-to-pipeline"
          body="Describe the job in a sentence and get a working draft on the canvas, ready to edit."
          className="border-b border-divide"
        >
          <PromptBuilder />
        </Card>
      </div>

      <Card
        icon={Cable}
        title="First-class integrations"
        body="Agents reach your systems through managed connectors with audit logs on every call."
        className="border-b border-divide"
      >
        <IntegrationGraph />
      </Card>

      <div className="grid md:grid-cols-3">
        {[
          { icon: KeyRound, title: "Single sign-on", body: "SAML and OIDC out of the box, with role-based access per workspace." },
          { icon: RefreshCw, title: "Live state sync", body: "Every run streams its state so teammates watch the same trace in real time." },
          { icon: Code2, title: "Connector SDK", body: "Wrap any internal API as a typed tool in a few lines of TypeScript." },
        ].map((f, i) => (
          <div
            key={f.title}
            className={cn("p-6 md:p-8", i < 2 && "border-b border-divide md:border-r md:border-b-0")}
          >
            <p className="flex items-center gap-2 font-medium text-white">
              <f.icon className="size-4" />
              {f.title}
            </p>
            <p className="mt-2 text-sm text-neutral-400">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  body,
  className,
  children,
}: {
  icon: typeof Brain;
  title: string;
  body: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden p-6 md:p-8", className)}>
      <p className="flex items-center gap-2 font-medium text-white">
        <Icon className="size-4" />
        {title}
      </p>
      <p className="mt-2 max-w-md text-sm text-neutral-400">{body}</p>
      <div className="mt-8 flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

const models = [
  { name: "Claude Sonnet 5", state: "Routed", tone: "text-emerald-400 bg-emerald-400/10" },
  { name: "Claude Haiku 4.5", state: "Fallback", tone: "text-sky-400 bg-sky-400/10" },
  { name: "Claude Opus 5.5", state: "On demand", tone: "text-amber-400 bg-amber-400/10" },
  { name: "Self-hosted 70B", state: "Offline", tone: "text-neutral-400 bg-white/5" },
];

function ModelRouter() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % 3), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mask-fade-b w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-emerald-400" />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
        <span>Routing policy</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono">cost ≤ $0.02/run</span>
      </div>
      <ul className="mt-3 space-y-2">
        {models.map((m, i) => (
          <motion.li
            key={m.name}
            animate={{
              borderColor: i === active ? "rgb(232 128 108 / 0.5)" : "rgb(255 255 255 / 0.08)",
              backgroundColor: i === active ? "rgb(232 128 108 / 0.06)" : "rgb(0 0 0 / 0.3)",
            }}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm"
          >
            <span className="flex items-center gap-2">
              <Sparkles className={cn("size-3.5", i === active ? "text-brand" : "text-neutral-600")} />
              {m.name}
            </span>
            <span className={cn("rounded-md px-1.5 py-0.5 text-[11px]", m.tone)}>{m.state}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

const prompts = [
  "When a refund request lands in Zendesk, check the order in Postgres and draft a reply.",
  "Every Monday, summarise open PRs older than a week and post them to #eng.",
  "Enrich new signups with company data and route enterprise leads to sales.",
];

function PromptBuilder() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const full = prompts[idx];
    if (text.length < full.length) {
      const t = setTimeout(() => setText(full.slice(0, text.length + 1)), 28);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setText("");
      setIdx((i) => (i + 1) % prompts.length);
    }, 2200);
    return () => clearTimeout(t);
  }, [text, idx]);

  const done = text.length === prompts[idx].length;

  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="bg-dots flex h-32 items-center justify-center gap-3 rounded-2xl border border-white/10 p-4">
        {["Trigger", "Agent", "Action"].map((n, i) => (
          <motion.div
            key={n}
            animate={{ opacity: done ? 1 : 0.25, y: done ? 0 : 6 }}
            transition={{ delay: done ? i * 0.12 : 0 }}
            className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-xs"
          >
            {n}
          </motion.div>
        ))}
      </div>
      <div className="min-h-[88px] rounded-xl border border-white/10 bg-neutral-900 p-3 text-sm text-neutral-200">
        <FileText className="mb-2 size-3.5 text-neutral-500" />
        {text}
        <span className="animate-blink ml-px inline-block h-4 w-px translate-y-0.5 bg-white" />
      </div>
    </div>
  );
}

function IntegrationGraph() {
  const left = [
    { icon: FileText, label: "Standup digest" },
    { icon: Code2, label: "PR reviewer" },
    { icon: Phone, label: "Call summariser" },
  ];
  const right = ["Notion", "Linear", "Slack"];

  return (
    <div className="bg-dots relative w-full overflow-hidden rounded-xl py-10">
      <div className="mx-auto grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-2 sm:gap-10">
        <ul className="space-y-5 justify-self-end">
          {left.map((l, i) => (
            <li key={l.label} className="flex items-center gap-2 text-xs text-neutral-300 sm:text-sm">
              <l.icon className="size-3.5 shrink-0" />
              <span className="truncate">{l.label}</span>
              <Beam delay={i * 0.6} />
            </li>
          ))}
        </ul>

        <div className="flex size-16 items-center justify-center rounded-2xl border border-brand/40 bg-neutral-900 shadow-[0_0_40px_rgb(232_128_108/0.25)]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="2" y="2" width="9" height="9" rx="2.5" fill="white" />
            <rect x="13" y="13" width="9" height="9" rx="2.5" fill="white" />
            <rect x="13" y="2" width="9" height="9" rx="4.5" fill="var(--color-brand)" />
          </svg>
        </div>

        <ul className="space-y-5">
          {right.map((r, i) => (
            <li key={r} className="flex items-center gap-2 text-xs text-neutral-300 sm:text-sm">
              <Beam delay={0.3 + i * 0.6} reverse />
              <span className="flex h-8 items-center rounded-lg border border-white/10 bg-neutral-900 px-2.5">{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Beam({ delay, reverse }: { delay: number; reverse?: boolean }) {
  return (
    <span className="relative hidden h-px w-12 overflow-hidden bg-white/10 sm:block md:w-24">
      <motion.span
        className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-brand to-transparent"
        initial={{ x: reverse ? 100 : -40 }}
        animate={{ x: reverse ? -40 : 100 }}
        transition={{ duration: 1.8, delay, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
      />
    </span>
  );
}
