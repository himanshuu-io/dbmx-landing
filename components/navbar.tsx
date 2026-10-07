"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { DownloadButton, Logo } from "@/components/ui";
import { cn } from "@/lib/utils";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Privacy", href: "#privacy" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.nav
        initial={false}
        animate={{
          width: scrolled ? "min(64rem, calc(100% - 2rem))" : "min(80rem, 100%)",
          marginTop: scrolled ? 12 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className={cn(
          "relative mx-auto flex h-[60px] items-center justify-between px-4 transition-[background-color,box-shadow] duration-300 md:h-[72px] md:px-8",
          scrolled
            ? "rounded-2xl bg-neutral-900/70 shadow-[0_12px_40px_-12px_rgb(10_10_10/0.8)] backdrop-blur-xl backdrop-saturate-150 md:h-[60px]"
            : "bg-transparent",
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="rounded-md px-3 py-2 text-sm text-neutral-300 transition hover:text-neutral-50"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <DownloadButton className="h-9 px-4" />
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-lg bg-neutral-800 text-neutral-50 md:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[60px] bottom-0 z-40 flex flex-col gap-2 bg-neutral-950 px-4 pt-6 md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-2xl font-medium tracking-tight text-neutral-50 hover:bg-neutral-900"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <DownloadButton onClick={() => setOpen(false)} className="h-11" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
