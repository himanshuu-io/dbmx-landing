"use client";

import { motion } from "motion/react";
import { ChartColumn, Database, GitBranch, Headset, Truck, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/ui";

const cases = [
  { icon: GitBranch, title: "Platform engineering", body: "Triage failing builds, open fix PRs and page a human only when confidence drops." },
  { icon: ChartColumn, title: "Revenue operations", body: "Keep the CRM clean, enrich accounts and draft follow-ups after every call." },
  { icon: Truck, title: "Logistics", body: "Watch carrier feeds, flag late shipments and re-route before customers notice." },
  { icon: Headset, title: "Support", body: "Resolve repeat tickets end to end and hand edge cases over with full context." },
  { icon: Database, title: "Data teams", body: "Detect schema drift, backfill broken tables and document what changed." },
  { icon: Wallet, title: "Finance", body: "Match invoices to payments, chase approvals and close the books faster." },
];

export function UseCases() {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden border-x border-divide px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="Use cases"
        title="Wherever work repeats"
        description="Teams across the company use DBMX to hand routine, multi-step work to agents they can audit."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {cases.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="group rounded-xl border border-white/5 bg-neutral-900 p-5 transition-colors hover:border-white/15 hover:bg-neutral-800/80"
          >
            <c.icon className="size-5 text-brand transition-transform group-hover:-translate-y-0.5" />
            <h3 className="mt-4 font-medium text-white">{c.title}</h3>
            <p className="mt-2 text-sm text-neutral-500">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
