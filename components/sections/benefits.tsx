"use client";

import { motion } from "motion/react";
import { Feather, KeyRound, Keyboard, Layers, PanelsLeftBottom, ShieldCheck } from "lucide-react";
import { BrandAsset, SectionHeading } from "@/components/ui";

const left = [
  { icon: Feather, title: "Native and light", body: "A Go app on your system's own web view. No bundled browser, no waiting for it to wake up." },
  { icon: Layers, title: "Tabs that remember", body: "Queries, filters, history and your AI chat all survive a restart." },
  { icon: PanelsLeftBottom, title: "All connections in one place", body: "Every server and database in one sidebar. No more juggling a window per connection." },
];

const right = [
  { icon: ShieldCheck, title: "Your connections stay local", body: "Hosts, users and passwords live on your machine and are never sent to our servers." },
  { icon: KeyRound, title: "Your keys or ours", body: "Use Stardust's built-in models, or bring your own provider key." },
  { icon: Keyboard, title: "Keyboard first", body: "Run, explain, format and save without leaving the keys. ⌘P finds everything else." },
];

function Tile({ icon: Icon, title, body, i }: { icon: typeof Feather; title: string; body: string; i: number }) {
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
        title="Made to stay out of your way"
        description="Quick to open, quiet to use and careful with your data."
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

const shortcuts = [
  { keys: ["⌥", "↵"], label: "Run query" },
  { keys: ["⌘", "E"], label: "Explain" },
  { keys: ["⌘", "⇧", "F"], label: "Format" },
  { keys: ["⌘", "S"], label: "Save query or edits" },
  { keys: ["⌘", "H"], label: "History" },
  { keys: ["⌘", "P"], label: "Command palette" },
];

function CenterVisual() {
  return (
    <div className="relative flex h-full min-h-[420px] flex-col items-center overflow-hidden rounded-xl bg-neutral-900 px-5 pt-10">
      {/* Signature gradient as quiet atmosphere behind the mark. */}
      <div aria-hidden className="bg-brand-gradient pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl" />
      <span className="relative flex size-12 items-center justify-center rounded-xl bg-neutral-800">
        <BrandAsset variant="mark-cream" height={24} />
      </span>
      <span className="relative h-8 w-px bg-neutral-700" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full flex-1 rounded-t-xl bg-neutral-950 p-4"
      >
        <p className="text-sm font-medium text-neutral-50">Shortcuts</p>
        <ul className="mt-3 space-y-2.5">
          {shortcuts.map((s, i) => (
            <motion.li
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.07 }}
              className="flex items-center justify-between text-xs text-neutral-400"
            >
              {s.label}
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd key={k} className="min-w-5 rounded bg-neutral-800 px-1.5 py-0.5 text-center font-mono text-[11px] text-neutral-200">
                    {k}
                  </kbd>
                ))}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
