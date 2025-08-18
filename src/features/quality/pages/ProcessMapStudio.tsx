import * as React from "react";
import { alpha, GlobalStyles, Fab, Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import { useTheme } from "@mui/material/styles";

import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import ShapeLibraryDrawer, {
  type ShapeItem,
} from "../components/ShapeLibraryDrawer";

export default function ProcessMapStudio() {
  const theme = useTheme();
  const bgDefault = theme.palette.background.default;
  const bgPaper = theme.palette.background.paper;
  const textPrimary = theme.palette.text.primary;
  const divider = theme.palette.divider;

  const [open, setOpen] = React.useState(false);

  // 👇 this is the container the drawer will render inside of
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const handleInsertShape = (shape: ShapeItem) => {
    console.log("Insert shape:", shape);
    setOpen(false);
  };

  const gridColor =
    theme.palette.mode === "dark"
      ? alpha(textPrimary, 0.06) // softer dots in dark
      : alpha(textPrimary, 0.12);

  return (
    <Box
      ref={contentRef}
      sx={{
        position: "relative",
        height: "100%",
        width: "100%",
        bgcolor: bgDefault,
      }}
    >
      <GlobalStyles
        styles={{
          ".bmp-flow .react-flow__controls": {
            border: `1px solid ${alpha(divider, 0.6)} !important`,
            backgroundColor: `${alpha(bgPaper, 0.92)} !important`,
            boxShadow: `${theme.shadows[2]} !important`,
            borderRadius: "8px !important",
            overflow: "hidden !important",
            backdropFilter: "blur(6px)",
          },
          ".bmp-flow .react-flow__controls .react-flow__controls-button": {
            color: `${textPrimary} !important`,
            backgroundColor: "transparent !important",
            borderTop: `1px solid ${alpha(divider, 0.6)} !important`,
          },
          ".bmp-flow .react-flow__controls .react-flow__controls-button:first-of-type":
            {
              borderTop: "none !important",
            },
          ".bmp-flow .react-flow__controls .react-flow__controls-button:hover":
            {
              backgroundColor: `${alpha(theme.palette.action.hover, 0.8)} !important`,
            },
          ".bmp-flow .react-flow__controls .react-flow__controls-button:disabled":
            {
              color: `${alpha(textPrimary, 0.4)} !important`,
            },
          ".bmp-flow .react-flow__controls .react-flow__controls-button svg": {
            fill: "currentColor !important",
            stroke: "currentColor !important",
          },
          ".bmp-flow .react-flow__background": {
            backgroundColor: "transparent !important",
          },
        }}
      />

      <ReactFlow className="bmp-flow" fitView>
        <Background gap={24} size={1} color={gridColor} />
        <Controls
          className="bmp-controls"
          position="bottom-left"
          showInteractive={false}
        />
      </ReactFlow>

      {/* Toggle for Shape Library */}
      <Tooltip title={open ? "Hide shape library" : "Show shape library"}>
        <Fab
          size="medium"
          color="primary"
          onClick={() => setOpen((s) => !s)}
          sx={{
            position: "absolute",
            right: 16,
            bottom: 16,
            zIndex: (t) => t.zIndex.modal + 1,
          }}
        >
          <AddBoxRoundedIcon />
        </Fab>
      </Tooltip>

      <ShapeLibraryDrawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onInsert={handleInsertShape}
        containerEl={contentRef.current} // 👈 scope to this box (no global modal conflicts)
      />
    </Box>
  );
}
