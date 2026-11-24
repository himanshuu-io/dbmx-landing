import type { Metadata } from "next";
import { Logo } from "@/components/ui";
import { InviteHelp } from "./invite-help";

export const metadata: Metadata = {
  title: "You're invited - DBMX",
  robots: { index: false },
};

// Team invite emails link here. The page is static; the token in the query is
// only used in the browser to offer a copy button and is never sent anywhere.
export default function Invite() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo />
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">You&apos;re invited to a team on dbmx</h1>
        <p className="text-neutral-400">
          Open dbmx, go to Team → Invites, and accept. Or paste this link there.
        </p>
        <InviteHelp />
        <p className="text-sm text-neutral-500">
          Don&apos;t have dbmx yet?{" "}
          <a className="underline" href="https://github.com/stardust1420/dbmx/releases/latest">
            Download it
          </a>
          .
        </p>
      </div>
    </main>
  );
}
