"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button, Logo } from "@/components/ui";

const columns = [
  { title: "Product", links: ["Canvas", "Replays", "Connectors", "Model routing", "API"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Blog", "Changelog", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies", "DPA"] },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done" | "error">("idle");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  }

  return (
    <footer className="mx-auto max-w-7xl px-6 pt-16 pb-10 md:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-neutral-400">
            The workspace for building, replaying and running AI agent pipelines.
          </p>
          <Button href="#pricing" className="mt-6">
            Start for free
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-sm text-neutral-500">{c.title}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-neutral-300 transition hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm text-neutral-500">Newsletter</p>
            <p className="mt-4 text-sm text-neutral-300">Product updates, once a month. No spam.</p>
            <form onSubmit={onSubmit} className="mt-4" noValidate>
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <div className="flex items-center rounded-lg border border-white/10 bg-neutral-900 focus-within:border-white/30">
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus("idle");
                  }}
                  placeholder="you@company.com"
                  className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="mr-1 flex size-8 items-center justify-center rounded-md bg-white text-black transition hover:bg-neutral-200"
                >
                  {status === "done" ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
                </button>
              </div>
              <p aria-live="polite" className="mt-2 h-4 text-xs">
                {status === "done" && <span className="text-emerald-400">Thanks — you&apos;re on the list.</span>}
                {status === "error" && <span className="text-red-400">Enter a valid email address.</span>}
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-4 border-t border-divide pt-6 text-xs text-neutral-500 sm:flex-row">
        <p>© {new Date().getFullYear()} DBMX, Inc. All rights reserved.</p>
        <p>Made for teams who ship.</p>
      </div>
    </footer>
  );
}
