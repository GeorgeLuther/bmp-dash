#!/bin/bash
# Runs login (if needed), dumps the latest schema, and generates frontend types.
# This is a MINIMAL sync (schema only, no data).

SUPABASE_CREDS_PATH="$HOME/.supabase/config.json"

# Check if the Supabase config file exists globally. If it doesn't, run login.
if [ ! -f "$SUPABASE_CREDS_PATH" ]; then
    echo "Supabase session token not found. Running login..."
    npx supabase login
else
    echo "Supabase session token found. Skipping login."
fi

# Core logic:
# 1. Dump schema (public.sql)
# 2. Generate types from the local dump and redirect to src/supabase/db.types.ts
npx supabase@latest db dump --schema public -f supabase/schema/public.sql && \
npx supabase@latest gen types typescript --local -f supabase/schema/public.sql > src/supabase/db.types.ts