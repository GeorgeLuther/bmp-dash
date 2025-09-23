import { type RawShapeDef, type SvgProps } from "../rawShapes";
import { generatePath } from "../utils";

function ActionSvg({ width, height, ...svgAttributes }: SvgProps) {
  const skew = width * 0.3;

  const actionPath = generatePath([
    [0, 0],
    [width - skew, 0],
    [width, height / 2],
    [width - skew, height],
    [0, height],
  ]);

  return <path d={actionPath} {...svgAttributes} />;
}
const Action: RawShapeDef = {
  id: "action",
  meta: {
    label: "Action",
    description: "Operation, task, or step.",
    defaultFill: "#e0b357ff",

    // defaultStroke, defaultStrokeWidth optional; will derive/fallback if omitted
    //TODO: #3 variant? in the future we may refactor to support multiple variants of a shape
  },
  Component: ActionSvg,
};
export default Action;
