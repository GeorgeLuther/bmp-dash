// src/features/personnel/hooks/usePersonnel.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import type { Person } from "../components/table/person.types";

export function usePersonnel() {
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("v_all_personnel")
      .select("*")
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true });

    if (error) setError(error);
    else setData((data ?? []) as Person[]);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { data, isLoading, error, refresh: load };
}
