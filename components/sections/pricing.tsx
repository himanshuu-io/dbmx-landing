"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck } from "lucide-react";
import { Button, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

type Cycle = "monthly" | "yearly";

const tiers = [
  {
    name: "Starter",
    tagline: "For your first production agents",
    price: { monthly: 12, yearly: 10 },
    cta: "Start for free",
    variant: "secondary" as const,
    features: [
      "3 live pipelines",
      "100 replay runs / month",
      "Visual canvas",
      "GitHub & Slack connectors",
      "Email support",
      "1 workspace",
    ],
  },
  {
    name: "Team",
    tagline: "For teams running agents daily",
    price: { monthly: 29, yearly: 23 },
    cta: "Start 14-day trial",
    variant: "primary" as const,
    featured: true,
    features: [
      "20 live pipelines",
      "2,000 replay runs / month",
      "Model routing & budgets",
      "All managed connectors",
      "Priority support",
      "5 workspaces",
      "Audit log export",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For regulated and large orgs",
    price: { monthly: 59, yearly: 47 },
    cta: "Talk to sales",
    variant: "secondary" as const,
    features: [
      "Unlimited pipelines",
      "Unlimited replay runs",
      "SSO, SCIM & RBAC",
      "Custom connector SDK",
      "Dedicated success engineer",
      "Unlimited workspaces",
      "VPC or on-prem deploy",
      "99.95% uptime SLA",
    ],
  },
];

export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("monthly");

  return (
    <section id="pricing" className="mx-auto max-w-7xl scroll-mt-24 border-x border-divide">
      <div className="flex flex-col items-center px-4 py-16 text-center md:py-20">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-5 text-3xl font-medium tracking-[-0.03em] text-neutral-50 md:text-4xl">Pay per seat, scale as you go</h2>

        <div
          role="radiogroup"
          aria-label="Billing cycle"
          className="mt-8 flex rounded-xl bg-neutral-900 p-1"
        >
          {(["monthly", "yearly"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={cycle === c}
              onClick={() => setCycle(c)}
              className="relative flex h-9 w-36 items-center justify-center gap-2 rounded-lg text-sm capitalize"
            >
              {cycle === c && (
                <motion.span
                  layoutId="cycle-pill"
                  className="absolute inset-0 rounded-lg bg-neutral-800"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className={cn("relative transition-colors", cycle === c ? "text-neutral-50" : "text-neutral-400")}>{c}</span>
              {c === "yearly" && <span className="relative text-[11px] font-medium text-coral">-20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid border-t border-divide md:grid-cols-3">
        {tiers.map((t, i) => (
          <div
            key={t.name}
            className={cn(
              "flex flex-col",
              i < tiers.length - 1 && "border-b border-divide md:border-r md:border-b-0",
              t.featured && "bg-neutral-900",
            )}
          >
            <div className="p-6 pb-2 md:p-8 md:pb-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-medium text-neutral-50">{t.name}</h3>
                {t.featured && (
                  <span className="font-mono text-[11px] tracking-[0.12em] text-coral uppercase">Most popular</span>
                )}
              </div>
              <p className="mt-1 text-sm text-neutral-400 md:min-h-10 lg:min-h-0">{t.tagline}</p>

              <div className="mt-6 flex h-10 items-end gap-1">
                <span className={cn("text-2xl font-medium", t.featured ? "text-cream" : "text-neutral-50")}>$</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={t.price[cycle]}
                    initial={{ y: 12, opacity: 0, filter: "blur(4px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -12, opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "text-4xl leading-none font-medium tracking-tight tabular-nums",
                      t.featured ? "text-cream" : "text-neutral-50",
                    )}
                  >
                    {t.price[cycle]}
                  </motion.span>
                </AnimatePresence>
                <span className="mb-0.5 text-sm text-neutral-400">/ seat / month</span>
              </div>
              <p className="mt-2 h-4 text-xs text-neutral-500">
                {cycle === "yearly" ? `Billed $${t.price.yearly * 12} per seat yearly` : "Billed monthly, cancel anytime"}
              </p>

              <Button href="#" variant={t.variant} className="mt-6 w-full">
                {t.cta}
              </Button>
            </div>

            <ul className="space-y-4 p-6 pt-6 md:p-8 md:pt-6">
              {t.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-neutral-300">
                  <CircleCheck className="size-4 shrink-0 text-neutral-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
