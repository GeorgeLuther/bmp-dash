import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useTheme } from "@mui/material";
import { useDiagramConfig } from "../contexts/DiagramConfigContext";
import {
  ActionBody,
  ProcessBody,
  TerminatorBody,
  DecisionBody,
  DocumentBody,
  IOBody,
  DatabaseBody,
} from "./shapeBodies";
import { actionGeom, baseGeom } from "./shapeGeom";

export type BaseData = { label?: string };

function BaseNode({
  w,
  h,
  label,
  children,
  contentPadRight = 0,
}: {
  w: number;
  h: number;
  label: string;
  children: React.ReactNode;
  contentPadRight?: number;
}) {
  const theme = useTheme();
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
          fontSize: 14,
          fontWeight: 500,
          paddingRight: contentPadRight,
          color: "black",
        }}
      >
        <span>{label}</span>
      </div>
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}

// Action
export function ActionNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { grid: G = 24 } = useDiagramConfig();
  const { w, h, notch } = actionGeom(G);
  return (
    <BaseNode
      w={w}
      h={h}
      label={data?.label ?? "Action"}
      contentPadRight={notch * 0.35}
    >
      <ActionBody G={G} />
    </BaseNode>
  );
}

// Process
export function ProcessNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { grid: G = 24 } = useDiagramConfig();
  const { w, h } = baseGeom(G);
  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Process"}>
      <ProcessBody G={G} />
    </BaseNode>
  );
}

// Terminator
export function TerminatorNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { grid: G = 24 } = useDiagramConfig();
  const { w, h } = baseGeom(G);
  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Start/End"}>
      <TerminatorBody G={G} />
    </BaseNode>
  );
}

// Decision
export function DecisionNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { grid: G = 24 } = useDiagramConfig();
  const { w, h } = baseGeom(G);
  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Decision"}>
      <DecisionBody G={G} />
    </BaseNode>
  );
}

// Document
export function DocumentNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { grid: G = 24 } = useDiagramConfig();
  const { w, h } = baseGeom(G);
  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Document"}>
      <DocumentBody G={G} />
    </BaseNode>
  );
}

// I/O
export function IONode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { grid: G = 24 } = useDiagramConfig();
  const { w, h } = baseGeom(G);
  return (
    <BaseNode w={w} h={h} label={data?.label ?? "I/O"}>
      <IOBody G={G} />
    </BaseNode>
  );
}

// Database
export function DatabaseNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { grid: G = 24 } = useDiagramConfig();
  const { w, h } = baseGeom(G);
  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Database"}>
      <DatabaseBody G={G} />
    </BaseNode>
  );
}

export const NODE_TYPES = {
  action: ActionNode,
  process: ProcessNode,
  terminator: TerminatorNode,
  decision: DecisionNode,
  document: DocumentNode,
  io: IONode,
  database: DatabaseNode,
} as const;
