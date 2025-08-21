import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useTheme } from "@mui/material";
import { useDiagramConfig } from "../../contexts/DiagramConfigContext";

type RectData = { label?: string };

export default function ProcessNode(props: NodeProps) {
  const data = props.data as RectData | undefined;
  const theme = useTheme();
  const { grid: G = 24 } = useDiagramConfig();

  const w = 8 * G; // 192 @ G=24
  const h = 4 * G; // 96  @ G=24
  const r = G / 12;
  const strokeWidth = 1;

  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }} // match ActionNode
      >
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={r}
          ry={r}
          fill={theme.palette.primary.main}
          stroke={theme.palette.secondary.main}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          shapeRendering="geometricPrecision"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
          color: theme.palette.text.primary,
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <span>{data?.label ?? "Step"}</span>
      </div>

      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}
