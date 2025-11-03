// src/features/scheduling/releaseTable/components/table/ReleasesTable.tsx
import { useMemo, useState, useEffect, useRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
} from "material-react-table";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ViewListIcon from "@mui/icons-material/ViewList";

import { Release } from "../../types/Release.types";
import { releaseColumns } from "./ReleaseTable.columns";
import { useReleases } from "../../hooks/useReleases";
import ReleaseDetailDrawer from "../ReleaseDetailDrawer";
import ReleaseSaveViewDialog from "../ReleaseSaveViewDialog";
import useReleaseTableViews from "../../hooks/useReleaseTableViews";
import { useSession } from "@/features/auth/session/useSession";

import {
  type ViewState,
  serializeTableState,
} from "../../types/releaseTableView.types";

interface ReleasesTableProps {
  defaultView?: string;
}

const ReleasesTable = ({ defaultView }: ReleasesTableProps) => {
  const { data: releaseData = [], isLoading: isReleasesLoading } =
    useReleases();
  const [localData, setLocalData] = useState<Release[]>([]);
  const columns = useMemo(() => releaseColumns, []);

  const { status: authStatus, session } = useSession();
  const userId = session?.userId ?? null;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Release | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const {
    views: savedViews = [],
    loading: isViewsLoading,
    saveView,
  } = useReleaseTableViews(userId);

  const viewApplied = useRef(false);

  // Controlled MRT state
  const [tableState, setTableState] = useState<ViewState>({
    columnFilters: [],
    sorting: [],
    columnVisibility: {},
    columnOrder: [],
    grouping: [],
  });

  useEffect(() => {
    setLocalData(releaseData);
    if (!defaultView || !savedViews.length || viewApplied.current) return;
    const v = savedViews.find(
      (x) => x.id === defaultView || x.name === defaultView
    );
    if (v?.view_state) {
      setTableState((prev) => ({ ...prev, ...v.view_state }));
      viewApplied.current = true;
    }
  }, [defaultView, savedViews, releaseData]);

  const table = useMaterialReactTable<Release>({
    columns,
    data: localData,
    enableRowActions: true,
    enableGrouping: true,
    enableColumnOrdering: true,
    positionActionsColumn: "first",

    // Controlled pattern per MRT docs
    state: {
      ...tableState,
      isLoading:
        isReleasesLoading || isViewsLoading || authStatus === "loading",
    },
    onColumnFiltersChange: (updater) =>
      setTableState((prev) => ({
        ...prev,
        columnFilters:
          typeof updater === "function"
            ? updater(prev.columnFilters ?? [])
            : updater,
      })),
    onSortingChange: (updater) =>
      setTableState((prev) => ({
        ...prev,
        sorting:
          typeof updater === "function" ? updater(prev.sorting ?? []) : updater,
      })),
    onColumnVisibilityChange: (updater) =>
      setTableState((prev) => ({
        ...prev,
        columnVisibility:
          typeof updater === "function"
            ? updater(prev.columnVisibility ?? {})
            : updater,
      })),
    onColumnOrderChange: (updater) =>
      setTableState((prev) => ({
        ...prev,
        columnOrder:
          typeof updater === "function"
            ? updater(prev.columnOrder ?? [])
            : updater,
      })),
    onGroupingChange: (updater) =>
      setTableState((prev) => ({
        ...prev,
        grouping:
          typeof updater === "function"
            ? updater(prev.grouping ?? [])
            : updater,
      })),

    autoResetPageIndex: false,
    enableRowOrdering: true,
    enableSorting: true,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          localData.splice(
            (hoveredRow as MRT_Row<Release>).index,
            0,
            localData.splice(draggingRow.index, 1)[0]
          );
          setLocalData([...localData]);
        }
      },
    }),
    renderRowActions: ({ row }) => (
      <IconButton
        onClick={() => {
          setSelectedRow(row.original);
          setDrawerOpen(true);
        }}
      >
        <EditIcon />
      </IconButton>
    ),
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip title="View Presets">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <ViewListIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Save Current View">
          <IconButton onClick={() => setSaveDialogOpen(true)}>
            <SaveIcon />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {isViewsLoading ? (
            <MenuItem disabled>Loading…</MenuItem>
          ) : savedViews.length === 0 ? (
            <MenuItem disabled>No saved views</MenuItem>
          ) : (
            savedViews.map((v) => (
              <MenuItem
                key={v.id}
                onClick={() => {
                  if (v.view_state)
                    setTableState((prev) => ({ ...prev, ...v.view_state }));
                  setAnchorEl(null);
                }}
              >
                {v.name}
              </MenuItem>
            ))
          )}
        </Menu>

        <ReleaseSaveViewDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          // Save the controlled slice, not table.getState()
          tableState={serializeTableState(tableState)}
          onSave={saveView}
        />
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <ReleaseDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rowData={selectedRow}
      />
    </>
  );
};

export default ReleasesTable;
