import { type RawShapeDef, type SvgProps } from "../rawShapes";

function ProcessSvg({ width, height, ...svgAttributes }: SvgProps) {
  return <rect x={0} y={0} width={width} height={height} {...svgAttributes} />;
}
const Process: RawShapeDef = {
  id: "process",
  meta: {
    label: "Process",
    description:
      "A set of interrelated or interacting activities that use inputs to deliver intended result or output.",
    defaultFill: "#9dc7f7",
  },
  Component: ProcessSvg,
};
export default Process;
