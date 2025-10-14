// process-maps/index.tsx
import { useCallback, type DragEvent, useState } from "react";
import { Paper, useTheme } from "@mui/material";
import { GridOn, GridOff } from "@mui/icons-material";
import {
  ReactFlow,
  Background,
  ReactFlowProvider,
  ConnectionLineType,
  MarkerType,
  ConnectionMode,
  Panel,
  type NodeTypes,
  type DefaultEdgeOptions,
  Controls,
  ControlButton,
  useReactFlow,
  MiniMap,
  type SnapGrid,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { defaultNodes, defaultEdges } from "./initial-elements";
import ShapeNodeComponent, {
  type ShapeFlowNode,
} from "./components/shape-node";
import { type ShapeType, getShapeById } from "./components/shape/types";
import ShapeMenu from "./components/shape-menu";
import MiniMapNode from "./components/minimap-node";
import "./index.css";

// ---- single grid unit in pixels (dots + snap + default node size) ----
const GRID_PX = 24;

const nodeTypes: NodeTypes = { shape: ShapeNodeComponent };

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "bezier",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
};

const snapGrid: SnapGrid = [GRID_PX / 2, GRID_PX / 2];

function ShapesFlow() {
  const theme = useTheme();
  const colorMode = theme.palette.mode === "dark" ? "dark" : "light";

  const { screenToFlowPosition, setNodes } = useReactFlow<ShapeFlowNode>();

  const onDragOver = useCallback((evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (evt: DragEvent<HTMLDivElement>) => {
      evt.preventDefault();

      const type = evt.dataTransfer.getData("application/reactflow") as
        | ShapeType
        | "";
      if (!type) return;

      const meta = getShapeById(type)?.meta;
      const cols = meta?.gridAspect?.cols ?? 7;
      const rows = meta?.gridAspect?.rows ?? 5;

      const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

      // Default size in grid units so it aligns with dots & snapping
      const w = cols * GRID_PX;
      const h = rows * GRID_PX;

      const node: ShapeFlowNode = {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        type: "shape",
        position,
        data: {
          type, // fill/stroke/opacity can be omitted -> ShapeNode falls back to registry defaults
        },
        initialWidth: w,
        initialHeight: h,
        selected: true,
      };

      setNodes((prev) =>
        prev
          .map((n) => (n.selected ? { ...n, selected: false } : n))
          .concat(node)
      );
    },
    [screenToFlowPosition, setNodes]
  );

  const [toggleGrid, setToggleGrid] = useState(true);

  return (
    <ReactFlow
      proOptions={{ hideAttribution: true }}
      colorMode={colorMode}
      minZoom={0.1}
      maxZoom={4}
      snapGrid={snapGrid}
      snapToGrid={toggleGrid}
      defaultNodes={defaultNodes}
      defaultEdges={defaultEdges}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionMode={ConnectionMode.Loose}
      deleteKeyCode={["Backspace", "Delete"]}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {toggleGrid && (
        <Background variant={BackgroundVariant.Dots} gap={GRID_PX} size={1.5} />
      )}

      <Panel position="bottom-left">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            p: 1,
            width: { xs: 260, sm: 300, md: 340 },
            maxWidth: "92vw",
            maxHeight: { xs: "60vh", sm: "70vh" },
            overflow: "auto",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <ShapeMenu />
        </Paper>
      </Panel>

      <Controls position="top-right">
        <ControlButton
          title={toggleGrid ? "Disable snap to grid" : "Enable snap to grid"}
          aria-pressed={toggleGrid}
          onClick={() => setToggleGrid((s) => !s)}
        >
          {toggleGrid ? (
            <GridOn fontSize="small" />
          ) : (
            <GridOff fontSize="small" />
          )}
        </ControlButton>
      </Controls>

      <MiniMap
        nodeComponent={MiniMapNode}
        // these get the full node, so we can look at node.data.type
        nodeColor={(n) =>
          getShapeById((n.data as any)?.type)?.meta.defaultFill ?? "#9e9e9e"
        }
        nodeStrokeColor={(n) =>
          getShapeById((n.data as any)?.type)?.meta.defaultStroke ?? "#616161"
        }
        nodeStrokeWidth={1}
        pannable
        zoomable
        style={{
          borderRadius: 8,
          boxShadow: theme.shadows[4],
          background: theme.palette.mode === "dark" ? "#111" : "#fafafa",
        }}
        maskColor={
          theme.palette.mode === "dark"
            ? "rgba(0,0,0,0.6)"
            : "rgba(255,255,255,0.6)"
        }
      />
    </ReactFlow>
  );
}

export default function ProcessMapsWrapper() {
  return (
    <ReactFlowProvider>
      <ShapesFlow />
    </ReactFlowProvider>
  );
}
