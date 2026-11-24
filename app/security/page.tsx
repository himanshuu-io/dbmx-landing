import type { Metadata } from "next";
import { Logo } from "@/components/ui";

export const metadata: Metadata = {
  title: "Security - DBMX",
  description:
    "How dbmx shares database connections with your team end to end encrypted, and where the limits are.",
};

const repo = "https://github.com/stardust1420/dbmx/blob/main/app";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

// A static page: how Teams connection sharing is encrypted, and what it does
// not protect against. Keep it in step with docs/teams-setup.md in the app repo.
export default function Security() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-10 px-6 py-16">
      <Logo />
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">How dbmx shares connections securely</h1>
        <p className="text-neutral-400">
          When you share a connection with your team, it is encrypted on your computer to each
          teammate&apos;s computer. The dbmx server only carries sealed blobs it cannot open.
        </p>
      </header>

      <Section title="What the server stores">
        <ul className="list-disc space-y-1 pl-5 text-neutral-400">
          <li>Your public keys and your devices&apos; public keys, with signed certificates.</li>
          <li>
            Your identity private key, sealed with a recovery code only you hold. The server
            cannot unseal it.
          </li>
          <li>
            Encrypted share blobs, one per recipient device, each signed by the sharer. Names,
            hosts and passwords are inside the encryption.
          </li>
        </ul>
        <p className="text-neutral-400">
          It never receives a plaintext connection, a private key, the recovery code or a
          connection name.
        </p>
      </Section>

      <Section title="How it works">
        <ul className="list-disc space-y-1 pl-5 text-neutral-400">
          <li>
            Each person has one identity (Ed25519 for signing, X25519 for encryption), and each
            install has its own device key. Private keys live in your operating system&apos;s
            keychain.
          </li>
          <li>
            A new device is approved by one you already have: both show a short key code, you
            confirm they match, and the identity is sent sealed to the new device only.
          </li>
          <li>
            Your identity signs each device certificate. A share is encrypted with HPKE
            (X25519, HKDF-SHA256, AES-256-GCM) to every certified device of the recipient, and
            signed by you.
          </li>
          <li>
            Losing every device is survivable: the recovery code unseals your identity (the
            code is stretched with Argon2id first).
          </li>
        </ul>
      </Section>

      <Section title="Fingerprints">
        <p className="text-neutral-400">
          dbmx pins each teammate&apos;s identity the first time it sees it (trust on first use).
          After that, a different key for the same person is flagged as changed, nothing is
          encrypted to it, and nothing signed by it is accepted until you accept the new key.
          Because the first sighting is trusted, compare fingerprints with each teammate once,
          over a channel you trust, and mark them verified.
        </p>
      </Section>

      <Section title="Per-member logins and revocation">
        <p className="text-neutral-400">
          For each member you can have dbmx create a dedicated database login (read-only, or read
          &amp; write) on your database, or share your own credentials, or share the connection
          with no password so they use their own. You see every statement before it runs. A
          created login has a random name and a random 32-character password, and is dropped
          when you stop sharing or remove the member. If your database is unreachable at that
          moment, the drop is queued and retried, and the checklist shows it as pending.
        </p>
      </Section>

      <Section title="If the server is breached">
        <p className="text-neutral-400">
          An attacker who copies the database gets public keys, sealed identities and encrypted
          blobs. Without your devices&apos; keys or your recovery code, none of it can be opened.
          They could try to guess a recovery code offline, which is why it is 160 random bits
          behind Argon2id.
        </p>
      </Section>

      <Section title="What a hacked server cannot do">
        <ul className="list-disc space-y-1 pl-5 text-neutral-400">
          <li>Read a share, or learn a connection&apos;s name, host or password.</li>
          <li>Forge a share: it must be signed by the sharer&apos;s pinned identity.</li>
          <li>
            Add a device that receives shares: device certificates must verify under the
            owner&apos;s pinned identity.
          </li>
        </ul>
      </Section>

      <Section title="The limits">
        <ul className="list-disc space-y-2 pl-5 text-neutral-400">
          <li>
            A hacked server can withhold or delete shares and keys. That is a denial of service,
            not a leak.
          </li>
          <li>
            Trust on first use: a hacked server can hand a brand-new device an attacker identity
            instead of yours. It never gets your keys, and your teammates&apos; pins reject it,
            but compare fingerprints so you are not the one who is fooled.
          </li>
          <li>
            Anyone holding your dbmx account session can reset your identity. Your teammates then
            see &quot;key changed&quot; and must accept the new key.
          </li>
          <li>
            PostgreSQL grants some rights to everyone by default. On PostgreSQL 14 and older any
            role can create objects in the <code>public</code> schema. dbmx tells you this when
            it previews a login&apos;s statements, but does not revoke it from your database.
          </li>
          <li>
            Without an operating system keychain, sharing is turned off: dbmx will not keep
            private keys in a plain file.
          </li>
          <li>
            &quot;Share my credentials&quot; means the member knows your database password and
            can use it outside dbmx.
          </li>
          <li>
            Once a member has seen a connection, you cannot take back what they saw. Removing
            them drops their login, but if they know a shared password, change it.
          </li>
          <li>The dbmx app is not code-signed yet, so your system may warn when you open it.</li>
        </ul>
      </Section>

      <Section title="Read the code">
        <p className="text-neutral-400">
          dbmx is open source. The cryptography is in{" "}
          <a className="underline" href={`${repo}/teams_crypto.go`}>
            app/teams_crypto.go
          </a>{" "}
          and the sync and trust checks are in{" "}
          <a className="underline" href={`${repo}/teams_sync.go`}>
            app/teams_sync.go
          </a>
          .
        </p>
      </Section>
    </main>
  );
}
