import { memo } from "react";
import { type MiniMapNodeProps, type Node, useReactFlow } from "@xyflow/react";
import { type ShapeNodeData } from "../shape/types";
import Shape from "../shape";
import { ShapeFlowNode } from "../shape-node";

// the custom minimap node is being used to render the shapes of the nodes in the minimap, too
function MiniMapNode({ id, width, height, x, y, selected }: MiniMapNodeProps) {
  const { getNode } = useReactFlow();

  // Grab the public node object; safer than internals across 12.x
  const n = getNode(id) as ShapeFlowNode | undefined;
  if (!n || n.type !== "shape") return null;

  const { type, color, stroke, strokeWidth } = n.data;
  if (!type || !color) return null;

  // Keep the minimap glyphs clean—very thin stroke; tiny bump when selected

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={
        selected
          ? "react-flow__minimap-node selected"
          : "react-flow__minimap-node"
      }
    >
      <Shape
        type={type}
        width={width}
        height={height}
        fill={color}
        stroke={stroke ?? "#111"}
        strokeWidth={selected ? 2 : 0}
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

export default memo(MiniMapNode);
