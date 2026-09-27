"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wordmark, wordmarks } from "@/components/sections/logos";
import { cn } from "@/lib/utils";

const quotes = [
  {
    quote:
      "We replaced a tangle of cron jobs and scripts with four DBMX pipelines. Replays caught two regressions before they ever reached a customer.",
    name: "Priya Raman",
    role: "Staff Engineer, Northwind",
    gradient: "from-brand to-amber-300",
    logo: 0,
  },
  {
    quote:
      "Our support queue is half the size it was in spring. The agents close the easy tickets and hand us the hard ones with the whole trail attached.",
    name: "Marcus Oyelaran",
    role: "Head of Support, lumen",
    gradient: "from-sky-400 to-indigo-400",
    logo: 1,
  },
  {
    quote:
      "Per-step cost tracking was the unlock for us. Finance finally signed off on running agents in production because they could see every cent.",
    name: "Elena Sørensen",
    role: "VP Engineering, Helio Labs",
    gradient: "from-emerald-400 to-teal-300",
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
    <section className="mx-auto max-w-7xl border-x border-divide">
      <p className="py-8 text-center font-mono text-xs tracking-widest text-neutral-300 uppercase">
        What teams are saying
      </p>

      <div className="grid gap-6 border-t border-divide bg-neutral-900/70 p-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:p-8">
        <div className="relative aspect-square max-h-[380px] w-full overflow-hidden rounded-xl bg-neutral-950 md:aspect-auto md:h-full md:min-h-[320px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className={cn("absolute inset-0 bg-gradient-to-br opacity-80", q.gradient)}
            />
          </AnimatePresence>
          <div className="bg-dots absolute inset-0 opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-28 items-center justify-center rounded-full border border-white/30 bg-black/30 text-4xl font-medium tracking-tight backdrop-blur">
              {initials(q.name)}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <Wordmark index={q.logo} className="text-white" />
              <blockquote className="mt-6 text-lg leading-relaxed text-white md:text-xl">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <div className="mt-10">
                <p className="font-medium text-white">{q.name}</p>
                <p className="mt-1 text-sm text-neutral-400">{q.role}</p>
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
                  idx === i ? "w-8 bg-brand" : "w-4 bg-white/20 hover:bg-white/40",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-divide md:grid-cols-6">
        {wordmarks.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              const found = quotes.findIndex((qq) => qq.logo === idx);
              if (found >= 0) setI(found);
            }}
            className={cn(
              "flex h-20 items-center justify-center border-divide transition-colors [&:not(:last-child)]:border-r max-md:[&:nth-child(2n)]:border-r-0 max-md:[&:nth-child(-n+4)]:border-b",
              q.logo === idx ? "bg-neutral-800" : "hover:bg-white/[0.03]",
            )}
          >
            <Wordmark index={idx} className="scale-90 opacity-80" />
          </button>
        ))}
      </div>
    </section>
  );
}
