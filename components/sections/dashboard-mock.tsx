import {
  Activity,
  Bell,
  Bot,
  Clock3,
  Cpu,
  LayoutDashboard,
  ListChecks,
  PanelLeft,
  Search,
  Shuffle,
  Workflow,
} from "lucide-react";
import { BrandAsset } from "@/components/ui";
import { cn } from "@/lib/utils";

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Bot, label: "Agents" },
  { icon: Workflow, label: "Pipelines" },
  { icon: Shuffle, label: "Replays" },
  { icon: ListChecks, label: "Runs" },
  { icon: Bell, label: "Alerts" },
];

const stats = [
  { icon: Bot, value: "342", label: "Agents online", delta: "+18" },
  { icon: Activity, value: "99.2%", label: "Run success", delta: "+0.6%" },
  { icon: Clock3, value: "3.8s", label: "Median latency", delta: "-12%" },
  { icon: Cpu, value: "Sonnet 5", label: "Top model", delta: null },
];

// Status is carried by the label and a neutral dot weight, never by brand color.
const runs = [
  { name: "invoice-reconciler", model: "Sonnet 5", status: "Live", tone: "bg-neutral-50", latency: "2.9s" },
  { name: "pr-triage", model: "Haiku 4.5", status: "Replaying", tone: "bg-neutral-400", latency: "1.1s" },
  { name: "lead-enricher", model: "Opus 5.5", status: "Paused", tone: "bg-neutral-600", latency: "6.4s" },
  { name: "churn-watcher", model: "Sonnet 5", status: "Live", tone: "bg-neutral-50", latency: "3.3s" },
];

const bars = [
  [8, 6, 4],
  [11, 7, 5],
  [7, 5, 3],
  [12, 8, 6],
  [9, 7, 4],
  [13, 9, 5],
  [10, 6, 5],
];

export function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-2xl bg-neutral-900 p-1.5 shadow-[0_40px_120px_-30px_rgb(10_10_10/0.9)]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-52 shrink-0 flex-col p-3 lg:flex">
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="flex items-center gap-2.5 text-sm font-medium tracking-tight text-neutral-50">
              <BrandAsset variant="mark-cream" height={16} />
              DBMX Cloud
            </span>
            <PanelLeft className="size-4 text-neutral-500" />
          </div>
          <ul className="mt-5 space-y-0.5">
            {nav.map(({ icon: Icon, label, active }) => (
              <li
                key={label}
                className={cn(
                  "relative flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px]",
                  active ? "bg-neutral-800 text-neutral-50" : "text-neutral-400",
                )}
              >
                {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-coral" />}
                <Icon className="size-4" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-auto rounded-xl bg-neutral-800/60 p-3">
            <p className="text-xs font-medium text-neutral-200">Replay credits</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-700">
              <div className="h-full w-2/3 rounded-full bg-coral" />
            </div>
            <p className="mt-2 text-[11px] text-neutral-500">6,400 of 10,000 used</p>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 rounded-xl bg-neutral-950">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm font-medium text-neutral-50">Overview</span>
            <div className="flex w-40 items-center gap-2 rounded-lg bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-500 sm:w-64">
              <Search className="size-3.5" />
              <span className="truncate">Search pipelines…</span>
              <kbd className="ml-auto hidden rounded bg-neutral-800 px-1 font-mono text-[10px] text-neutral-400 sm:block">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="space-y-3 px-4 pb-4">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {stats.map(({ icon: Icon, value, label, delta }) => (
                <div key={label} className="rounded-xl bg-neutral-900 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-neutral-800 text-neutral-300">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="text-lg font-medium tracking-tight text-neutral-50">{value}</span>
                    {delta && <span className="text-[11px] text-neutral-400">{delta}</span>}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-3 xl:grid-cols-5">
              <div className="overflow-hidden rounded-xl bg-neutral-900 xl:col-span-3">
                <div className="px-4 pt-3 pb-1 text-sm font-medium text-neutral-50">Active pipelines</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:min-w-[420px]">
                    <thead className="text-neutral-500">
                      <tr className="border-b border-neutral-800">
                        <th className="px-4 py-2 font-normal">Pipeline</th>
                        <th className="hidden px-4 py-2 font-normal sm:table-cell">Model</th>
                        <th className="px-4 py-2 font-normal">Status</th>
                        <th className="px-4 py-2 font-normal">p50</th>
                      </tr>
                    </thead>
                    <tbody>
                      {runs.map((r) => (
                        <tr key={r.name} className="border-b border-neutral-800/60 last:border-0">
                          <td className="px-4 py-2.5 font-mono text-neutral-200">{r.name}</td>
                          <td className="hidden px-4 py-2.5 sm:table-cell">
                            <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-neutral-300">{r.model}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="flex items-center gap-1.5 text-neutral-300">
                              <span className={cn("size-1.5 rounded-full", r.tone)} />
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-neutral-400">{r.latency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-xl bg-neutral-900 p-4 xl:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-50">Runs this week</span>
                  <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[11px] text-neutral-400">7d</span>
                </div>
                <div className="mt-4 flex h-36 items-end justify-between gap-2">
                  {bars.map((stack, i) => {
                    // Only today's column carries the coral signal.
                    const today = i === bars.length - 1;
                    return (
                      <div key={i} className="flex w-full flex-col-reverse gap-0.5">
                        {stack.map((v, j) => (
                          <div
                            key={j}
                            style={{ height: v * 4 }}
                            className={cn(
                              "w-full rounded-[3px]",
                              j === 0 && (today ? "bg-coral" : "bg-neutral-500"),
                              j === 1 && (today ? "bg-coral/55" : "bg-neutral-700"),
                              j === 2 && (today ? "bg-coral/25" : "bg-neutral-800"),
                            )}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-neutral-500">
                  {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                    <span key={i} className={cn("w-full text-center", i === 6 && "text-neutral-200")}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
