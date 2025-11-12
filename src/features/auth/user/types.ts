// src/features/auth/user/types.ts
import type { Tables } from "@/lib/db.types";



/** Row type of v_current_user_context as exposed by Supabase. */
export type CurrentUser = Tables<"v_current_user_context">;



/**
 * Lifecycle of the *context*, not the person’s employment status.
 */
export type UserCtxStatus = "loading" | "forbidden" | "ready";



export interface UserContextValue {
  /** Whether the context is still loading, ready, or forbidden by RLS. */
  ctxStatus: UserCtxStatus;

  /** The current user row from v_current_user_context, or null if forbidden/missing. */
  user: CurrentUser | null;

  /** Error message when fetch fails (network, unexpected error). */
  error: string | null;

  /** Force a refetch of the current user context. */
  refresh: () => Promise<void>;
}
