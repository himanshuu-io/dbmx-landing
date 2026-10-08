"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { Check, Copy } from "lucide-react";
import { INSTALL_COMMAND } from "@/lib/links";
import { cn } from "@/lib/utils";

/**
 * The site's main action: the Terminal one-liner that installs DBMX. The app isn't notarised,
 * and a curl download never gets the quarantine flag, so it opens without a Gatekeeper prompt.
 */
export function InstallCommand({
  className,
  ...props
}: Omit<ComponentProps<"button">, "onClick" | "children">) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission); the text stays selectable.
    }
  }

  return (
    <div
      className={cn(
        "flex h-11 w-full max-w-full items-center rounded-lg bg-neutral-900 ring-1 ring-neutral-800 sm:w-auto",
        className,
      )}
    >
      <code className="flex min-w-0 flex-1 items-center overflow-x-auto px-4 sm:flex-none sm:overflow-visible font-mono text-[13px] whitespace-nowrap text-neutral-200 [scrollbar-width:none]">
        <span aria-hidden className="mr-2 text-coral select-none">
          $
        </span>
        {INSTALL_COMMAND}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy install command"}
        className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-coral text-neutral-50 transition duration-200 hover:bg-coral/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral active:scale-[0.96]"
        {...props}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Install command copied" : ""}
      </span>
    </div>
  );
}

/** Small print under the command: where to paste it. */
export function InstallNote({ className }: { className?: string }) {
  return (
    <p className={cn("max-w-lg text-center text-xs text-neutral-500", className)}>
      Paste into Terminal to install the latest version into Applications.
    </p>
  );
}
