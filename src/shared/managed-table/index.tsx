// src/shared/table/index.tsx

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
} from "material-react-table";

export type DataTableProps<TData extends MRT_RowData> = {
  /** Stable ID for this table type (e.g. "personnel", "releases") */
  tableId: string;

  /** MRT column definitions for this table */
  columns: MRT_ColumnDef<TData>[];

  /** Row data */
  data: TData[];

  /** Loading flag from your data hook */
  isLoading?: boolean;

  /** Optional: initial MRT state (we’ll expand this later) */
  initialState?: Partial<
    ReturnType<typeof useMaterialReactTable>["initialState"]
  >;
};

/**
 * Shared MRT wrapper.
 * For now: just a basic, nice-by-default table.
 * Later: we’ll bolt on saved views, detail pane, bulk actions, etc.
 */
export function DataTable<TData extends MRT_RowData>({
  tableId, // eslint-disable-line @typescript-eslint/no-unused-vars
  columns,
  data,
  isLoading = false,
  initialState,
}: DataTableProps<TData>) {
  const table = useMaterialReactTable<TData>({
    columns,
    data,
    state: { isLoading },
    initialState,
    enableColumnOrdering: true,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: true,
    enableHiding: true,
    enableGrouping: true,
    enableRowSelection: true,
  });

  return <MaterialReactTable table={table} />;
}

// Aliases so you can do `import Table from "@/shared/table";`
export const Table = DataTable;
export default DataTable;
