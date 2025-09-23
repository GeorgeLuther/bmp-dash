// src/features/quality/process-maps/components/minimap-node.tsx
import { memo } from "react";
import { type MiniMapNodeProps, useInternalNode } from "@xyflow/react";
import { getShapeById } from "../shape/types";

/**
 * Draw the real shape in the minimap.
 * - Pulls node data via useInternalNode(id) like the pro example
 * - Uses node.data.fill if present; otherwise registry defaults
 * - Slightly thicker stroke when selected
 */
function MiniMapNode({ id, x, y, width, height, selected }: MiniMapNodeProps) {
  const internal = useInternalNode(id);
  if (!internal) return null;

  // your node data shape
  const nodeData = (internal.internals.userNode?.data ?? {}) as {
    type?: string;
    fill?: string;
  };

  const def = nodeData.type ? getShapeById(nodeData.type) : null;
  if (!def?.Component) return null;

  const fill = nodeData.fill ?? def.meta.defaultFill;
  const sw = Math.max(1, selected ? 2 : (def.meta.defaultStrokeWidth ?? 1));

  const ShapeComponent = def.Component;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ShapeComponent
        width={width}
        height={height}
        fill={fill}
        fillOpacity={0.9}
        strokeOpacity={1}
        strokeWidth={sw}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

export default memo(MiniMapNode);
