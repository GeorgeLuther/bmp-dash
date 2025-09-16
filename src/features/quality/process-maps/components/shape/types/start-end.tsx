import type { ShapeProps } from "./index";

export default function StartEnd({
  width,
  height,
  ...svgAttributes
}: ShapeProps) {
  const rx = Math.min(width / 2, height / 2); // full pill ends
  return (
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      rx={rx}
      {...svgAttributes}
    />
  );
}
