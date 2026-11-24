"use client";

import { useEffect, useState } from "react";

// Supabase appends the session (#access_token=…) or an error (#error=…) to the
// URL. The page only checks whether an error is present and never reads,
// stores or shows the tokens; the user logs in from the dbmx app.
export function LinkStatus() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(new URLSearchParams(window.location.hash.slice(1)).has("error"));
    // Drop the fragment so the tokens don't linger in the address bar or history.
    history.replaceState(null, "", window.location.pathname);
  }, []);

  return failed ? (
    <div className="max-w-md space-y-3">
      <h1 className="text-2xl font-semibold">This link didn&apos;t work</h1>
      <p className="text-neutral-400">
        It has expired or was already used. Open dbmx and choose &ldquo;Resend email&rdquo; on the login page.
      </p>
    </div>
  ) : (
    <div className="max-w-md space-y-3">
      <h1 className="text-2xl font-semibold">Email confirmed</h1>
      <p className="text-neutral-400">Your dbmx account is ready. Go back to the dbmx app and log in.</p>
    </div>
  );
}
