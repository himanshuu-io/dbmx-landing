"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button, Logo } from "@/components/ui";
import { cn } from "@/lib/utils";

const links = [
  { label: "Product", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
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
          "mx-auto flex h-[60px] items-center justify-between px-4 transition-[background-color,border-color,box-shadow] duration-300 md:h-[72px] md:px-8",
          scrolled
            ? "rounded-2xl border border-white/10 bg-neutral-950/80 shadow-[0_8px_32px_rgb(0_0_0/0.5)] backdrop-blur-md md:h-[60px]"
            : "border border-transparent bg-transparent",
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="rounded-md px-3 py-2 text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="#" className="text-sm text-neutral-300 transition hover:text-white">
            Log in
          </Link>
          <Button href="#pricing" className="h-9 px-4">
            Get started
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
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
            className="fixed inset-x-0 top-[60px] bottom-0 z-40 flex flex-col gap-2 border-t border-divide bg-black px-4 pt-6 md:hidden"
          >
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-2xl font-medium tracking-tight text-white hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Button href="#pricing" onClick={() => setOpen(false)} className="h-11">
                Get started
              </Button>
              <Button href="#" variant="secondary" onClick={() => setOpen(false)} className="h-11">
                Log in
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
