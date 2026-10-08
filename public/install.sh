#!/bin/bash
# Installs DBMX on macOS:  curl -fsSL https://dbmx-landing.vercel.app/install.sh | bash
#
# Downloading with curl means macOS never adds the quarantine flag, so the unsigned app
# opens without a Gatekeeper prompt. The script downloads the latest release, copies the app
# into /Applications and cleans up after itself.
set -euo pipefail

DMG_URL="https://github.com/stardust1420/dbmx/releases/latest/download/dbmx.dmg"
INSTALL_DIR="${DBMX_INSTALL_DIR:-/Applications}"

if [ "$(uname -s)" != "Darwin" ]; then
  echo "DBMX is only available for macOS right now." >&2
  exit 1
fi

WORK_DIR="$(mktemp -d)"
MOUNT_DIR="${WORK_DIR}/mount"
DMG_PATH="${WORK_DIR}/dbmx.dmg"

cleanup() {
  hdiutil detach "$MOUNT_DIR" -quiet 2>/dev/null || true
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT

echo "Downloading DBMX..."
curl -fL --progress-bar "$DMG_URL" -o "$DMG_PATH"

echo "Installing to ${INSTALL_DIR}..."
mkdir -p "$MOUNT_DIR"
hdiutil attach -nobrowse -readonly -noautoopen -mountpoint "$MOUNT_DIR" "$DMG_PATH" >/dev/null

APP_SRC="$(find "$MOUNT_DIR" -maxdepth 1 -name '*.app' -print -quit)"
if [ -z "$APP_SRC" ]; then
  echo "Couldn't find the app inside the disk image." >&2
  exit 1
fi
APP_NAME="$(basename "$APP_SRC")"
APP_DEST="${INSTALL_DIR}/${APP_NAME}"

# Quit a running copy so it can be replaced.
osascript -e "quit app \"${APP_NAME%.app}\"" >/dev/null 2>&1 || true

mkdir -p "$INSTALL_DIR" 2>/dev/null || true
SUDO=""
if [ ! -w "$INSTALL_DIR" ]; then
  echo "${INSTALL_DIR} isn't writable by your user, so this step needs your password."
  SUDO="sudo"
fi
$SUDO rm -rf "$APP_DEST"
$SUDO ditto "$APP_SRC" "$APP_DEST"

# Safety net in case anything added the flag along the way.
$SUDO xattr -dr com.apple.quarantine "$APP_DEST" 2>/dev/null || true

echo "Done! Open ${APP_NAME%.app} from ${INSTALL_DIR}."
