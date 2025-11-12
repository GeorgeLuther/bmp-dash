// src/shared/table/views/api.ts
import { supabase } from '@/supabase/client';
import type {
  TableView,
  CreateTableViewInput,
  UpdateTableViewInput,
} from './types';

/** Get all saved views for this table (both global + user) */
export async function listViews(tableId: string): Promise<TableView[]> {
  const { data, error } = await supabase
    .from('user_table_views')
    .select('*')
    .eq('table_id', tableId)
    .order('is_global', { ascending: false })
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as TableView[];
}

/** Create a new view */
export async function createView(input: CreateTableViewInput): Promise<TableView> {
  const { data, error } = await supabase
    .from('user_table_views')
    .insert(input)
    .select('*')
    .single();

  if (error) throw error;
  return data as TableView;
}

/** Update an existing view */
export async function updateView(input: UpdateTableViewInput): Promise<TableView> {
  const { id, ...rest } = input;
  const { data, error } = await supabase
    .from('user_table_views')
    .update(rest)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data as TableView;
}

/** Delete a view */
export async function deleteView(id: string): Promise<void> {
  const { error } = await supabase.from('user_table_views').delete().eq('id', id);
  if (error) throw error;
}
