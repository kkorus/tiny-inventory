#!/usr/bin/env bash
# Truncates all tables and resets sequences so a seed can run from scratch.
# Usage (from repo root): ./scripts/truncate-all.sh
set -euo pipefail

POSTGRES_USER="${POSTGRES_USER:-tiny}"
POSTGRES_DB="${POSTGRES_DB:-tiny_inventory}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -f /dev/stdin < "$SCRIPT_DIR/truncate-all.sql"

echo "All tables truncated."
