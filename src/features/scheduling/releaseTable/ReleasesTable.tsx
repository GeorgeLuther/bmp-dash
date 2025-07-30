import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_TableState,
} from "material-react-table";

import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import {
  Edit,
  Save as SaveIcon,
  ViewList as ViewListIcon,
} from "@mui/icons-material";

import { Release } from "./types/Release.types";
import { releaseColumns } from "./components/table/ReleaseTable.columns";
import { useReleases } from "@/features/scheduling/releaseTable/hooks/getAllReleases";
import ReleaseDrawer from "./components/ReleaseDrawer";
import ReleaseSaveViewDialog from "./components/ReleaseSaveViewDialog";
import { useReleaseTableViews } from "./hooks/useReleaseTableViews";
import { usePersonnel } from "@/contexts/PersonnelContext";

interface ReleasesTableProps {
  defaultView?: string;
}

const ReleasesTable = ({ defaultView }: ReleasesTableProps) => {
  const { data: releaseData = [], isLoading: isReleasesLoading } =
    useReleases();
  const { personnel } = usePersonnel();
  const personnelId = personnel?.id ?? null;

  const {
    views: savedViews = [],
    loading: isViewsLoading,
    saveView,
  } = useReleaseTableViews(personnelId);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Release | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const viewApplied = useRef(false);
  const [tableState, setTableState] = useState<
    Partial<MRT_TableState<Release>>
  >({});

  const columns = useMemo(() => releaseColumns, []);

  // Load default view once on mount
  useEffect(() => {
    console.log("defaultView:", defaultView);
    console.log("savedViews:", savedViews);
    if (!defaultView || !savedViews.length || viewApplied.current) return;
    const view = savedViews.find(
      (v) => v.id === defaultView || v.name === defaultView
    );
    if (view?.view_state) {
      setTableState(view.view_state);
      viewApplied.current = true;
    }
  }, [defaultView, savedViews]);

  const table = useMaterialReactTable<Release>({
    columns,
    data: releaseData,
    enableRowActions: true,
    enableGrouping: true,
    enableColumnOrdering: true,
    positionActionsColumn: "first",
    state: {
      ...tableState,
      isLoading: isReleasesLoading || isViewsLoading,
    },
    renderRowActions: ({ row }) => (
      <IconButton
        onClick={() => {
          setSelectedRow(row.original);
          setDrawerOpen(true);
        }}
      >
        <Edit />
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
            savedViews.map((view) => (
              <MenuItem
                key={view.id}
                onClick={() => {
                  setTableState(view.view_state);
                  setAnchorEl(null);
                }}
              >
                {view.name}
              </MenuItem>
            ))
          )}
        </Menu>

        <ReleaseSaveViewDialog
          open={saveDialogOpen}
          onClose={() => setSaveDialogOpen(false)}
          tableState={table.getState()}
          onSave={saveView}
        />
      </Box>
    ),
  });

  return (
    <>
      <MaterialReactTable table={table} />
      <ReleaseDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rowData={selectedRow}
      />
    </>
  );
};

export default ReleasesTable;
