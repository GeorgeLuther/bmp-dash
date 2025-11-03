// src/features/personnel/hooks/usePersonnel.ts
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

export interface Person {
  id: string;

  // names
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  display_name: string; // computed in view

  // employment (current)
  status_label: string | null;
  is_employed: boolean | null;
  is_active: boolean | null;
  first_hired_at: string | null;
  latest_hired_at: string | null;
  end_at: string | null;

  // email
  primary_email_address: string | null;
  primary_email_type: string | null;

  // org aggregates
  roles: {
    role_id: string;
    role_label: string;
    involvement_label: string | null;
    proficiency_label: string | null;
    assigned_since: string | null;
  }[];
  departments: { department_id: string; department_label: string }[];

  // meta
  record_created_at: string | null;
}

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
