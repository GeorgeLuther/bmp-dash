// src/features/quality/process-maps/components/shape-node/index.tsx
import { memo, useCallback } from "react";
import {
  Node,
  type NodeProps,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
} from "@xyflow/react";

import { getShapeById, type ShapeType } from "../shape/types";
import Shape from "../shape";

// keep this in one place; match the value you used in ProcessMaps (e.g. 24)
const GRID_PX = 24;

export type ShapeFlowNode = Node<
  {
    type: ShapeType;
    label?: string;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeWidth?: number;
    opacity?: number;
  },
  "shape"
>;

const handlePositions = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
];

function ShapeNode({ id, data, width, height }: NodeProps<ShapeFlowNode>) {
  const { updateNodeData } = useReactFlow();

  const meta = getShapeById(data.type)?.meta;
  const cols = meta?.gridAspect?.cols ?? 7;
  const rows = meta?.gridAspect?.rows ?? 5;
  const ratio = cols / rows;

  const W = typeof width === "number" ? width : cols * 24; // grid px if you’re using 24
  const H = typeof height === "number" ? height : Math.round(W / ratio);

  const fill = data.fill ?? meta?.defaultFill;
  const fillOpacity = data.fillOpacity ?? meta?.defaultOpacity ?? 1;
  const stroke = data.stroke ?? meta?.defaultStroke ?? "#111";
  const strokeOpacity = data.strokeOpacity ?? meta?.defaultStrokeOpacity ?? 1;
  const strokeWidth = data.strokeWidth ?? meta?.defaultStrokeWidth ?? 2;
  const opacity = data.opacity;

  const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateNodeData(id, { label: e.target.value });

  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <Shape
        type={data.type}
        width={W}
        height={H}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        opacity={opacity}
        // subtle, single shadow; tweak numbers to taste
        svgStyle={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.18))" }}
        vectorEffect="non-scaling-stroke"
        title={meta?.label ?? data.type}
      />

      <input
        type="text"
        placeholder={meta?.label ?? data.type}
        value={data.label ?? ""}
        onChange={onLabelChange}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: "80%",
          height: 24,
          border: "none",
          outline: "none",
          background: "transparent",
          textAlign: "center",
          pointerEvents: "auto",
          fontSize: 14,
          fontWeight: 600,
          color: "#111", // <— always black, per your ask
        }}
      />

      {[Position.Top, Position.Right, Position.Bottom, Position.Left].map(
        (p) => (
          <Handle
            key={p}
            id={p}
            type="source"
            position={p}
            style={{ backgroundColor: stroke }}
          />
        )
      )}
    </div>
  );
}

export default memo(ShapeNode);
