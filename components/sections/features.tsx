"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronRight, Columns3, Database, Download, History, KeyRound, Link2, PanelsLeftBottom, Sparkles, SquareTerminal, Table2, Timer } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";
import foreignKeysScreenshot from "@/public/product/foreign-keys.png";
import stardustScreenshot from "@/public/product/stardust.png";
import tableCrudScreenshot from "@/public/product/table-crud.png";

export function Features() {
  return (
    <div id="features" className="mx-auto max-w-7xl scroll-mt-24 border-x border-divide">
      <SectionHeading
        className="py-16 md:py-20"
        eyebrow="Features"
        title="Everything you reach for, in one window"
        description="An editor that knows your schema, a grid you can edit and an assistant that has read every table."
      />

      <div className="grid border-t border-divide md:grid-cols-2">
        <Card
          icon={Sparkles}
          title="Stardust AI"
          body="Ask in plain language and get SQL written against your actual schema. Explain a query, tune a slow one or sketch a new table. Use our models or bring your own key."
          className="border-b border-divide md:border-r"
        >
          {/* Served as the original PNG and shown at ~1.7x density so the text stays sharp. The
              capture is tall, so it is cropped from the top and faded out. */}
          <div className="mask-fade-b h-[420px] w-full max-w-[340px] overflow-hidden rounded-2xl bg-neutral-900 p-1.5 shadow-[0_40px_120px_-30px_rgb(10_10_10/0.9)]">
            <Image
              src={stardustScreenshot}
              alt="Stardust AI answering 'Describe this database' with a table of the schema's core identity tables"
              sizes="340px"
              unoptimized
              className="h-auto w-full rounded-xl"
            />
          </div>
        </Card>
        <Card
          icon={SquareTerminal}
          title="An editor that knows your tables"
          body="Built on Monaco, the editor behind VS Code, with autocomplete for tables and columns, one-key formatting and EXPLAIN on ⌘E."
          className="border-b border-divide"
        >
          <Autocomplete />
        </Card>
      </div>

      <ByokBlock />

      <Card
        icon={PanelsLeftBottom}
        title="Every connection, one window"
        body="Most clients give each database its own window. DBMX keeps all your connections in one sidebar, colour-tagged by environment, with several databases open at once. Staging and production sit side by side, and you never lose track of which is which."
        className="border-b border-divide"
      >
        <ConnectionsSidebar />
      </Card>

      <TableCrud />

      <Card
        icon={Link2}
        title="Follow foreign keys"
        body="Hover any foreign key and hit Join. The related rows open right below, so you can walk from a variant to its product, or an order to its customer, without writing a join."
        className="border-b border-divide"
      >
        <div className="w-full overflow-hidden rounded-2xl bg-neutral-900 p-1.5 shadow-[0_40px_120px_-30px_rgb(10_10_10/0.9)]">
          {/* Served as the original PNG: re-encoding blurs the small monospace text. The 1920px
              capture fills the card at ~1.7x density, so it stays sharp on Retina screens. */}
          <Image
            src={foreignKeysScreenshot}
            alt="Hovering a product_id cell shows 'Join with product'; below it, the joined product_variant and product rows open in a drawer"
            sizes="(min-width: 1280px) 1120px, 100vw"
            unoptimized
            className="h-auto w-full rounded-xl"
          />
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Timer, title: "Streaming results", body: "Rows arrive as the database sends them, with a live timer and a cancel button for runaway queries." },
          { icon: History, title: "History & saved queries", body: "Every query you run is kept in history. Save the ones worth keeping with ⌘S." },
          { icon: Columns3, title: "Visual schema editor", body: "Add and change columns, indexes and constraints. Changes apply in a single transaction." },
          { icon: Download, title: "CSV & JSON export", body: "Export the result you are looking at, or a whole filtered table, in one step." },
        ].map((f, i) => (
          <div
            key={f.title}
            className={cn(
              "border-divide p-6 md:p-8",
              i < 3 && "border-b lg:border-b-0",
              i === 2 && "md:border-b-0",
              i % 2 === 0 && "md:border-r",
              i === 1 && "lg:border-r",
            )}
          >
            <p className="flex items-center gap-2 font-medium text-neutral-50">
              <f.icon className="size-4 text-neutral-400" />
              {f.title}
            </p>
            <p className="mt-2 text-sm text-neutral-400">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  body,
  className,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  body: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col overflow-hidden p-6 md:p-8", className)}>
      <p className="flex items-center gap-2 font-medium text-neutral-50">
        <Icon className="size-4 text-neutral-400" />
        {title}
      </p>
      <p className="mt-2 max-w-md text-sm text-neutral-400">{body}</p>
      <div className="mt-8 flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

const typed = "select email, plan from users u where u.";
const suggestions = [
  { name: "created_at", type: "timestamptz" },
  { name: "email", type: "text" },
  { name: "id", type: "uuid" },
  { name: "plan", type: "plan_tier" },
];

function Autocomplete() {
  const [text, setText] = useState("");

  useEffect(() => {
    if (text.length < typed.length) {
      const t = setTimeout(() => setText(typed.slice(0, text.length + 1)), 45);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setText(""), 3200);
    return () => clearTimeout(t);
  }, [text]);

  const done = text.length === typed.length;

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl bg-neutral-900 p-4 font-mono text-xs text-neutral-200">
        <span className="mr-3 text-neutral-600 select-none">1</span>
        {text}
        <span className="animate-blink ml-px inline-block h-4 w-px translate-y-0.5 bg-coral" />
      </div>
      <motion.ul
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        className="mt-1 ml-10 w-56 overflow-hidden rounded-xl bg-neutral-800 p-1 font-mono text-[11px] shadow-[0_16px_40px_-16px_rgb(10_10_10/0.9)]"
      >
        {suggestions.map((s, i) => (
          <li
            key={s.name}
            className={cn(
              "flex items-center justify-between rounded-md px-2 py-1.5",
              i === 0 ? "bg-neutral-700 text-neutral-50" : "text-neutral-300",
            )}
          >
            {s.name}
            <span className="text-neutral-500">{s.type}</span>
          </li>
        ))}
      </motion.ul>
    </div>
  );
}

const providers = [
  { name: "Anthropic", key: true },
  { name: "OpenAI", key: false },
  { name: "Gemini", key: false },
  { name: "DeepSeek", key: true },
  { name: "Mistral", key: false },
  { name: "Groq", key: false },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={cn("flex h-5 w-9 shrink-0 items-center rounded-full p-0.5", on ? "justify-end bg-coral" : "bg-neutral-700")}>
      <span className="size-4 rounded-full bg-neutral-50" />
    </span>
  );
}

