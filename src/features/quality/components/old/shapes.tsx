import { ReactNode } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useTheme } from "@mui/material";
import { useDiagramConfig } from "../contexts/DiagramConfigContext";

export type BaseData = { label?: string };

function useNodeGeom() {
  const { grid: G = 24 } = useDiagramConfig();
  return { G, w: 8 * G, h: 4 * G, r: G / 12, strokeWidth: 1 };
}
function useNodeTheme() {
  const t = useTheme();
  return {
    fill: t.palette.primary.main,
    stroke: t.palette.secondary.main,
    text: t.palette.text.primary,
  };
}

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
  children: ReactNode;
  contentPadRight?: number;
}) {
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
        }}
      >
        <span>{label}</span>
      </div>

      {/* Standard 4 handles */}
      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}

/** 1) ACTION (arrow on right) */
export function ActionNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { w, h, r, strokeWidth } = useNodeGeom();
  const { fill, stroke } = useNodeTheme();
  const notch = w / 8; // = 1*G if w=8*G

  return (
    <BaseNode
      w={w}
      h={h}
      label={data?.label ?? "Action"}
      contentPadRight={notch * 0.35}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        <path
          d={`M 0 ${r}
             Q 0 0 ${r} 0
             H ${w - notch}
             L ${w} ${h / 2}
             L ${w - notch} ${h}
             H ${r}
             Q 0 ${h} 0 ${h - r}
             Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>
    </BaseNode>
  );
}

/** 2) PROCESS (rounded rectangle) */
export function ProcessNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { w, h, r, strokeWidth } = useNodeGeom();
  const { fill, stroke } = useNodeTheme();

  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Process"}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </BaseNode>
  );
}

/** 3) START / END (obround / capsule) */
export function TerminatorNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { w, h, strokeWidth } = useNodeGeom();
  const { fill, stroke } = useNodeTheme();
  const rx = Math.min(h / 2, w / 2);

  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Start/End"}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={rx}
          ry={rx}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </BaseNode>
  );
}

/** 4) DECISION (diamond) */
export function DecisionNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { w, h, strokeWidth } = useNodeGeom();
  const { fill, stroke } = useNodeTheme();

  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Decision"}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        <path
          d={`M ${w / 2} 0
             L ${w} ${h / 2}
             L ${w / 2} ${h}
             L 0 ${h / 2}
             Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>
    </BaseNode>
  );
}

/** 5) DOCUMENT (wavy bottom) */
export function DocumentNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { w, h, r, strokeWidth } = useNodeGeom();
  const { fill, stroke } = useNodeTheme();
  const wave = h * 0.12; // amplitude

  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Document"}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        <path
          d={`
            M 0 ${r}
            Q 0 0 ${r} 0
            H ${w - r}
            Q ${w} 0 ${w} ${r}
            V ${h - wave}
            C ${w * 0.75} ${h - wave * 2}, ${w * 0.25} ${h}, 0 ${h - wave}
            Z
          `}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      </svg>
    </BaseNode>
  );
}

/** 6) INPUT / OUTPUT (parallelogram) */
export function IONode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { w, h, strokeWidth } = useNodeGeom();
  const { fill, stroke } = useNodeTheme();
  const slant = w * 0.12;

  return (
    <BaseNode w={w} h={h} label={data?.label ?? "I/O"}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        <path
          d={`M ${slant} 0
             H ${w}
             L ${w - slant} ${h}
             H 0
             Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </BaseNode>
  );
}

/** 7) DATABASE (simple cylinder) */
export function DatabaseNode(props: NodeProps) {
  const data = props.data as BaseData | undefined;
  const { w, h, strokeWidth } = useNodeGeom();
  const { fill, stroke } = useNodeTheme();

  const rx = w * 0.25;
  const ry = Math.min(h * 0.12, rx);

  return (
    <BaseNode w={w} h={h} label={data?.label ?? "Database"}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }}
      >
        {/* Body with top & bottom ellipses implied */}
        <path
          d={`M 0 ${ry}
             C 0 ${-ry / 2}, ${w} ${-ry / 2}, ${w} ${ry}
             V ${h - ry}
             C ${w} ${h - ry / 2}, 0 ${h - ry / 2}, 0 ${h - ry}
             Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
        />
        {/* Top ellipse hint (stroke only) */}
        <path
          d={`M 0 ${ry} C 0 ${ry * 2}, ${w} ${ry * 2}, ${w} ${ry}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          opacity={0.4}
        />
      </svg>
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
