import * as React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useTheme } from "@mui/material";
import { useDiagramConfig } from "../../contexts/DiagramConfigContext";

type ActionData = { label?: string };

export default function ActionNode(props: NodeProps) {
  const { data: raw } = props;
  const data = raw as ActionData | undefined;

  const theme = useTheme();
  const { grid: G = 24 } = useDiagramConfig();

  // Geometry
  const w = 8 * G; // 192 @ G=24
  const h = 4 * G; // 96  @ G=24
  const r = G / 12; // corner radius
  const notch = 1 * G; // right-point notch depth
  const strokeWidth = 1;
  const strokeOffset = strokeWidth / 2;

  // Inner drawing box that keeps the whole stroke inside the SVG
  const innerW = w - strokeWidth;
  const innerH = h - strokeWidth;
  const x0 = strokeOffset;
  const y0 = strokeOffset;

  return (
    <div style={{ width: w, height: h, position: "relative", padding: 0 }}>
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ overflow: "visible" }} // let stroke extend
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
          fill={theme.palette.primary.main}
          stroke={theme.palette.secondary.main}
          strokeWidth={strokeWidth}
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
        <span>{data?.label ?? "Action"}</span>
      </div>

      <Handle type="target" position={Position.Top} id="t" />
      <Handle type="source" position={Position.Right} id="r" />
      <Handle type="source" position={Position.Bottom} id="b" />
      <Handle type="target" position={Position.Left} id="l" />
    </div>
  );
}
