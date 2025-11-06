// Minimal, serializable MRT view state
export type TableViewState = {
  density?: string;
  sorting?: any[];
  grouping?: string[];

  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  columnFilters?: any[];

  columnPinning?: { left?: string[]; right?: string[] };
  rowPinning?: { top?: string[]; bottom?: string[] };

  columnSizing?: Record<string, number>;
  columnSizingInfo?: Record<string, unknown>;

  pagination?: { pageSize?: number };

  globalFilterFn?: string;
  columnFilterFns?: Record<string, string>;
};

export type UserTableView = {
  id: string;
  table_id: string;
  name: string;
  description: string | null;
  created_by: string;
  is_global: boolean;
  is_locked: boolean;
  view_state: TableViewState;
  created_at: string;
  updated_at: string;
};
