import { type ShapeDef, type ShapeProps } from "..";

function StartEndPath({ width, height, ...svgAttributes }: ShapeProps) {
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
const StartEnd: ShapeDef = {
  id: "start-end",
  meta: {
    label: "Start / End",
    description: "Mark the beginning or end of a process.",
    defaultColor: "#ffd071ff",
    aspectRatio: 14 / 10,
  },
  Component: StartEndPath,
};

export default StartEnd;
