import { type ShapeDef, type ShapeProps } from "..";

function ProcessPath({ width, height, ...svgAttributes }: ShapeProps) {
  return <rect x={0} y={0} width={width} height={height} {...svgAttributes} />;
}
const Process: ShapeDef = {
  id: "process",
  meta: {
    label: "Process",
    description:
      "A set of interrelated or interacting activities that use inputs to deliver intended result or output.",
    defaultColor: "#9dc7f7ff",
    aspectRatio: 14 / 10,
  },
  Component: ProcessPath,
};
export default Process;
