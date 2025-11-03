// src/features/auth/user/api.ts
import { supabase } from "@/supabase/client";
import type { CurrentUser } from "./types";

/**
 * Returns:
 *  - CurrentUser when found
 *  - null when no row (RLS/no profile)
 *  - throws on real errors
 */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const { data, error, status } = await supabase
    .from("v_current_user_context")
    .select("*")
    .single();

  // PostgREST “no rows” can surface as 406 or as an error with code PGRST116.
  const noRows =
    status === 406 || (error && (error as any).code === "PGRST116");

  if (noRows) return null;
  if (error) throw error;

  return data as unknown as CurrentUser;
}
