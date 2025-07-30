import { useEffect, useState } from "react";
import { ReleaseTableView } from "../types/releaseTableView.types";
import { saveReleaseTableView } from "../services/releaseViewService";
import { supabase } from "@/supabase/client";

export function useReleaseTableViews(userId: string | null) {
  const [views, setViews] = useState<ReleaseTableView[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    supabase
      .from("release_table_views")
      .select("*")
      .or(`is_shared.eq.true,user_id.eq.${userId}`)
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Failed to fetch views:", error);
        if (data) setViews(data);
        setLoading(false);
      });
  }, [userId]);

  const saveView = async (view: Partial<ReleaseTableView>) => {
    const saved = await saveReleaseTableView(view);
    if (saved) setViews((prev) => [...prev, saved]);
  };

  return { views, saveView, loading };
}
