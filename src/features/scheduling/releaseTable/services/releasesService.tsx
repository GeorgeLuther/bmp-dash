// src/services/releasesService.ts
import { supabase } from "@/supabase/client"; // ← adjust path as needed
import type { Release } from "../types/Release.types";

export async function fetchAllReleases(): Promise<Release[]> {
  const { data, error } = await supabase.from("releases").select("*"); // grabs all columns

  if (error) {
    console.error("[Supabase] fetchAllReleases:", error);
    throw new Error(error.message);
  }
  console.log(`[fetchReleases] got ${data?.length ?? 0} rows`);
  return data ?? []; // never return null
}
