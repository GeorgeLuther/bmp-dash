//src/features/scheduling/releaseTable/hooks/useReleases.ts
import { useState, useEffect } from "react";
import { fetchAllReleases } from "../services/releasesService";

export function useReleases() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAllReleases()
      .then((rows) => setData(rows))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { data, isLoading, error };
}
