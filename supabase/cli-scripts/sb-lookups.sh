#!/bin/bash
# Runs login (if needed) and dumps data from non-sensitive lookup tables.
# This output is useful for sharing with AI or for local data conversion.

SUPABASE_CREDS_PATH="$HOME/.supabase/config.json"

# Check if the Supabase config file exists globally. If it doesn't, run login.
if [ ! -f "$SUPABASE_CREDS_PATH" ]; then
    echo "Supabase session token not found. Running login..."
    npx supabase login
else
    echo "Supabase session token found. Skipping login."
fi

# Core logic: Dump DATA from specific lookup tables
npx supabase@latest db dump --data-only --schema public \
  --table document_criticality \
  --table resource_formats \
  --table employment_statuses \
  --table roles \
  --table role_involvements \
  --table role_proficiencies \
  --table role_event_types \
  --table departments_roles \
  --table departments \
  --table departments_subdepartments \
  --table subdepartments \
  --table subdepartments_roles \
  -f supabase/schema/lookup_records_data.sql

echo "Static lookup data dumped to supabase/schema/lookup_records_data.sql"