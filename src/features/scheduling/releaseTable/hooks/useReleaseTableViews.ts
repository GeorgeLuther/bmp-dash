import { useEffect, useState } from "react";
import { ReleaseTableView } from "../types/releaseTableView.types";
import {
  getAllReleaseTableViews,
  saveReleaseTableView,
} from "../services/releaseViewService";

export function useReleaseTableViews(userId: string | null) {
  const [views, setViews] = useState<ReleaseTableView[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    getAllReleaseTableViews(userId)
      .then((data) => setViews(data ?? []))
      .finally(() => setLoading(false));
  }, [userId]);

  const saveView = async (view: Partial<ReleaseTableView>) => {
    const saved = await saveReleaseTableView(view);
    if (saved) setViews((prev) => [...prev, saved]);
  };

  return { views, saveView, loading };
}
