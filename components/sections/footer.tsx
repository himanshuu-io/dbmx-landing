"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { DownloadButton, Logo } from "@/components/ui";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Features", href: "#features" },
      { label: "Privacy", href: "#privacy" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Download", href: "#download" },
      { label: "Contact", href: "mailto:hello@dbmx.dev" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
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
          <Logo variant="lockup-cream" />
          <p className="mt-5 max-w-xs text-sm text-neutral-400">
            The AI-native desktop database client.
          </p>
          <DownloadButton variant="secondary" className="mt-6" />
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title}>
              <p className="text-sm text-neutral-500">{c.title}</p>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-neutral-300 transition hover:text-neutral-50">
                      {l.label}
                    </a>
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
              <div className="flex items-center rounded-lg bg-neutral-900 outline-coral focus-within:outline-1">
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setStatus("idle");
                  }}
                  placeholder="you@company.com"
                  className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-neutral-50 outline-none placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="mr-1 flex size-8 items-center justify-center rounded-md bg-neutral-800 text-neutral-50 transition hover:bg-neutral-700"
                >
                  {status === "done" ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
                </button>
              </div>
              <p aria-live="polite" className="mt-2 h-4 text-xs">
                {status === "done" && <span className="text-neutral-300">Thanks — you&apos;re on the list.</span>}
                {status === "error" && <span className="text-neutral-300">Enter a valid email address.</span>}
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-4 border-t border-divide pt-6 text-xs text-neutral-500 sm:flex-row">
        <p>© {new Date().getFullYear()} DBMX. All rights reserved.</p>
        <p>Made for people who live in their databases.</p>
      </div>

      {/* Oversized cream wordmark as a quiet closing watermark. The asset's built-in 30/504
          padding is cancelled with negative margins so the letters span the full width. */}
      <div aria-hidden className="mt-14 overflow-hidden opacity-[0.14] [mask-image:linear-gradient(to_bottom,#000_30%,transparent_95%)]">
        <Image
          src="/brand/wordmark-cream.svg"
          alt=""
          width={504.186}
          height={160}
          className="pointer-events-none max-w-none select-none"
          style={{ width: "calc(100% * 504.186 / 444.186)", height: "auto", margin: "-6.754% -6.754% -3%" }}
        />
      </div>
    </footer>
  );
}
