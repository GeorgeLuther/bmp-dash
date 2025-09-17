import { useCallback } from "react";
import {
  Node,
  //NodeResizer,
  type NodeProps,
  Handle,
  Position,
  useKeyPress,
  useReactFlow,
} from "@xyflow/react";

import { ShapeNodeData } from "../shape/types";
import Shape from "../shape";
//import ShapeNodeToolbar from "../toolbar";

// This is the final, complete type for our custom node
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
}: NodeProps<ShapeNodeData>) {
  const { color, type } = data;
  const { updateNodeData } = useReactFlow();
  const shiftKeyPressed = useKeyPress("Shift");

  const onColorChange = useCallback(
    (color: string) => {
      updateNodeData(id, { color });
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
        type={type}
        width={width}
        height={height ?? 2}
        fill={color}
        strokeWidth={2}
        stroke={color}
        fillOpacity={0.8}
      />
      <input type="text" className="node-label" placeholder={type} />

      {handlePositions.map((position) => (
        <Handle
          id={position}
          style={{ backgroundColor: color }}
          type="source"
          position={position}
        />
      ))}
    </>
  );
}

export default ShapeNode;
