"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Button, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is DBMX, in one sentence?",
    a: "A workspace for designing multi-agent pipelines, testing them against recorded traffic and running them in production with full observability.",
  },
  {
    q: "How long does the first pipeline take?",
    a: "Most teams have a draft running in under an hour. Describe the job in plain language or start from a template, connect the tools, then run a replay.",
  },
  {
    q: "Which tools can agents use?",
    a: "Over 150 managed connectors — GitHub, Slack, Postgres, Gmail, Linear, Stripe and more — plus anything you wrap with the Connector SDK.",
  },
  {
    q: "Where does my data go?",
    a: "Credentials are encrypted at rest with per-workspace keys. Enterprise plans can pin data to a region or deploy DBMX inside your own VPC.",
  },
  {
    q: "Can I test changes before they hit production?",
    a: "Yes. Replays re-run real historical inputs against your new version and diff the results, so you can promote with evidence.",
  },
  {
    q: "Can humans stay in the loop?",
    a: "Add approval checkpoints to any step. The run pauses, notifies the right person and resumes as soon as they sign off.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-7xl scroll-mt-24 border-x border-divide">
      <div className="flex flex-col items-center px-4 pt-12 text-center">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-5 text-3xl font-medium tracking-[-0.03em] text-neutral-50 md:text-4xl">Questions, answered</h2>
        <p className="mt-4 max-w-lg text-neutral-400">
          Can&apos;t find what you need? The docs go deeper, or our team is a message away.
        </p>
        <div className="mt-8 flex gap-3">
          <Button href="#" variant="quiet">
            Browse docs
          </Button>
          <Button href="mailto:hello@dbmx.dev" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>

      <ul className="mt-12 border-t border-divide">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q} className="border-b border-divide last:border-b-0">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-sm transition-colors hover:bg-neutral-900/60 md:px-8 md:text-base",
                    isOpen ? "text-neutral-50" : "text-neutral-300",
                  )}
                >
                  {f.q}
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-300",
                      isOpen ? "rotate-180 text-coral" : "text-neutral-500",
                    )}
                  />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl px-6 pb-6 text-sm text-neutral-400 md:px-8">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
