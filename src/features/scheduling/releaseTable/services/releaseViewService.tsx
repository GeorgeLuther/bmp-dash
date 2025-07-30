import { supabase } from "@/supabase/client";
import { ReleaseTableView } from "../types/releaseTableView.types";

// Save a new table view
export async function saveReleaseTableView(view: Partial<ReleaseTableView>) {
  const { data, error } = await supabase
    .from("release_table_views")
    .insert(view)
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
