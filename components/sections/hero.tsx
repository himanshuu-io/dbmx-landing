"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import { MotionConfig, motion } from "motion/react";
import { Button, CornerMarks, DownloadButton, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";
import { BlackHole } from "@/components/black-hole";
import appScreenshot from "@/public/product/app.png";

const ease = [0.22, 1, 0.36, 1] as const;

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, delay, ease },
});

// Headline words; `accent` words are set in Warm Cream as the editorial moment.
const headline: { text: string; br?: boolean; accent?: boolean }[] = [
  { text: "Fall" },
  { text: "into", br: true },
  { text: "your", accent: true },
  { text: "data", accent: true },
];

const HEADLINE_START = 0.3;
const WORD_STAGGER = 0.06;
const afterHeadline = HEADLINE_START + headline.length * WORD_STAGGER;

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative isolate mx-auto flex max-w-7xl flex-col items-center justify-center border-x border-divide px-4 pt-32 pb-28 sm:pb-32 md:pt-40 md:pb-44">
        {/* Padding keeps the black hole at full height with a two-line headline, and sits the content
            on its centre (the extra top padding clears the fixed navbar). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent,#000_6%,#000_80%,transparent)]"
        >
          <BlackHole coverRef={contentRef} />
        </div>
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-px w-px bg-divide" />
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -right-px w-px bg-divide" />
        <div ref={contentRef} data-blackhole-center className="flex flex-col items-center">
          <motion.div {...fade(0.15)}>
            <Eyebrow>For people who ask their data strange questions</Eyebrow>
          </motion.div>

          <h1 className="mt-5 max-w-3xl text-center text-4xl leading-[1.05] font-medium tracking-[-0.04em] text-neutral-50 sm:text-5xl md:text-6xl">
            {headline.map((w, i) => (
              <Fragment key={w.text}>
                <motion.span
                  className={cn("inline-block", w.accent && "text-cream")}
                  initial={{ opacity: 0, y: "0.35em", filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: HEADLINE_START + i * WORD_STAGGER, ease }}
                >
                  {w.text}
                </motion.span>
                {i < headline.length - 1 && " "}
                {w.br && <br className="hidden sm:block" />}
              </Fragment>
            ))}
          </h1>

          <motion.p {...fade(afterHeadline)} className="mt-6 max-w-xl text-center text-base text-neutral-300 md:text-lg">
            Every connection in one window, foreign keys you follow like footnotes, and Stardust, an AI
            that&apos;s already read your schema. Ask the strange question. Get a real query back.
          </motion.p>

          <motion.div {...fade(afterHeadline + 0.12)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <DownloadButton data-astronaut-target />
            <Button href="#features" variant="secondary">
              See features
            </Button>
          </motion.div>

          <motion.div
            {...fade(afterHeadline + 0.24)}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-neutral-400"
          >
            <span>PostgreSQL, with MySQL &amp; MongoDB soon</span>
            <span className="hidden h-4 w-px bg-neutral-700 sm:block" />
            <span>Native desktop app for macOS</span>
            <span className="hidden h-4 w-px bg-neutral-700 sm:block" />
            <span>
              Connections stay <span className="text-neutral-50">on your machine</span>
            </span>
          </motion.div>
        </div>
      </div>

      <div className="h-px w-full bg-divide" />

      <div className="relative mx-auto max-w-7xl border-x border-divide bg-hatch">
        <CornerMarks />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: afterHeadline + 0.3, ease }}
          className="px-3 py-8 sm:px-6 md:px-12 md:py-14"
        >
          <div className="overflow-hidden rounded-2xl bg-neutral-900 p-1.5 shadow-[0_40px_120px_-30px_rgb(10_10_10/0.9)]">
            {/* Served as the original PNG: re-encoding blurs the small monospace text. */}
            <Image
              src={appScreenshot}
              alt="DBMX showing a database table in the data grid, with Stardust AI describing the database schema alongside"
              unoptimized
              sizes="(min-width: 1280px) 1184px, 100vw"
              priority
              className="h-auto w-full rounded-xl"
            />
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
