import { supabase } from "@/supabase/client";
import { ReleaseTableView } from "../types/releaseTableView.types";

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
