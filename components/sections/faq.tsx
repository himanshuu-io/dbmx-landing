"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Button, DownloadButton, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is DBMX, in one sentence?",
    a: "A desktop database client with a schema-aware SQL editor, an editable data grid and Stardust, an AI assistant that knows your schema.",
  },
  {
    q: "Which databases does it support?",
    a: "PostgreSQL today, wherever it runs: your laptop, a VM, Amazon RDS, Supabase, Neon and the like. MySQL and MongoDB support is coming soon.",
  },
  {
    q: "Which platforms can I use it on?",
    a: "DBMX is a native desktop app for macOS. Windows and Linux builds are on the way.",
  },
  {
    q: "What does Stardust AI see?",
    a: "Your table definitions (names, columns, types and constraints) and the messages you send. It never sees the rows in your tables, and it never runs queries on its own.",
  },
  {
    q: "Can I use my own AI provider key?",
    a: "Yes. Use the models that come with Stardust, or switch to bring-your-own-key and add a key for Anthropic, OpenAI, Gemini, DeepSeek, Mistral or Groq.",
  },
  {
    q: "Where are my connection details stored?",
    a: "On your machine. Hosts, users and passwords are kept in DBMX's local app data and are never sent to our servers. You can reach private databases over SSH tunnels and SSL.",
  },
  {
    q: "Is it ready for production databases?",
    a: "DBMX is young and under active development. We'd love you to try it, and we'd suggest a read replica or a staging database before you point it at production.",
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
          Can&apos;t find what you need? We&apos;re a message away.
        </p>
        <div className="mt-8 flex gap-3">
          <DownloadButton variant="quiet" />
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
