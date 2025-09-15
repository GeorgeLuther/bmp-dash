import { type DragEvent, useRef } from "react";

import Shape from "../shape";
import { type ShapeType } from "../shape/types";

import { getDefaultColor } from "../shape/types/utils";

type ShapeMenuItemProps = {
  type: ShapeType;
};

function ShapeMenuItem({ type }: ShapeMenuItemProps) {
  const dragImageRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer?.setData("application/reactflow", type);

    if (dragImageRef.current) {
      event.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }
  };

  return (
    <div className="shape-menu-item" draggable onDragStart={onDragStart}>
      <Shape
        type={type}
        fill="transparent"
        strokeWidth={1}
        width={28}
        height={28}
      />
      <div className="shape-menu-item-drag-image" ref={dragImageRef}>
        <Shape
          type={type}
          width={112}
          height={80}
          fill={getDefaultColor(type)}
          fillOpacity={0.7}
          stroke={getDefaultColor(type)}
          strokeWidth={2}
        />
      </div>
    </div>
  );
}

export default ShapeMenuItem;
