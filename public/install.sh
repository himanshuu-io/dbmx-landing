#!/bin/bash
# Installs DBMX on macOS:  curl -fsSL https://dbmx.app/install.sh | bash
#
# Downloading with curl means macOS never adds the quarantine flag, so the unsigned app
# opens without a Gatekeeper prompt. The script downloads the latest release, copies the app
# into /Applications and cleans up after itself.
set -euo pipefail

DMG_URL="https://github.com/stardust1420/dbmx/releases/download/1.0.1/dbmx.dmg"
INSTALL_DIR="${DBMX_INSTALL_DIR:-/Applications}"

if [ "$(uname -s)" != "Darwin" ]; then
  echo "DBMX is only available for macOS right now." >&2
  exit 1
fi

WORK_DIR="$(mktemp -d)"
MOUNT_DIR="${WORK_DIR}/mount"
DMG_PATH="${WORK_DIR}/dbmx.dmg"

CURL_PID=""

cleanup() {
  [ -n "$CURL_PID" ] && kill "$CURL_PID" 2>/dev/null || true
  hdiutil detach "$MOUNT_DIR" -quiet 2>/dev/null || true
  rm -rf "$WORK_DIR"
}
trap cleanup EXIT
trap 'exit 130' INT TERM

fmt_size() {
  awk -v b="$1" 'BEGIN { if (b >= 1048576) printf "%.1f MB", b / 1048576; else printf "%.0f KB", b / 1024 }'
}

fmt_time() {
  printf '%d:%02d' $(($1 / 60)) $(($1 % 60))
}

# Downloads $1 to $2, redrawing one status line with size, speed, elapsed and remaining time.
download() {
  local url="$1" dest="$2"
  # Give up if the download stays under 1 KB/s for 30 seconds instead of hanging forever.
  local stall=(--speed-limit 1024 --speed-time 30)

  # No terminal to redraw on, so just download quietly.
  if [ ! -t 2 ]; then
    curl -fsSL "${stall[@]}" "$url" -o "$dest"
    return
  fi

  # No -S: errors are reported below so they don't land on the progress line. curl writes
  # each response's headers here as they arrive, so the size is known as soon as
  # the body starts, without a separate request.
  local headers="${WORK_DIR}/headers"
  curl -fsL "${stall[@]}" -D "$headers" "$url" -o "$dest" &
  CURL_PID=$!
  local start=$SECONDS total=0 done_bytes elapsed speed line

  while kill -0 "$CURL_PID" 2>/dev/null; do
    done_bytes="$(stat -f%z "$dest" 2>/dev/null || echo 0)"
    # Once the body is arriving the final response's headers are written, so the last
    # Content-Length is the file's (earlier ones belong to redirects). 0 if the server doesn't say.
    if [ "$total" -eq 0 ] && [ "$done_bytes" -gt 0 ]; then
      total="$(tr -d '\r' < "$headers" | awk 'tolower($1) == "content-length:" { n = $2 } END { print n + 0 }')"
    fi
    elapsed=$((SECONDS - start))
    line="  $(fmt_size "$done_bytes")"
    if [ "$total" -gt 0 ]; then
      line="${line} / $(fmt_size "$total") ($((done_bytes * 100 / total))%)"
    fi
    if [ "$elapsed" -gt 0 ]; then
      speed=$((done_bytes / elapsed))
      line="${line} · $(fmt_size "$speed")/s"
    fi
    line="${line} · elapsed $(fmt_time "$elapsed")"
    if [ "$total" -gt 0 ] && [ "${speed:-0}" -gt 0 ]; then
      line="${line} · remaining $(fmt_time $(((total - done_bytes) / speed)))"
    fi
    printf '\r\033[K%s' "$line" >&2
    sleep 0.25
  done

  local status=0
  wait "$CURL_PID" || status=$?
  CURL_PID=""
  if [ "$status" -ne 0 ]; then
    printf '\r\033[K' >&2
    if [ "$status" -eq 28 ]; then
      echo "Download stalled. GitHub may be slow right now, so try again in a few minutes." >&2
    else
      echo "Download failed (curl exit code ${status})." >&2
    fi
    exit 1
  fi

  elapsed=$((SECONDS - start))
  done_bytes="$(stat -f%z "$dest")"
  printf '\r\033[K  %s downloaded in %s\n' "$(fmt_size "$done_bytes")" "$(fmt_time "$elapsed")" >&2
}

echo "Downloading DBMX..."
download "$DMG_URL" "$DMG_PATH"

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
