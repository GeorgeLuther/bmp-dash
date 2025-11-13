// src/features/scheduling/releaseTable/services/releaseViewService.tsx
import { supabase } from "@/supabase/client";
import type { TablesInsert } from "@/lib/db.types";

type ReleaseTableView = TablesInsert<"release_table_views">;

export type ReleaseTableViewInsert = Pick<
  ReleaseTableView,
  "user_id" | "name" | "description" | "view_state"
>;

// Save a new table view
export async function saveReleaseTableView(payload: ReleaseTableViewInsert) {
  const { data, error } = await supabase
    .from("release_table_views")
    .insert(payload) // now matches the expected type
    .select()
    .single();

  if (error) {
    console.error("Error saving table view:", error);
    return null;
  }

  return data;
}

// Fetch all views for a user including shared views
export async function getAllReleaseTableViews(userId: string) {
  const { data, error } = await supabase
    .from("release_table_views")
    .select("*")
    .or(`is_shared.eq.true,user_id.eq.${userId}`)
    .order("name");

  if (error) {
    console.error("Error fetching views:", error);
    return [];
  }

  return data;
}

// Fetch one view by ID or Name
export async function getReleaseTableViewByIdOrName(idOrName: string) {
  const { data, error } = await supabase
    .from("release_table_views")
    .select("*")
    .or(`id.eq.${idOrName},name.eq.${idOrName}`)
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching view:", error);
    return null;
  }

  return data;
}
