import { HardDrive, KeyRound, ScanEye } from "lucide-react";

const points = [
  { icon: HardDrive, title: "Connections stay local", body: "Connection details are stored on your machine and never sent to our servers." },
  { icon: ScanEye, title: "AI sees structure, not rows", body: "Stardust gets your table definitions and your question, never the data in them." },
  { icon: KeyRound, title: "AI is opt-in", body: "Stardust is off until you turn it on, and you can bring your own provider key." },
];

export function Security() {
  return (
    <div
      id="privacy"
      className="mx-auto grid max-w-7xl scroll-mt-24 gap-10 border-x border-divide bg-neutral-900 px-6 py-14 md:grid-cols-2 md:px-10"
    >
      <div>
        <h2 className="text-2xl font-medium tracking-[-0.025em] text-neutral-50 md:text-3xl">
          Your database is none of our business
        </h2>
        <p className="mt-3 max-w-md text-neutral-400">
          DBMX talks to your database directly from your machine. When you use AI, only what it needs to write good SQL
          goes along with your question.
        </p>
      </div>
      <ul className="grid gap-3">
        {points.map((p) => (
          <li key={p.title} className="flex gap-4 rounded-xl bg-neutral-950 p-5">
            <p.icon className="mt-0.5 size-5 shrink-0 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-50">{p.title}</p>
              <p className="mt-1 text-sm text-neutral-400">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
