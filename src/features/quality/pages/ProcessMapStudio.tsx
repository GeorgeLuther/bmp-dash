import { useMemo, useState, useCallback, useRef } from "react";
import { Box, useTheme } from "@mui/material";
import { GridOn, GridOff } from "@mui/icons-material";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ControlButton,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionMode,
  ConnectionLineType,
  MarkerType,
  ReactFlowInstance,
  type Node as RFNode,
  type Edge as RFEdge,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toTitle } from "../utils/strings";

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
  const nodeTypes: NodeTypes = useMemo(() => NODE_TYPES, []);

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

  const [nodes, setNodes, onNodesChange] =
    useNodesState<ShapeNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<ShapeEdge>(initialEdges);
  const [snap, setSnap] = useState(true);

  const [libraryOpen, setLibraryOpen] = useState(false);
  const collapsedH = theme.spacing(5);
  const expandedH = "auto";
  const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
  const DURATION_MS = 220;

  // SIMPLE: non-generic instance ref (like the old demo)
  // was: const rfRef = useRef<ReactFlowInstance | null>(null);
  const rfRef = useRef<ReactFlowInstance<ShapeNode, ShapeEdge> | null>(null);
  const idRef = useRef(initialNodes.length + 1);

  const addNodeAt = useCallback(
    (type: ShapeType, client?: { x: number; y: number }) => {
      const id = `n${idRef.current++}`;
      const screenPt = client ?? {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      const position = rfRef.current
        ? rfRef.current.screenToFlowPosition(screenPt)
        : { x: 0, y: 0 }; // fallback only before init

      setNodes((nds) =>
        nds.concat({
          id,
          type,
          position, // (keep as-is; snapping on move is handled by RF)
          data: { label: toTitle(type) },
        } as ShapeNode)
      );
    },
    [setNodes]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("application/reactflow") as
        | ShapeType
        | "";
      if (!type) return;
      addNodeAt(type, { x: e.clientX, y: e.clientY });
    },
    [addNodeAt]
  );

  // Default look for any *new* edge
  const defaultEdgeOptions: Partial<RFEdge> = {
    // choose or omit; strings are fine for actual edge types
    type: "bezier",
    style: { strokeWidth: 2.5 }, // ← thicker line
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 18, // ← bigger arrowhead
      height: 18,
    },
  };

  const onConnect = useCallback(
    (conn: Connection) => {
      // basic guard: no self-loops, require endpoints
      if (!conn.source || !conn.target || conn.source === conn.target) return;
      setEdges((eds) => addEdge({ ...defaultEdgeOptions, ...conn }, eds));
    },
    [setEdges]
  );

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
          // NOTE: no generic <Node, Edge> parameters here — keeps instance typing simple
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          defaultEdgeOptions={defaultEdgeOptions}
          deleteKeyCode={["Backspace", "Delete"]}
          onConnect={onConnect}
          connectionMode={ConnectionMode.Strict}
          connectionLineType={ConnectionLineType.SimpleBezier} // ghost line type during drag
          connectionLineStyle={{ strokeWidth: 1.5 }} // ghost line style
          proOptions={{ hideAttribution: true }}
          colorMode={colorMode}
          snapToGrid={snap}
          snapGrid={[halfGrid, halfGrid]}
          nodeOrigin={[0, 0]}
          minZoom={0.1}
          maxZoom={4}
          onInit={(inst) => {
            rfRef.current = inst;
          }} // <- simplest pattern
          onDragOver={onDragOver}
          onDrop={onDrop}
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
        <ShapeLibrary onPick={(t) => addNodeAt(t)} />
      </BottomSheet>
    </Box>
  );
}
