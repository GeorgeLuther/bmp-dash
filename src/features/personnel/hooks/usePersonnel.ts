// src/features/personnel/api/usePeopleList.ts
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import type { Person } from "../components/people-table/person.types";

// replace with your existing client import if you have one
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

/**
 * Reads rows for the Personnel table.
 * Assumes a view `v_all_personnel` that returns fields matching `Person`.
 */
export function usePersonnel() {
  const [rows, setRows] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("v_people_list")
      .select("*")
      .order("last_name", { ascending: true })
      .order("first_name", { ascending: true });
    if (error) setError(error);
    else setRows((data as Person[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

return { data: rows, isLoading: loading, error, load };
}
