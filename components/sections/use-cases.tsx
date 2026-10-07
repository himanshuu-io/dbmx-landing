"use client";

import { motion } from "motion/react";
import { Bug, ChartColumn, Compass, Hammer, Rows3, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/ui";

const cases = [
  { icon: Bug, title: "Debugging production", body: "Find the row behind a bug report, follow its keys and see exactly what the app saw." },
  { icon: Compass, title: "Learning a new schema", body: "Ask Stardust what a table is for and how it joins, before you've read a single migration." },
  { icon: ChartColumn, title: "Ad-hoc analysis", body: "Answer the question from the product meeting in a query, then export it to CSV." },
  { icon: Wrench, title: "Data fixes", body: "Correct a bad value in the grid, review the change, then save it with ⌘S." },
  { icon: Hammer, title: "Schema changes", body: "Add a column, an index or a constraint visually, applied in one transaction." },
  { icon: Rows3, title: "Slow query triage", body: "Run EXPLAIN on ⌘E and have Stardust walk you through the plan and the fix." },
];

export function UseCases() {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden border-x border-divide px-4 py-16 md:px-8 md:py-20">
      <SectionHeading
        eyebrow="Use cases"
        title="Built for the work you actually do"
        description="The everyday jobs of anyone who lives in a database, made shorter."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {cases.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            className="group rounded-xl bg-neutral-900 p-6 transition-colors hover:bg-neutral-800/70"
          >
            <c.icon className="size-5 text-neutral-400 transition-colors group-hover:text-coral" />
            <h3 className="mt-5 font-medium text-neutral-50">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{c.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
