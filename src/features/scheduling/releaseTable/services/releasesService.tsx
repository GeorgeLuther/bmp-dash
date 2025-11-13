// src/services/releasesService.ts
import { supabase } from "@/supabase/client"; // ← adjust path as needed
import { Tables } from "@/supabase/db.types"; // ← adjust path as needed

export type Release = Tables<"releases">;

export async function fetchAllReleases(): Promise<Release[]> {
  const { data, error } = await supabase.from("releases").select("*"); // grabs all columns

  if (error) {
    console.error("[Supabase] fetchAllReleases:", error);
    throw new Error(error.message);
  }
  console.log(`[fetchReleases] got ${data?.length ?? 0} rows`);
  return data ?? []; // never return null
}
