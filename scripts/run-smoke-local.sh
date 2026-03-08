#!/usr/bin/env sh
set -eu

set -a
. ./.env.dev
set +a

tsx src/main.ts &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}

trap cleanup EXIT INT TERM

BASE_URL="${SMOKE_BASE_URL:-http://127.0.0.1:3000}"
HEALTH_URL="$BASE_URL/health"

ATTEMPTS=30
SLEEP_SECONDS=1

i=1
while [ "$i" -le "$ATTEMPTS" ]; do
  if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
    break
  fi
  sleep "$SLEEP_SECONDS"
  i=$((i + 1))
done

if [ "$i" -gt "$ATTEMPTS" ]; then
  echo "Smoke setup failed: server did not become healthy at $HEALTH_URL"
  exit 1
fi

tsx scripts/smoke-test.ts
