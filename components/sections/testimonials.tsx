"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wordmark, wordmarks } from "@/components/sections/logos";
import { Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

const quotes = [
  {
    quote:
      "We replaced a tangle of cron jobs and scripts with four DBMX pipelines. Replays caught two regressions before they ever reached a customer.",
    name: "Priya Raman",
    role: "Staff Engineer, Northwind",
    logo: 0,
  },
  {
    quote:
      "Our support queue is half the size it was in spring. The agents close the easy tickets and hand us the hard ones with the whole trail attached.",
    name: "Marcus Oyelaran",
    role: "Head of Support, lumen",
    logo: 1,
  },
  {
    quote:
      "Per-step cost tracking was the unlock for us. Finance finally signed off on running agents in production because they could see every cent.",
    name: "Elena Sørensen",
    role: "VP Engineering, Helio Labs",
    logo: 3,
  },
];

const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("");

export function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % quotes.length), 7000);
    return () => clearTimeout(t);
  }, [i]);

  const q = quotes[i];

  return (
    <section className="mx-auto max-w-7xl border-x border-divide px-4 py-16 md:px-8 md:py-20">
      <div className="flex justify-center">
        <Eyebrow>What teams are saying</Eyebrow>
      </div>

      {/* The page's one Warm Cream moment: an editorial pull quote. */}
      <div className="mt-10 grid gap-6 rounded-2xl bg-cream p-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10 md:p-6">
        <div className="bg-brand-gradient relative aspect-square max-h-[380px] w-full overflow-hidden rounded-xl md:aspect-auto md:h-full md:min-h-[340px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center text-7xl font-medium tracking-[-0.04em] text-neutral-950/85 md:text-8xl"
            >
              {initials(q.name)}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex flex-col justify-between px-2 py-2 md:px-0 md:py-4 md:pr-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <Wordmark index={q.logo} className="text-neutral-950" />
              <blockquote className="mt-6 text-xl leading-snug font-medium tracking-[-0.02em] text-neutral-950 md:text-2xl">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <div className="mt-10">
                <p className="font-medium text-neutral-950">{q.name}</p>
                <p className="mt-1 text-sm text-neutral-600">{q.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex gap-2" role="tablist" aria-label="Testimonials">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === i}
                aria-label={`Show testimonial ${idx + 1}`}
                onClick={() => setI(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  idx === i ? "w-8 bg-coral" : "w-4 bg-neutral-300 hover:bg-neutral-400",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {wordmarks.map((_, idx) => {
          const selected = q.logo === idx;
          return (
            <button
              key={idx}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                const found = quotes.findIndex((qq) => qq.logo === idx);
                if (found >= 0) setI(found);
              }}
              className="flex h-10 items-center justify-center"
            >
              <Wordmark
                index={idx}
                className={cn(
                  "scale-90 transition-colors",
                  selected ? "text-neutral-50" : "text-neutral-500 hover:text-neutral-300",
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