function ByokBlock() {
  return (
    <div className="grid border-b border-divide lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="p-6 md:p-8">
        <p className="flex items-center gap-2 font-medium text-neutral-50">
          <KeyRound className="size-4 text-neutral-400" />
          Bring your own AI provider key
        </p>
        <p className="mt-2 max-w-md text-sm text-neutral-400">
          Start with the models that come with Stardust. When you want a specific provider, switch off Stardust
          models and add your own API key. Stardust then runs on your account, with the models you already pay for.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {providers.map((p) => (
            <li key={p.name} className="rounded-md bg-neutral-900 px-2 py-1 text-xs text-neutral-300">
              {p.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-center px-6 pb-6 md:px-8 md:pb-8 lg:pt-8">
        <div className="w-full max-w-xl rounded-2xl bg-neutral-900 p-4 shadow-[0_24px_60px_-24px_rgb(10_10_10/0.9)]">
          <p className="text-sm font-medium text-neutral-50">LLM Manager</p>
          <div className="mt-4 space-y-3 rounded-xl bg-neutral-950 p-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-200">Enable Stardust AI</p>
                <p className="text-xs text-neutral-500">Text-to-SQL, explanations and tuning</p>
              </div>
              <Toggle on />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-neutral-200">Use Stardust models</p>
                <p className="text-xs text-neutral-500">Off: bring your own keys</p>
              </div>
              <Toggle on={false} />
            </div>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {providers.map((p, i) => (
              <motion.li
                key={p.name}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between rounded-lg bg-neutral-950 px-3 py-2.5 font-mono text-xs text-neutral-300"
              >
                {p.name.toLowerCase()}
                {p.key ? (
                  <span className="flex items-center gap-1.5 font-sans text-[11px] text-neutral-50">
                    <KeyRound className="size-3 text-coral" /> Key added
                  </span>
                ) : (
                  <ChevronDown className="size-3.5 text-neutral-600" />
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const crud = [
  { verb: "Create", body: "Add new rows from a form, column by column." },
  { verb: "Read", body: "Filter, sort and group with SELECT, WHERE, ORDER BY and GROUP BY fields above the grid." },
  { verb: "Update", body: "Edit any cell in place. Changes stay highlighted until you save with ⌘S or undo with Esc." },
  { verb: "Delete", body: "Tick the rows you want gone and remove them in one go." },
];

function TableCrud() {
  return (
    <div className="grid border-b border-divide lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="p-6 md:p-8">
        <p className="flex items-center gap-2 font-medium text-neutral-50">
          <Table2 className="size-4 text-neutral-400" />
          Full CRUD in the table view
        </p>
        <p className="mt-2 max-w-md text-sm text-neutral-400">
          Open a table and work on it like a spreadsheet. No hand-written INSERT, UPDATE or DELETE needed.
        </p>
        <dl className="mt-8 space-y-5">
          {crud.map((c) => (
            <div key={c.verb} className="grid grid-cols-[5rem_1fr] gap-3 text-sm">
              <dt className="font-mono text-xs leading-5 tracking-[0.08em] text-coral uppercase">{c.verb}</dt>
              <dd className="text-neutral-400">{c.body}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="overflow-hidden px-6 pb-6 md:px-8 md:pb-8 lg:pt-8 lg:pr-0 lg:pb-0">
        <div className="mask-fade-b overflow-hidden rounded-tl-xl rounded-tr-xl bg-neutral-900 p-1.5 lg:rounded-tr-none">
          {/* Served as the original PNG: re-encoding blurs the small monospace text. */}
          <Image
            src={tableCrudScreenshot}
            alt="DBMX table view with two rows selected for deletion and two edited cells highlighted"
            sizes="(min-width: 1024px) 720px, 100vw"
            unoptimized
            className="h-auto w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

const connections = [
  {
    name: "Neon",
    env: "staging",
    strip: "bg-coral",
    databases: [
      { name: "neondb" },
      { name: "affine", connected: true, tables: ["users", "workspaces", "snapshots"] },
    ],
  },
  {
    name: "Supabase",
    env: "production",
    strip: "bg-cream",
    databases: [{ name: "postgres", connected: true, tables: ["orders", "customers", "invoices"] }],
  },
  {
    name: "Inventory",
    env: "local",
    strip: "bg-neutral-500",
    databases: [
      { name: "inventory", connected: true, tables: ["stock_location", "inventory_item", "tax_rate"] },
      { name: "archive" },
    ],
  },
];

function ConnectionsSidebar() {
  return (
    <div className="grid w-full max-w-4xl gap-3 md:grid-cols-3">
      {connections.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="relative overflow-hidden rounded-xl bg-neutral-900 py-3 pr-3 pl-4"
        >
          <span className={cn("absolute inset-y-0 left-0 w-0.5", c.strip)} />
          <p className="flex items-center gap-1.5 text-sm font-medium text-neutral-50">
            <ChevronDown className="size-3.5 text-neutral-500" />
            {c.name}
            <span className="ml-auto rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-normal text-neutral-400">{c.env}</span>
          </p>
          <ul className="mt-2 space-y-1 font-mono text-xs">
            {c.databases.map((d) => (
              <li key={d.name}>
                <span className={cn("flex items-center gap-1.5 py-0.5 pl-3", d.connected ? "text-neutral-200" : "text-neutral-500")}>
                  {d.connected ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                  <Database className="size-3" />
                  {d.name}
                  {d.connected && (
                    <span className="ml-auto flex items-center gap-1 font-sans text-[10px] text-neutral-400">
                      <span className="size-1.5 rounded-full bg-neutral-50" /> Connected
                    </span>
                  )}
                </span>
                {d.tables && (
                  <ul className="mt-0.5 space-y-0.5">
                    {d.tables.map((t) => (
                      <li key={t} className="flex items-center gap-1.5 py-0.5 pl-10 text-neutral-400">
                        <Table2 className="size-3 text-neutral-600" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
