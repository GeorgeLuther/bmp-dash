import { type ShapeDef, type ShapeProps } from "..";
import { generatePath } from "../utils";

function InOutPath({ width, height, ...svgAttributes }: ShapeProps) {
  // this determines where to place the top-left and bottom-right points of the parallelogram
  const skew = width * 0.25;

  const inOutPath = generatePath([
    [0, height],
    [skew, 0],
    [width, 0],
    [width - skew, height],
  ]);

  return <path d={inOutPath} {...svgAttributes} />;
}
const InOut: ShapeDef = {
  id: "in-out",
  meta: {
    label: "In / Out",
    description:
      "An input (material, resource, requirement, etc) or output (product, service, decision, etc)",
    defaultColor: "#00a2aeff",
    aspectRatio: 14 / 10,
  },
  Component: InOutPath,
};
export default InOut;
