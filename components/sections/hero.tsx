"use client";

import { Fragment, useRef } from "react";
import { MotionConfig, motion } from "motion/react";
import { Star } from "lucide-react";
import { Button, CornerMarks, Eyebrow } from "@/components/ui";
import { DashboardMock } from "@/components/sections/dashboard-mock";
import { BlackHole } from "@/components/black-hole";

const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, delay, ease },
});

// Headline words; `from`/`to` slice the brand gradient across the highlighted phrase.
const headline: { text: string; br?: boolean; from?: string; to?: string }[] = [
  { text: "Orchestrate" },
  { text: "and" },
  { text: "replay", br: true },
  { text: "your" },
  { text: "AI", from: "rgb(232 128 108)", to: "rgb(236 145 127)" },
  { text: "agent", from: "rgb(236 145 127)", to: "rgb(239 162 147)" },
  { text: "pipelines", from: "rgb(239 162 147)", to: "rgb(243 179 166)" },
];

const HEADLINE_START = 0.3;
const WORD_STAGGER = 0.06;
const afterHeadline = HEADLINE_START + headline.length * WORD_STAGGER;

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate mx-auto flex max-w-7xl flex-col items-center justify-center border-x border-divide px-4 pt-32 pb-20 md:pt-40 md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent,#000_6%,#000_80%,transparent)]"
        >
          <BlackHole coverRef={contentRef} />
        </div>
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-px w-px bg-divide" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -right-px w-px bg-divide" />
        <div ref={contentRef} className="flex flex-col items-center">
          <motion.div {...fade(0.15)}>
            <Eyebrow>Built for teams shipping agents to production</Eyebrow>
          </motion.div>

          <h1 className="mt-5 max-w-3xl text-center text-4xl leading-[1.05] font-medium tracking-[-0.03em] text-white sm:text-5xl md:text-6xl">
            {headline.map((w, i) => (
              <Fragment key={w.text}>
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: "0.35em", filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: HEADLINE_START + i * WORD_STAGGER, ease }}
                >
                  {w.from ? (
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: `linear-gradient(to right, ${w.from}, ${w.to})` }}
                    >
                      {w.text}
                    </span>
                  ) : (
                    w.text
                  )}
                </motion.span>
                {i < headline.length - 1 && " "}
                {w.br && <br className="hidden sm:block" />}
              </Fragment>
            ))}
          </h1>

          <motion.p {...fade(afterHeadline)} className="mt-6 max-w-xl text-center text-base text-neutral-300 md:text-lg">
            Wire agents together on one canvas, rehearse every run in a sandbox, and push to production
            without writing glue code.
          </motion.p>

          <motion.div {...fade(afterHeadline + 0.12)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="#pricing">Start for free</Button>
            <Button href="#pricing" variant="secondary">
              See plans
            </Button>
          </motion.div>

          <motion.div
            {...fade(afterHeadline + 0.24)}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-neutral-400"
          >
            <div className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-white text-white" />
              ))}
            </div>
            <span className="hidden h-4 w-px bg-neutral-700 sm:block" />
            <span>
              4.9 average from <span className="text-white">1,200+</span> engineering teams
            </span>
          </motion.div>
        </div>
      </div>

      <div className="h-px w-full bg-divide" />

      <div className="relative mx-auto max-w-7xl border-x border-divide bg-neutral-900/60 bg-hatch">
        <CornerMarks />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: afterHeadline + 0.3, ease }}
          className="px-3 py-8 sm:px-6 md:px-12 md:py-14"
        >
          <DashboardMock />
        </motion.div>
      </div>
    </MotionConfig>
  );
}
