// ProcessMaps.tsx (main flow)
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { defaultNodes, defaultEdges } from "./initial-elements";
import ShapeNodeComponent, {
  type ShapeFlowNode,
} from "./components/shape-node";
import {
  shapeMap,
  type ShapeType,
  getShapeById,
} from "./components/shape/types";
import ShapeMenu from "./components/shape-menu";
import MiniMapNode from "./components/minimap-node";
import "./index.css";

const nodeTypes: NodeTypes = { shape: ShapeNodeComponent };

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
};

const snapGrid: SnapGrid = [10, 10];

function ShapesFlow() {
  const theme = useTheme();
  const colorMode = theme.palette.mode === "dark" ? "dark" : "light";

  // If you want strict typing, you can parametrize useReactFlow with your node type.
  // Edges can be left inferred unless you have a custom edge data type.
  const { screenToFlowPosition, setNodes } = useReactFlow<ShapeFlowNode>();

  const onDragOver = useCallback((evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (evt: DragEvent<HTMLDivElement>) => {
      evt.preventDefault();

      // type id dragged from the shape menu
      const type = evt.dataTransfer.getData("application/reactflow") as
        | ShapeType
        | "";
      if (!type) return;

      const meta = getShapeById(type)?.meta;
      const aspect = meta?.aspectRatio ?? 2; // width / height

      // where in the flow canvas to place it
      const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

      // pick a nice default size; derive height from aspect
      const w = 140;
      const h = Math.round(w / aspect);

      const node: ShapeFlowNode = {
        id: crypto?.randomUUID?.() ?? String(Date.now()),
        type: "shape",
        position,
        data: {
          type,
          color: meta?.defaultColor ?? "#111",
        },
        // let RF own box size from the start (better with resizer, fitView, etc.)
        initialWidth: w,
        initialHeight: h,
        selected: true,
      };

      // one pass: clear old selection, then add the new node selected
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
      {toggleGrid && <Background />}

      <Panel position="bottom-left">
        <Paper elevation={3} sx={{ m: 1, p: 1 }}>
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

      <MiniMap zoomable draggable nodeComponent={MiniMapNode} />
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
