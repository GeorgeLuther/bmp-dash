// src/features/scheduling/releaseTable/types/releaseTableView.types.ts

import type {
  MRT_TableInstance,
  MRT_SortingState,
  MRT_ColumnFiltersState,
  MRT_RowData,
  MRT_TableState,
} from 'material-react-table';

export type ViewState = {
  columnFilters?: MRT_ColumnFiltersState;
  sorting?: MRT_SortingState;
  columnVisibility?: Record<string, boolean>;
  columnOrder?: string[];
  grouping?: string[];
};

// 👇 THIS WAS THE PROBLEM. It was empty.
// I've repopulated it based on your SQL schema.
export interface ReleaseTableView {
  id: string;
  user_id: string | null;
  name: string;
  description?: string | null;
  is_default?: boolean | null;
  view_state: ViewState | null; // <-- This is the property you're accessing
  created_at?: string | null;
  updated_at?: string | null;
  is_shared?: boolean | null;
  shared_with_roles?: string[] | null;
}

/**
 * Safer: read from the full table state and return a JSON-safe slice.
 */
export function serializeTableState(
  s: Partial<MRT_TableState<any>>,
): ViewState {
  // No need to cast 's' as 'any' anymore
  return {
    columnFilters: s?.columnFilters ?? [],
    sorting: s?.sorting ?? [],
    columnVisibility: s?.columnVisibility ?? {},
    columnOrder: s?.columnOrder ?? [],
    grouping: s?.grouping ?? [],
  };
}

/**
 * Apply a saved view via MRT setters.
 * (This function is still correct, as it needs the table instance setters)
 */
export function applyViewState<T extends MRT_RowData>(
  table: MRT_TableInstance<T>,
  v?: ViewState, // This 'v' is the ViewState object itself, not the whole ReleaseTableView
) {
  if (!v) return;
  if (v.columnFilters) table.setColumnFilters(v.columnFilters);
  if (v.sorting) table.setSorting(v.sorting);
  if (v.columnVisibility) table.setColumnVisibility(v.columnVisibility);
  if (v.columnOrder) table.setColumnOrder(v.columnOrder);
  if (v.grouping) table.setGrouping(v.grouping);
}