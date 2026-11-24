import type { Metadata } from "next";
import { Logo } from "@/components/ui";

export const metadata: Metadata = {
  title: "You're all set - DBMX",
  robots: { index: false },
};

// Dodo's checkout and customer portal send people here. The page is static and
// ignores whatever query parameters Dodo adds.
export default function BillingDone() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo />
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">You&apos;re all set</h1>
        <p className="text-neutral-400">Return to dbmx to keep going.</p>
      </div>
    </main>
  );
}
