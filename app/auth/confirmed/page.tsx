import type { Metadata } from "next";
import { Logo } from "@/components/ui";
import { LinkStatus } from "./link-status";

export const metadata: Metadata = {
  title: "Email confirmed - DBMX",
  robots: { index: false },
};

// Supabase's email confirmation link lands here (the project's Site URL).
export default function EmailConfirmed() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo />
      <LinkStatus />
    </main>
  );
}
