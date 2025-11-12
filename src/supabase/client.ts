// src/supabase/client.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db.types";

// Read env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Runtime guard for DX
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables. Check your .env file.");
}

// Create a typed client
// (TypeScript already knows these are 'string' now, not 'string | undefined')
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);