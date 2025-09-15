import { DragEvent, DragEventHandler, useState } from "react";

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
  NodeTypes,
  DefaultEdgeOptions,
  Controls,
  ControlButton,
  useReactFlow,
  MiniMap,
  SnapGrid,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { defaultNodes, defaultEdges } from "./initial-elements";
import ShapeNodeComponent from "./components/shape-node";
import { ShapeNode, ShapeType } from "./components/shape/types";
import { getDefaultColor } from "./components/shape/types/utils";

import ShapeMenu from "./components/shape-menu";
import MiniMapNode from "./components/minimap-node";

import "./index.css";
import { PageContainer } from "@toolpad/core";

const nodeTypes: NodeTypes = {
  shape: ShapeNodeComponent,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
};

const snapGrid: SnapGrid = [10, 10];

function ShapesFlow() {
  const [toggleGrid, setToggleGrid] = useState(true);
  const colorMode = useTheme().palette.mode === "dark" ? "dark" : "light";
  const { screenToFlowPosition, setNodes } = useReactFlow<ShapeNode>();

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

  // this function is called when a node from the sidebar is dropped onto the react flow pane
  const onDrop: DragEventHandler = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    const type = evt.dataTransfer.getData("application/reactflow") as ShapeType;

    // this will convert the pixel position of the node to the react flow coordinate system
    // so that a node is added at the correct position even when viewport is translated and/or zoomed in
    const position = screenToFlowPosition({ x: evt.clientX, y: evt.clientY });

    const newNode: ShapeNode = {
      id: Date.now().toString(),
      type: "shape",
      position,
      style: { width: 140, height: 100 },
      data: {
        type,
        color: getDefaultColor(type),
      },
      selected: true,
    };

    setNodes((nodes) =>
      (nodes.map((n) => ({ ...n, selected: false })) as ShapeNode[]).concat([
        newNode,
      ])
    );
  };

  return (
    <ReactFlow
      proOptions={{ hideAttribution: true }}
      fitView
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
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {toggleGrid && <Background />}
      <Panel position="bottom-left">
        <Paper elevation={3} sx={{ m: 1, padding: 1 }}>
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

function ProcessMapsWrapper() {
  return (
    <ReactFlowProvider>
      <ShapesFlow />
    </ReactFlowProvider>
  );
}

export default ProcessMapsWrapper;
