import { memo, useCallback } from "react";
import {
  Node,
  //NodeResizer,
  type NodeProps,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
} from "@xyflow/react";

import { type ShapeNodeData, getShapeById } from "../shape/types";
import Shape from "../shape";
//import ShapeNodeToolbar from "../toolbar";

// Complete type for custom node
export type ShapeFlowNode = Node<ShapeNodeData, "shape">;

const handlePositions = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
];

function ShapeNode({
  id,
  selected,
  data,
  width,
  height,
}: NodeProps<ShapeFlowNode>) {
  const { updateNodeData } = useReactFlow();
  const shiftKeyPressed = useKeyPress("Shift");

  const meta = getShapeById(data.type)?.meta;
  const aspect = meta?.aspectRatio ?? 2;
  const DEFAULT_W = 144;
  const W = width ?? data.w ?? DEFAULT_W; // prefer RF-provided width
  const H = height ?? data.h ?? Math.round(W / aspect);

  const onLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { label: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <>
      {/* <ShapeNodeToolbar onColorChange={onColorChange} activeColor={color} />
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
      /> */}
      <Shape
        type={data.type}
        width={W}
        height={H}
        fill={data.color}
        stroke={data.stroke ?? "#111"}
        strokeWidth={data.strokeWidth ?? 2}
        fillOpacity={0.85}
        vectorEffect="non-scaling-stroke"
        title={meta?.label ?? data.type}
      />
      <input
        type="text"
        className="node-label"
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
          fontSize: 12,
          fontWeight: 500,
        }}
      />

      {handlePositions.map((position) => (
        <Handle
          key={position}
          id={position}
          type="source"
          position={position}
          style={{ backgroundColor: data.color }}
        />
      ))}
    </>
  );
}

export default ShapeNode;
