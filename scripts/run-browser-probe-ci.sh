#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <log-path> <command> [args...]" >&2
  exit 1
fi

log_path="$1"
shift

base_url="${BASE_URL:-http://127.0.0.1:3000}"
ready_url="${BROWSER_PROBE_READY_URL:-${base_url%/}/api/internal/ready}"
poll_attempts="${BROWSER_PROBE_READY_ATTEMPTS:-60}"
poll_interval_seconds="${BROWSER_PROBE_READY_INTERVAL_SECONDS:-2}"

pkill -f 'next dev --turbopack' || true
pkill -f 'next dev --webpack' || true

npm run dev:webpack > "$log_path" 2>&1 &
dev_pid=$!

cleanup() {
  kill "$dev_pid" 2>/dev/null || true
  wait "$dev_pid" 2>/dev/null || true
}

trap cleanup EXIT

ready=0

for _ in $(seq 1 "$poll_attempts"); do
  if ! kill -0 "$dev_pid" 2>/dev/null; then
    cat "$log_path" || true
    exit 1
  fi

  if curl -fsS "$ready_url" >/dev/null 2>/dev/null; then
    ready=1
    break
  fi

  sleep "$poll_interval_seconds"
done

if [ "$ready" -ne 1 ]; then
  cat "$log_path" || true
  echo "[browser-probe-ci] Timed out waiting for readiness at $ready_url" >&2
  exit 1
fi

curl -fsS "$ready_url" >/dev/null 2>/dev/null
BASE_URL="$base_url" "$@"
