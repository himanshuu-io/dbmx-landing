"use client";

import { useEffect, useState } from "react";

// Shows a copy button for the full invite link. The token is read from the
// address bar only to build that link; nothing is sent or stored.
export function InviteHelp() {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLink(window.location.href);
  }, []);

  if (!new URLSearchParams(link.split("?")[1] ?? "").has("token")) return null;

  return (
    <div className="space-y-3">
      <p className="text-neutral-400">Or copy this link and paste it there.</p>
      <button
        type="button"
        className="rounded-md border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "Copied" : "Copy invite link"}
      </button>
    </div>
  );
}
