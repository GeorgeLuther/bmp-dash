// src/shared/table/views/utils.ts

import type { MRT_TableInstance, MRT_RowData } from 'material-react-table';
import type { TableViewState } from './types';

/** Pick only the parts we persist to Supabase */
export function captureState(state: any): TableViewState {
  return {
    density: state.density,

    sorting: state.sorting,
    grouping: state.grouping,

    columnOrder: state.columnOrder,
    columnVisibility: state.columnVisibility,
    columnPinning: state.columnPinning,
    columnSizing: state.columnSizing,
    columnSizingInfo: state.columnSizingInfo,

    rowPinning: state.rowPinning,

    columnFilters: state.columnFilters,
    showColumnFilters: state.showColumnFilters,
    globalFilter: state.globalFilter ?? '',
    showGlobalFilter: state.showGlobalFilter ?? false,

    pagination: state.pagination
      ? { pageSize: state.pagination.pageSize }
      : undefined,
  };
}

/** Apply a saved slice back onto a live table instance */
export function applyState<TData extends MRT_RowData>(
  table: MRT_TableInstance<TData>,
  view: TableViewState,
): void {
  if (view.density !== undefined) table.setDensity(view.density);

  if (view.sorting) table.setSorting(view.sorting);
  if (view.grouping) table.setGrouping(view.grouping);

  if (view.columnOrder) table.setColumnOrder(view.columnOrder);
  if (view.columnVisibility) table.setColumnVisibility(view.columnVisibility);
  if (view.columnPinning) table.setColumnPinning(view.columnPinning);
  if (view.columnSizing) table.setColumnSizing(view.columnSizing);
  if (view.columnSizingInfo) table.setColumnSizingInfo(view.columnSizingInfo);

  if (view.rowPinning) table.setRowPinning(view.rowPinning);

  if (view.columnFilters) table.setColumnFilters(view.columnFilters);
  if (view.showColumnFilters !== undefined)
    table.setShowColumnFilters(view.showColumnFilters);

  if (view.globalFilter !== undefined)
    (table as any).setGlobalFilter(view.globalFilter);
  if (view.showGlobalFilter !== undefined)
    (table as any).setShowGlobalFilter(view.showGlobalFilter);

  if (view.pagination?.pageSize) table.setPageSize(view.pagination.pageSize);
}
