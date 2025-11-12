// src/shared/table/views/types.ts

import type {
  MRT_ColumnFiltersState,
  MRT_SortingState,
  MRT_ColumnOrderState,
  MRT_GroupingState,
  MRT_ColumnSizingState,
  MRT_ColumnSizingInfoState,
  MRT_DensityState,
  MRT_PaginationState,
} from 'material-react-table';

import type {
  VisibilityState,     // from TanStack
  ColumnPinningState,
  RowPinningState,
} from '@tanstack/react-table';

/** Serializable slice of MRT state we persist in user_table_views.view_state */
export type TableViewState = {
  // Display
  density?: MRT_DensityState;

  // Sorting / grouping
  sorting?: MRT_SortingState;
  grouping?: MRT_GroupingState;

  // Columns
  columnOrder?: MRT_ColumnOrderState;
  columnVisibility?: VisibilityState;
  columnPinning?: ColumnPinningState;
  columnSizing?: MRT_ColumnSizingState;
  columnSizingInfo?: MRT_ColumnSizingInfoState;

  // Rows
  rowPinning?: RowPinningState;

  // Filters
  columnFilters?: MRT_ColumnFiltersState;
  showColumnFilters?: boolean;
  globalFilter?: string; // MRT uses a plain string
  showGlobalFilter?: boolean;

  // Pagination (only page size matters)
  pagination?: Pick<MRT_PaginationState, 'pageSize'>;
};

/** Row shape in public.user_table_views */
export type TableView = {
  id: string;
  table_id: string;
  name: string;
  description: string | null;
  created_by: string; // auth.users.id
  is_global: boolean;
  is_locked: boolean;
  view_state: TableViewState;
  created_at: string;
  updated_at: string;
};

/** Client payloads for CRUD */
export type CreateTableViewInput = {
  table_id: string;
  name: string;
  description?: string | null;
  view_state: TableViewState;
  is_global?: boolean;
  is_locked?: boolean;
};

export type UpdateTableViewInput = {
  id: string;
  name?: string;
  description?: string | null;
  view_state?: TableViewState;
  is_locked?: boolean; // honored for admins only
};
