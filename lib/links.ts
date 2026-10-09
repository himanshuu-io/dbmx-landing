/** Where the macOS build is served from: the (unsigned) .dmg attached to the 1.0.1 GitHub release. */
export const MAC_DOWNLOAD_URL = "https://github.com/stardust1420/dbmx/releases/download/1.0.1/dbmx.dmg";

/** Public URL of `public/install.sh`, which installs the latest .dmg without the quarantine flag. */
export const INSTALL_SCRIPT_URL = "https://dbmx.app/install.sh";

/** One-liner users paste into Terminal. */
export const INSTALL_COMMAND = `curl -fsSL ${INSTALL_SCRIPT_URL} | bash`;
