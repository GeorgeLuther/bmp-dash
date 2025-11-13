// src/shared/table/views/api.ts
import { supabase } from "@/supabase/client";
import type {
  TableView,
  TableViewState,
  CreateTableViewInput,
  UpdateTableViewInput,
} from "./types";

/** Helper: cast DB row's view_state (Json) into TableViewState */
function mapRow(row: any): TableView {
  return {
    ...row,
    view_state: (row.view_state ?? {}) as TableViewState,
  };
}

/** Get all saved views for this table (both global + user) */
export async function listViews(tableId: string): Promise<TableView[]> {
  const { data, error } = await supabase
    .from("user_table_views")
    .select("*")
    .eq("table_id", tableId)
    .order("is_global", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw error;
  const rows = data ?? [];
  return rows.map(mapRow);
}

/** Create a new view */
export async function createView(
  input: CreateTableViewInput
): Promise<TableView> {
  const { data, error } = await supabase
    .from("user_table_views")
    .insert({
      ...input,
      // DB column is Json; TS side is TableViewState
      view_state: input.view_state as any,
    })
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

/** Update an existing view */
export async function updateView(
  input: UpdateTableViewInput
): Promise<TableView> {
  const { id, view_state, ...rest } = input;

  const payload: Record<string, any> = { ...rest };
  if (view_state !== undefined) {
    payload.view_state = view_state as any;
  }

  const { data, error } = await supabase
    .from("user_table_views")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return mapRow(data);
}

/** Delete a view */
export async function deleteView(id: string): Promise<void> {
  const { error } = await supabase
    .from("user_table_views")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
