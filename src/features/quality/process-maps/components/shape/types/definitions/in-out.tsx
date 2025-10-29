import { type RawShapeDef, type SvgProps } from "../rawShapes";
import { generatePath } from "../utils";

function InOutSvg({ width, height, ...svgAttributes }: SvgProps) {
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
const InOut: RawShapeDef = {
  id: "in-out",
  meta: {
    label: "In / Out",
    description:
      "An input (material, resource, requirement, etc) or output (product, service, decision, etc)",
    defaultFill: "#00a2ae",
  },
  Component: InOutSvg,
};
export default InOut;
