import { type ShapeDef, type ShapeProps } from "..";
import { generatePath } from "../utils";

function ActionPath({ width, height, ...svgAttributes }: ShapeProps) {
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
const Action: ShapeDef = {
  id: "action",
  meta: {
    label: "Action",
    description: "Operation, task, or step.",
    defaultColor: "#ffd071ff",
    aspectRatio: 14 / 10,
  },
  Component: ActionPath,
};
export default Action;
