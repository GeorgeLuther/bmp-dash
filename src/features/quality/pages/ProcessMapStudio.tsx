import { useMemo, useState } from "react";
import { Box, useTheme, Drawer } from "@mui/material";
import { GridOn, GridOff } from "@mui/icons-material";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ControlButton,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node as RFNode,
  type Edge as RFEdge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { DiagramConfigProvider } from "../contexts/DiagramConfigContext";
import { NODE_TYPES, BaseData } from "../components/shapeNodes";
import BottomSheet from "../components/BottomSheet";
import ShapeLibrary from "../components/ShapeLibrary";
export default function ProcessMapStudio() {
  const theme = useTheme();
  const colorMode = theme.palette.mode === "dark" ? "dark" : "light";

  const grid = 24;
  const halfGrid = grid / 2;
  const readOnly = false;

  type ShapeType = keyof typeof NODE_TYPES;
  type ShapeNode = RFNode<BaseData, ShapeType>;
  type ShapeEdge = RFEdge;
  const nodeTypes = useMemo(() => NODE_TYPES, []) satisfies NodeTypes;

  const initialNodes: ShapeNode[] = [
    {
      id: "n1",
      type: "action",
      position: { x: grid, y: grid },
      data: { label: "My Test" },
    },
    {
      id: "n2",
      type: "decision",
      position: { x: 10 * grid, y: 0 },
      data: { label: "Next" },
    },
  ];
  const initialEdges: ShapeEdge[] = [
    {
      id: "e1",
      source: "n1",
      target: "n2",
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ];

  const [nodes, , onNodesChange] = useNodesState<ShapeNode>(initialNodes); // <- use initialNodes
  const [edges, , onEdgesChange] = useEdgesState<ShapeEdge>(initialEdges); // <- use initialEdges);
  const [snap, setSnap] = useState(true);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const collapsedH = theme.spacing(5); // e.g., 40px if spacing=8
  const expandedH = "40vh";
  const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
  const DURATION_MS = 220;

  return (
    <Box
      sx={{
        position: "relative",
        height: "100%",
        minHeight: 0,
        flex: 1,
        bgcolor: "background.default",
        "--bar-h": libraryOpen ? expandedH : collapsedH,
      }}
    >
      <DiagramConfigProvider value={{ grid, readOnly }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          proOptions={{ hideAttribution: true }}
          colorMode={colorMode}
          snapToGrid={snap}
          snapGrid={[halfGrid, halfGrid]}
          nodeOrigin={[0, 0]}
          minZoom={0.1} // how far out you can zoom
          maxZoom={4}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={grid}
            size={snap ? 2 : 0.8}
          />
          <Controls
            position="bottom-right"
            style={{
              bottom: `calc(var(--bar-h) + ${theme.spacing(1.5)})`,
              transition: `bottom ${DURATION_MS}ms ${EASE}`,
              willChange: "bottom",
            }}
          >
            <ControlButton
              title={snap ? "Disable snap to grid" : "Enable snap to grid"}
              aria-pressed={snap}
              onClick={() => setSnap((s) => !s)}
            >
              {snap ? (
                <GridOn fontSize="small" />
              ) : (
                <GridOff fontSize="small" />
              )}
            </ControlButton>
          </Controls>
        </ReactFlow>
      </DiagramConfigProvider>

      <BottomSheet
        open={libraryOpen}
        onToggle={() => setLibraryOpen((v) => !v)}
        label="Shape Menu"
        expandedHeight={expandedH}
        collapsedHeight={collapsedH}
      >
        <ShapeLibrary />
      </BottomSheet>
    </Box>
  );
}
